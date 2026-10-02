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
  UserCheck
} from 'lucide-react';

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
  const [agents, setAgents] = useState<AgentState[]>([
    {
      id: 'agent-1',
      name: 'Ingestion & Hash Lock Agent',
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
      model: 'gemini-3.1-pro-preview / 3.8-flash',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold mb-2 border border-purple-200">
            <Cpu className="w-3.5 h-3.5" />
            Agentic AI Multi-Agent Orchestration Swarm
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Multi-Agent Swarm Orchestration & HITL Automation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Specialized micro-agents collaborate under deterministic boundaries. AI proposes candidates;
            qualified human authorities govern binding decisions.
          </p>
        </div>

        <button
          onClick={handleRunSwarmSweep}
          disabled={isOrchestrating}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isOrchestrating ? 'animate-spin' : ''}`} />
          {isOrchestrating ? 'Orchestrating Swarm...' : 'Trigger Multi-Agent Swarm Sweep'}
        </button>
      </div>

      {swarmOutput && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-300 text-purple-900 text-xs font-medium flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
          <span>{swarmOutput}</span>
        </div>
      )}

      {/* Swarm Telemetry Band */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Orchestration Topology
          </span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">6 Active Specialized Agents</div>
          <span className="text-xs text-emerald-600 font-semibold">Deterministic + Gemini 3.1 Swarm</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Average Swarm Latency
          </span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">260 ms</div>
          <span className="text-xs text-purple-600 font-semibold">Gemini 3.1 Flash-Lite Engine</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Human-In-The-Loop Boundary
          </span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">Zero Autonomous Submissions</div>
          <span className="text-xs text-amber-700 font-semibold">Mandatory Qualified Sign-Off</span>
        </div>
      </div>

      {/* Active Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold truncate max-w-[170px]">
                  {agent.model}
                </span>

                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                    agent.status === 'CONSENSUS_REACHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : agent.status === 'AWAITING_HUMAN_GATE'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {agent.status.replace(/_/g, ' ')}
                </span>
              </div>

              <h4 className="mt-2 text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-600 shrink-0" />
                {agent.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-snug">{agent.role}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 font-medium">
                {agent.summary}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Latency: {agent.latencyMs} ms</span>
                <span>Confidence: {(agent.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
