import React from 'react';
import { ShieldCheck, Lock, Globe, FileText, ChevronRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onLaunchApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onLaunchApp }) => {
  return (
    <footer className="bg-[#051710] text-emerald-100/70 text-xs border-t border-emerald-950/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-emerald-950">
        {/* Brand column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center text-white font-bold shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white">PRAMANEX CANON</span>
              <p className="text-[10px] text-emerald-300 tracking-wider uppercase font-semibold">
                Global Label Lifecycle Operating System
              </p>
            </div>
          </div>

          <p className="text-xs text-emerald-200/70 max-w-sm leading-relaxed">
            Turn an authorized label change into an evidence-linked cross-market implementation record
            while preserving exact source coordinates, uncertainty, and named human authority.
          </p>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 max-w-sm">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">
              Absolute Regulatory AI Boundary
            </span>
            <p className="text-[11px] text-emerald-100/80 leading-snug">
              Deterministic evidence comes first. AI assists; humans decide. The system never autonomously
              approves labels, submits to health authorities, or overrides qualified clinical reviewers.
            </p>
          </div>
        </div>

        {/* Column 1: Platform */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
            Platform & Engine
          </h4>
          <ul className="space-y-2.5">
            <li>
              <button
                onClick={() => onNavigate('compare')}
                className="hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Deterministic Exact Diff Engine
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('cross-market')}
                className="hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Global-to-Local Alignment Matrix
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('governance')}
                className="hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Named Human Review Portal
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('structured')}
                className="hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Structured SPL / ePI Integrity
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('provenance')}
                className="hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Reconstructable Provenance Replay
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Governance & Roles */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
            Human Roles
          </h4>
          <ul className="space-y-2.5">
            <li className="text-emerald-100/90 font-medium">Global Labeling Lead</li>
            <li className="text-emerald-100/90 font-medium">Regulatory Labeling Specialist</li>
            <li className="text-emerald-100/90 font-medium">Local Affiliate RA (50+ Markets)</li>
            <li className="text-emerald-100/90 font-medium">Safety / Medical Reviewer</li>
            <li className="text-emerald-100/90 font-medium">RegOps / Digital Regulatory</li>
            <li className="text-emerald-100/90 font-medium">Read-Only Auditor</li>
          </ul>
        </div>

        {/* Column 3: Trust & Operations */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
            Trust & Security
          </h4>
          <ul className="space-y-2.5">
            <li>21 CFR Part 11 Audit Integrity</li>
            <li>SHA-256 Cryptographic Seals</li>
            <li>Tenant-Isolated Workspaces</li>
            <li>No Autonomous AI Submissions</li>
            <li>Offline/Private Storage Safe</li>
            <li>
              <button
                onClick={onLaunchApp}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D8F34E] text-slate-950 font-bold text-xs hover:bg-[#cbe640] transition-colors"
              >
                Launch CANON OS <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-200/50 gap-4">
        <p>© 2026 PRAMANEX CANON. Enterprise Labeling Intelligence & Global Label Lifecycle OS.</p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            System Operational
          </span>
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
          <span>Audit Telemetry</span>
        </div>
      </div>
    </footer>
  );
};
