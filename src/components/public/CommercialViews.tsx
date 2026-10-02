import React from 'react';
import { Check, ShieldCheck, ArrowRight, X, Building, Zap, Lock } from 'lucide-react';

interface CommercialModalProps {
  view: 'pricing' | 'governance' | 'solutions' | null;
  onClose: () => void;
  onLaunchApp: () => void;
}

export const CommercialViews: React.FC<CommercialModalProps> = ({ view, onClose, onLaunchApp }) => {
  if (!view) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 relative my-8 text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {view === 'pricing' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Enterprise Commercial Tiers
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Predictable GxP-Validated SaaS Plans
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Zero fake metrics. Dedicated tenant isolation, signed provenance chains, and multi-market
                propagation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Plan 1 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Affiliate Tier</span>
                <div className="text-2xl font-extrabold text-slate-900">Core Affiliate</div>
                <p className="text-xs text-slate-600">For regional RA affiliates tracking up to 5 markets.</p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Deterministic Exact Diff</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 5 Affiliate Implementation Queues</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> SPL / ePI QR Verifier</li>
                </ul>
              </div>

              {/* Plan 2: Popular */}
              <div className="p-6 rounded-2xl border-2 border-emerald-600 bg-emerald-50/40 space-y-4 shadow-lg relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase">
                  Enterprise Standard
                </span>
                <span className="text-xs font-bold text-emerald-800 uppercase">Global Pharma</span>
                <div className="text-2xl font-extrabold text-slate-900">Global Core OS</div>
                <p className="text-xs text-slate-600">Global labeling leads, cross-market harmonization, and full provenance.</p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Unlimited Global Markets</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Gemini 3.1 Pro Semantic Gate</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 21 CFR Part 11 Audit Trail</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Time-Travel Provenance Replay</li>
                </ul>
              </div>

              {/* Plan 3 */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Custom GxP</span>
                <div className="text-2xl font-extrabold text-slate-900">Validated Dedicated</div>
                <p className="text-xs text-slate-600">Private VPC deployment with IQ/OQ/PQ validation accelerator packs.</p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Dedicated Private Cloud</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Custom RIM / EDMS Connectors</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 24/7 Regulatory SLA</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4">
              <button
                onClick={onLaunchApp}
                className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                Launch CANON OS Trial <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {view === 'governance' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Regulatory Constitution
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                The CANON Human-In-The-Loop Boundary
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 leading-relaxed space-y-3 font-medium">
              <p>
                <strong className="block text-amber-900 text-sm mb-1">
                  1. Deterministic Evidence Comes First
                </strong>
                Every textual difference is generated using strict algorithmic Myers diffing. The system
                never hallucinates or rephrases source text during exact comparison.
              </p>
              <p>
                <strong className="block text-amber-900 text-sm mb-1">
                  2. AI Proposes; Qualified Humans Decide
                </strong>
                The AI engine acts exclusively in an assistive capacity to propose candidate meaning-change
                classifications and uncertainty flags. It never approves labels or submits dossiers.
              </p>
              <p>
                <strong className="block text-amber-900 text-sm mb-1">
                  3. Cryptographic Signature Accountability
                </strong>
                Decisions must be signed by named qualified individuals (Global RA Lead, Medical Safety
                Officer, or Affiliate Head) with mandatory scientific rationale and SHA-256 digital seals.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold"
              >
                Understood & Close
              </button>
            </div>
          </div>
        )}

        {view === 'solutions' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Cross-Functional Solutions
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Tailored for Every Pharmaceutical Labeling Discipline
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Global Labeling Leads</h4>
                <p>Maintain Core CCDS authority and track multi-market rollout without spreadsheet chaos.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Affiliate RA Managers</h4>
                <p>Receive pre-parsed difference packets and attach verified submission proofs for closing.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Safety & Medical Reviewers</h4>
                <p>Inspect clinical meaning changes with calibrated uncertainty bounds and trial references.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-sm mb-1">RegOps & Digital Labeling</h4>
                <p>Validate physical 2D DataMatrix packaging barcodes against approved ePI destinations.</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onLaunchApp}
                className="px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold"
              >
                Experience Live OS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
