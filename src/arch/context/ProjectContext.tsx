import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ProjectCustomer,
  EngagementType,
  SalesStage,
  ConceptOption,
  BOQItem,
  BOQRevision,
  DetailedDeliverable,
  SiteExecutionMilestone,
  SnagItem,
  InvoiceRecord,
  WarrantyServiceTicket,
  MasterDataHubState,
  TradeCategoryMaster,
  MaterialMaster,
  SpaceZoneMaster,
  VendorMaster,
  MilestoneTemplateMaster,
  TeamMemberMaster,
  ArchitecturalVisualAsset,
  SampleInspirationData,
  MaterialSpec,
  CRMActivity,
  CRM_SALES_STAGES_ORDER,
  STAGE_WIN_PROBABILITIES,
} from '../types';
import { INITIAL_SEED_PROJECTS } from '../data/mockSeed';
import { INITIAL_MASTER_DATA } from '../data/masterSeed';
import { getVisualAssetsForConcept } from '../data/architecturalAssets';

const STORAGE_KEY = 'archcrm_data_v1';
const MASTERS_STORAGE_KEY = 'archcrm_masters_v1';

interface ProjectContextType {
  isSynced: boolean;
  projects: ProjectCustomer[];
  activeProjectId: string;
  activeProject: ProjectCustomer | undefined;
  setActiveProjectId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedEngagementFilter: EngagementType | 'All';
  setSelectedEngagementFilter: (filter: EngagementType | 'All') => void;
  selectedStageFilter: SalesStage | 'All';
  setSelectedStageFilter: (filter: SalesStage | 'All') => void;
  isGeneratingConcepts: boolean;
  lastSavedTimestamp: Date | null;
  
  createEnquiry: (data: Partial<ProjectCustomer>) => ProjectCustomer;
  updateProject: (id: string, updates: Partial<ProjectCustomer>) => void;
  deleteProject: (id: string) => void;
  
  // CRM Process Flow Methods
  advanceProjectStage: (projectId: string, targetStage?: SalesStage, note?: string) => void;
  logCRMActivity: (projectId: string, activity: Omit<CRMActivity, 'id' | 'timestamp'>) => void;
  toggleStageChecklistItem: (projectId: string, checklistKey: string) => void;
  
  generateConceptsForProject: (
    projectId: string,
    customParams?: {
      builtUpAreaSqFt?: number;
      siteAreaSqFt?: number;
      budgetTier?: any;
      targetBudget?: number;
      targetTimelineMonths?: number;
      engagementType?: any;
      confirmedRequirements?: {
        projectVision: string;
        roomZones: string[];
        stylePreferences: string[];
        specialConstraints: string;
        dateConfirmed?: string;
      };
      visualDirectives?: {
        renderingFocus?: string;
        lightingAtmosphere?: string;
        cameraPerspective?: string;
      };
    }
  ) => Promise<boolean>;
  generateGeminiImageForAsset: (
    projectId: string,
    conceptId: string,
    assetType: ArchitecturalVisualAsset['type'],
    prompt: string,
    style?: string
  ) => Promise<{ success: boolean; imageUrl?: string; source?: string; error?: string }>;
  refineConceptWithGemini: (
    projectId: string,
    conceptId: string,
    instruction: string
  ) => Promise<{ success: boolean; concept?: ConceptOption; error?: string }>;
  critiqueConceptWithGemini: (
    projectId: string,
    conceptId: string
  ) => Promise<{ success: boolean; critique?: ConceptOption['aiCritique']; error?: string }>;
  generatePitchWithGemini: (
    projectId: string,
    conceptId: string
  ) => Promise<{ success: boolean; pitch?: ConceptOption['aiPitchScript']; error?: string }>;
  geminiStatus: {
    connected: boolean;
    model: string;
    imageModel: string;
    checked: boolean;
  };
  refreshGeminiStatus: () => Promise<void>;
  generationProgress: {
    isStreaming: boolean;
    step: number;
    totalSteps: number;
    phase: string;
    message: string;
  } | null;
  updateConceptReview: (
    projectId: string,
    conceptId: string,
    internalReview: Partial<ConceptOption['internalReview']>,
    clientReview: Partial<ConceptOption['clientReview']>
  ) => void;
  selectConcept: (projectId: string, conceptId: string) => void;
  carryForwardConcept: (projectId: string, conceptId: string) => void;
  addConceptVisualAsset: (
    projectId: string,
    conceptId: string,
    asset: Omit<ArchitecturalVisualAsset, 'id'>
  ) => void;
  updateConceptVisualAsset: (
    projectId: string,
    conceptId: string,
    assetTypeOrId: string,
    updates: Partial<ArchitecturalVisualAsset>
  ) => void;
  approveConceptDrawingSheets: (
    projectId: string,
    conceptId: string,
    approverName?: string,
    approverRole?: string,
    notes?: string
  ) => void;
  discardDraftDrawingSheets: (projectId: string, conceptId: string) => void;
  stageDrawingSheetUpload: (
    projectId: string,
    conceptId: string,
    sheetType: ArchitecturalVisualAsset['type'],
    fileDataUrl: string,
    metadata: {
      title?: string;
      drawingNumber?: string;
      subtitle?: string;
      caption?: string;
      tags?: string[];
      scale?: string;
      revision?: string;
    }
  ) => void;
  addCustomerReference: (
    projectId: string,
    reference: Omit<SampleInspirationData, 'id'>
  ) => void;
  deleteCustomerReference: (
    projectId: string,
    referenceId: string
  ) => void;
  addMaterialToConcept: (
    projectId: string,
    conceptId: string,
    material: MaterialSpec
  ) => void;
  
  createBOQRevision: (
    projectId: string,
    revisionLabel: string,
    reason: string,
    items: BOQItem[],
    marginPercent: number,
    contingencyPercent: number,
    taxPercent: number
  ) => void;
  setActiveBOQRevision: (projectId: string, revisionNumber: number) => void;
  
  addSnagItem: (projectId: string, snag: Omit<SnagItem, 'id' | 'reportedDate'>) => void;
  updateSnagItemStatus: (projectId: string, snagId: string, status: SnagItem['status']) => void;
  
  recordInvoicePayment: (projectId: string, invoiceId: string, amount: number) => void;
  createInvoice: (projectId: string, invoice: Omit<InvoiceRecord, 'id' | 'invoiceNumber'>) => void;
  
  addWarrantyTicket: (projectId: string, ticket: Omit<WarrantyServiceTicket, 'id' | 'ticketNumber' | 'reportedDate'>) => void;
  updateWarrantyTicketStatus: (projectId: string, ticketId: string, status: WarrantyServiceTicket['status']) => void;
  
  // Master Data Module
  masterData: MasterDataHubState;
  addTradeMaster: (item: Omit<TradeCategoryMaster, 'id'>) => void;
  updateTradeMaster: (id: string, updates: Partial<TradeCategoryMaster>) => void;
  deleteTradeMaster: (id: string) => void;
  addMaterialMaster: (item: Omit<MaterialMaster, 'id'>) => void;
  updateMaterialMaster: (id: string, updates: Partial<MaterialMaster>) => void;
  deleteMaterialMaster: (id: string) => void;
  addSpaceZoneMaster: (item: Omit<SpaceZoneMaster, 'id'>) => void;
  updateSpaceZoneMaster: (id: string, updates: Partial<SpaceZoneMaster>) => void;
  deleteSpaceZoneMaster: (id: string) => void;
  addVendorMaster: (item: Omit<VendorMaster, 'id'>) => void;
  updateVendorMaster: (id: string, updates: Partial<VendorMaster>) => void;
  deleteVendorMaster: (id: string) => void;
  addMilestoneTemplateMaster: (item: Omit<MilestoneTemplateMaster, 'id'>) => void;
  updateMilestoneTemplateMaster: (id: string, updates: Partial<MilestoneTemplateMaster>) => void;
  deleteMilestoneTemplateMaster: (id: string) => void;
  addTeamMemberMaster: (item: Omit<TeamMemberMaster, 'id'>) => void;
  updateTeamMemberMaster: (id: string, updates: Partial<TeamMemberMaster>) => void;
  deleteTeamMemberMaster: (id: string) => void;
  resetMastersToDefault: () => void;

  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  resetToDefaultSeed: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectCustomer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not parse local storage data, loading default seed:', err);
    }
    return INITIAL_SEED_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return projects[0]?.id || 'proj-001';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngagementFilter, setSelectedEngagementFilter] = useState<EngagementType | 'All'>('All');
  const [selectedStageFilter, setSelectedStageFilter] = useState<SalesStage | 'All'>('All');
  const [isGeneratingConcepts, setIsGeneratingConcepts] = useState(false);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<Date | null>(new Date());

  const [generationProgress, setGenerationProgress] = useState<{
    isStreaming: boolean;
    step: number;
    totalSteps: number;
    phase: string;
    message: string;
  } | null>(null);

  const [geminiStatus, setGeminiStatus] = useState<{
    connected: boolean;
    model: string;
    imageModel: string;
    checked: boolean;
  }>({
    connected: false,
    model: 'gemini-3.8-flash',
    imageModel: 'gemini-3.1-flash-lite-image',
    checked: false,
  });

  const refreshGeminiStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/gemini/status');
      if (res.ok) {
        const data = await res.json();
        setGeminiStatus({
          connected: Boolean(data.connected),
          model: data.model || 'gemini-3.8-flash',
          imageModel: data.imageModel || 'gemini-3.1-flash-lite-image',
          checked: true,
        });
      }
    } catch (err) {
      console.warn('Could not fetch Gemini status:', err);
      setGeminiStatus((prev) => ({ ...prev, checked: true }));
    }
  }, []);

  useEffect(() => {
    refreshGeminiStatus();
  }, [refreshGeminiStatus]);

  // Master Data Hub State
  const [masterData, setMasterData] = useState<MasterDataHubState>(() => {
    try {
      const saved = localStorage.getItem(MASTERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.trades && parsed.materials) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse master data from localStorage', err);
    }
    return INITIAL_MASTER_DATA;
  });

  const [loaded, setLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Loading shared project data…');
  const revision = useRef(0);
  const lastPayload = useRef('');
  const saveQueue = useRef(Promise.resolve());
  const blocked = useRef(false);
  const dirty = useRef(false);
  const latestPayload = useRef('');
  useEffect(() => {
    let cancelled = false;
    fetch('/api/architecture/state').then(async r => {
      const d = await r.json(); if(!r.ok) throw new Error(d.error || 'Unable to load shared data.');
      if(cancelled) return;
      revision.current = d.revision;
      lastPayload.current = JSON.stringify({projects:d.projects, masterData:d.masterData});
      setProjects(d.projects); setMasterData(d.masterData); setLoaded(true); setSyncStatus('All changes saved');
    }).catch(e => {if(!cancelled) setSyncStatus(e.message);});
    const guard = (e: BeforeUnloadEvent) => {if(dirty.current) {e.preventDefault();e.returnValue='';}};
    window.addEventListener('beforeunload',guard);
    return () => {cancelled=true;window.removeEventListener('beforeunload',guard);};
  }, []);
  useEffect(() => {
    if(!loaded) return;
    const payload = JSON.stringify({projects,masterData});
    if(payload===lastPayload.current) return;
    latestPayload.current = payload;
    dirty.current = true;
    if(blocked.current) return;
    setSyncStatus('Saving changes…');
    const timer = setTimeout(() => {
      saveQueue.current = saveQueue.current.then(async () => {
        if(blocked.current) return;
        const r = await fetch('/api/architecture/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...JSON.parse(payload),revision:revision.current})});
        const d = await r.json();
        if(!r.ok) throw new Error(d.error || 'Changes could not be saved. Export a backup before reloading.');
        revision.current = d.revision; lastPayload.current = payload;
        if(latestPayload.current === payload) {dirty.current = false;setLastSavedTimestamp(new Date());setSyncStatus('All changes saved');}
      }).catch(e=>{blocked.current=true;setSyncStatus(e.message+' Use Data Backup to export your unsaved work.');});
    },300);
    return ()=>clearTimeout(timer);
  },[projects,masterData,loaded]);

  const activeProject = useMemo(() => {
    const p = projects.find((proj) => proj.id === activeProjectId) || projects[0];
    if (!p) return undefined;
    return {
      ...p,
      conceptOptions: p.conceptOptions.map((opt) => ({
        ...opt,
        visualAssets:
          opt.hasUnapprovedDraftSheets && opt.stagedVisualAssets && opt.stagedVisualAssets.length > 0
            ? opt.stagedVisualAssets
            : opt.visualAssets && opt.visualAssets.length > 0
            ? opt.visualAssets
            : getVisualAssetsForConcept(opt.optionNumber, opt.themeStyle, p.builtUpAreaSqFt),
      })),
    };
  }, [projects, activeProjectId]);

  const createEnquiry = useCallback((data: Partial<ProjectCustomer>): ProjectCustomer => {
    const nextNum = Math.floor(100 + Math.random() * 900);
    const newId = `proj-${Date.now().toString().slice(-6)}`;
    const newEnquiry: ProjectCustomer = {
      id: newId,
      enquiryNumber: `ENQ-2026-${nextNum}`,
      clientName: data.clientName || 'New Client',
      organizationOrFamily: data.organizationOrFamily || 'Client Residence',
      contactEmail: data.contactEmail || '',
      contactPhone: data.contactPhone || '',
      siteAddress: data.siteAddress || 'TBD',
      siteCity: data.siteCity || 'San Francisco, CA',
      siteAreaSqFt: data.siteAreaSqFt || 2500,
      builtUpAreaSqFt: data.builtUpAreaSqFt || 2200,
      engagementType: data.engagementType || 'Interior turnkey',
      budgetTier: data.budgetTier || 'Standard Premium',
      targetBudget: data.targetBudget || 250000,
      targetTimelineMonths: data.targetTimelineMonths || 6,
      confirmedRequirements: data.confirmedRequirements || {
        projectVision: 'Contemporary living with clean architectural lines and high functionality.',
        roomZones: ['Entry Foyer', 'Living & Dining', 'Kitchen', 'Master Suite'],
        stylePreferences: ['Modern Minimalist'],
        specialConstraints: 'Natural light optimization and low-maintenance finishes.',
        dateConfirmed: new Date().toISOString().split('T')[0],
      },
      nextAction: data.nextAction || {
        actionTitle: 'Generate & Review Initial 4-5 Concepts',
        assigneeName: 'Design Lead',
        assigneeRole: 'Project Architect',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        priority: 'Normal',
        isCompleted: false,
      },
      salesStage: 'Requirement Confirmed',
      designStatus: 'Briefing',
      executionStatus: 'Pre-construction',
      billingStatus: 'Unbilled',
      collectionStatus: 'Pending Advance',
      warrantyStatus: 'Not Applicable',
      conceptOptions: [],
      detailedDeliverables: [],
      boqRevisions: [],
      activeBOQRevisionNumber: 0,
      executionMilestones: [],
      snagItems: [],
      invoices: [],
      defectLiabilityRetentionAmount: 0,
      warrantyTickets: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [newEnquiry, ...prev]);
    setActiveProjectId(newId);
    return newEnquiry;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<ProjectCustomer>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length > 0 && activeProjectId === id) {
        setActiveProjectId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeProjectId]);

  // CRM Process Flow Methods
  const advanceProjectStage = useCallback((
    projectId: string,
    targetStage?: SalesStage,
    note?: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        let nextStage = targetStage;
        if (!nextStage) {
          const currentIndex = CRM_SALES_STAGES_ORDER.indexOf(p.salesStage);
          if (currentIndex >= 0 && currentIndex < CRM_SALES_STAGES_ORDER.length - 1) {
            nextStage = CRM_SALES_STAGES_ORDER[currentIndex + 1];
          } else {
            nextStage = p.salesStage;
          }
        }

        const updates: Partial<ProjectCustomer> = {
          salesStage: nextStage,
          winProbability: STAGE_WIN_PROBABILITIES[nextStage] ?? 50,
          updatedAt: new Date().toISOString(),
        };

        // Harmonize cross-functional downstream statuses on stage advancement
        if (nextStage === 'Site Survey' && p.designStatus === 'Briefing') {
          // Survey ongoing
        } else if (nextStage === 'Concept Pitch' && p.designStatus === 'Briefing') {
          updates.designStatus = '4-5 Concepts Generated';
        } else if (nextStage === 'Won / Contract Signed') {
          if (p.executionStatus === 'Pre-construction') {
            updates.executionStatus = 'Mobilization';
          }
          if (p.billingStatus === 'Unbilled') {
            updates.billingStatus = 'Milestone Invoiced';
          }
          if (p.collectionStatus === 'Pending Advance') {
            updates.collectionStatus = 'Milestone Retentions';
          }
        }

        const stageChangeAct: CRMActivity = {
          id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          type: 'stage_change',
          title: `Stage updated to "${nextStage}"`,
          description: note || `Deal advanced from ${p.salesStage} to ${nextStage}.`,
          author: 'Commercial Lead',
          timestamp: new Date().toISOString(),
          stageAtTime: nextStage,
        };

        return {
          ...p,
          ...updates,
          crmActivities: [stageChangeAct, ...(p.crmActivities || [])],
        };
      })
    );
  }, []);

  const logCRMActivity = useCallback((
    projectId: string,
    activity: Omit<CRMActivity, 'id' | 'timestamp'>
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newAct: CRMActivity = {
          ...activity,
          id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toISOString(),
          stageAtTime: p.salesStage,
        };
        return {
          ...p,
          crmActivities: [newAct, ...(p.crmActivities || [])],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const toggleStageChecklistItem = useCallback((
    projectId: string,
    checklistKey: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const current = p.qualificationChecklist || {};
        return {
          ...p,
          qualificationChecklist: {
            ...current,
            [checklistKey]: !current[checklistKey],
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const generateConceptsForProject = useCallback(async (projectId: string, customParams?: any): Promise<boolean> => {
    setIsGeneratingConcepts(true);
    setGenerationProgress({
      isStreaming: true,
      step: 1,
      totalSteps: 4,
      phase: 'brief_analysis',
      message: 'Connecting to Gemini 3.8 Flash & analyzing spatial zoning parameters...',
    });

    const target = projects.find((p) => p.id === projectId);
    if (!target) {
      setIsGeneratingConcepts(false);
      setGenerationProgress(null);
      return false;
    }

    const effectiveTarget = {
      ...target,
      ...(customParams || {}),
      confirmedRequirements: {
        ...target.confirmedRequirements,
        ...(customParams?.confirmedRequirements || {}),
      },
    };

    const payload = {
      clientName: effectiveTarget.clientName,
      engagementType: effectiveTarget.engagementType,
      siteAreaSqFt: effectiveTarget.siteAreaSqFt,
      builtUpAreaSqFt: effectiveTarget.builtUpAreaSqFt,
      budgetTier: effectiveTarget.budgetTier,
      targetBudget: effectiveTarget.targetBudget,
      targetTimelineMonths: effectiveTarget.targetTimelineMonths,
      confirmedRequirements: effectiveTarget.confirmedRequirements,
      visualDirectives: customParams?.visualDirectives,
    };

    // Try Real-Time Streaming SSE endpoint first
    try {
      const streamRes = await fetch('/api/gemini/stream-concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (streamRes.ok && streamRes.body) {
        const reader = streamRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let completedData: any = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('event: progress')) {
              const nextLine = lines[i + 1]?.trim();
              if (nextLine?.startsWith('data: ')) {
                try {
                  const prog = JSON.parse(nextLine.slice(6));
                  setGenerationProgress({
                    isStreaming: true,
                    step: prog.step || 1,
                    totalSteps: prog.totalSteps || 4,
                    phase: prog.phase || 'gemini_synthesis',
                    message: prog.message || 'Synthesizing architectural specifications...',
                  });
                } catch (e) {}
              }
            } else if (line.startsWith('event: complete')) {
              const nextLine = lines[i + 1]?.trim();
              if (nextLine?.startsWith('data: ')) {
                try {
                  completedData = JSON.parse(nextLine.slice(6));
                } catch (e) {}
              }
            }
          }
        }

        if (completedData?.concepts && Array.isArray(completedData.concepts) && completedData.concepts.length >= 4) {
          const mappedConcepts: ConceptOption[] = completedData.concepts.map((c: any, index: number) => ({
            id: `opt-${projectId}-${index + 1}`,
            optionNumber: index + 1,
            title: c.title || `Concept Option ${index + 1}`,
            themeStyle: c.themeStyle || 'Modern Minimalist Architecture',
            architecturalNarrative: c.architecturalNarrative || 'Balanced spatial planning prioritizing light and circulation.',
            spatialZoning: c.spatialZoning || [
              { zone: 'Living & Entertaining', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.45), flowDescription: 'Fluid social flow.' },
              { zone: 'Master Sanctum', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.35), flowDescription: 'Private quiet quarters.' },
              { zone: 'Services & Utility', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.20), flowDescription: 'Efficient MEP core.' },
            ],
            materials: c.materials || [
              { category: 'Flooring', material: 'Wide-Plank Engineered Timber', finish: 'Matte Oil', ecoRating: 'FSC Certified', estimatedRatePerUnit: 18, unit: 'sq.ft' },
              { category: 'Joinery & Woodwork', material: 'Natural Veneer Millwork', finish: 'Satin Zero-VOC', ecoRating: 'Class A', estimatedRatePerUnit: 44, unit: 'sq.ft' },
              { category: 'Wall Finishes', material: 'Mineral Plaster', finish: 'Slight Stucco', ecoRating: 'Zero VOC', estimatedRatePerUnit: 10, unit: 'sq.ft' },
              { category: 'Hardware & Fixtures', material: 'Solid Brushed Brass', finish: 'PVD Coated', ecoRating: 'Recyclable Alloy', estimatedRatePerUnit: 80, unit: 'item' },
            ],
            sustainabilityScore: c.sustainabilityScore || 90,
            estimatedCostPerSqFt: c.estimatedCostPerSqFt || Math.round(target.targetBudget / target.builtUpAreaSqFt),
            totalEstimatedCost: c.totalEstimatedCost || target.targetBudget,
            estimatedWeeks: c.estimatedWeeks || Math.round(target.targetTimelineMonths * 4.3),
            renderTheme: {
              accentColor: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : index === 3 ? '#8b5cf6' : '#059669',
              secondaryColor: index === 0 ? '#ecfdf5' : index === 1 ? '#eff6ff' : index === 2 ? '#fffbeb' : index === 3 ? '#f5f3ff' : '#f0fdf4',
              styleTag: c.themeStyle || 'Modern Concept',
              schematicType: c.schematicType || 'contemporary',
            },
            internalReview: {
              reviewedBy: 'Elena Rostova (Design Principal)',
              approvedForClient: true,
              leadNotes: c.internalLeadNotes || 'Real-time synthesis verified with Gemini 3.8 Flash.',
              reviewDate: new Date().toISOString().split('T')[0],
            },
            clientReview: {
              isShared: true,
              clientApproved: false,
              clientComments: '',
            },
            isSelectedConcept: false,
            visualAssets: c.visualAssets && c.visualAssets.length > 0
              ? c.visualAssets
              : getVisualAssetsForConcept(index + 1, c.themeStyle, effectiveTarget.builtUpAreaSqFt),
          }));

          updateProject(projectId, {
            ...(customParams || {}),
            conceptOptions: mappedConcepts,
            designStatus: '4-5 Concepts Generated',
            salesStage: 'Concept Pitch',
            nextAction: {
              actionTitle: 'Internal Review & Client Presentation of 5 Concepts',
              assigneeName: 'Elena Rostova',
              assigneeRole: 'Design Principal',
              dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
              priority: 'Urgent',
              isCompleted: false,
            },
          });
          setIsGeneratingConcepts(false);
          setGenerationProgress(null);
          return true;
        }
      }
    } catch (streamErr) {
      console.warn('Real-time streaming generation error, falling back to standard API endpoint:', streamErr);
    }

    try {
      const response = await fetch('/api/generate-concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI Concept endpoint');
      }

      const data = await response.json();
      if (data.concepts && Array.isArray(data.concepts) && data.concepts.length >= 4) {
        const mappedConcepts: ConceptOption[] = data.concepts.map((c: any, index: number) => ({
          id: `opt-${projectId}-${index + 1}`,
          optionNumber: index + 1,
          title: c.title || `Concept Option ${index + 1}`,
          themeStyle: c.themeStyle || 'Modern Minimalist Architecture',
          architecturalNarrative: c.architecturalNarrative || 'Balanced spatial planning prioritizing light and circulation.',
          spatialZoning: c.spatialZoning || [
            { zone: 'Living & Entertaining', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.45), flowDescription: 'Fluid social flow.' },
            { zone: 'Master Sanctum', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.35), flowDescription: 'Private quiet quarters.' },
            { zone: 'Services & Utility', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.20), flowDescription: 'Efficient MEP core.' },
          ],
          materials: c.materials || [
            { category: 'Flooring', material: 'Wide-Plank Engineered Timber', finish: 'Matte Oil', ecoRating: 'FSC Certified', estimatedRatePerUnit: 18, unit: 'sq.ft' },
            { category: 'Joinery & Woodwork', material: 'Natural Veneer Millwork', finish: 'Satin Zero-VOC', ecoRating: 'Class A', estimatedRatePerUnit: 44, unit: 'sq.ft' },
            { category: 'Wall Finishes', material: 'Mineral Plaster', finish: 'Slight Stucco', ecoRating: 'Zero VOC', estimatedRatePerUnit: 10, unit: 'sq.ft' },
            { category: 'Hardware & Fixtures', material: 'Solid Brushed Brass', finish: 'PVD Coated', ecoRating: 'Recyclable Alloy', estimatedRatePerUnit: 80, unit: 'item' },
          ],
          sustainabilityScore: c.sustainabilityScore || 90,
          estimatedCostPerSqFt: c.estimatedCostPerSqFt || Math.round(target.targetBudget / target.builtUpAreaSqFt),
          totalEstimatedCost: c.totalEstimatedCost || target.targetBudget,
          estimatedWeeks: c.estimatedWeeks || Math.round(target.targetTimelineMonths * 4.3),
          renderTheme: {
            accentColor: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : index === 3 ? '#8b5cf6' : '#059669',
            secondaryColor: index === 0 ? '#ecfdf5' : index === 1 ? '#eff6ff' : index === 2 ? '#fffbeb' : index === 3 ? '#f5f3ff' : '#f0fdf4',
            styleTag: c.themeStyle || 'Modern Concept',
            schematicType: c.schematicType || 'contemporary',
          },
          internalReview: {
            reviewedBy: 'Elena Rostova (Design Principal)',
            approvedForClient: true,
            leadNotes: c.internalLeadNotes || 'Strong alignment with brief. Approved for customer review.',
            reviewDate: new Date().toISOString().split('T')[0],
          },
          clientReview: {
            isShared: true,
            clientApproved: false,
            clientComments: '',
          },
          isSelectedConcept: false,
          visualAssets: c.visualAssets && c.visualAssets.length > 0
            ? c.visualAssets
            : getVisualAssetsForConcept(index + 1, c.themeStyle, effectiveTarget.builtUpAreaSqFt),
        }));

        updateProject(projectId, {
          ...(customParams || {}),
          conceptOptions: mappedConcepts,
          designStatus: '4-5 Concepts Generated',
          salesStage: 'Concept Pitch',
          nextAction: {
            actionTitle: 'Internal Review & Client Presentation of 4-5 Concepts',
            assigneeName: 'Elena Rostova',
            assigneeRole: 'Design Principal',
            dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
            priority: 'Urgent',
            isCompleted: false,
          },
        });
        setIsGeneratingConcepts(false);
        setGenerationProgress(null);
        return true;
      }
    } catch (err) {
      console.warn('Backend generation failed, using local architectural engine fallback:', err);
    }

    // High quality offline fallback generator
    const fallbackOptions: ConceptOption[] = [
      {
        id: `opt-${projectId}-1`,
        optionNumber: 1,
        title: 'Option 1: Biophilic Lightwell & Organic Flow',
        themeStyle: 'Warm Biophilic & Japandi Harmony',
        architecturalNarrative: 'Emphasizes continuous natural light penetration, acoustic timber slatted ceilings, and seamless indoor greenery planters.',
        spatialZoning: [
          { zone: 'Social & Dining Spine', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.42), flowDescription: 'Direct orientation towards natural morning daylight.' },
          { zone: 'Master Retreat & Sanctum', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.38), flowDescription: 'Acoustically isolated quiet quarters with walk-in dressing.' },
          { zone: 'Culinary & Service Core', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.20), flowDescription: 'Concealed pantry and streamlined MEP distribution.' },
        ],
        materials: [
          { category: 'Flooring', material: 'Engineered White Oak & Micro-cement', finish: 'Ultra-Matte Hardwax', ecoRating: 'LEED v4 Certified', estimatedRatePerUnit: 16, unit: 'sq.ft' },
          { category: 'Joinery & Woodwork', material: 'FSC-Certified Rift White Oak', finish: 'Zero-VOC Polyurethane', ecoRating: 'FSC 100%', estimatedRatePerUnit: 48, unit: 'sq.ft' },
          { category: 'Wall Finishes', material: 'Lime Mineral Plaster & Raw Tadelakt', finish: 'Satin Burnished', ecoRating: 'Class A Low-Emitting', estimatedRatePerUnit: 9, unit: 'sq.ft' },
          { category: 'Hardware & Fixtures', material: 'Solid Brushed Gunmetal Brass', finish: 'PVD Anti-Fingerprint', ecoRating: 'Recyclable Brass Alloy', estimatedRatePerUnit: 85, unit: 'item' },
        ],
        sustainabilityScore: 94,
        estimatedCostPerSqFt: 115,
        totalEstimatedCost: Math.round(115 * target.builtUpAreaSqFt),
        estimatedWeeks: 16,
        renderTheme: {
          accentColor: '#10b981',
          secondaryColor: '#ecfdf5',
          styleTag: 'Warm Biophilic',
          schematicType: 'biophilic',
        },
        internalReview: {
          reviewedBy: 'Elena Rostova (Design Principal)',
          approvedForClient: true,
          leadNotes: 'Meets every client constraint with low carbon footprint. Recommended option.',
          reviewDate: new Date().toISOString().split('T')[0],
        },
        clientReview: {
          isShared: true,
          clientApproved: false,
          clientComments: '',
        },
        isSelectedConcept: false,
      },
      {
        id: `opt-${projectId}-2`,
        optionNumber: 2,
        title: 'Option 2: Monolithic Modern & Crisp Shadowlines',
        themeStyle: 'Architectural Minimalist & Monolithic Volumes',
        architecturalNarrative: 'Clean shadowline baseboards, flush frameless pivot doors, and concealed full-height cabinetry creating serene spatial calmness.',
        spatialZoning: [
          { zone: 'Grand Gallery & Living', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.46), flowDescription: 'Open ceiling shadow-gap reveal with linear downlighting.' },
          { zone: 'Private Bedroom Wings', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.34), flowDescription: 'Pocket sliding acoustic partitions.' },
          { zone: 'Concealed Service Core', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.20), flowDescription: 'Hidden behind flush wood cladded feature walls.' },
        ],
        materials: [
          { category: 'Flooring', material: 'Large-Format Basalt Sintered Stone', finish: 'Honed Matte', ecoRating: 'EPD Certified', estimatedRatePerUnit: 20, unit: 'sq.ft' },
          { category: 'Joinery & Woodwork', material: 'Super-Matte Anti-Scratch Polymer', finish: 'Soft-Touch Matte', ecoRating: 'Greenguard Gold', estimatedRatePerUnit: 40, unit: 'sq.ft' },
          { category: 'Wall Finishes', material: 'Architectural Silica Flat Paint', finish: 'Chalk White', ecoRating: 'Zero VOC', estimatedRatePerUnit: 7, unit: 'sq.ft' },
          { category: 'Hardware & Fixtures', material: 'Concealed Magnetic Mortise Hardware', finish: 'Matte Deep Black', ecoRating: 'DIN EN 1906', estimatedRatePerUnit: 90, unit: 'item' },
        ],
        sustainabilityScore: 89,
        estimatedCostPerSqFt: 122,
        totalEstimatedCost: Math.round(122 * target.builtUpAreaSqFt),
        estimatedWeeks: 18,
        renderTheme: {
          accentColor: '#3b82f6',
          secondaryColor: '#eff6ff',
          styleTag: 'Monolithic Precision',
          schematicType: 'minimalist',
        },
        internalReview: {
          reviewedBy: 'Elena Rostova (Design Principal)',
          approvedForClient: true,
          leadNotes: 'Rigorous modernism. Requires tight civil tolerances on jambless doors.',
          reviewDate: new Date().toISOString().split('T')[0],
        },
        clientReview: {
          isShared: true,
          clientApproved: false,
          clientComments: '',
        },
        isSelectedConcept: false,
      },
      {
        id: `opt-${projectId}-3`,
        optionNumber: 3,
        title: 'Option 3: Contemporary Industrial & Fluted Glass Elegance',
        themeStyle: 'Refined Industrial Loft & Crittall Glazing',
        architecturalNarrative: 'Blackened steel structural portal framing, fluted glass acoustic screens, and raw polished terrazzo inlays celebrating material truth.',
        spatialZoning: [
          { zone: 'Central Forum & Living Lounge', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.40), flowDescription: 'High ceiling open zone with suspended lighting trusses.' },
          { zone: 'Master Retreat & En-Suite', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.36), flowDescription: 'Crittall glazed divider with motorized blackout acoustic drapery.' },
          { zone: 'Kitchen Prep & Scullery', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.24), flowDescription: 'Stainless steel prep worktops with charcoal timber cabinetry.' },
        ],
        materials: [
          { category: 'Flooring', material: 'Polished Cast Terrazzo with Brass Matrix', finish: 'Semi-Gloss Seal', ecoRating: 'Local Stone Aggregates', estimatedRatePerUnit: 18, unit: 'sq.ft' },
          { category: 'Joinery & Woodwork', material: 'Smoked Ash & Black Powdercoated Steel', finish: 'Matte Oil', ecoRating: 'FSC Certified', estimatedRatePerUnit: 46, unit: 'sq.ft' },
          { category: 'Wall Finishes', material: 'Architectural Exposed Concrete Render', finish: 'Hydrophobic Matte', ecoRating: 'Low-Embodied Carbon', estimatedRatePerUnit: 11, unit: 'sq.ft' },
          { category: 'Hardware & Fixtures', material: 'Knurled Industrial Aluminum & Brass', finish: 'Anodized Slate', ecoRating: 'Recyclable Alloy', estimatedRatePerUnit: 75, unit: 'item' },
        ],
        sustainabilityScore: 86,
        estimatedCostPerSqFt: 114,
        totalEstimatedCost: Math.round(114 * target.builtUpAreaSqFt),
        estimatedWeeks: 17,
        renderTheme: {
          accentColor: '#f59e0b',
          secondaryColor: '#fffbeb',
          styleTag: 'Industrial Refined',
          schematicType: 'industrial',
        },
        internalReview: {
          reviewedBy: 'Elena Rostova (Design Principal)',
          approvedForClient: true,
          leadNotes: 'Expressive personality. Great for client wanting contemporary edge.',
          reviewDate: new Date().toISOString().split('T')[0],
        },
        clientReview: {
          isShared: true,
          clientApproved: false,
          clientComments: '',
        },
        isSelectedConcept: false,
      },
      {
        id: `opt-${projectId}-4`,
        optionNumber: 4,
        title: 'Option 4: Neo-Classical Heritage & Proportional Wainscoting',
        themeStyle: 'Transitional Neo-Classical & Sculptural Details',
        architecturalNarrative: 'Classical proportions reinterpreted with crisp contemporary reveals. Chevron French oak floors paired with fluted marble fireplace surrounds.',
        spatialZoning: [
          { zone: 'Formal Reception & Salon', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.44), flowDescription: 'Symmetrical architectural axis with custom ceiling coffers.' },
          { zone: 'Master Suite & Library Study', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.36), flowDescription: 'Intimate reading nook and bespoke walk-in millwork.' },
          { zone: 'Show Kitchen & Service Hub', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.20), flowDescription: 'Quartzite worktops with concealed spice rack pantry.' },
        ],
        materials: [
          { category: 'Flooring', material: 'French Oak Chevron Parquet (45-degree)', finish: 'Brushed Wax Seal', ecoRating: 'PEFC Certified', estimatedRatePerUnit: 24, unit: 'sq.ft' },
          { category: 'Joinery & Woodwork', material: 'Shaker Cabinetry with Inset Mouldings', finish: 'Silk Matte 10-Gloss', ecoRating: 'E1 Low Formaldehyde', estimatedRatePerUnit: 52, unit: 'sq.ft' },
          { category: 'Wall Finishes', material: 'Wainscoting & Venetian Stucco Polishing', finish: 'Marble Dust Polish', ecoRating: 'Natural Lime Base', estimatedRatePerUnit: 15, unit: 'sq.ft' },
          { category: 'Hardware & Fixtures', material: 'Solid Aged Unlacquered Brass', finish: 'Living Patina', ecoRating: 'Artisan Forged', estimatedRatePerUnit: 105, unit: 'item' },
        ],
        sustainabilityScore: 82,
        estimatedCostPerSqFt: 132,
        totalEstimatedCost: Math.round(132 * target.builtUpAreaSqFt),
        estimatedWeeks: 19,
        renderTheme: {
          accentColor: '#8b5cf6',
          secondaryColor: '#f5f3ff',
          styleTag: 'Neo-Heritage',
          schematicType: 'classic',
        },
        internalReview: {
          reviewedBy: 'Elena Rostova (Design Principal)',
          approvedForClient: true,
          leadNotes: 'Luxury tier benchmark. Highlights high craftsmanship and margin.',
          reviewDate: new Date().toISOString().split('T')[0],
        },
        clientReview: {
          isShared: true,
          clientApproved: false,
          clientComments: '',
        },
        isSelectedConcept: false,
      },
      {
        id: `opt-${projectId}-5`,
        optionNumber: 5,
        title: 'Option 5: High-Performance Passive & Tropical Modernism',
        themeStyle: 'Eco-Passive High Performance & Thermal Comfort',
        architecturalNarrative: 'Engineered for near net-zero energy demands with deep exterior overhangs, cross-ventilation breezes, breathable raw clay plasters, and solar shading louvers.',
        spatialZoning: [
          { zone: 'Indoor-Outdoor Alfresco Living', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.41), flowDescription: 'Extends into shaded exterior deck.' },
          { zone: 'Passive Sleeping Suites', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.37), flowDescription: 'Cross-ventilated with thermal mass ceiling fans.' },
          { zone: 'Energy & Utility Core', allocationSqFt: Math.round(target.builtUpAreaSqFt * 0.22), flowDescription: 'Compact solar battery and heat pump water heater hub.' },
        ],
        materials: [
          { category: 'Flooring', material: 'Strand Woven Bamboo & Kota Limestone', finish: 'Natural Vegetable Oil', ecoRating: 'Cradle to Cradle Gold', estimatedRatePerUnit: 14, unit: 'sq.ft' },
          { category: 'Joinery & Woodwork', material: 'Thermo-Treated Ash Slatting', finish: 'Bio-Resin Seal', ecoRating: 'Carbon Negative', estimatedRatePerUnit: 39, unit: 'sq.ft' },
          { category: 'Wall Finishes', material: 'Stabilized Rammed Earth & Clay Plaster', finish: 'Breathable Matte', ecoRating: '100% Biodegradable', estimatedRatePerUnit: 12, unit: 'sq.ft' },
          { category: 'Hardware & Fixtures', material: 'Recycled Stainless Steel 316', finish: 'Bead-Blasted Satin', ecoRating: 'Circular Economy', estimatedRatePerUnit: 65, unit: 'item' },
        ],
        sustainabilityScore: 97,
        estimatedCostPerSqFt: 116,
        totalEstimatedCost: Math.round(116 * target.builtUpAreaSqFt),
        estimatedWeeks: 16,
        renderTheme: {
          accentColor: '#059669',
          secondaryColor: '#ecfdf5',
          styleTag: 'Eco-Passive',
          schematicType: 'contemporary',
        },
        internalReview: {
          reviewedBy: 'Elena Rostova (Design Principal)',
          approvedForClient: true,
          leadNotes: 'Industry leading sustainability score. Great differentiator for client presentation.',
          reviewDate: new Date().toISOString().split('T')[0],
        },
        clientReview: {
          isShared: true,
          clientApproved: false,
          clientComments: '',
        },
        isSelectedConcept: false,
      },
    ];

    const fallbackOptionsWithAssets = fallbackOptions.map((opt, idx) => ({
      ...opt,
      visualAssets: opt.visualAssets && opt.visualAssets.length > 0
        ? opt.visualAssets
        : getVisualAssetsForConcept(opt.optionNumber || idx + 1, opt.themeStyle, effectiveTarget.builtUpAreaSqFt),
    }));

    updateProject(projectId, {
      ...(customParams || {}),
      conceptOptions: fallbackOptionsWithAssets,
      designStatus: '4-5 Concepts Generated',
      salesStage: 'Concept Pitch',
      nextAction: {
        actionTitle: 'Internal Review & Client Presentation of 5 Concepts',
        assigneeName: 'Elena Rostova',
        assigneeRole: 'Design Principal',
        dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        priority: 'Urgent',
        isCompleted: false,
      },
    });

    setIsGeneratingConcepts(false);
    setGenerationProgress(null);
    return true;
  }, [projects, updateProject]);

  const refineConceptWithGemini = useCallback(async (
    projectId: string,
    conceptId: string,
    instruction: string
  ): Promise<{ success: boolean; concept?: ConceptOption; error?: string }> => {
    const target = projects.find((p) => p.id === projectId);
    const targetConcept = target?.conceptOptions.find((c) => c.id === conceptId);
    if (!target || !targetConcept) {
      return { success: false, error: 'Project or concept not found' };
    }

    try {
      const response = await fetch('/api/gemini/refine-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: targetConcept,
          instruction,
          clientName: target.clientName,
          builtUpAreaSqFt: target.builtUpAreaSqFt,
          budgetTier: target.budgetTier,
        }),
      });

      const data = await response.json();
      if (data.success && data.concept) {
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id !== projectId) return p;
            const updatedOptions = p.conceptOptions.map((opt) =>
              opt.id === conceptId ? { ...opt, ...data.concept } : opt
            );
            return {
              ...p,
              conceptOptions: updatedOptions,
              updatedAt: new Date().toISOString(),
            };
          })
        );
        logCRMActivity(projectId, {
          type: 'note',
          title: `Option ${targetConcept.optionNumber} Refined with Gemini AI`,
          description: `Instruction: "${instruction}"`,
          author: 'Elena Rostova (AI Assist)',
        });
        return { success: true, concept: data.concept };
      }
      return { success: false, error: data.error || 'Refinement failed' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Refinement failed' };
    }
  }, [projects, logCRMActivity]);

  const critiqueConceptWithGemini = useCallback(async (
    projectId: string,
    conceptId: string
  ): Promise<{ success: boolean; critique?: ConceptOption['aiCritique']; error?: string }> => {
    const target = projects.find((p) => p.id === projectId);
    const targetConcept = target?.conceptOptions.find((c) => c.id === conceptId);
    if (!target || !targetConcept) {
      return { success: false, error: 'Project or concept not found' };
    }

    try {
      const response = await fetch('/api/gemini/critique-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: targetConcept,
          clientName: target.clientName,
          builtUpAreaSqFt: target.builtUpAreaSqFt,
          budgetTier: target.budgetTier,
          siteAreaSqFt: target.siteAreaSqFt,
          engagementType: target.engagementType,
        }),
      });

      const data = await response.json();
      if (data.success && data.critique) {
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id !== projectId) return p;
            const updatedOptions = p.conceptOptions.map((opt) =>
              opt.id === conceptId ? { ...opt, aiCritique: data.critique } : opt
            );
            return {
              ...p,
              conceptOptions: updatedOptions,
              updatedAt: new Date().toISOString(),
            };
          })
        );
        return { success: true, critique: data.critique };
      }
      return { success: false, error: data.error || 'Critique failed' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Critique failed' };
    }
  }, [projects]);

  const generatePitchWithGemini = useCallback(async (
    projectId: string,
    conceptId: string
  ): Promise<{ success: boolean; pitch?: ConceptOption['aiPitchScript']; error?: string }> => {
    const target = projects.find((p) => p.id === projectId);
    const targetConcept = target?.conceptOptions.find((c) => c.id === conceptId);
    if (!target || !targetConcept) {
      return { success: false, error: 'Project or concept not found' };
    }

    try {
      const response = await fetch('/api/gemini/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: targetConcept,
          clientName: target.clientName,
          builtUpAreaSqFt: target.builtUpAreaSqFt,
          targetBudget: target.targetBudget,
        }),
      });

      const data = await response.json();
      if (data.success && data.pitch) {
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id !== projectId) return p;
            const updatedOptions = p.conceptOptions.map((opt) =>
              opt.id === conceptId ? { ...opt, aiPitchScript: data.pitch } : opt
            );
            return {
              ...p,
              conceptOptions: updatedOptions,
              updatedAt: new Date().toISOString(),
            };
          })
        );
        return { success: true, pitch: data.pitch };
      }
      return { success: false, error: data.error || 'Pitch failed' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Pitch failed' };
    }
  }, [projects]);

  const addConceptVisualAsset = useCallback((
    projectId: string,
    conceptId: string,
    asset: Omit<ArchitecturalVisualAsset, 'id'>
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newAsset: ArchitecturalVisualAsset = {
          ...asset,
          id: `vis-${Date.now()}-${Math.floor(10 + Math.random() * 90)}`,
        };
        const updatedOptions = p.conceptOptions.map((opt) => {
          if (opt.id !== conceptId) return opt;
          return {
            ...opt,
            visualAssets: [newAsset, ...(opt.visualAssets || [])],
          };
        });
        return {
          ...p,
          conceptOptions: updatedOptions,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const updateConceptVisualAsset = useCallback((
    projectId: string,
    conceptId: string,
    assetTypeOrId: string,
    updates: Partial<ArchitecturalVisualAsset>
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedOptions = p.conceptOptions.map((opt) => {
          if (opt.id !== conceptId) return opt;
          const currentAssets =
            opt.hasUnapprovedDraftSheets && opt.stagedVisualAssets && opt.stagedVisualAssets.length > 0
              ? opt.stagedVisualAssets
              : opt.visualAssets && opt.visualAssets.length > 0
              ? opt.visualAssets
              : getVisualAssetsForConcept(opt.optionNumber, opt.themeStyle, p.builtUpAreaSqFt);

          const foundIndex = currentAssets.findIndex(
            (a) => a.id === assetTypeOrId || a.type === assetTypeOrId
          );

          let newAssets: ArchitecturalVisualAsset[];
          if (foundIndex >= 0) {
            newAssets = [...currentAssets];
            newAssets[foundIndex] = {
              ...newAssets[foundIndex],
              ...updates,
              approvalStatus: 'draft_pending_approval',
              isCustomUpload: updates.isCustomUpload ?? (updates.imageUrl ? true : newAssets[foundIndex].isCustomUpload),
              uploadedAt: new Date().toISOString(),
            };
          } else {
            const createdAsset: ArchitecturalVisualAsset = {
              id: `vis-${Date.now()}`,
              type: (updates.type || assetTypeOrId || 'render_3d') as any,
              title: updates.title || 'Architectural Asset',
              imageUrl: updates.imageUrl || '',
              approvalStatus: 'draft_pending_approval',
              isCustomUpload: true,
              uploadedAt: new Date().toISOString(),
              ...updates,
            };
            newAssets = [createdAsset, ...currentAssets];
          }

          // Unapproved drawing sheets & presentations are held in staged draft state
          return {
            ...opt,
            stagedVisualAssets: newAssets,
            hasUnapprovedDraftSheets: true,
            drawingSheetsApproved: false,
          };
        });
        return {
          ...p,
          conceptOptions: updatedOptions,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const approveConceptDrawingSheets = useCallback((
    projectId: string,
    conceptId: string,
    approverName: string = 'Ar. Sarah Chen',
    approverRole: string = 'Lead Architect',
    notes?: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const targetOpt = p.conceptOptions.find((o) => o.id === conceptId);
        const optNumber = targetOpt?.optionNumber || 1;

        const updatedOptions = p.conceptOptions.map((opt) => {
          if (opt.id !== conceptId) return opt;
          const assetsToCommit =
            opt.stagedVisualAssets && opt.stagedVisualAssets.length > 0
              ? opt.stagedVisualAssets
              : opt.visualAssets && opt.visualAssets.length > 0
              ? opt.visualAssets
              : getVisualAssetsForConcept(opt.optionNumber, opt.themeStyle, p.builtUpAreaSqFt);

          const approvedAssets = assetsToCommit.map((a) => ({
            ...a,
            approvalStatus: 'approved' as const,
          }));

          return {
            ...opt,
            visualAssets: approvedAssets,
            stagedVisualAssets: undefined,
            drawingSheetsApproved: true,
            hasUnapprovedDraftSheets: false,
            drawingSheetsApprovalDate: new Date().toISOString(),
            drawingSheetsApprovedBy: `${approverName} (${approverRole})`,
            drawingSheetsApprovalNotes: notes || 'Approved and committed to permanent project baseline.',
          };
        });

        const approvalAct: CRMActivity = {
          id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          type: 'milestone',
          title: `Drawing Sheets & 3D Presentation Approved`,
          description: `Architectural Drawing Sheets & 3D Visual Presentation for Option ${optNumber} approved by ${approverName} (${approverRole}). Saved to permanent project baseline.`,
          author: approverName,
          timestamp: new Date().toISOString(),
          stageAtTime: p.salesStage,
        };

        return {
          ...p,
          conceptOptions: updatedOptions,
          crmActivities: [approvalAct, ...(p.crmActivities || [])],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const discardDraftDrawingSheets = useCallback((
    projectId: string,
    conceptId: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedOptions = p.conceptOptions.map((opt) => {
          if (opt.id !== conceptId) return opt;
          return {
            ...opt,
            stagedVisualAssets: undefined,
            hasUnapprovedDraftSheets: false,
            drawingSheetsApproved: true, // restored to previous approved baseline
          };
        });
        return {
          ...p,
          conceptOptions: updatedOptions,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const stageDrawingSheetUpload = useCallback((
    projectId: string,
    conceptId: string,
    sheetType: ArchitecturalVisualAsset['type'],
    fileDataUrl: string,
    metadata: {
      title?: string;
      drawingNumber?: string;
      subtitle?: string;
      caption?: string;
      tags?: string[];
      scale?: string;
      revision?: string;
    }
  ) => {
    updateConceptVisualAsset(projectId, conceptId, sheetType, {
      imageUrl: fileDataUrl,
      title: metadata.title || `Custom ${sheetType.replace(/_/g, ' ').toUpperCase()}`,
      drawingNumber: metadata.drawingNumber || `DWG-UPL-${Date.now().toString().slice(-4)}`,
      subtitle: metadata.subtitle || `Custom uploaded sheet • Draft (Unapproved)`,
      caption: metadata.caption || `Uploaded drawing sheet for ${sheetType.replace(/_/g, ' ')} process.`,
      scale: metadata.scale || '1:50 @ A3',
      revision: metadata.revision || 'Rev P1 (Draft)',
      tags: metadata.tags || ['Custom Upload', sheetType, 'Draft'],
      isCustomUpload: true,
      approvalStatus: 'draft_pending_approval',
      sourceType: 'client_upload',
    });
  }, [updateConceptVisualAsset]);

  const generateGeminiImageForAsset = useCallback(async (
    projectId: string,
    conceptId: string,
    assetType: ArchitecturalVisualAsset['type'],
    prompt: string,
    style?: string
  ): Promise<{ success: boolean; imageUrl?: string; source?: string; error?: string }> => {
    const target = projects.find((p) => p.id === projectId);
    const targetConcept = target?.conceptOptions.find((c) => c.id === conceptId);
    const optNumber = targetConcept?.optionNumber || 1;
    const themeStyle = style || targetConcept?.themeStyle || 'Modern Architectural Design';

    try {
      const response = await fetch('/api/generate-concept-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: themeStyle,
          optionNumber: optNumber,
          sheetType: assetType,
          areaSqFt: target?.builtUpAreaSqFt || 3400,
          clientName: target?.clientName || 'Client Residence',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.imageUrl) {
        updateConceptVisualAsset(projectId, conceptId, assetType, {
          imageUrl: data.imageUrl,
          caption: prompt || data.promptUsed,
          subtitle: `Generated via ${data.source || 'Gemini Vision AI'} • ${new Date().toLocaleTimeString()}`,
        });
        return { success: true, imageUrl: data.imageUrl, source: data.source };
      }
      return { success: false, error: data.error || 'Failed to synthesize image' };
    } catch (err: any) {
      console.error('Error in generateGeminiImageForAsset:', err);
      return { success: false, error: err?.message || 'Network error' };
    }
  }, [projects, updateConceptVisualAsset]);

  const updateConceptReview = useCallback((
    projectId: string,
    conceptId: string,
    internalReview: Partial<ConceptOption['internalReview']>,
    clientReview: Partial<ConceptOption['clientReview']>
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedOptions = p.conceptOptions.map((opt) => {
          if (opt.id !== conceptId) return opt;
          return {
            ...opt,
            internalReview: { ...opt.internalReview, ...internalReview },
            clientReview: { ...opt.clientReview, ...clientReview },
          };
        });
        return {
          ...p,
          conceptOptions: updatedOptions,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const selectConcept = useCallback((projectId: string, conceptId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedOptions = p.conceptOptions.map((opt) => ({
          ...opt,
          isSelectedConcept: opt.id === conceptId,
        }));
        return {
          ...p,
          conceptOptions: updatedOptions,
          selectedConceptId: conceptId,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const addCustomerReference = useCallback((
    projectId: string,
    reference: Omit<SampleInspirationData, 'id'>
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newRef: SampleInspirationData = {
          ...reference,
          id: `insp-${Date.now()}-${Math.floor(10 + Math.random() * 90)}`,
          createdAt: new Date().toISOString(),
        };
        return {
          ...p,
          customerReferences: [newRef, ...(p.customerReferences || [])],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const deleteCustomerReference = useCallback((
    projectId: string,
    referenceId: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          customerReferences: (p.customerReferences || []).filter((r) => r.id !== referenceId),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const addMaterialToConcept = useCallback((
    projectId: string,
    conceptId: string,
    material: MaterialSpec
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedOptions = p.conceptOptions.map((opt) => {
          if (opt.id !== conceptId) return opt;
          return {
            ...opt,
            materials: [...opt.materials, material],
          };
        });
        return {
          ...p,
          conceptOptions: updatedOptions,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Central Requirement: "The selected concept must carry forward into detailed design, BOQ, contract, budget, procurement, execution, and billing without repeated data entry."
  const carryForwardConcept = useCallback((projectId: string, conceptId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const selected = p.conceptOptions.find((o) => o.id === conceptId) || p.conceptOptions[0];
        if (!selected) return p;

        const area = p.builtUpAreaSqFt || 2400;

        // 1. Detailed Deliverables automatically populated from concept
        const detailedDeliverables: DetailedDeliverable[] = [
          {
            id: `del-${Date.now()}-1`,
            code: 'DWG-A-101',
            title: `Demolition & Spatial Partition Plan (${selected.themeStyle})`,
            category: 'Architectural',
            status: 'Approved / GFC Issued',
            assignedTo: 'Lead Project Architect',
            revision: 'Rev 1',
            dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          },
          {
            id: `del-${Date.now()}-2`,
            code: 'DWG-ID-201',
            title: `Reflected Ceiling Plan & Recessed Shadowline Grilles`,
            category: 'Interior GFC',
            status: 'In Progress',
            assignedTo: 'Interior Technical Lead',
            revision: 'Rev 0',
            dueDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
          },
          {
            id: `del-${Date.now()}-3`,
            code: 'DWG-MEP-301',
            title: `HVAC Ducting & Low-Noise Ventilation Schematics`,
            category: 'MEP & HVAC',
            status: 'Pending',
            assignedTo: 'MEP Engineer',
            revision: 'Rev 0',
            dueDate: new Date(Date.now() + 16 * 86400000).toISOString().split('T')[0],
          },
          {
            id: `del-${Date.now()}-4`,
            code: 'DWG-JOIN-401',
            title: `Custom Millwork Details (${selected.materials.find((m) => m.category === 'Joinery & Woodwork')?.material || 'Oak Veneer'})`,
            category: 'Interior GFC',
            status: 'In Progress',
            assignedTo: 'Joinery Specialist',
            revision: 'Rev 0',
            dueDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
          },
          {
            id: `del-${Date.now()}-5`,
            code: '3D-RND-501',
            title: `Photorealistic 4K Visualizations - ${selected.title}`,
            category: '3D Renders',
            status: 'Approved / GFC Issued',
            assignedTo: '3D Visualization Lead',
            revision: 'Final',
            dueDate: new Date().toISOString().split('T')[0],
          },
        ];

        // 2. Itemized BOQ automatically generated from selected concept materials and spatial specs
        const boqItems: BOQItem[] = [
          {
            id: `boq-${Date.now()}-1`,
            category: 'Civil & Masonry',
            itemCode: 'CIV-01',
            description: `Site preparation, acoustic drywall partition framing, and masonry repairs for ${area} sq.ft area`,
            unit: 'sq.ft',
            quantity: Math.round(area * 0.75),
            unitRate: 8.5,
            amount: Math.round(area * 0.75 * 8.5),
            notes: 'Includes waste disposal and protective core boarding',
          },
          {
            id: `boq-${Date.now()}-2`,
            category: 'Carpentry & Modular',
            itemCode: 'CRP-01',
            description: `${selected.materials.find((m) => m.category === 'Joinery & Woodwork')?.material || 'FSC Rift White Oak'} custom millwork and wall paneling`,
            unit: 'sq.ft',
            quantity: Math.round(area * 0.55),
            unitRate: selected.materials.find((m) => m.category === 'Joinery & Woodwork')?.estimatedRatePerUnit || 48,
            amount: Math.round(area * 0.55 * (selected.materials.find((m) => m.category === 'Joinery & Woodwork')?.estimatedRatePerUnit || 48)),
            notes: `Finish: ${selected.materials.find((m) => m.category === 'Joinery & Woodwork')?.finish || 'Matte'}`,
          },
          {
            id: `boq-${Date.now()}-3`,
            category: 'Painting & Polishing',
            itemCode: 'PNT-01',
            description: `${selected.materials.find((m) => m.category === 'Wall Finishes')?.material || 'Lime Mineral Plaster'} architectural wall coatings`,
            unit: 'sq.ft',
            quantity: Math.round(area * 1.8),
            unitRate: selected.materials.find((m) => m.category === 'Wall Finishes')?.estimatedRatePerUnit || 9,
            amount: Math.round(area * 1.8 * (selected.materials.find((m) => m.category === 'Wall Finishes')?.estimatedRatePerUnit || 9)),
            notes: selected.materials.find((m) => m.category === 'Wall Finishes')?.ecoRating,
          },
          {
            id: `boq-${Date.now()}-4`,
            category: 'Civil & Masonry',
            itemCode: 'FLR-01',
            description: `${selected.materials.find((m) => m.category === 'Flooring')?.material || 'Engineered Timber'} with sound underlayment`,
            unit: 'sq.ft',
            quantity: Math.round(area * 0.9),
            unitRate: selected.materials.find((m) => m.category === 'Flooring')?.estimatedRatePerUnit || 18,
            amount: Math.round(area * 0.9 * (selected.materials.find((m) => m.category === 'Flooring')?.estimatedRatePerUnit || 18)),
            notes: selected.materials.find((m) => m.category === 'Flooring')?.finish,
          },
          {
            id: `boq-${Date.now()}-5`,
            category: 'Electrical & MEP',
            itemCode: 'ELE-01',
            description: 'Concealed conduits, smart lighting circuits, low-voltage magnetic architectural track lines',
            unit: 'lot',
            quantity: 1,
            unitRate: Math.round(area * 12),
            amount: Math.round(area * 12),
            notes: 'Dali-2 protocol compatible with lighting scenes',
          },
          {
            id: `boq-${Date.now()}-6`,
            category: 'Hardware & Glazing',
            itemCode: 'HRD-01',
            description: `${selected.materials.find((m) => m.category === 'Hardware & Fixtures')?.material || 'Brushed Gunmetal Brass'} magnetic latches and fittings`,
            unit: 'lot',
            quantity: 1,
            unitRate: Math.round(area * 6),
            amount: Math.round(area * 6),
            notes: 'PVD scratch-resistant coated',
          },
          {
            id: `boq-${Date.now()}-7`,
            category: 'Professional Fees',
            itemCode: 'FEE-01',
            description: 'Turnkey Project Execution, Site Supervision, QA/QC and Engineering Lead',
            unit: 'lump sum',
            quantity: 1,
            unitRate: Math.round(selected.totalEstimatedCost * 0.12),
            amount: Math.round(selected.totalEstimatedCost * 0.12),
            notes: 'Fixed professional consultancy fee',
          },
        ];

        const subtotal = boqItems.reduce((acc, it) => acc + it.amount, 0);
        const contingencyPercent = 5;
        const contractorMarginPercent = 12;
        const taxPercent = 8.5;
        const contingency = Math.round((subtotal * contingencyPercent) / 100);
        const margin = Math.round((subtotal * contractorMarginPercent) / 100);
        const taxable = subtotal + contingency + margin;
        const tax = Math.round((taxable * taxPercent) / 100);
        const grandTotal = taxable + tax;

        const baselineRevision: BOQRevision = {
          revisionNumber: 0,
          revisionLabel: `Rev 0 - Baseline from ${selected.title}`,
          date: new Date().toISOString().split('T')[0],
          author: 'Auto-Promoted from AI Design Studio',
          reasonForChange: `Direct seamless promotion of approved concept #${selected.optionNumber} (${selected.themeStyle}) into itemized BOQ without repeated data entry.`,
          items: boqItems,
          subtotal,
          contingencyPercent,
          contractorMarginPercent,
          taxPercent,
          grandTotal,
        };

        // 3. Execution Milestones
        const executionMilestones: SiteExecutionMilestone[] = [
          {
            id: `ms-${Date.now()}-1`,
            title: 'Mobilization & Site Demolition Protection',
            phase: 'Phase 1',
            targetStartDate: new Date().toISOString().split('T')[0],
            targetEndDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
            progressPercent: 10,
            status: 'In Progress',
            leadSupervisor: 'Site Operations Lead',
            prerequisites: 'Advance received, municipal approvals',
          },
          {
            id: `ms-${Date.now()}-2`,
            title: 'Civil Framing, Drywall & MEP Services Rough-In',
            phase: 'Phase 2',
            targetStartDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
            targetEndDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
            progressPercent: 0,
            status: 'Not Started',
            leadSupervisor: 'MEP Project Engineer',
            prerequisites: 'Phase 1 handover',
          },
          {
            id: `ms-${Date.now()}-3`,
            title: `Flooring Substrate & Surface Application (${selected.materials.find((m) => m.category === 'Flooring')?.material})`,
            phase: 'Phase 3',
            targetStartDate: new Date(Date.now() + 46 * 86400000).toISOString().split('T')[0],
            targetEndDate: new Date(Date.now() + 70 * 86400000).toISOString().split('T')[0],
            progressPercent: 0,
            status: 'Not Started',
            leadSupervisor: 'Finishes Foreman',
            prerequisites: 'MEP pressure tests passed',
          },
          {
            id: `ms-${Date.now()}-4`,
            title: `Joinery Installation & Architectural Millwork`,
            phase: 'Phase 4',
            targetStartDate: new Date(Date.now() + 71 * 86400000).toISOString().split('T')[0],
            targetEndDate: new Date(Date.now() + 95 * 86400000).toISOString().split('T')[0],
            progressPercent: 0,
            status: 'Not Started',
            leadSupervisor: 'Master Carpenter',
            prerequisites: 'Flooring protected',
          },
          {
            id: `ms-${Date.now()}-5`,
            title: 'Pre-Handover Snagging Rectification & Commissioning',
            phase: 'Phase 5',
            targetStartDate: new Date(Date.now() + 96 * 86400000).toISOString().split('T')[0],
            targetEndDate: new Date(Date.now() + 110 * 86400000).toISOString().split('T')[0],
            progressPercent: 0,
            status: 'Not Started',
            leadSupervisor: 'QA/QC Lead',
            prerequisites: 'Joinery complete',
          },
          {
            id: `ms-${Date.now()}-6`,
            title: 'Formal Client Handover & 12-Month Warranty Activation',
            phase: 'Phase 6',
            targetStartDate: new Date(Date.now() + 111 * 86400000).toISOString().split('T')[0],
            targetEndDate: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
            progressPercent: 0,
            status: 'Not Started',
            leadSupervisor: 'Project Director',
            prerequisites: 'Zero critical snags',
          },
        ];

        // 4. Milestone Invoices Schedule automatically configured
        const defectLiabilityRetentionAmount = Math.round(grandTotal * 0.05);
        const invoices: InvoiceRecord[] = [
          {
            id: `inv-${Date.now()}-1`,
            invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
            milestoneTitle: 'Contract Signing & Mobilization Advance (10%)',
            percentageOfContract: 10,
            amountDue: Math.round(grandTotal * 0.1),
            retentionWithheld: 0,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            status: 'Sent',
          },
          {
            id: `inv-${Date.now()}-2`,
            invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
            milestoneTitle: 'Framing, Drywall & MEP Rough-Ins (35%)',
            percentageOfContract: 35,
            amountDue: Math.round(grandTotal * 0.35),
            retentionWithheld: 0,
            issueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 40 * 86400000).toISOString().split('T')[0],
            status: 'Draft',
          },
          {
            id: `inv-${Date.now()}-3`,
            invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
            milestoneTitle: 'Flooring, Joinery Delivery & Installation (35%)',
            percentageOfContract: 35,
            amountDue: Math.round(grandTotal * 0.35),
            retentionWithheld: 0,
            issueDate: new Date(Date.now() + 75 * 86400000).toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 85 * 86400000).toISOString().split('T')[0],
            status: 'Draft',
          },
          {
            id: `inv-${Date.now()}-4`,
            invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
            milestoneTitle: 'Substantial Completion & Snag-free Handover (15%)',
            percentageOfContract: 15,
            amountDue: Math.round(grandTotal * 0.15),
            retentionWithheld: 0,
            issueDate: new Date(Date.now() + 115 * 86400000).toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 125 * 86400000).toISOString().split('T')[0],
            status: 'Draft',
          },
          {
            id: `inv-${Date.now()}-5`,
            invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
            milestoneTitle: 'Defect Liability Retention (5% payable after 12-mo warranty period)',
            percentageOfContract: 5,
            amountDue: defectLiabilityRetentionAmount,
            retentionWithheld: defectLiabilityRetentionAmount,
            issueDate: new Date(Date.now() + 480 * 86400000).toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 495 * 86400000).toISOString().split('T')[0],
            status: 'Draft',
          },
        ];

        return {
          ...p,
          selectedConceptId: conceptId,
          conceptCarriedForwardDate: new Date().toISOString(),
          salesStage: 'Won / Contract Signed',
          designStatus: 'Concept Approved',
          executionStatus: 'Mobilization',
          billingStatus: 'Milestone Invoiced',
          collectionStatus: 'Pending Advance',
          detailedDeliverables,
          boqRevisions: [baselineRevision],
          activeBOQRevisionNumber: 0,
          executionMilestones,
          invoices,
          defectLiabilityRetentionAmount,
          nextAction: {
            actionTitle: `Issue Contract & GFC Drawings for ${selected.title}`,
            assigneeName: 'Commercial & Site Lead',
            assigneeRole: 'Project Manager',
            dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
            priority: 'Critical',
            isCompleted: false,
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const createBOQRevision = useCallback((
    projectId: string,
    revisionLabel: string,
    reason: string,
    items: BOQItem[],
    marginPercent: number,
    contingencyPercent: number,
    taxPercent: number
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const nextRevNum = p.boqRevisions.length;
        const subtotal = items.reduce((acc, it) => acc + it.amount, 0);
        const contingency = Math.round((subtotal * contingencyPercent) / 100);
        const margin = Math.round((subtotal * marginPercent) / 100);
        const taxable = subtotal + contingency + margin;
        const tax = Math.round((taxable * taxPercent) / 100);
        const grandTotal = taxable + tax;

        const newRevision: BOQRevision = {
          revisionNumber: nextRevNum,
          revisionLabel: revisionLabel || `Rev ${nextRevNum}`,
          date: new Date().toISOString().split('T')[0],
          author: 'Commercial Lead',
          reasonForChange: reason || 'Scope update and client adjustment',
          items,
          subtotal,
          contingencyPercent,
          contractorMarginPercent: marginPercent,
          taxPercent,
          grandTotal,
        };

        return {
          ...p,
          boqRevisions: [...p.boqRevisions, newRevision],
          activeBOQRevisionNumber: nextRevNum,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const setActiveBOQRevision = useCallback((projectId: string, revisionNumber: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, activeBOQRevisionNumber: revisionNumber } : p))
    );
  }, []);

  const addSnagItem = useCallback((projectId: string, snag: Omit<SnagItem, 'id' | 'reportedDate'>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newItem: SnagItem = {
          ...snag,
          id: `sng-${Date.now()}`,
          reportedDate: new Date().toISOString().split('T')[0],
        };
        return {
          ...p,
          snagItems: [newItem, ...p.snagItems],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const updateSnagItemStatus = useCallback((projectId: string, snagId: string, status: SnagItem['status']) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updated = p.snagItems.map((s) =>
          s.id === snagId
            ? {
                ...s,
                status,
                closedDate: status === 'Verified & Closed' ? new Date().toISOString().split('T')[0] : s.closedDate,
              }
            : s
        );
        return {
          ...p,
          snagItems: updated,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const recordInvoicePayment = useCallback((projectId: string, invoiceId: string, amount: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedInvoices = p.invoices.map((inv) =>
          inv.id === invoiceId
            ? {
                ...inv,
                status: 'Paid' as const,
                paidDate: new Date().toISOString().split('T')[0],
                paidAmount: amount || inv.amountDue,
              }
            : inv
        );
        const hasUnpaid = updatedInvoices.some((inv) => inv.status !== 'Paid' && inv.percentageOfContract < 100);
        return {
          ...p,
          invoices: updatedInvoices,
          collectionStatus: hasUnpaid ? 'Milestone Retentions' : 'Collected',
          billingStatus: 'Partially Paid',
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const createInvoice = useCallback((projectId: string, invoice: Omit<InvoiceRecord, 'id' | 'invoiceNumber'>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const nextInvNum = Math.floor(100 + Math.random() * 900);
        const newRecord: InvoiceRecord = {
          ...invoice,
          id: `inv-${Date.now()}`,
          invoiceNumber: `INV-2026-${nextInvNum}`,
        };
        return {
          ...p,
          invoices: [...p.invoices, newRecord],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const addWarrantyTicket = useCallback((projectId: string, ticket: Omit<WarrantyServiceTicket, 'id' | 'ticketNumber' | 'reportedDate'>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const nextNum = Math.floor(10 + Math.random() * 90);
        const newTicket: WarrantyServiceTicket = {
          ...ticket,
          id: `tkt-${Date.now()}`,
          ticketNumber: `SRV-2026-0${nextNum}`,
          reportedDate: new Date().toISOString().split('T')[0],
        };
        return {
          ...p,
          warrantyStatus: 'Service Claim Open',
          warrantyTickets: [newTicket, ...p.warrantyTickets],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const updateWarrantyTicketStatus = useCallback((projectId: string, ticketId: string, status: WarrantyServiceTicket['status']) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updated = p.warrantyTickets.map((t) => (t.id === ticketId ? { ...t, status } : t));
        const hasOpen = updated.some((t) => t.status !== 'Closed' && t.status !== 'Resolved');
        return {
          ...p,
          warrantyStatus: hasOpen ? 'Service Claim Open' : '12-Month Fitout Warranty Active',
          warrantyTickets: updated,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Master Data CRUD Operations
  const addTradeMaster = useCallback((item: Omit<TradeCategoryMaster, 'id'>) => {
    const newTrade: TradeCategoryMaster = {
      ...item,
      id: `trade-${Date.now().toString().slice(-6)}`,
    };
    setMasterData((prev) => ({ ...prev, trades: [...prev.trades, newTrade] }));
  }, []);

  const updateTradeMaster = useCallback((id: string, updates: Partial<TradeCategoryMaster>) => {
    setMasterData((prev) => ({
      ...prev,
      trades: prev.trades.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }, []);

  const deleteTradeMaster = useCallback((id: string) => {
    setMasterData((prev) => ({
      ...prev,
      trades: prev.trades.filter((t) => t.id !== id),
    }));
  }, []);

  const addMaterialMaster = useCallback((item: Omit<MaterialMaster, 'id'>) => {
    const newMat: MaterialMaster = {
      ...item,
      id: `mat-${Date.now().toString().slice(-6)}`,
    };
    setMasterData((prev) => ({ ...prev, materials: [...prev.materials, newMat] }));
  }, []);

  const updateMaterialMaster = useCallback((id: string, updates: Partial<MaterialMaster>) => {
    setMasterData((prev) => ({
      ...prev,
      materials: prev.materials.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  }, []);

  const deleteMaterialMaster = useCallback((id: string) => {
    setMasterData((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m.id !== id),
    }));
  }, []);

  const addSpaceZoneMaster = useCallback((item: Omit<SpaceZoneMaster, 'id'>) => {
    const newZone: SpaceZoneMaster = {
      ...item,
      id: `zone-${Date.now().toString().slice(-6)}`,
    };
    setMasterData((prev) => ({ ...prev, zones: [...prev.zones, newZone] }));
  }, []);

  const updateSpaceZoneMaster = useCallback((id: string, updates: Partial<SpaceZoneMaster>) => {
    setMasterData((prev) => ({
      ...prev,
      zones: prev.zones.map((z) => (z.id === id ? { ...z, ...updates } : z)),
    }));
  }, []);

  const deleteSpaceZoneMaster = useCallback((id: string) => {
    setMasterData((prev) => ({
      ...prev,
      zones: prev.zones.filter((z) => z.id !== id),
    }));
  }, []);

  const addVendorMaster = useCallback((item: Omit<VendorMaster, 'id'>) => {
    const newVendor: VendorMaster = {
      ...item,
      id: `vnd-${Date.now().toString().slice(-6)}`,
    };
    setMasterData((prev) => ({ ...prev, vendors: [...prev.vendors, newVendor] }));
  }, []);

  const updateVendorMaster = useCallback((id: string, updates: Partial<VendorMaster>) => {
    setMasterData((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  }, []);

  const deleteVendorMaster = useCallback((id: string) => {
    setMasterData((prev) => ({
      ...prev,
      vendors: prev.vendors.filter((v) => v.id !== id),
    }));
  }, []);

  const addMilestoneTemplateMaster = useCallback((item: Omit<MilestoneTemplateMaster, 'id'>) => {
    const newTmpl: MilestoneTemplateMaster = {
      ...item,
      id: `tmpl-${Date.now().toString().slice(-6)}`,
    };
    setMasterData((prev) => ({ ...prev, milestones: [...prev.milestones, newTmpl] }));
  }, []);

  const updateMilestoneTemplateMaster = useCallback((id: string, updates: Partial<MilestoneTemplateMaster>) => {
    setMasterData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((tmpl) => (tmpl.id === id ? { ...tmpl, ...updates } : tmpl)),
    }));
  }, []);

  const deleteMilestoneTemplateMaster = useCallback((id: string) => {
    setMasterData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((tmpl) => tmpl.id !== id),
    }));
  }, []);

  const addTeamMemberMaster = useCallback((item: Omit<TeamMemberMaster, 'id'>) => {
    const newTeam: TeamMemberMaster = {
      ...item,
      id: `team-${Date.now().toString().slice(-6)}`,
    };
    setMasterData((prev) => ({ ...prev, team: [...prev.team, newTeam] }));
  }, []);

  const updateTeamMemberMaster = useCallback((id: string, updates: Partial<TeamMemberMaster>) => {
    setMasterData((prev) => ({
      ...prev,
      team: prev.team.map((tm) => (tm.id === id ? { ...tm, ...updates } : tm)),
    }));
  }, []);

  const deleteTeamMemberMaster = useCallback((id: string) => {
    setMasterData((prev) => ({
      ...prev,
      team: prev.team.filter((tm) => tm.id !== id),
    }));
  }, []);

  const resetMastersToDefault = useCallback(() => {
    setMasterData(INITIAL_MASTER_DATA);
    localStorage.removeItem(MASTERS_STORAGE_KEY);
  }, []);

  const exportDataJSON = useCallback(() => {
    return JSON.stringify(
      {
        version: '1.2',
        exportedAt: new Date().toISOString(),
        projects,
        masterData,
      },
      null,
      2
    );
  }, [projects, masterData]);

  const importDataJSON = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      const list = Array.isArray(parsed) ? parsed : parsed?.projects;
      if(!Array.isArray(list) || list.some(p=>!p.id || !p.clientName || !p.confirmedRequirements || !p.nextAction || !['conceptOptions','boqRevisions','executionMilestones','snagItems','invoices','warrantyTickets','detailedDeliverables'].every(k=>Array.isArray(p[k])))) return false;
      if(parsed.masterData && !['trades','materials','zones','vendors','milestones','team'].every(k=>Array.isArray(parsed.masterData[k]))) return false;
      // Case 1: Wrapped format with projects and masterData
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        setProjects(parsed.projects);
        setActiveProjectId(parsed.projects[0].id);
        if (parsed.masterData && typeof parsed.masterData === 'object') {
          setMasterData(parsed.masterData);
        }
        return true;
      }
      // Case 2: Raw array of projects
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
        setProjects(parsed);
        setActiveProjectId(parsed[0].id);
        return true;
      }
    } catch (e) {
      console.error('Failed to import JSON', e);
    }
    return false;
  }, []);

  const resetToDefaultSeed = useCallback(() => {
    setProjects(INITIAL_SEED_PROJECTS);
    setActiveProjectId(INITIAL_SEED_PROJECTS[0].id);
    setMasterData(INITIAL_MASTER_DATA);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MASTERS_STORAGE_KEY);
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        isSynced: syncStatus === 'All changes saved',
        projects,
        activeProjectId,
        activeProject,
        setActiveProjectId,
        searchQuery,
        setSearchQuery,
        selectedEngagementFilter,
        setSelectedEngagementFilter,
        selectedStageFilter,
        setSelectedStageFilter,
        isGeneratingConcepts,
        lastSavedTimestamp,
        createEnquiry,
        updateProject,
        deleteProject,
        advanceProjectStage,
        logCRMActivity,
        toggleStageChecklistItem,
        generateConceptsForProject,
        generateGeminiImageForAsset,
        refineConceptWithGemini,
        critiqueConceptWithGemini,
        generatePitchWithGemini,
        geminiStatus,
        refreshGeminiStatus,
        generationProgress,
        updateConceptReview,
        selectConcept,
        carryForwardConcept,
        addConceptVisualAsset,
        updateConceptVisualAsset,
        approveConceptDrawingSheets,
        discardDraftDrawingSheets,
        stageDrawingSheetUpload,
        addCustomerReference,
        deleteCustomerReference,
        addMaterialToConcept,
        createBOQRevision,
        setActiveBOQRevision,
        addSnagItem,
        updateSnagItemStatus,
        recordInvoicePayment,
        createInvoice,
        addWarrantyTicket,
        updateWarrantyTicketStatus,
        masterData,
        addTradeMaster,
        updateTradeMaster,
        deleteTradeMaster,
        addMaterialMaster,
        updateMaterialMaster,
        deleteMaterialMaster,
        addSpaceZoneMaster,
        updateSpaceZoneMaster,
        deleteSpaceZoneMaster,
        addVendorMaster,
        updateVendorMaster,
        deleteVendorMaster,
        addMilestoneTemplateMaster,
        updateMilestoneTemplateMaster,
        deleteMilestoneTemplateMaster,
        addTeamMemberMaster,
        updateTeamMemberMaster,
        deleteTeamMemberMaster,
        resetMastersToDefault,
        exportDataJSON,
        importDataJSON,
        resetToDefaultSeed,
      }}
    >
      <div role="status" className={'px-4 py-2 text-xs border-b '+(syncStatus==='All changes saved'?'bg-emerald-50 text-emerald-800':'bg-amber-50 text-amber-900')}>{syncStatus}</div>
      {loaded ? children : <div className="p-8"><p>Shared workspace is not ready.</p><button onClick={()=>window.location.reload()} className="mt-4 underline">Retry connection</button></div>}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
