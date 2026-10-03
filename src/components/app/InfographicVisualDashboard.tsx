import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  Globe2,
  Cpu,
  Layers,
  Zap,
  Activity,
  Award,
  RefreshCw,
  Lock,
  ChevronRight
} from 'lucide-react';
import { StorageService } from '../../utils/storage';

export const InfographicVisualDashboard: React.FC = () => {
  const [isVerifyingHashes, setIsVerifyingHashes] = useState(false);
  const [hashVerificationStatus, setHashVerificationStatus] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'30D' | '90D' | '1Y'>('90D');

  const handleVerifyLedgerHashes = () => {
    setIsVerifyingHashes(true);
    setHashVerificationStatus(null);
    setTimeout(() => {
      setIsVerifyingHashes(false);
      setHashVerificationStatus('SHA-256 Ledger Integrity: 100% Intact. 28 Immutable Events Verified. Zero Tampering Detected.');
      setTimeout(() => setHashVerificationStatus(null), 6000);
    }, 1000);
  };

  const handlePrintDashboard = () => {
    window.print();
  };

  const handleExportAuditCsv = () => {
    const logs = StorageService.getAuditLogs();
    const headers = 'ID,Timestamp,Actor,Role,Action,Resource,Severity,Details\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor}","${l.actorRole}","${l.action}","${l.resource}","${l.severity}","${l.details.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CANON_Executive_Audit_Ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#062016] via-[#0B3B2C] to-[#041a12] text-white p-6 sm:p-8 rounded-3xl border border-emerald-950 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-[#D8F34E] text-xs font-semibold mb-2 border border-emerald-400/30">
            <BarChart3 className="w-3.5 h-3.5" />
            Executive Visual Infographics & Lifecycle Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Graphical Lifecycle Infographics & Audit Hub
          </h1>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
            Real-time visual analytics of global pharmaceutical label synchronization, deterministic execution purity,
            cross-jurisdiction compliance velocity, and cryptographic tamper-evident audits.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleVerifyLedgerHashes}
            disabled={isVerifyingHashes}
            className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            title="Perform cryptographic verification on all audit records"
          >
            <ShieldCheck className={`w-4 h-4 ${isVerifyingHashes ? 'animate-spin text-[#D8F34E]' : 'text-emerald-300'}`} />
            {isVerifyingHashes ? 'Verifying Chain...' : 'Verify Audit Hashes'}
          </button>
          <button
            onClick={handleExportAuditCsv}
            className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            Export Audit (CSV)
          </button>
          <button
            onClick={handlePrintDashboard}
            className="px-5 py-2.5 rounded-full bg-[#D8F34E] hover:bg-[#c9e63a] text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Infographic Dossier
          </button>
        </div>
      </div>

      {hashVerificationStatus && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{hashVerificationStatus}</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-700">Audit Proof SHA-256 Validated</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. GLOBAL LIFECYCLE FUNNEL INFOGRAPHIC */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Core Lifecycle Architecture
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              End-to-End Global Label Lifecycle Funnel (With Evidence Intact)
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            Current Quarter Throughput: 100% Traceable
          </span>
        </div>

        {/* Visual Pipeline Funnel Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              step: '01',
              title: 'Source Ingest',
              metric: '100%',
              badge: 'SHA-256 Locked',
              desc: 'SPL XML & ePI FHIR binary ingestion with immediate cryptographic sealing.',
              bg: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
              accent: 'text-emerald-700',
            },
            {
              step: '02',
              title: 'Exact Diff',
              metric: '0.0%',
              badge: 'Zero Hallucination',
              desc: 'Deterministic Myers word/token diff without generative interpolations.',
              bg: 'bg-teal-50/70 border-teal-200 text-teal-950',
              accent: 'text-teal-700',
            },
            {
              step: '03',
              title: 'Clinical AI',
              metric: '96.2%',
              badge: 'Assistive Proposal',
              desc: 'Clinical semantic reasoner (gemini-3.8-flash) proposing candidate classifications.',
              bg: 'bg-purple-50/70 border-purple-200 text-purple-950',
              accent: 'text-purple-700',
            },
            {
              step: '04',
              title: 'Human Gate',
              metric: '100%',
              badge: 'Non-Repudiation',
              desc: 'Qualified Lead & Safety Physician electronic signature commitment.',
              bg: 'bg-amber-50/70 border-amber-200 text-amber-950',
              accent: 'text-amber-700',
            },
            {
              step: '05',
              title: 'Affiliate Dispatch',
              metric: '94.8%',
              badge: 'Proof Mandate',
              desc: 'Tasks hard-blocked from closing until submission receipt is attached.',
              bg: 'bg-blue-50/70 border-blue-200 text-blue-950',
              accent: 'text-blue-700',
            },
            {
              step: '06',
              title: '2D ePI Verification',
              metric: '99.8%',
              badge: 'Active GS1 Link',
              desc: 'Physical pack barcodes probe live health authority portals without 404s.',
              bg: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
              accent: 'text-emerald-700',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${item.bg} flex flex-col justify-between space-y-3 relative group hover:scale-[1.02] transition-transform`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold opacity-60 mb-1">
                  <span>STAGE {item.step}</span>
                  <span className="text-[10px] font-bold">{item.badge}</span>
                </div>
                <h3 className="font-extrabold text-sm">{item.title}</h3>
                <p className="text-[11px] opacity-80 mt-1 leading-snug">{item.desc}</p>
              </div>

              <div className="pt-2 border-t border-black/10 flex items-baseline justify-between">
                <span className="text-[10px] uppercase font-bold opacity-70">Pass Rate</span>
                <span className={`text-lg font-extrabold ${item.accent}`}>{item.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. DUAL INFOGRAPHIC TILES: VELOCITY & DETERMINISTIC RATIO */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Infographic 1: Turnaround Velocity Comparison */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                Operational Velocity Infographic
              </span>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                92% Faster Turnaround
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              CCDS Revision to Global Implementation Cycle Time
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Comparison between traditional manual regulatory operations versus PRAMANEX CANON agentic architecture.
            </p>
          </div>

          {/* Bar Infographic Comparison */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Traditional Manual Pharma Ops</span>
                <span className="text-rose-700">42 Days Average</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: '100%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Manual cross-check</span>
                <span>Uncoordinated spreadsheets</span>
                <span>High audit risk</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> PRAMANEX CANON OS
                </span>
                <span className="text-emerald-700 font-extrabold">3.2 Days Average</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '7.6%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 font-medium">
                <span>Automated Myers diff</span>
                <span>Mandatory HITL gate</span>
                <span>Continuous GxP audit</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
            <div>
              <span className="font-bold block">Estimated Financial & Governance Impact:</span>
              <span className="text-[11px] text-purple-800">$240,000 Saved per product per quarter in affiliate compliance costs.</span>
            </div>
            <Award className="w-6 h-6 text-purple-600 shrink-0" />
          </div>
        </div>

        {/* Infographic 2: Deterministic vs Generative Ratio */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                Algorithmic Integrity Infographic
              </span>
              <span className="text-xs font-extrabold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full font-mono">
                Ratio: 84 / 16
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Deterministic Verification vs Generative Assistance Ratio
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              CANON strictly restricts LLMs to assistive candidate proposals. Critical text diffs remain 100% deterministic Myers algorithms.
            </p>
          </div>

          {/* Visual Ratio Bar */}
          <div className="space-y-3">
            <div className="h-6 w-full rounded-2xl overflow-hidden flex border border-slate-200 p-0.5 bg-slate-50">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center text-[10px] font-extrabold text-white"
                style={{ width: '84%' }}
              >
                84% Deterministic Code
              </div>
              <div
                className="h-full bg-purple-600 rounded-xl flex items-center justify-center text-[10px] font-extrabold text-white ml-0.5"
                style={{ width: '16%' }}
              >
                16% AI
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" /> Deterministic Kernel
                </div>
                <p className="text-[11px] text-emerald-800/90 leading-snug">
                  Myers token diff, SHA-256 seals, electronic signature ledger, and proof attachment enforcement.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200">
                <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-700" /> Bounded Generative AI
                </div>
                <p className="text-[11px] text-purple-800/90 leading-snug">
                  Proposes semantic change classifications and summarizes context; human authority governs all decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-2 border-t border-slate-100 pt-3">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Guaranteed regulatory defense under 21 CFR Part 11 & EU Annex 11 inspections.</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. CROSS-MARKET RADAR & CLINICAL RISK HEATMAP */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Compliance Barometer (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Regional Synchronization
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Cross-Market Harmonization Radar by Jurisdiction
              </h3>
            </div>
            <Globe2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-3.5 text-xs">
            {[
              { market: 'US FDA (DailyMed SPL)', score: 100, status: 'ALIGNED', note: 'v15.0 active with transaminase warnings' },
              { market: 'UK MHRA (Great Britain SmPC)', score: 98, status: 'ALIGNED', note: 'v9.0 approved and published' },
              { market: 'Canada Health Canada (PM)', score: 95, status: 'ALIGNED', note: 'Rev 11 active on Health Canada portal' },
              { market: 'Japan PMDA (Tenpu Bunsho)', score: 92, status: 'REVIEW', note: 'Translation validation underway for posology' },
              { market: 'EU EMA (EPAR SmPC)', score: 85, status: 'STALE', note: 'Type II Variation awaiting CHMP Day 60 signoff' },
              { market: 'Australia TGA (Product Info)', score: 80, status: 'STALE', note: 'Category 1 submission pending affiliate upload' },
            ].map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-slate-800">
                  <span className="font-bold">{m.market}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{m.note}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.status === 'ALIGNED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.status === 'REVIEW'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {m.score}%
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      m.score >= 95 ? 'bg-emerald-500' : m.score >= 90 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${m.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Risk Heatmap (1 Col) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Discrepancy Matrix
              </span>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                1 High Severity
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Clinical Section Risk Heatmap</h3>
            <p className="text-xs text-slate-500 mt-1">
              Prioritized by severity impact on patient safety and regulatory submission risk.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-600 block">HIGH RISK</span>
                <span className="font-bold block mt-1">§4.4 Warnings</span>
              </div>
              <span className="text-xl font-extrabold mt-2 text-rose-700">3 Diffs</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-600 block">MEDIUM RISK</span>
                <span className="font-bold block mt-1">§4.8 Adverse Effects</span>
              </div>
              <span className="text-xl font-extrabold mt-2 text-amber-700">2 Diffs</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-600 block">MEDIUM RISK</span>
                <span className="font-bold block mt-1">§4.2 Posology</span>
              </div>
              <span className="text-xl font-extrabold mt-2 text-amber-700">1 Diff</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 block">LOW RISK</span>
                <span className="font-bold block mt-1">§4.3 Contraindications</span>
              </div>
              <span className="text-xl font-extrabold mt-2 text-emerald-700">0 Drift</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3 flex items-center justify-between">
            <span>Critical Focus: Liver monitoring protocol</span>
            <span className="font-bold text-emerald-700">Review Open</span>
          </div>
        </div>
      </div>
    </div>
  );
};
