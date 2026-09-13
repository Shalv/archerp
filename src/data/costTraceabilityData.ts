import { CostTraceabilityItem } from '../types/erp';

export const DEMO_COST_TRACEABILITY_LEDGER: CostTraceabilityItem[] = [
  {
    id: 'CT-001',
    boqItemCode: 'DEM-01',
    trade: 'DEMOLITION_DISPOSAL',
    roomZone: 'Living & Dining Area',
    description: 'Dismantling existing non-load-bearing partition wall between dining and study including dust containment and debris removal.',
    specification: 'Manual electrical breaker, 4.5" brick partition',
    unit: 'sq.ft',
    boqQuantity: 119.7,
    budgetUnitCost: 28,
    budgetTotalCost: 3351.6,
    sellingRate: 35,
    sellingTotal: 4189.5,
    budgetedMarginPercent: 20,
    subcontractWONumber: 'SCWO-2026-04',
    subcontractorName: 'Om Civil & Demolition Services',
    subcontractCommittedAmount: 3100,
    poCommittedAmount: 0,
    totalCommittedCost: 3100,
    materialIssuedQuantity: 0,
    materialIssuedValue: 0,
    workCertifiedQuantity: 119.7,
    workCertifiedValue: 3100,
    actualCostIncurred: 3100,
    costVariance: 251.6,
    actualMarginPercent: 26.0,
    status: 'CERTIFIED',
    notes: 'Debris bagged and cleared via service elevator outside peak hours.'
  },
  {
    id: 'CT-002',
    boqItemCode: 'MAS-01',
    trade: 'CIVIL_MASONRY',
    roomZone: 'Dining & Kitchen Threshold',
    description: '4-inch AAC lightweight blockwork masonry with polymer-modified adhesive mortar and GI wire mesh ties at concrete junctions.',
    specification: 'Ultratech AAC Blocks 600x200x100mm, Grade 1',
    unit: 'sq.ft',
    boqQuantity: 88.2,
    budgetUnitCost: 95,
    budgetTotalCost: 8379,
    sellingRate: 125,
    sellingTotal: 11025,
    budgetedMarginPercent: 24,
    poNumber: 'PO-2026-012',
    poVendorName: 'BuildPro Building Materials Co.',
    poCommittedAmount: 4800,
    subcontractWONumber: 'SCWO-2026-03',
    subcontractorName: 'Kailash Masonry Works',
    subcontractCommittedAmount: 3200,
    totalCommittedCost: 8000,
    materialIssuedQuantity: 88.2,
    materialIssuedValue: 4800,
    workCertifiedQuantity: 88.2,
    workCertifiedValue: 3200,
    actualCostIncurred: 8000,
    costVariance: 379,
    actualMarginPercent: 27.4,
    status: 'CERTIFIED',
    notes: 'AAC blocks cured and plaster completed on plumb.'
  },
  {
    id: 'CT-003',
    boqItemCode: 'FLR-01',
    trade: 'FLOORING_TILING',
    roomZone: 'Living & Dining Area',
    description: 'Supplying and laying premium Italian Statuario marble slabs in bookmatched layout with epoxy joint filling and diamond polishing.',
    specification: 'Selected Italian Statuario White 18mm slabs, Book-matched',
    unit: 'sq.ft',
    boqQuantity: 892.5,
    budgetUnitCost: 780,
    budgetTotalCost: 696150,
    sellingRate: 980,
    sellingTotal: 874650,
    budgetedMarginPercent: 20.4,
    poNumber: 'PO-2026-022',
    poVendorName: 'Classic Marble & Stone Imports',
    poCommittedAmount: 520000,
    subcontractWONumber: 'SCWO-2026-02',
    subcontractorName: 'Rajasthan Marble Laying & Diamond Polishing Co.',
    subcontractCommittedAmount: 165000,
    totalCommittedCost: 685000,
    materialIssuedQuantity: 892.5,
    materialIssuedValue: 520000,
    workCertifiedQuantity: 892.5,
    workCertifiedValue: 165000,
    actualCostIncurred: 685000,
    costVariance: 11150,
    actualMarginPercent: 21.7,
    status: 'CERTIFIED',
    notes: '8-stage diamond pad polish completed to 100-gloss mirror sheen.'
  },
  {
    id: 'CT-004',
    boqItemCode: 'CEI-01',
    trade: 'FALSE_CEILINGS',
    roomZone: 'Living & Dining Area',
    description: 'Providing and fixing suspended gypsum false ceiling with GI perimeter channels, intermediate channels, and 12.5mm moisture-resistant board.',
    specification: 'Saint-Gobain Gyproc Elite Framework + Board',
    unit: 'sq.ft',
    boqQuantity: 892.5,
    budgetUnitCost: 110,
    budgetTotalCost: 98175,
    sellingRate: 145,
    sellingTotal: 129412.5,
    budgetedMarginPercent: 24.1,
    poNumber: 'PO-2026-015',
    poVendorName: 'Gyproc Authorized Distribution',
    poCommittedAmount: 58000,
    subcontractWONumber: 'SCWO-2026-05',
    subcontractorName: 'Sai Gypsum False Ceiling Contractors',
    subcontractCommittedAmount: 38000,
    totalCommittedCost: 96000,
    materialIssuedQuantity: 850,
    materialIssuedValue: 55250,
    workCertifiedQuantity: 800,
    workCertifiedValue: 35600,
    actualCostIncurred: 90850,
    costVariance: 7325,
    actualMarginPercent: 29.8,
    status: 'PARTIALLY_DELIVERED',
    notes: 'Cove lighting profile channel installed; joint taping in progress.'
  },
  {
    id: 'CT-005',
    boqItemCode: 'CAR-01',
    trade: 'CARPENTRY_JOINERY',
    roomZone: 'Master Bedroom',
    description: 'Full-height floor-to-ceiling modular wardrobe in BWP marine ply carcass finished with natural smoked oak veneer and soft-close hardware.',
    specification: 'Century Club Prime Marine Ply + Blum Soft-Close Runners',
    unit: 'sq.ft',
    boqQuantity: 189,
    budgetUnitCost: 1850,
    budgetTotalCost: 349650,
    sellingRate: 2350,
    sellingTotal: 444150,
    budgetedMarginPercent: 21.3,
    poNumber: 'PO-2026-018',
    poVendorName: 'Apex Timber & Plywood Corporation',
    poCommittedAmount: 210000,
    subcontractWONumber: 'SCWO-2026-01',
    subcontractorName: 'Vishwakarma Carpentry & Interior Works',
    subcontractCommittedAmount: 125000,
    totalCommittedCost: 335000,
    materialIssuedQuantity: 189,
    materialIssuedValue: 210000,
    workCertifiedQuantity: 160,
    workCertifiedValue: 105000,
    actualCostIncurred: 315000,
    costVariance: 34650,
    actualMarginPercent: 29.1,
    status: 'COMMITTED',
    notes: 'Internal carcass assembled; veneer press lamination underway.'
  },
  {
    id: 'CT-006',
    boqItemCode: 'ELE-01',
    trade: 'ELECTRICAL_AUTOMATION',
    roomZone: 'Entire Residence',
    description: 'Point wiring for light, fan, 6A convenience sockets, and 16A power points in concealed FRLS PVC conduits with multi-strand copper cables.',
    specification: 'Polycab FRLS-H Copper Wire + Schneider AvatarOn Switches',
    unit: 'nos',
    boqQuantity: 145,
    budgetUnitCost: 950,
    budgetTotalCost: 137750,
    sellingRate: 1250,
    sellingTotal: 181250,
    budgetedMarginPercent: 24.0,
    poNumber: 'PO-2026-027',
    poVendorName: 'ElectroCare Systems & Distribution',
    poCommittedAmount: 82000,
    subcontractWONumber: 'SCWO-2026-07',
    subcontractorName: 'Shree Ganesh MEP & Electrical Contractors',
    subcontractCommittedAmount: 51000,
    totalCommittedCost: 133000,
    materialIssuedQuantity: 145,
    materialIssuedValue: 82000,
    workCertifiedQuantity: 130,
    workCertifiedValue: 45700,
    actualCostIncurred: 127700,
    costVariance: 10050,
    actualMarginPercent: 29.5,
    status: 'COMMITTED',
    notes: 'Concealed conduit piping tested under insulation tester.'
  },
  {
    id: 'CT-007',
    boqItemCode: 'PNT-01',
    trade: 'PAINTING_POLISHING',
    roomZone: 'Entire Residence',
    description: 'Surface preparation, 2 coats acrylic putty, 1 coat primer, and 2 coats luxury washable interior emulsion paint on all walls and ceilings.',
    specification: 'Asian Paints Royale Luxury Matt Emulsion with Teflon',
    unit: 'sq.ft',
    boqQuantity: 3675,
    budgetUnitCost: 38,
    budgetTotalCost: 139650,
    sellingRate: 52,
    sellingTotal: 191100,
    budgetedMarginPercent: 26.9,
    poNumber: 'PO-2026-033',
    poVendorName: 'Asian Paints Color Idea Store',
    poCommittedAmount: 76000,
    subcontractWONumber: 'SCWO-2026-08',
    subcontractorName: 'Shree Sai Finishing Contractors',
    subcontractCommittedAmount: 58000,
    totalCommittedCost: 134000,
    materialIssuedQuantity: 2800,
    materialIssuedValue: 57900,
    workCertifiedQuantity: 2600,
    workCertifiedValue: 41000,
    actualCostIncurred: 98900,
    costVariance: 40750,
    actualMarginPercent: 48.2,
    status: 'PARTIALLY_DELIVERED',
    notes: 'Putty leveling and first coat applied; final coat pending after joinery.'
  }
];

export interface TraceabilitySummary {
  totalSellingContract: number;
  totalBudgetCost: number;
  totalCommittedCost: number;
  totalActualCostIncurred: number;
  savingsFavorable: boolean;
  totalCostVariance: number;
  liveProjectMarginPercent: number;
  budgetedMarginPercent: number;
}

export function getProjectTraceabilitySummary(items: CostTraceabilityItem[]): TraceabilitySummary {
  const totalSellingContract = items.reduce((sum, item) => sum + (item.sellingTotal || 0), 0);
  const totalBudgetCost = items.reduce((sum, item) => sum + (item.budgetTotalCost || 0), 0);
  const totalCommittedCost = items.reduce((sum, item) => sum + (item.totalCommittedCost || 0), 0);
  const totalActualCostIncurred = items.reduce((sum, item) => sum + (item.actualCostIncurred || 0), 0);

  const totalCostVariance = totalBudgetCost - totalActualCostIncurred;
  const savingsFavorable = totalCostVariance >= 0;

  const budgetedMarginAmount = totalSellingContract - totalBudgetCost;
  const budgetedMarginPercent = totalSellingContract > 0 
    ? Math.round((budgetedMarginAmount / totalSellingContract) * 1000) / 10 
    : 0;

  const liveGrossProfit = totalSellingContract - totalActualCostIncurred;
  const liveProjectMarginPercent = totalSellingContract > 0 
    ? Math.round((liveGrossProfit / totalSellingContract) * 1000) / 10 
    : 0;

  return {
    totalSellingContract,
    totalBudgetCost,
    totalCommittedCost,
    totalActualCostIncurred,
    savingsFavorable,
    totalCostVariance,
    liveProjectMarginPercent,
    budgetedMarginPercent
  };
}
