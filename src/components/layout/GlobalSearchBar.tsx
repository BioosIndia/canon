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
  Filter,
  CheckCircle2
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_LABEL_VERSIONS, MOCK_CROSS_MARKET, MOCK_TASKS } from '../../data/mockData';

interface SearchResult {
  id: string;
  category: 'PRODUCT' | 'LABEL_SECTION' | 'MARKET' | 'TASK' | 'MODULE' | 'COMPLIANCE';
  title: string;
  subtitle: string;
  badge: string;
  targetTab: string;
  tags?: string[];
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
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PRODUCTS' | 'SECTIONS' | 'MARKETS' | 'MODULES'>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey (Cmd+K / Ctrl+K / Escape)
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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Comprehensive aggregate searchable index
  const allResults: SearchResult[] = [
    // Top Operating System Modules
    {
      id: 'mod-infographics',
      category: 'MODULE',
      title: 'Infographic Lifecycle & Audit Dashboard',
      subtitle: 'Executive visual analytics, turnaround velocity, 84/16 deterministic ratio',
      badge: 'Visual Hub',
      targetTab: 'infographics',
      tags: ['analytics', 'charts', 'graphical', 'funnel', 'velocity', 'audit'],
    },
    {
      id: 'mod-goal-planner',
      category: 'MODULE',
      title: 'Goal Interpreter & Plan Schema Studio',
      subtitle: 'Normalize natural regulatory goals into versioned JSON Plan Schemas',
      badge: 'Planner',
      targetTab: 'goal-schema',
      tags: ['goal', 'planner', 'schema', 'contract', 'json', 'agentic'],
    },
    {
      id: 'mod-compliance',
      category: 'MODULE',
      title: 'Compliance Audit & Export Center',
      subtitle: 'Official 21 CFR Part 11 inspection dossier, CSV/JSON export, hash ledger',
      badge: 'Part 11',
      targetTab: 'compliance',
      tags: ['audit', 'export', 'dossier', 'gxp', 'part 11', 'certificate'],
    },
    {
      id: 'mod-swarm',
      category: 'MODULE',
      title: 'Multi-Agent AI Swarm & HITL Gate',
      subtitle: '6 specialized micro-agents orchestrating consensus under human governance',
      badge: 'Swarm',
      targetTab: 'swarm',
      tags: ['swarm', 'hitl', 'agent', 'governance', 'consensus'],
    },
    {
      id: 'mod-diff',
      category: 'MODULE',
      title: 'Deterministic Exact Diff Engine',
      subtitle: 'Myers token algorithm with coordinate tracking and zero hallucination',
      badge: 'Core Engine',
      targetTab: 'compare',
      tags: ['diff', 'myers', 'compare', 'token', 'coordinate'],
    },
    {
      id: 'mod-reviews',
      category: 'MODULE',
      title: 'Human Review Queue (HITL Studio)',
      subtitle: 'Qualified labeling leads and medical reviewers binding cryptographic sign-offs',
      badge: 'HITL Queue',
      targetTab: 'reviews',
      tags: ['review', 'queue', 'human', 'signoff', 'signature', 'medical'],
    },

    // Products
    ...MOCK_PRODUCTS.map((p) => ({
      id: `prod-${p.id}`,
      category: 'PRODUCT' as const,
      title: `${p.tradeName} (${p.inn})`,
      subtitle: `${p.therapeuticArea} • Current: ${p.ccdsCurrentVersion} • Markets: ${p.markets.join(', ')}`,
      badge: 'Product',
      targetTab: 'products',
      tags: [p.tradeName.toLowerCase(), p.inn.toLowerCase(), p.therapeuticArea.toLowerCase(), 'oncology', 'diabetes'],
    })),

    // Clinical Label Sections
    {
      id: 'sec-warnings',
      category: 'LABEL_SECTION',
      title: 'Section 4.4 / 5.1 Special Warnings & Precautions',
      subtitle: 'Keytruda • Baseline transaminase (AST/ALT) monitoring and Grade 3/4 hepatitis rule',
      badge: 'Warnings',
      targetTab: 'compare',
      tags: ['warnings', 'hepatic', 'hepatitis', 'ast', 'alt', 'liver', 'safety'],
    },
    {
      id: 'sec-contra',
      category: 'LABEL_SECTION',
      title: 'Section 4.3 Contraindications',
      subtitle: 'Keytruda & Ozempic • Severe hypersensitivity and medullary thyroid carcinoma risk',
      badge: 'Contraindications',
      targetTab: 'compare',
      tags: ['contraindications', 'hypersensitivity', 'thyroid', 'mtc'],
    },
    {
      id: 'sec-posology',
      category: 'LABEL_SECTION',
      title: 'Section 4.2 Posology & Method of Administration',
      subtitle: 'Ozempic 2 mg maintenance dose titration and missed dose rule',
      badge: 'Posology',
      targetTab: 'compare',
      tags: ['posology', 'dosing', 'titration', 'subcutaneous', 'dose'],
    },
    {
      id: 'sec-adverse',
      category: 'LABEL_SECTION',
      title: 'Section 4.8 Undesirable Effects / Adverse Reactions',
      subtitle: 'Pneumonitis, colitis, endocrinopathies, and immune-mediated adverse reaction frequencies',
      badge: 'Safety',
      targetTab: 'compare',
      tags: ['adverse', 'side effects', 'reactions', 'pneumonitis', 'colitis'],
    },

    // Global Markets & Affiliates
    ...MOCK_CROSS_MARKET.map((cm) => ({
      id: `mkt-${cm.id}`,
      category: 'MARKET' as const,
      title: `${cm.market} • ${cm.canonicalConcept}`,
      subtitle: `Core ${cm.coreVersion} → Local ${cm.localVersion} • Status: ${cm.status}`,
      badge: cm.status,
      targetTab: 'cross-market',
      tags: [cm.market.toLowerCase(), cm.status.toLowerCase(), 'affiliate', 'regional'],
    })),

    // Implementation Tasks
    ...MOCK_TASKS.map((t) => ({
      id: `tsk-${t.id}`,
      category: 'TASK' as const,
      title: `${t.taskTitle}`,
      subtitle: `${t.productName} • ${t.market} (Lead: ${t.affiliateOwner}) • Due: ${t.dueDate}`,
      badge: t.status,
      targetTab: 'tasks',
      tags: [t.productName.toLowerCase(), t.market.toLowerCase(), t.status.toLowerCase(), 'affiliate task'],
    })),
  ];

  // Quick suggestion chips when input is empty
  const suggestionChips = [
    { label: 'Keytruda (pembrolizumab)', tab: 'products' },
    { label: '§4.4 Liver Warnings Diff', tab: 'compare' },
    { label: 'Visual Infographics', tab: 'infographics' },
    { label: 'Goal Interpreter & Schema', tab: 'goal-schema' },
    { label: 'Export GxP Audit Dossier', tab: 'compliance' },
    { label: 'Global Cross-Market Matrix', tab: 'cross-market' },
  ];

  const filteredResults = allResults.filter((r) => {
    // Filter by Category if selected
    if (selectedFilter === 'PRODUCTS' && r.category !== 'PRODUCT') return false;
    if (selectedFilter === 'SECTIONS' && r.category !== 'LABEL_SECTION') return false;
    if (selectedFilter === 'MARKETS' && r.category !== 'MARKET') return false;
    if (selectedFilter === 'MODULES' && r.category !== 'MODULE') return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    const matchTitle = r.title.toLowerCase().includes(q);
    const matchSubtitle = r.subtitle.toLowerCase().includes(q);
    const matchBadge = r.badge.toLowerCase().includes(q);
    const matchTags = r.tags?.some((t) => t.toLowerCase().includes(q));

    return matchTitle || matchSubtitle || matchBadge || matchTags;
  });

  const handleSelect = (item: SearchResult) => {
    onSelectResult(item.targetTab);
    setIsOpen(false);
    setQuery('');
  };

  const getCategoryIcon = (cat: SearchResult['category']) => {
    switch (cat) {
      case 'PRODUCT':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'LABEL_SECTION':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'MARKET':
        return <Globe2 className="w-4 h-4 text-blue-600" />;
      case 'TASK':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'MODULE':
        return <Sparkles className="w-4 h-4 text-[#0B3B2C]" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <>
      {/* Trigger Search Bar Button in Nav */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
          isDarkTheme
            ? 'bg-white/10 hover:bg-white/15 text-emerald-200 border border-white/10 hover:border-emerald-500/40 shadow-xs'
            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200'
        }`}
      >
        <Search className="w-3.5 h-3.5 opacity-80 text-emerald-400" />
        <span className="hidden sm:inline">Search labels, INN, §4.4, tasks...</span>
        <span className="sm:hidden">Search</span>
        <kbd
          className={`hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
            isDarkTheme ? 'bg-white/10 text-emerald-300' : 'bg-white text-slate-400 border border-slate-200'
          }`}
        >
          ⌘K
        </kbd>
      </button>

      {/* Global Search Dialog Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-14 sm:pt-20 px-4 overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Container */}
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 relative overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150 my-auto sm:my-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-emerald-600 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type product, section (§4.4), market, schema, or audit..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full text-sm bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Explicit Prominent Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold shrink-0"
                title="Close Search (ESC)"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
              {(['ALL', 'MODULES', 'PRODUCTS', 'SECTIONS', 'MARKETS'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    selectedFilter === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Suggestion Chips when query is empty */}
            {!query.trim() && (
              <div className="p-3.5 bg-emerald-50/50 border-b border-emerald-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Popular Quick Jumps:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestionChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onSelectResult(chip.tab);
                        setIsOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 text-slate-800 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-xs hover:bg-emerald-50"
                    >
                      <span>{chip.label}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-emerald-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 text-xs">
              {filteredResults.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs space-y-2">
                  <p>No matching regulatory entities or label versions found for "{query}".</p>
                  <p className="text-[11px] text-slate-400">
                    Try searching for <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Keytruda</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">4.4</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">infographics</code>, or <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">audit</code>.
                  </p>
                </div>
              ) : (
                filteredResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-50 flex items-center justify-center shrink-0 transition-colors">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {item.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer Helper */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Press ESC or click anywhere outside to close
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
              >
                Close dialog
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
