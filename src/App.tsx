/**
 * Build Storys ERP - Microsoft Dynamics 365 Business Central Role Center & Job Card
 * Architecture • Interiors • Renovation • Turnkey Construction
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  Layers, 
  FileSpreadsheet, 
  DollarSign, 
  FileText, 
  Database, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  LayoutDashboard,
  Compass
} from 'lucide-react';

import { 
  UserSession, 
  ProjectRecord, 
  MasterRateItem, 
  CostBudgetSummary, 
  CustomerRequirement, 
  BOQItem 
} from './types/erp';

import { D365Shell } from './components/D365Shell';
import { D365JobCard } from './components/D365JobCard';
import { D365FactBoxPane } from './components/D365FactBoxPane';
import { D365InspectDataModal } from './components/D365InspectDataModal';
import { RateLibraryView } from './components/RateLibraryView';
import { MastersHubView } from './components/MastersHubView';
import { ProjectsRegisterView } from './components/ProjectsRegisterView';
import { UsersRegisterView } from './components/UsersRegisterView';
import { UserMasterSetupView } from './components/UserMasterSetupView';
import { UserProfileEditModal } from './components/UserProfileEditModal';
import { LoginPortalModal } from './components/LoginPortalModal';
import { SystemStatusModal } from './components/SystemStatusModal';
import { AuditLogsModal } from './components/AuditLogsModal';
import { exportJobPlanningLinesToExcel } from './utils/excelExport';
import { CostTraceabilityMatrixView } from './components/CostTraceabilityMatrixView';
import { AgenticAIActionCenter } from './components/AgenticAIActionCenter';
import { FullJourneyModulesView } from './components/FullJourneyModulesView';
import { MandatoryReportsHubView } from './components/MandatoryReportsHubView';
import { TimesheetManagementView } from './components/TimesheetManagementView';
import { ResourceDeploymentView } from './components/ResourceDeploymentView';
import { ProjectManagementHubView } from './components/ProjectManagementHubView';
import { LeftSidebarMenu } from './components/LeftSidebarMenu';
import { RoleCenterDashboardView } from './components/RoleCenterDashboardView';
import { CompanySetupMasterView } from './components/CompanySetupMasterView';
import { getStoredUsers, saveStoredUsers, INITIAL_ERP_USERS, getActiveSessionUser, saveActiveSession, clearActiveSession } from './data/defaultUsers';
import { getSyntheticDemoProject } from './server/syntheticDemo';
import { DEFAULT_MASTER_RATES } from './server/mockMasters';

export default function App() {
  const [users, setUsers] = useState<UserSession[]>(() => getStoredUsers());
  // Restore a still-valid session (survives page refresh even if the server cookie
  // session doesn't round-trip, e.g. in preview/iframe environments).
  const restoredSessionUser = getActiveSessionUser();
  const [currentUser, setCurrentUser] = useState<UserSession>(() => {
    if (restoredSessionUser) return restoredSessionUser;
    const all = getStoredUsers();
    return all.find(u => u.role === 'ADMIN') || all[0] || INITIAL_ERP_USERS[0];
  });

  const [projects, setProjects] = useState<ProjectRecord[]>(() => [getSyntheticDemoProject()]);
  const [activeProjectId, setActiveProjectId] = useState<string>('PROJ-SKYLINE-1402');
  const [activeProject, setActiveProject] = useState<ProjectRecord | null>(() => getSyntheticDemoProject());
  const [masterRates, setMasterRates] = useState<MasterRateItem[]>(() => DEFAULT_MASTER_RATES);
  const [budgetSummary, setBudgetSummary] = useState<CostBudgetSummary | null>(null);

  // D365 State: Active navigation tab, selected line item, FactBox visibility, inspect modal
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedItem, setSelectedItem] = useState<BOQItem | null>(null);
  const [isFactBoxOpen, setIsFactBoxOpen] = useState(true);
  const [isInspectOpen, setIsInspectOpen] = useState(false);

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [auditLogsOpen, setAuditLogsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(!restoredSessionUser);
  const [authenticated, setAuthenticated] = useState(!!restoredSessionUser);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'profile' | 'security'>('security');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Left Sidebar Menu State (All 30+ ERP modules accessible from the left sidebar)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleOpenProfile = (tab: 'profile' | 'security' = 'security') => {
    setProfileModalTab(tab);
    setIsProfileModalOpen(true);
  };

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    setAuthenticated(true);
    setIsLoginModalOpen(false);
    saveActiveSession(user.id);
    loadUsers();
    loadProjects();
    loadMasterRates();

    // If user has specific assigned projects, make sure active project is accessible
    if (user.assignedProjectIds && user.assignedProjectIds.length > 0 && projects.length > 0) {
      const isCurrentAccessible = user.assignedProjectIds.includes(activeProjectId);
      if (!isCurrentAccessible) {
        const nextProj = projects.find(p => user.assignedProjectIds?.includes(p.id)) || projects[0];
        if (nextProj) {
          setActiveProjectId(nextProj.id);
          setActiveProject(nextProj);
        }
      }
    }

    // Role-tailored landing screen
    if (user.role === 'CLIENT') {
      setActiveTab('quotation');
    } else if (user.role === 'SITE_ENGINEER') {
      setActiveTab('site_execution');
    }

    showToast(`Authenticated as ${user.name} (${user.roleTitle || user.role}). Permissions active.`);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'x-user-id': currentUser?.id || ''
        }
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    clearActiveSession();
    setAuthenticated(false);
    setIsLoginModalOpen(true);
    showToast('Active session terminated. Please enter your credentials to log in.', 'info');
  };

  // 1. Initial Load: Users, Projects, Master Rates
  useEffect(() => {
    // If we already restored a valid local session on mount, don't block on the network -
    // just refresh supporting data in the background and reconcile quietly with the server.
    if (restoredSessionUser) {
      loadUsers();
      loadProjects();
      loadMasterRates();
      fetch('/api/auth/me', { 
        credentials: 'same-origin',
        headers: {
          'x-user-id': restoredSessionUser.id
        }
      }).then(async r => {
        if (r.ok) {
          const serverUser = await r.json();
          setCurrentUser(serverUser);
          saveActiveSession(serverUser.id);
        } else if (r.status === 401 || r.status === 403) {
          clearActiveSession();
          setAuthenticated(false);
          setIsLoginModalOpen(true);
        }
      }).catch(() => { /* offline or API unavailable: keep the restored session */ });
      return;
    }

    fetch('/api/auth/me', { credentials: 'same-origin' }).then(async r => {
      if (r.ok) {
        handleLoginSuccess(await r.json());
      } else {
        setAuthenticated(false);
        setIsLoginModalOpen(true);
      }
    }).catch(() => {
      setAuthenticated(false);
      setIsLoginModalOpen(true);
    });
  }, []);

  const loadUsers = () => {
    fetch('/api/auth/users')
      .then(async r => {
        if (!r.ok) throw new Error('API unavailable');
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
          saveStoredUsers(data);
          setCurrentUser(prev => {
            const updated = data.find((u: UserSession) => u.id === prev.id);
            if (updated) return updated;
            const est = data.find((u: UserSession) => u?.role === 'ESTIMATOR') || data[0];
            return est || prev;
          });
        }
      })
      .catch(() => {
        const stored = getStoredUsers();
        setUsers(stored);
      });
  };

  const handleSaveUser = async (userToSave: UserSession): Promise<boolean> => {
    const isNew = !users.some(u => u.id === userToSave.id);
    const url = isNew ? '/api/auth/users' : `/api/auth/users/${userToSave.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      try {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id
          },
          body: JSON.stringify(userToSave)
        });
        if (res.ok) {
          const data = await res.json();
          showToast(isNew ? `User ${userToSave.name} created successfully` : `User ${userToSave.name} updated successfully`, 'success');
          setUsers(prev => {
            const next = isNew ? [...prev, data] : prev.map(u => u.id === data.id ? data : u);
            saveStoredUsers(next);
            return next;
          });
          setCurrentUser(prev => prev.id === data.id ? data : prev);
          return true;
        }
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Unable to save user.');
      } catch (fetchErr) { throw fetchErr; }

    } catch (err: any) {
      showToast(err.message || 'Error saving user', 'error');
      return false;
    }
  };

  const handleDeleteUser = async (userId: string, permanent: boolean = true): Promise<boolean> => {
    try {
      try {
        const res = await fetch(`/api/auth/users/${userId}?permanent=${permanent}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': currentUser.id
          }
        });
        if (res.ok) {
          const data = await res.json();
          showToast(data.message || (permanent ? 'User permanently deleted from system' : 'User account deactivated'), 'success');
          loadUsers();
          return true;
        }
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Unable to delete user.');
      } catch (fetchErr) { throw fetchErr; }

    } catch (err: any) {
      showToast(err.message || 'Error deleting user', 'error');
      return false;
    }
  };

  // Global Keyboard Shortcuts (D365 standards: Ctrl+Alt+F1 for Inspector, Alt+F2 for FactBox)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Alt+F1 -> Page Inspection
      if (e.ctrlKey && e.altKey && e.key === 'F1') {
        e.preventDefault();
        setIsInspectOpen(prev => !prev);
      }
      // Alt+F2 -> Toggle FactBox
      if (e.altKey && e.key === 'F2') {
        e.preventDefault();
        setIsFactBoxOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadProjects = () => {
    fetch('/api/projects', {
      headers: { 'x-user-id': currentUser.id }
    })
      .then(async r => {
        if (!r.ok) throw new Error('API unavailable');
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
          if (!activeProjectId) {
            setActiveProjectId(data[0].id);
            setActiveProject(data[0]);
            loadBudgetSummary(data[0].id);
            const activeRev = data[0].revisions.find((r: any) => r.id === data[0].activeRevisionId) || data[0].revisions[0];
            if (activeRev && activeRev.items.length > 0) {
              setSelectedItem(activeRev.items[0]);
            }
          } else if (activeProjectId) {
            const found = data.find((p: ProjectRecord) => p.id === activeProjectId);
            if (found) {
              setActiveProject(found);
              loadBudgetSummary(found.id);
              const activeRev = found.revisions.find((r: any) => r.id === found.activeRevisionId) || found.revisions[0];
              if (activeRev && activeRev.items.length > 0 && !selectedItem) {
                setSelectedItem(activeRev.items[0]);
              }
            }
          }
        }
      })
      .catch(() => {
        const demo = getSyntheticDemoProject();
        setProjects(prev => prev.length > 0 ? prev : [demo]);
        if (!activeProject) {
          setActiveProject(demo);
          setActiveProjectId(demo.id);
        }
      });
  };

  const loadMasterRates = () => {
    fetch('/api/masters/rates')
      .then(async r => {
        if (!r.ok) throw new Error('API unavailable');
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMasterRates(data);
        }
      })
      .catch(() => {
        setMasterRates(DEFAULT_MASTER_RATES);
      });
  };

  const loadBudgetSummary = (projId: string, userId: string = currentUser.id) => {
    fetch(`/api/projects/${projId}/budget-summary`, {
      headers: { 'x-user-id': userId }
    })
      .then(r => r.json())
      .then(data => setBudgetSummary(data))
      .catch(console.error);
  };

  // Switch Active Project
  const handleSelectProject = (projId: string) => {
    setActiveProjectId(projId);
    const found = projects.find(p => p.id === projId);
    if (found) {
      setActiveProject(found);
      loadBudgetSummary(found.id);
      const activeRev = found.revisions.find(r => r.id === found.activeRevisionId) || found.revisions[0];
      if (activeRev && activeRev.items.length > 0) {
        setSelectedItem(activeRev.items[0]);
      } else {
        setSelectedItem(null);
      }
    }
  };

  // Switch Active User (RBAC test)
  const handleSelectUser = (user: UserSession) => {
    setIsLoginModalOpen(true);
    showToast(`Sign in with the credentials for ${user.name}.`, 'info');
  };

  // AI BOQ Generation (Copilot Takeoff)
  const handleGenerateAIBOQ = async () => {
    if (!activeProject) return;
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/generate-boq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ projectId: activeProject.id })
      });
      const data = await res.json();
      if (res.ok) {
        const pRes = await fetch(`/api/projects/${activeProject.id}`);
        const freshProj = await pRes.json();
        setActiveProject(freshProj);
        setBudgetSummary(data.budgetSummary);
        const activeRev = freshProj.revisions.find((r: any) => r.id === freshProj.activeRevisionId) || freshProj.revisions[0];
        if (activeRev && activeRev.items.length > 0) {
          setSelectedItem(activeRev.items[0]);
        }
        showToast('Dynamics 365 Copilot generated a new detailed takeoff revision!');
      } else {
        showToast(data.error || 'Failed to generate AI BOQ', 'error');
      }
    } catch (err) {
      showToast('AI Generation error', 'error');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Update BOQ Item
  const handleUpdateBOQItem = async (itemId: string, updatedFields: Partial<BOQItem>) => {
    if (!activeProject) return;
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/boq/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (res.ok) {
        const pRes = await fetch(`/api/projects/${activeProject.id}`);
        const freshProj = await pRes.json();
        setActiveProject(freshProj);
        setBudgetSummary(data.budgetSummary);
        showToast('Job Planning Line updated and ledger recalculated.');
      } else {
        showToast(data.error || 'Failed to update item', 'error');
      }
    } catch (err) {
      showToast('Update error', 'error');
    }
  };

  // Add BOQ Item
  const handleAddBOQItem = async (item: Partial<BOQItem>) => {
    if (!activeProject) return;
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/boq/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (res.ok) {
        const pRes = await fetch(`/api/projects/${activeProject.id}`);
        const freshProj = await pRes.json();
        setActiveProject(freshProj);
        setBudgetSummary(data.budgetSummary);
        showToast('Added new Job Planning Line.');
      } else {
        showToast(data.error || 'Failed to add item', 'error');
      }
    } catch (err) {
      showToast('Error adding item', 'error');
    }
  };

  // Delete BOQ Item
  const handleDeleteBOQItem = async (itemId: string) => {
    if (!activeProject) return;
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/boq/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': currentUser.id
        }
      });
      const data = await res.json();
      if (res.ok) {
        const pRes = await fetch(`/api/projects/${activeProject.id}`);
        const freshProj = await pRes.json();
        setActiveProject(freshProj);
        setBudgetSummary(data.budgetSummary);
        if (selectedItem?.id === itemId) {
          setSelectedItem(null);
        }
        showToast('Planning line removed.');
      } else {
        showToast(data.error || 'Failed to delete item', 'error');
      }
    } catch (err) {
      showToast('Delete error', 'error');
    }
  };

  // Approve & Freeze Baseline
  const handleApproveBaseline = async () => {
    if (!activeProject) return;
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/boq/approve`, {
        method: 'POST',
        headers: {
          'x-user-id': currentUser.id
        }
      });
      const data = await res.json();
      if (res.ok) {
        const pRes = await fetch(`/api/projects/${activeProject.id}`);
        const freshProj = await pRes.json();
        setActiveProject(freshProj);
        setBudgetSummary(data.budgetSummary);
        showToast('Revision Baseline approved and frozen in Dynamics 365 ledger!');
      } else {
        showToast(data.error || 'Permission denied', 'error');
      }
    } catch (err) {
      showToast('Approval error', 'error');
    }
  };

  // Generate Customer Quotation
  const handleGenerateQuotation = async (tier: 'ECONOMY' | 'STANDARD' | 'PREMIUM') => {
    if (!activeProject) return;
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/quotation/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ packageTier: tier })
      });
      const data = await res.json();
      if (res.ok) {
        const pRes = await fetch(`/api/projects/${activeProject.id}`);
        const freshProj = await pRes.json();
        setActiveProject(freshProj);
        showToast(`Posted formal ${tier} customer quotation #${data.quotationNumber}!`);
      } else {
        showToast(data.error || 'Failed to generate quotation', 'error');
      }
    } catch (err) {
      showToast('Quotation generation error', 'error');
    }
  };

  // Master Rate Updates
  const handleUpdateMasterRate = async (rate: MasterRateItem) => {
    try {
      const res = await fetch(`/api/masters/rates/${rate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify(rate)
      });
      if (res.ok) {
        loadMasterRates();
        showToast(`Updated master rate for: ${rate.description}`);
      } else {
        const d = await res.json();
        showToast(d.error || 'Failed to update rate', 'error');
      }
    } catch (err) {
      showToast('Rate update error', 'error');
    }
  };

  const handleAddMasterRate = async (rate: MasterRateItem) => {
    try {
      const res = await fetch('/api/masters/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify(rate)
      });
      if (res.ok) {
        loadMasterRates();
        showToast(`Added new master rate: ${rate.itemCode}`);
      } else {
        const d = await res.json();
        showToast(d.error || 'Failed to add rate', 'error');
      }
    } catch (err) {
      showToast('Rate addition error', 'error');
    }
  };

  const handleDeleteMasterRate = async (id: string) => {
    try {
      const res = await fetch(`/api/masters/rates/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': currentUser.id
        }
      });
      if (res.ok) {
        loadMasterRates();
        showToast('Master item deleted successfully.');
      } else {
        const d = await res.json();
        showToast(d.error || 'Failed to delete master item', 'error');
      }
    } catch (err) {
      showToast('Error deleting master item', 'error');
    }
  };

  // Reset System to Demo State
  const handleResetDemo = async () => {
    try {
      const res = await fetch('/api/system/reset-demo', {
        method: 'POST'
      });
      if (res.ok) {
        loadProjects();
        loadMasterRates();
        showToast('Dynamics 365 environment reset to baseline demo data!');
      }
    } catch (err) {
      showToast('Reset failed', 'error');
    }
  };

  // Select Revision
  const handleSelectRevision = (revId: string) => {
    if (!activeProject) return;
    setActiveProject({
      ...activeProject,
      activeRevisionId: revId
    });
    const rev = activeProject.revisions.find(r => r.id === revId);
    if (rev && rev.items.length > 0) {
      setSelectedItem(rev.items[0]);
    } else {
      setSelectedItem(null);
    }
  };

  // Export to Excel handler
  const handleExportToExcel = () => {
    if (!activeProject) return;
    const activeRev = activeProject.revisions.find(r => r.id === activeProject.activeRevisionId) || activeProject.revisions[0];
    if (!activeRev) return;
    exportJobPlanningLinesToExcel(activeProject, activeRev.items, budgetSummary);
    showToast('Exported Job Planning Lines to Microsoft Excel CSV.');
  };

  // Save Site Survey & Spatial Requirements
  const handleSaveRequirement = async (reqData: CustomerRequirement) => {
    if (!activeProject) return;
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/requirements`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify(reqData)
      });
      if (res.ok) {
        const updatedProject = await res.json();
        setActiveProject(updatedProject);
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        showToast('Site survey dimensions & constraints saved successfully!');
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to save requirements', 'error');
      }
    } catch (e) {
      showToast('Error saving site survey requirements', 'error');
    }
  };

  const activeRev = activeProject?.revisions.find(r => r.id === activeProject.activeRevisionId) || activeProject?.revisions[0];

  if (!authenticated) {
    return (
      <LoginPortalModal 
        isOpen 
        onLoginSuccess={handleLoginSuccess}
        users={users}
        currentSessionUser={currentUser}
      />
    );
  }

  return (
    <div className="erp-app min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#0F6CBD]/20">
      {/* 1. TOP DYNAMICS 365 SHELL (Single Unified ERP Control Center) */}
      <D365Shell
        currentUser={currentUser}
        allUsers={users}
        onSelectUser={handleSelectUser}
        activeProject={activeProject}
        projects={projects}
        onSelectProject={handleSelectProject}
        onOpenStatusModal={() => setStatusModalOpen(true)}
        onOpenAuditLogs={() => setAuditLogsOpen(true)}
        onOpenInspectData={() => setIsInspectOpen(true)}
        onLogout={handleLogout}
        onOpenProfile={handleOpenProfile}
        activeTab={activeTab === 'architecture' ? 'drawings' : activeTab}
        onNavigateTab={tab => setActiveTab(tab === 'architecture' ? 'drawings' : tab)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onExportToExcel={handleExportToExcel}
        onToggleFactBox={() => setIsFactBoxOpen(!isFactBoxOpen)}
        isFactBoxOpen={isFactBoxOpen}
      />

      {/* 2. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`flex items-center gap-2 rounded px-3.5 py-2.5 text-xs font-semibold shadow-lg border ${
            toastMessage.type === 'error'
              ? 'bg-[#FDE7E9] text-[#A80000] border-[#F19999]'
              : toastMessage.type === 'info'
              ? 'bg-[#EFF6FC] text-[#0F6CBD] border-[#C7E0F4]'
              : 'bg-[#DFF6DD] text-[#107C41] border-[#B3E5C7]'
          }`}>
            {toastMessage.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-[#A80000]" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-[#107C41]" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* 4. MAIN WORKSPACE (LEFT SIDEBAR MENU + D365 DOCUMENT CANVAS + FACTBOX PANE) */}
      <div className="erp-workspace flex-1 flex min-w-0">
        {/* Left Sidebar Menu: Lists all 26+ modules hierarchically as requested */}
        <LeftSidebarMenu
          activeTab={activeTab === 'architecture' ? 'drawings' : activeTab}
          onNavigateTab={tab => setActiveTab(tab === 'architecture' ? 'drawings' : tab)}
          activeProject={activeProject}
          projects={projects}
          onSelectProject={handleSelectProject}
          currentUser={currentUser}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenAuditLogs={() => setAuditLogsOpen(true)}
          onOpenInspectData={() => setIsInspectOpen(true)}
          onOpenStatusModal={() => setStatusModalOpen(true)}
          onOpenProfile={handleOpenProfile}
        />

        {/* Main Document Body */}
        <main className="erp-main flex-1 min-w-0 p-3 sm:p-4 md:p-5">
          {activeTab === 'dashboard' || activeTab === 'role_center' ? (
            <RoleCenterDashboardView
              currentUser={currentUser}
              allUsers={users}
              onSwitchUser={handleSelectUser}
              activeProject={activeProject}
              projects={projects}
              onSelectProject={handleSelectProject}
              budgetSummary={budgetSummary}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAIWorkspace={() => setActiveTab('ai_workspace')}
            />
          ) : activeTab === 'users' ? (
            <UserMasterSetupView
              users={users}
              currentUser={currentUser}
              onRefreshUsers={loadUsers}
              onSaveUser={handleSaveUser}
              onDeleteUser={handleDeleteUser}
              onSwitchUser={(u) => {
                handleSelectUser(u);
              }}
              onOpenProfile={handleOpenProfile}
            />
          ) : activeTab === 'masters' || activeTab === 'rates' ? (
            <MastersHubView
              currentUser={currentUser}
              masterRates={masterRates}
              onUpdateRate={handleUpdateMasterRate}
              onAddRate={handleAddMasterRate}
              onDeleteRate={handleDeleteMasterRate}
              onNavigateToCompanySetup={() => setActiveTab('company_setup')}
              onCreateNewProject={(newProj) => {
                setProjects(prev => [newProj, ...prev]);
                setActiveProject(newProj);
                setActiveProjectId(newProj.id);
                setActiveTab('general');
                showToast(`Created Job Card: ${newProj.projectCode}`);
              }}
              onSelectProject={(projId) => {
                const p = projects.find(x => x.id === projId);
                if (p) {
                  setActiveProject(p);
                  setActiveTab('general');
                }
              }}
            />
          ) : activeTab === 'company_setup' || activeTab === 'company_finance' ? (
            <CompanySetupMasterView
              currentUser={currentUser}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onOpenAuditLogs={() => setAuditLogsOpen(true)}
            />
          ) : activeTab === 'projects' ? (
            <ProjectsRegisterView
              projects={projects}
              activeProjectId={activeProjectId}
              currentUser={currentUser}
              onSelectProject={(id) => {
                handleSelectProject(id);
                setActiveTab('general');
              }}
              onCreateProject={(p) => {
                const newProj = p as ProjectRecord;
                setProjects(prev => [newProj, ...prev]);
                setActiveProject(newProj);
                setActiveProjectId(newProj.id);
                setActiveTab('general');
                showToast(`Created Job Card: ${newProj.projectCode}`);
              }}
              onOpenJobCard={(id) => {
                handleSelectProject(id);
                setActiveTab('general');
              }}
            />
          ) : activeTab === 'ai_workspace' && activeProject ? (
            <AgenticAIActionCenter
              project={activeProject}
              onClose={() => setActiveTab('general')}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          ) : activeTab === 'traceability' && activeProject ? (
            <CostTraceabilityMatrixView
              project={activeProject}
              onOpenAIWorkspace={() => setActiveTab('ai_workspace')}
              onNavigateToBOQ={() => setActiveTab('boq')}
            />
          ) : activeTab === 'reports' && activeProject ? (
            <MandatoryReportsHubView
              project={activeProject}
              currentUser={currentUser}
              budgetSummary={budgetSummary}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAIWorkspace={() => setActiveTab('ai_workspace')}
            />
          ) : activeTab === 'timesheets' ? (
            <TimesheetManagementView
              project={activeProject || undefined}
              projects={projects}
              currentUser={currentUser}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          ) : activeTab === 'resources' ? (
            <ResourceDeploymentView
              project={activeProject || undefined}
              projects={projects}
              currentUser={currentUser}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          ) : activeTab === 'project_hub' ? (
            <ProjectManagementHubView
              project={activeProject || undefined}
              projects={projects}
              currentUser={currentUser}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          ) : ['crm', 'contacts', 'drawings', 'materials', 'contracts', 'variations', 'schedule', 'site_execution', 'procurement', 'inventory', 'contractors', 'subcontractors', 'snags', 'compliance', 'handover', 'portal', 'warranty', 'finance', 'billing', 'documents', 'assets', 'modules'].includes(activeTab) && activeProject ? (
            <FullJourneyModulesView
              project={activeProject}
              currentUser={currentUser}
              initialTab={activeTab === 'modules' ? 'crm' : activeTab}
              onNavigateToCoreTab={(tab) => setActiveTab(tab)}
              onOpenAIWorkspace={() => setActiveTab('ai_workspace')}
            />
          ) : activeProject ? (
            <D365JobCard
              project={activeProject}
              currentUser={currentUser}
              masterRates={masterRates}
              budgetSummary={budgetSummary}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              onSelectRevision={handleSelectRevision}
              onGenerateAIBOQ={handleGenerateAIBOQ}
              isGeneratingAI={isGeneratingAI}
              onApproveBaseline={handleApproveBaseline}
              onUpdateItem={handleUpdateBOQItem}
              onAddItem={handleAddBOQItem}
              onDeleteItem={handleDeleteBOQItem}
              onExportToExcel={handleExportToExcel}
              onPrintQuotation={() => window.print()}
              onGenerateQuotation={handleGenerateQuotation}
              onSaveRequirement={handleSaveRequirement}
              activeTab={activeTab}
              onNavigateTab={tab => setActiveTab(tab)}
            />
          ) : (
            <div className="py-24 text-center text-xs text-[#605E5C]">
              Loading Dynamics 365 Business Central Job card...
            </div>
          )}
        </main>

        {/* Right Docked FactBox Sidebar */}
        <D365FactBoxPane
          isOpen={isFactBoxOpen}
          onToggle={() => setIsFactBoxOpen(prev => !prev)}
          onClose={() => setIsFactBoxOpen(false)}
          project={activeProject}
          selectedItem={selectedItem}
          budgetSummary={budgetSummary}
          currentUser={currentUser}
          onInspectField={() => setIsInspectOpen(true)}
        />
      </div>

      {/* 5. D365 PAGE & DATA INSPECTOR MODAL (Ctrl+Alt+F1) */}
      <D365InspectDataModal
        isOpen={isInspectOpen}
        onClose={() => setIsInspectOpen(false)}
        project={activeProject}
        selectedItem={selectedItem}
        activeTab={activeTab}
        currentUser={currentUser}
      />

      {/* System Status / Capability Modal */}
      <SystemStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
      />

      {/* Enterprise Audit Logs Modal */}
      <AuditLogsModal
        isOpen={auditLogsOpen}
        onClose={() => setAuditLogsOpen(false)}
      />

      {/* User Profile & Password Security Modal */}
      {isProfileModalOpen && (
        <UserProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          initialTab={profileModalTab}
          onUserUpdated={(updated) => {
            setCurrentUser(updated);
            setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, ...updated } : u));
            showToast('Profile and security details updated successfully', 'success');
          }}
        />
      )}

      {/* Enterprise Role-Based Login & Security Portal */}
      <LoginPortalModal
        isOpen={!authenticated || isLoginModalOpen}
        onLoginSuccess={handleLoginSuccess}
        onClose={authenticated ? () => setIsLoginModalOpen(false) : undefined}
        users={users}
        currentSessionUser={currentUser}
      />

      {/* Status Bar / Bottom System Footer */}
      <footer className="bg-[#FAF9F8] border-t border-[#E1DFDD] px-4 py-1.5 flex items-center justify-between text-[11px] text-[#605E5C] select-none print:hidden">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#201F1E]">Build Storys ERP</span>
          <span>•</span>
          <span>Consolidated Design & ERP</span>
          <span>•</span>
          <span className="text-[#107C41] font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#107C41] inline-block"></span>
            Build Storys Workspace
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden sm:inline">Shortcuts: <strong>Alt+Q</strong> (Tell Me), <strong>Ctrl+Alt+F1</strong> (Inspect), <strong>Alt+F2</strong> (FactBox)</span>
          <span>•</span>
          <button
            onClick={() => setStatusModalOpen(true)}
            className="text-[#0F6CBD] hover:underline"
          >
            Capabilities &amp; Architecture
          </button>
        </div>
      </footer>
    </div>
  );
}
