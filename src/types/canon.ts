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
