import React, { useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Clock,
  DollarSign,
  Plus,
  FileCheck,
  Send,
  Printer,
  Calendar,
  Wrench,
  ChevronRight,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { InvoiceRecord, WarrantyServiceTicket } from '../types';
import { formatINR } from '../utils/currency';
import { BillingStatusBadge, CollectionStatusBadge, WarrantyStatusBadge } from './StatusBadges';

export const BillingWarrantyView: React.FC = () => {
  const {
    activeProject,
    recordInvoicePayment,
    createInvoice,
    addWarrantyTicket,
    updateWarrantyTicketStatus,
  } = useProject();

  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<InvoiceRecord | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<number>(0);

  const [isLogTicketOpen, setIsLogTicketOpen] = useState(false);
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketTech, setTicketTech] = useState('Senior Services Technician');
  const [ticketNotes, setTicketNotes] = useState('');

  if (!activeProject) return null;

  const invoices = activeProject.invoices || [];
  const tickets = activeProject.warrantyTickets || [];

  const totalContractAmount = invoices.reduce((acc, inv) => acc + inv.amountDue, 0);
  const totalPaidAmount = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((acc, inv) => acc + (inv.paidAmount || inv.amountDue), 0);
  const totalPendingAmount = totalContractAmount - totalPaidAmount;

  const handleOpenPayment = (inv: InvoiceRecord) => {
    setSelectedInvoiceForPayment(inv);
    setPaymentAmountInput(inv.amountDue);
    setIsRecordPaymentOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedInvoiceForPayment) return;
    recordInvoicePayment(activeProject.id, selectedInvoiceForPayment.id, paymentAmountInput);
    setIsRecordPaymentOpen(false);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDescription) return;
    addWarrantyTicket(activeProject.id, {
      issueDescription: ticketDescription,
      status: 'Claim Received',
      technicianAssigned: ticketTech,
      notes: ticketNotes || 'Scheduled for inspection under 12-month fitout warranty',
    });
    setTicketDescription('');
    setTicketNotes('');
    setIsLogTicketOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
              Finance &amp; After-Sales
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Milestone Invoicing, Retentions &amp; 12-Mo Warranty
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Operational Billing &amp; Warranty Service
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Stage-gate milestone billing tied to physical site completions, defect liability retention tracking, and after-sales service dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsLogTicketOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Log Warranty Service Claim</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Contract Value
          </span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {formatINR(totalContractAmount)}
          </p>
          <div className="mt-1 flex items-center space-x-1.5">
            <BillingStatusBadge status={activeProject.billingStatus} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Collected Receipts
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {formatINR(totalPaidAmount)}
          </p>
          <div className="mt-1 flex items-center space-x-1.5">
            <CollectionStatusBadge status={activeProject.collectionStatus} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Outstanding Invoiced Balance
          </span>
          <p className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {formatINR(totalPendingAmount)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Pending milestone clearance
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Defect Liability Retention (5%)
          </span>
          <p className="text-2xl font-bold font-mono text-indigo-700 mt-1">
            {formatINR(activeProject.defectLiabilityRetentionAmount || Math.round(totalContractAmount * 0.05))}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Withheld until 12-mo inspection
          </span>
        </div>
      </div>

      {/* Milestone Invoicing Schedule */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Milestone Invoices Schedule ({invoices.length} Invoices)
            </h2>
            <p className="text-[11px] text-slate-500">
              Contractually staged payments generated from the approved concept scope.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {Math.round((totalPaidAmount / (totalContractAmount || 1)) * 100)}% Collected
          </span>
        </div>

        {invoices.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No milestone invoices configured yet. Carry forward a concept from AI Design Studio to auto-generate the contract invoice schedule.
          </p>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-3.5">Invoice #</th>
                  <th className="py-3 px-3.5">Milestone Description</th>
                  <th className="py-3 px-3.5 text-center">Share</th>
                  <th className="py-3 px-3.5 text-right">Amount</th>
                  <th className="py-3 px-3.5">Due Date</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {invoices.map((inv) => {
                  const isPaid = inv.status === 'Paid';
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-3.5 font-medium text-slate-800">
                        {inv.milestoneTitle}
                      </td>
                      <td className="py-3 px-3.5 text-center font-mono text-slate-500">
                        {inv.percentageOfContract}%
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">
                        {formatINR(inv.amountDue)}
                      </td>
                      <td className="py-3 px-3.5 text-slate-500">{inv.dueDate}</td>
                      <td className="py-3 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.status === 'Sent'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isPaid ? `Paid (${inv.paidDate})` : inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        {!isPaid ? (
                          <button
                            type="button"
                            onClick={() => handleOpenPayment(inv)}
                            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                          >
                            Record Receipt
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-end space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Cleared</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Handover & Warranty Service Protocol */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">
                12-Month Fitout &amp; 5-Year Structural Warranty Management
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Defect liability tracking and SLA service dispatches during the post-handover warranty window.
            </p>
          </div>

          <WarrantyStatusBadge status={activeProject.warrantyStatus} />
        </div>

        {/* Tickets Tracker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Warranty Claims &amp; Service Tickets ({tickets.length})
            </span>
          </div>

          {tickets.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
              <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
              <p className="font-medium text-slate-600">No warranty claims open</p>
              <p className="text-[11px]">All fixtures, joinery, and services are functioning without service tickets.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900">{t.ticketNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Closed' || t.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium">{t.issueDescription}</p>
                    <p className="text-[11px] text-slate-400">{t.notes} • Reported {t.reportedDate}</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-[11px] text-slate-500">Tech: <strong>{t.technicianAssigned}</strong></span>
                    <select
                      value={t.status}
                      onChange={(e) => updateWarrantyTicketStatus(activeProject.id, t.id, e.target.value as WarrantyServiceTicket['status'])}
                      className="text-[11px] px-2 py-1 border border-slate-200 rounded-md bg-white text-slate-800 font-medium"
                    >
                      <option value="Claim Received">Claim Received</option>
                      <option value="Technician Dispatched">Technician Dispatched</option>
                      <option value="Parts Ordered">Parts Ordered</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordPaymentOpen && selectedInvoiceForPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Record Payment Receipt</h3>
                <span className="text-[11px] font-mono text-slate-500">{selectedInvoiceForPayment.invoiceNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsRecordPaymentOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Milestone: <strong>{selectedInvoiceForPayment.milestoneTitle}</strong>
              </p>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Received Amount ($)
                </label>
                <input
                  type="number"
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-mono font-bold px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRecordPaymentOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
              >
                Confirm Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Warranty Ticket Modal */}
      {isLogTicketOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Dispatch Warranty Service Claim</h3>
              <button
                type="button"
                onClick={() => setIsLogTicketOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Service Issue Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Master suite acoustic sliding door seal friction misalignment"
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Assign Service Technician
                </label>
                <select
                  value={ticketTech}
                  onChange={(e) => setTicketTech(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Senior Services Technician">Senior Services Technician</option>
                  <option value="Master Joiner Specialist">Master Joiner Specialist</option>
                  <option value="Licensed Electrician / MEP">Licensed Electrician / MEP</option>
                  <option value="Waterproofing / Plumber">Waterproofing / Plumber</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Inspection Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Covered under 12-Month Fitout defect liability clause"
                  value={ticketNotes}
                  onChange={(e) => setTicketNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsLogTicketOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                >
                  Create &amp; Dispatch Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
