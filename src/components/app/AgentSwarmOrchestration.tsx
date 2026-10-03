import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  GitFork,
  Activity,
  Layers,
  Cpu,
  UserCheck,
  Database,
  Lock,
  AlertTriangle,
  History,
  FileCheck,
  BookOpen,
  Filter,
  Check,
  HelpCircle,
  Clock,
  Play
} from 'lucide-react';
import { GoalAndPlannerService } from '../../services/goalAndPlannerService';
import { AgenticMemoryService } from '../../services/agenticMemoryService';
import { BoundedPlan, GovernedMemoryItem, MemoryClass, RePlanTrigger } from '../../types/canon';

interface AgentState {
  id: string;
  name: string;
  model: string;
  role: string;
  status: 'IDLE' | 'ANALYZING' | 'CONSENSUS_REACHED' | 'AWAITING_HUMAN_GATE';
  lastRunTime: string;
  latencyMs: number;
  confidence: number;
  summary: string;
}

export const AgentSwarmOrchestration: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'PLAN' | 'MEMORY' | 'SWARM_AGENTS' | 'GOAL_INTERPRETER'>('PLAN');

  // Planner state
  const [plans, setPlans] = useState<BoundedPlan[]>(GoalAndPlannerService.getPlans());
  const activePlan = plans[0] || null;
  const [isRePlanning, setIsRePlanning] = useState(false);
  const [rePlanNotice, setRePlanNotice] = useState<string | null>(null);

  // Goal Interpreter state
  const [rawGoalInput, setRawGoalInput] = useState('Compare Keytruda CCDS Rev 15 against EU SmPC and flag warnings drift');
  const [interpretedGoal, setInterpretedGoal] = useState<any>(null);

  // Memory state
  const [memories, setMemories] = useState<GovernedMemoryItem[]>(AgenticMemoryService.getMemories());
  const [selectedMemoryClass, setSelectedMemoryClass] = useState<MemoryClass | 'ALL'>('ALL');
  const [memoryFilterTenant, setMemoryFilterTenant] = useState('tenant-global-pharma');

  // Swarm Agents state
  const [agents, setAgents] = useState<AgentState[]>([
    {
      id: 'agent-1',
      name: 'Deterministic Ingestion Kernel',
      model: 'Deterministic Kernel (SHA-256)',
      role: 'Parses SPL XML & ePI FHIR bundles, computes cryptographic document seal.',
      status: 'CONSENSUS_REACHED',
      lastRunTime: '2 mins ago',
      latencyMs: 142,
      confidence: 1.0,
      summary: 'Verified DailyMed SPL v15.0 payload length and sealed 256-bit hash.',
    },
    {
      id: 'agent-2',
      name: 'Deterministic Exact-Diff Specialist',
      model: 'Myers Token Algorithm (Zero-Hallucination)',
      role: 'Word-level alignment and line coordinate calculation without generative interpolation.',
      status: 'CONSENSUS_REACHED',
      lastRunTime: '2 mins ago',
      latencyMs: 88,
      confidence: 1.0,
      summary: 'Identified 32 additions and 14 deletions across Section 4.4 and Section 4.3.',
    },
    {
      id: 'agent-3',
      name: 'Clinical Semantic Reasoning Agent',
      model: 'gemini-3.8-flash Clinical Reasoner',
      role: 'Classifies clinical meaning shifts, flags contraindications, and extracts uncertainties.',
      status: 'AWAITING_HUMAN_GATE',
      lastRunTime: '1 min ago',
      latencyMs: 640,
      confidence: 0.96,
      summary: 'Proposed SAFETY_WARNING_ADDITION candidate for transaminases. Dispatched to Human Gate.',
    },
    {
      id: 'agent-4',
      name: 'Cross-Market Harmonization Agent',
      model: 'gemini-3.5-flash Multi-Market Gateway',
      role: 'Scans 50+ local affiliate labels against Core CCDS Rev 15 to flag translation and version drift.',
      status: 'CONSENSUS_REACHED',
      lastRunTime: '4 mins ago',
      latencyMs: 410,
      confidence: 0.94,
      summary: 'Detected 1 Stale Affiliate (EU SmPC 14d lag) and 1 bilingual drift (PMDA Japan).',
    },
    {
      id: 'agent-5',
      name: '2D DataMatrix & ePI Endpoint Guard',
      model: 'GS1 Digital Link Protocol Validator',
      role: 'Probes live patient packaging QR codes against approved health authority portals.',
      status: 'CONSENSUS_REACHED',
      lastRunTime: '10 mins ago',
      latencyMs: 220,
      confidence: 0.99,
      summary: 'Alerted on Ozempic 1mg packaging targeting superseded v8.0 leaflet.',
    },
    {
      id: 'agent-6',
      name: 'GxP Part 11 Audit Attestation Agent',
      model: 'Cryptographic Ledger Guard',
      role: 'Signs each agent event with correlation IDs and binds reviewer digital signatures.',
      status: 'CONSENSUS_REACHED',
      lastRunTime: 'Just now',
      latencyMs: 65,
      confidence: 1.0,
      summary: 'Committed 18 events to immutable audit ledger. Ledger status: HEALTHY.',
    },
  ]);

  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [swarmOutput, setSwarmOutput] = useState<string | null>(null);

  const handleRunSwarmSweep = () => {
    setIsOrchestrating(true);
    setSwarmOutput(null);

    setAgents((prev) =>
      prev.map((a) => ({
        ...a,
        status: 'ANALYZING',
      }))
    );

    setTimeout(() => {
      setIsOrchestrating(false);
      setAgents((prev) =>
        prev.map((a, idx) => ({
          ...a,
          status: idx === 2 ? 'AWAITING_HUMAN_GATE' : 'CONSENSUS_REACHED',
          lastRunTime: 'Just now',
          latencyMs: Math.floor(80 + Math.random() * 400),
        }))
      );
      setSwarmOutput(
        'Multi-Agent Swarm sweep completed across 6 specialized agents. Consensus confidence: 97.8%. 1 candidate routed to Dr. Marcus Dubois for mandatory human review.'
      );
    }, 1200);
  };

  const handleTriggerRePlan = (trigger: RePlanTrigger, rationale: string) => {
    if (!activePlan) return;
    setIsRePlanning(true);
    setTimeout(() => {
      const updated = GoalAndPlannerService.triggerRePlan(
        activePlan.planId,
        trigger,
        rationale,
        'Dr. Sarah Vance, PharmD'
      );
      if (updated) {
        setPlans(GoalAndPlannerService.getPlans());
        setRePlanNotice(`Controlled Re-Plan committed to Revision ${updated.planRevision}. Trigger: ${trigger}.`);
      }
      setIsRePlanning(false);
      setTimeout(() => setRePlanNotice(null), 5000);
    }, 800);
  };

  const handleInterpretGoal = () => {
    const res = GoalAndPlannerService.interpretGoal(
      rawGoalInput,
      'Global Labeling Lead',
      'tenant-global-pharma'
    );
    setInterpretedGoal(res);
  };

  const handleInvalidateSource = (sourceRef: string) => {
    const count = AgenticMemoryService.invalidateSourceDependencies(
      sourceRef,
      'Annual SmPC renewal triggered supersession flag',
      'Compliance Officer'
    );
    setMemories(AgenticMemoryService.getMemories());
    alert(`Invalidation Cascade: Marked ${count} dependent memory records as STALE.`);
  };

  const filteredMemories = memories.filter((m) => {
    if (selectedMemoryClass !== 'ALL' && m.memoryType !== selectedMemoryClass) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold mb-2 border border-purple-200">
            <Cpu className="w-3.5 h-3.5" />
            Bounded Agentic Planning & Governed Memory Architecture
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Workflow Plan & Multi-Agent Swarm Orchestrator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic evidence first. Bounded planning with human governance gates, tenant-isolated memory, and controlled re-planning.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('PLAN')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'PLAN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Workflow Plan
          </button>
          <button
            onClick={() => setActiveSubTab('MEMORY')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'MEMORY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Governed Memory
          </button>
          <button
            onClick={() => setActiveSubTab('SWARM_AGENTS')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'SWARM_AGENTS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Specialist Agents
          </button>
          <button
            onClick={() => setActiveSubTab('GOAL_INTERPRETER')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'GOAL_INTERPRETER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Goal Interpreter
          </button>
        </div>
      </div>

      {rePlanNotice && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{rePlanNotice}</span>
          </div>
          <span className="text-[11px] font-mono text-amber-700">Audit Provenance Sealed</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. WORKFLOW PLAN PANEL (Section 10 of Specification) */}
      {/* ========================================================= */}
      {activeSubTab === 'PLAN' && activePlan && (
        <div className="space-y-6">
          {/* Main Plan Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-xs font-bold text-slate-400 font-mono">RUN ID: {activePlan.planId}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">
                    Revision {activePlan.planRevision}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activePlan.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activePlan.status === 'NEEDS_REVIEW'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {activePlan.status}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">{activePlan.goalSummary}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Product: <span className="font-semibold text-slate-700">{activePlan.sourceContext.productName}</span> • Jurisdictions: {activePlan.sourceContext.jurisdictions.join(', ')} • Initiated by {activePlan.createdBy}
                </p>
              </div>

              {/* Controlled Re-Planning Triggers */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block w-full lg:w-auto">
                  Controlled Re-Plan:
                </span>
                <button
                  onClick={() => handleTriggerRePlan('MISSING_EVIDENCE', 'Clinical Trial Protocol footnote not available in source SPL')}
                  disabled={isRePlanning}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Missing Evidence Trigger
                </button>
                <button
                  onClick={() => handleTriggerRePlan('HUMAN_REQUESTED_MORE_EVIDENCE', 'Safety reviewer Marcus Dubois requested PRAC Day 60 dossier')}
                  disabled={isRePlanning}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Request Reviewer Evidence
                </button>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Stage</span>
                <span className="font-bold text-slate-800 text-sm">Step 4: Human Review Gate</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Progress</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '60%' }} />
                  </div>
                  <span className="font-bold text-purple-700">60%</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Human Review Required</span>
                <span className="font-bold text-amber-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Mandatory (Safety)
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Token / Cost Budget</span>
                <span className="font-bold text-slate-800 font-mono">16k tokens / $0.25 max</span>
              </div>
            </div>

            {/* Plan Steps Sequence */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Deterministic Execution Sequence ({activePlan.steps.length} Steps)
              </h3>
              <div className="space-y-2.5">
                {activePlan.steps.map((step) => (
                  <div
                    key={step.stepId}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      step.status === 'COMPLETED'
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : step.status === 'BLOCKED'
                        ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 ${
                        step.status === 'COMPLETED'
                          ? 'bg-emerald-600 text-white'
                          : step.status === 'BLOCKED'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {step.sequence}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{step.purpose}</span>
                          {step.humanGate && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              HITL GATE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Executor: <span className="font-semibold text-slate-700">{step.toolOrSpecialist}</span> • Permission: <code className="font-mono text-[10px] text-slate-600">{step.requiredPermission}</code>
                        </p>
                        {step.failureReason && (
                          <p className="text-[11px] font-medium text-amber-800 mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                            Blocked Reason: {step.failureReason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        step.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : step.status === 'BLOCKED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence & Next Action Accordion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">Evidence Artifacts Locked:</span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  {activePlan.evidenceUsed.map((ev, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-emerald-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{ev}</span>
                    </li>
                  ))}
                  {activePlan.evidenceMissing.map((ev, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-amber-700 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Missing: {ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">Next Action Required:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Step 4 requires qualified medical reviewer (Dr. Marcus Dubois, MD) to review transaminase wording and execute cryptographic sign-off before dispatching to US and EU affiliate implementation teams.
                </p>
                <div className="pt-2">
                  <a
                    href="#reviews"
                    className="inline-flex items-center gap-1 text-purple-700 font-bold hover:underline"
                  >
                    Jump to Human Review Queue <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. GOVERNED AGENT MEMORY SUBSYSTEM */}
      {/* ========================================================= */}
      {activeSubTab === 'MEMORY' && (
        <div className="space-y-6">
          {/* Memory Controls Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-800">Filter Memory Class:</span>
              {(['ALL', 'WORKING', 'EPISODIC', 'SEMANTIC_DOMAIN', 'ORGANIZATION'] as const).map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedMemoryClass(cls)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedMemoryClass === cls
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cls.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Tenant Isolation:</span>
              <span className="font-mono bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg font-bold border border-purple-200">
                {memoryFilterTenant}
              </span>
            </div>
          </div>

          {/* Memory Records List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredMemories.map((mem) => (
              <div
                key={mem.memoryId}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-purple-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {mem.memoryType}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">ID: {mem.memoryId}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mem.reviewStatus === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : mem.reviewStatus === 'STALE'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {mem.reviewStatus}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{mem.title}</h4>
                  </div>

                  <div className="text-right text-xs">
                    <span className="font-bold text-purple-700 block">Freshness: {(mem.freshnessScore * 100).toFixed(0)}%</span>
                    <span className="text-[10px] text-slate-400">{mem.retentionPolicy}</span>
                  </div>
                </div>

                {/* Content Payload Preview */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(mem.content, null, 2)}</pre>
                </div>

                {/* Provenance & Invalidation Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="text-slate-500 text-[11px]">
                    Originator: <span className="font-semibold text-slate-700">{mem.provenance.originator}</span> ({mem.provenance.originatorType})
                    {mem.provenance.signatureHash && (
                      <span className="font-mono text-purple-700 ml-2">Seal: {mem.provenance.signatureHash.substring(0, 12)}...</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleInvalidateSource(mem.sourceRefs[0] || mem.memoryId)}
                      className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors cursor-pointer"
                    >
                      Simulate Invalidation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SPECIALIST AGENTS & SWARM MONITOR */}
      {/* ========================================================= */}
      {activeSubTab === 'SWARM_AGENTS' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Specialized Micro-Agents</h3>
              <p className="text-xs text-slate-500">Autonomous consensus engine operating under human governance boundary</p>
            </div>
            <button
              onClick={handleRunSwarmSweep}
              disabled={isOrchestrating}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isOrchestrating ? 'animate-spin' : ''}`} />
              {isOrchestrating ? 'Sweeping Swarm...' : 'Run Swarm Sweep'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      {agent.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        agent.status === 'CONSENSUS_REACHED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : agent.status === 'AWAITING_HUMAN_GATE'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {agent.status === 'CONSENSUS_REACHED' && <CheckCircle2 className="w-3 h-3" />}
                      {agent.status === 'AWAITING_HUMAN_GATE' && <UserCheck className="w-3 h-3" />}
                      {agent.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{agent.name}</h3>
                  <div className="text-[11px] font-medium text-purple-700 mt-0.5">{agent.model}</div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{agent.role}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-700">
                    <span className="font-bold block text-slate-900 mb-0.5">Latest Output:</span>
                    {agent.summary}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Latency: {agent.latencyMs}ms</span>
                    <span className="font-semibold text-slate-600">
                      Confidence: {(agent.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. GOAL INTERPRETER */}
      {/* ========================================================= */}
      {activeSubTab === 'GOAL_INTERPRETER' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Natural Language Goal Interpreter</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Normalizes user or workflow intent into a bounded, permission-scoped CANON goal contract.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">User or System Goal Input:</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={rawGoalInput}
                onChange={(e) => setRawGoalInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Enter regulatory request..."
              />
              <button
                onClick={handleInterpretGoal}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Interpret & Bind Goal
              </button>
            </div>
          </div>

          {interpretedGoal && (
            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider font-mono">
                  Goal Contract: {interpretedGoal.goalId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-200 text-purple-900">
                  Risk Class: {interpretedGoal.riskClass}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Goal Type:</span>
                  <span className="font-bold text-slate-900">{interpretedGoal.goalType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Required Permissions:</span>
                  <span className="font-mono text-purple-800">{interpretedGoal.requiredPermissions.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Human Gate Mandatory:</span>
                  <span className="font-bold text-amber-700">{interpretedGoal.requiresHumanReview ? 'YES' : 'NO'}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 pt-2 border-t border-purple-200">
                <span className="font-bold text-slate-900">Requested Output: </span>
                {interpretedGoal.requestedOutput}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
