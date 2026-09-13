/**
 * Microsoft Dynamics 365 Business Central style "Open in Excel" export utility
 * Generates and downloads formatted CSV files for Job Planning Lines and Cost Budgets
 */

import { BOQItem, CostBudgetSummary, ProjectRecord } from '../types/erp';

export function exportJobPlanningLinesToExcel(
  project: ProjectRecord,
  items: BOQItem[],
  budgetSummary: CostBudgetSummary | null
) {
  const activeRev = project.revisions.find(r => r.id === project.activeRevisionId) || project.revisions[0];
  
  // Header lines resembling Dynamics 365 Job Planning Lines export
  const headers = [
    'Line No',
    'Line Type',
    'Job No',
    'Trade Category',
    'Room / Zone',
    'Item Code',
    'Description',
    'Brand / Grade',
    'Formula Derivation',
    'Unit of Measure',
    'Base Quantity',
    'Wastage %',
    'Billable Quantity',
    'Unit Cost (INR)',
    'Total Cost (INR)',
    'Markup %',
    'Unit Price (INR)',
    'Line Amount (INR)',
    'Rate Source',
    'Drawing Reference',
    'Assumptions & Notes',
    'Status'
  ];

  const rows = items.map((item, index) => [
    (index + 1) * 10000, // D365 standard 10000 step line numbering
    'Item',
    project.projectCode,
    `"${item.trade.replace(/_/g, ' ')}"`,
    `"${item.roomZone}"`,
    item.itemCode,
    `"${item.description.replace(/"/g, '""')}"`,
    `"${item.brandGrade.replace(/"/g, '""')}"`,
    `"${(item.quantityFormula || '').replace(/"/g, '""')}"`,
    item.unit,
    item.baseQuantity,
    `${item.wastagePercent}%`,
    item.finalQuantity,
    item.unitCost,
    item.totalCost,
    `${item.markupPercent}%`,
    item.sellingRate,
    item.sellingAmount,
    item.rateSource || 'APPROVED_MASTER',
    `"${(item.sourceDocumentRef || '').replace(/"/g, '""')}"`,
    `"${(item.assumptions || '').replace(/"/g, '""')}"`,
    item.isApprovedByEstimator ? 'Approved' : 'Estimator Review'
  ]);

  // Add summary rows at the bottom
  const summaryRows = [
    [],
    ['--- COMMERCIAL BUDGET SUMMARY ---'],
    ['Total Direct Cost (INR)', '', '', '', '', '', '', '', '', '', '', '', '', '', budgetSummary?.totalDirectCost || 0],
    ['Site Overheads (5%)', '', '', '', '', '', '', '', '', '', '', '', '', '', budgetSummary?.siteOverheadsAmount || 0],
    ['Contingency Reserve (3%)', '', '', '', '', '', '', '', '', '', '', '', '', '', budgetSummary?.contingencyAmount || 0],
    ['Logistics & Carting', '', '', '', '', '', '', '', '', '', '', '', '', '', budgetSummary?.siteLogisticsExpense || 0],
    ['Total Project Cost (INR)', '', '', '', '', '', '', '', '', '', '', '', '', '', budgetSummary?.totalProjectCost || 0],
    ['Gross Margin (INR)', '', '', '', '', '', '', '', '', '', '', '', '', '', budgetSummary?.grossMarginAmount || 0],
    ['Selling Subtotal (INR)', '', '', '', '', '', '', '', '', '', '', '', '', '', budgetSummary?.totalSellingBeforeTax || 0],
    ['Works Contract GST 18%', '', '', '', '', '', '', '', '', '', '', '', '', '', budgetSummary?.gstAmount || 0],
    ['Total Contract Value (INR)', '', '', '', '', '', '', '', '', '', '', '', '', '', budgetSummary?.totalClientContractValue || 0]
  ];

  const csvContent = [
    `Microsoft Dynamics 365 Business Central - Export: Job Planning Lines`,
    `Job: ${project.projectCode} - ${project.title}`,
    `Revision: ${activeRev?.revisionLabel || 'Rev 1'}`,
    `Export Date: ${new Date().toISOString()}`,
    ``,
    headers.join(','),
    ...rows.map(r => r.join(',')),
    ...summaryRows.map(r => r.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `D365_JobPlanningLines_${project.projectCode}_${activeRev?.revisionLabel.replace(/[^a-zA-Z0-9]/g, '_') || 'Rev1'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
