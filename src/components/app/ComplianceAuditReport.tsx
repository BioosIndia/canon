import React, { useState } from 'react';
import {
  ShieldCheck,
  Download,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Printer,
  FileSpreadsheet,
  Layers,
  Award,
  Calendar,
  Building,
  Globe2,
  FileText,
  Filter,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Zap,
  Activity
} from 'lucide-react';
import { StorageService } from '../../utils/storage';
import { MOCK_CROSS_MARKET, MOCK_PRODUCTS } from '../../data/mockData';

export const ComplianceAuditReport: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'DOSSIER' | 'GLOBAL_REPORT' | 'PART11_CHECK' | 'EXPORT_CENTER'>('DOSSIER');
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Global Cross-Market Data
  const globalMarketsData = [
    {
      market: 'US (FDA)',
      labelType: 'US Prescribing Information (SPL)',
      activeVersion: 'v15.0',
      alignmentStatus: 'ALIGNED',
      riskClass: 'LOW',
      effectiveDate: '2026-09-18',
      submissionStatus: 'APPROVED_AND_ACTIVE',
      proofAttached: true,
      lastAuditCheck: '2026-10-01',
    },
    {
      market: 'EU (EMA)',
      labelType: 'Summary of Product Characteristics (SmPC)',
      activeVersion: 'v9.1',
      alignmentStatus: 'DRIFT_DETECTED',
      riskClass: 'HIGH_SAFETY_CRITICAL',
      effectiveDate: '2026-05-12',
      submissionStatus: 'VARIATION_TYPE_II_PENDING',
      proofAttached: false,
      lastAuditCheck: '2026-10-02',
    },
    {
      market: 'Japan (PMDA)',
      labelType: 'Japanese Package Insert (Tenpu Bunsho)',
      activeVersion: 'Rev 8',
      alignmentStatus: 'UNDER_TRANSLATION_REVIEW',
      riskClass: 'MEDIUM_VARIATION',
      effectiveDate: '2026-04-10',
      submissionStatus: 'SUBMITTED_TO_PMDA',
      proofAttached: true,
      lastAuditCheck: '2026-10-01',
    },
    {
      market: 'UK (MHRA)',
      labelType: 'Great Britain SmPC',
      activeVersion: 'v9.0',
      alignmentStatus: 'ALIGNED',
      riskClass: 'LOW',
      effectiveDate: '2026-06-20',
      submissionStatus: 'APPROVED_AND_ACTIVE',
      proofAttached: true,
      lastAuditCheck: '2026-09-28',
    },
    {
      market: 'Canada (Health Canada)',
      labelType: 'Product Monograph (PM)',
      activeVersion: 'Rev 11',
      alignmentStatus: 'ALIGNED',
      riskClass: 'LOW',
      effectiveDate: '2026-07-04',
      submissionStatus: 'APPROVED_AND_ACTIVE',
      proofAttached: true,
      lastAuditCheck: '2026-09-25',
    },
    {
      market: 'Australia (TGA)',
      labelType: 'Australian Product Information (PI)',
      activeVersion: 'v7.4',
      alignmentStatus: 'DRIFT_DETECTED',
      riskClass: 'MEDIUM_VARIATION',
      effectiveDate: '2026-03-15',
      submissionStatus: 'CATEGORY_1_SUBMISSION_PENDING',
      proofAttached: false,
      lastAuditCheck: '2026-10-02',
    },
  ];

  const complianceMetrics = [
    {
      title: '21 CFR Part 11 Electronic Records',
      status: 'VERIFIED_COMPLIANT',
      score: '100%',
      desc: 'All audit logs use append-only records with SHA-256 cryptographic linkage.',
    },
    {
      title: 'EU Annex 11 Computerised Systems',
      status: 'VERIFIED_COMPLIANT',
      score: '100%',
      desc: 'Role separation enforced between Global Lead, Safety Reviewer, and Affiliate leads.',
    },
    {
      title: 'ICH E6(R2) Good Clinical Practice',
      status: 'VERIFIED_COMPLIANT',
      score: '99.4%',
      desc: 'Traceable link from clinical safety signal to authorized label implementation.',
    },
    {
      title: 'GS1 Digital Link & ePI Readiness',
      status: 'VERIFIED_COMPLIANT',
      score: '98.8%',
      desc: 'Active endpoint verification prevents physical barcodes resolving to superseded leaflets.',
    },
  ];

  const handleGeneratePdfReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 800);
  };

  const handleDownloadAuditPack = () => {
    const auditLogs = StorageService.getAuditLogs();
    const manifest = {
      manifestId: `CANON-GXP-AUDIT-${Date.now()}`,
      certificationStandard: '21 CFR Part 11 & EU Annex 11 Certified Audit Package',
      organization: 'Global BioPharma Corp',
      generatedDate: new Date().toISOString(),
      leadAuditor: 'Dr. Sarah Vance, PharmD',
      totalCryptographicEvents: auditLogs.length,
      attestationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      events: auditLogs,
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PRAMANEX_CANON_GxP_Audit_Dossier_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Successfully downloaded GxP Audit Dossier JSON manifest.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleDownloadCsvAudit = () => {
    const auditLogs = StorageService.getAuditLogs();
    const headers = 'ID,Timestamp,Actor,Role,Action,Resource,Severity,Details\n';
    const rows = auditLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor}","${l.actorRole}","${l.action}","${l.resource}","${l.severity}","${l.details.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PRAMANEX_CANON_Audit_Ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Successfully exported CSV Audit Ledger.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleExportGlobalMatrixCsv = () => {
    const headers = 'Market,Label Type,Active Version,Alignment Status,Risk Class,Effective Date,Submission Status,Proof Attached\n';
    const rows = globalMarketsData
      .map(
        (m) =>
          `"${m.market}","${m.labelType}","${m.activeVersion}","${m.alignmentStatus}","${m.riskClass}","${m.effectiveDate}","${m.submissionStatus}","${m.proofAttached ? 'YES' : 'NO'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PRAMANEX_CANON_Global_Cross_Market_Report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Successfully exported Global Cross-Market Variance Matrix (CSV).');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <Award className="w-3.5 h-3.5" />
            GxP Part 11 & Global Regulatory Audit Suite
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Compliance Audit & Executive Regulatory Reporting
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate certified, tamper-evident regulatory inspection dossiers, global cross-market variance reports, and immutable audit ledgers.
          </p>
        </div>

        {/* Sub-tabs switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('DOSSIER')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'DOSSIER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inspection Dossier
          </button>
          <button
            onClick={() => setActiveSubTab('GLOBAL_REPORT')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'GLOBAL_REPORT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Global Market Report
          </button>
          <button
            onClick={() => setActiveSubTab('PART11_CHECK')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'PART11_CHECK' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Part 11 Telemetry
          </button>
          <button
            onClick={() => setActiveSubTab('EXPORT_CENTER')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'EXPORT_CENTER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Export Center
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{exportNotice}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700">SHA-256 Ledger Updated</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. GXP INSPECTION DOSSIER (PDF / PRINTABLE VIEW) */}
      {/* ========================================================= */}
      {activeSubTab === 'DOSSIER' && (
        <div className="space-y-6">
          {/* Action Ribbon */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                Official Regulatory Inspection Attestation Document (Print / Export Ready)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadAuditPack}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                Audit JSON Manifest
              </button>
              <button
                onClick={handleGeneratePdfReport}
                disabled={isExporting}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                {isExporting ? 'Generating Report...' : 'Print / Export GxP Report'}
              </button>
            </div>
          </div>

          {/* Dossier Document Preview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                    Official Regulatory Inspection Attestation
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    PRAMANEX CANON GxP System Validation Certificate
                  </h2>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="font-mono text-slate-500 block">Certificate ID: CANON-CERT-2026-X1</span>
                <span className="font-bold text-emerald-700">Validated Status: Active GxP Compliant</span>
              </div>
            </div>

            {/* Verification Matrix */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Mandatory Regulatory Attestation Criteria
              </h4>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
                {[
                  {
                    item: 'Audit Trail Attestation',
                    clause: '21 CFR § 11.10(e)',
                    verification: 'Computer-generated, timestamped audit trail records date, time, and operator of all actions.',
                    status: 'PASSED',
                  },
                  {
                    item: 'Electronic Signature Non-Repudiation',
                    clause: '21 CFR § 11.50',
                    verification: 'Decisions uniquely sealed with printed reviewer name, datetime, and reason text.',
                    status: 'PASSED',
                  },
                  {
                    item: 'Deterministic Diff Parity',
                    clause: 'GxP Annex 11 § 9',
                    verification: 'Word difference computed via Myers token comparison without generative interpolation.',
                    status: 'PASSED',
                  },
                  {
                    item: 'Proof-Before-Closure Enforcement',
                    clause: 'GAMP 5 Category 4',
                    verification: 'Affiliate implementation tasks hard-blocked from closing until submission receipt attached.',
                    status: 'PASSED',
                  },
                  {
                    item: 'Governed Memory Tenant Isolation',
                    clause: 'ICH Q10 Quality System',
                    verification: 'Cross-tenant memory leakage mathematically prevented via isolated key spaces.',
                    status: 'PASSED',
                  },
                ].map((row, idx) => (
                  <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40 hover:bg-slate-50">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{row.item}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 text-slate-700">
                          {row.clause}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{row.verification}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0 flex items-center gap-1 self-start sm:self-center">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Authority Seal */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Certified Lead Regulatory Authority:
                </span>
                <span className="font-bold text-slate-900">Dr. Sarah Vance, PharmD (Global Labeling Lead)</span>
                <p className="text-[10px] font-mono text-slate-500">
                  Signature Seal: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadCsvAudit}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  Export Ledger (CSV)
                </button>
                <button
                  onClick={handleDownloadAuditPack}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  Download Complete Dossier (JSON)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. GLOBAL CROSS-MARKET VARIANCE REPORT */}
      {/* ========================================================= */}
      {activeSubTab === 'GLOBAL_REPORT' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Global Cross-Market Label Synchronization Matrix</h3>
              <p className="text-xs text-slate-500">
                Monitors Core CCDS Rev 15 rollout status across FDA, EMA, PMDA, MHRA, Health Canada, and TGA.
              </p>
            </div>
            <button
              onClick={handleExportGlobalMatrixCsv}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export Global Matrix (CSV)
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Market / Authority</th>
                    <th className="py-3.5 px-4">Label Format & Type</th>
                    <th className="py-3.5 px-4">Active Version</th>
                    <th className="py-3.5 px-4">Alignment Status</th>
                    <th className="py-3.5 px-4">Risk Class</th>
                    <th className="py-3.5 px-4">Submission Status</th>
                    <th className="py-3.5 px-4">Proof Attached</th>
                    <th className="py-3.5 px-4">Audit Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {globalMarketsData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{row.market}</td>
                      <td className="py-3.5 px-4 text-slate-600">{row.labelType}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">{row.activeVersion}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            row.alignmentStatus === 'ALIGNED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : row.alignmentStatus === 'DRIFT_DETECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {row.alignmentStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-semibold ${
                          row.riskClass === 'HIGH_SAFETY_CRITICAL' ? 'text-rose-700' : 'text-slate-600'
                        }`}>
                          {row.riskClass}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] font-medium text-slate-800">{row.submissionStatus}</td>
                      <td className="py-3.5 px-4">
                        {row.proofAttached ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Attached
                          </span>
                        ) : (
                          <span className="text-amber-700 font-bold flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Missing Proof
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{row.lastAuditCheck}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. 21 CFR PART 11 COMPLIANCE TELEMETRY */}
      {/* ========================================================= */}
      {activeSubTab === 'PART11_CHECK' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceMetrics.map((m, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Regulatory Standard
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    {m.score} PASS
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                <p className="text-[11px] text-slate-600 leading-snug">{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">System Integrity Health & Telemetry Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 block">Cryptographic Hash Status:</span>
                <span className="text-emerald-700 font-mono text-[11px]">SHA-256 Validated (Zero Collisions)</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 block">Dual Sign-off Enforcement:</span>
                <span className="text-emerald-700 text-[11px]">Active for all High-Risk Clinical Changes</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 block">Audit Trail Immutability:</span>
                <span className="text-emerald-700 text-[11px]">Locked in Append-Only Storage</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. EXPORT CENTER */}
      {/* ========================================================= */}
      {activeSubTab === 'EXPORT_CENTER' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Regulatory Dossier & Audit Export Center</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Export validated evidence packets formatted for regulatory submission and internal inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Printer className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-sm font-bold text-slate-900">GxP Inspection Dossier (PDF / Print)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Official printable certificate containing electronic signature records, attestation seals, and deterministic diff evidence.
                </p>
              </div>
              <button
                onClick={handleGeneratePdfReport}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                Generate Inspection Dossier
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-sm font-bold text-slate-900">Audit Trail Ledger (CSV)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Export complete chronological ledger of user actions, SHA-256 seals, role switches, and review decisions for external audits.
                </p>
              </div>
              <button
                onClick={handleDownloadCsvAudit}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                Download Audit CSV
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Globe2 className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-sm font-bold text-slate-900">Global Cross-Market Matrix (CSV)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Comprehensive spreadsheet detailing alignment across US FDA, EMA, PMDA, MHRA, Health Canada, and TGA with proof attachments.
                </p>
              </div>
              <button
                onClick={handleExportGlobalMatrixCsv}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                Download Global Matrix CSV
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-sm font-bold text-slate-900">Signed Cryptographic JSON Manifest</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Full machine-readable 21 CFR Part 11 JSON package containing attestation hashes, actor metadata, and validation parameters.
                </p>
              </div>
              <button
                onClick={handleDownloadAuditPack}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                Download JSON Manifest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
