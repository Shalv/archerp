/**
 * BuildStorys - Role-Based Role Center Dashboard
 * Dynamically tailored to the assigned role, responsibilities, permissions, and daily duties of the active user:
 * - ADMIN / EXECUTIVE (Managing Director & Principal Architect)
 * - ESTIMATOR (Lead Quantity Surveyor & Cost Planner)
 * - PROJECT_MANAGER (Senior Project Manager & Construction Head)
 * - SITE_ENGINEER (Site Execution & Quality Engineer)
 * - CLIENT (Project Sponsor & Owner)
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
  Package,
  Check,
  AlertCircle,
  Clock4,
  Zap,
  Image as ImageIcon,
  CheckCheck,
  TrendingDown
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
  const [activeTabRole, setActiveTabRole] = useState<UserRole>(currentUser.role || 'ADMIN');
  const [approvedItems, setApprovedItems] = useState<Record<string, boolean>>({});
  const [showAllDuties, setShowAllDuties] = useState(false);

  // Sync activeTabRole when currentUser changes
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

  // Role switching handler: finds user with target role or switches preview
  const handleRolePillClick = (targetRole: UserRole) => {
    setActiveTabRole(targetRole);
    const matchingUser = allUsers.find(u => u.role === targetRole);
    if (matchingUser) {
      onSwitchUser(matchingUser);
    }
  };

  const role = activeTabRole;

  // Role Metadata & Responsibilities Definition
  const getRoleProfile = () => {
    switch (role) {
      case 'ESTIMATOR':
        return {
          roleKey: 'ESTIMATOR' as UserRole,
          title: 'Lead Quantity Surveyor & Cost Planner',
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
          roleKey: 'PROJECT_MANAGER' as UserRole,
          title: 'Senior Project Manager & Construction Head',
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
            { id: 'pm-1', title: "Approve Today's Site Daily Progress Report (DPR)", description: 'Verify labour head-count (24 onsite) and delivery of 18mm marine plywood batch', priority: 'HIGH', category: 'Site Operations', targetTab: 'site_execution', actionLabel: 'Review DPR' },
            { id: 'pm-2', title: 'Process Variation Request VO-002 (Cove Lighting)', description: 'Check electrical cable rerouting and additional cost of ₹32,000 with client', priority: 'HIGH', category: 'Variations', targetTab: 'variations', actionLabel: 'View VO' },
            { id: 'pm-3', title: 'Inspect Marvel Interiors Carpentry Framework', description: 'Conduct structural framing inspection before acoustic rockwool insulation closure', priority: 'MEDIUM', category: 'Quality & Snags', targetTab: 'snags', actionLabel: 'Snag Log' },
            { id: 'pm-4', title: 'Review Subcontractor Measurement Sheet RA-02', description: 'Cross-check certified plastering area before forwarding to finance for payment', priority: 'LOW', category: 'Subcontractors', targetTab: 'contractors', actionLabel: 'View Subcontracts' }
          ]
        };

      case 'SITE_ENGINEER':
        return {
          roleKey: 'SITE_ENGINEER' as UserRole,
          title: 'Site Execution & Quality Engineer',
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
            { label: "Today's DPR Status", value: 'Draft / In-Progress', subtext: 'Morning attendance logged; evening wrap pending', trend: 'Log today', color: 'text-amber-600', targetTab: 'site_execution' },
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
          roleKey: 'ADMIN' as UserRole,
          title: 'Managing Director & Principal Architect',
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
          roleKey: 'CLIENT' as UserRole,
          title: 'Client & Project Sponsor',
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
          { title: 'Copilot AI Takeoff Engine', desc: 'Autonomous requirements takeoff & gap review', tab: 'ai_workspace', icon: Sparkles, badge: 'AI Copilot' },
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

  // Roles Definition for the interactive selector bar
  const ROLES_LIST: { role: UserRole; label: string; icon: any; color: string; desc: string }[] = [
    { role: 'ADMIN', label: 'Executive / MD', icon: ShieldCheck, color: 'text-purple-700 bg-purple-50 border-purple-200', desc: 'Executive EVM, Financials & RBAC' },
    { role: 'ESTIMATOR', label: 'Lead Estimator (QS)', icon: Calculator, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: 'BOQ Takeoffs & Master Rates' },
    { role: 'PROJECT_MANAGER', label: 'Project Manager', icon: HardHat, color: 'text-blue-700 bg-blue-50 border-blue-200', desc: 'Site Operations, SPI & Crew' },
    { role: 'SITE_ENGINEER', label: 'Site Engineer', icon: Wrench, color: 'text-amber-700 bg-amber-50 border-amber-200', desc: 'DPR Logs, Materials & Snags' },
    { role: 'CLIENT', label: 'Client / Owner', icon: UserCheck, color: 'text-teal-700 bg-teal-50 border-teal-200', desc: 'Milestones & 3D Approvals' }
  ];

  return (
    <div id="role-center-dashboard" className="space-y-5 max-w-[1700px] mx-auto text-xs pb-12 animate-in fade-in duration-200">
      
      {/* 1. EXECUTIVE WELCOME & UNIFIED ROLE COCKPIT */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 md:p-6 space-y-4 relative">
        
        {/* TIER 1: USER IDENTITY & OPERATIONAL CONTEXT (PROJECT & USER SWITCHER) */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* User Identity Details */}
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Avatar with Role Badge & Active Pulse */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs ring-4 ring-slate-100">
                {(() => {
                  const clean = currentUser.name.replace(/\s*\(.*?\)\s*/g, '').trim();
                  const parts = clean.split(/\s+/);
                  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : clean.slice(0, 2).toUpperCase();
                })()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-[#0F6CBD]" title={profile.roleKey}>
                <IconComponent className="w-3 h-3" />
              </div>
            </div>

            {/* Name, Role Pill, Status & Department */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                  {currentUser.name.replace(/\s*\(.*?\)\s*/g, '').trim()}
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${profile.badgeColor} uppercase tracking-wide`}>
                  {profile.roleKey}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Session
                </span>
              </div>

              <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-800">
                  {currentUser.roleTitle || profile.title}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-normal truncate max-w-[400px]">
                  {profile.dept}
                </span>
              </div>
            </div>
          </div>

          {/* Context Tools: Dedicated Active Job Selector + User Profile Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-stretch sm:self-auto">
            {/* Active Project Card / Selector */}
            <div className="flex-1 sm:flex-initial bg-slate-50/90 hover:bg-white border border-slate-200/90 rounded-xl px-3 py-2 transition-all shadow-2xs flex items-center gap-2.5 min-w-[240px]">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0F6CBD] shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <span>Active Project</span>
                  <span className="font-mono bg-blue-100/70 text-[#0F6CBD] border border-blue-200/60 px-1.5 py-0.2 rounded font-bold text-[9px] shrink-0">
                    {activeProject?.projectCode || 'PROJ-SKYLINE-1402'}
                  </span>
                </div>
                {projects && projects.length > 0 ? (
                  <select
                    value={activeProject?.id}
                    onChange={(e) => onSelectProject(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer truncate max-w-[210px] sm:max-w-[260px] block w-full"
                    title="Switch Active Project"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.projectCode})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[210px]">
                    {activeProject?.title || 'Skyline Penthouse 1402'}
                  </div>
                )}
              </div>
            </div>

            {/* Fast User Profile Switcher */}
            <div className="flex-1 sm:flex-initial bg-slate-50/90 hover:bg-white border border-slate-200/90 rounded-xl px-3 py-2 transition-all shadow-2xs flex items-center gap-2.5 min-w-[190px]">
              <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Switch User
                </div>
                <select
                  value={currentUser.id}
                  onChange={(e) => {
                    const targetUser = allUsers.find(u => u.id === e.target.value);
                    if (targetUser) onSwitchUser(targetUser);
                  }}
                  className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer truncate max-w-[170px] block w-full"
                  title="Switch active user profile"
                >
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name.replace(/\s*\(.*?\)\s*/g, '')} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* TIER 2: ROLE COCKPIT SELECTOR (DEDICATED FULL-WIDTH BAR) */}
        <div className="pt-3.5 pb-0.5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 shrink-0">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0F6CBD] flex items-center justify-center">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span>Role Perspective Cockpit:</span>
            <span className="text-[11px] text-slate-400 font-normal hidden lg:inline">(Simulate functional personas &amp; views)</span>
          </div>

          {/* Segmented Persona Buttons */}
          <div className="bg-slate-100/90 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 overflow-x-auto scrollbar-none max-w-full">
            {ROLES_LIST.map((r) => {
              const RIcon = r.icon;
              const isSelected = activeTabRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleRolePillClick(r.role)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80 ring-1 ring-slate-900/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                  }`}
                  title={r.desc}
                >
                  <RIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#0F6CBD]' : 'text-slate-400'}`} />
                  <span>{r.label}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F6CBD]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TIER 3: ASSIGNED RESPONSIBILITIES & GOVERNANCE SCOPE */}
        <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 shrink-0 mr-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Assigned Scope:</span>
            </span>

            {(showAllDuties ? profile.responsibilities : profile.responsibilities.slice(0, 3)).map((resp, i) => (
              <span 
                key={i} 
                className="inline-flex items-center gap-1.5 text-[11px] bg-slate-50 hover:bg-slate-100/90 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80 font-medium transition"
                title={resp}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                <span className="truncate max-w-[320px] sm:max-w-[420px]">{resp}</span>
              </span>
            ))}

            {profile.responsibilities.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllDuties(!showAllDuties)}
                className="text-[11px] text-[#0F6CBD] hover:text-blue-800 font-semibold px-2 py-0.5 rounded hover:bg-blue-50 transition cursor-pointer shrink-0"
              >
                {showAllDuties ? 'Show less' : `+${profile.responsibilities.length - 3} more duties`}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-500 font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 font-medium">
              RBAC: {profile.roleKey}
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium">
              Security Clearance Verified
            </span>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {profile.kpis.map((kpi, idx) => (
          <div
            key={idx}
            onClick={() => onNavigateTab(kpi.targetTab)}
            className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all p-5 cursor-pointer group hover:border-[#0F6CBD] relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-[#0F6CBD] transition">
                  {kpi.label}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-[#0F6CBD] transition">
                  {kpi.trend}
                </span>
              </div>

              <div className={`text-2xl sm:text-3xl font-bold mt-2.5 tracking-tight ${kpi.color}`}>
                {kpi.value}
              </div>

              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                {kpi.subtext}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#0F6CBD] font-semibold">
              <span>Access Module</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* 2.5 DEEP ROLE-SPECIFIC OPERATIONAL & ANALYTICAL WIDGETS */}
      {role === 'ADMIN' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* EVM Pulse */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#0F6CBD]" />
                <h3 className="font-bold text-slate-900 text-xs">Earned Value Management (EVM)</h3>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                CPI: 1.04 • SPI: 1.03
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <div className="text-slate-500 text-[10px]">Planned Value (PV)</div>
                <div className="font-bold text-slate-900">₹19,80,000</div>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <div className="text-slate-500 text-[10px]">Earned Value (EV)</div>
                <div className="font-bold text-emerald-700">₹20,53,800</div>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <div className="text-slate-500 text-[10px]">Actual Cost (AC)</div>
                <div className="font-bold text-slate-900">₹19,74,800</div>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <div className="text-slate-500 text-[10px]">Cost Variance (CV)</div>
                <div className="font-bold text-emerald-700">+₹79,000 (Favorable)</div>
              </div>
            </div>
            <div className="pt-1">
              <button 
                onClick={() => onNavigateTab('reports')}
                className="w-full py-1.5 text-center text-xs font-semibold text-[#0F6CBD] bg-[#EFF6FC] hover:bg-[#DEECF9] rounded transition"
              >
                Open 12 Mandatory Management Reports →
              </button>
            </div>
          </div>

          {/* Pending Executive Approvals */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-xs">Pending Executive Authorizations</h3>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-mono font-bold px-1.5 py-0.5 rounded border border-amber-200">
                3 Pending
              </span>
            </div>
            <div className="space-y-2">
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">PO-2024-001 (Plywood Batch)</div>
                  <div className="text-[10px] text-slate-500">₹1,85,000 • CenturyPly 710 Marine</div>
                </div>
                <button 
                  onClick={() => toggleApproval('po1')}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                    approvedItems['po1'] ? 'bg-emerald-600 text-white' : 'bg-[#002050] text-white hover:bg-slate-800'
                  }`}
                >
                  {approvedItems['po1'] ? 'Authorized ✓' : 'Authorize'}
                </button>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">Variation VO-002 (Cove Lighting)</div>
                  <div className="text-[10px] text-slate-500">₹32,000 • Client sign-off required</div>
                </div>
                <button 
                  onClick={() => toggleApproval('vo2')}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                    approvedItems['vo2'] ? 'bg-emerald-600 text-white' : 'bg-[#002050] text-white hover:bg-slate-800'
                  }`}
                >
                  {approvedItems['vo2'] ? 'Signed ✓' : 'Sign Off'}
                </button>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">Milestone 2 Tax Invoice</div>
                  <div className="text-[10px] text-slate-500">₹2,31,062 • Civil &amp; Framing complete</div>
                </div>
                <button 
                  onClick={() => onNavigateTab('traceability')}
                  className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-[10px] font-semibold transition"
                >
                  Review
                </button>
              </div>
            </div>
          </div>

          {/* Security & RBAC Status */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-xs">RBAC &amp; Security Compliance</h3>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                Enforced
              </span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Active User Profiles:</span>
                <span className="font-bold text-slate-900">{allUsers.length} Users Configured</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Cost Confidentiality:</span>
                <span className="font-semibold text-emerald-700">Protected (Site/Client Hidden)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Audit Logging:</span>
                <span className="font-semibold text-emerald-700">100% Operations Recorded</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600">Security Anomalies:</span>
                <span className="font-bold text-slate-900">0 Detected</span>
              </div>
            </div>
            <div className="pt-1">
              <button 
                onClick={() => onNavigateTab('users')}
                className="w-full py-1.5 text-center text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded transition border border-purple-200"
              >
                Manage Enterprise Users &amp; Permissions →
              </button>
            </div>
          </div>
        </div>
      )}

      {role === 'ESTIMATOR' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Trade-wise Takeoff Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-xs">Trade Package BOQ Takeoff &amp; Margin Analysis</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Revision: {activeProject?.activeRevisionId || 'REV-01'}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold">
                    <th className="py-1.5">Trade Package</th>
                    <th className="py-1.5">Takeoff Items</th>
                    <th className="py-1.5 text-right">Direct Cost</th>
                    <th className="py-1.5 text-right">Client Price</th>
                    <th className="py-1.5 text-right">Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2 font-sans font-medium text-slate-900">Civil &amp; Masonry Works</td>
                    <td className="py-2 text-slate-600">6 items</td>
                    <td className="py-2 text-right text-slate-700">₹4,20,000</td>
                    <td className="py-2 text-right font-bold text-slate-900">₹5,60,000</td>
                    <td className="py-2 text-right font-bold text-emerald-700">25.0%</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-medium text-slate-900">Carpentry &amp; Modular Woodwork</td>
                    <td className="py-2 text-slate-600">14 items</td>
                    <td className="py-2 text-right text-slate-700">₹18,40,000</td>
                    <td className="py-2 text-right font-bold text-slate-900">₹25,20,000</td>
                    <td className="py-2 text-right font-bold text-emerald-700">27.0%</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-medium text-slate-900">POP &amp; False Ceiling</td>
                    <td className="py-2 text-slate-600">5 items</td>
                    <td className="py-2 text-right text-slate-700">₹3,80,000</td>
                    <td className="py-2 text-right font-bold text-slate-900">₹5,10,000</td>
                    <td className="py-2 text-right font-bold text-emerald-700">25.5%</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-medium text-slate-900">Electrical &amp; Smart Automation</td>
                    <td className="py-2 text-slate-600">8 items</td>
                    <td className="py-2 text-right text-slate-700">₹5,10,000</td>
                    <td className="py-2 text-right font-bold text-slate-900">₹6,90,000</td>
                    <td className="py-2 text-right font-bold text-emerald-700">26.1%</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-medium text-slate-900">Plumbing &amp; Sanitaryware</td>
                    <td className="py-2 text-slate-600">4 items</td>
                    <td className="py-2 text-right text-slate-700">₹3,40,000</td>
                    <td className="py-2 text-right font-bold text-slate-900">₹4,60,000</td>
                    <td className="py-2 text-right font-bold text-emerald-700">26.1%</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-2 font-sans text-slate-900">Total Contractual BOQ</td>
                    <td className="py-2 text-slate-700">37 items</td>
                    <td className="py-2 text-right text-slate-800">₹34,90,000</td>
                    <td className="py-2 text-right text-slate-900">₹47,40,000</td>
                    <td className="py-2 text-right text-emerald-700">26.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Master Rate Benchmarks & AI Suggestions */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#0F6CBD]" />
                <h3 className="font-bold text-slate-900 text-xs">Rate Benchmarking &amp; AI</h3>
              </div>
              <span className="text-[10px] bg-purple-50 text-purple-700 font-mono font-bold px-1.5 py-0.5 rounded border border-purple-200">
                Copilot Ready
              </span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 bg-amber-50 rounded border border-amber-200">
                <div className="font-bold text-amber-900 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Rate Benchmark Alert</span>
                </div>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Asian Paints Royale Luxury price shifted +3.5% in Delhi NCR market. Update Master Price Library.
                </p>
                <button 
                  onClick={() => onNavigateTab('masters')}
                  className="mt-1.5 text-[10px] font-bold text-amber-900 underline cursor-pointer"
                >
                  Review in Rate Library →
                </button>
              </div>

              <div className="p-2 bg-purple-50 rounded border border-purple-200">
                <div className="font-bold text-purple-900 text-xs flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Copilot AI Takeoff Gap</span>
                </div>
                <p className="text-purple-800 text-[11px] mt-0.5">
                  9 potential takeoff items auto-detected from room survey: cove perimeter channel, acoustic glass wool.
                </p>
                <button 
                  onClick={() => onNavigateTab('ai_workspace')}
                  className="mt-1.5 text-[10px] font-bold text-purple-900 underline cursor-pointer"
                >
                  Open Copilot Takeoff Review →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {role === 'PROJECT_MANAGER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Milestone Critical Path */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-xs">Milestone Critical Path</h3>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                SPI: 1.03
              </span>
            </div>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>M1: Site Mobilization &amp; Demolition</span>
                  <span className="text-emerald-700">100% Complete</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>M2: Civil Masonry &amp; False Ceiling</span>
                  <span className="text-blue-700">75% In-Progress</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[75%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>M3: Modular Kitchen &amp; Wardrobes</span>
                  <span className="text-slate-400">Scheduled (12 days)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full w-[0%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Onsite Labour Mobilization */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-xs">Onsite Trade Workforce (24 Workers)</h3>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-700 font-mono font-bold px-1.5 py-0.5 rounded">
                Day Shift
              </span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-700">Carpentry &amp; Joinery (Marvel)</span>
                <span className="font-bold text-slate-900">8 craftsmen</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-700">Civil &amp; Core Drilling (Apex)</span>
                <span className="font-bold text-slate-900">6 masons</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-700">POP &amp; False Ceiling Grid</span>
                <span className="font-bold text-slate-900">5 artisans</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700">Electrical Conduit &amp; Cabling</span>
                <span className="font-bold text-slate-900">5 technicians</span>
              </div>
            </div>
          </div>

          {/* Variation Orders Register */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-xs">Active Variations Register</h3>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-mono font-bold px-1.5 py-0.5 rounded border border-amber-200">
                ₹1,42,000 Total
              </span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>VO-001: Marble Chamfering</span>
                  <span className="text-emerald-700">Approved</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">₹24,000 • Invoiced in Milestone 1</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>VO-002: Cove Illumination</span>
                  <span className="text-amber-700">In Review</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">₹32,000 • Pending client sign-off</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {role === 'SITE_ENGINEER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Today's DPR Log */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <HardHat className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-xs">Today's DPR Shift Checklist</h3>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-mono font-bold px-1.5 py-0.5 rounded border border-amber-200">
                In-Progress
              </span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Morning Toolbox Safety Talk</div>
                  <div className="text-[10px] text-slate-500">24 workers present, 100% PPE compliant</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Mid-day Ceiling Grid Inspection</div>
                  <div className="text-[10px] text-slate-500">450 sq.ft perimeter GI channel installed</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <Clock4 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Evening Shift Wrap &amp; Photo Log</div>
                  <div className="text-[10px] text-slate-500">Pending evening sign-off &amp; waste haul</div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('site_execution')}
              className="w-full py-1.5 text-center text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded transition mt-1"
            >
              Open Daily Progress Report (DPR) →
            </button>
          </div>

          {/* Material Delivery & GRN */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#0F6CBD]" />
                <h3 className="font-bold text-slate-900 text-xs">Material Inward &amp; GRN Inspection</h3>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-700 font-mono font-bold px-1.5 py-0.5 rounded">
                3 Batches
              </span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="font-bold text-slate-900 text-xs">CenturyPly 710 Marine Grade</div>
                <div className="text-[10px] text-slate-500">45 sheets • Waterproof stamp &amp; caliper checked</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="font-bold text-slate-900 text-xs">Schneider Electric Switchgear</div>
                <div className="text-[10px] text-slate-500">60 units • Living Now series batch verified</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="font-bold text-slate-900 text-xs">UltraTech Super Cement</div>
                <div className="text-[10px] text-slate-500">25 bags • Dry storage verified</div>
              </div>
            </div>
          </div>

          {/* Snags Rectification */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-slate-900 text-xs">Active Snags &amp; Rectification</h3>
              </div>
              <span className="text-[10px] bg-red-50 text-red-700 font-mono font-bold px-1.5 py-0.5 rounded border border-red-200">
                3 Pending
              </span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">SNAG-01: Foyer Switchplate</div>
                  <div className="text-[10px] text-slate-500">Alignment checked with spirit level</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Rectified
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">SNAG-02: Balcony Floor Slope</div>
                  <div className="text-[10px] text-slate-500">Water runoff gradient inspection</div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  In-Progress
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {role === 'CLIENT' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Milestone Payment Tracker */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-xs">Milestone Invoicing Schedule</h3>
              </div>
              <span className="text-[10px] bg-teal-50 text-teal-700 font-mono font-bold px-1.5 py-0.5 rounded border border-teal-200">
                ₹48,90,000 Contract
              </span>
            </div>
            <div className="space-y-2.5 text-[11px]">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">Milestone 1: Booking Advance (10%)</div>
                  <div className="text-[10px] text-slate-500">Civil &amp; demolition commencement</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ₹1,54,041 Paid ✓
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">Milestone 2: Framing &amp; Grids (15%)</div>
                  <div className="text-[10px] text-slate-500">False ceiling perimeter completion</div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  ₹2,31,062 Due Soon
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <div>
                  <div className="font-bold text-slate-900">Milestone 3: Modular Joinery (35%)</div>
                  <div className="text-[10px] text-slate-500">Cabinetry &amp; wardrobe factory dispatch</div>
                </div>
                <span className="text-[10px] text-slate-500">
                  ₹5,39,145 (Next)
                </span>
              </div>
            </div>
          </div>

          {/* 3D Design Concepts */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-xs">Approved 3D Design Concepts</h3>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                4 Signed
              </span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Living &amp; Dining Nordic Suite</span>
                <span className="text-[10px] font-bold text-emerald-700">Signed ✓</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Master Bedroom Champagne Oak</span>
                <span className="text-[10px] font-bold text-emerald-700">Signed ✓</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Gourmet Modular Kitchen Island</span>
                <span className="text-[10px] font-bold text-emerald-700">Signed ✓</span>
              </div>
            </div>
          </div>

          {/* Finish Samples Awaiting Selection */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-xs">Material Samples for Client Selection</h3>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-mono font-bold px-1.5 py-0.5 rounded border border-amber-200">
                Action Required
              </span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="font-bold text-slate-900">TV Unit Accent Veneer</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Choice: Smoked Eucalyptus vs Royal Teak</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="font-bold text-slate-900">Vanity Counter Stone</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Choice: Botticino Marble vs Calacatta Quartz</div>
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('materials')}
              className="w-full py-1.5 text-center text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded transition border border-teal-200"
            >
              Browse Material Swatches →
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE GRID: ASSIGNED TASKS + RESPONSIBILITY MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* LEFT 2 COLUMNS: DAILY ROLE WORKFLOW & PENDING TASKS */}
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
                  <p className="text-slate-500 text-xs">
                    Assigned operational queue for {profile.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold">
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
                    className={`py-3.5 flex items-start justify-between gap-4 transition-colors ${
                      isDone ? 'opacity-60 bg-slate-50/50 -mx-4 px-4' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-[#0F6CBD] shrink-0 transition cursor-pointer"
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
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                            task.priority === 'HIGH' 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : task.priority === 'MEDIUM' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {task.category}
                          </span>
                        </div>

                        <p className="text-slate-500 text-xs mt-1">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateTab(task.targetTab)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#EFF6FC] text-[#0F6CBD] border border-[#C7E0F4] rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                    >
                      <span>{task.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Role Navigation Deck */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Role Quick Workspaces
                </h3>
                <p className="text-slate-500 text-xs">
                  Direct shortcuts to everyday tools for {profile.roleKey}
                </p>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                BuildStorys ERP
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shortcuts.map((sc, idx) => {
                const ScIcon = sc.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onNavigateTab(sc.tab)}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-[#0F6CBD] hover:shadow-xs transition-all text-left group cursor-pointer"
                  >
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 group-hover:border-[#0F6CBD]/40 group-hover:text-[#0F6CBD] text-slate-700 shadow-2xs shrink-0 transition">
                      <ScIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-semibold text-slate-900 group-hover:text-[#0F6CBD] text-xs transition truncate">
                          {sc.title}
                        </span>
                        <span className="text-[10px] bg-slate-200/70 text-slate-700 font-mono px-2 py-0.5 rounded font-semibold shrink-0">
                          {sc.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
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
        <div className="space-y-5">
          
          {/* Active Job Card Quick Summary */}
          {activeProject && (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0F6CBD]" />
                  <span className="font-bold text-slate-900 text-xs">
                    Assigned Job Card
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[#0F6CBD] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  {activeProject.projectCode}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{activeProject.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{activeProject.clientName} • {activeProject.siteAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase">Contract Value</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">₹{(activeProject.estimatedBudget || 4890000).toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase">Active Revision</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5 font-mono">{activeProject.activeRevisionId || 'REV-01'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onNavigateTab('general')}
                  className="flex-1 py-2 bg-[#0F6CBD] hover:bg-[#005a9e] text-white rounded-lg font-semibold text-xs transition text-center shadow-xs cursor-pointer"
                >
                  Open Job Card
                </button>
                <button
                  onClick={() => onNavigateTab('projects')}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold text-xs transition cursor-pointer shadow-2xs"
                  title="Switch or register new job"
                >
                  All Jobs
                </button>
              </div>
            </div>
          )}

          {/* Assigned Responsibilities Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs">
                  Role Authority &amp; Responsibilities
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Enforced by BuildStorys Security Engine
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Primary Responsibilities
              </div>
              <ul className="space-y-2">
                {profile.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 text-xs leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Authorized Workspaces</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.authorizedAreas.map((auth, i) => (
                  <span key={i} className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md font-medium">
                    {auth}
                  </span>
                ))}
              </div>
            </div>

            {profile.restrictedAreas && profile.restrictedAreas.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Access Boundary Guards</span>
                </div>
                <div className="space-y-1.5">
                  {profile.restrictedAreas.map((rest, i) => (
                    <div key={i} className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      <span>{rest}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Copilot AI Assistant Prompt */}
          {onOpenAIWorkspace && (
            <div className="bg-slate-900 text-white rounded-xl shadow-xs p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>BuildStorys Copilot Assistant</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Autonomous audit engine is active for {profile.roleKey}. It continuously monitors takeoff quantities, rate deviations, and variation orders in real time.
              </p>
              <button
                onClick={onOpenAIWorkspace}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Open Agentic AI Workspace</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
