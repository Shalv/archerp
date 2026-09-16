import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Compass,
  Layers,
  Sparkles,
  Palette,
  FileSpreadsheet,
  Database,
  Calculator,
  Network,
  FileText,
  FileSignature,
  GitPullRequest,
  FolderKanban,
  Calendar,
  ClipboardCheck,
  ShoppingBag,
  PackageCheck,
  HardHat,
  Clock,
  AlertCircle,
  CheckSquare,
  Receipt,
  TrendingUp,
  Landmark,
  Smile,
  Key,
  Shield,
  BarChart3,
  FolderArchive,
  ShieldAlert,
  Building2,
  Briefcase,
  ChevronDown,
  Search,
  X,
  Menu,
  Check,
  Wrench,
  FileCode,
  Sliders,
  HelpCircle,
  ExternalLink,
  Zap,
  ArrowRight
} from 'lucide-react';
import { ProjectRecord, UserSession } from '../types/erp';

export interface TopMenuBarProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  activeProject: ProjectRecord | null;
  projects: ProjectRecord[];
  onSelectProject?: (proj: ProjectRecord) => void;
  currentUser: UserSession;
  onOpenAuditLogs?: () => void;
  onOpenInspectData?: () => void;
  onOpenStatusModal?: () => void;
  onOpenTrainingManual?: () => void;
  onOpenProfile?: () => void;
}

export interface NavModule {
  id: string;
  tabKey: string;
  name: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  code?: string;
  badge?: string;
  badgeColor?: string;
}

export interface NavStage {
  id: string;
  stageNumber?: number;
  stageLabel: string;
  title: string;
  shortTitle: string;
  description: string;
  modules: NavModule[];
}

export const TopMenuBar: React.FC<TopMenuBarProps> = ({
  activeTab,
  onNavigateTab,
  activeProject,
  projects,
  onSelectProject,
  currentUser,
  onOpenAuditLogs,
  onOpenInspectData,
  onOpenStatusModal,
  onOpenTrainingManual,
  onOpenProfile
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsideNav = dropdownRef.current && dropdownRef.current.contains(target);
      const isInsidePanel = menuPanelRef.current && menuPanelRef.current.contains(target);
      if (!isInsideNav && !isInsidePanel) {
        setOpenDropdown(null);
        setMenuPosition(null);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K or Alt+M to search modules
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMenuPosition(null);
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Comprehensive Stages and Modules definition
  const stages: NavStage[] = useMemo(() => [
    {
      id: 'stage_1_crm',
      stageNumber: 1,
      stageLabel: 'Stage 1',
      shortTitle: '1. CRM & Deals',
      title: 'Stage 1 • Enquiry & CRM',
      description: 'Lead intake, CRM funnel & client contacts',
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
          name: 'Customers & Contacts',
          shortDesc: 'Accounts, GSTIN & stakeholders',
          icon: UserCheck,
          code: 'M02',
          badge: 'Directory',
          badgeColor: 'bg-slate-100 text-slate-700'
        },
        {
          id: 'arch_pipeline',
          tabKey: 'arch_pipeline',
          name: 'Architectural Pipeline & CRM',
          shortDesc: 'Stage-gate Kanban, win probability & radar',
          icon: Users,
          code: 'M01-A',
          badge: 'Pipeline',
          badgeColor: 'bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold'
        }
      ]
    },
    {
      id: 'stage_2_design',
      stageNumber: 2,
      stageLabel: 'Stage 2',
      shortTitle: '2. Design & CAD',
      title: 'Stage 2 • Survey & Architectural Design',
      description: 'Laser survey, room dimensions, CAD & finishes',
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
          name: 'Brief & Spatial Zoning',
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
          shortDesc: 'CAD plans, 3D renders & GFC sets',
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
          badgeColor: 'bg-slate-900 text-amber-300 font-bold'
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
      shortTitle: '3. BOQ & Estimation',
      title: 'Stage 3 • Estimation & BOQ Engine',
      description: 'Itemized takeoffs, master rates, cost budget & traceability',
      modules: [
        {
          id: 'boq',
          tabKey: 'boq',
          name: 'BOQ Estimating Engine',
          shortDesc: 'Job Planning Lines & takeoffs',
          icon: FileSpreadsheet,
          code: 'M07',
          badge: 'Core BOQ',
          badgeColor: 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
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
          badgeColor: 'bg-amber-100 text-amber-900 font-bold'
        }
      ]
    },
    {
      id: 'stage_4_commercial',
      stageNumber: 4,
      stageLabel: 'Stage 4',
      shortTitle: '4. Quotations & Contracts',
      title: 'Stage 4 • Commercial & Contracts',
      description: 'Client proposals, tiered packages & variation orders',
      modules: [
        {
          id: 'quotation',
          tabKey: 'quotation',
          name: 'Customer Quotation & Sales',
          shortDesc: 'Client proposal, payment tranches & VE',
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
      shortTitle: '5. Site Ops & Execution',
      title: 'Stage 5 • Site Execution & Operations',
      description: 'Site WBS, DPR, procurement, inventory & quality',
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
      shortTitle: '6. Billing & Finance',
      title: 'Stage 6 • Billing & Finance',
      description: 'Running account bills, ledger & cash flow',
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
          shortDesc: 'Legal entity, multi-state GST & GL',
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
      shortTitle: '7. Handover & Reports',
      title: 'Stage 7 • Handover & Analytics',
      description: 'Customer portal, warranty, 22 MIS reports & ML',
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
      shortTitle: 'System & Admin',
      title: 'Intelligence & Administration',
      description: 'AI Copilot, document cloud store & user admin',
      modules: [
        {
          id: 'ai_workspace',
          tabKey: 'ai_workspace',
          name: 'Agentic AI Copilot Action Center',
          shortDesc: 'Autonomous Copilot recommendations',
          icon: Sparkles,
          badge: 'Copilot',
          badgeColor: 'bg-indigo-600 text-white font-bold'
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
        },
        {
          id: 'general',
          tabKey: 'general',
          name: 'Active Job Card (Header)',
          shortDesc: 'D365 Project Header & Parameters',
          icon: Building2,
          badge: activeProject ? activeProject.projectCode : 'Job Card',
          badgeColor: 'bg-blue-50 text-[#0F6CBD] font-semibold'
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
    }
  ], [activeProject, projects]);

  // Flatten all modules for instant search
  const allModules = useMemo(() => {
    const list: { module: NavModule; stage: NavStage }[] = [];
    stages.forEach(stage => {
      stage.modules.forEach(module => {
        list.push({ module, stage });
      });
    });
    return list;
  }, [stages]);

  // Find active stage based on activeTab
  const activeStageId = useMemo(() => {
    if (activeTab === 'dashboard' || activeTab === 'role_center') return 'dashboard';
    for (const stage of stages) {
      if (
        stage.modules.some(
          m =>
            m.tabKey === activeTab ||
            (m.tabKey === 'drawings' && activeTab === 'architecture') ||
            (m.tabKey === 'arch_studio' && (activeTab === 'arch_studio' || activeTab === 'ai-studio')) ||
            (m.tabKey === 'data_science' && (activeTab === 'data_science' || activeTab === 'analytics')) ||
            (m.tabKey === 'arch_pipeline' && (activeTab === 'arch_pipeline' || activeTab === 'pipeline')) ||
            (m.tabKey === 'arch_workspace' && (activeTab === 'arch_workspace' || activeTab === 'workspace'))
        )
      ) {
        return stage.id;
      }
    }
    return null;
  }, [activeTab, stages]);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return allModules.slice(0, 8);
    const q = searchQuery.toLowerCase();
    return allModules.filter(({ module, stage }) =>
      module.name.toLowerCase().includes(q) ||
      module.shortDesc.toLowerCase().includes(q) ||
      (module.code && module.code.toLowerCase().includes(q)) ||
      stage.title.toLowerCase().includes(q) ||
      (module.badge && module.badge.toLowerCase().includes(q))
    );
  }, [allModules, searchQuery]);

  const handleSelectModule = (tabKey: string) => {
    onNavigateTab(tabKey);
    setOpenDropdown(null);
    setMenuPosition(null);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const updateMenuPosition = useCallback((stageId: string) => {
    const btn = buttonRefs.current[stageId];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const stg = stages.find(s => s.id === stageId);
    const isLarge = (stg?.modules.length ?? 0) > 4;
    const maxAvailWidth = window.innerWidth - 24;
    const targetWidth = isLarge
      ? (window.innerWidth >= 1024 ? 820 : window.innerWidth >= 768 ? 700 : 540)
      : (window.innerWidth >= 768 ? 620 : 500);
    const width = Math.min(targetWidth, maxAvailWidth);

    const top = rect.bottom + 6;
    let left = rect.left;
    if (left + width > window.innerWidth - 12) {
      left = window.innerWidth - width - 12;
    }
    if (left < 12) {
      left = 12;
    }

    setMenuPosition({ top, left, width });
  }, [stages]);

  const handleToggleDropdown = (stageId: string) => {
    if (openDropdown === stageId) {
      setOpenDropdown(null);
      setMenuPosition(null);
    } else {
      setOpenDropdown(stageId);
      updateMenuPosition(stageId);
    }
  };

  const handleHoverDropdown = (stageId: string) => {
    if (openDropdown !== null && openDropdown !== stageId) {
      setOpenDropdown(stageId);
      updateMenuPosition(stageId);
    }
  };

  useEffect(() => {
    if (!openDropdown) return;
    const onReposition = () => {
      updateMenuPosition(openDropdown);
    };
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);
    return () => {
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [openDropdown, updateMenuPosition]);

  const activeOpenStage = useMemo(() => {
    return stages.find(s => s.id === openDropdown) || null;
  }, [stages, openDropdown]);

  return (
    <nav aria-label="Global ERP Menu Bar" className="bg-white border-b border-slate-200 relative z-30 select-none">
      <div className="max-w-[1920px] mx-auto px-2 sm:px-4 flex items-center justify-between gap-1 sm:gap-2 h-11" ref={dropdownRef}>
        
        {/* Left Side: Role Center Home Button + Horizontal Stage Tabs */}
        <div className="flex items-center gap-1 py-1 min-w-0 overflow-x-auto lg:overflow-visible scrollbar-none">
          
          {/* 1. Dashboard / Role Center Home */}
          <button
            onClick={() => handleSelectModule('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeStageId === 'dashboard'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Role Center & Executive Dashboard"
          >
            <LayoutDashboard className={`w-3.5 h-3.5 ${activeStageId === 'dashboard' ? 'text-sky-400' : 'text-slate-500'}`} />
            <span>Dashboard</span>
          </button>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200 mx-0.5 shrink-0 hidden sm:block" />

          {/* 2. Stage Tabs with Dropdown Menus */}
          {stages.map((stage) => {
            const isStageActive = activeStageId === stage.id;
            const isOpen = openDropdown === stage.id;

            return (
              <div key={stage.id} className="relative shrink-0">
                <button
                  ref={(el) => { buttonRefs.current[stage.id] = el; }}
                  type="button"
                  onClick={() => handleToggleDropdown(stage.id)}
                  onMouseEnter={() => handleHoverDropdown(stage.id)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                    isStageActive
                      ? 'bg-blue-50/80 text-[#0F6CBD] font-semibold border border-blue-200/60 shadow-2xs'
                      : isOpen
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                  title={stage.title}
                >
                  <span className="truncate">{stage.shortTitle}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180 text-slate-800' : 'text-slate-400'}`} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Active Stage Dropdown Floating Panel - Fixed Positioning: Never clipped by overflow containers */}
        {openDropdown && activeOpenStage && menuPosition && (
          <div 
            ref={menuPanelRef}
            style={{
              position: 'fixed',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              width: `${menuPosition.width}px`,
              maxWidth: 'calc(100vw - 24px)',
              maxHeight: 'calc(100vh - 120px)',
              zIndex: 100,
            }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200/95 py-3.5 px-4 animate-in fade-in slide-in-from-top-1 duration-150 flex flex-col"
          >
            {/* Header Banner with Stage Metadata */}
            <div className="px-1.5 pb-3 mb-3 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#0F6CBD] border border-blue-200/60 font-semibold">
                    {activeOpenStage.stageLabel || `Stage ${activeOpenStage.stageNumber || 1}`}
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {activeOpenStage.title.includes('•') ? activeOpenStage.title.split('•')[1]?.trim() : activeOpenStage.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {activeOpenStage.description}
                </p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-mono font-semibold shrink-0">
                {activeOpenStage.modules.length} {activeOpenStage.modules.length === 1 ? 'Module' : 'Modules'}
              </span>
            </div>

            {/* Grid Style Cards */}
            <div className={`grid gap-2.5 overflow-y-auto pr-1 flex-1 ${
              activeOpenStage.modules.length > 4 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
                : 'grid-cols-1 sm:grid-cols-2'
            }`}>
              {activeOpenStage.modules.map((m) => {
                const MIcon = m.icon;
                const isCurrentActive = activeTab === m.tabKey || 
                  (m.tabKey === 'drawings' && activeTab === 'architecture') ||
                  (m.tabKey === 'arch_studio' && (activeTab === 'arch_studio' || activeTab === 'ai-studio')) ||
                  (m.tabKey === 'data_science' && (activeTab === 'data_science' || activeTab === 'analytics')) ||
                  (m.tabKey === 'arch_pipeline' && (activeTab === 'arch_pipeline' || activeTab === 'pipeline')) ||
                  (m.tabKey === 'arch_workspace' && (activeTab === 'arch_workspace' || activeTab === 'workspace'));

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectModule(m.tabKey)}
                    className={`group relative text-left p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                      isCurrentActive
                        ? 'bg-blue-50/90 border-[#0F6CBD] ring-2 ring-[#0F6CBD]/20 shadow-xs'
                        : 'bg-slate-50/60 hover:bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    {/* Card Top Row: Icon + Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2 w-full">
                      <div className={`p-2 rounded-lg transition-colors shrink-0 shadow-2xs ${
                        isCurrentActive 
                          ? 'bg-[#0F6CBD] text-white' 
                          : 'bg-white text-slate-700 border border-slate-200/90 group-hover:bg-[#0F6CBD] group-hover:text-white group-hover:border-[#0F6CBD]'
                      }`}>
                        <MIcon className="w-4 h-4" />
                      </div>

                      <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
                        {m.code && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/90 text-slate-600 border border-slate-200/90 font-medium">
                            {m.code}
                          </span>
                        )}
                        {m.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${m.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                            {m.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Middle: Title & Description */}
                    <div className="min-w-0 w-full mb-2 flex-1">
                      <h4 className={`text-xs font-bold leading-snug transition-colors line-clamp-1 ${
                        isCurrentActive ? 'text-[#0F6CBD]' : 'text-slate-900 group-hover:text-[#0F6CBD]'
                      }`}>
                        {m.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-normal">
                        {m.shortDesc}
                      </p>
                    </div>

                    {/* Card Bottom: Active Status or Quick Action */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between w-full text-[10px]">
                      {isCurrentActive ? (
                        <span className="font-semibold text-[#0F6CBD] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F6CBD] animate-pulse" />
                          Currently Open
                        </span>
                      ) : (
                        <span className="text-slate-400 group-hover:text-[#0F6CBD] font-medium flex items-center gap-1 transition-colors">
                          Launch module
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      )}
                      <span className="text-slate-300 group-hover:text-slate-400">
                        ↵
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Tip */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 px-1 shrink-0">
              <span>Click any card to open workspace</span>
              <span className="hidden sm:inline">Press <kbd className="font-mono text-[9px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">Esc</kbd> to close</span>
            </div>
          </div>
        )}

        {/* Right Side: Quick Search & Module Finder + Mobile Drawer Trigger */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Quick Find Module Button */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSearchOpen(prev => !prev);
                setTimeout(() => searchInputRef.current?.focus(), 50);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-600 hover:text-slate-900 text-xs font-medium transition cursor-pointer shadow-2xs"
              title="Search all 30+ modules (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden xl:inline">Find Module</span>
              <kbd className="hidden md:inline-block font-mono text-[9px] bg-slate-200/80 px-1 py-0.2 rounded text-slate-500 font-bold">
                Ctrl+K
              </kbd>
            </button>

            {/* Global Search Popover */}
            {isSearchOpen && (
              <div className="absolute right-0 mt-1.5 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type module name, code (e.g. M07, DPR)..."
                    className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0F6CBD] focus:bg-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1 flex items-center justify-between">
                  <span>{searchQuery ? 'Search Results' : 'Suggested Modules'}</span>
                  <span>{searchResults.length} items</span>
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-1">
                  {searchResults.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No modules matched "{searchQuery}"
                    </div>
                  ) : (
                    searchResults.map(({ module, stage }) => {
                      const MIcon = module.icon;
                      return (
                        <button
                          key={module.id}
                          onClick={() => handleSelectModule(module.tabKey)}
                          className="w-full text-left p-2 rounded-lg hover:bg-blue-50/70 hover:text-[#0F6CBD] flex items-center gap-2.5 transition group cursor-pointer"
                        >
                          <div className="p-1.5 bg-slate-100 rounded text-slate-600 group-hover:bg-[#0F6CBD] group-hover:text-white shrink-0">
                            <MIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-900 group-hover:text-[#0F6CBD] truncate">
                                {module.name}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1 rounded">
                                {stage.shortTitle}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {module.shortDesc}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile All-Modules Drawer Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title="All Modules Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Sheet - Grid Style */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-3.5 py-3 max-h-[75vh] overflow-y-auto shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-900 text-xs">All ERP Modules & Stages</span>
              <p className="text-[10px] text-slate-400">Select any stage module to open</p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {stages.map((stage) => (
              <div key={stage.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase tracking-wider px-1">
                  <span>{stage.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">{stage.modules.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {stage.modules.map((m) => {
                    const MIcon = m.icon;
                    const isCurrentActive = activeTab === m.tabKey || 
                      (m.tabKey === 'drawings' && activeTab === 'architecture') ||
                      (m.tabKey === 'arch_studio' && (activeTab === 'arch_studio' || activeTab === 'ai-studio')) ||
                      (m.tabKey === 'data_science' && (activeTab === 'data_science' || activeTab === 'analytics')) ||
                      (m.tabKey === 'arch_pipeline' && (activeTab === 'arch_pipeline' || activeTab === 'pipeline')) ||
                      (m.tabKey === 'arch_workspace' && (activeTab === 'arch_workspace' || activeTab === 'workspace'));

                    return (
                      <button
                        key={m.id}
                        onClick={() => handleSelectModule(m.tabKey)}
                        className={`text-left p-2.5 rounded-xl border flex flex-col justify-between gap-2 transition cursor-pointer ${
                          isCurrentActive
                            ? 'bg-blue-50 border-[#0F6CBD] text-[#0F6CBD] shadow-2xs font-semibold'
                            : 'bg-slate-50/70 hover:bg-white border-slate-200/80 text-slate-800 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className={`p-1.5 rounded-md ${isCurrentActive ? 'bg-[#0F6CBD] text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                            <MIcon className="w-3.5 h-3.5" />
                          </div>
                          {m.code && (
                            <span className="text-[9px] font-mono text-slate-400 bg-white px-1 py-0.2 rounded border border-slate-200">
                              {m.code}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold leading-tight line-clamp-1">{m.name}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{m.shortDesc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
