import React, { useState } from 'react';
import {
  Globe2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { MOCK_CROSS_MARKET } from '../../data/mockData';
import { AlignmentStatus, CrossMarketAlignment } from '../../types/canon';
import { Sparkles } from 'lucide-react';

interface CrossMarketMatrixProps {
  onSelectAlignment: (item: CrossMarketAlignment) => void;
  onOpenAiSummarizer?: (title: string, text: string) => void;
}

export const CrossMarketMatrix: React.FC<CrossMarketMatrixProps> = ({ onSelectAlignment, onOpenAiSummarizer }) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlignments = MOCK_CROSS_MARKET.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch =
      item.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.canonicalConcept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.affiliateLead.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: AlignmentStatus) => {
    switch (status) {
      case 'ALIGNED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> ALIGNED
          </span>
        );
      case 'STALE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> STALE
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> NEEDS REVIEW
          </span>
        );
      case 'CONFLICT':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> CONFLICT
          </span>
        );
      case 'UNKNOWN':
      case 'MISSING_EVIDENCE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> UNKNOWN
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold mb-2 border border-purple-200">
            <Globe2 className="w-3.5 h-3.5" />
            Global-to-Local Harmonization Engine
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Global Core (CCDS) to Local Label Alignment Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Keytruda (pembrolizumab) • Core CCDS Rev 15.0 Propagation & Drift Monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter market, lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52 text-slate-800"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ALIGNED">Aligned Only</option>
            <option value="STALE">Stale Only</option>
            <option value="NEEDS_REVIEW">Needs Review</option>
            <option value="CONFLICT">Conflict</option>
          </select>
        </div>
      </div>

      {/* Cross-Market Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-6">Jurisdiction / Market</th>
                <th className="py-3.5 px-6">Canonical Concept</th>
                <th className="py-3.5 px-6">Core vs. Local Version</th>
                <th className="py-3.5 px-6">Alignment Status</th>
                <th className="py-3.5 px-6">Differences & Deviations</th>
                <th className="py-3.5 px-6">Affiliate Lead</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlignments.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => onSelectAlignment(row)}
                >
                  <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    {row.market}
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-mono text-[11px]">
                    {row.canonicalConcept}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-800">
                    <span className="text-slate-500">{row.coreVersion}</span>
                    <span className="mx-1 text-slate-400">→</span>
                    <span className="font-bold text-slate-900">{row.localVersion}</span>
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(row.status)}</td>
                  <td className="py-4 px-6 max-w-xs text-slate-600">
                    <p className="line-clamp-2 leading-relaxed">{row.differencesSummary}</p>
                    {row.deviationReason && (
                      <p className="mt-1 text-[11px] text-amber-700 font-medium">
                        {row.deviationReason}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{row.affiliateLead}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {onOpenAiSummarizer && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAiSummarizer(
                            `${row.market} - ${row.canonicalConcept} Alignment`,
                            `Market: ${row.market}\nConcept: ${row.canonicalConcept}\nCore Version: ${row.coreVersion}\nLocal Version: ${row.localVersion}\nStatus: ${row.status}\n\nDifferences:\n${row.differencesSummary}${row.deviationReason ? `\n\nDeviation Reason:\n${row.deviationReason}` : ''}`
                          );
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1 border border-purple-200"
                        title="Discuss this cross-market discrepancy with AI"
                      >
                        <Sparkles className="w-3 h-3" />
                        AI Summary
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAlignment(row);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Matrix Notice Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Deterministic Alignment Principle: The system never assumes missing local requirements as
            facts.
          </span>
          <span className="font-mono text-[11px]">Last Sync: 2026-10-02 07:15 UTC</span>
        </div>
      </div>
    </div>
  );
};
