import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lock,
  FileText,
  UserCheck,
  ChevronRight,
  XCircle,
  HelpCircle,
  History
} from 'lucide-react';
import { MOCK_REVIEWS, CURRENT_USER } from '../../data/mockData';
import { HumanReviewRecord, ReviewDecisionType, UserRole } from '../../types/canon';
import { calculateSha256 } from '../../utils/diffEngine';
import { Sparkles } from 'lucide-react';

interface HumanReviewQueueProps {
  onOpenAiSummarizer?: (title: string, text: string) => void;
}

export const HumanReviewQueue: React.FC<HumanReviewQueueProps> = ({ onOpenAiSummarizer }) => {
  const [reviews, setReviews] = useState<HumanReviewRecord[]>(MOCK_REVIEWS);
  const [selectedReview, setSelectedReview] = useState<HumanReviewRecord>(MOCK_REVIEWS[0]);

  // Decision Modal State
  const [decisionType, setDecisionType] = useState<ReviewDecisionType>('APPROVE_CANDIDATE');
  const [reasonText, setReasonText] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitDecision = async () => {
    if (!reasonText.trim()) {
      alert('Mandatory reviewer rationale is required for GxP Part 11 compliance.');
      return;
    }

    setIsSubmitting(true);
    const signaturePayload = `${CURRENT_USER.id}:${decisionType}:${Date.now()}:${reasonText}`;
    const sigHash = await calculateSha256(signaturePayload);

    const newDecision = {
      decisionType,
      decidedBy: CURRENT_USER.name,
      decidedRole: CURRENT_USER.role,
      timestamp: new Date().toISOString(),
      reasonText,
      evidenceNotes: evidenceNotes.trim() ? evidenceNotes : undefined,
      digitalSignatureSha256: sigHash,
    };

    const newStatus =
      decisionType === 'APPROVE_CANDIDATE'
        ? 'APPROVED'
        : decisionType === 'REJECT'
        ? 'REJECTED'
        : decisionType === 'REQUEST_EVIDENCE'
        ? 'EVIDENCE_REQUESTED'
        : 'REVISED';

    const updated = reviews.map((r) => {
      if (r.id === selectedReview.id) {
        return {
          ...r,
          status: newStatus as any,
          decisions: [newDecision, ...r.decisions],
        };
      }
      return r;
    });

    setReviews(updated);
    setSelectedReview({
      ...selectedReview,
      status: newStatus as any,
      decisions: [newDecision, ...selectedReview.decisions],
    });

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setReasonText('');
    setEvidenceNotes('');
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Qualified Human Governance & Authority Gate
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Named Human Label Review & Sign-Off Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic evidence first. Qualified reviewers evaluate AI candidates and execute legally
            binding GxP determinations.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
            SV
          </div>
          <div>
            <span className="font-bold text-slate-800 block leading-tight">{CURRENT_USER.name}</span>
            <span className="text-[10px] text-slate-500">{CURRENT_USER.role}</span>
          </div>
        </div>
      </div>

      {/* Review Queue & Decision Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Review Queue Cards */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Review Queue Items ({reviews.length})
          </h3>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                onClick={() => setSelectedReview(rev)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedReview.id === rev.id
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-1 ring-emerald-600/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      rev.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rev.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {rev.status}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Deadline: {rev.reviewDeadline}
                  </span>
                </div>

                <h4 className="mt-2 text-sm font-bold text-slate-900">{rev.reviewTitle}</h4>
                <p className="mt-1 text-xs text-slate-600">
                  {rev.productName} • Section {rev.sectionCode}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Assigned: {rev.assignedTo}</span>
                  <span className="font-semibold text-emerald-700">{rev.decisions.length} Decisions Logged</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (7 Cols): Decision Studio */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Active Evaluation Candidate
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedReview.reviewTitle}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded bg-slate-100 font-bold text-slate-800">
                  {selectedReview.productName}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 font-medium">
                  {selectedReview.market}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-purple-50 text-purple-800 font-medium">
                  Class: {selectedReview.candidateClass}
                </span>
              </div>
            </div>

            {onOpenAiSummarizer && (
              <button
                onClick={() =>
                  onOpenAiSummarizer(
                    `${selectedReview.productName} §${selectedReview.sectionCode} Review`,
                    `Candidate Class: ${selectedReview.candidateClass}\nStatus: ${selectedReview.status}\nAssigned: ${selectedReview.assignedTo}\nReview Deadline: ${selectedReview.reviewDeadline}\n\nCandidate Details:\n${selectedReview.reviewTitle} for market ${selectedReview.market}.`
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Discuss with AI Assistant
              </button>
            )}
          </div>

          {/* Form Action Buttons */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Select Binding Determination:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'APPROVE_CANDIDATE', label: 'Approve Candidate', desc: 'Accept wording as proposed' },
                { id: 'REVISE_WORDING', label: 'Revise Wording', desc: 'Modify clinical text' },
                { id: 'REQUEST_EVIDENCE', label: 'Request Evidence', desc: 'Halt until proof attached' },
                { id: 'LOCAL_EXCEPTION', label: 'Local Exception', desc: 'Permit regional deviation' },
                { id: 'REJECT', label: 'Reject Proposal', desc: 'Discard change candidate' },
                { id: 'ESCALATE', label: 'Escalate to Board', desc: 'Refer to Safety Committee' },
              ].map((btn) => (
                <div
                  key={btn.id}
                  onClick={() => setDecisionType(btn.id as ReviewDecisionType)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    decisionType === btn.id
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-600/30'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{btn.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{btn.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rationale Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Mandatory Reviewer Rationale (21 CFR Part 11 Audit-Bound):
            </label>
            <textarea
              rows={3}
              placeholder="State the scientific, regulatory, or clinical justification for this determination..."
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          {/* Optional Evidence Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Supporting Evidence Citations (Optional Trial Protocol / Guideline Ref):
            </label>
            <input
              type="text"
              placeholder="e.g. KEYNOTE-006 Clinical Study Report Section 12.3, CHMP Assessment Report EMEA/H/C/..."
              value={evidenceNotes}
              onChange={(e) => setEvidenceNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-[11px] text-slate-500 font-mono">
              Signing Authority: <span className="font-bold text-slate-800">{CURRENT_USER.name}</span>
            </div>

            <button
              onClick={handleSubmitDecision}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              {isSubmitting ? 'Hashing & Committing...' : 'Apply Cryptographic Sign-Off'}
            </button>
          </div>

          {submitSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Determination recorded, signed with SHA-256 seal, and logged to tamper-evident audit trail!
            </div>
          )}

          {/* Past Decisions History */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Decision Audit History ({selectedReview.decisions.length})
            </h4>

            <div className="space-y-2">
              {selectedReview.decisions.map((dec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {dec.decisionType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{dec.timestamp}</span>
                  </div>
                  <p className="text-slate-700">{dec.reasonText}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">
                    Seal: {dec.digitalSignatureSha256}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
