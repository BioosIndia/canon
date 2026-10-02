import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  GitFork,
  Table,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ImpactNodeItem {
  id: string;
  type: 'CORE_CHANGE' | 'AFFECTED_MARKET' | 'PACK_STRENGTH' | 'ACTION_TASK';
  title: string;
  subtitle: string;
  status: 'ALIGNED' | 'PENDING' | 'ACTION_REQUIRED';
}

export const ImpactGraph: React.FC = () => {
  const [viewMode, setViewMode] = useState<'GRAPH' | 'TABLE'>('GRAPH');

  const nodes: ImpactNodeItem[] = [
    {
      id: 'node-1',
      type: 'CORE_CHANGE',
      title: 'CCDS Rev 15 Hepatic Warning',
      subtitle: 'AST/ALT monitoring before each infusion',
      status: 'ACTION_REQUIRED',
    },
    {
      id: 'node-2',
      type: 'AFFECTED_MARKET',
      title: 'US FDA (US PI v15.0)',
      subtitle: 'SPL Ingested & Approved',
      status: 'ALIGNED',
    },
    {
      id: 'node-3',
      type: 'AFFECTED_MARKET',
      title: 'EU EMA (SmPC v9.1)',
      subtitle: 'Type II Variation Required',
      status: 'ACTION_REQUIRED',
    },
    {
      id: 'node-4',
      type: 'AFFECTED_MARKET',
      title: 'Japan PMDA (JP PI v7.0)',
      subtitle: 'Minor Notification & Redraft',
      status: 'PENDING',
    },
    {
      id: 'node-5',
      type: 'PACK_STRENGTH',
      title: '100 mg/4 mL Infusion Vial',
      subtitle: 'Physical packaging artwork unaffected; PIL leaflet reprint needed',
      status: 'ACTION_REQUIRED',
    },
    {
      id: 'node-6',
      type: 'ACTION_TASK',
      title: 'Task: EU Affiliate Variation Filing',
      subtitle: 'Assigned: Dr. Elena Rostova',
      status: 'PENDING',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
            <GitFork className="w-3.5 h-3.5" />
            Product / Market / Pack / Section Impact Topology
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cascading Impact Graph & Dependency Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Trace how a single core safety modification cascades across product strengths, pack sizes,
            ePI digital leaflets, and affiliate regulatory filings.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
          <button
            onClick={() => setViewMode('GRAPH')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'GRAPH' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Visual Graph
          </button>
          <button
            onClick={() => setViewMode('TABLE')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Accessible Table
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'GRAPH' ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Root Change: Section 4.4 Warnings Protocol
            </span>
          </div>

          {/* Graph Nodes Visual Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Level 1: Root Concept */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                1. Core Trigger
              </span>
              <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300">
                  Global CCDS Rev 15
                </span>
                <h4 className="text-sm font-bold">Mandatory Transaminase Baseline</h4>
                <p className="text-xs text-slate-300">
                  Requires liver function test baseline prior to each infusion.
                </p>
              </div>
            </div>

            {/* Level 2: Cascading Markets */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                2. Market Cascades
              </span>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950">US FDA</span>
                    <span className="text-[10px] font-bold text-emerald-700">SYNCHRONIZED</span>
                  </div>
                  <p className="text-emerald-800">US PI v15.0 approved and deployed.</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950">EU EMA</span>
                    <span className="text-[10px] font-bold text-amber-700">VARIATION NEEDED</span>
                  </div>
                  <p className="text-amber-800">SmPC v9.1 lacks infusion timing requirement.</p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-950">Japan PMDA</span>
                    <span className="text-[10px] font-bold text-purple-700">TRANSLATION DRIFT</span>
                  </div>
                  <p className="text-purple-800">Japanese package insert drafting underway.</p>
                </div>
              </div>
            </div>

            {/* Level 3: Downstream Implementation Tasks */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                3. Downstream Execution
              </span>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">EU Type II Dossier</span>
                  <p className="text-slate-600">Assigned: Dr. Elena Rostova (Seq 0142)</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">Patient Leaflet Artwork</span>
                  <p className="text-slate-600">ePI 2D DataMatrix endpoint targets v9.1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Accessible Table Alternative (Section 22 requirement) */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-6">Impact Level</th>
                <th className="py-3.5 px-6">Entity / Node</th>
                <th className="py-3.5 px-6">Detailed Impact Description</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {nodes.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-bold text-slate-900">{n.type}</td>
                  <td className="py-4 px-6 font-semibold text-slate-800">{n.title}</td>
                  <td className="py-4 px-6 text-slate-600">{n.subtitle}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        n.status === 'ALIGNED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : n.status === 'PENDING'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {n.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
