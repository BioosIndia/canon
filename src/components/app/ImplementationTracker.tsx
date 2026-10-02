import React, { useState } from 'react';
import {
  FileCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
  Plus,
  Lock,
  FileText
} from 'lucide-react';
import { MOCK_TASKS } from '../../data/mockData';
import { ImplementationTask, ImplementationStatus, ProofAttachment } from '../../types/canon';
import { calculateSha256 } from '../../utils/diffEngine';

export const ImplementationTracker: React.FC = () => {
  const [tasks, setTasks] = useState<ImplementationTask[]>(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<ImplementationTask>(MOCK_TASKS[0]);

  // Upload proof modal state
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAdvanceStatus = (newStatus: ImplementationStatus) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Strict CANON Safety Rule: Cannot mark VERIFIED or CLOSED without verified proof
    if ((newStatus === 'VERIFIED' || newStatus === 'CLOSED') && selectedTask.proofs.length === 0) {
      setErrorMessage(
        'CANON SAFETY VIOLATION (Section 25 & 78): Cannot advance task to VERIFIED or CLOSED without attached and verified regulatory submission proof.'
      );
      return;
    }

    const updated = tasks.map((t) => {
      if (t.id === selectedTask.id) {
        return { ...t, status: newStatus };
      }
      return t;
    });

    setTasks(updated);
    setSelectedTask({ ...selectedTask, status: newStatus });
    setSuccessMessage(`Task advanced to status: ${newStatus}`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleAttachProof = async () => {
    if (!fileName.trim() || !trackingNumber.trim()) {
      alert('Please specify file name and Health Authority tracking number.');
      return;
    }

    const fileHash = await calculateSha256(`${fileName}:${trackingNumber}:${Date.now()}`);
    const newProof: ProofAttachment = {
      id: `proof-${Date.now()}`,
      fileName,
      fileHash,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Dr. Sarah Vance',
      submissionTrackingNumber: trackingNumber,
      verificationStatus: 'VERIFIED',
    };

    const updated = tasks.map((t) => {
      if (t.id === selectedTask.id) {
        return {
          ...t,
          status: 'VERIFICATION_REQUIRED' as ImplementationStatus,
          proofs: [...t.proofs, newProof],
        };
      }
      return t;
    });

    setTasks(updated);
    setSelectedTask({
      ...selectedTask,
      status: 'VERIFICATION_REQUIRED',
      proofs: [...selectedTask.proofs, newProof],
    });

    setIsUploading(false);
    setFileName('');
    setTrackingNumber('');
    setSuccessMessage('Proof artifact attached and cryptographic hash computed successfully.');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
            <FileCheck className="w-3.5 h-3.5" />
            Affiliate Implementation Control & Verification
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Affiliate Implementation Tracker & Proof Verification
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict regulatory gate: Tasks cannot be closed without verified eCTD receipts or health
            authority acknowledgment.
          </p>
        </div>

        <button
          onClick={() => setIsUploading(true)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Upload className="w-3.5 h-3.5 text-emerald-400" />
          Attach Submission Proof
        </button>
      </div>

      {/* Main Grid: Tasks List & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Tasks */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Active Market Implementation Tasks ({tasks.length})
          </h3>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedTask.id === task.id
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-1 ring-emerald-600/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900">{task.market}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.status === 'CLOSED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : task.status === 'SUBMITTED_TO_HA'
                        ? 'bg-teal-100 text-teal-800'
                        : task.status === 'VERIFICATION_REQUIRED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <h4 className="mt-2 text-sm font-bold text-slate-900">{task.taskTitle}</h4>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">{task.changeDescription}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Owner: {task.affiliateOwner}</span>
                  <span className="font-semibold text-emerald-700">
                    {task.proofs.length} Proofs Attached
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (7 Cols): Task Detail & Proof Gate */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {selectedTask.productName} • {selectedTask.market}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedTask.taskTitle}</h2>
              <p className="text-xs text-slate-600 mt-1">{selectedTask.changeDescription}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800">
              Due: {selectedTask.dueDate}
            </span>
          </div>

          {/* Error and Success Banners */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Workflow Status Advance Bar */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Regulatory Lifecycle Stage:
            </span>
            <div className="flex flex-wrap gap-2">
              {(['ASSIGNED', 'IN_PROGRESS', 'SUBMITTED_TO_HA', 'VERIFIED', 'CLOSED'] as ImplementationStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => handleAdvanceStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      selectedTask.status === st
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Attached Proofs Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                Attached Submission Proofs ({selectedTask.proofs.length})
              </h4>
              <button
                onClick={() => setIsUploading(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Attach Proof
              </button>
            </div>

            {selectedTask.proofs.length === 0 ? (
              <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-2">
                <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
                <p className="text-xs font-bold text-amber-900">
                  No Submission Proof Attached Yet
                </p>
                <p className="text-[11px] text-amber-700 max-w-sm mx-auto">
                  Per CANON regulatory rules, this task cannot be advanced to VERIFIED or CLOSED without
                  proof of health authority receipt.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedTask.proofs.map((proof) => (
                  <div
                    key={proof.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{proof.fileName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {proof.verificationStatus}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Tracking ID: <span className="font-mono font-semibold">{proof.submissionTrackingNumber}</span>
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      SHA-256: {proof.fileHash}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Proof Drawer / Modal Inline */}
          {isUploading && (
            <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-300 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Upload Regulatory Artifact Proof</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block">File Name / eCTD Sequence:</label>
                  <input
                    type="text"
                    placeholder="e.g. Health_Canada_Ack_Seq_0084.pdf"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block">HA Submission Tracking ID:</label>
                  <input
                    type="text"
                    placeholder="e.g. HC-CTL-2026-99120"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsUploading(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 font-semibold hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAttachProof}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Confirm & Hash Seal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
