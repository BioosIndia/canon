import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Lock, Copy, CheckCircle2, Clock } from 'lucide-react';
import { MOCK_AUDIT_EVENTS } from '../../data/mockData';
import { AuditEvent } from '../../types/canon';

export const AuditLogView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = MOCK_AUDIT_EVENTS.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-2 border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            21 CFR Part 11 & GxP Compliance
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Immutable Audit Trail & Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed event ledger capturing all source registrations, diff operations,
            human decisions, and implementation proofs.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, actor, resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64 text-slate-800"
          />
        </div>
      </div>

      {/* Audit Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-6">Timestamp & Actor</th>
                <th className="py-3.5 px-6">Action / Event</th>
                <th className="py-3.5 px-6">Target Resource</th>
                <th className="py-3.5 px-6">Event Details</th>
                <th className="py-3.5 px-6">Correlation ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-900 block">{evt.actor}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                      {evt.actorRole}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900 text-white font-mono">
                      {evt.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-[11px] text-slate-700">
                    {evt.resource}
                  </td>
                  <td className="py-4 px-6 text-slate-600 max-w-sm leading-relaxed">
                    {evt.details}
                  </td>
                  <td className="py-4 px-6 font-mono text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span>{evt.correlationId}</span>
                      <button
                        onClick={() => handleCopyId(evt.correlationId)}
                        className="hover:text-slate-700 cursor-pointer"
                        title="Copy Correlation ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    {copiedId === evt.correlationId && (
                      <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">
                        Copied
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Hash Chaining Active: Tamper-evident ledger replicated to persistent storage.
          </span>
          <span className="font-mono text-[11px]">Ledger State: HEALTHY</span>
        </div>
      </div>
    </div>
  );
};
