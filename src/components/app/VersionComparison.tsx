import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  Sparkles,
  ShieldCheck,
  FileText,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Copy,
  Lock,
  ChevronDown,
  RefreshCw,
  Info
} from 'lucide-react';
import { MOCK_LABEL_VERSIONS, MOCK_SEMANTIC_CANDIDATE } from '../../data/mockData';
import { computeExactWordDiff } from '../../utils/diffEngine';
import { analyzeLabelSemanticDiff, SemanticAnalysisResult } from '../../utils/geminiClient';
import { DiffChunk } from '../../types/canon';

interface VersionComparisonProps {
  onRouteToReview: (candidateId: string) => void;
}

export const VersionComparison: React.FC<VersionComparisonProps> = ({ onRouteToReview }) => {
  const versionOld = MOCK_LABEL_VERSIONS[0]; // US PI v14.2
  const versionNew = MOCK_LABEL_VERSIONS[1]; // US PI v15.0

  const [selectedSectionCode, setSelectedSectionCode] = useState('4.4');
  const [modelChoice, setModelChoice] = useState<'gemini-3.1-flash-lite' | 'gemini-3.8-flash'>(
    'gemini-3.1-flash-lite'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<SemanticAnalysisResult>({
    proposedClass: MOCK_SEMANTIC_CANDIDATE.proposedClass,
    rationale: MOCK_SEMANTIC_CANDIDATE.rationale,
    confidenceScore: MOCK_SEMANTIC_CANDIDATE.confidenceScore,
    uncertaintyFlags: MOCK_SEMANTIC_CANDIDATE.uncertaintyFlags,
    missingEvidenceNotes: MOCK_SEMANTIC_CANDIDATE.missingEvidenceNotes,
    modelUsed: 'gemini-3.1-pro-preview / flash-lite gateway',
  });

  const [copiedHash, setCopiedHash] = useState(false);

  // Find matching sections
  const oldSec = versionOld.sections.find((s) => s.sectionCode === selectedSectionCode) || versionOld.sections[0];
  const newSec = versionNew.sections.find((s) => s.sectionCode === selectedSectionCode) || versionNew.sections[0];

  // Compute exact diff deterministically
  const diffChunks = useMemo(() => {
    return computeExactWordDiff(oldSec.content, newSec.content, selectedSectionCode, oldSec.canonicalConcept);
  }, [oldSec, newSec, selectedSectionCode]);

  const additionsCount = diffChunks.filter((c) => c.type === 'INSERTION').length;
  const deletionsCount = diffChunks.filter((c) => c.type === 'DELETION').length;

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeLabelSemanticDiff(
        oldSec.headingText,
        oldSec.content,
        newSec.content,
        modelChoice
      );
      setAiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(versionNew.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Comparison Context */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <GitCompare className="w-3.5 h-3.5" />
            Triple-Pane Evidence & Comparison Engine
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Flagship Version Comparison & Evidence Packet
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Keytruda (pembrolizumab) • Comparing US PI v14.2 (Predecessor) ↔ US PI v15.0 (Authorized Candidate)
          </p>
        </div>

        {/* Section Selector & Model Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Section:</span>
            <select
              value={selectedSectionCode}
              onChange={(e) => setSelectedSectionCode(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="4.4">5 WARNINGS & PRECAUTIONS (§4.4)</option>
              <option value="4.3">4 CONTRAINDICATIONS (§4.3)</option>
              <option value="4.1">1 INDICATIONS & USAGE (§4.1)</option>
            </select>
          </div>

          <button
            onClick={() => onRouteToReview('cand-keytruda-01')}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Route to Human Review <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Triple Coordinated Views Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* VIEW A: Exact Myers Word Diff (5 Cols) */}
        <div className="xl:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Panel A: Deterministic Exact Word Diff
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                +{additionsCount} added
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                -{deletionsCount} deleted
              </span>
            </div>
          </div>

          {/* Diff Content View */}
          <div className="p-6 flex-1 overflow-y-auto max-h-[580px] font-sans text-xs leading-relaxed space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-mono text-[11px]">
              <div>Heading: {oldSec.headingText}</div>
              <div>Source Coordinates: US PI Line {oldSec.sourceCoordinates.lineNumber}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 leading-relaxed text-slate-800 text-[13px]">
              {diffChunks.map((chunk) => {
                if (chunk.type === 'INSERTION') {
                  return (
                    <span
                      key={chunk.id}
                      className="bg-emerald-100 text-emerald-900 font-bold px-1 py-0.5 rounded border border-emerald-300 mx-0.5 inline-block"
                      title={`Inserted line ${chunk.newLineNumber}`}
                    >
                      {chunk.text}
                    </span>
                  );
                }
                if (chunk.type === 'DELETION') {
                  return (
                    <span
                      key={chunk.id}
                      className="bg-rose-100 text-rose-900 line-through px-1 py-0.5 rounded border border-rose-300 mx-0.5 inline-block"
                      title={`Deleted from line ${chunk.oldLineNumber}`}
                    >
                      {chunk.text}
                    </span>
                  );
                }
                return <span key={chunk.id}>{chunk.text}</span>;
              })}
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Zero generative hallucination guarantee: This panel is computed exclusively via
                deterministic token alignment algorithms. Original wording is preserved verbatim.
              </span>
            </div>
          </div>
        </div>

        {/* VIEW B: Bounded Semantic Candidate (4 Cols) */}
        <div className="xl:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Panel B: Bounded Semantic Candidate
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={modelChoice}
                onChange={(e: any) => setModelChoice(e.target.value)}
                className="text-[10px] font-bold px-2 py-1 rounded bg-white border border-slate-200 text-slate-700"
              >
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
                <option value="gemini-3.8-flash">gemini-3.8-flash (General)</option>
              </select>
              <button
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="p-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer"
                title="Re-run Gemini analysis"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto max-h-[580px] space-y-4">
            {/* Candidate Badge */}
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  Proposed Classification
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-purple-200 text-purple-900">
                  {(aiResult.confidenceScore * 100).toFixed(1)}% Confidence
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-purple-950">
                {aiResult.proposedClass.replace(/_/g, ' ')}
              </h4>
              <p className="text-xs text-purple-900/90 leading-relaxed font-medium">
                {aiResult.rationale}
              </p>
            </div>

            {/* Regulatory Notice */}
            <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600 font-medium">
              <span className="font-bold text-slate-800 block mb-0.5">Status: CANDIDATE ONLY</span>
              This evaluation is an automated assistive candidate proposal. It does not constitute legal
              or regulatory approval. A qualified reviewer must review and sign off.
            </div>

            {/* Uncertainty Flags */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Uncertainty & Clinical Boundaries:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {aiResult.uncertaintyFlags.map((flag, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Evidence Notes */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800">Missing Evidence Citations:</span>
              <ul className="space-y-1 text-xs text-slate-600">
                {aiResult.missingEvidenceNotes.map((note, idx) => (
                  <li key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100">
              Evaluator: {aiResult.modelUsed}
            </div>
          </div>
        </div>

        {/* VIEW C: Evidence-Linked Change Packet & Metadata (3 Cols) */}
        <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Panel C: Evidence Packet
              </h3>
            </div>
          </div>

          <div className="p-5 flex-1 overflow-y-auto max-h-[580px] space-y-4 text-xs">
            {/* Hash & Coordinates Card */}
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Candidate Version Hash
                </span>
                <div className="mt-1 flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[10px]">
                  <span className="truncate text-slate-700">{versionNew.sha256Hash}</span>
                  <button
                    onClick={handleCopyHash}
                    className="p-1 hover:text-emerald-600 text-slate-400 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                {copiedHash && (
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                    Hash copied to clipboard!
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Original Source Coordinates
                </span>
                <p className="mt-1 font-mono text-[11px] text-slate-800 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  Page {newSec.sourceCoordinates.pageNumber}, Line {newSec.sourceCoordinates.lineNumber}
                  <br />
                  <span className="text-slate-500">Ref: US FDA DailyMed SPL</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Lineage Predecessor
                </span>
                <p className="mt-1 text-slate-700 font-medium">
                  Linked to {versionOld.versionNumber} ({versionOld.authority})
                </p>
              </div>
            </div>

            {/* Human Gate Status */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Human Review Status
              </span>
              <p className="text-xs font-bold text-slate-900">PENDING_REVIEW</p>
              <p className="text-[11px] text-slate-600">
                Assigned to Dr. Marcus Dubois, MD (Safety Lead)
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => onRouteToReview('cand-keytruda-01')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                Open Review Gate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
