import { ViewportMenu } from './ViewportMenu';
import React, { useState, useEffect, useRef } from 'react';
import { TopMenuBar } from './TopMenuBar';
import { 
  Search, 
  Bell, 
  Settings, 
  HelpCircle, 
  GraduationCap,
  Sparkles, 
  ChevronDown, 
  Check, 
  Grid, 
  ExternalLink,
  ShieldAlert,
  Database,
  Calendar,
  Layers,
  FileSpreadsheet,
  FileText,
  DollarSign,
  Briefcase,
  UserCheck,
  CheckCircle2,
  Info,
  Shield,
  ShieldCheck,
  Users,
  Network,
  Compass,
  ArrowRight,
  LogIn,
  LogOut,
  Key,
  BarChart3,
  Clock,
  FolderKanban,
  Palette,
  Truck,
  HardHat,
  ClipboardCheck,
  Award,
  PanelLeft,
  Menu,
  Wrench,
  ChevronRight
} from 'lucide-react';
import { UserSession, ProjectRecord } from '../types/erp';
import { isImageAvatar, getUserInitials } from '../utils/avatarUtils';

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
  onLogout,
  onOpenProfile,
  isSidebarCollapsed = false,
  onToggleSidebar,
  onOpenMobileSidebar,
  onExportToExcel,
  onToggleFactBox,
  isFactBoxOpen = false
}) => {
  const handleNavigate = (tab: string) => {
    if (typeof onNavigateTab === 'function') {
      onNavigateTab(tab);
    }
  };

  const [waffleOpen, setWaffleOpen] = useState(false);
  const [tellMeOpen, setTellMeOpen] = useState(false);
  const [tellMeQuery, setTellMeQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mySettingsOpen, setMySettingsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState<string | null>(null);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const navDropdownRef = useRef<HTMLDivElement>(null);
  const projectMenuRef = useRef<HTMLDivElement>(null);

  // Close nav dropdown and project menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target as Node)) {
        setNavDropdownOpen(null);
      }
      if (projectMenuRef.current && !projectMenuRef.current.contains(e.target as Node)) {
        setIsProjectMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Global Alt+Q and Ctrl+Alt+F1 keyboard listener
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
    { title: 'Customer Training & Operations Manual (Step-by-Step Module Guide)', category: 'Training & Help', action: () => onOpenTrainingManual?.() },
    { title: 'User Operations Manual & Step-by-Step Customer Curriculum', category: 'Training & Help', action: () => onOpenTrainingManual?.() },
    { title: 'Role Center Dashboard (My Assigned Role & Responsibilities)', category: 'Role Center', action: () => handleNavigate('dashboard') },
    { title: 'BOQ Cost Traceability Matrix (BOQ -> Budget -> PO/WO -> Actual Cost)', category: 'Core Finance', action: () => handleNavigate('traceability') },
    { title: 'Agentic AI Copilot Action Center (Review Suggestions & Approve)', category: 'AI Copilot', action: () => handleNavigate('ai_workspace') },
    { title: 'CRM & Sales Pipeline (Leads, Briefs, Site Visits, Lost Reasons)', category: 'Module 1', action: () => handleNavigate('crm') },
    { title: 'Customer & Contact Management (Multi-Site Directory, Billing Profiles)', category: 'Module 2', action: () => handleNavigate('contacts') },
    { title: 'Design & Drawing Management (CAD, 3D Renders, Revisions, Approvals)', category: 'Module 4', action: () => handleNavigate('drawings') },
    { title: 'Material & Finish Selection Palette (Samples, Brands, Approvals)', category: 'Module 5', action: () => handleNavigate('materials') },
    { title: 'Contracts & Work Orders (Retention 5%, DLP, Commercial Terms)', category: 'Module 9', action: () => handleNavigate('contracts') },
    { title: 'Project Timesheet Management (Employee Logged Hours & Billable Rates)', category: 'Execution & Ops', action: () => handleNavigate('timesheets') },
    { title: 'Project-Wise Resource Deployment (Carpenters, MEP, Supervisors & Machinery)', category: 'Execution & Ops', action: () => handleNavigate('resources') },
    { title: 'Project Management & Tasks Hub (Kanban Tasks, Timesheets & Resources)', category: 'Execution & Ops', action: () => handleNavigate('project_hub') },
    { title: 'Site Execution & Daily Progress Reports (DPR, Labour, Photos)', category: 'Module 11', action: () => handleNavigate('site_execution') },
    { title: 'Change Orders & Variations (VO Register, Cost/Schedule Impact)', category: 'Module 12', action: () => handleNavigate('variations') },
    { title: 'Procurement & Purchase Orders (RFQ, Vendor Comparison, POs)', category: 'Module 13', action: () => handleNavigate('procurement') },
    { title: 'Contractors & Labour Management (Subcontracts, Work Certification)', category: 'Module 15', action: () => handleNavigate('contractors') },
    { title: 'Quality & Snag Management (Defects Matrix & Rectifications)', category: 'Module 19', action: () => handleNavigate('snags') },
    { title: 'Handover & Warranty Management (Handover Pack, OEM Warranties)', category: 'Module 20', action: () => handleNavigate('handover') },
    { title: 'Customer Portal (Client Approval & Milestone Payment View)', category: 'Module 21', action: () => handleNavigate('portal') },
    { title: 'All 22 Project Reports Hub (Executive, Management & Operational MIS)', category: 'Reports', action: () => handleNavigate('reports') },
    { title: 'EVM Earned Value Management & Project Health (CPI, SPI, EAC, VAC)', category: 'Management Reports', action: () => handleNavigate('reports') },
    { title: 'Project Cash Flow Projection & Milestone Billing Realization', category: 'Management Reports', action: () => handleNavigate('reports') },
    { title: 'WBS Level Cost Variance & Budget Overrun Early Warning Register', category: 'Management Reports', action: () => handleNavigate('reports') },
    { title: 'Statutory GST ITC Reconciliation & GSTR-2B Verification Report', category: 'Management Reports', action: () => handleNavigate('reports') },
    { title: 'Daily Progress Report (DPR) & Site Activity Log Summary', category: 'User & Operations Reports', action: () => handleNavigate('reports') },
    { title: 'Comprehensive Snag List Resolution & Zero-Defect Handover Report', category: 'User & Operations Reports', action: () => handleNavigate('reports') },
    { title: 'Subcontractor Measurement & Work Certification Ledger', category: 'User & Operations Reports', action: () => handleNavigate('reports') },
    { title: 'Material Consumption Reconciliation & Site Wastage Report', category: 'User & Operations Reports', action: () => handleNavigate('reports') },
    { title: 'Executive D365 Role Center & Management Dashboards', category: 'Module 25', action: () => handleNavigate('reports') },
    { title: 'Job Card (PRJ-SKYLINE-1402)', category: 'Pages', action: () => handleNavigate('general') },
    { title: 'Job Planning Lines (BOQ Takeoff Matrix)', category: 'Pages', action: () => handleNavigate('boq') },
    { title: 'Master Section & Operations Hub (Items, Customers, Vendors, Resources)', category: 'Masters', action: () => handleNavigate('masters') },
    { title: 'Customer Master Register (Table 18 Customer)', category: 'Masters', action: () => handleNavigate('masters') },
    { title: 'Vendor & Subcontractor Directory (Table 23 Vendor)', category: 'Masters', action: () => handleNavigate('masters') },
    { title: 'Resource & Labour Crew Wages (Table 156 Resource)', category: 'Masters', action: () => handleNavigate('masters') },
    { title: 'Items & Master Rate Price List (Table 27 Item)', category: 'Masters', action: () => handleNavigate('masters') },
    { title: 'WBS Trade Packages & Wastage Norms', category: 'Masters', action: () => handleNavigate('masters') },
    { title: 'UOM & Indian GST Tax Schedules', category: 'Masters', action: () => handleNavigate('masters') },
    { title: 'Site Survey & Spatial Dimensions', category: 'Pages', action: () => handleNavigate('survey') },
    { title: 'Cost Accounting & Overhead Budget Sheet', category: 'Pages', action: () => handleNavigate('budget') },
    { title: 'Customer Sales Quotation & Payment Milestones', category: 'Pages', action: () => handleNavigate('quotation') },
    { title: 'Company Setup Master (Finance) - Legal Entity, Multi-State GST, Bank Accounts, Number Series & GL Mappings', category: 'Finance Setup', action: () => handleNavigate('company_setup') },
    { title: 'User Administration & Security Role Assignment (Table 2000000120 User)', category: 'Administration', action: () => handleNavigate('users') },
    { title: 'Audit Trail & Enterprise System Telemetry', category: 'Reports', action: () => onOpenAuditLogs() },
    { title: 'Inspect Pages and Data (Ctrl+Alt+F1)', category: 'Tools', action: () => onOpenInspectData() },
    { title: 'System Architecture & Capabilities Statement', category: 'Tools', action: () => onOpenStatusModal() },
  ];

  const filteredTellMe = tellMeItems.filter(item => 
    item.title.toLowerCase().includes(tellMeQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(tellMeQuery.toLowerCase())
  );

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-[#F3E8FF] text-[#6B21A8] border-[#D8B4FE]';
      case 'ESTIMATOR':
        return 'bg-[#EFF6FC] text-[#0F6CBD] border-[#C7E0F4]';
      case 'PROJECT_MANAGER':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
      case 'SITE_ENGINEER':
        return 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]';
      case 'CLIENT':
        return 'bg-[#FDE7E9] text-[#A80000] border-[#F9C6CA]';
      default:
        return 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]';
    }
  };

  const getModuleBreadcrumb = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return { category: 'Role Center', name: 'Role Center Dashboard', code: 'ROLE' };
      case 'general':
        return { category: 'Jobs & Projects', name: 'Active Job Card', code: 'JOB' };
      case 'projects':
        return { category: 'Jobs & Projects', name: 'All Projects Register', code: 'REG' };
      case 'project_hub':
        return { category: 'Execution & Ops', name: 'Project Management Hub & Tasks', code: 'M29' };
      case 'timesheets':
        return { category: 'Execution & Ops', name: 'Employee Timesheet Log', code: 'M27' };
      case 'resources':
        return { category: 'Execution & Ops', name: 'Resource Deployment Matrix', code: 'M28' };
      case 'crm':
        return { category: 'Enquiry & CRM', name: 'CRM & Lead Funnel', code: 'M01' };
      case 'contacts':
        return { category: 'Enquiry & CRM', name: 'Customers & Contacts Directory', code: 'M02' };
      case 'survey':
        return { category: 'Survey & Design', name: 'Site Survey & Laser Scan Hub', code: 'M03' };
      case 'drawings':
      case 'architecture':
        return { category: 'Survey & Design', name: 'Architectural Drawings & 3D Renders', code: 'M04' };
      case 'materials':
        return { category: 'Survey & Design', name: 'Material & Sample Approvals', code: 'M05' };
      case 'masters':
      case 'rates':
        return { category: 'Masters & Catalog', name: 'Master Schedule of Rates', code: 'M06' };
      case 'boq':
        return { category: 'Estimation & BOQ', name: 'BOQ Estimating Engine', code: 'M07' };
      case 'budget':
        return { category: 'Estimation & BOQ', name: 'Cost Budget & Margin Analysis', code: 'M08' };
      case 'traceability':
        return { category: 'Estimation & BOQ', name: 'End-to-End Cost Traceability', code: 'M09' };
      case 'quotation':
        return { category: 'Commercial & Sales', name: 'Customer Sales Quotations & VE', code: 'M10' };
      case 'contracts':
        return { category: 'Commercial & Contracts', name: 'Commercial Contracts & Terms', code: 'M11' };
      case 'variations':
        return { category: 'Commercial & Contracts', name: 'Variation Orders & Scope Changes', code: 'M12' };
      case 'schedule':
        return { category: 'Execution & Site Ops', name: 'Site Execution & Master WBS', code: 'M13' };
      case 'site_execution':
        return { category: 'Execution & Site Ops', name: 'Daily Progress Reports (DPR)', code: 'M14' };
      case 'procurement':
        return { category: 'Execution & Site Ops', name: 'Procurement & Purchase Orders', code: 'M15' };
      case 'inventory':
        return { category: 'Execution & Site Ops', name: 'Material Inward & GRN Stock', code: 'M16' };
      case 'contractors':
      case 'subcontractors':
        return { category: 'Execution & Site Ops', name: 'Subcontractors & Joint MB', code: 'M17' };
      case 'snags':
        return { category: 'Quality & Handover', name: 'Quality Audits & Snags Register', code: 'M18' };
      case 'billing':
        return { category: 'Billing & Finance', name: 'Customer Billing & RA Invoices', code: 'M19' };
      case 'finance':
        return { category: 'Billing & Finance', name: 'Financial Ledger & Cash Flow', code: 'M20' };
      case 'handover':
        return { category: 'Quality & Handover', name: 'Project Handover & Keys Package', code: 'M21' };
      case 'warranty':
        return { category: 'Quality & Handover', name: 'Warranty Registry & DLP', code: 'M22' };
      case 'portal':
        return { category: 'Client Care', name: 'Customer Satisfaction Portal', code: 'M23' };
      case 'compliance':
        return { category: 'Governance', name: 'Compliance, Licenses & PTW', code: 'M24' };
      case 'documents':
        return { category: 'Governance', name: 'Documents & Transmittals Cloud Store', code: 'M25' };
      case 'reports':
        return { category: 'MIS & Analytics', name: 'Mandatory Reports Hub (22 Reports)', code: 'M26' };
      case 'ai_workspace':
        return { category: 'Intelligence', name: 'Agentic AI Copilot Action Center', code: 'AI' };
      case 'users':
        return { category: 'Administration', name: 'User Administration & Security', code: 'RBAC' };
      default:
        return { category: 'ERP Modules', name: tab.replace(/_/g, ' ').toUpperCase(), code: 'MOD' };
    }
  };

  const breadcrumb = getModuleBreadcrumb(activeTab);

  return (
    <header className="erp-shell shrink-0 sticky top-0 z-40 select-none shadow-xs">
      {/* 1. TOPMOST ENTERPRISE SHELL HEADER */}
      <div className="bg-[#0B1528] text-white flex items-center justify-between px-3 sm:px-4 py-2 text-xs border-b border-slate-800/60">
        {/* Left: 9-Dot App Launcher + Dynamics 365 Brand + Company */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 9-dot Waffle */}
          <div className="relative">
            <button
              onClick={() => setWaffleOpen(!waffleOpen)}
              className="p-1.5 rounded hover:bg-[#001833] text-white/90 hover:text-white transition cursor-pointer"
              title="Microsoft 365 App Launcher"
            >
              <Grid className="h-4 w-4" />
            </button>

            {/* Waffle Dropdown */}
            {waffleOpen && (
              <ViewportMenu className="absolute left-0 mt-2 w-72 bg-white text-[#201F1E] rounded-md shadow-2xl border border-[#EDEBE9] p-3 z-50 animate-in fade-in duration-150">
                <div className="text-xs font-semibold text-[#605E5C] mb-2 uppercase tracking-wider">
                  Microsoft 365 Apps
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-[#EFF6FC] text-[#0F6CBD] rounded hover:bg-[#DEECF9] cursor-pointer font-medium" onClick={() => { setWaffleOpen(false); handleNavigate('dashboard'); }}>
                    <img src="/images/buildstorys-logo-icon.png" alt="" className="h-6 w-6 object-contain mx-auto mb-1" />
                    <span>BuildStorys</span>
                  </div>
                  <div className="p-2 hover:bg-[#F3F2F1] rounded cursor-pointer">
                    <FileSpreadsheet className="h-6 w-6 mx-auto mb-1 text-[#107C41]" />
                    <span>Excel</span>
                  </div>
                  <div className="p-2 hover:bg-[#F3F2F1] rounded cursor-pointer">
                    <FileText className="h-6 w-6 mx-auto mb-1 text-[#0078D4]" />
                    <span>Word</span>
                  </div>
                  <div className="p-2 hover:bg-[#F3F2F1] rounded cursor-pointer">
                    <Layers className="h-6 w-6 mx-auto mb-1 text-[#F2C811]" />
                    <span>Power BI</span>
                  </div>
                  <div className="p-2 hover:bg-[#F3F2F1] rounded cursor-pointer">
                    <Database className="h-6 w-6 mx-auto mb-1 text-[#038387]" />
                    <span>SharePoint</span>
                  </div>
                  <div className="p-2 hover:bg-[#F3F2F1] rounded cursor-pointer">
                    <Briefcase className="h-6 w-6 mx-auto mb-1 text-[#6264A7]" />
                    <span>Teams</span>
                  </div>
                </div>
              </ViewportMenu>
            )}
          </div>

          {/* BuildStorys Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('dashboard')} title="BuildStorys ERP - Click to open Role Center Dashboard">
            <img src="/images/buildstorys-logo-icon.png" alt="Build Storys" className="h-6 w-6 object-contain bg-white rounded-[4px] p-0.5" />
            <span className="font-semibold tracking-tight text-[13px] text-white">BuildStorys</span>
            <span className="text-[#89BBE9] font-light text-[13px]">|</span>
            <span className="font-normal text-[13px] text-white/95">ERP</span>
          </div>

          {/* Company & Environment Badge */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#001833]/80 hover:bg-[#001833] border border-white/15 text-[11px] text-[#C7E0F4] transition"
            >
              <span className="font-semibold text-white">BUILD STORYS (DELHI NCR)</span>
              <span className="text-[10px] bg-[#0F6CBD] text-white px-1 rounded">PROD</span>
              <ChevronDown className="h-3 w-3 text-white/70" />
            </button>

            {companyDropdownOpen && (
              <ViewportMenu className="absolute left-0 mt-1 w-64 bg-white text-[#201F1E] rounded shadow-xl border border-[#EDEBE9] p-2 z-50 text-xs">
                <div className="px-2 py-1 text-[11px] font-semibold text-[#605E5C] uppercase">Companies</div>
                <div className="p-1.5 bg-[#EFF6FC] text-[#0F6CBD] font-semibold rounded flex justify-between items-center">
                  <span>Build Storys India Ltd (Delhi NCR)</span>
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div className="p-1.5 hover:bg-[#F3F2F1] rounded text-[#605E5C] cursor-not-allowed">
                  <span>Build Storys Turnkey Sandbox</span>
                </div>
                <div className="pt-2 mt-1 border-t border-[#EDEBE9]">
                  <button
                    type="button"
                    onClick={() => {
                      setCompanyDropdownOpen(false);
                      handleNavigate('company_setup');
                    }}
                    className="w-full text-left p-1.5 hover:bg-[#EFF6FC] text-[#0F6CBD] font-semibold rounded flex items-center justify-between text-[11px] transition"
                  >
                    <span>Company Setup Master (Finance)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </ViewportMenu>
            )}
          </div>
        </div>

        {/* Center: "Tell Me what you want to do (Alt+Q)" search input */}
        <div className="flex-1 max-w-md mx-4">
          <button
            onClick={() => setTellMeOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/70 text-xs transition cursor-pointer shadow-2xs group"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-sky-400 group-hover:text-sky-300 transition" />
              <span className="truncate text-slate-300 group-hover:text-white">Tell me what you want to do...</span>
            </span>
            <kbd className="hidden sm:inline-block font-mono text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300 font-semibold">
              Alt+Q
            </kbd>
          </button>
        </div>

        {/* Right: Copilot, Notifications, Settings, User */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Copilot Pill */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-[#0F6CBD] text-white text-[11px] font-medium shadow-2xs">
            <Sparkles className="h-3 w-3 text-[#C7E0F4]" />
            <span>Copilot Active</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-1.5 rounded hover:bg-[#001833] text-white/90 hover:text-white transition relative"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#D13438] ring-1 ring-[#002050]" />
            </button>

            {notificationsOpen && (
              <ViewportMenu className="absolute right-0 mt-2 w-80 bg-white text-[#201F1E] rounded shadow-2xl border border-[#EDEBE9] p-3 z-50 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#EDEBE9]">
                  <span className="font-semibold text-xs text-[#201F1E]">Notifications</span>
                  <span className="text-[11px] text-[#0F6CBD] hover:underline cursor-pointer">Clear all</span>
                </div>
                <div className="divide-y divide-[#EDEBE9] py-1">
                  <div className="py-2">
                    <div className="font-medium text-[#201F1E] text-xs">AI Draft Takeoff Generated</div>
                    <div className="text-[11px] text-[#605E5C]">15 items generated for Skyline 1402 based on Hinglish brief.</div>
                  </div>
                  <div className="py-2">
                    <div className="font-medium text-[#201F1E] text-xs">Estimator Baseline Approved</div>
                    <div className="text-[11px] text-[#605E5C]">Rajesh Sharma frozen Rev 1 baseline for cost control.</div>
                  </div>
                  <div className="py-2">
                    <div className="font-medium text-[#201F1E] text-xs">Regional Rate Index Q3 Applied</div>
                    <div className="text-[11px] text-[#605E5C]">Delhi-NCR civil &amp; joinery rates benchmarked.</div>
                  </div>
                </div>
              </ViewportMenu>
            )}
          </div>

          {/* Settings / My Settings */}
          <div className="relative">
            <button
              onClick={() => setMySettingsOpen(!mySettingsOpen)}
              className="p-1.5 rounded hover:bg-[#001833] text-white/90 hover:text-white transition"
              title="My Settings"
            >
              <Settings className="h-4 w-4" />
            </button>

            {mySettingsOpen && (
              <ViewportMenu className="absolute right-0 mt-2 w-72 bg-white text-[#201F1E] rounded shadow-2xl border border-[#EDEBE9] p-3 z-50 text-xs">
                <div className="font-semibold text-xs text-[#201F1E] pb-2 border-b border-[#EDEBE9]">
                  My Settings (BuildStorys ERP)
                </div>
                <div className="py-2 space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] text-[#605E5C] block">Role Center:</span>
                    <span className="font-medium text-[#201F1E]">Senior Project Estimator &amp; Quantity Surveyor</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#605E5C] block">Company:</span>
                    <span className="font-medium text-[#201F1E]">Build Storys India Ltd</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#605E5C] block">Work Date:</span>
                    <span className="font-medium text-[#201F1E]">11-Sep-2026 (Q3 2026)</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#605E5C] block">Region &amp; Currency:</span>
                    <span className="font-medium text-[#201F1E]">India (en-IN) • INR (₹)</span>
                  </div>
                </div>
                <div className="pt-2.5 mt-2 border-t border-[#EDEBE9]">
                  <button
                    id="my-settings-profile-btn"
                    onClick={() => {
                      setMySettingsOpen(false);
                      onOpenProfile?.('security');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded bg-[#0F6CBD] text-white font-semibold text-xs hover:bg-[#0B5A9D] transition shadow-2xs"
                  >
                    <Key className="h-3.5 w-3.5 text-white" />
                    <span>Change Password &amp; Profile</span>
                  </button>
                </div>
              </ViewportMenu>
            )}
          </div>

          {/* Customer Training Manual */}
          <button
            onClick={onOpenTrainingManual}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0F6CBD] hover:bg-[#0c5999] text-white transition text-xs font-semibold shadow-xs cursor-pointer"
            title="Customer Training & Operations Manual (Step-by-Step Curriculum)"
          >
            <GraduationCap className="h-3.5 w-3.5 text-sky-200" />
            <span className="hidden sm:inline text-xs font-semibold">Training Guide</span>
          </button>

          {/* Help icon */}
          <button
            onClick={onOpenStatusModal}
            className="p-1.5 rounded hover:bg-[#001833] text-white/90 hover:text-white transition"
            title="System Capabilities Statement"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* User Avatar & Role Switcher */}
          <div className="relative ml-1">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 p-1 rounded hover:bg-[#001833] transition"
            >
              <div className="h-7 w-7 rounded-full bg-[#0F6CBD] text-white font-semibold text-xs flex items-center justify-center ring-1 ring-white/30 overflow-hidden shrink-0">
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
                <div className="text-[11px] font-semibold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-[#89BBE9] leading-tight">{currentUser.role ? currentUser.role.replace('_', ' ') : ''}</div>
              </div>
              <ChevronDown className="h-3 w-3 text-white/70" />
            </button>

            {userDropdownOpen && (
              <ViewportMenu className="absolute right-0 mt-2 w-72 bg-white text-[#201F1E] rounded shadow-2xl border border-[#EDEBE9] p-2 z-50 text-xs">
                <div className="p-2.5 border-b border-[#EDEBE9] flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-[#0F6CBD] text-white font-semibold text-xs flex items-center justify-center ring-1 ring-black/10 overflow-hidden shrink-0">
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
                    <div className="font-bold text-[#201F1E] truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-[#605E5C] truncate">{currentUser.email}</div>
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getRoleBadgeStyle(currentUser.role || '')}`}>
                      {currentUser.role || ''}
                    </span>
                  </div>
                </div>

                {/* Direct Personal Profile & Password Actions for every user */}
                <div className="p-1.5 border-b border-[#EDEBE9] bg-[#FAF9F8] rounded my-1.5 space-y-1">
                  <button
                    id="d365-menu-profile-btn"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenProfile?.('profile');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-white hover:bg-[#F3F2F1] text-[#201F1E] font-semibold text-xs border border-[#EDEBE9] shadow-2xs transition"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-3.5 w-3.5 text-[#0F6CBD]" />
                      <span>My Profile &amp; Photo</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-[#8A8886]" />
                  </button>
                  <button
                    id="d365-menu-change-password-btn"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenProfile?.('security');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#EFF6FC] hover:bg-[#DEECF9] text-[#0F6CBD] font-semibold text-xs border border-[#C7E0F4] transition"
                  >
                    <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-[#0F6CBD]" />
                      <span>Update Password</span>
                    </div>
                    <span className="text-[10px] bg-white px-1.5 py-0.2 rounded border border-[#C7E0F4] font-medium text-[#0F6CBD]">Security Vault</span>
                  </button>
                </div>

                <div className="px-2 py-1 text-[10px] font-semibold uppercase text-[#8A8886] tracking-wider mt-1">
                  Switch Active Role (RBAC)
                </div>
                {allUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-1.5 rounded text-left transition gap-2 ${
                      currentUser.id === user.id ? 'bg-[#EFF6FC] text-[#0F6CBD] font-semibold' : 'hover:bg-[#F3F2F1]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-6 w-6 rounded-full bg-[#0F6CBD] text-white text-[10px] font-bold flex items-center justify-center overflow-hidden shrink-0">
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
                        <div className="font-medium text-[#201F1E] truncate text-xs">{user.name}</div>
                        <div className="text-[10px] text-[#605E5C] truncate">{user.role ? user.role.replace('_', ' ') : ''}</div>
                      </div>
                    </div>
                    {currentUser.id === user.id && <Check className="h-3.5 w-3.5 text-[#0F6CBD] shrink-0" />}
                  </button>
                ))}

                <div className="pt-2 mt-2 border-t border-[#EDEBE9] space-y-1">
                  {onLogout && (
                    <button
                      id="d365-menu-logout-btn"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 p-2 rounded bg-[#B71C1C] text-white font-semibold hover:bg-[#9B1111] transition text-xs shadow-xs cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5 text-white" />
                      <span>Sign Out &amp; Terminate Session</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavigate('users');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 p-1.5 rounded bg-[#EFF6FC] text-[#0F6CBD] font-semibold hover:bg-[#DEECF9] transition text-xs border border-[#C7E0F4]"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span>User Master Setup</span>
                  </button>
                </div>
              </ViewportMenu>
            )}
          </div>

          {/* Dedicated Header Logout Button */}
          {onLogout && (
            <button
              id="d365-header-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white font-semibold text-xs transition shadow-2xs border border-rose-500/40 ml-1 cursor-pointer"
              title="Sign out & Terminate Session"
            >
              <LogOut className="h-3.5 w-3.5 text-white" />
              <span className="hidden sm:inline font-medium">Log out</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TOP HORIZONTAL MENU BAR (All Stages, Modules & Fast Finder) */}
      <TopMenuBar
        activeTab={activeTab}
        onNavigateTab={handleNavigate}
        activeProject={activeProject}
        projects={projects}
        onSelectProject={(proj) => onSelectProject(proj.id)}
        currentUser={currentUser}
        onOpenAuditLogs={onOpenAuditLogs}
        onOpenInspectData={onOpenInspectData}
        onOpenStatusModal={onOpenStatusModal}
        onOpenTrainingManual={onOpenTrainingManual}
        onOpenProfile={onOpenProfile}
      />

      {/* 3. BUILDSTORYS ENACT360 BREADCRUMB & CONTEXT SUB-HEADER */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center justify-between text-xs relative z-20 min-w-0 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          {/* Active Module Breadcrumb (Clean, single-tier hierarchy) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0 text-xs">
            <button
              onClick={() => handleNavigate('dashboard')}
              className="text-slate-400 hover:text-slate-700 font-medium transition cursor-pointer"
            >
              BuildStorys ERP
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-500 font-medium hidden md:inline truncate">
              {breadcrumb.category}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden md:inline shrink-0" />
            <span className="font-bold text-slate-900 truncate flex items-center gap-1.5">
              <span>{breadcrumb.name}</span>
              {breadcrumb.code && (
                <span className="bg-[#EFF6FC] text-[#0F6CBD] border border-[#C7E0F4] text-[10px] font-mono px-1.5 py-0.5 rounded-sm font-bold">
                  {breadcrumb.code}
                </span>
              )}
            </span>
          </nav>
        </div>

        {/* Right side: Active Project pill & contextual workspace actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Job badge with interactive Project Switcher Dropdown */}
          <div className="relative" ref={projectMenuRef}>
            <button
              onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] transition cursor-pointer"
              title="Click to view all projects and switch active project"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-mono font-bold text-slate-800">{activeProject ? activeProject.projectCode : 'Select Project'}</span>
              <span className="text-slate-300 hidden lg:inline">•</span>
              <span className="text-slate-600 truncate max-w-[140px] hidden lg:inline">{activeProject ? activeProject.title : 'All Projects'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {isProjectMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 mb-1">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-emerald-600" />
                    <span>Projects ({projects.length})</span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    MongoDB Atlas
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProject(p.id);
                        setIsProjectMenuOpen(false);
                      }}
                      className={`flex w-full items-start justify-between rounded-lg p-2 text-left text-xs transition ${
                        activeProject?.id === p.id ? 'bg-blue-50/80 text-blue-900 border border-blue-200/60 font-medium' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-slate-900 truncate">{p.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono font-bold text-slate-700">{p.projectCode}</span>
                          <span>•</span>
                          <span className="truncate">{p.clientName || 'Client'}</span>
                          {p.city && <span>({p.city})</span>}
                        </div>
                      </div>
                      {activeProject?.id === p.id && <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
                    </button>
                  ))}
                </div>
                <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      handleNavigate('projects');
                      setIsProjectMenuOpen(false);
                    }}
                    className="w-full text-center py-1 text-xs font-semibold text-[#0F6CBD] hover:underline"
                  >
                    View All in Projects Register →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export to Excel button */}
          {onExportToExcel && ['boq', 'general', 'budget'].includes(activeTab) && (
            <button
              onClick={onExportToExcel}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 rounded-md text-xs border border-emerald-200 transition cursor-pointer font-semibold"
              title="Export Job Planning Lines to Microsoft Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">Export Excel</span>
            </button>
          )}

          {/* FactBox Toggle */}
          {onToggleFactBox && ['general', 'boq', 'budget', 'quotation', 'survey'].includes(activeTab) && (
            <button
              onClick={onToggleFactBox}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition cursor-pointer font-medium ${
                isFactBoxOpen
                  ? 'bg-slate-100 text-slate-800 border-slate-300 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
              title={isFactBoxOpen ? 'Hide FactBox details pane' : 'Show FactBox details pane'}
            >
              <Info className="w-3.5 h-3.5 text-[#0F6CBD]" />
              <span className="hidden xl:inline">FactBox</span>
            </button>
          )}

          {/* Diagnostics & Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md text-xs border border-slate-200/90 transition cursor-pointer font-medium"
              title="Enterprise Diagnostics & Technical Tools"
            >
              <Wrench className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Tools</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {toolsMenuOpen && (
              <ViewportMenu className="absolute right-0 mt-1.5 w-60 bg-white text-[#201F1E] rounded-lg shadow-xl border border-[#EDEBE9] py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Enterprise Diagnostics
                </div>
                <button
                  onClick={() => {
                    setToolsMenuOpen(false);
                    onOpenAuditLogs();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between group cursor-pointer"
                >
                  <span className="font-medium text-slate-700 group-hover:text-[#0F6CBD]">Audit Trail & Telemetry</span>
                  <span className="text-[10px] text-slate-400 font-mono">Logs</span>
                </button>
                <button
                  onClick={() => {
                    setToolsMenuOpen(false);
                    onOpenInspectData();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between group cursor-pointer"
                >
                  <span className="font-medium text-slate-700 group-hover:text-[#0F6CBD]">Page & Data Inspector</span>
                  <kbd className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-mono">Ctrl+Alt+F1</kbd>
                </button>
                <button
                  onClick={() => {
                    setToolsMenuOpen(false);
                    onOpenStatusModal();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between group cursor-pointer border-t border-slate-100"
                >
                  <span className="font-medium text-slate-700 group-hover:text-[#0F6CBD]">System Capabilities</span>
                  <span className="text-[10px] text-slate-400">Specs</span>
                </button>
              </ViewportMenu>
            )}
          </div>
        </div>
      </div>

      {/* TELL ME WHAT YOU WANT TO DO MODAL (Alt+Q) */}
      {tellMeOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-2xs">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-2xl border border-[#EDEBE9] overflow-hidden animate-in fade-in duration-150">
            <div className="p-3 bg-[#002050] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Search className="h-4 w-4 text-[#89BBE9]" />
                <span>Tell me what you want to do</span>
              </div>
              <kbd className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[#C7E0F4]">ESC to close</kbd>
            </div>

            <div className="p-3 border-b border-[#EDEBE9] bg-[#FAF9F8] space-y-2">
              <input
                type="text"
                autoFocus
                placeholder="Search pages, reports, actions or tools (e.g. BOQ, Budget, Master Rates)..."
                value={tellMeQuery}
                onChange={e => setTellMeQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') setTellMeOpen(false);
                  if (e.key === 'Enter' && filteredTellMe.length > 0) {
                    filteredTellMe[0].action();
                    setTellMeOpen(false);
                  }
                }}
                className="w-full rounded border border-[#8A8886] bg-white px-3 py-2 text-sm text-[#201F1E] focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] focus:outline-hidden"
              />

              {/* Quick Jump Suggestions when query is empty */}
              {!tellMeQuery && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold shrink-0">Popular:</span>
                  {[
                    { label: 'Customer Training', action: () => onOpenTrainingManual?.() },
                    { label: 'Role Center', action: () => handleNavigate('dashboard') },
                    { label: 'BOQ Estimating', action: () => handleNavigate('boq') },
                    { label: 'Site DPR', action: () => handleNavigate('site_execution') },
                    { label: 'Purchase Orders', action: () => handleNavigate('procurement') },
                    { label: 'AI Copilot', action: () => handleNavigate('ai_workspace') }
                  ].map((quick, qIdx) => (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => {
                        quick.action();
                        setTellMeOpen(false);
                      }}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-700 hover:bg-blue-50 hover:text-[#0F6CBD] hover:border-blue-300 transition shrink-0 cursor-pointer font-medium"
                    >
                      {quick.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-[#EDEBE9] p-1">
              {filteredTellMe.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    item.action();
                    setTellMeOpen(false);
                  }}
                  className="p-2.5 hover:bg-[#EFF6FC] rounded cursor-pointer flex items-center justify-between group transition"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#201F1E] group-hover:text-[#0F6CBD]">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-[#605E5C]">{item.category}</div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-[#8A8886] group-hover:text-[#0F6CBD]" />
                </div>
              ))}
              {filteredTellMe.length === 0 && (
                <div className="py-8 text-center text-xs text-[#605E5C]">
                  No matching actions or pages found for &quot;{tellMeQuery}&quot;
                </div>
              )}
            </div>

            <div className="p-2 bg-[#F3F2F1] text-[11px] text-[#605E5C] flex justify-between items-center border-t border-[#EDEBE9]">
              <span>Search in BuildStorys ERP</span>
              <button
                onClick={() => setTellMeOpen(false)}
                className="px-2 py-0.5 bg-white border border-[#D2D0CE] rounded text-xs"
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
