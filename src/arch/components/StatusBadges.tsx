import React from 'react';
import {
  SalesStage,
  DesignStatus,
  ExecutionStatus,
  BillingStatus,
  CollectionStatus,
  WarrantyStatus,
  EngagementType,
} from '../types';

export const SalesStageBadge: React.FC<{ stage: SalesStage }> = ({ stage }) => {
  const styles: Record<SalesStage, string> = {
    'New Enquiry': 'bg-blue-50 text-blue-700 border-blue-200',
    'Site Survey': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Requirement Confirmed': 'bg-purple-50 text-purple-700 border-purple-200',
    'Concept Pitch': 'bg-amber-50 text-amber-800 border-amber-200',
    'Commercial Proposal': 'bg-orange-50 text-orange-800 border-orange-200',
    'Negotiation': 'bg-rose-50 text-rose-700 border-rose-200',
    'Won / Contract Signed': 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
    'Lost': 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles[stage] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
      {stage}
    </span>
  );
};

export const DesignStatusBadge: React.FC<{ status: DesignStatus }> = ({ status }) => {
  const styles: Record<DesignStatus, string> = {
    'Briefing': 'bg-slate-100 text-slate-700 border-slate-200',
    '4-5 Concepts Generated': 'bg-cyan-50 text-cyan-800 border-cyan-200 font-medium',
    'Internal Review': 'bg-amber-50 text-amber-800 border-amber-200',
    'Customer Review': 'bg-blue-50 text-blue-800 border-blue-200',
    'Revision Requested': 'bg-rose-50 text-rose-700 border-rose-200',
    'Concept Approved': 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
    'Detailed GFC Drawings': 'bg-teal-50 text-teal-800 border-teal-200',
    'Handover to Site': 'bg-emerald-100 text-emerald-900 border-emerald-300',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
      {status}
    </span>
  );
};

export const ExecutionStatusBadge: React.FC<{ status: ExecutionStatus }> = ({ status }) => {
  const styles: Record<ExecutionStatus, string> = {
    'Pre-construction': 'bg-slate-100 text-slate-600 border-slate-200',
    'Mobilization': 'bg-blue-50 text-blue-700 border-blue-200',
    'Civil / Structural': 'bg-amber-50 text-amber-800 border-amber-200',
    'MEP & Services': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Finishes & Joinery': 'bg-teal-50 text-teal-800 border-teal-200',
    'Snagging & Punchlist': 'bg-rose-50 text-rose-700 border-rose-200',
    'Completed & Handed Over': 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
      {status}
    </span>
  );
};

export const BillingStatusBadge: React.FC<{ status: BillingStatus }> = ({ status }) => {
  const styles: Record<BillingStatus, string> = {
    'Unbilled': 'bg-slate-100 text-slate-600 border-slate-200',
    'Milestone Invoiced': 'bg-blue-50 text-blue-700 border-blue-200',
    'Partially Paid': 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
    'Fully Invoiced': 'bg-teal-50 text-teal-800 border-teal-200',
    'Overdue': 'bg-rose-50 text-rose-800 border-rose-200 font-bold',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
      {status}
    </span>
  );
};

export const CollectionStatusBadge: React.FC<{ status: CollectionStatus }> = ({ status }) => {
  const styles: Record<CollectionStatus, string> = {
    'Pending Advance': 'bg-amber-50 text-amber-800 border-amber-200',
    'Milestone Retentions': 'bg-blue-50 text-blue-800 border-blue-200',
    'Collected': 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
    'Defect Liability Retention': 'bg-purple-50 text-purple-800 border-purple-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
      {status}
    </span>
  );
};

export const WarrantyStatusBadge: React.FC<{ status: WarrantyStatus }> = ({ status }) => {
  const styles: Record<WarrantyStatus, string> = {
    'Not Applicable': 'bg-slate-100 text-slate-500 border-slate-200',
    '12-Month Fitout Warranty Active': 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
    '5-Year Structural Warranty Active': 'bg-teal-50 text-teal-800 border-teal-200 font-semibold',
    'Service Claim Open': 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
    'Warranty Expired': 'bg-slate-100 text-slate-600 border-slate-300',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
      {status}
    </span>
  );
};

export const EngagementBadge: React.FC<{ type: EngagementType }> = ({ type }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200 font-mono">
      {type}
    </span>
  );
};
