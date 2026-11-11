/**
 * Build Storys ERP - Cost Traceability Ledger
 * The ledger is derived from the Rev 1 BOQ of PROJ-VILLA-253, so the
 * BOQ, budget, PO/subcontract and measurement-book figures always agree.
 */

import { CostTraceabilityItem } from '../types/erp';
import { VILLA253_COST_TRACEABILITY } from './villa253OpsSeeds';

export const DEMO_COST_TRACEABILITY_LEDGER: CostTraceabilityItem[] = VILLA253_COST_TRACEABILITY;

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
