/**
 * BuildStorys Enact360 - Role-Based Role Center Dashboard
 * Dynamically tailored to the assigned role, responsibilities, permissions, and daily duties of the active user:
 * Estimator, Project Manager, Site Engineer, Admin/Executive, Client, etc.
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
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
  Package
} from 'lucide-react';
import { UserSession, ProjectRecord, CostBudgetSummary, UserRole } from '../types/erp';

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

interface RoleTaskItem {
  id: string;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  targetTab: string;
  actionLabel: string;
  done: boolean;
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
  // Local state for completed tasks in this session
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const role = currentUser.role;

  // Role Metadata & Responsibilities Definition
  const getRoleProfile = () => {
    switch (role) {
      case 'ESTIMATOR':
        return {
          title: currentUser.roleTitle || 'Lead Quantity Surveyor & Cost Planner',
          dept: 'Pre-Construction, Estimation & Commercial',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
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
            'Copilot AI Takeoff Engine',
            'Customer Quotation Generation'
          ],
          restrictedAreas: [
            'User Master Security Administration (Admin only)',
            'Subcontractor Payment Disbursal Authorization'
          ],
          kpis: [
            { label: 'BOQ Items in Active Job', value: activeProject?.revisions[0]?.items?.length || 37, subtext: 'Verified contractual lines', trend: '+4 this rev', color: 'text-slate-900', targetTab: 'boq' },
            { label: 'Estimated Gross Margin', value: '26.8%', subtext: 'Target 25.0% (+1.8% variance)', trend: 'Healthy', color: 'text-emerald-700', targetTab: 'budget' },
            { label: 'Unverified Master Rates', value: '2 items', subtext: 'Require recent vendor quotes', trend: 'Needs review', color: 'text-amber-600', targetTab: 'masters' },
            { label: 'Copilot AI Suggestions', value: '9 pending', subtext: 'Auto-detected takeoff gaps', trend: 'AI Active', color: 'text-purple-700', targetTab: 'ai_workspace' }
          ],
          tasks: [
            { id: 'est-1', title: 'Validate Modular Kitchen Plywood Specification', description: 'Ensure 710 marine grade is priced according to master rate for line ITEM-CARP-001', priority: 'HIGH', category: 'Takeoff Quality', targetTab: 'boq', actionLabel: 'Review BOQ' },
            { id: 'est-2', title: 'Run Copilot Takeoff for Master Suite Balcony', description: 'Check spatial survey measurements vs. false ceiling grid allowances', priority: 'MEDIUM', category: 'AI Takeoff', targetTab: 'ai_workspace', actionLabel: 'Open AI' },
            { id: 'est-3', title: 'Benchmark Asian Paints Royale Luxury Rates', description: 'Update current market price per sq.ft in Master Price Library table', priority: 'MEDIUM', category: 'Rate Library', targetTab: 'masters', actionLabel: 'Update Rates' },
            { id: 'est-4', title: 'Prepare Formal Customer Proposal PDF', description: 'Generate quote revision 1.1 with milestone payment breakdown for client sign-off', priority: 'LOW', category: 'Commercial', targetTab: 'quotation', actionLabel: 'View Quote' }
          ]
        };

      case 'PROJECT_MANAGER':
        return {
          title: currentUser.roleTitle || 'Senior Project Manager & Construction Head',
          dept: 'Site Operations, Projects Delivery & Execution',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: HardHat,
          responsibilities: [
            'End-to-end Project Milestone schedule & Critical Path monitoring (SPI)',
            'Site Daily Progress Reports (DPR) review, approval & blocker resolution',
            'Subcontractor work orders, retention management & labour mobilization',
            'Client Variation Orders (VO) register & timeline impact sign-off',
            'Zero-harm HSE safety compliance & site logistics coordination'
          ],
          authorizedAreas: [
            'Site Execution & Daily DPRs (M11)',
            'Gantt Schedule & Milestones (M10)',
            'Subcontractors & Labour (M15)',
            'Variation Orders Register (M12)',
            'Cost Traceability & Billing (M16)'
          ],
          restrictedAreas: [
            'Master User Administration (Admin only)',
            'Global Price Library Override'
          ],
          kpis: [
            { label: 'Schedule Performance (SPI)', value: '1.03', subtext: '+2.0 Days ahead of contractual baseline', trend: 'Ahead', color: 'text-emerald-700', targetTab: 'schedule' },
            { label: 'Active Site Workforce', value: '24 workers', subtext: 'Across 4 trades (Carpentry, Civil, POP, Elect)', trend: 'Full crew', color: 'text-slate-900', targetTab: 'site_execution' },
            { label: 'Pending Variation Orders', value: '3 requests', subtext: '₹1,42,000 potential commercial impact', trend: 'Pending client', color: 'text-amber-600', targetTab: 'variations' },
            { label: 'Open Quality Snags', value: '8 items', subtext: '2 high severity (bedroom cove alignment)', trend: 'In rectification', color: 'text-red-600', targetTab: 'snags' }
          ],
          tasks: [
            { id: 'pm-1', title: 'Approve Today\'s Site Daily Progress Report (DPR)', description: 'Verify labour head-count (24 onsite) and delivery of 18mm marine plywood batch', priority: 'HIGH', category: 'Site Operations', targetTab: 'site_execution', actionLabel: 'Review DPR' },
            { id: 'pm-2', title: 'Process Variation Request VO-002 (Cove Lighting)', description: 'Check electrical cable rerouting and additional cost of ₹32,000 with client', priority: 'HIGH', category: 'Variations', targetTab: 'variations', actionLabel: 'View VO' },
            { id: 'pm-3', title: 'Inspect Marvel Interiors Carpentry Framework', description: 'Conduct structural framing inspection before acoustic rockwool insulation closure', priority: 'MEDIUM', category: 'Quality & Snags', targetTab: 'snags', actionLabel: 'Snag Log' },
            { id: 'pm-4', title: 'Review Subcontractor Measurement Sheet RA-02', description: 'Cross-check certified plastering area before forwarding to finance for payment', priority: 'LOW', category: 'Subcontractors', targetTab: 'contractors', actionLabel: 'View Subcontracts' }
          ]
        };

      case 'SITE_ENGINEER':
        return {
          title: currentUser.roleTitle || 'Site Execution & Quality Engineer',
          dept: 'Field Engineering & Physical Construction',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Wrench,
          responsibilities: [
            'Daily onsite labour attendance logging & work assignment tracking',
            'Material delivery Goods Receipt Note (GRN) verification & batch storage',
            'Execution as per Approved for Construction (GFC) drawings & mockups',
            'Quality defect identification, photo capture & snag rectification',
            'Toolbox safety talks, PPE compliance & site housekeeping enforcement'
          ],
          authorizedAreas: [
            'Site Execution & DPR Logs (M11)',
            'Material Delivery GRN & Palette (M05)',
            'Quality Snags & Rectifications (M19)',
            'Site Survey & Measurements (M03)'
          ],
          restrictedAreas: [
            'Company Profit Margins & Cost Markups (Confidential)',
            'Client Quotation & Pricing Negotiation',
            'Security Permissions & User Management'
          ],
          kpis: [
            { label: 'Today\'s DPR Status', value: 'Draft / In-Progress', subtext: 'Morning attendance logged; evening wrap pending', trend: 'Log today', color: 'text-amber-600', targetTab: 'site_execution' },
            { label: 'Material Inward Today', value: '3 batches', subtext: 'Marine plywood, copper wiring, gypsum channel', trend: 'Received', color: 'text-slate-900', targetTab: 'materials' },
            { label: 'Assigned Snag Rectifications', value: '5 pending', subtext: '3 closed today by drywall contractor', trend: '2 remaining', color: 'text-red-600', targetTab: 'snags' },
            { label: 'Zero-Accident Safety Days', value: '42 Days', subtext: 'Zero reportable incidents onsite', trend: 'HSE Compliant', color: 'text-emerald-700', targetTab: 'reports' }
          ],
          tasks: [
            { id: 'se-1', title: 'Complete Evening Daily Progress Report (DPR)', description: 'Log completed square footage of master bedroom ceiling framework and concrete core drilling', priority: 'HIGH', category: 'DPR Submission', targetTab: 'site_execution', actionLabel: 'Complete DPR' },
            { id: 'se-2', title: 'Verify Plywood ISI & Waterproof Stamp', description: 'Cross-verify 45 sheets of 18mm BWP plywood delivered by Sri Krishna Timber against PO-2024-001', priority: 'HIGH', category: 'Material QA', targetTab: 'materials', actionLabel: 'Verify Material' },
            { id: 'se-3', title: 'Close Rectified Snag #SNAG-04 (Switchboard Alignment)', description: 'Verify electrician has leveled switchplate in foyer and upload verification photo', priority: 'MEDIUM', category: 'Snag Rectification', targetTab: 'snags', actionLabel: 'Update Snag' },
            { id: 'se-4', title: 'Inspect Room Dimensions vs GFC Drawing Rev 2', description: 'Confirm finished tile-to-ceiling clear height in Powder Room matches 2850mm', priority: 'LOW', category: 'Survey QA', targetTab: 'survey', actionLabel: 'Check Survey' }
          ]
        };

      case 'ADMIN':
        return {
          title: currentUser.roleTitle || 'Managing Director & Principal Architect',
          dept: 'Executive Board, Architecture Studio & Corporate Governance',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: ShieldCheck,
          responsibilities: [
            'Corporate project portfolio profit margin realization & cash liquidity',
            'Full enterprise security, user creation, permissions & role center assignment',
            'Earned Value Management (EVM) CPI/SPI governance across all projects',
            'High-value client contracts, milestone billing & statutory GST compliance',
            'System integrity, audit logging & enterprise telemetry monitoring'
          ],
          authorizedAreas: [
            'All 26 Enterprise Journey Modules',
            'User Master Setup & Role Administration',
            'Executive EVM & Mandatory Management MIS Pack',
            'Cost Traceability Matrix & Cash Flow',
            'Statutory GST & Subcontractor Ledgers'
          ],
          restrictedAreas: [
            'None (Super-User Administrator Full Authority)'
          ],
          kpis: [
            { label: 'Portfolio Contract Value', value: '₹48,90,000', subtext: 'Skyline Penthouse 1402 turnkey contract', trend: 'Active baseline', color: 'text-slate-900', targetTab: 'general' },
            { label: 'Earned Value CPI', value: '1.04', subtext: 'Cost Performance Index (Cost favorable by 4%)', trend: 'Profitable', color: 'text-emerald-700', targetTab: 'reports' },
            { label: 'Operating Cash Balance', value: '+₹1,44,041', subtext: 'Collections exceed active site disbursements', trend: 'Positive', color: 'text-emerald-700', targetTab: 'reports' },
            { label: 'Configured Users & Roles', value: `${allUsers.length} Active`, subtext: 'Role-Based Access Control (RBAC) enforced', trend: 'Security OK', color: 'text-purple-700', targetTab: 'users' }
          ],
          tasks: [
            { id: 'adm-1', title: 'Review Executive Mandatory MIS Reports Pack', description: 'Examine 12 statutory and management reports: EVM, Cash Flow, WBS variance & GST reconciliation', priority: 'HIGH', category: 'Management MIS', targetTab: 'reports', actionLabel: 'Open Reports' },
            { id: 'adm-2', title: 'Authorize Milestone 2 Client Invoicing (₹2,31,062)', description: 'Civil & false ceiling framing milestone verified by PM; release formal tax invoice', priority: 'HIGH', category: 'Finance & Billing', targetTab: 'traceability', actionLabel: 'Billing Matrix' },
            { id: 'adm-3', title: 'Audit User Master Setup & Security Roles', description: 'Review permissions for newly created estimator and verify field-level cost access', priority: 'MEDIUM', category: 'Security Admin', targetTab: 'users', actionLabel: 'Manage Users' },
            { id: 'adm-4', title: 'Review Copilot AI Autonomous Suggestions', description: '9 proactive cost and procurement suggestions queued for architectural project', priority: 'LOW', category: 'AI Copilot', targetTab: 'ai_workspace', actionLabel: 'AI Workspace' }
          ]
        };

      case 'CLIENT':
      default:
        return {
          title: currentUser.roleTitle || 'Client & Project Sponsor',
          dept: 'Owner & Project Sponsor Representative',
          badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
          icon: UserCheck,
          responsibilities: [
            'Review and approve architectural 3D renders, moodboards & material palettes',
            'Authorize contractual payment milestones upon certified progress',
            'Review variation order proposals and commercial changes',
            'Conduct walk-through inspections and snag verification',
            'Receive final handover documentation, as-built drawings & OEM warranties'
          ],
          authorizedAreas: [
            'Customer Portal & Milestone Summary (M21)',
            'Approved Drawings & 3D Renders (M04)',
            'Material Palette Selection (M05)',
            'Customer Sales Quotation (Quote View)',
            'Warranty & Handover Certificates (M20)'
          ],
          restrictedAreas: [
            'Internal Contractor Purchase Orders & Subcontracts',
            'Internal Bill of Quantities (BOQ) Unit Cost Breakdowns',
            'System Configuration & Administration'
          ],
          kpis: [
            { label: 'Overall Project Progress', value: '42%', subtext: 'Civil & electrical conduit complete; ceiling in progress', trend: 'On Track', color: 'text-emerald-700', targetTab: 'portal' },
            { label: 'Total Invoiced / Paid', value: '₹1,54,041', subtext: 'Milestone 1 (Advance) fully settled', trend: 'Settled', color: 'text-slate-900', targetTab: 'portal' },
            { label: 'Upcoming Milestone 2', value: '₹2,31,062', subtext: 'Due upon completion of false ceiling framework', trend: 'Pending cert', color: 'text-amber-600', targetTab: 'portal' },
            { label: 'Design Approvals Signed', value: '4 of 4', subtext: 'Living, Kitchen, Master & Guest layouts approved', trend: '100% Signed', color: 'text-teal-700', targetTab: 'drawings' }
          ],
          tasks: [
            { id: 'cli-1', title: 'Approve Living Room TV Unit Material Sample', description: 'Review smoke-gray veneer sample and champagne gold profile handle mockups', priority: 'HIGH', category: 'Design Approval', targetTab: 'materials', actionLabel: 'View Palette' },
            { id: 'cli-2', title: 'Review Milestone 2 Progress Certification', description: 'Inspect site photographs of false ceiling framework before releasing payment', priority: 'HIGH', category: 'Milestone Invoicing', targetTab: 'portal', actionLabel: 'Customer Portal' },
            { id: 'cli-3', title: 'Sign Off on Cove Light Electrical Variation #VO-002', description: 'Review revised illumination layout with mood dimming controls', priority: 'MEDIUM', category: 'Variations', targetTab: 'variations', actionLabel: 'Review VO' },
            { id: 'cli-4', title: 'Preview OEM Warranty & DLP Certificates', description: 'Browse warranty documentation for sanitaryware, laminates, and hardware', priority: 'LOW', category: 'Handover', targetTab: 'handover', actionLabel: 'Warranty Pack' }
          ]
        };
    }
  };

  const profile = getRoleProfile();
  const IconComponent = profile.icon;

  // Quick navigation shortcuts tailored per role
  const getShortcuts = () => {
    switch (role) {
      case 'ESTIMATOR':
        return [
          { title: 'Job Planning Lines (BOQ)', desc: 'View 37 takeoff items, unit costs & trade packages', tab: 'boq', icon: Layers, badge: 'Core' },
          { title: 'Master Price Library', desc: 'Manage 300+ item master rates, suppliers & GST', tab: 'masters', icon: Calculator, badge: 'Masters' },
          { title: 'Cost Accounting & Budget', desc: 'Overhead allocation, contingencies & profit margin', tab: 'budget', icon: DollarSign, badge: 'Finance' },
          { title: 'Copilot AI Takeoff Engine', desc: 'Gemini 3.8 Flash requirements takeoff & gap review', tab: 'ai_workspace', icon: Sparkles, badge: 'AI Copilot' },
          { title: 'Cost Traceability Matrix', desc: 'BOQ Item → Budget → PO/WO → Actual Cost', tab: 'traceability', icon: Network, badge: 'Traceability' },
          { title: 'Customer Sales Quotation', desc: 'Generate customer proposal with payment milestones', tab: 'quotation', icon: FileText, badge: 'Commercial' },
          { title: 'Site Spatial Dimensions', desc: 'Room survey measurements, CAD bounds & briefs', tab: 'survey', icon: Compass, badge: 'Survey' },
          { title: 'Mandatory Reports Hub', desc: 'WBS cost variance, EVM & material consumption', tab: 'reports', icon: BarChart3, badge: '12 Reports' }
        ];

      case 'PROJECT_MANAGER':
        return [
          { title: 'Site Execution & DPRs', desc: 'Daily progress reports, labour headcounts & site logs', tab: 'site_execution', icon: HardHat, badge: 'Daily Ops' },
          { title: 'Change Orders & Variations', desc: 'Client variation register, cost & schedule impacts', tab: 'variations', icon: RefreshCw, badge: '3 Active' },
          { title: 'Subcontractors & Labour', desc: 'Work orders, trade contracts & certified bills', tab: 'contractors', icon: Users, badge: '4 Trades' },
          { title: 'Quality & Snags Matrix', desc: 'Defect registers, room tagging & photo sign-offs', tab: 'snags', icon: AlertTriangle, badge: '8 Open' },
          { title: 'Cost Traceability Matrix', desc: 'BOQ item to actual cost link & budget control', tab: 'traceability', icon: Network, badge: 'Finance' },
          { title: 'Procurement & POs', desc: 'Material requisitions, vendor POs & deliver dates', tab: 'procurement', icon: Package, badge: 'SCM' },
          { title: 'Drawings & GFC Revisions', desc: 'Approved CAD, 3D renders & revision tracking', tab: 'drawings', icon: FolderKanban, badge: 'Design' },
          { title: 'Mandatory Reports Hub', desc: 'EVM, Cash flow forecast & executive progress pack', tab: 'reports', icon: BarChart3, badge: '12 Reports' }
        ];

      case 'SITE_ENGINEER':
        return [
          { title: 'Daily Progress Report (DPR)', desc: 'Submit daily site attendance, work completed & delays', tab: 'site_execution', icon: HardHat, badge: 'Submit Today' },
          { title: 'Material Delivery & GRN', desc: 'Verify incoming materials, brand stamps & quantities', tab: 'materials', icon: Package, badge: 'Inward QA' },
          { title: 'Snag Items & Rectification', desc: 'Record defect items, tag locations & upload photos', tab: 'snags', icon: AlertTriangle, badge: 'Quality' },
          { title: 'Site Survey & Dimensions', desc: 'Verify room dimensions, floor levels & ceiling heights', tab: 'survey', icon: Compass, badge: 'Laser Check' },
          { title: 'Approved Drawings (GFC)', desc: 'Access architectural floorplans, RCPs & electrical drawings', tab: 'drawings', icon: FolderKanban, badge: 'GFC CAD' },
          { title: 'Mandatory Reports Hub', desc: 'View DPR summary, material reconciliation & safety logs', tab: 'reports', icon: BarChart3, badge: 'Reports' }
        ];

      case 'ADMIN':
        return [
          { title: 'Mandatory Reports Hub (12)', desc: 'Executive EVM, Cash flow, WBS variance & GST reconciliation', tab: 'reports', icon: BarChart3, badge: 'Executive MIS' },
          { title: 'User Master & Security Roles', desc: 'Create users, assign security roles & audit permissions', tab: 'users', icon: Shield, badge: 'RBAC Setup' },
          { title: 'Cost Traceability Matrix', desc: 'End-to-end BOQ Item → Budget → Purchase → Actual Cost', tab: 'traceability', icon: Network, badge: 'Full Trace' },
          { title: 'Job Planning Lines (BOQ)', desc: 'Baseline contractual BOQ takeoff matrix & item specs', tab: 'boq', icon: Layers, badge: 'Takeoff' },
          { title: 'Master Rates & Operations Hub', desc: 'Corporate item price list, vendors, customers & resources', tab: 'masters', icon: Calculator, badge: 'Master Data' },
          { title: 'Projects Master Register', desc: 'Portfolio job cards, client contracts & budget limits', tab: 'projects', icon: Briefcase, badge: 'Portfolio' },
          { title: 'Agentic AI Action Center', desc: 'Autonomous Copilot recommendations & anomaly approvals', tab: 'ai_workspace', icon: Sparkles, badge: 'AI Action' },
          { title: '26 Journey Modules Hub', desc: 'Explore all enterprise architectural execution modules', tab: 'modules', icon: Compass, badge: 'Full ERP' }
        ];

      case 'CLIENT':
      default:
        return [
          { title: 'Customer Project Portal', desc: 'Progress timeline, milestone billing & approval summary', tab: 'portal', icon: UserCheck, badge: 'My Home' },
          { title: '3D Renders & Drawings', desc: 'Review architectural concepts, moodboards & room renders', tab: 'drawings', icon: FolderKanban, badge: 'Designs' },
          { title: 'Material Palette & Swatches', desc: 'Browse approved laminate, veneer, tile & sanitary swatches', tab: 'materials', icon: Layers, badge: 'Finishes' },
          { title: 'Sales Quotation & Milestones', desc: 'Formal proposal document, item rates & milestone payment terms', tab: 'quotation', icon: FileText, badge: 'Quote' },
          { title: 'Handover & Warranties', desc: 'Warranty certificates, DLP terms & as-built drawings', tab: 'handover', icon: Award, badge: 'Warranty' },
          { title: 'Change Orders & Variations', desc: 'Review requested changes, finish upgrades & cost updates', tab: 'variations', icon: RefreshCw, badge: 'Changes' }
        ];
    }
  };

  const shortcuts = getShortcuts();

  return (
    <div id="role-center-dashboard" className="space-y-4 max-w-[1700px] mx-auto text-xs pb-10">
      
      {/* 1. ROLE-BASED WELCOME BANNER & IDENTITY CARD */}
      <div className="bg-gradient-to-r from-[#002050] via-[#003366] to-[#0a4b88] text-white rounded-lg shadow-md border border-[#004080] p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-blue-400/10 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner backdrop-blur-xs">
              <IconComponent className="w-7 h-7 text-yellow-300" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#89BBE9] font-semibold">
                  BuildStorys Enact360 • Role Center
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${profile.badgeColor}`}>
                  Role: {currentUser.role}
                </span>
                <span className="text-[10px] bg-white/15 text-white/90 px-2 py-0.5 rounded font-mono">
                  ID: {currentUser.id}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Welcome back, {currentUser.name}
              </h1>

              <div className="text-xs text-[#C7E0F4] mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white">{profile.title}</span>
                <span>•</span>
                <span>{profile.dept}</span>
                <span>•</span>
                <span className="text-yellow-300 font-mono">
                  Active Project: {activeProject?.projectCode} ({activeProject?.title})
                </span>
              </div>
            </div>
          </div>

          {/* User Switching / Role Profile Quick Trigger */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-lg p-2 flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-[#89BBE9] font-medium">Switch Persona</div>
                <div className="text-xs font-bold text-white truncate max-w-[140px]">{currentUser.name}</div>
              </div>

              <select
                value={currentUser.id}
                onChange={(e) => {
                  const targetUser = allUsers.find(u => u.id === e.target.value);
                  if (targetUser) onSwitchUser(targetUser);
                }}
                className="bg-[#002050] text-white text-xs border border-white/30 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-yellow-400 font-medium cursor-pointer"
                title="Switch active user to view their tailored role center"
              >
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Responsibilities Pill Summary */}
        <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[#89BBE9] flex items-center gap-1 mr-1">
            <Shield className="w-3.5 h-3.5 text-yellow-300" />
            Core Duties:
          </span>
          {profile.responsibilities.slice(0, 3).map((resp, i) => (
            <span key={i} className="text-[10px] bg-white/10 hover:bg-white/15 text-white/95 px-2 py-0.5 rounded-full border border-white/15 font-medium transition">
              {resp}
            </span>
          ))}
          {profile.responsibilities.length > 3 && (
            <span className="text-[10px] text-[#89BBE9] font-medium pl-1">
              +{profile.responsibilities.length - 3} more assigned
            </span>
          )}
        </div>
      </div>

      {/* 2. ROLE-SPECIFIC KPI CUE TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {profile.kpis.map((kpi, idx) => (
          <div
            key={idx}
            onClick={() => onNavigateTab(kpi.targetTab)}
            className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all p-3.5 cursor-pointer group hover:border-[#0078d4]/50 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#0078d4] transition">
                {kpi.label}
              </span>
              <span className="text-[10px] bg-slate-100 group-hover:bg-[#EFF6FC] text-slate-600 group-hover:text-[#0F6CBD] font-mono px-1.5 py-0.2 rounded transition">
                {kpi.trend}
              </span>
            </div>

            <div className={`text-xl font-bold mt-1.5 ${kpi.color}`}>
              {kpi.value}
            </div>

            <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
              {kpi.subtext}
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#0078d4] font-semibold">
              <span>View details</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. MAIN WORKSPACE GRID: ASSIGNED TASKS + RESPONSIBILITY MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* LEFT 2 COLUMNS: DAILY ROLE WORKFLOW & PENDING APPROVALS */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Daily Work Queue Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#EFF6FC] text-[#0F6CBD] rounded-md">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">
                    My Daily Action Queue &amp; Approvals
                  </h2>
                  <p className="text-slate-500 text-[11px]">
                    Tasks assigned to {currentUser.name} as {profile.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                  {Object.values(completedTasks).filter(Boolean).length} / {profile.tasks.length} Completed
                </span>
              </div>
            </div>

            {/* Task Items */}
            <div className="divide-y divide-slate-100">
              {profile.tasks.map((task) => {
                const isDone = !!completedTasks[task.id];
                return (
                  <div 
                    key={task.id}
                    className={`py-3 flex items-start justify-between gap-3 transition-colors ${
                      isDone ? 'opacity-60 bg-slate-50/50 -mx-4 px-4' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-[#0078d4] shrink-0 transition"
                        title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-semibold text-xs ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {task.title}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                            task.priority === 'HIGH' 
                              ? 'bg-red-100 text-red-700' 
                              : task.priority === 'MEDIUM' 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {task.category}
                          </span>
                        </div>

                        <p className="text-slate-600 text-[11px] mt-0.5">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateTab(task.targetTab)}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#EFF6FC] text-[#0F6CBD] border border-[#C7E0F4] rounded text-xs font-semibold shadow-2xs transition"
                    >
                      <span>{task.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Role Navigation Deck */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Role Quick Workspaces
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Direct access to everyday modules and functions for {currentUser.role}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                BuildStorys Enact360
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {shortcuts.map((sc, idx) => {
                const ScIcon = sc.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onNavigateTab(sc.tab)}
                    className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-[#0078d4] hover:shadow-xs transition-all text-left group"
                  >
                    <div className="p-2 bg-white rounded-md border border-slate-200 group-hover:border-[#0078d4]/40 group-hover:text-[#0078d4] text-slate-700 shadow-2xs shrink-0">
                      <ScIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 group-hover:text-[#0078d4] text-xs transition">
                          {sc.title}
                        </span>
                        <span className="text-[9px] bg-slate-200/60 text-slate-700 font-mono px-1.5 py-0.2 rounded font-bold">
                          {sc.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {sc.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RESPONSIBILITY MATRIX & ACCESS BOUNDS */}
        <div className="space-y-4">
          
          {/* Assigned Responsibilities Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2 border-b pb-2.5">
              <div className="p-1.5 bg-purple-50 text-purple-700 rounded-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs">
                  Role Authority &amp; Responsibilities
                </h3>
                <p className="text-slate-500 text-[10px]">
                  Enforced by Enact360 Security Engine
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Primary Responsibilities
              </div>
              <ul className="space-y-1.5">
                {profile.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 text-[11px] leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Authorized Workspaces</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {profile.authorizedAreas.map((auth, i) => (
                  <span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                    {auth}
                  </span>
                ))}
              </div>
            </div>

            {profile.restrictedAreas && profile.restrictedAreas.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Access Boundary Guards</span>
                </div>
                <div className="space-y-1">
                  {profile.restrictedAreas.map((rest, i) => (
                    <div key={i} className="text-[10px] text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      <span>{rest}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Job Card Quick Summary */}
          {activeProject && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0F6CBD]" />
                  <span className="font-bold text-slate-900 text-xs">
                    Current Assigned Job
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold text-[#0F6CBD] bg-[#EFF6FC] px-1.5 py-0.5 rounded">
                  {activeProject.projectCode}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs">{activeProject.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{activeProject.clientName} • {activeProject.siteAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Contract Value</div>
                  <div className="font-bold text-slate-800">₹{(activeProject.estimatedBudget || 4890000).toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Active Revision</div>
                  <div className="font-bold text-slate-800 font-mono">{activeProject.activeRevisionId || 'REV-01'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onNavigateTab('general')}
                  className="flex-1 py-1.5 bg-[#0078d4] hover:bg-[#0060aa] text-white rounded font-semibold text-xs transition text-center shadow-2xs"
                >
                  Open Job Card
                </button>
                <button
                  onClick={() => onNavigateTab('projects')}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold text-xs transition"
                  title="Switch or register new job"
                >
                  All Jobs
                </button>
              </div>
            </div>
          )}

          {/* Copilot AI Assistant Prompt */}
          {onOpenAIWorkspace && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 rounded-lg border border-purple-200 shadow-xs p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                <span>Enact360 Copilot Assistant</span>
              </div>
              <p className="text-purple-800 text-[11px] leading-relaxed">
                Copilot is active for your role ({currentUser.role}). It continuously audits takeoff quantities, unit rates, and variation orders in real time.
              </p>
              <button
                onClick={onOpenAIWorkspace}
                className="w-full py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Open Agentic AI Workspace</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
