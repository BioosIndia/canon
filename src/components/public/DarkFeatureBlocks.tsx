import React, { useState } from 'react';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Lock,
  FileCheck,
  Cpu
} from 'lucide-react';

export const DarkFeatureBlocks: React.FC = () => {
  const [qrScanning, setQrScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>('https://www.ema.europa.eu/en/medicines/human/EPAR/keytruda#product-information');
  const [verifiedStatus, setVerifiedStatus] = useState<'MATCH' | 'MISMATCH'>('MATCH');

  // Decision portal state
  const [selectedDecision, setSelectedDecision] = useState<string>('APPROVE_CANDIDATE');
  const [decisionReason, setDecisionReason] = useState<string>(
    'Wording aligns with clinical study KEYNOTE-006 results and PRAC recommendation on transaminases.'
  );
  const [decisionSubmitted, setDecisionSubmitted] = useState(false);

  const handleSimulateScan = () => {
    setQrScanning(true);
    setTimeout(() => {
      setQrScanning(false);
      setVerifiedStatus('MATCH');
    }, 800);
  };

  const handleSubmitDecision = () => {
    setDecisionSubmitted(true);
    setTimeout(() => setDecisionSubmitted(false), 3500);
  };

  return (
    <section id="structured-epi" className="py-20 bg-slate-50 text-slate-900 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            Core Enterprise Pillars
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Real-Time Label Intelligence: Stay synchronized with instant updates.
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Continuously verify digital patient endpoints and enforce rigorous qualified human review
            gates across all global jurisdictions.
          </p>
        </div>

        {/* Dual Dark Green Blocks (Exact visual styling from Reference Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Dark Block: Structured Labeling & QR Integrity */}
          <div className="bg-[#0B3B2C] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-400/30">
                <QrCode className="w-3.5 h-3.5" />
                Digital-Link & ePI Integrity
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
                Structured Labeling & 2D DataMatrix Link Integrity
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed mb-8 max-w-lg">
                Continuous verification of declared SPL, ePI FHIR bundles, and packaging QR endpoints
                to prevent patients from accessing superseded or language-mismatched leaflets.
              </p>
            </div>

            {/* White Cards Container inside Left Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-900">
              {/* White Card 1: Metric summary */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-md flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    LOINC Structural Readiness
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-slate-900">99.8%</span>
                    <span className="text-xs font-bold text-emerald-600">Conformant</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>SPL LOINC 34067-9:</span>
                    <span className="font-bold text-emerald-700">Mapped</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>FHIR Bundle v2.4:</span>
                    <span className="font-bold text-emerald-700">Validated</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Section Hash Match:</span>
                    <span className="font-bold text-emerald-700">PASS</span>
                  </div>
                </div>

                <div className="mt-4 pt-2 text-[10px] text-slate-400 font-mono">
                  Verified: DailyMed & EMA EPAR
                </div>
              </div>

              {/* White Card 2: Interactive 2D / QR Code Checker */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-900">QR / 2D Scanner</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* QR Visual */}
                <div className="my-3 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white p-1 rounded-lg shadow-xs border border-slate-200 flex items-center justify-center">
                    <QrCode className="w-14 h-14 text-slate-800" />
                  </div>
                  <span className="mt-2 text-[10px] font-mono text-slate-500 truncate max-w-[170px]">
                    {scanResult}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Target SmPC:</span>
                    <span className="font-bold text-emerald-700">v9.1 (Active)</span>
                  </div>
                  <button
                    onClick={handleSimulateScan}
                    disabled={qrScanning}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {qrScanning ? 'Verifying Endpoint...' : 'Scan / Test Endpoint'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Dark Block: Named Human Review Engine */}
          <div id="governance" className="bg-[#0B3B2C] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl scroll-mt-24">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Human Governance Gate
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
                Named Human Review & Controlled Decision Engine
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed mb-8 max-w-lg">
                Deterministic evidence comes first. AI proposes candidates; named qualified human
                authorities record clinical rationale and bind decisions with cryptographic sign-off.
              </p>
            </div>

            {/* White Cards Container inside Right Block */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-md text-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Keytruda §4.4 Warnings Review
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Assigned: Dr. Marcus Dubois, MD (Safety Lead)
                  </span>
                </div>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Needs Decision
                </span>
              </div>

              {/* Decision Type Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'APPROVE_CANDIDATE', label: 'Approve', color: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
                  { id: 'REVISE_WORDING', label: 'Revise', color: 'border-blue-500 text-blue-700 bg-blue-50' },
                  { id: 'REQUEST_EVIDENCE', label: 'Ask Proof', color: 'border-amber-500 text-amber-700 bg-amber-50' },
                  { id: 'ESCALATE', label: 'Escalate', color: 'border-rose-500 text-rose-700 bg-rose-50' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setSelectedDecision(btn.id)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      selectedDecision === btn.id
                        ? `${btn.color} ring-2 ring-emerald-600/30 font-extrabold`
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Rationale Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Mandatory Reviewer Rationale (Audit-bound):
                </label>
                <textarea
                  rows={2}
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              {/* Submit & Signature preview */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[10px] text-slate-400 font-mono">
                  SHA-256 Seal: 9f83c12658ef...
                </div>
                <button
                  onClick={handleSubmitDecision}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Sign & Submit Decision
                </button>
              </div>

              {decisionSubmitted && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Decision digitally signed and committed to tamper-evident GxP audit trail.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
