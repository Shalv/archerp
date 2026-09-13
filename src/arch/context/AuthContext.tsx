import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserAccount,
  AppModuleId,
  PermissionLevel,
  ModulePermissionSet,
  ModulePermissionMeta,
} from '../types';

export const APP_MODULES_META: ModulePermissionMeta[] = [
  {
    id: 'pipeline',
    name: 'Customer Pipeline',
    category: 'Intake & Conversion',
    description: 'Enquiry intake, deal stage progression, customer history, and lead conversion radar',
  },
  {
    id: 'workspace',
    name: 'Project Workspace',
    category: 'Brief & Scope Definition',
    description: 'Confirmed client brief, 8 turnkey engagement routes, project scope, and handover milestones',
  },
  {
    id: 'ai-studio',
    name: 'AI Concept Studio',
    category: 'Generative Architectural Ideation',
    description: '4-5 concept options, generative design prompts, architectural moodboards, and schematic renders',
  },
  {
    id: 'boq',
    name: 'BOQ & Commercials',
    category: 'Cost Estimation & Approvals',
    description: 'Itemized rate cards, revision control, margin safeguards, and client sign-off records',
  },
  {
    id: 'execution',
    name: 'Site Execution',
    category: 'Field & Construction Ops',
    description: 'Stage milestones, snagging punchlists, contractor assignments, and safety audit sign-offs',
  },
  {
    id: 'billing',
    name: 'Billing & Warranty',
    category: 'Finance & Handover',
    description: 'Milestone invoicing, payment tracking, warranty dispatch certificates, and defect liability',
  },
  {
    id: 'analytics',
    name: 'Data Science & Intelligence',
    category: 'Predictive Modeling & Insights',
    description: 'Win probability ML scoring, margin overrun forecasts, delay risk models, cash flow S-curves, and sensitivity simulations',
  },
  {
    id: 'masters',
    name: 'Master Data Hub',
    category: 'Enterprise Configuration',
    description: 'Trade categories, unit materials, space zone standards, vendor directory, and team rosters',
  },
];

export const PERMISSION_ROLE_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  permissions: ModulePermissionSet;
}[] = [
  {
    id: 'principal',
    name: 'Design Principal / Studio Partner (Full Access)',
    badge: 'Full Suite',
    description: 'Unrestricted administration, approvals, commercials, and enterprise master configuration rights across all modules.',
    permissions: {
      pipeline: 'full',
      workspace: 'full',
      'ai-studio': 'full',
      boq: 'full',
      execution: 'full',
      billing: 'full',
      analytics: 'full',
      masters: 'full',
    },
  },
  {
    id: 'project_director',
    name: 'Senior Project Director',
    badge: 'Ops & Delivery',
    description: 'Full management of pipeline, workspace, BOQ, and site execution. View-only access on billing and master data.',
    permissions: {
      pipeline: 'full',
      workspace: 'full',
      'ai-studio': 'full',
      boq: 'full',
      execution: 'full',
      billing: 'view_only',
      analytics: 'full',
      masters: 'view_only',
    },
  },
  {
    id: 'lead_architect',
    name: 'Lead Design Architect',
    badge: 'Design & Workspace',
    description: 'Full workspace and generative AI design studio. View-only access to commercials, pipeline, and execution.',
    permissions: {
      pipeline: 'view_only',
      workspace: 'full',
      'ai-studio': 'full',
      boq: 'view_only',
      execution: 'view_only',
      billing: 'none',
      analytics: 'view_only',
      masters: 'view_only',
    },
  },
  {
    id: 'cost_estimator',
    name: 'Quantity Surveyor / Commercial Lead',
    badge: 'Commercials',
    description: 'Full control of BOQ line items, revisions, and billing. View-only access on pipeline, workspace, and site execution.',
    permissions: {
      pipeline: 'view_only',
      workspace: 'view_only',
      'ai-studio': 'none',
      boq: 'full',
      execution: 'view_only',
      billing: 'full',
      analytics: 'full',
      masters: 'full',
    },
  },
  {
    id: 'site_engineer',
    name: 'Site Supervisor / Field Engineer',
    badge: 'Site Execution',
    description: 'Focused strictly on site execution, contractor punchlists, and snagging resolution.',
    permissions: {
      pipeline: 'none',
      workspace: 'view_only',
      'ai-studio': 'none',
      boq: 'view_only',
      execution: 'full',
      billing: 'none',
      analytics: 'view_only',
      masters: 'none',
    },
  },
  {
    id: 'client_rep',
    name: 'Client Representative / Auditor',
    badge: 'Auditor View',
    description: 'Read-only visibility into pipeline, workspace, BOQ status, and site execution milestones.',
    permissions: {
      pipeline: 'view_only',
      workspace: 'view_only',
      'ai-studio': 'view_only',
      boq: 'view_only',
      execution: 'view_only',
      billing: 'view_only',
      analytics: 'view_only',
      masters: 'none',
    },
  },
];

export const DEFAULT_FULL_PERMISSIONS: ModulePermissionSet = {
  pipeline: 'full',
  workspace: 'full',
  'ai-studio': 'full',
  boq: 'full',
  execution: 'full',
  billing: 'full',
  analytics: 'full',
  masters: 'full',
};


import { UserSession } from '../../types/erp';
interface SharedAuth { user: UserAccount; isAuthenticated: boolean; logout: () => void; getModulePermission: (id: AppModuleId) => PermissionLevel; hasPermission: (id: AppModuleId, level?: PermissionLevel) => boolean; }
const AuthContext = createContext<SharedAuth | undefined>(undefined);
export function AuthProvider({children, currentUser, onLogout}: {children: React.ReactNode; currentUser: UserSession; onLogout: () => void}) {
  const presetId = ({ADMIN: 'principal', PROJECT_MANAGER: 'project_director', ESTIMATOR: 'cost_estimator', SITE_ENGINEER: 'site_engineer', CLIENT: 'client_rep'} as Record<string,string>)[currentUser.role] || 'client_rep';
  const permissions = PERMISSION_ROLE_PRESETS.find(p => p.id === presetId)!.permissions;
  const user: UserAccount = {id: currentUser.id, fullName: currentUser.name, email: currentUser.email, phone: currentUser.phone || '', role: currentUser.roleTitle || currentUser.role, department: currentUser.department || '', studioName: 'Build Storys', permissions};
  const getModulePermission = (id: AppModuleId): PermissionLevel => permissions[id] || 'none';
  return <AuthContext.Provider value={{user, isAuthenticated:true, logout:onLogout, getModulePermission, hasPermission:(id, level='view_only') => level==='full' ? getModulePermission(id)==='full' : getModulePermission(id)!=='none'}}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if(!context) throw new Error('Missing shared ERP session'); return context; }
