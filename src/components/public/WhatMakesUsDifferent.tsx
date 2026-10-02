import React from 'react';
import { GitCompare, Globe2, ShieldCheck, Check, ArrowRight, UserCheck, FileText, CheckCircle2 } from 'lucide-react';

interface WhatMakesUsDifferentProps {
  onExploreFeature: (featureKey: string) => void;
}

export const WhatMakesUsDifferent: React.FC<WhatMakesUsDifferentProps> = ({ onExploreFeature }) => {
  return (
    <section id="features" className="py-20 bg-white text-slate-900 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Why Choose CANON
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              What makes us different
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-600 leading-relaxed">
            Preserve exact source evidence, eliminate silent drift across global affiliates, and keep
            named human experts in absolute regulatory command.
          </p>
        </div>

        {/* 3 Pastel Cards (Exact layout from Reference Image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Pale Mint */}
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-3xl p-7 flex flex-col justify-between shadow-xs hover:shadow-lg transition-shadow">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 mb-5">
                <GitCompare className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Evidence-Preserving Comparison
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Deterministic token and word differences paired with exact source line coordinates,
                original text preservation, and cryptographic SHA-256 seals.
              </p>
            </div>

            {/* Inner Interactive Widget */}
            <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">Section 4.4 Warnings</span>
                  <p className="text-[10px] text-slate-500">US PI v14.2 ↔ v15.0</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-700">98.4%</span>
                  <p className="text-[9px] text-slate-400 uppercase font-semibold">Parity</p>
                </div>
              </div>

              {/* Exact Diff Snippet */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-mono leading-relaxed">
                <span className="line-through text-rose-600 bg-rose-50 px-1 py-0.5 rounded">
                  Monitor patients closely
                </span>{' '}
                <span className="font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                  Monitor hepatic transaminases and bilirubin prior to each infusion
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[9px] text-slate-700">
                  SPL Line 147 : Col 8
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Exact Diff
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Pale Lavender */}
          <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-3xl p-7 flex flex-col justify-between shadow-xs hover:shadow-lg transition-shadow">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20 mb-5">
                <Globe2 className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Global-to-Local Intelligence
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Connect core global CCDS concepts with 50+ local affiliate labels, instantly surfacing
                stale versions, translation drift, and unknown requirements.
              </p>
            </div>

            {/* Inner Interactive Widget */}
            <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Affiliate Synchronization</span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  8 Markets Active
                </span>
              </div>

              {/* Connecting Avatars like reference image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-purple-50/60 border border-purple-100">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&q=80"
                      alt="EU Lead"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">EU Affiliate (EMA)</p>
                      <p className="text-[9px] text-slate-500">Dr. Elena Rostova</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    STALE (14d lag)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=80&q=80"
                      alt="JP Lead"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">Japan (PMDA)</p>
                      <p className="text-[9px] text-slate-500">Dr. Kenji Sato</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    ALIGNED
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 text-center font-medium">
                Automatic drift alerts routed to named affiliate leads
              </p>
            </div>
          </div>

          {/* Card 3: Pale Peach */}
          <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-3xl p-7 flex flex-col justify-between shadow-xs hover:shadow-lg transition-shadow">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-600/20 mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Human-Governed Lifecycle
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                AI proposes candidate classifications with calibrated uncertainty; qualified regulatory
                specialists make the binding legal and clinical determinations.
              </p>
            </div>

            {/* Inner Interactive Widget */}
            <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Qualified Reviewers</span>
                <span className="text-base font-extrabold text-amber-700">94%</span>
              </div>

              {/* Avatar stack matching reference */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  <img
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                    alt="User"
                  />
                  <img
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                    alt="User"
                  />
                  <img
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                    alt="User"
                  />
                </div>
                <span className="text-[11px] text-slate-600 font-medium">Named sign-offs active</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-center">
                <div className="p-1.5 rounded-lg bg-slate-50">
                  <span className="block text-xs font-bold text-slate-900">18 Done</span>
                  <span className="text-[9px] text-slate-500 uppercase">This Cycle</span>
                </div>
                <div className="p-1.5 rounded-lg bg-amber-50">
                  <span className="block text-xs font-bold text-amber-800">3 Gaps</span>
                  <span className="text-[9px] text-amber-700 uppercase">In Review</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-amber-900 bg-amber-100/60 py-1 rounded-md">
                <ShieldCheck className="w-3 h-3 text-amber-700" />
                Zero Autonomous Submissions
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
