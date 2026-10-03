/**
 * PRAMANEX CANON — Core Domain Types
 * Canonical Enterprise Feature Implementations
 */

export type UserRole =
  | 'Global Labeling Lead'
  | 'Regulatory Labeling Specialist'
  | 'Local Affiliate RA'
  | 'RegOps / Digital Regulatory'
  | 'Safety / Medical Reviewer'
  | 'IT / Validation / Security'
  | 'Read-Only Auditor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  avatarUrl?: string;
  signatureHash?: string;
}

export interface ProductIdentifier {
  type: 'INN' | 'NDC' | 'BLA' | 'NDA' | 'MA_NUMBER' | 'JAN_CODE' | 'ATC';
  value: string;
}

export interface PharmaceuticalProduct {
  id: string;
  tradeName: string;
  inn: string;
  therapeuticArea: string;
  dosageForm: string;
  strengths: string[];
  packSizes: string[];
  authorizations: ProductIdentifier[];
  markets: string[];
  ccdsCurrentVersion: string;
  updatedAt: string;
  status: 'ACTIVE' | 'UNDER_REVISION' | 'PENDING_SUBMISSION';
}

export type LabelFormat = 'SPL_XML' | 'EPI_FHIR' | 'PDF' | 'HTML' | 'STRUCTURED_JSON';
export type LabelType = 'CCDS' | 'US_PI' | 'EU_SMPC' | 'JP_PI' | 'UK_SMPC' | 'AU_PI' | 'CA_PM' | 'PIL_PATIENT_LEAFLET';

export interface LabelSection {
  id: string;
  sectionCode: string; // e.g. "4.3" or "5.1" or LOINC "34067-9"
  canonicalConcept: string; // e.g. "CONTRAINDICATIONS"
  headingText: string;
  content: string;
  orderIndex: number;
  sourceCoordinates: {
    pageNumber?: number;
    lineNumber: number;
    columnNumber?: number;
    byteOffset?: number;
  };
}

export interface LabelVersion {
  id: string;
  productId: string;
  market: string; // US, EU, JP, GB, CA, AU, etc.
  language: string;
  labelType: LabelType;
  versionNumber: string;
  predecessorVersionId?: string;
  effectiveDate: string;
  authority: string; // FDA, EMA, PMDA, MHRA, Health Canada, TGA
  sha256Hash: string;
  format: LabelFormat;
  sourceUrl?: string;
  sections: LabelSection[];
  capturedTimestamp: string;
  status: 'CURRENT' | 'SUPERSEDED' | 'DRAFT' | 'REJECTED';
}

export type DiffChunkType = 'EQUAL' | 'INSERTION' | 'DELETION' | 'TABLE_MODIFIED';

export interface DiffChunk {
  id: string;
  type: DiffChunkType;
  text: string;
  oldLineNumber?: number;
  newLineNumber?: number;
  sectionCode: string;
  canonicalConcept: string;
}

export type SemanticClass =
  | 'SAFETY_WARNING_ADDITION'
  | 'CONTRAINDICATION_EXPANSION'
  | 'POSOLOGY_DOSING_ADJUSTMENT'
  | 'NEW_INDICATION_RESTRICTION'
  | 'ADVERSE_REACTION_UPDATE'
  | 'EDITORIAL_CLARIFICATION'
  | 'SECTION_SHUFFLE_NO_CHANGE';

export interface SemanticCandidate {
  id: string;
  sectionCode: string;
  canonicalConcept: string;
  proposedClass: SemanticClass;
  rationale: string;
  confidenceScore: number; // 0.0 to 1.0 calibrated
  uncertaintyFlags: string[];
  missingEvidenceNotes: string[];
  sourceCoordinates: string;
  modelIdentifier: string;
  humanReviewState: 'PENDING_REVIEW' | 'ACCEPTED' | 'REVISED' | 'REJECTED' | 'EVIDENCE_REQUESTED';
}

export type AlignmentStatus =
  | 'ALIGNED'
  | 'CHANGED'
  | 'STALE'
  | 'UNKNOWN'
  | 'CONFLICT'
  | 'MISSING_EVIDENCE'
  | 'NEEDS_REVIEW';

export interface CrossMarketAlignment {
  id: string;
  productId: string;
  canonicalConcept: string;
  coreVersion: string;
  market: string;
  localVersion: string;
  status: AlignmentStatus;
  lastComparedDate: string;
  differencesSummary: string;
  deviationReason?: string;
  affiliateLead: string;
}

export interface RegulatorySignal {
  id: string;
  sourceAuthority: 'FDA_MEDWATCH' | 'EMA_PRAC' | 'MHRA_DRUG_ALERT' | 'PMDA_SAFETY_FLASH' | 'INTERNAL_SIGNAL';
  signalTitle: string;
  detectedDate: string;
  activeSubstance: string;
  clinicalSummary: string;
  urgencyLevel: 'CRITICAL_SAFETY' | 'HIGH' | 'ROUTINE';
  linkedChangeCandidateId?: string;
  status: 'NEW' | 'EVALUATING' | 'CONVERTED_TO_CHANGE' | 'DISMISSED';
}

export interface ImpactNode {
  id: string;
  type: 'CHANGE_CONCEPT' | 'PRODUCT' | 'MARKET' | 'STRENGTH' | 'PACK' | 'SECTION' | 'TASK' | 'ARTWORK';
  label: string;
  status?: string;
  market?: string;
  details?: string;
}

export interface ImpactLink {
  source: string;
  target: string;
  relationType: 'PROPAGATES_TO' | 'AFFECTS' | 'REQUIRES_ACTION';
}

export type ReviewDecisionType =
  | 'APPROVE_CANDIDATE'
  | 'REVISE_WORDING'
  | 'REQUEST_EVIDENCE'
  | 'LOCAL_EXCEPTION'
  | 'REJECT'
  | 'ESCALATE';

export interface HumanReviewRecord {
  id: string;
  changeCandidateId: string;
  reviewTitle: string;
  productName: string;
  market: string;
  sectionCode: string;
  candidateClass: SemanticClass;
  assignedTo: string;
  assignedRole: UserRole;
  reviewDeadline: string;
  status: 'PENDING' | 'APPROVED' | 'REVISED' | 'EVIDENCE_REQUESTED' | 'REJECTED' | 'ESCALATED';
  decisions: {
    decisionType: ReviewDecisionType;
    decidedBy: string;
    decidedRole: UserRole;
    timestamp: string;
    reasonText: string;
    evidenceNotes?: string;
    digitalSignatureSha256: string;
  }[];
}

export type ImplementationStatus =
  | 'DRAFT'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'SUBMITTED_TO_HA'
  | 'HA_APPROVED'
  | 'VERIFICATION_REQUIRED'
  | 'VERIFIED'
  | 'CLOSED';

export interface ProofAttachment {
  id: string;
  fileName: string;
  fileHash: string;
  uploadDate: string;
  uploadedBy: string;
  submissionTrackingNumber: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface ImplementationTask {
  id: string;
  productId: string;
  productName: string;
  market: string;
  taskTitle: string;
  changeDescription: string;
  affiliateOwner: string;
  dueDate: string;
  status: ImplementationStatus;
  proofs: ProofAttachment[];
  notes: string;
}

export interface DigitalLinkCheck {
  id: string;
  productName: string;
  declaredEndpointUrl: string;
  market: string;
  qrPayload: string;
  resolvedTargetVersion: string;
  expectedVersion: string;
  languageDetected: string;
  expectedLanguage: string;
  status: 'VERIFIED_ACTIVE' | 'SUPERSEDED_TARGET_WARNING' | 'LANGUAGE_MISMATCH' | 'UNRESOLVED_404';
  lastCheckedAt: string;
  verificationNotes: string;
}

export interface ProvenanceStep {
  id: string;
  stepNumber: number;
  stageName: string;
  title: string;
  actor: string;
  actorType: 'SYSTEM' | 'AI_GATEWAY' | 'NAMED_HUMAN';
  timestamp: string;
  sha256Hash: string;
  parameters: Record<string, string>;
  evidenceArtifactUrl?: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  correlationId: string;
  ipAddress: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL_SECURITY';
}

// ==========================================
// GOAL INTERPRETATION & BOUNDED PLANNER
// ==========================================

export type GoalRiskClass = 'LOW_INFORMATIONAL' | 'MEDIUM_VARIATION' | 'HIGH_SAFETY_CRITICAL';

export interface GoalInterpretation {
  goalId: string;
  goalType:
    | 'LABEL_COMPARISON'
    | 'CROSS_MARKET_IMPACT'
    | 'SAFETY_SIGNAL_TRIAGE'
    | 'EPI_LINK_VERIFICATION'
    | 'HISTORICAL_RECONSTRUCTION'
    | 'AFFILIATE_DISPATCH'
    | 'AUDIT_PACKAGE_GENERATION';
  goalText: string;
  tenantId: string;
  workspaceId: string;
  actorId: string;
  actorRole: UserRole;
  productId: string;
  productName: string;
  marketScope: string[];
  labelVersionIds: string[];
  requestedOutput: string;
  requiredPermissions: string[];
  riskClass: GoalRiskClass;
  requiresPlanning: boolean;
  requiresHumanReview: boolean;
  createdAt: string;
}

export type PlanStepStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'BLOCKED' | 'FAILED' | 'SKIPPED';

export interface PlanStep {
  stepId: string;
  sequence: number;
  purpose: string;
  inputRefs: string[];
  requiredEvidence: string[];
  requiredPermission: string;
  toolOrSpecialist: string;
  dependencyIds: string[];
  expectedOutputSchema: string;
  validationRule: string;
  humanGate: boolean;
  status: PlanStepStatus;
  attemptCount: number;
  startedAt?: string;
  completedAt?: string;
  failureReason?: string;
}

export type PlanTerminalState =
  | 'INITIALIZED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NEEDS_REVIEW'
  | 'MISSING_EVIDENCE'
  | 'IDENTITY_UNCERTAIN'
  | 'UNKNOWN'
  | 'CONFLICT'
  | 'BLOCKED'
  | 'FAILED'
  | 'EXHAUSTED'
  | 'HOLD'
  | 'CANCELLED'
  | 'SUPERSEDED';

export type RePlanTrigger =
  | 'SOURCE_FAILED'
  | 'PARSER_FAILED'
  | 'IDENTITY_AMBIGUOUS'
  | 'VERSION_AMBIGUOUS'
  | 'SECTION_ALIGNMENT_UNRESOLVED'
  | 'MISSING_EVIDENCE'
  | 'CONFLICT'
  | 'MODEL_FAILED'
  | 'TOOL_FAILED'
  | 'SPECIALIST_DISAGREEMENT'
  | 'HUMAN_REQUESTED_MORE_EVIDENCE'
  | 'SOURCE_SUPERSEDED'
  | 'SOURCE_CHANGED_AFTER_REVIEW';

export interface BoundedPlan {
  planId: string;
  tenantId: string;
  workspaceId: string;
  goalId: string;
  goalSummary: string;
  planRevision: number;
  status: PlanTerminalState;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  sourceContext: {
    productName: string;
    sourceVersion: string;
    targetVersion: string;
    jurisdictions: string[];
  };
  requiredEvidence: string[];
  evidenceUsed: string[];
  evidenceMissing: string[];
  steps: PlanStep[];
  dependencies: Record<string, string[]>;
  humanReviewPoints: string[];
  allowedTools: string[];
  allowedSpecialists: string[];
  retryBudget: number;
  timeBudgetMs: number;
  costBudgetCents: number;
  tokenBudget: number;
  stopConditions: string[];
  currentStepId?: string;
  failureReason?: string;
  supersededBy?: string;
  rePlanHistory?: {
    fromRevision: number;
    toRevision: number;
    trigger: RePlanTrigger;
    rationale: string;
    timestamp: string;
  }[];
}

// ==========================================
// GOVERNED AGENT MEMORY SUBSYSTEM
// ==========================================

export type MemoryClass =
  | 'WORKING'
  | 'EPISODIC'
  | 'SEMANTIC_DOMAIN'
  | 'ORGANIZATION'
  | 'USER_SESSION';

export type MemoryReviewStatus = 'APPROVED' | 'PROPOSED' | 'STALE' | 'SUPERSEDED' | 'INVALIDATED';

export interface GovernedMemoryItem {
  memoryId: string;
  memoryType: MemoryClass;
  tenantId: string;
  workspaceId: string;
  subjectType: 'PRODUCT' | 'CONCEPT_MAPPING' | 'TERMINOLOGY' | 'REVIEW_CORRECTION' | 'WORKFLOW_POLICY' | 'USER_STATE';
  subjectId: string;
  title: string;
  content: Record<string, any>;
  sourceRefs: string[];
  sourceVersions: string[];
  provenance: {
    originator: string;
    originatorType: 'SYSTEM' | 'AI_SPECIALIST' | 'NAMED_HUMAN';
    signatureHash?: string;
    authorityJurisdiction?: string;
  };
  createdBy: string;
  createdAt: string;
  currentRevision: number;
  reviewStatus: MemoryReviewStatus;
  freshnessScore: number; // 0.0 - 1.0
  validFrom: string;
  validUntil?: string;
  retentionPolicy: string;
  accessPolicy: {
    allowedRoles: UserRole[];
    requiresTenantIsolation: boolean;
  };
  supersededBy?: string;
  invalidationReason?: string;
}

