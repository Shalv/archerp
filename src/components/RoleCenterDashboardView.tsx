/**
 * Build Storys ERP - Executive Role Center Dashboard
 * Handcrafted architectural UI for project leaders, quantity surveyors, and site engineers.
 */

import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Calculator, 
  HardHat, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Layers, 
  Compass, 
  Calendar, 
  ArrowRight, 
  Users, 
  Award, 
  CheckSquare, 
  Square, 
  BarChart3, 
  FileSpreadsheet, 
  Network, 
  Briefcase, 
  ChevronRight, 
  ExternalLink,
  Shield,
  Eye,
  Lock,
  RefreshCw,
  FolderKanban,
  Wrench,
  Package,
  Check,
  AlertCircle,
  Clock4,
  Cpu,
  Image as ImageIcon
} from 'lucide-react';
import { UserSession, ProjectRecord, CostBudgetSummary, UserRole } from '../types/erp';
import { isImageAvatar, getUserInitials } from '../utils/avatarUtils';

interface RoleCenterDashboardViewProps {
  currentUser: UserSession;
  allUsers: UserSession[];
  onSwitchUser: (user: UserSession) => void;
  activeProject: ProjectRecord | null;
  projects: ProjectRecord[];
  onSelectProject: (projectId: string) => void;
  budgetSummary: CostBudgetSummary | null;
  onNavigateTab: (tab: string) => void;
  onOpenAIWorkspace?: () => void;
}

export const RoleCenterDashboardView: React.FC<RoleCenterDashboardViewProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  activeProject,
  projects,
  onSelectProject,
  budgetSummary,
  onNavigateTab,
  onOpenAIWorkspace
}) => {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [activeTabRole, setActiveTabRole] = useState<UserRole>(currentUser.role || 'ADMIN');
  const [approvedItems, setApprovedItems] = useState<Record<string, boolean>>({});
  const [showAllDuties, setShowAllDuties] = useState(false);

  React.useEffect(() => {
    if (currentUser.role) {
      setActiveTabRole(currentUser.role);
    }
  }, [currentUser.role]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const toggleApproval = (id: string) => {
    setApprovedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleRolePillClick = (targetRole: UserRole) => {
    setActiveTabRole(targetRole);
    const matchingUser = allUsers.find(u => u.role === targetRole);
    if (matchingUser) {
      onSwitchUser(matchingUser);
    }
  };

  const role = activeTabRole;

  const getRoleProfile = () => {
    switch (role) {
      case 'ESTIMATOR':
        return {
          roleKey: 'ESTIMATOR' as UserRole,
          title: 'Lead Quantity Surveyor & Commercial Head',
          dept: 'Pre-Construction & Cost Engineering',
          icon: Calculator,
          responsibilities: [
            'BOQ Quantity Takeoffs & Architectural Measurement verification',
            'Vendor Rate Analysis & Master Price Library benchmarking',
            'Direct Cost budgeting, Material Wastage allowances & Trade markup',
            'Contractual Baseline freezing & Value Engineering proposals',
            'Subcontractor item price comparison & variation estimation'
          ],
          authorizedAreas: [
            'Job Planning Lines (BOQ Studio)',
            'Master Price List & Rate Library',
            'Cost Budgeting & Markup Analysis',
            'Automated Takeoff Engine',
            'Customer Quotation Generation'
          ],
          restrictedAreas: [
            'User Security & RBAC Configuration',
            'Legal Entity Multi-State GST Setup',
            'Company Financial Account Ledgers'
          ],
          kpis: [
            { label: 'Contractual BOQ Lines', value: '37 Items', subtext: 'Rev 3 Baseline frozen', trend: '+4 new items', color: 'text-slate-900', targetTab: 'boq' },
            { label: 'Direct Cost Budget', value: '₹34.90L', subtext: 'Within 2.1% target band', trend: 'Nominal', color: 'text-emerald-700', targetTab: 'budget' },
            { label: 'Target Margin', value: '26.4%', subtext: 'Gross project profit', trend: '+1.4% VE gain', color: 'text-emerald-700', targetTab: 'budget' },
            { label: 'Master Rates Mapped', value: '100%', subtext: 'Price schedule linked', trend: 'Verified', color: 'text-slate-900', targetTab: 'masters' }
          ],
          tasks: [
            { id: 'est-1', title: 'Freeze Baseline Revision 3', description: 'Lock contractual rates for Civil, Joinery, and HVAC trades with client approval.', priority: 'HIGH', category: 'Commercials', actionLabel: 'Open BOQ', targetTab: 'boq' },
            { id: 'est-2', title: 'Verify False Ceiling Measurement Takeoff', description: 'Compare laser survey room perimeter (450 sq.ft) with gypsum board line items.', priority: 'MEDIUM', category: 'Estimation', actionLabel: 'Survey Sheet', targetTab: 'survey' },
            { id: 'est-3', title: 'Price Variation Request VO-002', description: 'Quote client upgrade for concealed warm-white architectural LED cove profiles.', priority: 'MEDIUM', category: 'Variations', actionLabel: 'Price Variation', targetTab: 'variations' }
          ]
        };

      case 'PROJECT_MANAGER':
        return {
          roleKey: 'PROJECT_MANAGER' as UserRole,
          title: 'Senior Project Manager & Construction Head',
          dept: 'Site Operations & Delivery',
          icon: HardHat,
          responsibilities: [
            'Master Schedule baseline execution & milestone critical-path tracking',
            'Subcontractor work authorization & measurement verification',
            'Procurement cycle coordination & material inward scheduling',
            'Daily Progress Report verification & delay remediation',
            'Site safety standards enforcement & compliance certification'
          ],
          authorizedAreas: [
            'Daily Progress Reports (DPR)',
            'Procurement & Purchase Orders',
            'Subcontractor Measurement Book',
            'Timesheets & Resource Deployment',
            'Quality Snags & Rectifications'
          ],
          restrictedAreas: [
            'Company Setup & Bank Accounts',
            'Master Rate Margin Configuration'
          ],
          kpis: [
            { label: 'Schedule Performance (SPI)', value: '1.04', subtext: '2 days ahead of master plan', trend: 'Ahead', color: 'text-emerald-700', targetTab: 'reports' },
            { label: 'Onsite Trade Workforce', value: '24 Hands', subtext: 'Full trade mobilization', trend: 'Active', color: 'text-slate-900', targetTab: 'resources' },
            { label: 'Open Quality Snags', value: '2 Minor', subtext: '3 closed this week', trend: 'Low Risk', color: 'text-amber-700', targetTab: 'snags' },
            { label: 'Approved Purchase Orders', value: '₹14.85L', subtext: '12 material batches inward', trend: 'On Track', color: 'text-slate-900', targetTab: 'procurement' }
          ],
          tasks: [
            { id: 'pm-1', title: 'Approve Subcontractor RA Bill 4', description: 'Marvel Interiors carpentry progress measurement verification for living room panelling.', priority: 'HIGH', category: 'Subcontractors', actionLabel: 'Review MB', targetTab: 'contractors' },
            { id: 'pm-2', title: 'Review Daily Progress Log', description: 'Verify cement screed curing and conduit inspection sign-offs.', priority: 'HIGH', category: 'Operations', actionLabel: 'Open DPR', targetTab: 'site_execution' },
            { id: 'pm-3', title: 'Authorize Plywood Delivery Batch', description: 'CenturyPly 710 marine batch inward inspection with quality stamp.', priority: 'MEDIUM', category: 'Procurement', actionLabel: 'View PO', targetTab: 'procurement' }
          ]
        };

      case 'SITE_ENGINEER':
        return {
          roleKey: 'SITE_ENGINEER' as UserRole,
          title: 'Resident Site Engineer & Quality Auditor',
          dept: 'Site Execution & Field Quality',
          icon: Wrench,
          responsibilities: [
            'Daily Progress Report (DPR) preparation, site attendance & trade counts',
            'Inward material inspection against GFC specifications & delivery challans',
            'Onsite dimensional verification against approved architectural plans',
            'Snag identification, photographic logging & rectification oversight',
            'Toolbox safety meetings & site hazard reporting'
          ],
          authorizedAreas: [
            'Daily Progress Reports (DPR)',
            'Material Goods Receipts (GRN)',
            'Snag Resolution Matrix',
            'Site Survey Dimensions',
            'Approved CAD Drawings (GFC)'
          ],
          restrictedAreas: [
            'Contract Value & Client Quotations',
            'Company Financial Ledgers',
            'User Security Roles'
          ],
          kpis: [
            { label: "Today's DPR Status", value: 'Logged', subtext: 'Day shift attendance verified', trend: 'Complete', color: 'text-emerald-700', targetTab: 'site_execution' },
            { label: 'Labour Present', value: '24 Men', subtext: '4 trade squads active', trend: '100% Present', color: 'text-slate-900', targetTab: 'resources' },
            { label: 'Material GRNs Recorded', value: '3 Batches', subtext: 'Cement, Plywood & Conduit', trend: 'Passed QA', color: 'text-slate-900', targetTab: 'inventory' },
            { label: 'Safety Incidents', value: '0 Zero', subtext: '100% PPE adherence', trend: 'Safe', color: 'text-emerald-700', targetTab: 'compliance' }
          ],
          tasks: [
            { id: 'se-1', title: 'Log Evening DPR Progress & Photos', description: 'Record completed gypsum grid framing and upload site photographs.', priority: 'HIGH', category: 'DPR', actionLabel: 'Open DPR', targetTab: 'site_execution' },
            { id: 'se-2', title: 'Inspect CenturyPly Marine Plywood Delivery', description: 'Confirm 45 sheets delivered, measure 19mm caliper thickness and moisture content.', priority: 'HIGH', category: 'Materials', actionLabel: 'Material GRN', targetTab: 'materials' },
            { id: 'se-3', title: 'Close Rectified Snags in Foyer', description: 'Re-inspect alignment of switchboards and spirit-level vertical plumb.', priority: 'MEDIUM', category: 'Quality', actionLabel: 'Snag Matrix', targetTab: 'snags' }
          ]
        };

      case 'CLIENT':
        return {
          roleKey: 'CLIENT' as UserRole,
          title: 'Project Sponsor & Property Owner',
          dept: 'Client Ownership & Approvals',
          icon: UserCheck,
          responsibilities: [
            'Review architectural floor plans, spatial concepts & 3D renders',
            'Approve material finishes, veneer swatches, and sanitary fittings',
            'Authorize contractual variations and finish enhancements',
            'Track milestone completion and verify payment schedule certificates',
            'Review pre-handover snag rectifications and final sign-off'
          ],
          authorizedAreas: [
            'Customer Project Portal',
            'Architectural 3D Renders',
            'Material Palette & Swatches',
            'Customer Sales Quotation',
            'Warranty & Handover Pack'
          ],
          restrictedAreas: [
            'Internal Direct Cost Budgets',
            'Subcontractor Trade Markups',
            'Company Financial Ledgers',
            'Internal Administrative Controls'
          ],
          kpis: [
            { label: 'Overall Completion', value: '62%', subtext: 'Milestone 2 In Progress', trend: 'On Schedule', color: 'text-slate-900', targetTab: 'portal' },
            { label: 'Approved Concepts', value: '4 Spaces', subtext: 'Living, Bed, Kitchen & Bath', trend: 'Signed', color: 'text-slate-900', targetTab: 'drawings' },
            { label: 'Milestones Paid', value: '₹1.54L', subtext: 'Milestone 1 Advance Cleared', trend: 'Paid', color: 'text-emerald-700', targetTab: 'quotation' },
            { label: 'Target Handover', value: 'Nov 2026', subtext: 'Turnkey keys handover', trend: 'Fixed', color: 'text-slate-900', targetTab: 'portal' }
          ],
          tasks: [
            { id: 'cl-1', title: 'Review Living Room 3D Spatial Render', description: 'Nordic minimalist design palette with warm natural travertine and smoked oak.', priority: 'HIGH', category: 'Design', actionLabel: 'View 3D', targetTab: 'drawings' },
            { id: 'cl-2', title: 'Select Wardrobe Accent Veneer', description: 'Review sample physical swatches: Natural Teak vs Champagne Ash.', priority: 'MEDIUM', category: 'Finishes', actionLabel: 'Material Swatches', targetTab: 'materials' },
            { id: 'cl-3', title: 'Review Milestone 2 Progress Certificate', description: 'Framing, electrical rough-in and false ceiling inspection report.', priority: 'MEDIUM', category: 'Milestones', actionLabel: 'View Milestones', targetTab: 'quotation' }
          ]
        };

      case 'ADMIN':
      default:
        return {
          roleKey: 'ADMIN' as UserRole,
          title: 'Managing Director & Principal Architect',
          dept: 'Executive Direction & Practice Leadership',
          icon: ShieldCheck,
          responsibilities: [
            'Overall practice governance, portfolio health & client contracts',
            'Financial solvency, gross margin defense & multi-state GST compliance',
            'Executive approval of baseline BOQ freezes & major variation orders',
            'Role-based access control, security policies & corporate audit trails',
            'High-level resource deployment & strategic subcontractor procurement'
          ],
          authorizedAreas: [
            'All Enterprise Modules',
            'Mandatory Reports Hub',
            'Company Setup & Finance',
            'User Master & Security Roles',
            'Cost Traceability Matrix'
          ],
          restrictedAreas: [],
          kpis: [
            { label: 'Turnkey Contract Value', value: '₹48.90L', subtext: 'Baseline Rev 3 Frozen', trend: '+₹1.42L Variations', color: 'text-slate-900', targetTab: 'quotation' },
            { label: 'Practice Direct Cost', value: '₹34.90L', subtext: 'Total estimated budget', trend: '26.4% Margin', color: 'text-emerald-700', targetTab: 'budget' },
            { label: 'Cost Performance (CPI)', value: '0.98', subtext: 'Within 2% target tolerance', trend: 'Nominal', color: 'text-slate-900', targetTab: 'reports' },
            { label: 'Schedule Performance (SPI)', value: '1.04', subtext: '4% ahead of project baseline', trend: 'Optimal', color: 'text-emerald-700', targetTab: 'reports' }
          ],
          tasks: [
            { id: 'adm-1', title: 'Authorize Milestone 2 Billing Certificate', description: 'Verify ₹2,31,062 tax invoice generated following civil framing milestone sign-off.', priority: 'HIGH', category: 'Billing', actionLabel: 'Review Invoice', targetTab: 'quotation' },
            { id: 'adm-2', title: 'Freeze Baseline Revision 3 in BOQ Studio', description: 'Lock 37 item planning lines for DLF Skyline Penthouse 1402.', priority: 'HIGH', category: 'Estimating', actionLabel: 'Open BOQ', targetTab: 'boq' },
            { id: 'adm-3', title: 'Audit Purchase Requisition PO-2024-001', description: 'CenturyPly 710 marine batch order ₹1,85,000 against baseline wastage allowance.', priority: 'MEDIUM', category: 'Procurement', actionLabel: 'Review PO', targetTab: 'procurement' }
          ]
        };
    }
  };

  const profile = getRoleProfile();
  const IconComponent = profile.icon;

  const ROLES_LIST: { role: UserRole; label: string; icon: any; desc: string }[] = [
    { role: 'ADMIN', label: 'Executive Director', icon: ShieldCheck, desc: 'Practice Overview, Financials & RBAC' },
    { role: 'ESTIMATOR', label: 'Lead Quantity Surveyor', icon: Calculator, desc: 'BOQ Takeoffs, Rates & Commercials' },
    { role: 'PROJECT_MANAGER', label: 'Senior Project Manager', icon: HardHat, desc: 'Site Operations, Schedule & Crews' },
    { role: 'SITE_ENGINEER', label: 'Site Engineer', icon: Wrench, desc: 'Daily Progress, Inspections & Snags' },
    { role: 'CLIENT', label: 'Client / Owner', icon: UserCheck, desc: 'Approvals, 3D Renders & Milestones' }
  ];

  const getShortcuts = () => {
    switch (role) {
      case 'ESTIMATOR':
        return [
          { title: 'BOQ Planning Lines Studio', desc: 'Quantity takeoff items, trade specs & base rates', tab: 'boq', icon: Layers },
          { title: 'Master Schedule of Rates', desc: 'Enterprise rate analysis library & vendor pricing', tab: 'masters', icon: Calculator },
          { title: 'Commercial Budget Engine', desc: 'Direct costs, wastage, contingency & trade margins', tab: 'budget', icon: DollarSign },
          { title: 'Cost Traceability Matrix', desc: 'Trace item specs through budget to purchase & actuals', tab: 'traceability', icon: Network },
          { title: 'Customer Sales Quotation', desc: 'Formal proposal document & milestone schedules', tab: 'quotation', icon: FileText },
          { title: 'Automated Takeoff Engine', desc: 'Room measurement analysis & gap detection', tab: 'ai_workspace', icon: Cpu }
        ];

      case 'PROJECT_MANAGER':
        return [
          { title: 'Project Management Hub', desc: 'Milestone critical path, EVM & progress curve', tab: 'project_hub', icon: FolderKanban },
          { title: 'Resource Deployment Matrix', desc: 'Trade squads, daily shifts & machinery allocation', tab: 'resources', icon: Users },
          { title: 'Subcontractor Measurement Book', desc: 'Work certification, MB ledger & retention release', tab: 'contractors', icon: FileSpreadsheet },
          { title: 'Procurement & Purchase Orders', tab: 'procurement', desc: 'Vendor RFQs, purchase orders & material inward', icon: Package },
          { title: 'Daily Progress Reports (DPR)', tab: 'site_execution', desc: 'Daily site logs, labour counts & delays', icon: HardHat },
          { title: 'Quality Snags & Rectifications', tab: 'snags', desc: 'Defect logging, priority tagging & contractor sign-off', icon: AlertTriangle }
        ];

      case 'SITE_ENGINEER':
        return [
          { title: 'Daily Progress Report (DPR)', desc: 'Submit daily site attendance, work completed & delays', tab: 'site_execution', icon: HardHat },
          { title: 'Material Goods Receipt (GRN)', desc: 'Verify incoming materials, brand stamps & quantities', tab: 'inventory', icon: Package },
          { title: 'Snags & Quality Matrix', desc: 'Record defect items, tag locations & photographic proof', tab: 'snags', icon: AlertTriangle },
          { title: 'Site Laser Measurements', desc: 'Verify room dimensions, floor levels & ceiling heights', tab: 'survey', icon: Compass },
          { title: 'Approved Architectural Drawings', desc: 'Access architectural floorplans, RCPs & electrical plans', tab: 'drawings', icon: FolderKanban },
          { title: 'Site Compliance & Safety NOC', desc: 'Permits, fire safety & society NOC logs', tab: 'compliance', icon: Shield }
        ];

      case 'CLIENT':
        return [
          { title: 'Customer Project Portal', desc: 'Progress timeline, milestone billing & approval summary', tab: 'portal', icon: UserCheck },
          { title: '3D Renders & Concepts', desc: 'Review architectural concepts, moodboards & room renders', tab: 'drawings', icon: FolderKanban },
          { title: 'Material Palette & Swatches', desc: 'Browse approved laminate, veneer, tile & sanitary swatches', tab: 'materials', icon: Layers },
          { title: 'Sales Quotation & Milestones', desc: 'Formal proposal document, item rates & payment terms', tab: 'quotation', icon: FileText },
          { title: 'Handover & Warranties', desc: 'Warranty certificates, DLP terms & as-built drawings', tab: 'handover', icon: Award },
          { title: 'Change Orders & Variations', desc: 'Review requested changes, finish upgrades & cost updates', tab: 'variations', icon: RefreshCw }
        ];

      case 'ADMIN':
      default:
        return [
          { title: 'Executive Management Reports', desc: 'EVM analysis, Cash flow, WBS variance & GST reconciliation', tab: 'reports', icon: BarChart3 },
          { title: 'User Administration & Security', desc: 'Create users, assign security roles & audit permissions', tab: 'users', icon: Shield },
          { title: 'Cost Traceability Matrix', desc: 'End-to-end BOQ Item → Budget → Purchase → Actual Cost', tab: 'traceability', icon: Network },
          { title: 'BOQ Planning Lines Studio', desc: 'Baseline contractual BOQ takeoff matrix & item specs', tab: 'boq', icon: Layers },
          { title: 'Master Price Library', desc: 'Corporate item price list, vendors, customers & resources', tab: 'masters', icon: Calculator },
          { title: 'Project Master Register', desc: 'Portfolio job cards, client contracts & budget limits', tab: 'projects', icon: Briefcase },
          { title: 'Specification & Takeoff Engine', desc: 'Room measurement analysis & discrepancy resolution', tab: 'ai_workspace', icon: Cpu },
          { title: 'End-to-End Journey Modules', desc: 'Explore all 26 architectural execution modules', tab: 'modules', icon: Compass }
        ];
    }
  };

  const shortcuts = getShortcuts();

  const JOURNEY_STAGES = [
    { number: '01', title: 'Discovery & Brief', tab: 'crm', status: 'Completed', detail: 'Requirements & Site Survey' },
    { number: '02', title: 'Spatial CAD & Vastu', tab: 'survey', status: 'Completed', detail: 'Floor Plans & GFC Sets' },
    { number: '03', title: 'BOQ Takeoff & Costing', tab: 'boq', status: 'In Progress', detail: 'Baseline Rev 3 Frozen' },
    { number: '04', title: 'Site Operations & DPR', tab: 'site_execution', status: 'In Progress', detail: 'Day Shift · 24 Hands' },
    { number: '05', title: 'Handover & Warranty', tab: 'handover', status: 'Scheduled', detail: 'Nov 2026 Target' }
  ];

  return (
    <div id="role-center-dashboard" className="space-y-6 max-w-[1720px] mx-auto p-4 sm:p-6 text-slate-800 animate-in fade-in duration-150">
      
      {/* 1. ARCHITECTURAL PROJECT MASTHEAD */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Identity & Current Project */}
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-semibold text-slate-900 tracking-wide uppercase text-[11px]">
                Build Storys Architectural Practice
              </span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Project Overview</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 font-display">
                {activeProject?.title || 'Skyline Penthouse 1402'}
              </h1>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                {activeProject?.projectCode || 'PROJ-SKYLINE-1402'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
              <span>Client: <strong className="text-slate-900 font-medium">{activeProject?.clientName || 'Vikramaditya Singhania'}</strong></span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Location: {activeProject?.siteAddress || 'Golf Course Road, Gurugram'}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Typology: {activeProject?.projectType || 'Residential Turnkey'}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Built-Up: <strong className="font-mono tabular-nums text-slate-900">{activeProject?.carpetAreaSqFt || '4,850'} sq.ft</strong></span>
            </div>
          </div>

          {/* Quick Switchers */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
            {/* Active Project Switcher */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs flex items-center gap-2.5 min-w-[220px]">
              <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Active Project
                </div>
                <select
                  value={activeProject?.id}
                  onChange={(e) => onSelectProject(e.target.value)}
                  className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer truncate block w-full text-xs"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.projectCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active User Switcher */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs flex items-center gap-2.5 min-w-[190px]">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 overflow-hidden">
                {isImageAvatar(currentUser.avatar) ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{getUserInitials(currentUser.name, currentUser.avatar)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Logged In As
                </div>
                <select
                  value={currentUser.id}
                  onChange={(e) => {
                    const found = allUsers.find(u => u.id === e.target.value);
                    if (found) onSwitchUser(found);
                  }}
                  className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer truncate block w-full text-xs"
                >
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tactile Role Perspective Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 shrink-0">
            <span>Role Perspective:</span>
          </div>

          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 border border-slate-200/80 overflow-x-auto scrollbar-none">
            {ROLES_LIST.map((r) => {
              const RIcon = r.icon;
              const isSelected = activeTabRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleRolePillClick(r.role)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition cursor-pointer select-none whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-white text-slate-950 font-semibold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                  title={r.desc}
                >
                  <RIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE PERFORMANCE INDICATORS (8 Tabular Metric Cards) */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs hover:border-slate-300 transition">
            <span className="text-[11px] font-medium text-slate-500 block truncate">Contract Value</span>
            <div className="text-base sm:text-lg font-bold text-slate-950 font-mono tabular-nums mt-1">
              ₹48.90L
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block truncate">Rev 3 Baseline</span>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs hover:border-slate-300 transition">
            <span className="text-[11px] font-medium text-slate-500 block truncate">Direct Budget</span>
            <div className="text-base sm:text-lg font-bold text-slate-950 font-mono tabular-nums mt-1">
              ₹34.90L
            </div>
            <span className="text-[11px] text-emerald-700 mt-0.5 block truncate">Within budget</span>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs hover:border-slate-300 transition">
            <span className="text-[11px] font-medium text-slate-500 block truncate">Gross Margin</span>
            <div className="text-base sm:text-lg font-bold text-emerald-700 font-mono tabular-nums mt-1">
              26.4%
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block truncate">Target 25.0%</span>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs hover:border-slate-300 transition">
            <span className="text-[11px] font-medium text-slate-500 block truncate">Rate / Sq.Ft</span>
            <div className="text-base sm:text-lg font-bold text-slate-950 font-mono tabular-nums mt-1">
              ₹1,008
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block truncate">4,850 sq.ft</span>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs hover:border-slate-300 transition">
            <span className="text-[11px] font-medium text-slate-500 block truncate">Schedule (SPI)</span>
            <div className="text-base sm:text-lg font-bold text-emerald-700 font-mono tabular-nums mt-1">
              1.04
            </div>
            <span className="text-[11px] text-emerald-700 mt-0.5 block truncate">On track</span>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs hover:border-slate-300 transition">
            <span className="text-[11px] font-medium text-slate-500 block truncate">Cost (CPI)</span>
            <div className="text-base sm:text-lg font-bold text-slate-950 font-mono tabular-nums mt-1">
              0.98
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block truncate">Balanced</span>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs hover:border-slate-300 transition">
            <span className="text-[11px] font-medium text-slate-500 block truncate">Daily Log (DPR)</span>
            <div className="text-base sm:text-lg font-bold text-slate-950 mt-1">
              Verified
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block truncate">24 workers</span>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs hover:border-slate-300 transition">
            <span className="text-[11px] font-medium text-slate-500 block truncate">Quality Snags</span>
            <div className="text-base sm:text-lg font-bold text-amber-700 font-mono tabular-nums mt-1">
              2 Minor
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block truncate">3 rectified</span>
          </div>
        </div>
      </section>

      {/* 3. ARCHITECTURAL EXECUTION LIFECYCLE BLUEPRINT */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-950">
              Project Delivery Lifecycle
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Five architectural stages from client brief through site commissioning
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('modules')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1 transition"
          >
            <span>Explore All 26 Modules</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {JOURNEY_STAGES.map((stg) => (
            <div
              key={stg.number}
              onClick={() => onNavigateTab(stg.tab)}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-400 font-bold">
                    {stg.number}
                  </span>
                  <span className={`text-[10px] font-medium ${
                    stg.status === 'Completed' ? 'text-emerald-700' :
                    stg.status === 'In Progress' ? 'text-blue-700 font-semibold' : 'text-slate-400'
                  }`}>
                    {stg.status}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 text-xs mt-2 group-hover:text-blue-600 transition">
                  {stg.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {stg.detail}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600 group-hover:text-slate-950 font-medium">
                <span>Open Phase</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MAIN WORK CENTER (Two-Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Action Queue & Approvals */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Executive Authorizations & Approvals Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-950">
                  Project Authorizations &amp; Sign-Offs
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                3 Pending Review
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 text-xs">
                    PO-2024-001 · CenturyPly 710 Marine Batch (45 sheets)
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Amount: <strong className="font-mono tabular-nums text-slate-800">₹1,85,000</strong> · Vendor: Marvel Woods Pvt Ltd · Within baseline allowance
                  </div>
                </div>
                <button
                  onClick={() => toggleApproval('po1')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer shrink-0 ${
                    approvedItems['po1']
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                  }`}
                >
                  {approvedItems['po1'] ? 'Authorized ✓' : 'Authorize Order'}
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 text-xs">
                    Variation VO-002 · Concealed Warm Architectural LED Profiles
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Amount: <strong className="font-mono tabular-nums text-slate-800">₹32,000</strong> · Client approved upgrade · Pending formal freeze
                  </div>
                </div>
                <button
                  onClick={() => toggleApproval('vo2')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer shrink-0 ${
                    approvedItems['vo2']
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                  }`}
                >
                  {approvedItems['vo2'] ? 'Signed ✓' : 'Sign Off'}
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 text-xs">
                    Milestone 2 RA Invoice · Civil Framing &amp; False Ceiling Complete
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Amount: <strong className="font-mono tabular-nums text-slate-800">₹2,31,062</strong> · GST Included · Subcontractor sign-off verified
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('quotation')}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-md text-xs font-semibold transition cursor-pointer shrink-0 shadow-2xs"
                >
                  Review Invoice
                </button>
              </div>
            </div>
          </div>

          {/* Daily Operational Queue with Real Checkboxes */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-slate-700" />
                <div>
                  <h2 className="text-sm font-bold text-slate-950">
                    Daily Operational Queue
                  </h2>
                  <p className="text-xs text-slate-500">
                    Priority tasks for {profile.title}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded font-semibold">
                {Object.values(completedTasks).filter(Boolean).length} of {profile.tasks.length} Done
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {profile.tasks.map((task) => {
                const isDone = !!completedTasks[task.id];
                return (
                  <div
                    key={task.id}
                    className={`py-3 flex items-start justify-between gap-4 transition ${
                      isDone ? 'opacity-50' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-slate-900 transition cursor-pointer shrink-0"
                        title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {task.title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Priority: {task.priority}
                          </span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-[11px] text-slate-500">
                            {task.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateTab(task.targetTab)}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition cursor-pointer"
                    >
                      <span>{task.actionLabel}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role Direct Workspaces */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-950">
                Architectural Workspaces
              </h2>
              <p className="text-xs text-slate-500">
                Direct access to daily tools and registered data views
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shortcuts.map((sc, idx) => {
                const ScIcon = sc.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onNavigateTab(sc.tab)}
                    className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-xs transition text-left cursor-pointer group"
                  >
                    <div className="p-2 rounded bg-white border border-slate-200 text-slate-700 group-hover:text-slate-950 shrink-0 transition">
                      <ScIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-slate-900 group-hover:text-blue-600 text-xs transition block truncate">
                        {sc.title}
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {sc.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Authority Scope & Activity Stream */}
        <div className="space-y-6">
          
          {/* Practice Authority Scope */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield className="w-4 h-4 text-slate-700" />
              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Role Authority &amp; Scope
                </h2>
                <p className="text-xs text-slate-500">
                  {profile.title}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Primary Responsibilities
              </span>
              <ul className="space-y-2">
                {profile.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Authorized Domains
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.authorizedAreas.map((area, idx) => (
                  <span key={idx} className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200/80 font-medium">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Project Traceability & Audit Stream */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-950">
                  Recent Project Activity
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Live Audit
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900">
                    Baseline Revision 3 Frozen
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Estimator approved 37 item planning lines for contractual execution.
                  </div>
                  <div className="text-slate-400 text-[10px] mt-1 font-mono">
                    Today · 10:45 AM by Vikramaditya Singhania
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900">
                    Daily Progress Report Logged
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    24 workers present. False ceiling framing inspection sign-off verified.
                  </div>
                  <div className="text-slate-400 text-[10px] mt-1 font-mono">
                    Today · 08:30 AM by Rajesh Kumar (Site Eng.)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 mt-1 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900">
                    Material Inward Challan Verified
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    CenturyPly Marine 710 batch received and catalogued under GRN-2024-001.
                  </div>
                  <div className="text-slate-400 text-[10px] mt-1 font-mono">
                    Yesterday · 04:15 PM by Amit Sharma (Store)
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
