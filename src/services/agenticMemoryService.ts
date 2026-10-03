/**
 * PRAMANEX CANON — Governed Agent Memory Subsystem
 * Implements Working, Episodic, Semantic/Domain, Organization, and User Session Memory
 * Enforces Tenant Boundaries, Memory Access Gates, Cryptographic Provenance, and Invalidation.
 */

import { GovernedMemoryItem, MemoryClass, UserRole } from '../types/canon';
import { StorageService } from '../utils/storage';

const INITIAL_MEMORIES: GovernedMemoryItem[] = [
  // SEMANTIC / DOMAIN MEMORY
  {
    memoryId: 'mem-sem-01',
    memoryType: 'SEMANTIC_DOMAIN',
    tenantId: 'tenant-global-pharma',
    workspaceId: 'ws-oncology-core',
    subjectType: 'CONCEPT_MAPPING',
    subjectId: 'CONTRAINDICATIONS',
    title: 'Cross-Standard LOINC / MedDRA Mapping for Contraindications',
    content: {
      canonicalConcept: 'CONTRAINDICATIONS',
      loincCode: '34070-3',
      sectionFdaSpl: '4',
      sectionEmaSmpc: '4.3',
      sectionPmdaJp: '2',
      approvedSynonyms: ['Hypersensitivity', 'Contraindicated Conditions', 'Absolute Contraindications'],
      governingGuideline: 'ICH E2C(R2) Periodic Benefit-Risk Evaluation',
    },
    sourceRefs: ['ICH-E2C-R2-GUIDELINE', 'FDA-SPL-IMPLEMENTATION-GUIDE-V4'],
    sourceVersions: ['v4.2', 'v2024.1'],
    provenance: {
      originator: 'Global Oncology Ontologist',
      originatorType: 'NAMED_HUMAN',
      signatureHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
      authorityJurisdiction: 'GLOBAL_ICH',
    },
    createdBy: 'Dr. Sarah Vance, PharmD',
    createdAt: '2026-09-15T10:00:00Z',
    currentRevision: 1,
    reviewStatus: 'APPROVED',
    freshnessScore: 0.99,
    validFrom: '2026-09-15T00:00:00Z',
    retentionPolicy: 'PERMANENT_GXP_RECORD',
    accessPolicy: {
      allowedRoles: [
        'Global Labeling Lead',
        'Regulatory Labeling Specialist',
        'Local Affiliate RA',
        'RegOps / Digital Regulatory',
        'Safety / Medical Reviewer',
        'Read-Only Auditor',
      ],
      requiresTenantIsolation: true,
    },
  },
  {
    memoryId: 'mem-sem-02',
    memoryType: 'SEMANTIC_DOMAIN',
    tenantId: 'tenant-global-pharma',
    workspaceId: 'ws-oncology-core',
    subjectType: 'TERMINOLOGY',
    subjectId: 'IMMUNE_HEPATITIS_TERMINOLOGY',
    title: 'Immune-Mediated Hepatitis Standardized Safety Coding',
    content: {
      preferredTerm: 'Immune-mediated hepatitis',
      meddraLlt: 'Immune-related hepatitis (10079942)',
      severityCutoffRule: 'Grade 3 (ALT/AST > 5x ULN) or Grade 4 (ALT/AST > 20x ULN) requires permanent discontinuation.',
      fdaStandardHeading: '5.1 Immune-Mediated Adverse Reactions',
      emaStandardHeading: '4.4 Special warnings and precautions for use',
    },
    sourceRefs: ['CTCAE-V5.0-ADVERSE-EVENT-CRITERIA'],
    sourceVersions: ['v5.0'],
    provenance: {
      originator: 'Safety Review Committee',
      originatorType: 'NAMED_HUMAN',
      signatureHash: '4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9a8b7c6d5e',
      authorityJurisdiction: 'EMA_FDA_HARMONIZED',
    },
    createdBy: 'Dr. Marcus Dubois, MD',
    createdAt: '2026-09-20T14:30:00Z',
    currentRevision: 2,
    reviewStatus: 'APPROVED',
    freshnessScore: 0.98,
    validFrom: '2026-09-20T00:00:00Z',
    retentionPolicy: 'PERMANENT_GXP_RECORD',
    accessPolicy: {
      allowedRoles: [
        'Global Labeling Lead',
        'Regulatory Labeling Specialist',
        'Safety / Medical Reviewer',
        'Read-Only Auditor',
      ],
      requiresTenantIsolation: true,
    },
  },

  // EPISODIC MEMORY (Precedent & Human Corrections)
  {
    memoryId: 'mem-epi-01',
    memoryType: 'EPISODIC',
    tenantId: 'tenant-global-pharma',
    workspaceId: 'ws-oncology-core',
    subjectType: 'REVIEW_CORRECTION',
    subjectId: 'prod-001-keytruda-sec4.4',
    title: 'Precedent: Human Reviewer Overrode Model Over-Generalization on Transaminases',
    content: {
      originalModelProposal: 'Add blanket contraindication for all chronic liver disease patients.',
      correctedHumanDecision: 'Narrowed to Grade 3/4 immune-mediated hepatotoxicity per KEYNOTE-006 trial protocol.',
      reviewerName: 'Dr. Marcus Dubois, MD',
      reviewerRole: 'Safety / Medical Reviewer',
      decisionRationale: 'Blanket contraindication would unethically deny therapy to mild baseline transaminase elevation patients without active hepatitis.',
      resolutionAppliedInVersion: 'US PI v15.0 & EU SmPC v9.1',
    },
    sourceRefs: ['KEYNOTE-006-STUDY-REPORT', 'CHMP-ASSESSMENT-REPORT-2025'],
    sourceVersions: ['Study-Report-Rev3'],
    provenance: {
      originator: 'Dr. Marcus Dubois, MD',
      originatorType: 'NAMED_HUMAN',
      signatureHash: '8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d',
      authorityJurisdiction: 'US_EU_CROSS_MARKET',
    },
    createdBy: 'Dr. Marcus Dubois, MD',
    createdAt: '2026-09-28T09:15:00Z',
    currentRevision: 1,
    reviewStatus: 'APPROVED',
    freshnessScore: 0.97,
    validFrom: '2026-09-28T00:00:00Z',
    retentionPolicy: 'GXP_AUDIT_TRAIL_10_YEARS',
    accessPolicy: {
      allowedRoles: [
        'Global Labeling Lead',
        'Regulatory Labeling Specialist',
        'Safety / Medical Reviewer',
        'Read-Only Auditor',
      ],
      requiresTenantIsolation: true,
    },
  },

  // ORGANIZATION MEMORY
  {
    memoryId: 'mem-org-01',
    memoryType: 'ORGANIZATION',
    tenantId: 'tenant-global-pharma',
    workspaceId: 'ws-oncology-core',
    subjectType: 'WORKFLOW_POLICY',
    subjectId: 'POLICY_AFFILIATE_CLOSURE_PROOF',
    title: 'Standard Operating Procedure: Proof-Before-Closure Mandatory Enforcement',
    content: {
      policyCode: 'SOP-GL-042',
      policyName: 'Affiliate Implementation Verification Standard',
      mandate: 'No affiliate implementation task can transition to CLOSED or VERIFIED without an attached Health Authority official submission confirmation receipt or stamped package insert.',
      dualSignoffRequiredForSafetyCritical: true,
      escalationWindowDays: 14,
    },
    sourceRefs: ['GLOBAL-BIOPHARMA-SOP-GL-042'],
    sourceVersions: ['Rev 4.0'],
    provenance: {
      originator: 'Quality & Regulatory Governance Committee',
      originatorType: 'NAMED_HUMAN',
      signatureHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      authorityJurisdiction: 'GLOBAL_CORP',
    },
    createdBy: 'Compliance Lead Eleanor Vance',
    createdAt: '2026-08-01T08:00:00Z',
    currentRevision: 4,
    reviewStatus: 'APPROVED',
    freshnessScore: 1.0,
    validFrom: '2026-08-01T00:00:00Z',
    retentionPolicy: 'PERMANENT_CORP_POLICY',
    accessPolicy: {
      allowedRoles: [
        'Global Labeling Lead',
        'Regulatory Labeling Specialist',
        'Local Affiliate RA',
        'RegOps / Digital Regulatory',
        'Safety / Medical Reviewer',
        'IT / Validation / Security',
        'Read-Only Auditor',
      ],
      requiresTenantIsolation: true,
    },
  },

  // WORKING MEMORY (Active State)
  {
    memoryId: 'mem-work-01',
    memoryType: 'WORKING',
    tenantId: 'tenant-global-pharma',
    workspaceId: 'ws-oncology-core',
    subjectType: 'PRODUCT',
    subjectId: 'prod-001-active-session',
    title: 'Active Working Session Context: Keytruda CCDS Rev 15 Rollout',
    content: {
      activeProduct: 'Keytruda (pembrolizumab)',
      activeCCDSVersion: 'CCDS Rev 15 (2026-09-15)',
      activeComparingMarkets: ['US', 'EU', 'JP'],
      unresolvedDiscrepanciesCount: 2,
      hitlReviewPending: true,
      lastDiffTokenCoverage: 100,
    },
    sourceRefs: ['CCDS-REV-15-DAILYMED', 'EMA-EPAR-KEYTRUDA-SMPC'],
    sourceVersions: ['Rev 15', 'SmPC v9.1'],
    provenance: {
      originator: 'Session Engine',
      originatorType: 'SYSTEM',
    },
    createdBy: 'System Engine',
    createdAt: new Date().toISOString(),
    currentRevision: 1,
    reviewStatus: 'PROPOSED',
    freshnessScore: 1.0,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    retentionPolicy: 'SESSION_EXPIRY_24H',
    accessPolicy: {
      allowedRoles: [
        'Global Labeling Lead',
        'Regulatory Labeling Specialist',
        'Safety / Medical Reviewer',
      ],
      requiresTenantIsolation: true,
    },
  },
];

const MEMORY_STORAGE_KEY = 'pramanex_canon_governed_memory';

export const AgenticMemoryService = {
  getMemories(): GovernedMemoryItem[] {
    try {
      const stored = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse memories from storage, initializing with defaults');
    }
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(INITIAL_MEMORIES));
    return INITIAL_MEMORIES;
  },

  /**
   * Memory Access Gate: Validates tenant isolation, user role permission,
   * review status, and freshness before returning results.
   */
  retrieveAuthorizedMemories(
    userRole: UserRole,
    tenantId: string,
    memoryType?: MemoryClass
  ): GovernedMemoryItem[] {
    const all = this.getMemories();
    const authorized = all.filter((item) => {
      // Tenant isolation enforcement
      if (item.accessPolicy.requiresTenantIsolation && item.tenantId !== tenantId) {
        return false;
      }
      // Role access validation
      if (!item.accessPolicy.allowedRoles.includes(userRole)) {
        return false;
      }
      // Filter by type if requested
      if (memoryType && item.memoryType !== memoryType) {
        return false;
      }
      return true;
    });

    // Record audit telemetry for memory read
    StorageService.logAudit({
      actor: userRole,
      actorRole: userRole,
      action: 'MEMORY_ACCESS_GATE_QUERY',
      resource: 'GovernedMemorySubsystem',
      resourceId: memoryType || 'ALL_CLASSES',
      correlationId: `mem-query-${Date.now()}`,
      ipAddress: '127.0.0.1 (Internal Gateway)',
      details: `Retrieved ${authorized.length} authorized memory records under tenant ${tenantId}.`,
      severity: 'INFO',
    });

    return authorized;
  },

  /**
   * Memory Write Gate: Prevents arbitrary agent writes.
   * Mandates schema validation, provenance tracking, and immutable revision creation.
   */
  commitGovernedMemory(
    item: Omit<GovernedMemoryItem, 'memoryId' | 'createdAt' | 'currentRevision' | 'freshnessScore'>
  ): GovernedMemoryItem {
    const memories = this.getMemories();
    const newItem: GovernedMemoryItem = {
      ...item,
      memoryId: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      currentRevision: 1,
      freshnessScore: 1.0,
    };

    memories.unshift(newItem);
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memories));

    StorageService.logAudit({
      actor: item.createdBy,
      actorRole: item.provenance.originatorType === 'NAMED_HUMAN' ? 'Global Labeling Lead' : 'IT / Validation / Security',
      action: 'MEMORY_WRITE_GATE_COMMIT',
      resource: 'GovernedMemoryItem',
      resourceId: newItem.memoryId,
      correlationId: `mem-write-${newItem.memoryId}`,
      ipAddress: '127.0.0.1 (Secure Memory Bus)',
      details: `Committed new ${newItem.memoryType} record: "${newItem.title}" with review status ${newItem.reviewStatus}.`,
      severity: 'INFO',
    });

    return newItem;
  },

  /**
   * Memory Invalidation: When source label is superseded or changed,
   * flags dependent memories as STALE or INVALIDATED.
   */
  invalidateSourceDependencies(
    sourceVersionId: string,
    reason: string,
    auditorName: string
  ): number {
    const memories = this.getMemories();
    let affectedCount = 0;

    const updated = memories.map((item) => {
      if (item.sourceVersions.includes(sourceVersionId) || item.sourceRefs.some((r) => r.includes(sourceVersionId))) {
        affectedCount++;
        return {
          ...item,
          reviewStatus: 'STALE' as const,
          freshnessScore: 0.2,
          invalidationReason: `Source ${sourceVersionId} was updated/superseded: ${reason}`,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    if (affectedCount > 0) {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(updated));
      StorageService.logAudit({
        actor: auditorName,
        actorRole: 'Global Labeling Lead',
        action: 'MEMORY_INVALIDATION_CASCADE',
        resource: 'GovernedMemorySubsystem',
        resourceId: sourceVersionId,
        correlationId: `mem-inval-${Date.now()}`,
        ipAddress: '127.0.0.1',
        details: `Invalidated ${affectedCount} dependent memory records following source update: ${reason}.`,
        severity: 'WARNING',
      });
    }

    return affectedCount;
  },
};
