import React from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  GitCompare,
  Globe,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import {
  MOCK_PRODUCTS,
  MOCK_REVIEWS,
  MOCK_CROSS_MARKET,
  MOCK_TASKS,
  MOCK_SIGNALS
} from '../../data/mockData';

interface CommandCenterProps {
  onNavigate: (view: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onNavigate }) => {
  const pendingReviews = MOCK_REVIEWS.filter((r) => r.status === 'PENDING');
  const staleAffiliates = MOCK_CROSS_MARKET.filter((cm) => cm.status === 'STALE');
  const pendingTasks = MOCK_TASKS.filter((t) => t.status !== 'CLOSED');

  return (
    <div className="space-y-6">
      {/* Top Banner / Operational Status */}
      <div className="bg-gradient-to-r from-[#0B3B2C] to-[#062016] text-white p-6 sm:p-8 rounded-3xl shadow-md border border-emerald-950 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-[#D8F34E] animate-pulse" />
            Active Lifecycle Session
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Enterprise Command Center
          </h1>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">
            Live operational telemetry across authoritative label versions, active human review
            queues, affiliate implementation deadlines, and evidence integrity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('compare')}
            className="px-5 py-2.5 rounded-full bg-[#D8F34E] hover:bg-[#c9e63a] text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <GitCompare className="w-4 h-4" />
            Launch Version Diff
          </button>
          <button
            onClick={() => onNavigate('reviews')}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            Review Queue ({pendingReviews.length})
          </button>
        </div>
      </div>

      {/* 4 Critical Operational Metrics (Not vanity analytics, true operational state) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigate('reviews')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Needs My Review
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{pendingReviews.length}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 line-clamp-1">
            Section 4.4 Hepatic Protocol awaiting medical sign-off
          </p>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigate('cross-market')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stale Affiliate Drift
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{staleAffiliates.length}</span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              Markets Lagging
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 line-clamp-1">
            EU SmPC (14d lag), TGA Australia pending round 2
          </p>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigate('tasks')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Implementation Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{pendingTasks.length}</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Active Due
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 line-clamp-1">
            1 requires proof verification to advance to closed
          </p>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigate('signals')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Regulatory Triggers
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{MOCK_SIGNALS.length}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              PRAC / FDA
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 line-clamp-1">
            1 converted to active change candidate #41
          </p>
        </div>
      </div>

      {/* Main Grid: Needs Immediate Action + Live Pipeline State */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Reviews & High-Priority Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Reviews Table Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Active Human Review Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Named human decision required before affiliate propagation.
                </p>
              </div>
              <button
                onClick={() => onNavigate('reviews')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  onClick={() => onNavigate('reviews')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {rev.candidateClass.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{rev.productName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">§{rev.sectionCode}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{rev.reviewTitle}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>Assigned: {rev.assignedTo}</span>
                      <span>•</span>
                      <span>Due: {rev.reviewDeadline}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('reviews')}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shrink-0 cursor-pointer"
                  >
                    Open Review
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stale Affiliates Alert Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Cross-Market Drift Monitoring
                </h3>
                <p className="text-xs text-slate-500">
                  Affiliate versions deviating from Core CCDS Rev 15.0
                </p>
              </div>
              <button
                onClick={() => onNavigate('cross-market')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                Matrix View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {staleAffiliates.map((aff) => (
                <div key={aff.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{aff.market}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                        {aff.localVersion}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{aff.differencesSummary}</p>
                    <p className="text-[11px] text-amber-700 mt-0.5 font-medium">
                      Reason: {aff.deviationReason || 'Pending Type II submission'}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    Lead: {aff.affiliateLead}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): System Integrity & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Comparison Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Deterministic Diff Engine</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Compare US PI v14.2 against v15.0 with exact token differences and Gemini candidate
              reasoning.
            </p>
            <button
              onClick={() => onNavigate('compare')}
              className="mt-4 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              Open Flagship Diff
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SPL / 2D DataMatrix Link Checker */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Digital-Link Endpoint Health
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Physical package 2D barcodes vs. approved ePI endpoints
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-emerald-900">Keytruda EU 100mg/4mL</p>
                  <p className="text-[10px] text-emerald-700">EMA ePI Target: SmPC v9.1</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                  ACTIVE
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-amber-900">Ozempic 1mg Pen</p>
                  <p className="text-[10px] text-amber-700">Target v8.0 (Superseded by v8.1)</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                  REPRINT
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('structured')}
              className="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Open QR / ePI Checker
            </button>
          </div>

          {/* Cryptographic Lineage Seal */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              GxP Part 11 Tamper-Evident
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every section diff, AI candidate generation, reviewer vote, and affiliate proof carries an
              immutable SHA-256 seal.
            </p>
            <div className="mt-3 p-2 rounded-lg bg-black/40 font-mono text-[10px] text-emerald-300 truncate">
              Hash: 38b901a89c25f4e0789bc4512e098a76384910294716b509124018376518a451
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
