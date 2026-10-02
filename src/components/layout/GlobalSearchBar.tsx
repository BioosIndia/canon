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
  Clock
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_LABEL_VERSIONS, MOCK_CROSS_MARKET, MOCK_TASKS } from '../../data/mockData';

interface SearchResult {
  id: string;
  category: 'PRODUCT' | 'LABEL_SECTION' | 'MARKET' | 'TASK';
  title: string;
  subtitle: string;
  badge: string;
  targetTab: string;
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Aggregate searchable items
  const allResults: SearchResult[] = [
    // Products
    ...MOCK_PRODUCTS.map((p) => ({
      id: `prod-${p.id}`,
      category: 'PRODUCT' as const,
      title: `${p.tradeName} (${p.inn})`,
      subtitle: `${p.therapeuticArea} • ${p.ccdsCurrentVersion}`,
      badge: 'Product',
      targetTab: 'products',
    })),
    // Sections
    {
      id: 'sec-warnings',
      category: 'LABEL_SECTION' as const,
      title: 'Section 4.4 / 5.1 Special Warnings & Precautions',
      subtitle: 'Keytruda • Transaminase baseline & Grade 3/4 hepatitis rule',
      badge: 'Section',
      targetTab: 'compare',
    },
    {
      id: 'sec-contra',
      category: 'LABEL_SECTION' as const,
      title: 'Section 4.3 Contraindications',
      subtitle: 'Keytruda & Ozempic • Hypersensitivity & MTC risk warning',
      badge: 'Section',
      targetTab: 'compare',
    },
    {
      id: 'sec-posology',
      category: 'LABEL_SECTION' as const,
      title: 'Section 4.2 Posology & Method of Administration',
      subtitle: 'Ozempic 2 mg maintenance titration protocol',
      badge: 'Section',
      targetTab: 'compare',
    },
    // Markets
    ...MOCK_CROSS_MARKET.map((cm) => ({
      id: `mkt-${cm.id}`,
      category: 'MARKET' as const,
      title: `${cm.market} • ${cm.localVersion}`,
      subtitle: `${cm.differencesSummary}`,
      badge: cm.status,
      targetTab: 'cross-market',
    })),
    // Tasks
    ...MOCK_TASKS.map((t) => ({
      id: `tsk-${t.id}`,
      category: 'TASK' as const,
      title: `${t.taskTitle}`,
      subtitle: `${t.productName} • ${t.market} (Lead: ${t.affiliateOwner})`,
      badge: t.status,
      targetTab: 'tasks',
    })),
  ];

  const filteredResults = query.trim()
    ? allResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          r.badge.toLowerCase().includes(query.toLowerCase())
      )
    : allResults.slice(0, 6);

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
    }
  };

  return (
    <>
      {/* Trigger Search Bar Button in Nav */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
          isDarkTheme
            ? 'bg-white/10 hover:bg-white/15 text-emerald-200 border border-white/10 hover:border-emerald-500/40'
            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200'
        }`}
      >
        <Search className="w-3.5 h-3.5 opacity-70" />
        <span className="hidden sm:inline">Search labels, INN, tasks...</span>
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 relative z-10 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-emerald-600 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products (Keytruda, Ozempic), sections (§4.4), markets, tasks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-sm bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400 font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-100 rounded text-slate-400 border border-slate-200">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 text-xs">
              {filteredResults.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No matching regulatory entities or label versions found for "{query}".
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
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
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
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Scoped across verified pharmaceutical master fixtures
              </span>
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
