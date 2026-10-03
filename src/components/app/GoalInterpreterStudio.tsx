import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  FileCode,
  Copy,
  Download,
  Check,
  ShieldCheck,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Lock,
  Clock,
  Cpu,
  FileText
} from 'lucide-react';
import { GoalAndPlannerService } from '../../services/goalAndPlannerService';
import { BoundedPlan, GoalInterpretation, PlanStep } from '../../types/canon';
import { StorageService } from '../../utils/storage';

export const GoalInterpreterStudio: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('TEMPL_CCDS_ALIGN');
  const [goalPrompt, setGoalPrompt] = useState<string>(
    'Harmonize Keytruda CCDS Rev 15 liver function warnings with US Prescribing Information and EU SmPC, flagging clinical drift.'
  );

  const [interpretedGoal, setInterpretedGoal] = useState<GoalInterpretation>(() =>
    GoalAndPlannerService.interpretGoal(
      'Harmonize Keytruda CCDS Rev 15 liver function warnings with US Prescribing Information and EU SmPC, flagging clinical drift.',
      'Global Labeling Lead',
      'tenant-global-pharma'
    )
  );

  const [generatedPlan, setGeneratedPlan] = useState<BoundedPlan>(() => {
    return GoalAndPlannerService.getPlans()[0];
  });

  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<'INTERPRETED_GOAL' | 'PLAN_SCHEMA' | 'STEP_PIPELINE'>('PLAN_SCHEMA');
  const [simulatedExecutionIndex, setSimulatedExecutionIndex] = useState<number>(3); // Step 4 in progress

  const templates = [
    {
      id: 'TEMPL_CCDS_ALIGN',
      title: 'Global CCDS Harmonization',
      prompt: 'Harmonize Keytruda CCDS Rev 15 liver function warnings with US Prescribing Information and EU SmPC, flagging clinical drift.',
      risk: 'HIGH_SAFETY_CRITICAL',
    },
    {
      id: 'TEMPL_SIGNAL_TRIAGE',
      title: 'Pediatric Safety Signal Triage',
      prompt: 'Analyze EMA PRAC signal for GLP-1 receptor agonist thyroid C-cell hyperplasia and evaluate impact across Section 4.4 and Section 4.3.',
      risk: 'HIGH_SAFETY_CRITICAL',
    },
    {
      id: 'TEMPL_EPI_PACK',
      title: 'ePI / 2D Barcode Verification Pack',
      prompt: 'Audit GS1 Digital Link 2D DataMatrix endpoint for Ozempic 1mg against DailyMed SPL v15.0 and flag superseded leaflet redirects.',
      risk: 'MEDIUM_VARIATION',
    },
    {
      id: 'TEMPL_PART11_AUDIT',
      title: '21 CFR Part 11 Inspection Dossier',
      prompt: 'Compile certified cryptographic audit trail, electronic signature non-repudiation ledger, and version provenance for FDA inspection.',
      risk: 'LOW_INFORMATIONAL',
    },
  ];

  const handleSelectTemplate = (templ: (typeof templates)[0]) => {
    setSelectedTemplate(templ.id);
    setGoalPrompt(templ.prompt);
    const parsed = GoalAndPlannerService.interpretGoal(templ.prompt, 'Global Labeling Lead', 'tenant-global-pharma');
    setInterpretedGoal(parsed);
  };

  const handleRunInterpret = () => {
    const parsed = GoalAndPlannerService.interpretGoal(goalPrompt, 'Global Labeling Lead', 'tenant-global-pharma');
    setInterpretedGoal(parsed);
    // Refresh generated plan
    const current = GoalAndPlannerService.getPlans()[0];
    setGeneratedPlan({
      ...current,
      goalId: parsed.goalId,
      goalSummary: parsed.goalText,
      planRevision: 1,
      sourceContext: {
        productName: parsed.productName,
        sourceVersion: 'CCDS Rev 15',
        targetVersion: parsed.labelVersionIds.join(', '),
        jurisdictions: parsed.marketScope,
      },
    });
  };

  const handleCopyPlanSchema = () => {
    const schemaContent = JSON.stringify(generatedPlan, null, 2);
    navigator.clipboard.writeText(schemaContent);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleDownloadPlanSchema = () => {
    const schemaContent = JSON.stringify(generatedPlan, null, 2);
    const blob = new Blob([schemaContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PRAMANEX_CANON_BoundedPlan_${generatedPlan.planId}_rev${generatedPlan.planRevision}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold mb-2 border border-purple-200">
            <Target className="w-3.5 h-3.5" />
            Bounded Agentic Planning & Schema Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Goal Interpreter & Formal Plan Schema Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Transforms unstructured regulatory requests into normalized, version-controlled Plan Schema contracts.
            Enforces deterministic tools before specialists, bounded cost/token budgets, and mandatory human review gates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyPlanSchema}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedSchema ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copiedSchema ? 'Schema Copied' : 'Copy Schema (JSON)'}
          </button>
          <button
            onClick={handleDownloadPlanSchema}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Schema (.json)
          </button>
        </div>
      </div>

      {/* Preset Regulatory Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {templates.map((templ) => (
          <button
            key={templ.id}
            onClick={() => handleSelectTemplate(templ)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedTemplate === templ.id
                ? 'bg-purple-50/70 border-purple-400 ring-2 ring-purple-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Template</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  templ.risk === 'HIGH_SAFETY_CRITICAL'
                    ? 'bg-rose-100 text-rose-800'
                    : templ.risk === 'MEDIUM_VARIATION'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {templ.risk.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">{templ.title}</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{templ.prompt}</p>
            </div>
            <span className="mt-3 text-[10px] font-bold text-purple-700 flex items-center gap-1">
              Load & Interpret <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        ))}
      </div>

      {/* Goal Input & Interpretation Studio */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Natural Regulatory Goal Request (Prompt):
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              rows={2}
              value={goalPrompt}
              onChange={(e) => setGoalPrompt(e.target.value)}
              className="flex-1 p-3 rounded-2xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-800 leading-relaxed font-sans"
              placeholder="Enter user or regulatory goal..."
            />
            <button
              onClick={handleRunInterpret}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer shrink-0 self-stretch sm:self-auto"
            >
              <Sparkles className="w-4 h-4" />
              Interpret Goal
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSchemaTab('PLAN_SCHEMA')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeSchemaTab === 'PLAN_SCHEMA'
                  ? 'border-purple-600 text-purple-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Formal Plan Schema (JSON Contract)
            </button>
            <button
              onClick={() => setActiveSchemaTab('STEP_PIPELINE')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeSchemaTab === 'STEP_PIPELINE'
                  ? 'border-purple-600 text-purple-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Execution Pipeline ({generatedPlan.steps.length} Bounded Steps)
            </button>
            <button
              onClick={() => setActiveSchemaTab('INTERPRETED_GOAL')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeSchemaTab === 'INTERPRETED_GOAL'
                  ? 'border-purple-600 text-purple-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Interpreted Goal Attributes
            </button>
          </div>

          <span className="text-[10px] font-mono text-slate-400">
            Contract Revision: Rev {generatedPlan.planRevision}
          </span>
        </div>

        {/* ========================================================= */}
        {/* SUBTAB 1: FORMAL PLAN SCHEMA (JSON) */}
        {/* ========================================================= */}
        {activeSchemaTab === 'PLAN_SCHEMA' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Standard: <strong className="text-slate-800">CANON Bounded Planner Schema v28.4</strong> • Schema Validator: <strong className="text-emerald-700">PASS (100% Valid)</strong>
              </span>
              <span className="font-mono text-[11px] text-purple-800">
                Plan ID: {generatedPlan.planId}
              </span>
            </div>

            <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 max-h-[500px]">
              <pre className="whitespace-pre-wrap">{JSON.stringify(generatedPlan, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 2: STEP-BY-STEP EXECUTION PIPELINE */}
        {/* ========================================================= */}
        {activeSchemaTab === 'STEP_PIPELINE' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Retry Budget</span>
                <span className="font-bold text-slate-800">{generatedPlan.retryBudget} Retries Allowed</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Time Budget</span>
                <span className="font-bold text-slate-800">{(generatedPlan.timeBudgetMs / 1000).toFixed(0)}s max runtime</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Cost Ceiling</span>
                <span className="font-bold text-slate-800">${(generatedPlan.costBudgetCents / 100).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Token Ceiling</span>
                <span className="font-bold text-slate-800 font-mono">{generatedPlan.tokenBudget.toLocaleString()} tokens</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {generatedPlan.steps.map((step, idx) => (
                <div
                  key={step.stepId}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    idx < simulatedExecutionIndex
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : idx === simulatedExecutionIndex
                      ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/20'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 ${
                      idx < simulatedExecutionIndex
                        ? 'bg-emerald-600 text-white'
                        : idx === simulatedExecutionIndex
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {step.sequence}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{step.purpose}</span>
                        {step.humanGate && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            HITL GATE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-3">
                        <span>Tool: <strong className="text-slate-800">{step.toolOrSpecialist}</strong></span>
                        <span>Permission: <code className="font-mono text-slate-700 text-[10px]">{step.requiredPermission}</code></span>
                        <span>Schema: <code className="font-mono text-purple-700 text-[10px]">{step.expectedOutputSchema}</code></span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Validation Rule: {step.validationRule}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      idx < simulatedExecutionIndex
                        ? 'bg-emerald-100 text-emerald-800'
                        : idx === simulatedExecutionIndex
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {idx < simulatedExecutionIndex ? 'COMPLETED' : idx === simulatedExecutionIndex ? 'AWAITING_HUMAN_GATE' : 'PENDING'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBTAB 3: INTERPRETED GOAL ATTRIBUTES */}
        {/* ========================================================= */}
        {activeSchemaTab === 'INTERPRETED_GOAL' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Goal ID</span>
                <span className="font-mono font-bold text-slate-900">{interpretedGoal.goalId}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Goal Classification</span>
                <span className="font-bold text-purple-800">{interpretedGoal.goalType}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Risk Class</span>
                <span className="font-bold text-amber-800">{interpretedGoal.riskClass}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">Target Product & Version Identity:</span>
                <span className="font-bold text-slate-900">{interpretedGoal.productName} ({interpretedGoal.productId})</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Jurisdiction Market Scope:</span>
                <div className="flex gap-1.5">
                  {interpretedGoal.marketScope.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-slate-800 text-[11px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Mandatory Permissions Required:</span>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {interpretedGoal.requiredPermissions.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-600">
                <span>Human Review Required: <strong className="text-amber-800">{interpretedGoal.requiresHumanReview ? 'YES (Mandatory Gate)' : 'NO'}</strong></span>
                <span>Tenant Isolation: <strong className="text-slate-800">{interpretedGoal.tenantId}</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
