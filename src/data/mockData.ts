import {
  PharmaceuticalProduct,
  LabelVersion,
  CrossMarketAlignment,
  RegulatorySignal,
  HumanReviewRecord,
  ImplementationTask,
  DigitalLinkCheck,
  ProvenanceStep,
  AuditEvent,
  UserProfile,
  SemanticCandidate
} from '../types/canon';

export const CURRENT_USER: UserProfile = {
  id: 'usr-vance-01',
  name: 'Dr. Sarah Vance, PharmD',
  email: 's.vance@pramanex-pharma.com',
  role: 'Global Labeling Lead',
  organizationId: 'org-pramanex-enterprise',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
};

export const MOCK_PRODUCTS: PharmaceuticalProduct[] = [
  {
    id: 'prod-keytruda',
    tradeName: 'Keytruda',
    inn: 'Pembrolizumab',
    therapeuticArea: 'Oncology / Immuno-Oncology',
    dosageForm: 'Concentrate for solution for infusion',
    strengths: ['25 mg/mL', '100 mg/4 mL'],
    packSizes: ['Single-dose vial (1 vial/carton)'],
    authorizations: [
      { type: 'BLA', value: 'BLA 125514' },
      { type: 'MA_NUMBER', value: 'EU/1/15/1024/001' },
      { type: 'JAN_CODE', value: 'JAN 4987088123456' }
    ],
    markets: ['US', 'EU', 'JP', 'GB', 'CA', 'AU', 'CH'],
    ccdsCurrentVersion: 'CCDS Rev 15.0',
    updatedAt: '2026-09-28T14:30:00Z',
    status: 'ACTIVE'
  },
  {
    id: 'prod-ozempic',
    tradeName: 'Ozempic',
    inn: 'Semaglutide',
    therapeuticArea: 'Endocrinology / GLP-1 Receptor Agonist',
    dosageForm: 'Solution for injection in pre-filled pen',
    strengths: ['0.5 mg/dose', '1 mg/dose', '2 mg/dose'],
    packSizes: ['1 pre-filled pen + 4 NovoFine Plus needles'],
    authorizations: [
      { type: 'NDA', value: 'NDA 209637' },
      { type: 'MA_NUMBER', value: 'EU/1/17/1251/002' },
      { type: 'NDC', value: '0169-4130-13' }
    ],
    markets: ['US', 'EU', 'JP', 'GB', 'AU', 'BR'],
    ccdsCurrentVersion: 'CCDS Rev 8.2',
    updatedAt: '2026-09-20T09:15:00Z',
    status: 'UNDER_REVISION'
  },
  {
    id: 'prod-humira',
    tradeName: 'Humira',
    inn: 'Adalimumab',
    therapeuticArea: 'Immunology / TNF-alpha Inhibitor',
    dosageForm: 'Solution for injection in pre-filled syringe',
    strengths: ['40 mg/0.4 mL', '80 mg/0.8 mL'],
    packSizes: ['2 pre-filled pens, 2 alcohol pads'],
    authorizations: [
      { type: 'BLA', value: 'BLA 125057' },
      { type: 'MA_NUMBER', value: 'EU/1/03/256/001' }
    ],
    markets: ['US', 'EU', 'GB', 'JP', 'CA'],
    ccdsCurrentVersion: 'CCDS Rev 12.4',
    updatedAt: '2026-08-14T11:00:00Z',
    status: 'ACTIVE'
  }
];

export const MOCK_LABEL_VERSIONS: LabelVersion[] = [
  {
    id: 'ver-keytruda-us-v14',
    productId: 'prod-keytruda',
    market: 'US',
    language: 'EN',
    labelType: 'US_PI',
    versionNumber: 'v14.2',
    effectiveDate: '2025-11-15',
    authority: 'US FDA',
    sha256Hash: 'a89c45b78f4e2098d5c3176b92a83e01bc64d3725619fae3502891d4e782c501',
    format: 'SPL_XML',
    sourceUrl: 'https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=keytruda-14-2',
    capturedTimestamp: '2025-11-16T08:00:00Z',
    status: 'SUPERSEDED',
    sections: [
      {
        id: 'sec-1',
        sectionCode: '4.1',
        canonicalConcept: 'INDICATIONS_AND_USAGE',
        headingText: '1 INDICATIONS AND USAGE',
        content: 'KEYTRUDA is indicated for the treatment of patients with unresectable or metastatic melanoma. KEYTRUDA is also indicated in combination with pemetrexed and platinum chemotherapy for the first-line treatment of patients with metastatic nonsquamous non-small cell lung cancer (NSCLC).',
        orderIndex: 1,
        sourceCoordinates: { pageNumber: 2, lineNumber: 42 }
      },
      {
        id: 'sec-2',
        sectionCode: '4.3',
        canonicalConcept: 'CONTRAINDICATIONS',
        headingText: '4 CONTRAINDICATIONS',
        content: 'None. No specific contraindications are currently declared under US Prescribing Information.',
        orderIndex: 2,
        sourceCoordinates: { pageNumber: 4, lineNumber: 118 }
      },
      {
        id: 'sec-3',
        sectionCode: '4.4',
        canonicalConcept: 'WARNINGS_AND_PRECAUTIONS',
        headingText: '5 WARNINGS AND PRECAUTIONS',
        content: '5.1 Immune-Mediated Adverse Reactions: Immune-mediated adverse reactions, which may be severe or fatal, can occur in any organ system or tissue. Monitor patients closely for symptoms of pneumonitis, colitis, and hepatitis during therapy with KEYTRUDA.',
        orderIndex: 3,
        sourceCoordinates: { pageNumber: 5, lineNumber: 145 }
      }
    ]
  },
  {
    id: 'ver-keytruda-us-v15',
    productId: 'prod-keytruda',
    market: 'US',
    language: 'EN',
    labelType: 'US_PI',
    versionNumber: 'v15.0',
    predecessorVersionId: 'ver-keytruda-us-v14',
    effectiveDate: '2026-09-18',
    authority: 'US FDA',
    sha256Hash: 'f49b18361e27a69cb3914a291f83c617b889314c27598db491024317fbb97b21',
    format: 'SPL_XML',
    sourceUrl: 'https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=keytruda-15-0',
    capturedTimestamp: '2026-09-19T06:12:00Z',
    status: 'CURRENT',
    sections: [
      {
        id: 'sec-1b',
        sectionCode: '4.1',
        canonicalConcept: 'INDICATIONS_AND_USAGE',
        headingText: '1 INDICATIONS AND USAGE',
        content: 'KEYTRUDA is indicated for the treatment of patients with unresectable or metastatic melanoma. KEYTRUDA is also indicated in combination with pemetrexed and carboplatin or cisplatin chemotherapy for the first-line treatment of adult patients with metastatic nonsquamous non-small cell lung cancer (NSCLC) with no EGFR or ALK genomic tumor aberrations.',
        orderIndex: 1,
        sourceCoordinates: { pageNumber: 2, lineNumber: 42 }
      },
      {
        id: 'sec-2b',
        sectionCode: '4.3',
        canonicalConcept: 'CONTRAINDICATIONS',
        headingText: '4 CONTRAINDICATIONS',
        content: 'KEYTRUDA is contraindicated in patients with known severe hypersensitivity to pembrolizumab or to any of the excipients listed in section 11 DESCRIPTION.',
        orderIndex: 2,
        sourceCoordinates: { pageNumber: 4, lineNumber: 120 }
      },
      {
        id: 'sec-3b',
        sectionCode: '4.4',
        canonicalConcept: 'WARNINGS_AND_PRECAUTIONS',
        headingText: '5 WARNINGS AND PRECAUTIONS',
        content: '5.1 Severe Immune-Mediated Adverse Reactions: Immune-mediated adverse reactions, which may be severe or fatal, can occur in any organ system or tissue, and can affect more than one system simultaneously. Monitor hepatic transaminases and bilirubin baseline and periodically prior to each infusion. Permanently discontinue KEYTRUDA for Grade 3 or Grade 4 immune-mediated hepatitis.',
        orderIndex: 3,
        sourceCoordinates: { pageNumber: 5, lineNumber: 147 }
      }
    ]
  },
  {
    id: 'ver-keytruda-eu-smpc-v9',
    productId: 'prod-keytruda',
    market: 'EU',
    language: 'EN',
    labelType: 'EU_SMPC',
    versionNumber: 'v9.1',
    effectiveDate: '2026-07-10',
    authority: 'EMA',
    sha256Hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    format: 'EPI_FHIR',
    capturedTimestamp: '2026-07-11T10:00:00Z',
    status: 'CURRENT',
    sections: [
      {
        id: 'sec-eu-1',
        sectionCode: '4.3',
        canonicalConcept: 'CONTRAINDICATIONS',
        headingText: '4.3 Contraindications',
        content: 'Hypersensitivity to the active substance or to any of the excipients listed in section 6.1.',
        orderIndex: 1,
        sourceCoordinates: { pageNumber: 4, lineNumber: 89 }
      }
    ]
  }
];

export const MOCK_SEMANTIC_CANDIDATE: SemanticCandidate = {
  id: 'cand-keytruda-01',
  sectionCode: '4.4',
  canonicalConcept: 'WARNINGS_AND_PRECAUTIONS',
  proposedClass: 'SAFETY_WARNING_ADDITION',
  rationale: 'Mandates baseline and periodic liver function monitoring (AST/ALT/bilirubin) before each infusion and introduces mandatory permanent discontinuation rule for Grade 3/4 hepatitis.',
  confidenceScore: 0.96,
  uncertaintyFlags: [
    'Affiliate translation impact in Japanese package insert requires special posology review',
    'Does not alter pediatric dosing guidance'
  ],
  missingEvidenceNotes: [
    'No clinical trial protocol reference ID cited for the Grade 3/4 cutoff change in source document footnote.'
  ],
  sourceCoordinates: 'US PI v15.0 Section 5.1 (Lines 147-156)',
  modelIdentifier: 'gemini-3.1-pro-preview (rev.2026.10)',
  humanReviewState: 'PENDING_REVIEW'
};

export const MOCK_CROSS_MARKET: CrossMarketAlignment[] = [
  {
    id: 'cm-1',
    productId: 'prod-keytruda',
    canonicalConcept: 'WARNINGS_AND_PRECAUTIONS',
    coreVersion: 'CCDS Rev 15.0',
    market: 'US (FDA)',
    localVersion: 'US PI v15.0',
    status: 'ALIGNED',
    lastComparedDate: '2026-09-22',
    differencesSummary: 'Fully synchronized with Core CCDS Rev 15.0 hepatic monitoring protocol.',
    affiliateLead: 'Dr. Sarah Vance'
  },
  {
    id: 'cm-2',
    productId: 'prod-keytruda',
    canonicalConcept: 'WARNINGS_AND_PRECAUTIONS',
    coreVersion: 'CCDS Rev 15.0',
    market: 'EU (EMA)',
    localVersion: 'SmPC v9.1',
    status: 'STALE',
    lastComparedDate: '2026-09-20',
    differencesSummary: 'SmPC v9.1 lacks the newly mandated "prior to each infusion" hepatic transaminase baseline check.',
    deviationReason: 'Awaiting Type II Variation approval timetable with CHMP (Day 60 list of questions).',
    affiliateLead: 'Dr. Elena Rostova'
  },
  {
    id: 'cm-3',
    productId: 'prod-keytruda',
    canonicalConcept: 'WARNINGS_AND_PRECAUTIONS',
    coreVersion: 'CCDS Rev 15.0',
    market: 'Japan (PMDA)',
    localVersion: 'JP PI v7.0',
    status: 'NEEDS_REVIEW',
    lastComparedDate: '2026-09-24',
    differencesSummary: 'Bilingual translation drift observed in interstitial lung disease and hepatitis monitoring clause.',
    affiliateLead: 'Dr. Kenji Sato'
  },
  {
    id: 'cm-4',
    productId: 'prod-keytruda',
    canonicalConcept: 'CONTRAINDICATIONS',
    coreVersion: 'CCDS Rev 15.0',
    market: 'Great Britain (MHRA)',
    localVersion: 'GB SmPC v9.0',
    status: 'ALIGNED',
    lastComparedDate: '2026-09-21',
    differencesSummary: 'Adopted via Great Britain Marketing Authorisation (GBMA) Reliance Route.',
    affiliateLead: 'Clare Pembroke'
  },
  {
    id: 'cm-5',
    productId: 'prod-keytruda',
    canonicalConcept: 'INDICATIONS_AND_USAGE',
    coreVersion: 'CCDS Rev 15.0',
    market: 'Australia (TGA)',
    localVersion: 'AU PI v11.2',
    status: 'STALE',
    lastComparedDate: '2026-09-15',
    differencesSummary: 'Category 1 submission pending evaluation round 2.',
    affiliateLead: 'Mark Thornton'
  },
  {
    id: 'cm-6',
    productId: 'prod-keytruda',
    canonicalConcept: 'POSOLOGY_AND_METHOD_OF_ADMINISTRATION',
    coreVersion: 'CCDS Rev 15.0',
    market: 'Canada (Health Canada)',
    localVersion: 'Product Monograph v12',
    status: 'CONFLICT',
    lastComparedDate: '2026-09-18',
    differencesSummary: 'Health Canada requested distinct pediatric dosing table layout conflicting with CCDS paragraph structure.',
    affiliateLead: 'Jean-Luc Tremblay'
  }
];

export const MOCK_SIGNALS: RegulatorySignal[] = [
  {
    id: 'sig-prac-2026-08',
    sourceAuthority: 'EMA_PRAC',
    signalTitle: 'PRAC Recommendation: Mandatory hepatic transaminase baseline check for immune checkpoint inhibitors',
    detectedDate: '2026-08-25',
    activeSubstance: 'Pembrolizumab',
    clinicalSummary: 'Following cumulative safety review of post-marketing immune-mediated fatal hepatitis, PRAC recommends updating Section 4.4 and Section 4.8 across all anti-PD-1/PD-L1 monoclonal antibodies to mandate periodic liver function tests prior to each infusion.',
    urgencyLevel: 'CRITICAL_SAFETY',
    linkedChangeCandidateId: 'cand-keytruda-01',
    status: 'CONVERTED_TO_CHANGE'
  },
  {
    id: 'sig-fda-2026-09',
    sourceAuthority: 'FDA_MEDWATCH',
    signalTitle: 'FDA Safety Alert: Excipient sensitivity reporting in biologics packaging',
    detectedDate: '2026-09-04',
    activeSubstance: 'General Biologics',
    clinicalSummary: 'FDA alerts manufacturers regarding updated labeling guidelines for Polysorbate 80 presence declaration in Section 11 Description.',
    urgencyLevel: 'HIGH',
    status: 'EVALUATING'
  }
];

export const MOCK_REVIEWS: HumanReviewRecord[] = [
  {
    id: 'rev-001',
    changeCandidateId: 'cand-keytruda-01',
    reviewTitle: 'Keytruda Section 4.4 / 5.1 Hepatic Monitoring Protocol Harmonization',
    productName: 'Keytruda (pembrolizumab)',
    market: 'Global Core / US PI',
    sectionCode: '4.4 / 5.1',
    candidateClass: 'SAFETY_WARNING_ADDITION',
    assignedTo: 'Dr. Marcus Dubois, MD',
    assignedRole: 'Safety / Medical Reviewer',
    reviewDeadline: '2026-10-15',
    status: 'PENDING',
    decisions: [
      {
        decisionType: 'REQUEST_EVIDENCE',
        decidedBy: 'Dr. Marcus Dubois, MD',
        decidedRole: 'Safety / Medical Reviewer',
        timestamp: '2026-09-29T10:14:22Z',
        reasonText: 'Need confirmation whether Grade 2 hepatitis with elevated AST >3x ULN requires infusion suspension or merely closer monitoring interval before approving global CCDS wording.',
        evidenceNotes: 'Cross-reference with KEYNOTE-006 safety appendices.',
        digitalSignatureSha256: '9f83c12658efb1c09b83b3e2187d9a13b9426f8d0714b8a2e1d09f7a4e6b5281'
      }
    ]
  },
  {
    id: 'rev-002',
    changeCandidateId: 'cand-ozempic-02',
    reviewTitle: 'Ozempic Section 4.2 Dosing Clarification for 2 mg Strengths',
    productName: 'Ozempic (semaglutide)',
    market: 'EU SmPC',
    sectionCode: '4.2',
    candidateClass: 'POSOLOGY_DOSING_ADJUSTMENT',
    assignedTo: 'Dr. Sarah Vance, PharmD',
    assignedRole: 'Global Labeling Lead',
    reviewDeadline: '2026-10-08',
    status: 'APPROVED',
    decisions: [
      {
        decisionType: 'APPROVE_CANDIDATE',
        decidedBy: 'Dr. Sarah Vance, PharmD',
        decidedRole: 'Global Labeling Lead',
        timestamp: '2026-09-25T16:40:11Z',
        reasonText: 'Wording aligns with clinical study SUSTAIN-FORTE results and CHMP positive opinion.',
        digitalSignatureSha256: '7c92b810d7a24e189c4250ab13824f923e1b09819ca421098b1e428d09f7129b'
      }
    ]
  }
];

export const MOCK_TASKS: ImplementationTask[] = [
  {
    id: 'task-eu-smpc-keytruda',
    productId: 'prod-keytruda',
    productName: 'Keytruda',
    market: 'EU (EMA)',
    taskTitle: 'Submit Type II Variation for Section 4.4 Warnings Update',
    changeDescription: 'Incorporate Core CCDS Rev 15.0 hepatic monitoring protocol into EU SmPC and Package Leaflet.',
    affiliateOwner: 'Dr. Elena Rostova',
    dueDate: '2026-11-01',
    status: 'SUBMITTED_TO_HA',
    proofs: [
      {
        id: 'proof-ema-01',
        fileName: 'EMA_Submission_eCTD_Sequence_0142_Receipt.pdf',
        fileHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        uploadDate: '2026-09-26',
        uploadedBy: 'Elena Rostova',
        submissionTrackingNumber: 'EMA/H/C/003820/II/0142',
        verificationStatus: 'VERIFIED'
      }
    ],
    notes: 'Validation report received from EMA procedural manager. Clock started on Day 0.'
  },
  {
    id: 'task-jp-pmda-keytruda',
    productId: 'prod-keytruda',
    productName: 'Keytruda',
    market: 'Japan (PMDA)',
    taskTitle: 'PMDA Minor Change Notification & XML Package Insert Redraft',
    changeDescription: 'Align Japanese Package Insert Section 8 Warnings with CCDS Rev 15.0 transaminase rule.',
    affiliateOwner: 'Dr. Kenji Sato',
    dueDate: '2026-11-20',
    status: 'IN_PROGRESS',
    proofs: [],
    notes: 'Japanese translation under committee review with local clinical safety experts.'
  },
  {
    id: 'task-au-tga-keytruda',
    productId: 'prod-keytruda',
    productName: 'Keytruda',
    market: 'Australia (TGA)',
    taskTitle: 'TGA Safety-Related Request (SRR) Dossier Preparation',
    changeDescription: 'Prepare Form 01 for Section 4.4 and Section 4.8 updates.',
    affiliateOwner: 'Mark Thornton',
    dueDate: '2026-10-25',
    status: 'VERIFICATION_REQUIRED',
    proofs: [
      {
        id: 'proof-tga-01',
        fileName: 'TGA_SRR_Portal_Acknowledgement_2026.pdf',
        fileHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        uploadDate: '2026-09-29',
        uploadedBy: 'Mark Thornton',
        submissionTrackingNumber: 'TGA-SRR-2026-8812',
        verificationStatus: 'PENDING'
      }
    ],
    notes: 'Proof uploaded; awaiting Global RegOps signature verification to close.'
  }
];

export const MOCK_DIGITAL_LINKS: DigitalLinkCheck[] = [
  {
    id: 'dl-01',
    productName: 'Keytruda EU 100 mg/4 mL',
    declaredEndpointUrl: 'https://www.ema.europa.eu/en/medicines/human/EPAR/keytruda#product-information',
    market: 'EU (EMA)',
    qrPayload: 'https://pramanex.canon.rx/verify/eu/keytruda?v=9.1&batch=L098124',
    resolvedTargetVersion: 'SmPC v9.1 (Active)',
    expectedVersion: 'SmPC v9.1',
    languageDetected: 'EN (Official ePI)',
    expectedLanguage: 'EN',
    status: 'VERIFIED_ACTIVE',
    lastCheckedAt: '2026-10-02T05:30:00Z',
    verificationNotes: '2D DataMatrix barcode resolves to authorized EMA ePI portal with valid cryptographic certificate.'
  },
  {
    id: 'dl-02',
    productName: 'Ozempic 1 mg Pre-filled Pen',
    declaredEndpointUrl: 'https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=ozempic-spl-v8',
    market: 'US (FDA)',
    qrPayload: 'https://pramanex.canon.rx/verify/us/ozempic?v=8.0&ndc=0169-4130-13',
    resolvedTargetVersion: 'US PI v8.0',
    expectedVersion: 'US PI v8.1 (Approved 2026-09)',
    languageDetected: 'EN',
    expectedLanguage: 'EN',
    status: 'SUPERSEDED_TARGET_WARNING',
    lastCheckedAt: '2026-10-01T22:15:00Z',
    verificationNotes: 'Physical packaging QR code still targets superseded version 8.0 instead of newly approved version 8.1. Artwork reprint required.'
  }
];

export const MOCK_PROVENANCE_STEPS: ProvenanceStep[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    stageName: 'Intake & Hash Snapshot',
    title: 'Authoritative FDA SPL Ingestion',
    actor: 'Automated Ingestion Pipeline',
    actorType: 'SYSTEM',
    timestamp: '2026-09-19T06:12:00Z',
    sha256Hash: 'f49b18361e27a69cb3914a291f83c617b889314c27598db491024317fbb97b21',
    parameters: {
      source: 'FDA DailyMed SPL Repository',
      setId: 'keytruda-15-0',
      format: 'SPL_XML',
      byteLength: '1,420,892 bytes'
    }
  },
  {
    id: 'step-2',
    stepNumber: 2,
    stageName: 'Canonical Normalisation',
    title: 'Section Mapping & Heading Anchor Lock',
    actor: 'Section Normalization Specialist',
    actorType: 'SYSTEM',
    timestamp: '2026-09-19T06:12:04Z',
    sha256Hash: '38b901a89c25f4e0789bc4512e098a76384910294716b509124018376518a451',
    parameters: {
      mappedHeadings: '12 / 12 Standard Sections',
      loincCode: '34067-9 (Contraindications)',
      unmappedSections: '0'
    }
  },
  {
    id: 'step-3',
    stepNumber: 3,
    stageName: 'Deterministic Diff',
    title: 'Myers Word-Level Difference Analysis',
    actor: 'Exact-Diff Specialist Engine',
    actorType: 'SYSTEM',
    timestamp: '2026-09-19T06:12:06Z',
    sha256Hash: '87fa0192847c10b4912e847c0128947b19284710294716b509124018376518a4',
    parameters: {
      insertions: '32 words',
      deletions: '14 words',
      modifiedParagraphs: 'Section 4.1, Section 4.3, Section 5.1'
    }
  },
  {
    id: 'step-4',
    stepNumber: 4,
    stageName: 'Semantic Candidate',
    title: 'Clinical Meaning Classification & Uncertainty Check',
    actor: 'Gemini Multi-Agent Clinical Gateway',
    actorType: 'AI_GATEWAY',
    timestamp: '2026-09-19T06:12:12Z',
    sha256Hash: '9182736450192837465019283746501928374650192837465019283746501928',
    parameters: {
      proposedClass: 'SAFETY_WARNING_ADDITION',
      calibratedConfidence: '96.2%',
      uncertaintyFlagCount: '2',
      missingEvidenceNotes: '1'
    }
  },
  {
    id: 'step-5',
    stepNumber: 5,
    stageName: 'Named Human Review',
    title: 'Clinical Authority Evaluation & Evidence Request',
    actor: 'Dr. Marcus Dubois, MD (Safety Lead)',
    actorType: 'NAMED_HUMAN',
    timestamp: '2026-09-29T10:14:22Z',
    sha256Hash: '9f83c12658efb1c09b83b3e2187d9a13b9426f8d0714b8a2e1d09f7a4e6b5281',
    parameters: {
      decision: 'REQUEST_EVIDENCE',
      role: 'Safety / Medical Reviewer',
      bindingReason: 'Clarify Grade 2 vs Grade 3 cutoffs against KEYNOTE-006'
    }
  }
];

export const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'audit-001',
    actor: 'Dr. Sarah Vance, PharmD',
    actorRole: 'Global Labeling Lead',
    action: 'REGISTER_LABEL_VERSION',
    resource: 'LabelVersion:ver-keytruda-us-v15',
    resourceId: 'ver-keytruda-us-v15',
    timestamp: '2026-09-19T06:15:00Z',
    correlationId: 'corr-tx-8812-a1',
    ipAddress: '192.168.1.104',
    details: 'Ingested FDA US PI v15.0 SPL with SHA-256 hash locked and verified against DailyMed endpoint.',
    severity: 'INFO'
  },
  {
    id: 'audit-002',
    actor: 'Deterministic Diff Specialist Engine',
    actorRole: 'IT / Validation / Security',
    action: 'EXECUTE_EXACT_DIFF',
    resource: 'Comparison:comp-keytruda-v14-v15',
    resourceId: 'comp-keytruda-v14-v15',
    timestamp: '2026-09-19T06:15:08Z',
    correlationId: 'corr-tx-8812-a2',
    ipAddress: '10.0.4.12',
    details: 'Completed Myers token difference without generative interpolation. 3 section changes identified.',
    severity: 'INFO'
  },
  {
    id: 'audit-003',
    actor: 'Dr. Marcus Dubois, MD',
    actorRole: 'Safety / Medical Reviewer',
    action: 'SUBMIT_HUMAN_DECISION',
    resource: 'ReviewRecord:rev-001',
    resourceId: 'rev-001',
    timestamp: '2026-09-29T10:14:22Z',
    correlationId: 'corr-tx-8812-a3',
    ipAddress: '192.168.1.112',
    details: 'Submitted REQUEST_EVIDENCE for Hepatic Monitoring Candidate. Digital signature hash verified.',
    severity: 'WARNING'
  },
  {
    id: 'audit-004',
    actor: 'Elena Rostova',
    actorRole: 'Local Affiliate RA',
    action: 'UPLOAD_SUBMISSION_PROOF',
    resource: 'Task:task-eu-smpc-keytruda',
    resourceId: 'task-eu-smpc-keytruda',
    timestamp: '2026-09-26T14:02:18Z',
    correlationId: 'corr-tx-8812-a4',
    ipAddress: '192.168.4.88',
    details: 'Attached official eCTD sequence receipt. Verified hash matches SHA-256 cryptographic manifest.',
    severity: 'INFO'
  }
];
