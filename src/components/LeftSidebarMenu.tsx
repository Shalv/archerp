import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Building2,
  FolderKanban,
  Clock,
  Users,
  UserCheck,
  Compass,
  Layers,
  Palette,
  Database,
  FileSpreadsheet,
  Calculator,
  Network,
  FileText,
  FileSignature,
  GitPullRequest,
  Calendar,
  ClipboardCheck,
  ShoppingBag,
  PackageCheck,
  HardHat,
  AlertCircle,
  Receipt,
  TrendingUp,
  Landmark,
  Key,
  Shield,
  Smile,
  CheckSquare,
  FolderArchive,
  BarChart3,
  Sparkles,
  GraduationCap,
  Search,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  X,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Briefcase,
  CheckCircle2,
  Lock,
  ChevronsUpDown,
  ListFilter
} from 'lucide-react';
import { ProjectRecord, UserSession } from '../types/erp';

export interface LeftSidebarMenuProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  activeProject: ProjectRecord | null;
  projects: ProjectRecord[];
  onSelectProject: (projectId: string) => void;
  currentUser: UserSession;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenAuditLogs?: () => void;
  onOpenInspectData?: () => void;
  onOpenStatusModal?: () => void;
  onOpenTrainingManual?: () => void;
  onOpenProfile?: (initialTab?: 'profile' | 'security') => void;
}

interface ModuleItem {
  id: string;
  tabKey: string;
  code?: string;
  name: string;
  shortDesc: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  roleRestriction?: string[];
}

interface ModuleCategory {
  id: string;
  stageNumber?: number;
  stageLabel?: string;
  title: string;
  description: string;
  modules: ModuleItem[];
}

export const LeftSidebarMenu: React.FC<LeftSidebarMenuProps> = ({
  activeTab,
  onNavigateTab,
  activeProject,
  projects,
  onSelectProject,
  currentUser,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onOpenAuditLogs,
  onOpenInspectData,
  onOpenStatusModal,
  onOpenTrainingManual,
  onOpenProfile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'ALL' | string>('ALL');
  const [projectSelectorOpen, setProjectSelectorOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    categories.forEach(c => { allOpen[c.id] = false; });
    setCollapsedCategories(allOpen);
  };

  const collapseAll = () => {
    const allClosed: Record<string, boolean> = {};
    categories.forEach(c => { allClosed[c.id] = true; });
    setCollapsedCategories(allClosed);
  };

  // Sequential ERP Workflow Categories (Enquiry → Design → Estimation → Commercial → Execution → Billing → Handover)
  const categories: ModuleCategory[] = useMemo(() => [
    {
      id: 'hub',
      stageLabel: 'Overview',
      title: 'Overview & Role Center',
      description: 'Role-based KPI dashboard, active job card & projects portfolio',
      modules: [
        {
          id: 'dashboard',
          tabKey: 'dashboard',
          name: 'Role Center Dashboard',
          shortDesc: 'Role-tailored duties & KPIs',
          icon: ShieldCheck,
          badge: currentUser.role ? currentUser.role.replace('_', ' ') : 'Role',
          badgeColor: 'bg-[#002050] text-white font-bold'
        },
        {
          id: 'general',
          tabKey: 'general',
          name: 'Active Job Card',
          shortDesc: 'D365 Project Header & Details',
          icon: Building2,
          badge: activeProject ? activeProject.projectCode : 'Job Card',
          badgeColor: 'bg-[#EFF6FC] text-[#0F6CBD] font-semibold'
        },
        {
          id: 'projects',
          tabKey: 'projects',
          name: 'All Projects Register',
          shortDesc: 'Master list of all projects',
          icon: Briefcase,
          badge: `${projects.length} Jobs`,
          badgeColor: 'bg-slate-100 text-slate-700'
        }
      ]
    },
    {
      id: 'stage_1_crm',
      stageNumber: 1,
      stageLabel: 'Stage 1',
      title: 'Stage 1 • Enquiry & CRM',
      description: 'Lead intake, CRM funnel & customer contacts directory',
      modules: [
        {
          id: 'crm',
          tabKey: 'crm',
          name: 'CRM & Lead Funnel',
          shortDesc: 'Inquiry intake & lead pipeline',
          icon: Users,
          code: 'M01',
          badge: 'Leads',
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        },
        {
          id: 'contacts',
          tabKey: 'contacts',
          name: 'Customers & Contacts Directory',
          shortDesc: 'Accounts, GSTIN & stakeholders',
          icon: UserCheck,
          code: 'M02',
          badge: 'Directory',
          badgeColor: 'bg-slate-100 text-slate-700'
        },
        {
          id: 'arch_pipeline',
          tabKey: 'arch_pipeline',
          name: 'Architectural Deal Cockpit & CRM',
          shortDesc: 'Stage-gate Kanban, win probability & radar',
          icon: Users,
          code: 'M01-A',
          badge: 'Deal Cockpit',
          badgeColor: 'bg-amber-50 text-amber-800 border border-amber-300 font-bold'
        }
      ]
    },
    {
      id: 'stage_2_design',
      stageNumber: 2,
      stageLabel: 'Stage 2',
      title: 'Stage 2 • Survey & Design',
      description: 'Laser survey, room dimensions, architectural CAD & finishes',
      modules: [
        {
          id: 'survey',
          tabKey: 'survey',
          name: 'Site Survey & Laser Scan Hub',
          shortDesc: 'Room measurements & constraints',
          icon: Compass,
          code: 'M03',
          badge: 'GLM 50',
          badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200'
        },
        {
          id: 'arch_workspace',
          tabKey: 'arch_workspace',
          name: 'Architectural Brief & Spatial Zoning',
          shortDesc: 'Room zoning, spatial brief & client questionnaire',
          icon: Compass,
          code: 'M03-A',
          badge: 'Brief Hub',
          badgeColor: 'bg-indigo-50 text-indigo-700'
        },
        {
          id: 'drawings',
          tabKey: 'drawings',
          name: 'Architectural Drawings & 3D',
          shortDesc: 'CAD plans, 3D renders & GFC',
          icon: Layers,
          code: 'M04',
          badge: 'Rev B',
          badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200'
        },
        {
          id: 'arch_studio',
          tabKey: 'arch_studio',
          name: 'AI Concept Studio & 6-Sheet CAD',
          shortDesc: '5 Concept options, 6 CAD/3D sheets & Ollama AI',
          icon: Sparkles,
          code: 'M04-A',
          badge: 'Ollama AI',
          badgeColor: 'bg-[#002050] text-amber-300 font-bold'
        },
        {
          id: 'materials',
          tabKey: 'materials',
          name: 'Material & Sample Approvals',
          shortDesc: 'Swatches, specifications & sign-off',
          icon: Palette,
          code: 'M05',
          badge: 'Samples',
          badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200'
        }
      ]
    },
    {
      id: 'stage_3_estimation',
      stageNumber: 3,
      stageLabel: 'Stage 3',
      title: 'Stage 3 • Estimation & BOQ',
      description: 'Itemized takeoffs, master rates, cost budget & traceability',
      modules: [
        {
          id: 'boq',
          tabKey: 'boq',
          name: 'BOQ Estimating Engine',
          shortDesc: 'Job Planning Lines & takeoffs',
          icon: FileSpreadsheet,
          code: 'M07',
          badge: '15 Lines',
          badgeColor: 'bg-[#DFF6DD] text-[#107C41] font-bold'
        },
        {
          id: 'masters',
          tabKey: 'masters',
          name: 'Master Schedule of Rates (D365)',
          shortDesc: 'Table 27 Items, Table 23 Vendors',
          icon: Database,
          code: 'M06',
          badge: 'Masters',
          badgeColor: 'bg-[#0F6CBD] text-white font-semibold'
        },
        {
          id: 'budget',
          tabKey: 'budget',
          name: 'Cost Budget & Margin Analysis',
          shortDesc: 'Overheads, contingencies & guardrails',
          icon: Calculator,
          code: 'M08',
          badge: 'Budget',
          badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200'
        },
        {
          id: 'traceability',
          tabKey: 'traceability',
          name: 'Cost Traceability Matrix',
          shortDesc: 'BOQ → Budget → PO/WO → Actual',
          icon: Network,
          code: 'M09',
          badge: 'BOQ→Cost',
          badgeColor: 'bg-[#FFF4CE] text-[#795B00] font-bold'
        }
      ]
    },
    {
      id: 'stage_4_commercial',
      stageNumber: 4,
      stageLabel: 'Stage 4',
      title: 'Stage 4 • Commercial & Contracts',
      description: 'Quotations, tiered VE packages, contracts & variation orders',
      modules: [
        {
          id: 'quotation',
          tabKey: 'quotation',
          name: 'Customer Quotation & Sales',
          shortDesc: 'Client proposal, tranches & VE',
          icon: FileText,
          code: 'M10',
          badge: 'Quotes',
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        },
        {
          id: 'contracts',
          tabKey: 'contracts',
          name: 'Commercial Contracts & Terms',
          shortDesc: 'Retention 5%, DLP & milestones',
          icon: FileSignature,
          code: 'M11',
          badge: 'Contracts',
          badgeColor: 'bg-slate-100 text-slate-700'
        },
        {
          id: 'variations',
          tabKey: 'variations',
          name: 'Variation Orders & Scope Changes',
          shortDesc: 'Change orders (VO-01, VO-02)',
          icon: GitPullRequest,
          code: 'M12',
          badge: 'VO Register',
          badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200'
        }
      ]
    },
    {
      id: 'stage_5_execution',
      stageNumber: 5,
      stageLabel: 'Stage 5',
      title: 'Stage 5 • Execution & Site Ops',
      description: 'Site WBS, DPR, procurement, inventory, crews & quality',
      modules: [
        {
          id: 'project_hub',
          tabKey: 'project_hub',
          name: 'Project Management & Tasks',
          shortDesc: 'Kanban tasks & milestones',
          icon: FolderKanban,
          code: 'M29',
          badge: 'Kanban',
          badgeColor: 'bg-[#5c2d91] text-white font-semibold'
        },
        {
          id: 'schedule',
          tabKey: 'schedule',
          name: 'Site Schedule & Master WBS',
          shortDesc: 'Gantt schedule & milestone paths',
          icon: Calendar,
          code: 'M13',
          badge: 'Schedule',
          badgeColor: 'bg-blue-50 text-blue-700'
        },
        {
          id: 'site_execution',
          tabKey: 'site_execution',
          name: 'Daily Progress Reports (DPR)',
          shortDesc: 'Site logs, attendance & photos',
          icon: ClipboardCheck,
          code: 'M14',
          badge: 'DPR',
          badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200'
        },
        {
          id: 'procurement',
          tabKey: 'procurement',
          name: 'Procurement & Purchase Orders',
          shortDesc: 'Vendor POs, quotes & lead times',
          icon: ShoppingBag,
          code: 'M15',
          badge: 'POs',
          badgeColor: 'bg-blue-50 text-blue-700'
        },
        {
          id: 'inventory',
          tabKey: 'inventory',
          name: 'Material Inward & GRN Stock',
          shortDesc: 'Goods receipt, stores & scrap',
          icon: PackageCheck,
          code: 'M16',
          badge: 'GRN',
          badgeColor: 'bg-slate-100 text-slate-700'
        },
        {
          id: 'contractors',
          tabKey: 'contractors',
          name: 'Subcontractors & Joint MB',
          shortDesc: 'Work orders & measurement book',
          icon: HardHat,
          code: 'M17',
          badge: 'MB Book',
          badgeColor: 'bg-slate-100 text-slate-700'
        },
        {
          id: 'timesheets',
          tabKey: 'timesheets',
          name: 'Employee Timesheet Log',
          shortDesc: 'Stopwatch, billable hours & rates',
          icon: Clock,
          code: 'M27',
          badge: 'Live',
          badgeColor: 'bg-[#0F6CBD] text-white font-semibold'
        },
        {
          id: 'resources',
          tabKey: 'resources',
          name: 'Resource Deployment Matrix',
          shortDesc: 'Crews, shifts & machinery',
          icon: Users,
          code: 'M28',
          badge: 'Shifts',
          badgeColor: 'bg-[#107C41] text-white font-semibold'
        },
        {
          id: 'snags',
          tabKey: 'snags',
          name: 'Quality Audits & Snags',
          shortDesc: 'Defects matrix & rectification',
          icon: AlertCircle,
          code: 'M18',
          badge: 'Snags',
          badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200'
        },
        {
          id: 'compliance',
          tabKey: 'compliance',
          name: 'Compliance, Licenses & PTW',
          shortDesc: 'Fire NOC, society permits & safety',
          icon: CheckSquare,
          code: 'M24',
          badge: 'NOC',
          badgeColor: 'bg-emerald-50 text-emerald-700'
        }
      ]
    },
    {
      id: 'stage_6_billing',
      stageNumber: 6,
      stageLabel: 'Stage 6',
      title: 'Stage 6 • Billing & Finance',
      description: 'Running account bills, milestone claims & cash flow',
      modules: [
        {
          id: 'billing',
          tabKey: 'billing',
          name: 'Customer Billing & RA Invoices',
          shortDesc: 'Running account bills & GST receipts',
          icon: Receipt,
          code: 'M19',
          badge: 'RA Bills',
          badgeColor: 'bg-emerald-50 text-emerald-700 font-bold'
        },
        {
          id: 'finance',
          tabKey: 'finance',
          name: 'Financial Ledger & Cash Flow',
          shortDesc: 'Cash-in vs cash-out & margins',
          icon: TrendingUp,
          code: 'M20',
          badge: 'Cash Flow',
          badgeColor: 'bg-blue-50 text-blue-700'
        },
        {
          id: 'company_setup',
          tabKey: 'company_setup',
          name: 'Company Setup Master (Finance)',
          shortDesc: 'Legal entity, multi-state GST, GL & banking',
          icon: Landmark,
          code: 'M29',
          badge: 'Finance Setup',
          badgeColor: 'bg-indigo-50 text-indigo-700 font-semibold'
        }
      ]
    },
    {
      id: 'stage_7_handover',
      stageNumber: 7,
      stageLabel: 'Stage 7',
      title: 'Stage 7 • Handover & Reports',
      description: 'Customer portal, completion keys, DLP warranty & MIS reports',
      modules: [
        {
          id: 'portal',
          tabKey: 'portal',
          name: 'Customer Satisfaction Portal',
          shortDesc: 'Client view, milestones & feedback',
          icon: Smile,
          code: 'M23',
          badge: 'Client App',
          badgeColor: 'bg-purple-50 text-purple-700'
        },
        {
          id: 'handover',
          tabKey: 'handover',
          name: 'Project Handover & Keys',
          shortDesc: 'Completion sign-off & key release',
          icon: Key,
          code: 'M21',
          badge: 'Handover',
          badgeColor: 'bg-amber-50 text-amber-700'
        },
        {
          id: 'warranty',
          tabKey: 'warranty',
          name: 'Warranty Registry & DLP',
          shortDesc: 'OEM warranties & defect liability',
          icon: Shield,
          code: 'M22',
          badge: 'Warranty',
          badgeColor: 'bg-slate-100 text-slate-700'
        },
        {
          id: 'reports',
          tabKey: 'reports',
          name: 'Mandatory Reports Hub (22 Reports)',
          shortDesc: 'Executive MIS, EVM, Cash Flow, DPRs',
          icon: BarChart3,
          code: 'M26',
          badge: '22 Reports',
          badgeColor: 'bg-[#107C41] text-white font-bold'
        },
        {
          id: 'data_science',
          tabKey: 'data_science',
          name: 'Predictive Data Science & Risk ML',
          shortDesc: 'Monte Carlo simulation, S-curve & risk sandbox',
          icon: TrendingUp,
          code: 'M26-A',
          badge: 'ML Engine',
          badgeColor: 'bg-emerald-600 text-white font-bold'
        }
      ]
    },
    {
      id: 'admin_tools',
      stageLabel: 'System',
      title: 'Intelligence & Administration',
      description: 'Agentic Copilot, document cloud store & user permissions',
      modules: [
        {
          id: 'ai_workspace',
          tabKey: 'ai_workspace',
          name: 'Agentic AI Copilot Action Center',
          shortDesc: 'Autonomous Copilot recommendations',
          icon: Sparkles,
          badge: 'Copilot',
          badgeColor: 'bg-indigo-600 text-white font-bold animate-pulse'
        },
        {
          id: 'documents',
          tabKey: 'documents',
          name: 'Documents & Transmittals Cloud Store',
          shortDesc: 'Signed contracts, drawings & assets',
          icon: FolderArchive,
          code: 'M25',
          badge: 'Cloud Store',
          badgeColor: 'bg-slate-100 text-slate-700'
        },
        {
          id: 'data_backup',
          tabKey: 'data_backup',
          name: 'Architectural Backup & JSON Archive',
          shortDesc: 'Full project snapshot, JSON export & import',
          icon: Database,
          code: 'M25-A',
          badge: 'JSON Archive',
          badgeColor: 'bg-slate-100 text-slate-700'
        },
        {
          id: 'users',
          tabKey: 'users',
          name: 'User Administration & Security',
          shortDesc: 'RBAC permissions, roles & security',
          icon: ShieldAlert,
          badge: 'Admin',
          badgeColor: 'bg-purple-100 text-purple-800'
        }
      ]
    }
  ], [currentUser, activeProject, projects]);

  // Auto-expand category containing the active tab
  React.useEffect(() => {
    const activeCat = categories.find(cat =>
      cat.modules.some(
        m =>
          m.tabKey === activeTab ||
          (m.tabKey === 'general' && activeTab === 'general') ||
          (m.tabKey === 'drawings' && activeTab === 'architecture') ||
          (m.tabKey === 'arch_studio' && (activeTab === 'arch_studio' || activeTab === 'ai-studio')) ||
          (m.tabKey === 'data_science' && (activeTab === 'data_science' || activeTab === 'analytics')) ||
          (m.tabKey === 'arch_pipeline' && (activeTab === 'arch_pipeline' || activeTab === 'pipeline')) ||
          (m.tabKey === 'arch_workspace' && (activeTab === 'arch_workspace' || activeTab === 'workspace'))
      )
    );
    if (activeCat) {
      setCollapsedCategories(prev => ({
        ...prev,
        [activeCat.id]: false
      }));
    }
  }, [activeTab, categories]);

  // Filter modules by stage and search query
  const filteredCategories = useMemo(() => {
    let list = categories;
    if (stageFilter !== 'ALL') {
      list = list.filter(cat => cat.id === stageFilter);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list
      .map(cat => ({
        ...cat,
        modules: cat.modules.filter(
          m =>
            m.name.toLowerCase().includes(q) ||
            m.shortDesc.toLowerCase().includes(q) ||
            (m.code && m.code.toLowerCase().includes(q)) ||
            (m.badge && m.badge.toLowerCase().includes(q))
        )
      }))
      .filter(cat => cat.modules.length > 0);
  }, [categories, stageFilter, searchQuery]);

  const totalModulesCount = useMemo(() => {
    return categories.reduce((acc, cat) => acc + cat.modules.length, 0);
  }, [categories]);

  const handleSelectModule = (tabKey: string) => {
    onNavigateTab(tabKey);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="erp-left-sidebar"
        className={`fixed lg:sticky top-0 lg:top-[74px] h-[100dvh] lg:h-[calc(100vh-74px)] bg-[#F8FAFC] border-r border-[#E2E8F0] z-50 lg:z-30 flex flex-col select-none transition-all duration-200 shrink-0 shadow-xs ${
          isMobileOpen
            ? 'left-0 w-80 shadow-2xl'
            : isCollapsed
            ? '-left-full lg:left-0 lg:w-[64px]'
            : '-left-full lg:left-0 lg:w-[270px]'
        }`}
      >
        {/* 1. SIDEBAR HEADER: Title, Count, and Collapse Toggle */}
        <div className="h-12 px-3 flex items-center justify-between border-b border-[#E2E8F0] bg-white shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded bg-[#002050] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#0F172A] tracking-tight flex items-center gap-1.5">
                  <span>ERP Modules</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.2 rounded font-bold border border-slate-200">
                    {totalModulesCount}
                  </span>
                </div>
                <div className="text-[10px] text-[#64748B] truncate">
                  BuildStorys Business Central
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse / Expand Toggle */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded transition"
              title={isCollapsed ? 'Expand Sidebar Menu' : 'Collapse Sidebar Menu'}
            >
              {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded"
              title="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. ACTIVE PROJECT QUICK BANNER */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-2 border-b border-[#E2E8F0] bg-[#FAF9F8] shrink-0">
            <div className="relative">
              <button
                onClick={() => setProjectSelectorOpen(!projectSelectorOpen)}
                className="w-full text-left p-2 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#0F6CBD] transition flex items-center justify-between shadow-2xs group cursor-pointer"
                title="Click to switch active project"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1">
                    <span>Active Job</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                  </div>
                  <div className="text-xs font-bold text-[#0F172A] truncate group-hover:text-[#0F6CBD]">
                    {activeProject?.clientName || 'Select Project'}
                  </div>
                  <div className="text-[10px] font-mono text-[#0F6CBD] font-medium truncate">
                    {activeProject?.projectCode || 'No Job Code'}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition shrink-0 ${projectSelectorOpen ? 'rotate-180 text-[#0F6CBD]' : ''}`} />
              </button>

              {/* Quick Project Switch Dropdown */}
              {projectSelectorOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-xl z-50 p-1 max-h-56 overflow-y-auto">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    Switch Project
                  </div>
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProject(p.id);
                        setProjectSelectorOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition ${
                        p.id === activeProject?.id
                          ? 'bg-[#EFF6FC] text-[#0F6CBD] font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="truncate text-xs font-semibold">{p.clientName}</div>
                        <div className="text-[10px] font-mono text-slate-500">{p.projectCode}</div>
                      </div>
                      {p.id === activeProject?.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#0F6CBD] shrink-0" />}
                    </button>
                  ))}
                  <div className="border-t border-[#E2E8F0] my-1" />
                  <button
                    onClick={() => {
                      setProjectSelectorOpen(false);
                      onNavigateTab('projects');
                    }}
                    className="w-full text-left px-2 py-1 text-xs font-semibold text-[#0F6CBD] hover:bg-[#EFF6FC] rounded flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>View all projects register</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. SEARCH / FILTER MODULES */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-2.5 border-b border-[#E2E8F0] bg-white shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search modules..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] focus:bg-white transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Expand / Collapse All categories toggle */}
              <button
                type="button"
                onClick={() => {
                  const anyClosed = categories.some(c => collapsedCategories[c.id]);
                  if (anyClosed) {
                    expandAll();
                  } else {
                    collapseAll();
                  }
                }}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 shrink-0 transition cursor-pointer"
                title="Expand / Collapse all categories"
              >
                <ChevronsUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 4. SCROLLABLE MODULES LIST */}
        <div className="flex-1 overflow-y-auto px-2 py-2.5 space-y-3">
          {filteredCategories.map((category) => {
            const isCatCollapsed = collapsedCategories[category.id] && !searchQuery;
            const isCatActive = category.modules.some(
              m =>
                m.tabKey === activeTab ||
                (m.tabKey === 'general' && activeTab === 'general') ||
                (m.tabKey === 'drawings' && activeTab === 'architecture')
            );

            return (
              <div key={category.id} id={`sidebar-cat-${category.id}`} className="space-y-0.5">
                {/* Category Header */}
                {(!isCollapsed || isMobileOpen) && (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={`w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition cursor-pointer select-none ${
                      isCatActive
                        ? 'text-[#0F6CBD] bg-blue-50/50'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {category.stageNumber ? (
                        <span
                          className={`w-3.5 h-3.5 rounded text-[8px] font-mono flex items-center justify-center font-bold shrink-0 ${
                            isCatActive
                              ? 'bg-[#0F6CBD] text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {category.stageNumber}
                        </span>
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isCatActive ? 'bg-[#0F6CBD]' : 'bg-slate-300'
                          }`}
                        />
                      )}
                      <span className="truncate">{category.title}</span>
                    </div>
                    <span className="flex items-center gap-1 shrink-0 ml-1">
                      <span className="text-[9px] text-slate-400 font-mono">
                        {category.modules.length}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${
                          isCatCollapsed ? '-rotate-90' : ''
                        }`}
                      />
                    </span>
                  </button>
                )}

                {/* Collapsed Category Divider for Icon-Only Mode */}
                {isCollapsed && !isMobileOpen && (
                  <div className="my-1.5 border-t border-slate-200" title={category.title} />
                )}

                {/* Module Items */}
                {(!isCatCollapsed || isCollapsed) && (
                  <div className="space-y-0.5">
                    {category.modules.map((mod) => {
                      const Icon = mod.icon;
                      const isActive =
                        activeTab === mod.tabKey ||
                        (mod.tabKey === 'general' && activeTab === 'general') ||
                        (mod.tabKey === 'drawings' && activeTab === 'architecture');

                      return (
                        <button
                          key={mod.id}
                          id={`sidebar-module-${mod.tabKey}`}
                          onClick={() => handleSelectModule(mod.tabKey)}
                          title={`${mod.code ? mod.code + ' • ' : ''}${mod.name} - ${mod.shortDesc}`}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition relative group cursor-pointer ${
                            isActive
                              ? 'bg-blue-50/90 text-[#0F6CBD] font-semibold border-l-2 border-[#0F6CBD] shadow-2xs'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className={`shrink-0 ${isActive ? 'text-[#0F6CBD]' : 'text-slate-400 group-hover:text-slate-700'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>

                          {(!isCollapsed || isMobileOpen) && (
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs truncate tracking-tight">
                                  {mod.name}
                                </span>
                                {mod.badge && (
                                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono shrink-0 ${mod.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                                    {mod.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 group-hover:text-slate-500 truncate">
                                {mod.code ? `${mod.code} • ` : ''}{mod.shortDesc}
                              </div>
                            </div>
                          )}

                          {/* Tooltip for collapsed icon-only mode */}
                          {isCollapsed && !isMobileOpen && (
                            <div className="hidden group-hover:block absolute left-full ml-2 px-2.5 py-1.5 bg-[#002050] text-white text-xs rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none">
                              <div className="font-bold flex items-center gap-1.5">
                                {category.stageNumber && (
                                  <span className="text-amber-300 font-mono text-[10px]">
                                    [Stage {category.stageNumber}]
                                  </span>
                                )}
                                <span>{mod.name}</span>
                                {mod.code && <span className="text-[10px] text-amber-300 font-mono">({mod.code})</span>}
                              </div>
                              <div className="text-[10px] text-slate-300 font-normal">{mod.shortDesc}</div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500">
              No modules match &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* 5. FOOTER: Quick Access to Copilot AI Center & Role Center */}
        {(!isCollapsed || isMobileOpen) ? (
          <div className="p-2 border-t border-[#E2E8F0] bg-white shrink-0 space-y-1.5">
            {/* Customer Training Manual */}
            <button
              onClick={onOpenTrainingManual}
              type="button"
              className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-sky-600" />
                <span>Customer Training Manual</span>
              </div>
              <span className="text-[10px] bg-white text-sky-700 px-1.5 py-0.5 rounded font-mono font-bold border border-sky-200">
                Step-by-Step
              </span>
            </button>

            <button
              onClick={() => handleSelectModule('ai_workspace')}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'ai_workspace'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Copilot Action Center</span>
              </div>
              <span className="text-[10px] bg-white/80 text-indigo-700 px-1.5 py-0.2 rounded font-mono font-bold">
                Agentic
              </span>
            </button>

            <div className="flex items-center justify-between text-[11px] px-1 py-1 text-slate-500">
              <span className="truncate">{currentUser.name}</span>
              <span className="text-[10px] font-mono uppercase bg-slate-100 px-1 rounded text-slate-700">
                {currentUser.role}
              </span>
            </div>
          </div>
        ) : (
          /* Collapsed mode button */
          <div className="p-2 border-t border-[#E2E8F0] bg-white shrink-0 flex flex-col items-center gap-2">
            <button
              onClick={onOpenTrainingManual}
              type="button"
              className="p-2 rounded-lg text-sky-700 hover:bg-sky-50 transition cursor-pointer"
              title="Customer Training & Operations Manual"
            >
              <GraduationCap className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSelectModule('ai_workspace')}
              type="button"
              className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
              title="Agentic AI Copilot Action Center"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
