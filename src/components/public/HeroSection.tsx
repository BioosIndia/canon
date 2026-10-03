import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  Cuboid
} from 'lucide-react';
import { Hero3DModel } from './Hero3DModel';

interface HeroSectionProps {
  onLaunchApp: () => void;
  onSelectProductCard?: (productId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchApp, onSelectProductCard }) => {
  const [activeTab, setActiveTab] = useState<'board' | 'table' | 'list'>('board');
  const [searchFilter, setSearchFilter] = useState('');
  const [show3DModel, setShow3DModel] = useState(true);

  const boardColumns = [
    {
      title: 'INTAKE & PARSE',
      count: 3,
      color: 'border-slate-300',
      items: [
        {
          id: 'intake-1',
          product: 'Keytruda (pembrolizumab)',
          format: 'SPL / XML',
          authority: 'US FDA',
          version: 'US PI v15.0',
          tag: 'BLA 125514',
          tagColor: 'bg-emerald-100 text-emerald-800',
          assignee: 'Dr. Sarah Vance',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
          hash: 'f49b1836...21',
          change: 'Mandatory hepatic baseline transaminase check'
        },
        {
          id: 'intake-2',
          product: 'Ozempic (semaglutide)',
          format: 'ePI FHIR',
          authority: 'EMA',
          version: 'SmPC v8.1',
          tag: 'NDA 209637',
          tagColor: 'bg-blue-100 text-blue-800',
          assignee: 'Dr. Elena Rostova',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=128&q=80',
          hash: '6b86b273...4b',
          change: '2 mg maintenance dose titration step'
        }
      ]
    },
    {
      title: 'EXACT DIFF VERIFIED',
      count: 4,
      color: 'border-emerald-300',
      items: [
        {
          id: 'diff-1',
          product: 'Keytruda vs CCDS Rev 15',
          format: 'Myers Token Diff',
          authority: 'Core Harmonization',
          version: 'Diff §4.4',
          tag: '32 words added',
          tagColor: 'bg-amber-100 text-amber-800',
          assignee: 'Marcus Dubois',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
          hash: '87fa0192...a4',
          change: 'Zero hallucination Myers comparison locked'
        },
        {
          id: 'diff-2',
          product: 'Humira (adalimumab)',
          format: 'Section Shift',
          authority: 'Health Canada',
          version: 'Monograph v12',
          tag: 'Posology moved',
          tagColor: 'bg-purple-100 text-purple-800',
          assignee: 'Jean-Luc Tremblay',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
          hash: '38b901a8...51',
          change: 'Heading parity re-indexed to LOINC 34067-9'
        }
      ]
    },
    {
      title: 'IN HUMAN REVIEW',
      count: 3,
      color: 'border-amber-300',
      items: [
        {
          id: 'rev-item-1',
          product: 'Keytruda Section 4.4',
          format: 'Candidate: Safety',
          authority: 'Global Safety Board',
          version: 'Candidate #41',
          tag: 'Needs Clinical Review',
          tagColor: 'bg-rose-100 text-rose-800',
          assignee: 'Dr. M. Dubois',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
          hash: '9f83c126...81',
          change: 'Mandatory Grade 3/4 hepatitis discontinuation'
        }
      ]
    },
    {
      title: 'AFFILIATE IMPLEMENTATION',
      count: 5,
      color: 'border-teal-300',
      items: [
        {
          id: 'impl-1',
          product: 'Keytruda EU SmPC Type II',
          format: 'eCTD Seq 0142',
          authority: 'EMA Variation',
          version: 'Target SmPC 9.2',
          tag: 'Proof Verified',
          tagColor: 'bg-teal-100 text-teal-800',
          assignee: 'Elena Rostova',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=128&q=80',
          hash: '5e884898...d8',
          change: 'Submission receipt validated against eCTD gate'
        },
        {
          id: 'impl-2',
          product: 'PMDA Japan Package Insert',
          format: 'XML Redraft',
          authority: 'PMDA',
          version: 'JP PI v7.1',
          tag: '14 Days Due',
          tagColor: 'bg-orange-100 text-orange-800',
          assignee: 'Kenji Sato',
          avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=128&q=80',
          hash: '4b227777...8a',
          change: 'Bilingual translation drift review underway'
        }
      ]
    },
    {
      title: 'AUDIT CLOSED',
      count: 28,
      color: 'border-emerald-400',
      items: [
        {
          id: 'closed-1',
          product: 'Ozempic US PI v8.0',
          format: 'SPL Pack Manifest',
          authority: 'US FDA',
          version: 'Closed Cycle',
          tag: 'Hash Locked',
          tagColor: 'bg-emerald-100 text-emerald-800',
          assignee: 'Sarah Vance',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
          hash: '7c92b810...9b',
          change: 'Reconstructable lineage saved to GxP archive'
        }
      ]
    }
  ];

  return (
    <section id="hero" className="relative pt-12 pb-24 overflow-hidden bg-gradient-to-b from-[#082C20] via-[#0B3B2C] to-[#062016] text-white">
      {/* Decorative Grid Mesh & Emerald Glows */}
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/20 blur-[140px] pointer-events-none" />

      {/* Floating Role Avatar Badges (matching reference image) */}
      <div className="hidden xl:flex items-center gap-2 absolute top-24 left-16 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-white shadow-xl animate-bounce duration-[4000ms]">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
          alt="Lead"
          className="w-5 h-5 rounded-full object-cover"
        />
        <span className="font-semibold text-emerald-200">Global RA Lead</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      <div className="hidden xl:flex items-center gap-2 absolute top-20 right-20 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-white shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
          alt="Safety"
          className="w-5 h-5 rounded-full object-cover"
        />
        <span className="font-semibold text-amber-200">Safety Medical Reviewer</span>
      </div>

      <div className="hidden xl:flex items-center gap-2 absolute top-64 left-24 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-white shadow-xl">
        <span className="w-2 h-2 rounded-full bg-[#D8F34E]" />
        <span className="font-medium text-emerald-100">Affiliate Alignment: 8 Markets</span>
      </div>

      <div className="hidden xl:flex items-center gap-2 absolute top-72 right-24 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-white shadow-xl">
        <ShieldCheck className="w-4 h-4 text-emerald-300" />
        <span className="font-medium text-emerald-100">GxP Part 11 Audit Hash Locked</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#134e38]/80 border border-[#34d399]/30 text-emerald-200 text-xs font-semibold shadow-inner mb-6">
          <span className="w-2 h-2 rounded-full bg-[#D8F34E] animate-ping" />
          <span className="bg-emerald-400/20 text-[#D8F34E] uppercase text-[10px] font-bold px-2 py-0.5 rounded-full">
            New
          </span>
          Version 4.2 CCDS Core Harmonization & Global Label Lifecycle Engine
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          From Label Change to Global Implementation —{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-[#D8F34E]">
            With Evidence Intact.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-emerald-100/80 max-w-3xl mx-auto leading-relaxed font-normal">
          Compare label versions with deterministic exact diffs, understand global-to-local impact,
          coordinate qualified human review, and preserve an immutable, reconstructable evidence trail
          across the enterprise pharmaceutical lifecycle.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onLaunchApp}
            className="px-7 py-3.5 rounded-full bg-[#D8F34E] hover:bg-[#c9e63a] text-slate-950 font-bold text-sm shadow-xl shadow-[#D8F34E]/25 transition-all flex items-center gap-2.5 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Launch PRAMANEX CANON OS
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShow3DModel(!show3DModel)}
            className="px-5 py-3.5 rounded-full bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-200 font-semibold text-sm border border-emerald-700/50 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Cuboid className="w-4 h-4 text-[#D8F34E]" />
            {show3DModel ? 'Hide 3D Molecular & Topology Model' : 'Explore 3D Molecular & Topology Model'}
          </button>
        </div>

        {/* 3D Pharmaceutical Molecular & Regulatory Structure Explorer Module */}
        {show3DModel && (
          <div className="mt-10 max-w-4xl mx-auto text-left">
            <Hero3DModel />
          </div>
        )}

        {/* Embedded Live Product Window (Matches FramerDevs board from Reference Image) */}
        <div id="comparison" className="mt-12 max-w-6xl mx-auto bg-slate-50 text-slate-900 rounded-3xl shadow-2xl shadow-emerald-950/80 border border-slate-200/80 overflow-hidden text-left scroll-mt-24">
          {/* Window Top Bar */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                P
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    PRAMANEX CANON Workspace
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Enterprise
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Global Label Lifecycle & Harmonization Pipeline
                </p>
              </div>
            </div>

            {/* Quick Filter Search & Counter Badges */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search labels, INN, section..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52"
                />
              </div>

              {/* Status Chips */}
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px]">
                  Active (14)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] border border-slate-200">
                  In Review (6)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] border border-slate-200">
                  Closed (42)
                </span>
              </div>

              <button
                onClick={onLaunchApp}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New Intake
              </button>
            </div>
          </div>

          {/* Sub-Header Navigation in Embedded Window */}
          <div className="bg-slate-100/70 border-b border-slate-200/80 px-6 py-2 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-4 font-medium">
              <button
                onClick={() => setActiveTab('board')}
                className={`py-1 border-b-2 transition-all ${
                  activeTab === 'board'
                    ? 'border-emerald-600 text-emerald-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Workflow Board
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`py-1 border-b-2 transition-all ${
                  activeTab === 'table'
                    ? 'border-emerald-600 text-emerald-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Cross-Market Matrix
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`py-1 border-b-2 transition-all ${
                  activeTab === 'list'
                    ? 'border-emerald-600 text-emerald-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Lineage Provenance
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Connected: Firebase Firestore & SHA-256 Seal
            </div>
          </div>

          {/* Kanban Board View */}
          <div className="p-6 bg-slate-50/50 overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 min-w-[980px]">
              {boardColumns.map((col, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  {/* Column Header */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
                    <span className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full border-2 ${col.color}`} />
                      {col.title}
                    </span>
                    <span className="text-slate-400 font-semibold">{col.count}</span>
                  </div>

                  {/* Column Cards */}
                  <div className="space-y-3">
                    {col.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={onLaunchApp}
                        className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.tagColor}`}
                          >
                            {item.tag}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.version}
                          </span>
                        </div>

                        <h4 className="mt-2 text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {item.product}
                        </h4>
                        <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                          {item.change}
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={item.avatar}
                              alt={item.assignee}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="text-slate-600 truncate max-w-[80px]">
                              {item.assignee}
                            </span>
                          </div>
                          <span>{item.hash}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Bar inside Embedded Window */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-900">Current Focus:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                  Keytruda Section 4.4 Warnings Harmonization
                </span>
                <span className="text-slate-400">|</span>
                <span>Deterministic Exact Diff: 100% Verified</span>
              </div>
              <button
                onClick={onLaunchApp}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                Open Full OS View <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
