import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Download,
  FileText,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  Copy
} from 'lucide-react';
import { MOCK_PROVENANCE_STEPS } from '../../data/mockData';
import { ProvenanceStep } from '../../types/canon';

export const ProvenanceReplay: React.FC = () => {
  const [steps, setSteps] = useState<ProvenanceStep[]>(MOCK_PROVENANCE_STEPS);
  const [selectedStep, setSelectedStep] = useState<ProvenanceStep>(MOCK_PROVENANCE_STEPS[3]);
  const [exportGenerated, setExportGenerated] = useState(false);
  const [exportType, setExportType] = useState<'WATERMARKED_PDF' | 'STRUCTURED_JSON' | 'AUDIT_MANIFEST'>('WATERMARKED_PDF');

  const handleDownloadExport = () => {
    setExportGenerated(true);
    setTimeout(() => {
      // Trigger a clean JSON download
      const exportData = {
        exportId: `CANON-EXP-${Date.now()}`,
        product: 'Keytruda (pembrolizumab)',
        lifecycleVersion: 'US PI v15.0',
        generatedAt: new Date().toISOString(),
        requestingUser: 'Dr. Sarah Vance, Global Labeling Lead',
        auditStandard: '21 CFR Part 11 & EU Annex 11 Validated Export',
        provenanceChain: steps,
        cryptographicSeal: '9f83c12658efb1c09b83b3e2187d9a13b9426f8d0714b8a2e1d09f7a4e6b5281',
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PRAMANEX_CANON_Keytruda_Lineage_Export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
            <History className="w-3.5 h-3.5" />
            Historical Lineage Replay & Controlled GxP Export
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Label Provenance Graph & Controlled GxP Export
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step historical reconstruction using historical parser versions, model identity, and named human reviewer decisions.
          </p>
        </div>

        <button
          onClick={handleDownloadExport}
          className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          Export Certified GxP Dossier
        </button>
      </div>

      {exportGenerated && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Certified Export Packet generated with unique ID <span className="font-mono font-bold">CANON-EXP-2026-9921</span> and SHA-256 seal.
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-700">Audit Status: VALIDATED</span>
        </div>
      )}

      {/* Main Grid: Visual Stepper (Left) & Historical Parameter Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Lineage Steps */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Reconstructable Chronological Lineage ({steps.length} Milestones)
          </h3>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {steps.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStep(st)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedStep.id === st.id
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-1 ring-emerald-600/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[27px] top-4 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold ${
                    selectedStep.id === st.id ? 'bg-emerald-600 text-white' : 'bg-slate-400 text-white'
                  }`}
                >
                  {st.stepNumber}
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    {st.stageName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {st.timestamp.split('T')[0]}
                  </span>
                </div>

                <h4 className="mt-1 text-xs font-bold text-slate-900">{st.title}</h4>
                <p className="mt-0.5 text-[11px] text-slate-600">{st.actor}</p>

                <div className="mt-2 text-[10px] font-mono text-slate-400 truncate">
                  Hash: {st.sha256Hash}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (7 Cols): Step Parameter & Model Replay Inspector */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step {selectedStep.stepNumber} Detailed Artifact
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedStep.title}</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Executed by: <span className="font-semibold text-slate-800">{selectedStep.actor}</span> ({selectedStep.actorType})
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800">
              {selectedStep.timestamp}
            </span>
          </div>

          {/* Cryptographic Hash Seal */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Immutable SHA-256 Hash Seal:
            </span>
            <div className="font-mono text-xs text-emerald-700 font-bold truncate">
              {selectedStep.sha256Hash}
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              Guarantees zero retrospective tampering under 21 CFR Part 11 requirements.
            </p>
          </div>

          {/* Parameter Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Exact Historical Execution Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(selectedStep.parameters).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800 mt-0.5 block">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Controlled Export Selector */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Controlled Export Configuration
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'WATERMARKED_PDF', label: 'Certified PDF Dossier' },
                { id: 'STRUCTURED_JSON', label: 'Structured JSON Package' },
                { id: 'AUDIT_MANIFEST', label: 'Cryptographic Manifest' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setExportType(opt.id as any)}
                  className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                    exportType === opt.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600/30'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </div>
              ))}
            </div>

            <button
              onClick={handleDownloadExport}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Selected Controlled Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
