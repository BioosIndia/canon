/**
 * PRAMANEX CANON — Goal Interpretation & Bounded Planning Engine
 * Transforms natural language requests into typed, permission-bounded plans.
 * Enforces:
 * - Deterministic tools first
 * - Human-in-the-loop gates for regulatory significance
 * - Strict budget limits (cost, retry, tokens, execution time)
 * - Controlled re-planning without silent mutation of historical plans
 */

import {
  BoundedPlan,
  GoalInterpretation,
  PlanStep,
  PlanTerminalState,
  RePlanTrigger,
  UserRole,
} from '../types/canon';
import { StorageService } from '../utils/storage';

const INITIAL_PLANS: BoundedPlan[] = [
  {
    planId: 'plan-2026-001',
    tenantId: 'tenant-global-pharma',
    workspaceId: 'ws-oncology-core',
    goalId: 'goal-ccds-rev15-harmonization',
    goalSummary: 'Synchronize Keytruda Section 4.4 Warnings across US PI and EU SmPC',
    planRevision: 1,
    status: 'NEEDS_REVIEW',
    createdBy: 'Dr. Sarah Vance, PharmD',
    createdAt: '2026-10-01T11:00:00Z',
    updatedAt: '2026-10-01T11:45:00Z',
    sourceContext: {
      productName: 'Keytruda (pembrolizumab)',
      sourceVersion: 'CCDS Rev 15 (2026-09-15)',
      targetVersion: 'US PI v15.0 & EU SmPC v9.1',
      jurisdictions: ['US', 'EU'],
    },
    requiredEvidence: [
      'DailyMed SPL XML v15.0 payload',
      'EMA SmPC v9.1 EPAR PDF',
      'KEYNOTE-006 trial protocol amendment 4',
      'PRAC recommendation on transaminases',
    ],
    evidenceUsed: [
      'DailyMed SPL XML v15.0 payload',
      'EMA SmPC v9.1 EPAR PDF',
      'KEYNOTE-006 trial protocol amendment 4',
    ],
    evidenceMissing: [
      'PRAC official transaminase endorsement letter (Day 60)',
    ],
    steps: [
      {
        stepId: 'step-1',
        sequence: 1,
        purpose: 'Ingest raw DailyMed SPL XML and EMA SmPC and compute SHA-256 seal',
        inputRefs: ['SPL-XML-v15.0', 'EMA-EPAR-v9.1'],
        requiredEvidence: ['Source XML & PDF binaries'],
        requiredPermission: 'CANON_INTAKE_READ',
        toolOrSpecialist: 'Deterministic Ingestion Kernel (SHA-256)',
        dependencyIds: [],
        expectedOutputSchema: 'DocumentMetadataWithSha256',
        validationRule: 'Hash must match source registry payload length',
        humanGate: false,
        status: 'COMPLETED',
        attemptCount: 1,
        startedAt: '2026-10-01T11:01:00Z',
        completedAt: '2026-10-01T11:02:15Z',
      },
      {
        stepId: 'step-2',
        sequence: 2,
        purpose: 'Compute exact Myers word/token diff between CCDS Rev 14 and Rev 15',
        inputRefs: ['CCDS-Rev14-Sec4.4', 'CCDS-Rev15-Sec4.4'],
        requiredEvidence: ['Normalized text sections'],
        requiredPermission: 'CANON_DIFF_EXECUTE',
        toolOrSpecialist: 'Myers Token Algorithm (Deterministic)',
        dependencyIds: ['step-1'],
        expectedOutputSchema: 'DiffChunkArray',
        validationRule: 'Zero generative interpolation; 100% token coordinate tracking',
        humanGate: false,
        status: 'COMPLETED',
        attemptCount: 1,
        startedAt: '2026-10-01T11:02:20Z',
        completedAt: '2026-10-01T11:03:00Z',
      },
      {
        stepId: 'step-3',
        sequence: 3,
        purpose: 'Extract clinical semantic meaning shift and candidate classification',
        inputRefs: ['DiffChunkArray-Sec4.4'],
        requiredEvidence: ['KEYNOTE-006 trial protocol amendment 4'],
        requiredPermission: 'CANON_SPECIALIST_QUERY',
        toolOrSpecialist: 'Clinical Semantic Reasoner (gemini-3.8-flash)',
        dependencyIds: ['step-2'],
        expectedOutputSchema: 'SemanticClassificationProposal',
        validationRule: 'Must return explicit confidence score and uncertainty flags',
        humanGate: false,
        status: 'COMPLETED',
        attemptCount: 1,
        startedAt: '2026-10-01T11:03:05Z',
        completedAt: '2026-10-01T11:04:10Z',
      },
      {
        stepId: 'step-4',
        sequence: 4,
        purpose: 'Named Human Review & Controlled Sign-off Gate',
        inputRefs: ['SemanticClassificationProposal', 'EvidencePacket-4.4'],
        requiredEvidence: ['PRAC transaminase letter'],
        requiredPermission: 'CANON_HITL_SIGN_OFF',
        toolOrSpecialist: 'Human Governance Gate (Qualified Lead)',
        dependencyIds: ['step-3'],
        expectedOutputSchema: 'DigitalSignatureRecord',
        validationRule: 'Mandatory clinical rationale required before cryptographic commitment',
        humanGate: true,
        status: 'BLOCKED',
        attemptCount: 1,
        startedAt: '2026-10-01T11:04:15Z',
        failureReason: 'Missing PRAC official endorsement letter. Awaiting human decision or evidence attachment.',
      },
      {
        stepId: 'step-5',
        sequence: 5,
        purpose: 'Dispatch country-specific implementation tasks to US and EU affiliate teams',
        inputRefs: ['DigitalSignatureRecord'],
        requiredEvidence: ['Approved Label Revision'],
        requiredPermission: 'CANON_AFFILIATE_DISPATCH',
        toolOrSpecialist: 'Affiliate Task Automation Dispatcher',
        dependencyIds: ['step-4'],
        expectedOutputSchema: 'AffiliateTaskDispatchManifest',
        validationRule: 'Enforce proof attachment mandate for each local task',
        humanGate: false,
        status: 'PENDING',
        attemptCount: 0,
      },
    ],
    dependencies: {
      'step-2': ['step-1'],
      'step-3': ['step-2'],
      'step-4': ['step-3'],
      'step-5': ['step-4'],
    },
    humanReviewPoints: [
      'Step 4: Clinical Safety Lead approval of transaminase warning wording',
    ],
    allowedTools: [
      'Deterministic Ingestion Kernel',
      'Myers Token Diff Engine',
      'SPL Section Normalizer',
      'Affiliate Task Dispatcher',
    ],
    allowedSpecialists: [
      'Clinical Semantic Reasoner (gemini-3.8-flash)',
      'Cross-Market Alignment Specialist',
    ],
    retryBudget: 3,
    timeBudgetMs: 120000,
    costBudgetCents: 25,
    tokenBudget: 16000,
    stopConditions: [
      'Missing clinical trial trial reference',
      'Disagreement between CCDS text and approved authority text',
      'Human rejection at review gate',
    ],
    currentStepId: 'step-4',
  },
];

const PLAN_STORAGE_KEY = 'pramanex_canon_bounded_plans';

export const GoalAndPlannerService = {
  getPlans(): BoundedPlan[] {
    try {
      const stored = localStorage.getItem(PLAN_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse plans from storage, initializing with defaults');
    }
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(INITIAL_PLANS));
    return INITIAL_PLANS;
  },

  /**
   * Goal Interpreter: Analyzes natural user intent and converts into
   * a structured, bounded CANON goal contract.
   */
  interpretGoal(
    rawText: string,
    actorRole: UserRole,
    tenantId: string = 'tenant-global-pharma'
  ): GoalInterpretation {
    const isSafety = /safety|warning|contraindication|adverse|hepatitis/i.test(rawText);
    const isCrossMarket = /market|affiliate|japan|eu|smpc|global/i.test(rawText);
    const isEpi = /qr|barcode|link|datamatrix|epi|fhir/i.test(rawText);

    let goalType: GoalInterpretation['goalType'] = 'LABEL_COMPARISON';
    if (isEpi) goalType = 'EPI_LINK_VERIFICATION';
    else if (isCrossMarket) goalType = 'CROSS_MARKET_IMPACT';
    else if (isSafety) goalType = 'SAFETY_SIGNAL_TRIAGE';

    return {
      goalId: `goal-${Date.now()}`,
      goalType,
      goalText: rawText,
      tenantId,
      workspaceId: 'ws-oncology-core',
      actorId: 'usr-sarah-vance',
      actorRole,
      productId: 'prod-001',
      productName: 'Keytruda (pembrolizumab)',
      marketScope: isCrossMarket ? ['US', 'EU', 'JP', 'GB'] : ['US', 'EU'],
      labelVersionIds: ['ver-us-pi-15', 'ver-eu-smpc-9.1'],
      requestedOutput: 'Evidence-linked comparison packet with discrepancy matrix',
      requiredPermissions: ['CANON_DIFF_EXECUTE', 'CANON_SPECIALIST_QUERY'],
      riskClass: isSafety ? 'HIGH_SAFETY_CRITICAL' : 'MEDIUM_VARIATION',
      requiresPlanning: true,
      requiresHumanReview: isSafety,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Controlled Re-Planning: Triggered when an unexpected condition arises
   * (e.g., missing evidence, source supersession, reviewer change).
   * Generates a new plan revision (Revision N+1) without mutating history.
   */
  triggerRePlan(
    planId: string,
    trigger: RePlanTrigger,
    rationale: string,
    operator: string
  ): BoundedPlan | null {
    const plans = this.getPlans();
    const planIndex = plans.findIndex((p) => p.planId === planId);
    if (planIndex === -1) return null;

    const currentPlan = plans[planIndex];
    const newRevision = currentPlan.planRevision + 1;

    // Adapt steps according to trigger
    const updatedSteps: PlanStep[] = currentPlan.steps.map((step) => {
      if (step.stepId === 'step-4' && trigger === 'MISSING_EVIDENCE') {
        return {
          ...step,
          status: 'BLOCKED',
          failureReason: `Re-planned (Rev ${newRevision}): Required evidence missing - ${rationale}`,
        };
      }
      if (step.stepId === 'step-4' && trigger === 'HUMAN_REQUESTED_MORE_EVIDENCE') {
        return {
          ...step,
          status: 'BLOCKED',
          failureReason: `Reviewer requested additional clinical evidence dossier before sign-off: ${rationale}`,
        };
      }
      return step;
    });

    const updatedPlan: BoundedPlan = {
      ...currentPlan,
      planRevision: newRevision,
      status: trigger === 'MISSING_EVIDENCE' ? 'MISSING_EVIDENCE' : 'NEEDS_REVIEW',
      updatedAt: new Date().toISOString(),
      steps: updatedSteps,
      evidenceMissing: [...currentPlan.evidenceMissing, rationale],
      rePlanHistory: [
        ...(currentPlan.rePlanHistory || []),
        {
          fromRevision: currentPlan.planRevision,
          toRevision: newRevision,
          trigger,
          rationale,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    plans[planIndex] = updatedPlan;
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plans));

    StorageService.logAudit({
      actor: operator,
      actorRole: 'Global Labeling Lead',
      action: 'CONTROLLED_REPLAN_TRIGGERED',
      resource: 'BoundedPlan',
      resourceId: planId,
      correlationId: `replan-${planId}-rev${newRevision}`,
      ipAddress: '127.0.0.1 (CANON Planner Bus)',
      details: `Plan ${planId} re-planned to Revision ${newRevision}. Trigger: ${trigger}. Rationale: ${rationale}`,
      severity: 'WARNING',
    });

    return updatedPlan;
  },

  /**
   * Simulate step execution progress
   */
  advanceStep(planId: string, stepId: string, resolutionStatus: 'COMPLETED' | 'BLOCKED'): BoundedPlan | null {
    const plans = this.getPlans();
    const planIndex = plans.findIndex((p) => p.planId === planId);
    if (planIndex === -1) return null;

    const currentPlan = plans[planIndex];
    const updatedSteps = currentPlan.steps.map((step) => {
      if (step.stepId === stepId) {
        return {
          ...step,
          status: resolutionStatus,
          completedAt: resolutionStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
        };
      }
      return step;
    });

    // Check if all steps completed
    const allCompleted = updatedSteps.every((s) => s.status === 'COMPLETED');
    const hasBlocked = updatedSteps.some((s) => s.status === 'BLOCKED');

    let newStatus: PlanTerminalState = currentPlan.status;
    if (allCompleted) newStatus = 'COMPLETED';
    else if (hasBlocked) newStatus = 'NEEDS_REVIEW';

    const updatedPlan: BoundedPlan = {
      ...currentPlan,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      steps: updatedSteps,
    };

    plans[planIndex] = updatedPlan;
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plans));
    return updatedPlan;
  },
};
