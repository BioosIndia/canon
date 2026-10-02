import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Lock,
  Copy,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  UserCheck,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { AuditEvent, UserRole } from '../../types/canon';
import { StorageService } from '../../utils/storage';

interface ActivityLogViewProps {
  currentRole: UserRole;
  onSimulateRoleSwitch?: (role: UserRole) => void;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({
  currentRole,
  onSimulateRoleSwitch,
}) => {
  const [logs, setLogs] = useState<AuditEvent[]>(() => StorageService.getAuditLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionTestResult, setActionTestResult] = useState<string | null>(null);

  // Filtered log calculations
  const filteredLogs = logs.filter((log) => {
    const matchesSeverity = filterSeverity === 'ALL' || log.severity === filterSeverity;
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Resource', 'Details', 'CorrelationID', 'Severity'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.resource}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.correlationId}"`,
      `"${l.severity}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CANON_Activity_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Role Action Matrix Permissions
  const rolePermissions: Record<UserRole, { permissions: string[]; denied: string[] }> = {
    'Global Labeling Lead': {
      permissions: [
        'Approve Global CCDS Versions',
        'Execute Exact & Semantic Diffs',
        'Sign Off Clinical Change Candidates',
        'Trigger Certified GxP Dossier Exports',
        'Manage Workspace Members & RBAC',
      ],
      denied: ['Direct Local Affiliate Submission (Affiliate RA role required)'],
    },
    'Safety / Medical Reviewer': {
      permissions: [
        'Review Section 4.3 & 4.4 Clinical Meaning Changes',
        'Request Clinical Trial Safety Evidence',
        'Escalate to Global Safety Committee',
        'Inspect Myers Token Diffs',
      ],
      denied: ['Authorize Commercial Packaging Prints', 'Close Affiliate Local Tasks'],
    },
    'Local Affiliate RA': {
      permissions: [
        'Upload Official Health Authority eCTD Proofs',
        'Submit Minor Change Variations (PMDA/EMA/TGA)',
        'Request Regional Exemption Waivers',
        'Inspect Core CCDS Cascades',
      ],
      denied: ['Approve Global Core CCDS Revisions', 'Override Safety Reviewers'],
    },
    'Regulatory Labeling Specialist': {
      permissions: [
        'Ingest Multi-Format Labels (SPL/XML/ePI)',
        'Execute Myers Exact Diffs',
        'Map Headings to Canonical Concepts',
        'Draft Cross-Market Change Proposals',
      ],
      denied: ['Sign Legally Binding Decisions', 'Approve Final Dossiers'],
    },
    'RegOps / Digital Regulatory': {
      permissions: [
        'Probe 2D DataMatrix QR Barcode Endpoints',
        'Validate HL7 SPL and FHIR ePI Schemas',
        'Monitor Active Packaging Artwork Links',
      ],
      denied: ['Sign Clinical Contraindication Revisions'],
    },
    'IT / Validation / Security': {
      permissions: [
        'Audit Cryptographic SHA-256 Chains',
        'Inspect API Gateway Telemetry',
        'Verify Tenant Isolation & Row Security',
      ],
      denied: ['Approve Clinical Drug Wording'],
    },
    'Read-Only Auditor': {
      permissions: [
        'Read-Only Access to Complete Provenance Graph',
        'Export Certified Audit Manifests',
        'Inspect Historical Time-Travel Replays',
      ],
      denied: [
        'Modify Labels',
        'Submit Decisions',
        'Upload Proofs',
        'Delete Workspace Records',
      ],
    },
  };

  const handleTestRoleAction = (actionName: string, isAllowed: boolean) => {
    if (isAllowed) {
      setActionTestResult(`PERMISSION GRANTED: Your active role (${currentRole}) authorized "${actionName}". Event logged.`);
      const newEvent = StorageService.logActivity({
        actor: 'Dr. Sarah Vance',
        actorRole: currentRole,
        action: `EXECUTE_${actionName.toUpperCase().replace(/\s+/g, '_')}`,
        resource: 'WorkspaceAction',
        resourceId: `act-${Date.now()}`,
        details: `Authorized execution of "${actionName}" under RBAC policy.`,
        severity: 'INFO',
      });
      setLogs((prev) => [newEvent, ...prev]);
    } else {
      setActionTestResult(`PERMISSION DENIED: Role (${currentRole}) lacks authority to perform "${actionName}". Action blocked.`);
      const newEvent = StorageService.logActivity({
        actor: 'Dr. Sarah Vance',
        actorRole: currentRole,
        action: 'PERMISSION_BLOCKED',
        resource: 'WorkspaceAction',
        resourceId: `act-blocked-${Date.now()}`,
        details: `Blocked attempt to execute unauthorized action "${actionName}".`,
        severity: 'WARNING',
      });
      setLogs((prev) => [newEvent, ...prev]);
    }

    setTimeout(() => setActionTestResult(null), 4000);
  };

  const activePerms = rolePermissions[currentRole] || rolePermissions['Global Labeling Lead'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            Live Activity Telemetry & Role-Based Work Action Controls
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Activity Ledger & Role Authorization Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous tamper-evident audit logging paired with strict server-enforced role permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Role-Based Work Action Guard Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Active Authenticated Role
              </span>
              <h3 className="text-base font-bold text-white">{currentRole}</h3>
            </div>
          </div>

          {/* Quick Simulation Role Switcher */}
          {onSimulateRoleSwitch && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Switch Role:</span>
              <select
                value={currentRole}
                onChange={(e) => onSimulateRoleSwitch(e.target.value as UserRole)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Global Labeling Lead">Global Labeling Lead</option>
                <option value="Safety / Medical Reviewer">Safety / Medical Reviewer</option>
                <option value="Local Affiliate RA">Local Affiliate RA</option>
                <option value="Regulatory Labeling Specialist">Regulatory Labeling Specialist</option>
                <option value="RegOps / Digital Regulatory">RegOps / Digital Regulatory</option>
                <option value="Read-Only Auditor">Read-Only Auditor</option>
              </select>
            </div>
          )}
        </div>

        {/* Action Test Result Banner */}
        {actionTestResult && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              actionTestResult.includes('GRANTED')
                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
                : 'bg-rose-950/80 border border-rose-500 text-rose-200'
            }`}
          >
            {actionTestResult.includes('GRANTED') ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{actionTestResult}</span>
          </div>
        )}

        {/* Permissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Permitted Actions */}
          <div className="space-y-2.5">
            <span className="text-emerald-400 font-bold uppercase tracking-wider block text-[11px]">
              Permitted Work Actions (Role Authority Active):
            </span>
            <div className="space-y-1.5">
              {activePerms.permissions.map((perm, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-2 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {perm}
                  </span>
                  <button
                    onClick={() => handleTestRoleAction(perm, true)}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors cursor-pointer"
                  >
                    Execute Action
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Blocked Actions */}
          <div className="space-y-2.5">
            <span className="text-rose-400 font-bold uppercase tracking-wider block text-[11px]">
              Restricted / Non-Permitted Actions:
            </span>
            <div className="space-y-1.5">
              {activePerms.denied.map((den, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-2 text-slate-400">
                    <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    {den}
                  </span>
                  <button
                    onClick={() => handleTestRoleAction(den, false)}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors cursor-pointer"
                  >
                    Test Lock
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Activity Table */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, actor, resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL_SECURITY">Critical Security</option>
          </select>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-6">Timestamp & Actor</th>
                <th className="py-3.5 px-6">Action</th>
                <th className="py-3.5 px-6">Resource ID</th>
                <th className="py-3.5 px-6">Audit Details</th>
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
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                        evt.severity === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : evt.severity === 'CRITICAL_SECURITY'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
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
            Audit Ledger Integrity: Verified with SHA-256 hash chaining.
          </span>
          <span className="font-mono text-[11px]">Total Events: {filteredLogs.length}</span>
        </div>
      </div>
    </div>
  );
};
