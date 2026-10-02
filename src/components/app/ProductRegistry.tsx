import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Layers,
  FileText,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Tag
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_LABEL_VERSIONS } from '../../data/mockData';
import { PharmaceuticalProduct, LabelVersion } from '../../types/canon';

interface ProductRegistryProps {
  onSelectVersionForDiff: (versionId: string) => void;
  onNavigate: (view: string) => void;
}

export const ProductRegistry: React.FC<ProductRegistryProps> = ({
  onSelectVersionForDiff,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<PharmaceuticalProduct>(MOCK_PRODUCTS[0]);
  const [filterMarket, setFilterMarket] = useState('ALL');

  const filteredProducts = MOCK_PRODUCTS.filter(
    (p) =>
      p.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.inn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.therapeuticArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productVersions = MOCK_LABEL_VERSIONS.filter(
    (v) =>
      v.productId === selectedProduct.id &&
      (filterMarket === 'ALL' || v.market === filterMarket)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <Layers className="w-3.5 h-3.5" />
            Master Product & Version Registry
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Authoritative Label Source, Product & Version Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically anchored pharmaceutical master registry with cross-market version lineages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product, INN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-56 text-slate-800"
            />
          </div>
          <button
            onClick={() => onNavigate('intake')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Version
          </button>
        </div>
      </div>

      {/* Main Layout: Products List (Left) + Selected Product Details & Version Tree (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
            Registered Products ({filteredProducts.length})
          </h3>
          <div className="space-y-2.5">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedProduct.id === prod.id
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-600/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{prod.tradeName}</h4>
                    <p className="text-xs text-slate-600 font-medium">{prod.inn}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prod.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {prod.status}
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-slate-500 line-clamp-1">
                  {prod.therapeuticArea}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{prod.ccdsCurrentVersion}</span>
                  <span className="font-semibold text-emerald-700">
                    {prod.markets.length} Markets
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Master Details & Version History (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Product Master Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{selectedProduct.tradeName}</h2>
                  <span className="text-sm text-slate-500 font-medium">({selectedProduct.inn})</span>
                </div>
                <p className="text-xs text-slate-500">{selectedProduct.therapeuticArea}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {selectedProduct.dosageForm}
                </span>
                <button
                  onClick={() => onNavigate('compare')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Compare Versions
                </button>
              </div>
            </div>

            {/* Authorizations & Regulatory Identifiers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              {selectedProduct.authorizations.map((auth, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {auth.type} Identifier
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">{auth.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-slate-500">Declared Strengths:</span>
              {selectedProduct.strengths.map((str, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium"
                >
                  {str}
                </span>
              ))}
            </div>
          </div>

          {/* Version Lineage Tree */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Authorized Label Versions & Hash Registry
                </h3>
                <p className="text-xs text-slate-500">
                  Immutable version records with SHA-256 integrity and source coordinates.
                </p>
              </div>

              {/* Market filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Market:</span>
                <select
                  value={filterMarket}
                  onChange={(e) => setFilterMarket(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">All Markets</option>
                  <option value="US">US (FDA)</option>
                  <option value="EU">EU (EMA)</option>
                  <option value="JP">Japan (PMDA)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {productVersions.map((ver) => (
                <div
                  key={ver.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/50 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-slate-900 text-white">
                        {ver.versionNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {ver.authority} ({ver.market})
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                        {ver.labelType}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ver.status === 'CURRENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {ver.status}
                      </span>
                    </div>

                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Effective: {ver.effectiveDate}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">SHA-256 Hash Seal:</span>
                      <span className="text-emerald-700 font-bold truncate block">{ver.sha256Hash}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Format & Ingestion:</span>
                      <span className="text-slate-700 block">{ver.format} • {ver.capturedTimestamp}</span>
                    </div>
                  </div>

                  {/* Sections list inside this version */}
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {ver.sections.length} Canonical Sections Indexed
                    </span>
                    <button
                      onClick={() => onSelectVersionForDiff(ver.id)}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      Inspect in Diff Engine <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
