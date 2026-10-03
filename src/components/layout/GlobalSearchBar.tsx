import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Layers,
  FileText,
  Globe2,
  GitCompare,
  ArrowRight,
  X,
  Command,
  ShieldCheck,
  Clock,
  Sparkles,
  BarChart3,
  Target,
  Award,
  Download,
  CheckCircle2,
  Cpu,
  CornerDownLeft,
  ChevronRight
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_CROSS_MARKET, MOCK_TASKS } from '../../data/mockData';

export interface CommandItem {
  id: string;
  category: 'ACTION' | 'PRODUCT' | 'SECTION' | 'MARKET' | 'COMPLIANCE';
  title: string;
  subtitle: string;
  badge?: string;
  targetTab: string;
  shortcut?: string;
  actionPayload?: string;
}

interface GlobalSearchBarProps {
  onSelectResult: (targetTab: string) => void;
  isDarkTheme?: boolean;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  onSelectResult,
  isDarkTheme = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Command palette registry
  const allCommands: CommandItem[] = [
    // Core Quick Actions
    {
      id: 'act-diff',
      category: 'ACTION',
      title: 'Launch Deterministic Diff Engine',
      subtitle: 'Compare CCDS Rev 15 against US SPL v15.0 with zero hallucination',
      badge: 'Core Tool',
      targetTab: 'compare',
      shortcut: '↵',
    },
    {
      id: 'act-infographics',
      category: 'ACTION',
      title: 'Open Visual Infographic Dashboard',
      subtitle: 'Executive lifecycle funnel, 84/16 deterministic ratio, velocity metrics',
      badge: 'Infographics',
      targetTab: 'infographics',
    },
    {
      id: 'act-goal',
      category: 'ACTION',
      title: 'Open Goal Interpreter & Plan Schema Studio',
      subtitle: 'Generate bounded JSON execution plan schemas for regulatory objectives',
      badge: 'Schema',
      targetTab: 'goal-schema',
    },
    {
      id: 'act-export',
      category: 'COMPLIANCE',
      title: 'Export GxP Inspection Dossier (21 CFR Part 11)',
      subtitle: 'Generate official PDF certificate, SHA-256 seal records, and audit package',
      badge: 'GxP Dossier',
      targetTab: 'compliance',
    },
    {
      id: 'act-swarm',
      category: 'ACTION',
      title: 'Multi-Agent AI Swarm & Consensus Hub',
      subtitle: 'Coordinate 6 specialized regulatory micro-agents with mandatory HITL sign-off',
      badge: 'HITL Gate',
      targetTab: 'swarm',
    },
    {
      id: 'act-reviews',
      category: 'ACTION',
      title: 'Open Human Review Queue',
      subtitle: 'Pending medical and regulatory sign-offs requiring electronic signature',
      badge: '3 Pending',
      targetTab: 'reviews',
    },

    // Pharmaceutical Master Products
    ...MOCK_PRODUCTS.map((p) => ({
      id: `prod-${p.id}`,
      category: 'PRODUCT' as const,
      title: `${p.tradeName} (${p.inn})`,
      subtitle: `${p.therapeuticArea} • Current CCDS: ${p.ccdsCurrentVersion} • Markets: ${p.markets.join(', ')}`,
      badge: 'Master Product',
      targetTab: 'products',
    })),

    // Clinical Sections & Safety Triggers
    {
      id: 'sec-warnings',
      category: 'SECTION',
      title: 'Section 4.4 / 5.1 Special Warnings & Precautions',
      subtitle: 'Mandatory transaminase monitoring (AST/ALT) & Grade 3/4 hepatitis rule',
      badge: 'High Impact',
      targetTab: 'compare',
    },
    {
      id: 'sec-contra',
      category: 'SECTION',
      title: 'Section 4.3 Contraindications',
      subtitle: 'Hypersensitivity & Medullary Thyroid Carcinoma (MTC) risk harmonization',
      badge: 'Contraindication',
      targetTab: 'compare',
    },
    {
      id: 'sec-posology',
      category: 'SECTION',
      title: 'Section 4.2 Posology & Method of Administration',
      subtitle: 'Semaglutide 2 mg dose titration & missed administration schedule',
      badge: 'Dosing',
      targetTab: 'compare',
    },
    {
      id: 'sec-adverse',
      category: 'SECTION',
      title: 'Section 4.8 Undesirable Effects / Adverse Reactions',
      subtitle: 'Immune-mediated pneumonitis, colitis, and endocrine dysfunction frequencies',
      badge: 'Pharmacovigilance',
      targetTab: 'compare',
    },

    // Regional Markets
    ...MOCK_CROSS_MARKET.map((cm) => ({
      id: `mkt-${cm.id}`,
      category: 'MARKET' as const,
      title: `${cm.market} • ${cm.canonicalConcept}`,
      subtitle: `Core ${cm.coreVersion} → Local ${cm.localVersion} • Status: ${cm.status}`,
      badge: cm.status,
      targetTab: 'cross-market',
    })),
  ];

  // Filter commands
  const filteredCommands = allCommands.filter((item) => {
    if (activeCategory !== 'ALL' && item.category !== activeCategory) {
      return false;
    }
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  });

  // Global hotkey handler (⌘K / Ctrl+K and ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Keyboard navigation inside modal (Arrows + Enter)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleExecute(filteredCommands[selectedIndex]);
      }
    }
  };

  const handleExecute = (item: CommandItem) => {
    onSelectResult(item.targetTab);
    setIsOpen(false);
    setQuery('');
  };

  const getCategoryIcon = (category: CommandItem['category']) => {
    switch (category) {
      case 'ACTION':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'PRODUCT':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'SECTION':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'MARKET':
        return <Globe2 className="w-4 h-4 text-blue-600" />;
      case 'COMPLIANCE':
        return <Award className="w-4 h-4 text-teal-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <>
      {/* Search Bar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
          isDarkTheme
            ? 'bg-white/10 hover:bg-white/15 text-emerald-200 border border-white/10 hover:border-emerald-400/40 shadow-xs'
            : 'bg-slate-100 hover:bg-slate-200/90 text-slate-600 border border-slate-200 shadow-xs'
        }`}
        title="Open Command Palette (⌘K)"
      >
        <Search className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
        <span className="font-semibold text-slate-700">Quick Command Palette</span>
        <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-slate-500 border border-slate-200 shadow-2xs">
          ⌘K
        </kbd>
      </button>

      {/* Command Palette Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-14 sm:pt-20 px-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 relative overflow-hidden text-slate-900 animate-in zoom-in-95 duration-150 my-auto sm:my-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Search Input */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/70">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <Command className="w-4 h-4" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command, product, section, or task (e.g. Diff, Keytruda, 4.4)..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleInputKeyDown}
                  className="w-full text-sm bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Clear query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold shrink-0"
                title="Close Command Palette (ESC)"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Scope:</span>
              {[
                { id: 'ALL', label: 'All Commands' },
                { id: 'ACTION', label: 'Actions' },
                { id: 'PRODUCT', label: 'Products' },
                { id: 'SECTION', label: 'Sections' },
                { id: 'MARKET', label: 'Markets' },
                { id: 'COMPLIANCE', label: 'Compliance' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSelectedIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Command List Items */}
            <div
              ref={listRef}
              className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 text-xs"
            >
              {filteredCommands.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs space-y-2">
                  <p>No matching commands or entities for "{query}".</p>
                  <p className="text-[11px] text-slate-400">
                    Try searching for <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Diff</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Keytruda</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">4.4</code>, or <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Export</code>.
                  </p>
                </div>
              ) : (
                filteredCommands.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleExecute(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-purple-50/80 text-purple-950 border border-purple-200 shadow-xs'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {getCategoryIcon(item.category)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 leading-snug">
                              {item.title}
                            </h4>
                            {item.badge && (
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                isSelected ? 'bg-purple-200 text-purple-900' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                            Select <CornerDownLeft className="w-2.5 h-2.5" />
                          </span>
                        )}
                        <ArrowRight className={`w-4 h-4 transition-transform ${
                          isSelected ? 'text-purple-700 translate-x-0.5' : 'text-slate-300'
                        }`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono">↓</kbd>
                  to navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono">↵</kbd>
                  to select
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono">ESC</kbd>
                  to close
                </span>
              </div>
              <span className="font-semibold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                CANON Command Palette
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
