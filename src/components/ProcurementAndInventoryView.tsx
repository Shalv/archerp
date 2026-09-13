/**
 * Build Storys ERP - Procurement, Purchase & Warehouse Inventory (Pillars 9 & 10)
 * Material Requisitions (PR) from site → Multi-Vendor RFQ & Comparative Statement →
 * Purchase Orders (PO) & Advance PO → Goods Receipt Note (GRN) with Quality Inspection →
 * Multi-Site Warehouse Inventory with Reorder Thresholds & 5-Star Vendor Ratings.
 */

import React, { useState } from 'react';
import {
  ShoppingBag,
  Package,
  FileCheck,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  Truck,
  Star,
  ShieldCheck,
  XCircle,
  Building,
  QrCode
} from 'lucide-react';
import { ProjectRecord, UserSession, PurchaseOrderRecord, GoodsReceiptNote, ProcurementRFQ } from '../types/erp';

interface ProcurementAndInventoryViewProps {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
}

interface SiteRequisition {
  id: string;
  prNumber: string;
  requestedBy: string;
  trade: string;
  itemName: string;
  requestedQuantity: number;
  unit: string;
  requiredByDate: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  purpose: string;
  approvalStatus: 'PENDING_APPROVAL' | 'APPROVED_FOR_PO' | 'REJECTED';
}

interface WarehouseStockItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  warehouseLocation: string; // "Worli Site Store" or "Bhiwandi Central Depot"
  currentStock: number;
  minimumThreshold: number;
  unit: string;
  unitCostINR: number;
  totalValueINR: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'REORDER_TRIGGERED';
}

const INITIAL_REQUISITIONS: SiteRequisition[] = [
  {
    id: 'PR-001',
    prNumber: 'PR-2026-081',
    requestedBy: 'Site Eng. Rajesh Sharma',
    trade: 'WATERPROOFING',
    itemName: 'Dr. Fixit Fastflex 2-Component Elastomeric Membrane (24kg kit)',
    requestedQuantity: 8,
    unit: 'nos',
    requiredByDate: '2026-03-18',
    urgency: 'HIGH',
    purpose: 'For sunken slab ponding test in Master Bathroom and Powder Room',
    approvalStatus: 'APPROVED_FOR_PO'
  },
  {
    id: 'PR-002',
    prNumber: 'PR-2026-082',
    requestedBy: 'Senior Carpenter Jagdish',
    trade: 'CARPENTRY_JOINERY',
    itemName: 'CenturyPly Club Prime BWP 710 Marine Grade Plywood 18mm (8x4)',
    requestedQuantity: 35,
    unit: 'sheets',
    requiredByDate: '2026-03-22',
    urgency: 'MEDIUM',
    purpose: 'Wardrobe carcasses and kitchen island framework',
    approvalStatus: 'APPROVED_FOR_PO'
  },
  {
    id: 'PR-003',
    prNumber: 'PR-2026-083',
    requestedBy: 'Electrician Sunil',
    trade: 'ELECTRICAL_AUTOMATION',
    itemName: 'Polycab FRLS-H Copper Wire 2.5 sq.mm Red/Black/Green (90m rolls)',
    requestedQuantity: 12,
    unit: 'nos',
    requiredByDate: '2026-03-25',
    urgency: 'LOW',
    purpose: 'Living room primary power circuit looping',
    approvalStatus: 'PENDING_APPROVAL'
  }
];

const INITIAL_RFQS: ProcurementRFQ[] = [
  {
    id: 'RFQ-001',
    projectId: 'PROJ-SKYLINE-1402',
    rfqNumber: 'RFQ-2026-041',
    materialRequisitionId: 'PR-002',
    itemDescription: 'CenturyPly Club Prime BWP 710 Marine Grade Plywood 18mm (8x4 sheets)',
    trade: 'CARPENTRY_JOINERY',
    requiredQuantity: 35,
    unit: 'nos',
    requiredByDate: '2026-03-22',
    deliverySiteAddress: 'Skyline Towers, Flat 1402, Worli Seaface, Mumbai',
    vendorQuotations: [
      {
        vendorId: 'VEND-01',
        vendorName: 'Continental Timber & Veneers Pvt Ltd',
        unitRateINR: 3250,
        taxPercent: 18,
        totalAmountINR: 134225,
        deliveryLeadTimeDays: 2,
        paymentTerms: '100% on 30-day credit',
        vendorRating: 4.8,
        isRecommended: true
      },
      {
        vendorId: 'VEND-02',
        vendorName: 'Mahalaxmi Plywood & Hardware Stores',
        unitRateINR: 3380,
        taxPercent: 18,
        totalAmountINR: 139594,
        deliveryLeadTimeDays: 4,
        paymentTerms: '50% Advance, balance against delivery',
        vendorRating: 4.2,
        isRecommended: false
      },
      {
        vendorId: 'VEND-03',
        vendorName: 'Shree Krishna Building Materials',
        unitRateINR: 3410,
        taxPercent: 18,
        totalAmountINR: 140833,
        deliveryLeadTimeDays: 1,
        paymentTerms: 'Immediate RTGS before dispatch',
        vendorRating: 4.5,
        isRecommended: false
      }
    ],
    selectedVendorId: 'VEND-01',
    status: 'COMPARISON_READY'
  }
];

const INITIAL_POS: PurchaseOrderRecord[] = [
  {
    id: 'PO-001',
    poNumber: 'PO-2026-018',
    vendorId: 'VEND-01',
    vendorName: 'Continental Timber & Veneers Pvt Ltd',
    trade: 'CARPENTRY_JOINERY',
    itemsCount: 2,
    totalAmount: 285400,
    issueDate: '2026-03-05',
    deliveryDateExpected: '2026-03-12',
    status: 'DELIVERED_CLOSED',
    paymentTerms: '30 Days Net Credit'
  },
  {
    id: 'PO-002',
    poNumber: 'PO-2026-019',
    vendorId: 'VEND-04',
    vendorName: 'Classic Marble Company (CMC India)',
    trade: 'FLOORING_TILING',
    itemsCount: 1,
    totalAmount: 1845000,
    issueDate: '2026-03-08',
    deliveryDateExpected: '2026-03-24',
    status: 'ISSUED',
    paymentTerms: '20% Mobilization Advance, 80% on dry-lay inspection'
  }
];

const INITIAL_GRNS: GoodsReceiptNote[] = [
  {
    id: 'GRN-001',
    projectId: 'PROJ-SKYLINE-1402',
    grnNumber: 'GRN-2026-012',
    poNumber: 'PO-2026-018',
    vendorName: 'Continental Timber & Veneers Pvt Ltd',
    receivedDate: '2026-03-11',
    challanInvoiceNumber: 'DC-8841 / INV-4491',
    itemsReceived: [
      { itemCode: 'PLY-18-BWP', description: 'CenturyPly 18mm BWP Club Prime (8x4)', orderedQty: 40, receivedQty: 40, acceptedQty: 39, rejectedQty: 1, rejectionReason: 'Corner edge delamination during transit', unit: 'sheets' },
      { itemCode: 'FVI-SYN-01', description: 'Fevicol Marine Grade Synthetic Resin (50kg Drum)', orderedQty: 4, receivedQty: 4, acceptedQty: 4, rejectedQty: 0, unit: 'drums' }
    ],
    qualityInspectionStatus: 'CONDITIONALLY_ACCEPTED',
    inspectorName: 'Site QA Eng. K. R. Nair',
    warehouseStorageLocation: 'Worli Flat 1402 Site Store - Dry Chamber',
    notes: 'Debit note generated for 1 damaged sheet. 39 sheets safely stacked on batten supports.'
  }
];

const INITIAL_STOCK: WarehouseStockItem[] = [
  {
    id: 'STK-001',
    itemCode: 'PLY-18-BWP',
    itemName: 'CenturyPly 18mm Club Prime BWP 710',
    category: 'Plywood & Boards',
    warehouseLocation: 'Worli Flat 1402 Site Store',
    currentStock: 39,
    minimumThreshold: 15,
    unit: 'sheets',
    unitCostINR: 3250,
    totalValueINR: 126750,
    status: 'IN_STOCK'
  },
  {
    id: 'STK-002',
    itemCode: 'FIX-FAST-24',
    itemName: 'Dr. Fixit Fastflex 2-Comp Waterproofing Kit',
    category: 'Chemicals & Adhesives',
    warehouseLocation: 'Worli Flat 1402 Site Store',
    currentStock: 4,
    minimumThreshold: 8,
    unit: 'kits',
    unitCostINR: 2850,
    totalValueINR: 11400,
    status: 'LOW_STOCK'
  },
  {
    id: 'STK-003',
    itemCode: 'POLY-WIRE-2.5',
    itemName: 'Polycab FRLS-H Copper Wire 2.5 sq.mm Red',
    category: 'Electrical',
    warehouseLocation: 'Bhiwandi Central Depot',
    currentStock: 45,
    minimumThreshold: 20,
    unit: 'rolls',
    unitCostINR: 2150,
    totalValueINR: 96750,
    status: 'IN_STOCK'
  },
  {
    id: 'STK-004',
    itemCode: 'BLUM-SOFT-RUNNER',
    itemName: 'Blum Tandembox Antaro 500mm Soft Close Drawer',
    category: 'Hardware & Fittings',
    warehouseLocation: 'Worli Flat 1402 Site Store',
    currentStock: 2,
    minimumThreshold: 6,
    unit: 'sets',
    unitCostINR: 4200,
    totalValueINR: 8400,
    status: 'REORDER_TRIGGERED'
  }
];

export const ProcurementAndInventoryView: React.FC<ProcurementAndInventoryViewProps> = ({
  project,
  currentUser,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'rfq' | 'pos' | 'grn' | 'inventory' | 'requisitions'>('rfq');
  const [requisitions, setRequisitions] = useState<SiteRequisition[]>(INITIAL_REQUISITIONS);
  const [rfqs, setRfqs] = useState<ProcurementRFQ[]>(INITIAL_RFQS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(INITIAL_POS);
  const [grns, setGrns] = useState<GoodsReceiptNote[]>(INITIAL_GRNS);
  const [inventory, setInventory] = useState<WarehouseStockItem[]>(INITIAL_STOCK);
  const [selectedRfq, setSelectedRfq] = useState<ProcurementRFQ>(INITIAL_RFQS[0]);

  const handleApproveRequisition = (id: string) => {
    setRequisitions(requisitions.map(r => r.id === id ? { ...r, approvalStatus: 'APPROVED_FOR_PO' } : r));
  };

  const handleGeneratePOFromRFQ = (rfq: ProcurementRFQ, vendorId: string) => {
    const quote = rfq.vendorQuotations.find(v => v.vendorId === vendorId);
    if (!quote) return;

    const newPO: PurchaseOrderRecord = {
      id: `PO-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      vendorId: quote.vendorId,
      vendorName: quote.vendorName,
      trade: rfq.trade,
      itemsCount: 1,
      totalAmount: quote.totalAmountINR,
      issueDate: new Date().toISOString().split('T')[0],
      deliveryDateExpected: new Date(Date.now() + 86400000 * quote.deliveryLeadTimeDays).toISOString().split('T')[0],
      status: 'ISSUED',
      paymentTerms: quote.paymentTerms
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setActiveTab('pos');
    alert(`Purchase Order ${newPO.poNumber} successfully generated for ${quote.vendorName} (₹${quote.totalAmountINR.toLocaleString()})!`);
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen text-slate-800 p-4 md:p-6 space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#004a99] text-white flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Pillars 9 & 10: Procurement, Purchase Orders & Warehouse Inventory
              </h1>
              <span className="text-xs bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded font-bold">
                PR → Multi-Vendor RFQ → PO → GRN → Site Stores
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Comparative statement analysis, QA inward goods inspection, and real-time site stock tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('requisitions')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'requisitions' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Site Requisitions (PR)
          </button>
          <button
            onClick={() => setActiveTab('rfq')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'rfq' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Comparative RFQ Matrix
          </button>
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'pos' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Purchase Orders (PO)
          </button>
          <button
            onClick={() => setActiveTab('grn')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'grn' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Goods Receipt Notes (GRN)
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'inventory' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Warehouse & Site Stock
          </button>
        </div>
      </div>

      {/* TAB 1: COMPARATIVE STATEMENT & RFQ (Pillar 9 Core) */}
      {activeTab === 'rfq' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
            <div className="flex items-start justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-900 font-mono font-bold text-xs px-2 py-0.5 rounded">
                    {selectedRfq.rfqNumber}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedRfq.itemDescription}</h3>
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  Required Qty: <strong className="text-slate-800">{selectedRfq.requiredQuantity} {selectedRfq.unit}</strong> • Target Date: <strong className="text-slate-800">{selectedRfq.requiredByDate}</strong>
                </div>
              </div>

              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded font-mono">
                Status: {selectedRfq.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#004a99]" />
                <span>Multi-Vendor Quotation Comparative Statement (L1 / L2 / L3 Analysis)</span>
              </h4>

              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Vendor / Supplier Name</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Unit Rate (₹)</th>
                      <th className="p-3">GST Tax</th>
                      <th className="p-3">Total Landed Amount (₹)</th>
                      <th className="p-3">Lead Time</th>
                      <th className="p-3">Commercial Terms</th>
                      <th className="p-3 text-right">Procurement Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedRfq.vendorQuotations.map((v, idx) => (
                      <tr key={idx} className={v.isRecommended ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}>
                        <td className="p-3 font-bold text-slate-900">
                          {v.vendorName}
                          {v.isRecommended && (
                            <span className="ml-2 bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                              RECOMMENDED L1
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{v.vendorRating}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono">₹{v.unitRateINR.toLocaleString()}</td>
                        <td className="p-3 text-slate-500 font-mono">{v.taxPercent}%</td>
                        <td className="p-3 font-bold font-mono text-[#004a99]">
                          ₹{v.totalAmountINR.toLocaleString()}
                        </td>
                        <td className="p-3 text-slate-700">{v.deliveryLeadTimeDays} Days</td>
                        <td className="p-3 text-slate-600 text-[11px]">{v.paymentTerms}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleGeneratePOFromRFQ(selectedRfq, v.vendorId)}
                            className={`px-3 py-1.5 rounded font-bold text-xs shadow-xs transition ${
                              v.isRecommended
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-[#004a99] hover:bg-[#003875] text-white'
                            }`}
                          >
                            Award & Issue PO
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded border border-blue-200 text-blue-950 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Audit & Traceability Mandate:</strong>
                All PO amounts generated here automatically commit against the approved BOQ budget in Module 6 (Traceability Engine), updating the committed cost ledger in real-time.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PURCHASE ORDERS (PO) */}
      {activeTab === 'pos' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Active & Issued Purchase Orders (POs)</h3>
            <span className="text-slate-500">Total Committed Value: ₹{(purchaseOrders.reduce((sum, p) => sum + p.totalAmount, 0) / 100000).toFixed(2)} Lakhs</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">PO Number</th>
                  <th className="p-3">Vendor</th>
                  <th className="p-3">Trade</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Expected Delivery</th>
                  <th className="p-3">PO Value (₹)</th>
                  <th className="p-3">Payment Terms</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#004a99]">{po.poNumber}</td>
                    <td className="p-3 font-bold text-slate-800">{po.vendorName}</td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">{po.trade}</td>
                    <td className="p-3 text-slate-500">{po.issueDate}</td>
                    <td className="p-3 text-slate-700 font-medium">{po.deliveryDateExpected}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">₹{po.totalAmount.toLocaleString()}</td>
                    <td className="p-3 text-slate-600 text-[11px]">{po.paymentTerms}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        po.status === 'DELIVERED_CLOSED' ? 'bg-emerald-100 text-emerald-800' :
                        po.status === 'ISSUED' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {po.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GOODS RECEIPT NOTES (GRN & QA INSPECTION) */}
      {activeTab === 'grn' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Goods Receipt Notes (GRN) & Inward Inspection</h3>
              <p className="text-slate-500 text-[11px]">Physical site verification of materials against PO specs and damage inspection.</p>
            </div>
          </div>

          {grns.map((g) => (
            <div key={g.id} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
                <div>
                  <span className="font-mono font-bold text-[#004a99] mr-2 text-xs">{g.grnNumber}</span>
                  <span className="text-slate-700 font-semibold">{g.vendorName}</span>
                  <span className="text-slate-400 ml-2">PO: {g.poNumber} • Challan: {g.challanInvoiceNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    g.qualityInspectionStatus === 'PASSED' ? 'bg-emerald-100 text-emerald-800' :
                    g.qualityInspectionStatus === 'CONDITIONALLY_ACCEPTED' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    QA: {g.qualityInspectionStatus.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-500">Inspector: {g.inspectorName}</span>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-2">Item Code</th>
                      <th className="p-2">Description</th>
                      <th className="p-2 text-center">Ordered</th>
                      <th className="p-2 text-center">Received</th>
                      <th className="p-2 text-center">Accepted</th>
                      <th className="p-2 text-center">Rejected</th>
                      <th className="p-2">Rejection Reason / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {g.itemsReceived.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-mono text-slate-600">{it.itemCode}</td>
                        <td className="p-2 font-bold text-slate-800">{it.description}</td>
                        <td className="p-2 text-center">{it.orderedQty}</td>
                        <td className="p-2 text-center">{it.receivedQty}</td>
                        <td className="p-2 text-center font-bold text-emerald-600">{it.acceptedQty}</td>
                        <td className="p-2 text-center font-bold text-red-600">{it.rejectedQty}</td>
                        <td className="p-2 text-slate-500 text-[11px]">{it.rejectionReason || 'Inspection Passed 100%'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] text-slate-500">
                Storage: <strong>{g.warehouseStorageLocation}</strong> • Notes: {g.notes}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: WAREHOUSE & SITE STOCK (Pillar 10) */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Site & Central Warehouse Real-Time Inventory</h3>
              <p className="text-slate-500 text-[11px]">Live stock availability, minimum threshold alerts, and batch locations.</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Total Inventory Valuation</span>
              <strong className="text-slate-900 font-mono text-sm">
                ₹{inventory.reduce((sum, it) => sum + it.totalValueINR, 0).toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Item Code</th>
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3 text-center">Available Stock</th>
                  <th className="p-3 text-center">Reorder Min</th>
                  <th className="p-3">Unit Cost (₹)</th>
                  <th className="p-3">Total Value (₹)</th>
                  <th className="p-3">Inventory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map((stk) => (
                  <tr key={stk.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-600">{stk.itemCode}</td>
                    <td className="p-3 font-bold text-slate-900">{stk.itemName}</td>
                    <td className="p-3 text-slate-500">{stk.category}</td>
                    <td className="p-3 text-slate-700">{stk.warehouseLocation}</td>
                    <td className="p-3 text-center font-bold text-slate-900 font-mono">
                      {stk.currentStock} {stk.unit}
                    </td>
                    <td className="p-3 text-center text-slate-500 font-mono">
                      {stk.minimumThreshold} {stk.unit}
                    </td>
                    <td className="p-3 font-mono">₹{stk.unitCostINR.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-[#004a99]">₹{stk.totalValueINR.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        stk.status === 'IN_STOCK' ? 'bg-emerald-100 text-emerald-800' :
                        stk.status === 'LOW_STOCK' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {stk.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SITE REQUISITIONS (PR) */}
      {activeTab === 'requisitions' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Site Material Requisitions (PR)</h3>
            <span className="text-slate-500 text-[11px]">Submitted by Site Engineers & Trade Foremen</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">PR Number</th>
                  <th className="p-3">Requested By</th>
                  <th className="p-3">Trade</th>
                  <th className="p-3">Material Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3">Required By</th>
                  <th className="p-3">Urgency</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requisitions.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#004a99]">{pr.prNumber}</td>
                    <td className="p-3 text-slate-800">{pr.requestedBy}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{pr.trade}</td>
                    <td className="p-3 font-bold text-slate-900">{pr.itemName}</td>
                    <td className="p-3 text-center font-mono font-bold">{pr.requestedQuantity} {pr.unit}</td>
                    <td className="p-3 text-slate-700">{pr.requiredByDate}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        pr.urgency === 'HIGH' ? 'bg-red-100 text-red-800' :
                        pr.urgency === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {pr.urgency}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 text-[11px] max-w-xs truncate">{pr.purpose}</td>
                    <td className="p-3 text-right">
                      {pr.approvalStatus === 'PENDING_APPROVAL' ? (
                        <button
                          onClick={() => handleApproveRequisition(pr.id)}
                          className="px-2.5 py-1 rounded bg-[#004a99] hover:bg-[#003875] text-white font-bold text-xs"
                        >
                          Approve PR
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
