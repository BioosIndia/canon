import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, History, Shield, FileText, Check, Plus, RefreshCw } from 'lucide-react';

interface WorkflowHighlightProps {
  onExploreProvenance: () => void;
}

export const WorkflowHighlight: React.FC<WorkflowHighlightProps> = ({ onExploreProvenance }) => {
  const [stages, setStages] = useState([
    { id: 1, name: 'Stage 1: Authoritative Intake & Hash', status: 'LOCKED', subtitle: 'FDA SPL / EMA ePI ingested with SHA-256 seal' },
    { id: 2, name: 'Stage 2: Deterministic Myers Diff', status: 'VERIFIED', subtitle: 'Word-level insertions & deletions with exact line coordinates' },
    { id: 3, name: 'Stage 3: Bounded Semantic Candidate', status: 'PROPOSED', subtitle: 'Gemini 3.1 Pro proposes clinical meaning change & uncertainties' },
    { id: 4, name: 'Stage 4: Named Human Review Gate', status: 'APPROVED', subtitle: 'Dr. Marcus Dubois, MD certifies rationale & digital signature' },
    { id: 5, name: 'Stage 5: Affiliate Implementation & Export', status: 'ACTIVE', subtitle: 'eCTD proof uploaded, GxP watermarked audit package generated' }
  ]);

  const [activeStage, setActiveStage] = useState(3);

  return (
    <section id="workflow" className="py-20 bg-white text-slate-900 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Warm Yellow Highlight Container (Exact styling from Reference Image) */}
        <div className="bg-gradient-to-br from-[#FBBF24] via-[#F59E0B] to-[#D97706] rounded-3xl p-8 sm:p-12 lg:p-16 text-slate-950 shadow-2xl relative overflow-hidden">
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/15 text-slate-950 text-xs font-bold">
                <History className="w-3.5 h-3.5" />
                Lineage Provenance & Controlled Export
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
                Actionable Lineage & Comprehensive Regulatory Audit
              </h2>

              <p className="text-sm sm:text-base text-slate-900/90 leading-relaxed font-medium">
                Reconstruct any label state at any point in history with exact parser versions,
                model identity, prompts, named reviewer signatures, and verified submission proofs.
                Zero unverified claims.
              </p>

              <div className="pt-2">
                <button
                  onClick={onExploreProvenance}
                  className="px-8 py-3.5 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Explore Historical Replay
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Interactive Stages Pipeline Card (Matches Reference Image Card) */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200/60 text-slate-900">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-base font-extrabold text-slate-900">
                      Label Lifecycle Pipeline
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    GxP Reconstructable
                  </span>
                </div>

                {/* Stage Steps */}
                <div className="mt-5 space-y-2.5">
                  {stages.map((stg) => (
                    <div
                      key={stg.id}
                      onClick={() => setActiveStage(stg.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        activeStage === stg.id
                          ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                            activeStage === stg.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {stg.id}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-snug">{stg.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{stg.subtitle}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          stg.status === 'LOCKED'
                            ? 'bg-purple-100 text-purple-800'
                            : stg.status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : stg.status === 'PROPOSED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {stg.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Automation & Certification footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    21 CFR Part 11 Audit Integrity
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Hash: 38b901a89c25...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
