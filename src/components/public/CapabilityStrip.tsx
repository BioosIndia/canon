import React from 'react';
import { ShieldCheck, GitCompare, Globe2, FileCode, Clock3 } from 'lucide-react';

export const CapabilityStrip: React.FC = () => {
  const capabilities = [
    {
      icon: GitCompare,
      title: 'Evidence-Linked Comparison',
      subtitle: 'Deterministic token diff with source coordinates',
    },
    {
      icon: ShieldCheck,
      title: 'Human-Governed Decisions',
      subtitle: 'AI proposes candidates; named experts decide',
    },
    {
      icon: Globe2,
      title: 'Global-to-Local Traceability',
      subtitle: 'Core CCDS cascading to 50+ local affiliate labels',
    },
    {
      icon: FileCode,
      title: 'Structured-Label Readiness',
      subtitle: 'SPL, ePI FHIR & 2D DataMatrix integrity',
    },
    {
      icon: Clock3,
      title: 'Version-Bound Provenance',
      subtitle: 'Cryptographic SHA-256 historical replay',
    },
  ];

  return (
    <div className="bg-white border-y border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
          Architectural Core Standards & Evidence Verification Principles
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/80 hover:border-emerald-200 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{cap.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{cap.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
