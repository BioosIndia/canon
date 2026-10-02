import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Plus,
  Filter
} from 'lucide-react';
import { MOCK_SIGNALS } from '../../data/mockData';
import { RegulatorySignal } from '../../types/canon';

export const SignalIntake: React.FC = () => {
  const [signals, setSignals] = useState<RegulatorySignal[]>(MOCK_SIGNALS);
  const [selectedSignal, setSelectedSignal] = useState<RegulatorySignal>(MOCK_SIGNALS[0]);
  const [converted, setConverted] = useState(false);

  const handleConvertToProposal = () => {
    setConverted(true);
    const updated = signals.map((s) => {
      if (s.id === selectedSignal.id) {
        return { ...s, status: 'CONVERTED_TO_CHANGE' as any };
      }
      return s;
    });
    setSignals(updated);
    setSelectedSignal({ ...selectedSignal, status: 'CONVERTED_TO_CHANGE' });
    setTimeout(() => setConverted(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold mb-2 border border-rose-200">
            <ShieldAlert className="w-3.5 h-3.5" />
            Regulatory & Safety Trigger Intake
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Regulatory / Safety Trigger Intake & Proposal Bridge
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest PRAC recommendations, FDA MedWatch alerts, and post-marketing signals. Convert safety
            events into versioned label change candidates.
          </p>
        </div>
      </div>

      {/* Grid: Signals List (Left) & Trigger Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Inbound Safety Signals ({signals.length})
          </h3>

          <div className="space-y-3">
            {signals.map((sig) => (
              <div
                key={sig.id}
                onClick={() => setSelectedSignal(sig)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedSignal.id === sig.id
                    ? 'border-rose-500 bg-rose-50/40 shadow-md ring-1 ring-rose-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    {sig.sourceAuthority.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{sig.detectedDate}</span>
                </div>

                <h4 className="mt-2 text-sm font-bold text-slate-900 leading-snug">
                  {sig.signalTitle}
                </h4>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">{sig.clinicalSummary}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-800">{sig.activeSubstance}</span>
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
                      sig.status === 'CONVERTED_TO_CHANGE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {sig.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (7 Cols): Signal Evaluation & Change Proposal Conversion */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
                Urgency: {selectedSignal.urgencyLevel}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Detected: {selectedSignal.detectedDate}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{selectedSignal.signalTitle}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Active Substance: <span className="font-semibold text-slate-800">{selectedSignal.activeSubstance}</span>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Clinical Assessment & Background
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
              {selectedSignal.clinicalSummary}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Suggested Harmonization Action
            </h4>
            <p className="text-xs text-slate-600">
              This trigger indicates mandatory updates to Section 4.4 (Special Warnings) and Section 4.8
              (Adverse Reactions). Convert to an authoritative change packet to evaluate across Core
              CCDS and affiliate labels.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Linked Candidate: {selectedSignal.linkedChangeCandidateId || 'None (New)'}
              </span>

              <button
                onClick={handleConvertToProposal}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                Convert to Evidence Change Packet
              </button>
            </div>

            {converted && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Signal converted to active versioned change candidate packet! Routed to review queue.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
