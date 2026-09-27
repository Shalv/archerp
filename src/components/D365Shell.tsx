import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  HelpCircle, 
  GraduationCap, 
  ChevronDown, 
  Check, 
  ExternalLink,
  Database,
  Building2,
  FileSpreadsheet,
  FileText,
  DollarSign,
  Briefcase,
  UserCheck,
  CheckCircle2,
  Info,
  Shield,
  Users,
  Network,
  Compass,
  ArrowRight,
  LogOut,
  Key,
  BarChart3,
  Clock,
  FolderKanban,
  HardHat,
  ChevronRight,
  Wrench,
  Layers,
  Sparkles,
  LayoutDashboard,
  Box,
  Palette,
  PackageCheck,
  Receipt,
  TrendingUp,
  Landmark,
  ShieldCheck,
  Package,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';
import { UserSession, ProjectRecord } from '../types/erp';
import { isImageAvatar, getUserInitials } from '../utils/avatarUtils';
import { ViewportMenu } from './ViewportMenu';

interface D365ShellProps {
  currentUser: UserSession;
  allUsers: UserSession[];
  onSelectUser: (user: UserSession) => void;
  activeProject: ProjectRecord | null;
  projects: ProjectRecord[];
  onSelectProject: (projectId: string) => void;
  activeTab: string;
  onNavigateTab?: (tab: string) => void;
  onOpenInspectData: () => void;
  onOpenAuditLogs: () => void;
  onOpenStatusModal: () => void;
  onOpenTrainingManual?: () => void;
  onOpenLoginPortal?: () => void;
  onOpenVastuModal?: () => void;
  onLogout?: () => void;
  onOpenProfile?: (initialTab?: 'profile' | 'security') => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onOpenMobileSidebar?: () => void;
  onExportToExcel?: () => void;
  onToggleFactBox?: () => void;
  isFactBoxOpen?: boolean;
}

export const D365Shell: React.FC<D365ShellProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  activeProject,
  projects,
  onSelectProject,
  activeTab,
  onNavigateTab,
  onOpenInspectData,
  onOpenAuditLogs,
  onOpenStatusModal,
  onOpenTrainingManual,
  onOpenLoginPortal,
  onOpenVastuModal,
  onLogout,
  onOpenProfile,
  onExportToExcel,
  onToggleFactBox,
  isFactBoxOpen = false
}) => {
  const handleNavigate = (tab: string) => {
    if (typeof onNavigateTab === 'function') {
      onNavigateTab(tab);
    }
  };

  const [tellMeOpen, setTellMeOpen] = useState(false);
  const [tellMeQuery, setTellMeQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mySettingsOpen, setMySettingsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [allModulesOpen, setAllModulesOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);

  const allModulesRef = useRef<HTMLDivElement>(null);
  const projectMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (allModulesRef.current && !allModulesRef.current.contains(e.target as Node)) {
        setAllModulesOpen(false);
      }
      if (projectMenuRef.current && !projectMenuRef.current.contains(e.target as Node)) {
        setIsProjectMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard shortcut listener: Alt+Q for search, Ctrl+Alt+F1 for data inspector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'q' || e.key === 'Q')) {
        e.preventDefault();
        setTellMeOpen(prev => !prev);
      }
      if (e.ctrlKey && e.altKey && e.key === 'F1') {
        e.preventDefault();
        onOpenInspectData();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenInspectData]);

  // Tell Me Search Items
  const tellMeItems = [
    { title: 'Vastu Floor Planner & 3D Solids (.DWG, .DXF, .STEP, .STL)', category: 'Design & CAD', action: () => onOpenVastuModal ? onOpenVastuModal() : handleNavigate('survey') },
    { title: 'Executive Role Center Dashboard', category: 'Overview', action: () => handleNavigate('dashboard') },
    { title: 'Job Planning Lines & BOQ Takeoff Studio', category: 'Estimating', action: () => handleNavigate('boq') },
    { title: 'Architectural Drawings & 3D Spatial Renders', category: 'Design & CAD', action: () => handleNavigate('drawings') },
    { title: 'Site Survey & Laser Distance Measurements', category: 'Design & CAD', action: () => handleNavigate('survey') },
    { title: 'Cost Accounting & Overhead Budget Engine', category: 'Commercials', action: () => handleNavigate('budget') },
    { title: 'BOQ Cost Traceability Matrix', category: 'Commercials', action: () => handleNavigate('traceability') },
    { title: 'Customer Sales Quotation & Milestones', category: 'Commercials', action: () => handleNavigate('quotation') },
    { title: 'Daily Progress Reports (DPR)', category: 'Site Operations', action: () => handleNavigate('site_execution') },
    { title: 'Project Timesheet Management', category: 'Site Operations', action: () => handleNavigate('timesheets') },
    { title: 'Resource Deployment Matrix', category: 'Site Operations', action: () => handleNavigate('resources') },
    { title: 'Procurement & Purchase Orders (RFQ & PO)', category: 'Procurement', action: () => handleNavigate('procurement') },
    { title: 'Material Inward & Store Inventory (GRN)', category: 'Procurement', action: () => handleNavigate('inventory') },
    { title: 'Subcontractors & Measurement Book', category: 'Contractors', action: () => handleNavigate('contractors') },
    { title: 'Snags & Quality Rectification Matrix', category: 'Quality', action: () => handleNavigate('snags') },
    { title: 'Handover & Warranty Management', category: 'Handover', action: () => handleNavigate('handover') },
    { title: 'Customer Project Portal', category: 'Client Access', action: () => handleNavigate('portal') },
    { title: 'All 22 Project Reports Hub', category: 'Reports', action: () => handleNavigate('reports') },
    { title: 'Company Setup Master & Financial Ledgers', category: 'Finance', action: () => handleNavigate('company_setup') },
    { title: 'User Administration & Security Roles (RBAC)', category: 'Administration', action: () => handleNavigate('users') },
    { title: 'Customer Training & Operations Manual', category: 'Help & Docs', action: () => onOpenTrainingManual?.() },
    { title: 'System Diagnostics & Page Data Inspector (Ctrl+Alt+F1)', category: 'Diagnostics', action: () => onOpenInspectData() },
    { title: 'Audit Trail & Change Logs', category: 'Diagnostics', action: () => onOpenAuditLogs() }
  ];

  const filteredTellMe = tellMeItems.filter(item => 
    item.title.toLowerCase().includes(tellMeQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(tellMeQuery.toLowerCase())
  );

  // Workflow Stages Definition for "All Modules" Mega Menu
  const workflowStages = [
    {
      title: '1. Discovery & CRM',
      items: [
        { label: 'CRM & Lead Pipeline', tab: 'crm', desc: 'Briefs, site visits & funnel' },
        { label: 'Customers & Contacts', tab: 'contacts', desc: 'Directory & client accounts' },
        { label: 'Client Discovery Pack', tab: 'discovery_form', desc: 'Requirement questionnaires' },
        { label: 'Sample Finish Heads', tab: 'visual_pack', desc: 'Moodboards & finishes' }
      ]
    },
    {
      title: '2. Spatial & Architectural Design',
      items: [
        { label: 'Site Survey & Spatial CAD', tab: 'survey', desc: 'Dimensions & Vastu layouts' },
        { label: 'Drawings & 3D Renders', tab: 'drawings', desc: 'GFC CAD plans & 3D models' },
        { label: 'Material & Sample Approvals', tab: 'materials', desc: 'Palette, swatches & specs' },
        { label: 'Master Rates Price List', tab: 'masters', desc: 'Standard schedule of rates' }
      ]
    },
    {
      title: '3. Estimating & Commercials',
      items: [
        { label: 'BOQ Takeoff Planning Lines', tab: 'boq', desc: 'Trade packages & quantities' },
        { label: 'Commercial Budget Engine', tab: 'budget', desc: 'Overheads & value engineering' },
        { label: 'Cost Traceability Matrix', tab: 'traceability', desc: 'BOQ to PO & actuals' },
        { label: 'Customer Quotation', tab: 'quotation', desc: 'Contract terms & payment plan' }
      ]
    },
    {
      title: '4. Contracts & Approvals',
      items: [
        { label: 'Contracts & Work Orders', tab: 'contracts', desc: 'Retention, terms & agreements' },
        { label: 'Customer Portal', tab: 'portal', desc: 'Milestone sign-off & approvals' }
      ]
    },
    {
      title: '5. Site Operations & Quality',
      items: [
        { label: 'Procurement & Purchase Orders', tab: 'procurement', desc: 'Vendor RFQs & purchase' },
        { label: 'Material Inward & GRN', tab: 'inventory', desc: 'Goods receipts & stock' },
        { label: 'Subcontractors & Measurement', tab: 'contractors', desc: 'Work certification & MB' },
        { label: 'Daily Progress Reports (DPR)', tab: 'site_execution', desc: 'Site logs, attendance & delays' },
        { label: 'Employee Timesheets', tab: 'timesheets', desc: 'Billable hours & logs' },
        { label: 'Resource Deployment', tab: 'resources', desc: 'Crews, shifts & machinery' },
        { label: 'Snags & Quality Audits', tab: 'snags', desc: 'Defect matrix & rectifications' },
        { label: 'Safety & Compliance NOC', tab: 'compliance', desc: 'Permits, fire & society NOC' }
      ]
    },
    {
      title: '6. Billing, Finance & MIS',
      items: [
        { label: 'Customer Billing & RA Invoices', tab: 'billing', desc: 'Milestone bills & GST receipts' },
        { label: 'Financial Ledger & Cash Flow', tab: 'finance', desc: 'Cash-in vs cash-out' },
        { label: 'Company Setup & Multi-State GST', tab: 'company_setup', desc: 'Legal entity & bank master' },
        { label: 'All 22 Project Reports Hub', tab: 'reports', desc: 'EVM, SPI/CPI, cash flow & MIS' },
        { label: 'Copilot Recommendations', tab: 'ai_workspace', desc: 'Cost alerts & suggestions' }
      ]
    }
  ];

  const getModuleBreadcrumb = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return { category: 'Role Center', name: 'Executive Overview' };
      case 'general':
        return { category: 'Jobs & Projects', name: 'Job Card Details' };
      case 'projects':
        return { category: 'Jobs & Projects', name: 'Project Register' };
      case 'project_hub':
        return { category: 'Execution', name: 'Project Management Hub' };
      case 'timesheets':
        return { category: 'Execution', name: 'Timesheet Ledger' };
      case 'resources':
        return { category: 'Execution', name: 'Resource Deployment' };
      case 'crm':
        return { category: 'Enquiry', name: 'CRM & Pipeline' };
      case 'contacts':
        return { category: 'Enquiry', name: 'Customer Directory' };
      case 'survey':
        return { category: 'Architecture & Design', name: 'Survey & Vastu Floor Plan' };
      case 'drawings':
      case 'architecture':
        return { category: 'Architecture & Design', name: 'Architectural Drawings & 3D' };
      case 'materials':
        return { category: 'Architecture & Design', name: 'Material & Sample Approvals' };
      case 'masters':
      case 'rates':
        return { category: 'Estimating', name: 'Master Rates Price List' };
      case 'boq':
        return { category: 'Estimating', name: 'Job Planning Lines (BOQ)' };
      case 'budget':
        return { category: 'Commercials', name: 'Cost Budget Engine' };
      case 'traceability':
        return { category: 'Commercials', name: 'Cost Traceability Matrix' };
      case 'quotation':
        return { category: 'Commercials', name: 'Customer Sales Quotation' };
      case 'site_execution':
        return { category: 'Execution', name: 'Daily Progress Reports (DPR)' };
      case 'procurement':
        return { category: 'Procurement', name: 'Purchase Orders & RFQ' };
      case 'inventory':
        return { category: 'Procurement', name: 'Material Inward & GRN' };
      case 'contractors':
      case 'subcontractors':
        return { category: 'Operations', name: 'Subcontractors & Measurement Book' };
      case 'snags':
        return { category: 'Quality', name: 'Snag Resolution Matrix' };
      case 'handover':
      case 'warranty':
        return { category: 'Handover', name: 'Warranty & Handover Pack' };
      case 'portal':
        return { category: 'Client Portal', name: 'Customer Project View' };
      case 'reports':
        return { category: 'Management Reports', name: 'Executive Reports Hub' };
      case 'company_setup':
      case 'company_finance':
        return { category: 'Administration', name: 'Company Setup Master' };
      case 'users':
        return { category: 'Administration', name: 'User Master & RBAC' };
      case 'ai_workspace':
        return { category: 'Operations', name: 'Copilot Action Center' };
      default:
        return { category: 'Build Storys', name: 'Workspace' };
    }
  };

  const breadcrumb = getModuleBreadcrumb(activeTab);

  return (
    <header className="erp-shell shrink-0 sticky top-0 z-40 select-none bg-white border-b border-slate-200/90 shadow-2xs">
      {/* 1. UNIFIED HUMAN-CRAFTED MASTER TOP BAR */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Left Zone: Brand + Primary Clean Navigation Links */}
        <div className="flex items-center gap-6 sm:gap-8 min-w-0">
          {/* Brand Mark: Architectural Wordmark */}
          <button
            onClick={() => handleNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
            title="Build Storys ERP - Executive Dashboard"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-slate-800 transition">
              <Building2 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-sm text-slate-900 leading-none">
                BUILD STORYS
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
                Architectural ERP
              </span>
            </div>
          </button>

          {/* Primary Navigation Tabs */}
          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-1 text-xs">
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-slate-950 font-semibold bg-slate-100 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => handleNavigate('general')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                activeTab === 'general'
                  ? 'text-slate-950 font-semibold bg-slate-100 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Job Card
            </button>

            <button
              onClick={() => handleNavigate('boq')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                activeTab === 'boq'
                  ? 'text-slate-950 font-semibold bg-slate-100 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              BOQ Studio
            </button>

            <button
              onClick={() => handleNavigate('survey')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                activeTab === 'survey' || activeTab === 'drawings'
                  ? 'text-slate-950 font-semibold bg-slate-100 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              CAD &amp; Vastu
            </button>

            <button
              onClick={() => handleNavigate('site_execution')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                ['site_execution', 'timesheets', 'resources', 'snags'].includes(activeTab)
                  ? 'text-slate-950 font-semibold bg-slate-100 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Site Ops
            </button>

            <button
              onClick={() => handleNavigate('budget')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                ['budget', 'quotation', 'traceability', 'billing', 'finance'].includes(activeTab)
                  ? 'text-slate-950 font-semibold bg-slate-100 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Commercials
            </button>

            {/* All Modules Dropdown */}
            <div className="relative" ref={allModulesRef}>
              <button
                type="button"
                onClick={() => setAllModulesOpen(!allModulesOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  allModulesOpen
                    ? 'text-slate-900 bg-slate-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>All Modules</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${allModulesOpen ? 'rotate-180' : 'text-slate-400'}`} />
              </button>

              {allModulesOpen && (
                <div className="absolute left-0 mt-2 w-[720px] bg-white rounded-xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150 grid grid-cols-3 gap-4 text-xs">
                  {workflowStages.map((stage, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-900 border-b border-slate-100 pb-1">
                        {stage.title}
                      </div>
                      <div className="space-y-0.5">
                        {stage.items.map((item, itemIdx) => (
                          <button
                            key={itemIdx}
                            type="button"
                            onClick={() => {
                              handleNavigate(item.tab);
                              setAllModulesOpen(false);
                            }}
                            className={`w-full text-left p-1.5 rounded-md transition flex flex-col group cursor-pointer ${
                              activeTab === item.tab
                                ? 'bg-slate-100 font-semibold text-slate-950'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="font-medium text-slate-800 group-hover:text-blue-600 text-xs">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate">
                              {item.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Center Zone: Quick Search (Alt+Q) */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-2">
          <button
            onClick={() => setTellMeOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 text-slate-500 hover:text-slate-800 border border-slate-200 text-xs transition cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition" />
              <span className="truncate">Search commands, pages, reports...</span>
            </span>
            <kbd className="font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-medium">
              Alt+Q
            </kbd>
          </button>
        </div>

        {/* Right Zone: Project Selector, Actions & User */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Active Project Selector */}
          <div className="relative" ref={projectMenuRef}>
            <button
              onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs transition cursor-pointer"
              title="Switch Active Project"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-mono font-semibold text-slate-800 text-xs">
                {activeProject ? activeProject.projectCode : 'Select Project'}
              </span>
              <span className="text-slate-300 hidden xl:inline">·</span>
              <span className="text-slate-600 truncate max-w-[120px] hidden xl:inline text-xs font-normal">
                {activeProject ? activeProject.title : 'All Projects'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {isProjectMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 mb-1">
                  <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-slate-500" />
                    <span>Active Projects ({projects.length})</span>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProject(p.id);
                        setIsProjectMenuOpen(false);
                      }}
                      className={`flex w-full items-start justify-between rounded-lg p-2 text-left text-xs transition cursor-pointer ${
                        activeProject?.id === p.id
                          ? 'bg-blue-50/80 text-blue-900 border border-blue-200/60 font-medium'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-slate-900 truncate">{p.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono font-medium text-slate-700">{p.projectCode}</span>
                          <span>·</span>
                          <span className="truncate">{p.clientName || 'Client'}</span>
                          {p.city && <span>({p.city})</span>}
                        </div>
                      </div>
                      {activeProject?.id === p.id && <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
                    </button>
                  ))}
                </div>
                <div className="pt-2 mt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      handleNavigate('projects');
                      setIsProjectMenuOpen(false);
                    }}
                    className="w-full text-center py-1 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    View All in Projects Register →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action: Vastu CAD Planner */}
          <button
            onClick={() => onOpenVastuModal ? onOpenVastuModal() : handleNavigate('survey')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition text-xs font-semibold shadow-2xs cursor-pointer"
            title="Generate Vastu Floor Plan & Export CAD (.DWG, .DXF, .STEP, .STL)"
          >
            <Compass className="h-3.5 w-3.5 text-sky-400" />
            <span>Vastu CAD</span>
          </button>

          {/* Customer Training Guide */}
          <button
            onClick={onOpenTrainingManual}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition text-xs font-medium cursor-pointer"
            title="Customer Curriculum & Module Guide"
          >
            <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
            <span>Manual</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>

            {notificationsOpen && (
              <ViewportMenu className="absolute right-0 mt-2 w-80 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-3 z-50 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="font-semibold text-xs text-slate-900">Notifications</span>
                  <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">Clear all</span>
                </div>
                <div className="divide-y divide-slate-100 py-1">
                  <div className="py-2">
                    <div className="font-medium text-slate-900 text-xs">AI Draft Takeoff Generated</div>
                    <div className="text-[11px] text-slate-500">15 items generated for Skyline 1402 based on client brief.</div>
                  </div>
                  <div className="py-2">
                    <div className="font-medium text-slate-900 text-xs">Estimator Baseline Approved</div>
                    <div className="text-[11px] text-slate-500">Rev 1 baseline frozen for project cost control.</div>
                  </div>
                </div>
              </ViewportMenu>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
            >
              <div className="h-7 w-7 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center overflow-hidden shrink-0">
                {isImageAvatar(currentUser.avatar) ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <span>{getUserInitials(currentUser.name, currentUser.avatar)}</span>
                )}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-[11px] font-semibold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {currentUser.role ? currentUser.role.replace('_', ' ') : ''}
                </div>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <ViewportMenu className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-2 z-50 text-xs">
                <div className="p-2.5 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center overflow-hidden shrink-0">
                    {isImageAvatar(currentUser.avatar) ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <span>{getUserInitials(currentUser.name, currentUser.avatar)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                    <div className="text-[10px] font-medium text-slate-600 mt-0.5">
                      Role: {currentUser.role || 'User'}
                    </div>
                  </div>
                </div>

                <div className="p-1 border-b border-slate-100 my-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenProfile?.('profile');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer"
                  >
                    <span>My Profile &amp; Preferences</span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenProfile?.('security');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer"
                  >
                    <span>Change Password</span>
                    <Key className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </div>

                <div className="px-2 py-1 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                  Switch Active Role (RBAC)
                </div>
                {allUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left transition gap-2 cursor-pointer ${
                      currentUser.id === user.id ? 'bg-slate-100 text-slate-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-6 w-6 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center overflow-hidden shrink-0">
                        {isImageAvatar(user.avatar) ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <span>{getUserInitials(user.name, user.avatar)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 truncate text-xs">{user.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{user.role ? user.role.replace('_', ' ') : ''}</div>
                      </div>
                    </div>
                    {currentUser.id === user.id && <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                  </button>
                ))}

                <div className="pt-2 mt-1 border-t border-slate-100 space-y-1">
                  {onLogout && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg bg-rose-50 text-rose-700 font-semibold hover:bg-rose-100 transition text-xs cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </ViewportMenu>
            )}
          </div>
        </div>
      </div>

      {/* 2. CONTEXTUAL WORKSPACE BAR (Quiet 1-line breadcrumb + contextual actions) */}
      <div className="bg-slate-50/70 border-t border-slate-200/80 px-4 sm:px-6 py-2 flex items-center justify-between text-xs">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <button
            onClick={() => handleNavigate('dashboard')}
            className="text-slate-500 hover:text-slate-800 font-medium transition cursor-pointer"
          >
            Build Storys
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-medium hidden sm:inline">
            {breadcrumb.category}
          </span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="font-semibold text-slate-900">
            {breadcrumb.name}
          </span>
        </nav>

        {/* Right Contextual Controls: Export Excel, FactBox, Diagnostics */}
        <div className="flex items-center gap-2">
          {/* Export to Excel */}
          {onExportToExcel && ['boq', 'general', 'budget'].includes(activeTab) && (
            <button
              onClick={onExportToExcel}
              className="flex items-center gap-1.5 px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 rounded-md text-xs border border-slate-200 transition cursor-pointer font-medium shadow-2xs"
              title="Export Planning Lines to Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
          )}

          {/* FactBox Toggle */}
          {onToggleFactBox && ['general', 'boq', 'budget', 'quotation', 'survey'].includes(activeTab) && (
            <button
              onClick={onToggleFactBox}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition cursor-pointer font-medium ${
                isFactBoxOpen
                  ? 'bg-slate-200/80 text-slate-900 border-slate-300 shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
              title={isFactBoxOpen ? 'Hide FactBox details pane' : 'Show FactBox details pane'}
            >
              <Info className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">FactBox</span>
            </button>
          )}

          {/* Tools & Diagnostics Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-md text-xs border border-slate-200 transition cursor-pointer font-medium shadow-2xs"
              title="Diagnostics & Tools"
            >
              <Wrench className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Tools</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {toolsMenuOpen && (
              <ViewportMenu className="absolute right-0 mt-1.5 w-60 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Diagnostics &amp; Logs
                </div>
                <button
                  onClick={() => {
                    setToolsMenuOpen(false);
                    onOpenAuditLogs();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-medium text-slate-700">Audit Trail &amp; Logs</span>
                  <span className="text-[10px] text-slate-400">Telemetry</span>
                </button>
                <button
                  onClick={() => {
                    setToolsMenuOpen(false);
                    onOpenInspectData();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-medium text-slate-700">Data Inspector</span>
                  <kbd className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-mono">Ctrl+Alt+F1</kbd>
                </button>
                <button
                  onClick={() => {
                    setToolsMenuOpen(false);
                    onOpenStatusModal();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer border-t border-slate-100"
                >
                  <span className="font-medium text-slate-700">System Specifications</span>
                  <span className="text-[10px] text-slate-400">Specs</span>
                </button>
              </ViewportMenu>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH MODAL (Alt+Q) */}
      {tellMeOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Search className="h-4 w-4 text-sky-400" />
                <span>Search pages, commands, and reports</span>
              </div>
              <kbd className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">ESC to close</kbd>
            </div>

            <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-2">
              <input
                type="text"
                autoFocus
                placeholder="Type a module or action (e.g. BOQ, Floor Plan, Timesheet, Purchase Orders)..."
                value={tellMeQuery}
                onChange={e => setTellMeQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') setTellMeOpen(false);
                  if (e.key === 'Enter' && filteredTellMe.length > 0) {
                    filteredTellMe[0].action();
                    setTellMeOpen(false);
                  }
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-800 focus:outline-hidden"
              />

              {!tellMeQuery && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px]">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold shrink-0">Popular:</span>
                  {[
                    { label: 'Overview', action: () => handleNavigate('dashboard') },
                    { label: 'BOQ Studio', action: () => handleNavigate('boq') },
                    { label: 'Vastu CAD', action: () => handleNavigate('survey') },
                    { label: 'Site DPR', action: () => handleNavigate('site_execution') },
                    { label: 'Purchase Orders', action: () => handleNavigate('procurement') }
                  ].map((quick, qIdx) => (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => {
                        quick.action();
                        setTellMeOpen(false);
                      }}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100 transition shrink-0 cursor-pointer font-medium"
                    >
                      {quick.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1">
              {filteredTellMe.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    item.action();
                    setTellMeOpen(false);
                  }}
                  className="p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between group transition"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-400">{item.category}</div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-600" />
                </div>
              ))}
              {filteredTellMe.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  No matching actions or pages found for &quot;{tellMeQuery}&quot;
                </div>
              )}
            </div>

            <div className="p-2 bg-slate-100 text-[11px] text-slate-500 flex justify-between items-center border-t border-slate-200">
              <span>Press Enter to select</span>
              <button
                onClick={() => setTellMeOpen(false)}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
