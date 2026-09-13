import { ViewportMenu } from './ViewportMenu';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  HelpCircle, 
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
  BarChart3
} from 'lucide-react';
import { UserSession, ProjectRecord } from '../types/erp';

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
  onOpenLoginPortal?: () => void;
  onLogout?: () => void;
  onOpenProfile?: (initialTab?: 'profile' | 'security') => void;
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
  onOpenLoginPortal,
  onLogout,
  onOpenProfile
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
  const [navDropdownOpen, setNavDropdownOpen] = useState<string | null>(null);
  const navDropdownRef = useRef<HTMLDivElement>(null);

  // Close nav dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target as Node)) {
        setNavDropdownOpen(null);
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
    { title: 'Role Center Dashboard (My Assigned Role & Responsibilities)', category: 'Role Center', action: () => handleNavigate('dashboard') },
    { title: 'BOQ Cost Traceability Matrix (BOQ -> Budget -> PO/WO -> Actual Cost)', category: 'Core Finance', action: () => handleNavigate('traceability') },
    { title: 'Agentic AI Copilot Action Center (Review Suggestions & Approve)', category: 'AI Copilot', action: () => handleNavigate('ai_workspace') },
    { title: 'CRM & Sales Pipeline (Leads, Briefs, Site Visits, Lost Reasons)', category: 'Module 1', action: () => handleNavigate('crm') },
    { title: 'Customer & Contact Management (Multi-Site Directory, Billing Profiles)', category: 'Module 2', action: () => handleNavigate('contacts') },
    { title: 'Design & Drawing Management (CAD, 3D Renders, Revisions, Approvals)', category: 'Module 4', action: () => handleNavigate('drawings') },
    { title: 'Material & Finish Selection Palette (Samples, Brands, Approvals)', category: 'Module 5', action: () => handleNavigate('materials') },
    { title: 'Contracts & Work Orders (Retention 5%, DLP, Commercial Terms)', category: 'Module 9', action: () => handleNavigate('contracts') },
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

  return (
    <header className="erp-shell sticky top-0 z-40 select-none shadow-xs">
      {/* 1. TOPMOST MICROSOFT OFFICE 365 / DYNAMICS 365 SHELL BAR */}
      <div className="bg-[#002050] text-white flex items-center justify-between px-3 py-1.5 text-xs">
        {/* Left: 9-Dot App Launcher + Dynamics 365 Brand + Company */}
        <div className="flex items-center gap-3">
          {/* 9-dot Waffle */}
          <div className="relative">
            <button
              onClick={() => setWaffleOpen(!waffleOpen)}
              className="p-1.5 rounded hover:bg-[#001833] text-white/90 hover:text-white transition"
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
                    <span>Enact360</span>
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

          {/* BuildStorys Logo & Enact360 text */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('dashboard')} title="BuildStorys Enact360 - Click to open Role Center Dashboard">
            <img src="/images/buildstorys-logo-icon.png" alt="Build Storys" className="h-6 w-6 object-contain bg-white rounded-[4px] p-0.5" />
            <span className="font-semibold tracking-tight text-[13px] text-white">BuildStorys</span>
            <span className="text-[#89BBE9] font-light text-[13px]">|</span>
            <span className="font-normal text-[13px] text-white/95">Enact360</span>
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
              </ViewportMenu>
            )}
          </div>
        </div>

        {/* Center: "Tell Me what you want to do (Alt+Q)" search input */}
        <div className="flex-1 max-w-md mx-4">
          <button
            onClick={() => setTellMeOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1 rounded bg-[#001833]/90 hover:bg-[#001833] text-white/75 hover:text-white border border-white/20 text-xs transition"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-[#89BBE9]" />
              <span className="truncate">Tell me what you want to do...</span>
            </span>
            <kbd className="hidden sm:inline-block font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[#C7E0F4]">
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
                  My Settings (Enact360)
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

          {/* Quick Profile & Password button */}
          <button
            id="d365-header-quick-profile-btn"
            onClick={() => onOpenProfile?.('security')}
            className="p-1.5 rounded hover:bg-[#001833] text-white/90 hover:text-white transition flex items-center gap-1"
            title="Update Password & User Profile"
          >
            <Key className="h-4 w-4" />
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
              <div className="h-7 w-7 rounded-full bg-[#0F6CBD] text-white font-semibold text-xs flex items-center justify-center ring-1 ring-white/30">
                {currentUser.avatar}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-[11px] font-semibold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-[#89BBE9] leading-tight">{currentUser.role ? currentUser.role.replace('_', ' ') : ''}</div>
              </div>
              <ChevronDown className="h-3 w-3 text-white/70" />
            </button>

            {userDropdownOpen && (
              <ViewportMenu className="absolute right-0 mt-2 w-72 bg-white text-[#201F1E] rounded shadow-2xl border border-[#EDEBE9] p-2 z-50 text-xs">
                <div className="p-2 border-b border-[#EDEBE9]">
                  <div className="font-bold text-[#201F1E]">{currentUser.name}</div>
                  <div className="text-[11px] text-[#605E5C]">{currentUser.email}</div>
                  <span className={`mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getRoleBadgeStyle(currentUser.role || '')}`}>
                    {currentUser.role || ''}
                  </span>
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
                    className={`w-full flex items-center justify-between p-1.5 rounded text-left transition ${
                      currentUser.id === user.id ? 'bg-[#EFF6FC] text-[#0F6CBD] font-semibold' : 'hover:bg-[#F3F2F1]'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-[#201F1E]">{user.name}</div>
                      <div className="text-[10px] text-[#605E5C]">{user.role ? user.role.replace('_', ' ') : ''}</div>
                    </div>
                    {currentUser.id === user.id && <Check className="h-3.5 w-3.5 text-[#0F6CBD]" />}
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
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#B71C1C] hover:bg-[#9B1111] text-white font-semibold text-xs transition shadow-2xs border border-red-400/40 ml-1 cursor-pointer"
              title="Sign out & Terminate Session"
            >
              <LogOut className="h-3.5 w-3.5 text-white" />
              <span className="hidden sm:inline font-medium">Log out</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. BUILDSTORYS ENACT360 ROLE CENTER NAVIGATION RIBBON */}
      <div className="bg-white border-b border-[#E1DFDD] px-3 sm:px-4 py-1 flex items-center justify-between text-xs relative z-40 min-w-0 shadow-[0_1px_3px_rgba(0,0,0,0.03)]" ref={navDropdownRef}>
        <nav className="shell-navigation min-w-0 flex-1 flex flex-wrap items-center gap-1 py-1">
          {/* TAB 0: ROLE DASHBOARD */}
          <button
            onClick={() => {
              setNavDropdownOpen(null);
              handleNavigate('dashboard');
            }}
            className={`px-3 py-1 text-xs font-semibold rounded transition flex items-center gap-1.5 shrink-0 shadow-2xs ${
              activeTab === 'dashboard'
                ? 'bg-[#002050] text-white ring-1 ring-[#002050]'
                : 'bg-slate-100/90 text-slate-700 hover:bg-[#EFF6FC] hover:text-[#0F6CBD] border border-slate-200'
            }`}
            title={`Open Role Center Dashboard tailored to your assigned role (${currentUser.role})`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
            <span>Role Dashboard</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
              activeTab === 'dashboard' ? 'bg-white/20 text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}>
              {currentUser.role}
            </span>
          </button>

          {/* TAB 1: JOBS (PROJECTS) */}
          <div className="relative">
            <div className={`inline-flex items-center rounded text-xs font-semibold transition ${
              activeTab === 'general' || activeTab === 'projects'
                ? 'bg-[#EFF6FC] text-[#0F6CBD] ring-1 ring-[#0F6CBD]/30'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}>
              <button
                onClick={() => {
                  setNavDropdownOpen(null);
                  handleNavigate('general');
                }}
                className="px-2.5 py-1 text-xs font-semibold focus:outline-none"
              >
                Jobs (Projects)
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNavDropdownOpen(prev => prev === 'jobs' ? null : 'jobs');
                }}
                className="px-1 py-1 hover:bg-[#DEECF9] rounded-r text-[#605E5C] hover:text-[#0F6CBD]"
                title="Jobs Menu"
              >
                <ChevronDown className={`h-3 w-3 transition ${navDropdownOpen === 'jobs' ? 'rotate-180 text-[#0F6CBD]' : ''}`} />
              </button>
            </div>

            {navDropdownOpen === 'jobs' && (
              <ViewportMenu className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-[#EDEBE9] py-1.5 z-50 text-xs animate-in fade-in duration-100">
                <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-[#8A8886]">
                  Job Card &amp; Project Navigation
                </div>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('general');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E] flex items-center justify-between"
                >
                  <span className="font-semibold">Active Job Card ({activeProject?.projectCode})</span>
                  <span className="text-[10px] text-[#0F6CBD] font-mono">Current</span>
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('projects');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E] flex items-center justify-between"
                >
                  <span>All Jobs Register (Page 89)</span>
                  <span className="text-[10px] bg-[#F3F2F1] text-[#605E5C] px-1.5 py-0.2 rounded">{projects.length} Jobs</span>
                </button>
                <div className="my-1 border-t border-[#EDEBE9]" />
                <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-[#8A8886]">
                  Switch Active Job
                </div>
                <div className="max-h-36 overflow-y-auto">
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setNavDropdownOpen(null);
                        onSelectProject(p.id);
                        handleNavigate('general');
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-xs flex items-center justify-between ${
                        p.id === activeProject?.id ? 'bg-[#EFF6FC] text-[#0F6CBD] font-bold' : 'text-[#323130]'
                      }`}
                    >
                      <span className="truncate max-w-[150px]">{p.clientName}</span>
                      <span className="font-mono text-[10px] text-[#8A8886]">{p.projectCode}</span>
                    </button>
                  ))}
                </div>
                <div className="my-1 border-t border-[#EDEBE9]" />
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('projects');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#0F6CBD] font-semibold flex items-center gap-1.5"
                >
                  <span>+ Create New Job Card</span>
                </button>
              </ViewportMenu>
            )}
          </div>

          {/* TAB 2: SITE SURVEY & DIMENSIONS */}
          <div className="relative">
            <div className={`inline-flex items-center rounded text-xs font-semibold transition ${
              activeTab === 'survey'
                ? 'bg-[#EFF6FC] text-[#0F6CBD] ring-1 ring-[#0F6CBD]/30'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}>
              <button
                onClick={() => {
                  setNavDropdownOpen(null);
                  handleNavigate('survey');
                }}
                className="px-2.5 py-1 text-xs font-semibold focus:outline-none"
              >
                Site Survey &amp; Dimensions
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNavDropdownOpen(prev => prev === 'survey' ? null : 'survey');
                }}
                className="px-1 py-1 hover:bg-[#DEECF9] rounded-r text-[#605E5C] hover:text-[#0F6CBD]"
                title="Survey Menu"
              >
                <ChevronDown className={`h-3 w-3 transition ${navDropdownOpen === 'survey' ? 'rotate-180 text-[#0F6CBD]' : ''}`} />
              </button>
            </div>

            {navDropdownOpen === 'survey' && (
              <ViewportMenu className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-[#EDEBE9] py-1.5 z-50 text-xs animate-in fade-in duration-100">
                <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-[#8A8886]">
                  Spatial Measurements &amp; Survey
                </div>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('survey');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E] flex items-center justify-between"
                >
                  <span className="font-semibold">Room Dimensions Matrix</span>
                  <span className="text-[10px] text-[#0F6CBD] font-mono">6 Rooms</span>
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('survey');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Laser Distance Meter Log (GLM 50)
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('survey');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Society Constraints &amp; Lift Dimensions
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('survey');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Architectural CAD Drawings (Rev B)
                </button>
                <div className="my-1 border-t border-[#EDEBE9]" />
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('survey');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#0F6CBD] font-semibold"
                >
                  Copilot Brief &amp; Gap Analysis
                </button>
              </ViewportMenu>
            )}
          </div>

          {/* TAB 3: JOB PLANNING LINES (BOQ STUDIO) */}
          <div className="relative">
            <div className={`inline-flex items-center rounded text-xs font-semibold transition ${
              activeTab === 'boq'
                ? 'bg-[#EFF6FC] text-[#0F6CBD] ring-1 ring-[#0F6CBD]/30'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}>
              <button
                onClick={() => {
                  setNavDropdownOpen(null);
                  handleNavigate('boq');
                }}
                className="px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 focus:outline-none"
              >
                <span>Job Planning Lines (BOQ Studio)</span>
                <span className="bg-[#DFF6DD] text-[#107C41] text-[10px] px-1.5 py-0.2 rounded font-bold">
                  15 Lines
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNavDropdownOpen(prev => prev === 'boq' ? null : 'boq');
                }}
                className="px-1 py-1 hover:bg-[#DEECF9] rounded-r text-[#605E5C] hover:text-[#0F6CBD]"
                title="Planning Lines Menu"
              >
                <ChevronDown className={`h-3 w-3 transition ${navDropdownOpen === 'boq' ? 'rotate-180 text-[#0F6CBD]' : ''}`} />
              </button>
            </div>

            {navDropdownOpen === 'boq' && (
              <ViewportMenu className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-[#EDEBE9] py-1.5 z-50 text-xs animate-in fade-in duration-100">
                <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-[#8A8886]">
                  Planning Lines &amp; Takeoff Filters
                </div>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('boq');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E] flex items-center justify-between"
                >
                  <span className="font-semibold">All Planning Lines</span>
                  <span className="text-[10px] bg-[#DFF6DD] text-[#107C41] font-bold px-1 rounded">15 Lines</span>
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('boq');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Civil &amp; Waterproofing (4 lines)
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('boq');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Flooring &amp; False Ceilings (3 lines)
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('boq');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Carpentry, Wardrobes &amp; Millwork (6 lines)
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('boq');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Electrical &amp; Automation (2 lines)
                </button>
                <div className="my-1 border-t border-[#EDEBE9]" />
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('boq');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#0F6CBD] font-semibold"
                >
                  + Add Line from Master Rates
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('boq');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#107C41] font-semibold"
                >
                  Export Planning Lines to Excel
                </button>
              </ViewportMenu>
            )}
          </div>

          {/* TAB 4: COST ACCOUNTING & BUDGETS */}
          <div className="relative">
            <div className={`inline-flex items-center rounded text-xs font-semibold transition ${
              activeTab === 'budget'
                ? 'bg-[#EFF6FC] text-[#0F6CBD] ring-1 ring-[#0F6CBD]/30'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}>
              <button
                onClick={() => {
                  setNavDropdownOpen(null);
                  handleNavigate('budget');
                }}
                className="px-2.5 py-1 text-xs font-semibold focus:outline-none"
              >
                Cost Accounting &amp; Budgets
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNavDropdownOpen(prev => prev === 'budget' ? null : 'budget');
                }}
                className="px-1 py-1 hover:bg-[#DEECF9] rounded-r text-[#605E5C] hover:text-[#0F6CBD]"
                title="Budget Menu"
              >
                <ChevronDown className={`h-3 w-3 transition ${navDropdownOpen === 'budget' ? 'rotate-180 text-[#0F6CBD]' : ''}`} />
              </button>
            </div>

            {navDropdownOpen === 'budget' && (
              <ViewportMenu className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-[#EDEBE9] py-1.5 z-50 text-xs animate-in fade-in duration-100">
                <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-[#8A8886]">
                  Commercial Costing &amp; Calibration
                </div>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('budget');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E] flex items-center justify-between"
                >
                  <span className="font-semibold">Comprehensive Budget Sheet</span>
                  <span className="text-[10px] text-[#0F6CBD] font-mono">₹29.88L</span>
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('budget');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Direct Costs (Material, Labour, Equip)
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('budget');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Site Overheads (5%) &amp; Contingency (3%)
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('budget');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Target Gross Margin Calibration (26.0%)
                </button>
                <div className="my-1 border-t border-[#EDEBE9]" />
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('budget');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#0F6CBD] font-semibold"
                >
                  3-Tier Value Engineering Analysis
                </button>
              </ViewportMenu>
            )}
          </div>

          {/* TAB 5: CUSTOMER QUOTATIONS & SALES */}
          <div className="relative">
            <div className={`inline-flex items-center rounded text-xs font-semibold transition ${
              activeTab === 'quotation'
                ? 'bg-[#EFF6FC] text-[#0F6CBD] ring-1 ring-[#0F6CBD]/30'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}>
              <button
                onClick={() => {
                  setNavDropdownOpen(null);
                  handleNavigate('quotation');
                }}
                className="px-2.5 py-1 text-xs font-semibold focus:outline-none"
              >
                Customer Quotations &amp; Sales
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNavDropdownOpen(prev => prev === 'quotation' ? null : 'quotation');
                }}
                className="px-1 py-1 hover:bg-[#DEECF9] rounded-r text-[#605E5C] hover:text-[#0F6CBD]"
                title="Quotation Menu"
              >
                <ChevronDown className={`h-3 w-3 transition ${navDropdownOpen === 'quotation' ? 'rotate-180 text-[#0F6CBD]' : ''}`} />
              </button>
            </div>

            {navDropdownOpen === 'quotation' && (
              <ViewportMenu className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-[#EDEBE9] py-1.5 z-50 text-xs animate-in fade-in duration-100">
                <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-[#8A8886]">
                  Sales Proposal &amp; Terms
                </div>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('quotation');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E] flex items-center justify-between"
                >
                  <span className="font-semibold">Customer Sales Proposal</span>
                  <span className="text-[10px] text-[#107C41] font-mono">₹43.50L</span>
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('quotation');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Payment Milestones (6 Tranches)
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('quotation');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Composite Works GST Schedule (18%)
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('quotation');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Legal Terms, Exclusions &amp; Warranty
                </button>
                <div className="my-1 border-t border-[#EDEBE9]" />
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    window.print();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#0F6CBD] font-semibold"
                >
                  Print / Export Quotation PDF (Ctrl+P)
                </button>
              </ViewportMenu>
            )}
          </div>

          {/* TAB 6: MASTER SECTION */}
          <div className="relative">
            <div className={`inline-flex items-center rounded text-xs font-semibold transition ${
              activeTab === 'masters' || activeTab === 'rates'
                ? 'bg-[#EFF6FC] text-[#0F6CBD] ring-1 ring-[#0F6CBD]/30'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}>
              <button
                onClick={() => {
                  setNavDropdownOpen(null);
                  handleNavigate('masters');
                }}
                className="px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 focus:outline-none"
              >
                <span>Master Section</span>
                <span className="bg-[#EFF6FC] text-[#0F6CBD] text-[10px] px-1 py-0.2 rounded border border-[#C7E0F4] font-bold">
                  Items • Cust • Vend • Crew
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNavDropdownOpen(prev => prev === 'masters' ? null : 'masters');
                }}
                className="px-1 py-1 hover:bg-[#DEECF9] rounded-r text-[#605E5C] hover:text-[#0F6CBD]"
                title="Master Section Menu"
              >
                <ChevronDown className={`h-3 w-3 transition ${navDropdownOpen === 'masters' ? 'rotate-180 text-[#0F6CBD]' : ''}`} />
              </button>
            </div>

            {navDropdownOpen === 'masters' && (
              <ViewportMenu className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-[#EDEBE9] py-1.5 z-50 text-xs animate-in fade-in duration-100">
                <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-[#8A8886]">
                  Enterprise Master Catalogs (D365)
                </div>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('masters');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E] flex items-center justify-between"
                >
                  <span className="font-semibold">Items &amp; Master Rates (Table 27)</span>
                  <span className="text-[10px] text-[#0F6CBD] font-mono">28 items</span>
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('masters');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E] flex items-center justify-between"
                >
                  <span>Customer Directory (Table 18)</span>
                  <span className="text-[10px] text-[#605E5C] font-mono">4 clients</span>
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('masters');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E] flex items-center justify-between"
                >
                  <span>Vendor &amp; Subcontractor (Table 23)</span>
                  <span className="text-[10px] text-[#605E5C] font-mono">5 vendors</span>
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('masters');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E] flex items-center justify-between"
                >
                  <span>Resource &amp; Labour Wages (Table 156)</span>
                  <span className="text-[10px] text-[#605E5C] font-mono">6 crews</span>
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('masters');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  WBS Packages &amp; Wastage Norms
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('masters');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  UOM &amp; GST Tax Schedules
                </button>
                <div className="my-1 border-t border-[#EDEBE9]" />
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('masters');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#0F6CBD] font-semibold"
                >
                  + Add New Master Rate Item
                </button>
              </ViewportMenu>
            )}
          </div>

          {/* TAB 7: AUDIT TRAIL */}
          <div className="relative">
            <div className="inline-flex items-center rounded text-xs font-semibold text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#201F1E] transition">
              <button
                onClick={() => {
                  setNavDropdownOpen(null);
                  onOpenAuditLogs();
                }}
                className="px-2.5 py-1 text-xs font-medium focus:outline-none"
              >
                Audit Trail
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNavDropdownOpen(prev => prev === 'audit' ? null : 'audit');
                }}
                className="px-1 py-1 hover:bg-[#EDEBE9] rounded-r text-[#605E5C]"
                title="Audit Menu"
              >
                <ChevronDown className={`h-3 w-3 transition ${navDropdownOpen === 'audit' ? 'rotate-180 text-[#0F6CBD]' : ''}`} />
              </button>
            </div>

            {navDropdownOpen === 'audit' && (
              <ViewportMenu className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-[#EDEBE9] py-1.5 z-50 text-xs animate-in fade-in duration-100">
                <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-[#8A8886]">
                  Enterprise Telemetry &amp; Compliance
                </div>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    onOpenAuditLogs();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E] font-semibold"
                >
                  Enterprise Telemetry Logs
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    onOpenAuditLogs();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  Estimator Approval Sign-offs
                </button>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    onOpenAuditLogs();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#201F1E]"
                >
                  System Security &amp; Access Records
                </button>
              </ViewportMenu>
            )}
          </div>

          {/* TAB: BOQ COST TRACEABILITY (CORE INTEGRATION) */}
          <div className="relative shrink-0">
            <button
              id="nav-tab-traceability"
              onClick={() => {
                setNavDropdownOpen(null);
                handleNavigate('traceability');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition ${
                activeTab === 'traceability'
                  ? 'bg-[#FFB900]/20 text-[#8F6B00] ring-1 ring-[#FFB900]/60 font-bold'
                  : 'text-[#323130] hover:bg-[#F3F2F1]'
              }`}
              title="Link every BOQ item → budget line → purchase or subcontract order → material consumption/work certification → actual project cost"
            >
              <Network className="h-3.5 w-3.5 text-[#8F6B00]" />
              <span>Cost Traceability</span>
              <span className="bg-[#FFF4CE] text-[#795B00] text-[9px] px-1 py-0.2 rounded font-mono font-bold">
                BOQ→Cost
              </span>
            </button>
          </div>

          {/* TAB: MANDATORY REPORTS (MANAGEMENT & OPERATIONAL) */}
          <div className="relative shrink-0">
            <button
              id="nav-tab-mandatory-reports"
              onClick={() => {
                setNavDropdownOpen(null);
                handleNavigate('reports');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition ${
                activeTab === 'reports'
                  ? 'bg-[#DFF6DD] text-[#107C41] ring-1 ring-[#107C41]/50 font-bold shadow-2xs'
                  : 'text-[#323130] hover:bg-[#F3F2F1]'
              }`}
              title="All 12 Module Mandatory Reports: Management EVM, Cash Flow, WBS Variance, GST & Site DPRs"
            >
              <BarChart3 className="h-3.5 w-3.5 text-[#107C41]" />
              <span>Mandatory Reports</span>
              <span className="bg-[#107C41] text-white text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                12
              </span>
            </button>
          </div>

          {/* TAB: 26 JOURNEY MODULES HUB */}
          <div className="relative shrink-0" ref={navDropdownOpen === 'modules' ? navDropdownRef : undefined}>
            <div className={`inline-flex items-center rounded text-xs font-semibold transition ${
              ['crm', 'contacts', 'drawings', 'materials', 'contracts', 'variations', 'schedule', 'site_execution', 'procurement', 'inventory', 'contractors', 'snags', 'handover', 'portal', 'reports', 'modules'].includes(activeTab)
                ? 'bg-[#EFF6FC] text-[#0F6CBD] ring-1 ring-[#0F6CBD]/30'
                : 'text-[#323130] hover:bg-[#F3F2F1]'
            }`}>
              <button
                id="nav-tab-modules"
                onClick={() => {
                  setNavDropdownOpen(null);
                  handleNavigate('modules');
                }}
                className="px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 focus:outline-none"
              >
                <Compass className="h-3.5 w-3.5 text-[#0F6CBD]" />
                <span>26 Journey Modules</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNavDropdownOpen(prev => prev === 'modules' ? null : 'modules');
                }}
                className="px-1 py-1 hover:bg-[#DEECF9] rounded-r text-[#605E5C] hover:text-[#0F6CBD]"
                title="Modules Menu"
              >
                <ChevronDown className={`h-3 w-3 transition ${navDropdownOpen === 'modules' ? 'rotate-180 text-[#0F6CBD]' : ''}`} />
              </button>
            </div>

            {navDropdownOpen === 'modules' && (
              <ViewportMenu className="absolute left-0 top-full mt-1 w-80 bg-white rounded-lg shadow-xl border border-[#EDEBE9] py-2 z-50 text-xs animate-in fade-in duration-100 max-h-96 overflow-y-auto">
                <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-[#8A8886]">
                  Full Architecture Journey Modules (26)
                </div>
                <div className="my-1 border-t border-[#EDEBE9]" />

                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">1. Enquiry & Sales</div>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('crm'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E] flex justify-between">
                  <span>M01: CRM & Sales Pipeline</span>
                  <span className="text-[10px] text-emerald-600 font-mono">18 Leads</span>
                </button>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('contacts'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E]">
                  M02: Customer & Multi-Site Directory
                </button>

                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase mt-1">2. Survey & Design</div>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('drawings'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E] flex justify-between">
                  <span>M04: Design & Drawings Register</span>
                  <span className="text-[10px] text-blue-600 font-mono">Rev B (GFC)</span>
                </button>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('materials'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E]">
                  M05: Material & Finish Palette
                </button>

                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase mt-1">4. Commercial & Execution</div>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('contracts'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E]">
                  M09: Contracts, Retention (5%) & DLP
                </button>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('site_execution'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E] flex justify-between">
                  <span>M11: Site Execution & Daily DPRs</span>
                  <span className="text-[10px] text-blue-600 font-mono">DPR-024</span>
                </button>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('variations'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E] flex justify-between">
                  <span>M12: Variation Orders (VO Register)</span>
                  <span className="text-[10px] text-amber-600 font-mono">2 Active</span>
                </button>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('procurement'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E]">
                  M13: Procurement & Vendor POs
                </button>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('contractors'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E]">
                  M15: Subcontractor Work Orders
                </button>

                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase mt-1">7. Handover & Warranty</div>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('snags'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E]">
                  M19: Quality & Snags Matrix
                </button>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('handover'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E]">
                  M20: Handover Pack & OEM Warranties
                </button>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('portal'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E]">
                  M21: Customer Portal (Client View)
                </button>
                <button onClick={() => { setNavDropdownOpen(null); handleNavigate('reports'); }} className="w-full text-left px-3 py-1 hover:bg-[#EFF6FC] text-[#201F1E]">
                  M25: Executive KPI Dashboards
                </button>

                <div className="my-1 border-t border-[#EDEBE9]" />
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('modules');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#EFF6FC] text-[#0F6CBD] font-semibold flex items-center justify-between"
                >
                  <span>Open Full 26 Modules Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </ViewportMenu>
            )}
          </div>

          {/* TAB: AGENTIC AI WORKSPACE */}
          <div className="relative">
            <button
              id="nav-tab-agentic-ai"
              onClick={() => {
                setNavDropdownOpen(null);
                handleNavigate('ai_workspace');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition ${
                activeTab === 'ai_workspace'
                  ? 'bg-gradient-to-r from-[#5c2d91] to-[#0078d4] text-white shadow-xs'
                  : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
              }`}
              title="Central workspace to review suggestions and approve actions across all 9 AI assistants"
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
              <span>Agentic AI Copilot</span>
              <span className="bg-yellow-400 text-slate-900 text-[9px] px-1 py-0.2 rounded-full font-bold">
                9
              </span>
            </button>
          </div>

          {/* TAB 8: USERS & PERMISSIONS (RBAC) */}
          {(currentUser.role === 'ADMIN' || currentUser.permissions?.canManageUsers) && (
            <div className="relative">
              <div className={`inline-flex items-center rounded text-xs font-semibold transition ${
                activeTab === 'users'
                  ? 'bg-[#EFF6FC] text-[#0F6CBD] ring-1 ring-[#0F6CBD]/30'
                  : 'text-[#323130] hover:bg-[#F3F2F1]'
              }`}>
                <button
                  onClick={() => {
                    setNavDropdownOpen(null);
                    handleNavigate('users');
                  }}
                  className="px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 focus:outline-none"
                >
                  <Shield className="h-3.5 w-3.5 text-[#0F6CBD]" />
                  <span>Users &amp; Roles</span>
                  <span className="bg-[#EFF6FC] text-[#0F6CBD] text-[10px] px-1.5 py-0.2 rounded font-bold border border-[#C7E0F4]">
                    {allUsers.length}
                  </span>
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Active Project Pill on the right */}
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#EDEBE9]">
          <span className="text-[11px] text-[#605E5C]">Active Job:</span>
          <span className="font-semibold text-xs text-[#201F1E] font-mono">
            {activeProject?.projectCode}
          </span>
          <span className="text-xs text-[#605E5C] truncate max-w-[150px]">
            {activeProject?.title}
          </span>
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

            <div className="p-3 border-b border-[#EDEBE9] bg-[#FAF9F8]">
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
              <span>Search in BuildStorys Enact360</span>
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
