import { AgenticAISuggestion, AIAssistantType } from '../types/erp';

export interface AIAssistantMeta {
  type: AIAssistantType;
  title: string;
  roleDescription: string;
  targetModule: string;
  focusArea: string;
}

export const AI_ASSISTANTS_CATALOG: AIAssistantMeta[] = [
  {
    type: 'REQUIREMENTS',
    title: 'Requirements & Spatial Copilot',
    roleDescription: 'Analyzes client discovery interview notes, room zones, and architectural brief to identify hidden scope gaps.',
    targetModule: 'M01 / M03',
    focusArea: 'Client Brief & Spatial Zoning'
  },
  {
    type: 'BOQ',
    title: 'BOQ Estimating & Takeoff Assistant',
    roleDescription: 'Verifies line item formulas, benchmark rate deviations, and itemized material wastage allowances.',
    targetModule: 'M07',
    focusArea: 'Quantities & Rates Verification'
  },
  {
    type: 'BUDGET',
    title: 'Cost Budget & Margin Guardrail',
    roleDescription: 'Monitors direct cost allocation, subcontractor fee benchmarks, and alerts if target gross margin falls below 20%.',
    targetModule: 'M08',
    focusArea: 'Direct Costs & Gross Profit'
  },
  {
    type: 'DESIGN_REVIEW',
    title: 'Design Review & Constructibility Agent',
    roleDescription: 'Reviews CAD and MEP clashes, checks floor-to-ceiling heights, and verifies door swing clearances.',
    targetModule: 'M04 / M05',
    focusArea: 'Clash Detection & GFC Readiness'
  },
  {
    type: 'PROCUREMENT',
    title: 'Procurement & Vendor Rate Negotiator',
    roleDescription: 'Cross-checks vendor PO quotes against central rate history and recommends volume consolidation opportunities.',
    targetModule: 'M15 / M16',
    focusArea: 'Purchase Orders & Lead Times'
  },
  {
    type: 'PROJECT_MONITORING',
    title: 'Site Execution & Milestone Sentinel',
    roleDescription: 'Compares daily site progress reports against master Gantt timeline to predict schedule slippages.',
    targetModule: 'M13 / M14',
    focusArea: 'Critical Path & Manpower Headcounts'
  },
  {
    type: 'COST_CONTROL',
    title: 'Cost Control & Variation Auditor',
    roleDescription: 'Tracks running account variations, ensures change orders are priced with proper markups, and prevents cost leakages.',
    targetModule: 'M09 / M12',
    focusArea: 'Variations & Scope Management'
  },
  {
    type: 'BILLING',
    title: 'Billing & Running Account Reconciler',
    roleDescription: 'Ensures customer milestone invoices align with verified joint measurement sheets and statutory GST norms.',
    targetModule: 'M19 / M20',
    focusArea: 'RA Bills & Cash Inflows'
  },
  {
    type: 'KNOWLEDGE',
    title: 'Enterprise AEC Knowledge & Standards',
    roleDescription: 'Retrieves Indian NBC codes, IS standards for waterproofing, acoustic STC ratings, and company SOP guidelines.',
    targetModule: 'M24 / M25',
    focusArea: 'Codes, Standards & Best Practices'
  }
];

export const INITIAL_AGENTIC_SUGGESTIONS: AgenticAISuggestion[] = [
  {
    id: 'ASUG-001',
    assistantType: 'BOQ',
    assistantName: 'BOQ Estimating & Takeoff Assistant',
    targetModule: 'M07: BOQ Estimating Engine',
    title: 'Optimized Italian Marble Wastage Allowance',
    description: 'Calculated 15% marble wastage factor exceeds typical 12% high-rise benchmark for large format slabs.',
    detailedAnalysis: 'Statuario slab cut-list optimization indicates 112 sq.ft of off-cuts can be repurposed for master bathroom vanity counter and threshold trims, reducing net purchase volume from 892.5 sq.ft to 835 sq.ft.',
    financialImpact: 'Estimated direct cost reduction of ₹44,850 without compromising visual bookmatching.',
    riskLevel: 'LOW',
    recommendedAction: 'Adjust Statuario marble BOQ item (FLR-01) wastage factor from 15% to 11.5% and allocate trim off-cuts to vanity tops.',
    status: 'PENDING_REVIEW',
    timestamp: '2026-09-12T14:30:00Z',
    suggestedBy: 'Agentic BOQ Optimization Engine v2.4'
  },
  {
    id: 'ASUG-002',
    assistantType: 'COST_CONTROL',
    assistantName: 'Cost Control & Variation Auditor',
    targetModule: 'M12: Variations & Scope Changes',
    title: 'Client Variation VO-01 Markup Reconciliation',
    description: 'Acoustic wall panelling variation request from client submitted with only 15% contractor markup instead of standard 25%.',
    detailedAnalysis: 'Study room acoustic double-glazing and high-density insulation entails specialized acoustic technician mobilization. Standard company commercial policy mandates 25% gross margin on client-directed bespoke variations.',
    financialImpact: 'Reclaiming ₹11,200 in gross margin on Variation Order VO-001.',
    riskLevel: 'MEDIUM',
    recommendedAction: 'Revise client selling price quotation for VO-001 from ₹48,300 to ₹56,000 before sending for formal client digital sign-off.',
    status: 'PENDING_REVIEW',
    timestamp: '2026-09-12T11:15:00Z',
    suggestedBy: 'Agentic Commercial Audit Guardian'
  },
  {
    id: 'ASUG-003',
    assistantType: 'PROCUREMENT',
    assistantName: 'Procurement & Vendor Rate Negotiator',
    targetModule: 'M15: Procurement PO & RFQ',
    title: 'Consolidated Marine Plywood Purchase Order Opportunity',
    description: 'Bulk order discount unlocked by grouping Skyline 1402 and Bandra Villa plywood requirements.',
    detailedAnalysis: 'Apex Timber offers an additional 6.5% tiered volume rebate if orders for BWP 710 marine plywood exceed 100 sheets in a single procurement dispatch cycle.',
    financialImpact: 'Direct material savings of ₹22,425 across current project carpentry package.',
    riskLevel: 'LOW',
    recommendedAction: 'Issue consolidated Purchase Order PO-2026-018 combining Skyline Penthouse with upcoming Bandra Villa fit-out.',
    status: 'PENDING_REVIEW',
    timestamp: '2026-09-11T16:45:00Z',
    suggestedBy: 'Procurement Intelligence Co-Pilot'
  },
  {
    id: 'ASUG-004',
    assistantType: 'DESIGN_REVIEW',
    assistantName: 'Design Review & Constructibility Agent',
    targetModule: 'M04: Architectural Drawings',
    title: 'False Ceiling & AC Return Air Duct Clearance Verification',
    description: 'Living room perimeter cove depth leaves 120mm clearance for concealed VRV high-static indoor unit return air duct.',
    detailedAnalysis: 'Section drawing DWG-1402-A-101 (Rev B) reveals potential vibration conflict between GI false ceiling hanger rod and Daikin VRV indoor unit flexible duct connection at grid line C-3.',
    financialImpact: 'Prevents on-site demolition and re-framing cost estimated at ₹18,000.',
    riskLevel: 'HIGH',
    recommendedAction: 'Shift false ceiling cove step outward by 65mm and issue updated GFC drawing Rev C to site team.',
    status: 'PENDING_REVIEW',
    timestamp: '2026-09-10T09:20:00Z',
    suggestedBy: 'Clash Detection AI Assistant'
  }
];
