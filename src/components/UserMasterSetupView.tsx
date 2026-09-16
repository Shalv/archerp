import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Shield,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  Key,
  LogIn,
  MoreHorizontal,
  Mail,
  Phone,
  Building,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  UserCheck,
  UserX,
  FileSpreadsheet,
  Download,
  Check,
  X,
  ShieldAlert,
  Compass,
  ArrowRight,
  ChevronDown,
  Trash2,
  Edit3,
  AlertTriangle,
  UserPlus,
  KeyRound,
  FolderKanban,
  Briefcase
} from 'lucide-react';
import { UserSession, UserRole, UserPermissions, ROLE_DEFAULT_PERMISSIONS, ProjectRecord } from '../types/erp';
import { ERP_MODULES_REGISTRY } from '../data/modulesRegistry';
import { isImageAvatar, getUserInitials } from '../utils/avatarUtils';

interface UserMasterSetupViewProps {
  users: UserSession[];
  currentUser: UserSession;
  onRefreshUsers: () => void;
  onSaveUser: (user: UserSession) => Promise<boolean>;
  onDeleteUser: (userId: string, permanent?: boolean) => Promise<boolean>;
  onSwitchUser: (user: UserSession) => void;
  onOpenProfile?: (initialTab?: 'profile' | 'security' | 'work') => void;
  projects?: ProjectRecord[];
}

export const UserMasterSetupView: React.FC<UserMasterSetupViewProps> = ({
  users,
  currentUser,
  onRefreshUsers,
  onSaveUser,
  onDeleteUser,
  onSwitchUser,
  onOpenProfile,
  projects = []
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserSession | null>(null);

  // Deletion state
  const [userToDelete, setUserToDelete] = useState<UserSession | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(true);

  // Form State for User Setup
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('ESTIMATOR');
  const [formRoleTitle, setFormRoleTitle] = useState('');
  const [formDepartment, setFormDepartment] = useState('Estimating & Commercial');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'INACTIVE' | 'SUSPENDED'>('ACTIVE');
  const [formPermissions, setFormPermissions] = useState<UserPermissions>({ ...ROLE_DEFAULT_PERMISSIONS.ESTIMATOR });
  const [formAllowedModules, setFormAllowedModules] = useState<string[]>([]);
  const [formAssignedProjects, setFormAssignedProjects] = useState<string[]>(['PROJ-SKYLINE-1402']);
  const [formNotes, setFormNotes] = useState('');
  const [activeSetupTab, setActiveSetupTab] = useState<'GENERAL' | 'SECURITY' | 'PERMISSIONS' | 'MODULES' | 'ALLOCATION'>('GENERAL');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fallback projects if none passed
  const availableProjects: Array<{ id: string; projectCode?: string; title: string; clientName: string; stage?: string }> = 
    projects && projects.length > 0 ? projects : [
      { id: 'PROJ-SKYLINE-1402', projectCode: 'PRJ-SKYLINE-1402', title: 'Skyline Penthouse Luxury Interiors', clientName: 'Vikram Malhotra', stage: 'EXECUTION_ONGOING' },
      { id: 'PROJ-MALABAR-0801', projectCode: 'PRJ-MALABAR-0801', title: 'Malabar Coastal Villa Renovation', clientName: 'Ananya Deshmukh', stage: 'APPROVED_BUDGET' },
      { id: 'PROJ-ECO-2204', projectCode: 'PRJ-ECO-2204', title: 'Ecospace Office Tower Fit-out', clientName: 'Horizon Tech Park Ltd', stage: 'CONTRACT_AWARDED' }
    ];

  const isAdmin = currentUser.role === 'ADMIN' || currentUser.permissions?.canManageUsers;

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackToast({ text, type });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(search.toLowerCase())) ||
      (u.roleTitle && u.roleTitle.toLowerCase().includes(search.toLowerCase())) ||
      (u.department && u.department.toLowerCase().includes(search.toLowerCase())) ||
      u.id.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || (u.status || 'ACTIVE') === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate Metrics
  const totalUsersCount = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const estimatorCount = users.filter(u => u.role === 'ESTIMATOR').length;
  const pmCount = users.filter(u => u.role === 'PROJECT_MANAGER').length;
  const siteClientCount = users.filter(u => u.role === 'SITE_ENGINEER' || u.role === 'CLIENT').length;
  const activeCount = users.filter(u => (u.status || 'ACTIVE') === 'ACTIVE').length;

  const handleOpenCreateNew = () => {
    setEditingUser(null);
    setFormName('');
    setFormUsername('');
    setFormEmail('');
    setFormPassword('Build@2026');
    setShowPassword(false);
    setFormPhone('+91 98000 00000');
    setFormRole('ESTIMATOR');
    setFormRoleTitle('Quantity Surveyor & Estimator');
    setFormDepartment('Estimating & Commercial');
    setFormStatus('ACTIVE');
    setFormPermissions({ ...ROLE_DEFAULT_PERMISSIONS.ESTIMATOR });
    setFormAllowedModules(['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M10', 'M12', 'M13', 'M16', 'M17', 'M25', 'M26']);
    setFormAssignedProjects(['PROJ-SKYLINE-1402']);
    setFormNotes('');
    setActiveSetupTab('GENERAL');
    setIsSetupModalOpen(true);
  };

  const handleOpenEditUser = (user: UserSession) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormUsername(user.username || user.email.split('@')[0]);
    setFormEmail(user.email);
    setFormPassword('');
    setShowPassword(false);
    setFormPhone(user.phone || '+91 98000 00000');
    setFormRole(user.role);
    setFormRoleTitle(user.roleTitle || '');
    setFormDepartment(user.department || 'Operations');
    setFormStatus(user.status || 'ACTIVE');
    setFormPermissions({ ...ROLE_DEFAULT_PERMISSIONS[user.role], ...user.permissions });
    setFormAllowedModules(user.allowedModuleIds || []);
    setFormAssignedProjects(user.assignedProjectIds || ['PROJ-SKYLINE-1402']);
    setFormNotes(user.notes || '');
    setActiveSetupTab('GENERAL');
    setIsSetupModalOpen(true);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setFormRole(newRole);
    // Apply role defaults
    const defaults = ROLE_DEFAULT_PERMISSIONS[newRole];
    setFormPermissions({ ...defaults });

    if (newRole === 'ADMIN') {
      setFormRoleTitle('System Administrator & Director');
      setFormDepartment('Executive Management');
      setFormAllowedModules([]); // All modules
    } else if (newRole === 'ESTIMATOR') {
      setFormRoleTitle('Lead Quantity Surveyor & Cost Planner');
      setFormDepartment('Estimating & Commercial');
      setFormAllowedModules(['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M10', 'M12', 'M13', 'M16', 'M17', 'M25', 'M26']);
    } else if (newRole === 'PROJECT_MANAGER') {
      setFormRoleTitle('Senior Project Lead (Interiors & Turnkey)');
      setFormDepartment('Project Operations');
      setFormAllowedModules(['M01', 'M02', 'M03', 'M04', 'M08', 'M09', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M17', 'M18', 'M19', 'M20', 'M22', 'M24', 'M25']);
    } else if (newRole === 'SITE_ENGINEER') {
      setFormRoleTitle('Site Execution & QC Engineer');
      setFormDepartment('Field Operations');
      setFormAllowedModules(['M02', 'M03', 'M04', 'M05', 'M11', 'M14', 'M18', 'M19', 'M20', 'M23', 'M24']);
    } else if (newRole === 'CLIENT') {
      setFormRoleTitle('Property Owner / Client');
      setFormDepartment('Customer Accounts');
      setFormAllowedModules(['M02', 'M04', 'M05', 'M08', 'M20', 'M21']);
    }
  };

  const handleToggleModule = (moduleId: string) => {
    setFormAllowedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(m => m !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSaveUserSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      showToast('Name and Email are mandatory fields.', 'error');
      return;
    }

    setIsSaving(true);

    const userPayload: UserSession = {
      id: editingUser ? editingUser.id : `USR-${formRole.slice(0, 4)}-${String(users.length + 1).padStart(2, '0')}`,
      username: formUsername.trim().toLowerCase() || formEmail.split('@')[0],
      name: formName.trim(),
      email: formEmail.trim().toLowerCase(),
      password: formPassword || undefined,
      phone: formPhone.trim(),
      role: formRole,
      roleTitle: formRoleTitle.trim() || `${formRole} User`,
      department: formDepartment.trim(),
      status: formStatus,
      permissions: formPermissions,
      allowedModuleIds: formAllowedModules,
      assignedProjectIds: formAssignedProjects,
      notes: formNotes.trim(),
      createdAt: editingUser?.createdAt || new Date().toISOString(),
      lastLoginAt: editingUser?.lastLoginAt || new Date().toISOString()
    };

    const success = await onSaveUser(userPayload);
    setIsSaving(false);

    if (success) {
      setIsSetupModalOpen(false);
      showToast(editingUser ? `Updated User: ${userPayload.name}` : `Created New User: ${userPayload.name} (${userPayload.role})`);
    } else {
      showToast('Failed to save user. Please check permissions or network connection.', 'error');
    }
  };

  const handleToggleUserStatus = async (user: UserSession) => {
    const newStatus = (user.status || 'ACTIVE') === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updated = { ...user, status: newStatus as 'ACTIVE' | 'SUSPENDED' };
    const success = await onSaveUser(updated);
    if (success) {
      showToast(`User ${user.name} is now ${newStatus}.`);
    }
  };

  const handleNameChange = (nameVal: string) => {
    setFormName(nameVal);
    // If creating new user and username is empty or matches auto pattern, update username
    if (!editingUser) {
      const slug = nameVal.toLowerCase().trim().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
      setFormUsername(slug);
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const success = await onDeleteUser(userToDelete.id, deletePermanently);
      if (success) {
        showToast(
          deletePermanently 
            ? `User ${userToDelete.name} (${userToDelete.id}) permanently deleted.`
            : `User ${userToDelete.name} account deactivated.`,
          'success'
        );
        setUserToDelete(null);
        if (isSetupModalOpen && editingUser?.id === userToDelete.id) {
          setIsSetupModalOpen(false);
          setEditingUser(null);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Error occurred while deleting user.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const exportSecurityMatrixCSV = () => {
    const headers = ['User ID', 'Username', 'Name', 'Email', 'Role', 'Department', 'Status', 'Cost & Margin Visible', 'Approve BOQ Baseline', 'Manage Master Rates', 'Manage Users Admin', 'Allowed Modules Count'];
    const rows = users.map(u => [
      u.id,
      u.username || '',
      `"${u.name}"`,
      u.email,
      u.role,
      `"${u.department || ''}"`,
      u.status || 'ACTIVE',
      u.permissions.canViewCostAndMargin ? 'YES' : 'NO',
      u.permissions.canApproveBOQ ? 'YES' : 'NO',
      u.permissions.canManageMasterRates ? 'YES' : 'NO',
      u.permissions.canManageUsers ? 'YES' : 'NO',
      u.allowedModuleIds && u.allowedModuleIds.length > 0 ? u.allowedModuleIds.length : 'ALL (26)'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BuildStorys_User_Security_Matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported User Security Matrix to CSV.');
  };

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
        return 'bg-[#F3F2F1] text-[#323130] border-[#E1DFDD]';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in duration-150">
          <div className={`px-4 py-2.5 rounded-lg shadow-lg border text-xs font-semibold flex items-center gap-2 ${
            feedbackToast.type === 'error'
              ? 'bg-[#FDE7E9] text-[#A80000] border-[#F19999]'
              : 'bg-[#DFF6DD] text-[#107C41] border-[#B3E5C7]'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedbackToast.text}</span>
          </div>
        </div>
      )}

      {/* TOP COMMAND HEADER */}
      <div className="bg-white p-4 rounded-lg border border-[#EDEBE9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#002050] text-white rounded-md">
              <Shield className="w-5 h-5 text-[#89BBE9]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#201F1E]">User Master Setup &amp; Security Roles</h1>
                <span className="text-[10px] font-mono bg-[#EFF6FC] text-[#0F6CBD] font-bold px-1.5 py-0.5 rounded border border-[#C7E0F4]">
                  Table 2000000120 User Setup
                </span>
              </div>
              <p className="text-xs text-[#605E5C] mt-0.5">
                Create system users, set individual login credentials, and define granular module access &amp; commercial permissions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportSecurityMatrixCSV}
            className="px-3 py-1.5 bg-white hover:bg-[#F3F2F1] text-[#323130] border border-[#8A8886] rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-[#605E5C]" />
            <span>Export Matrix</span>
          </button>

          <button
            onClick={onRefreshUsers}
            className="px-3 py-1.5 bg-white hover:bg-[#F3F2F1] text-[#323130] border border-[#8A8886] rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#605E5C]" />
            <span>Refresh</span>
          </button>

          {onOpenProfile && (
            <button
              onClick={() => onOpenProfile('security')}
              id="btn-my-profile-user-master"
              className="px-3 py-1.5 bg-[#EFF6FC] hover:bg-[#DEECF9] text-[#0F6CBD] border border-[#C7E0F4] rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
              title="Open Personal Profile to update password"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#0F6CBD]" />
              <span>My Profile &amp; Password</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={handleOpenCreateNew}
              id="btn-create-new-user-master"
              className="px-3.5 py-1.5 bg-[#0F6CBD] hover:bg-[#0B5A9D] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New User</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded-lg border border-[#EDEBE9] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#605E5C]">Total Users</div>
          <div className="text-lg font-bold text-[#201F1E] mt-1 flex items-baseline gap-2">
            <span>{totalUsersCount}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">{activeCount} Active</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#EDEBE9] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#605E5C]">Administrators</div>
          <div className="text-lg font-bold text-[#6B21A8] mt-1">{adminCount}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#EDEBE9] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#605E5C]">Estimators / QS</div>
          <div className="text-lg font-bold text-[#0F6CBD] mt-1">{estimatorCount}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#EDEBE9] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#605E5C]">Project Managers</div>
          <div className="text-lg font-bold text-[#92400E] mt-1">{pmCount}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#EDEBE9] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#605E5C]">Site &amp; Clients</div>
          <div className="text-lg font-bold text-[#15803D] mt-1">{siteClientCount}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#EDEBE9] shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#605E5C]">Current Login</div>
          <div className="text-xs font-bold text-[#201F1E] truncate mt-1">{currentUser.name.split(' ')[0]}</div>
          <div className="text-[10px] text-[#0F6CBD] font-mono">{currentUser.role}</div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white p-3 rounded-lg border border-[#EDEBE9] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8A8886]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, username, role..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#C8C6C4] rounded focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#605E5C]" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs border border-[#C8C6C4] rounded px-2.5 py-1.5 focus:border-[#0F6CBD] focus:outline-none bg-white text-[#323130]"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="ADMIN">Administrators</option>
            <option value="ESTIMATOR">Estimators &amp; QS</option>
            <option value="PROJECT_MANAGER">Project Managers</option>
            <option value="SITE_ENGINEER">Site Engineers</option>
            <option value="CLIENT">Clients</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-[#C8C6C4] rounded px-2.5 py-1.5 focus:border-[#0F6CBD] focus:outline-none bg-white text-[#323130]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUSPENDED">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* USER MASTER TABLE */}
      <div className="bg-white rounded-lg border border-[#EDEBE9] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F8] border-b border-[#EDEBE9] text-[#605E5C] text-[11px] font-bold uppercase tracking-wider select-none">
                <th className="py-2.5 px-3 whitespace-nowrap">User ID / Username</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Full Name &amp; Dept</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Email &amp; Phone</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Security Role</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Commercial Permissions</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Allocated Projects &amp; Work</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Module Access</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Actions (Login / Edit / Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBE9]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#605E5C]">
                    <Users className="w-10 h-10 mx-auto text-[#C8C6C4] mb-2" />
                    <div className="font-semibold text-sm text-[#201F1E]">No user records found</div>
                    <p className="text-xs text-[#605E5C] mt-1 max-w-sm mx-auto">
                      No user accounts match your search or role filter criteria.
                    </p>
                    {isAdmin && (
                      <button
                        onClick={handleOpenCreateNew}
                        className="mt-3 px-3.5 py-1.5 bg-[#0F6CBD] hover:bg-[#0B5A9D] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 shadow-xs transition"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Create New User</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = user.id === currentUser.id;
                  const isSuspended = user.status === 'SUSPENDED';
                  const moduleCount = user.allowedModuleIds && user.allowedModuleIds.length > 0 ? user.allowedModuleIds.length : 26;

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-[#FAF9F8] transition ${isCurrent ? 'bg-[#EFF6FC]/40' : ''}`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-[#0F6CBD]">{user.id}</div>
                        <div className="text-[11px] text-[#605E5C] font-mono">
                          @{user.username || user.email.split('@')[0]}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#0F6CBD] text-white text-xs font-bold flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-black/10">
                            {isImageAvatar(user.avatar) ? (
                              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover rounded-full" />
                            ) : (
                              <span>{getUserInitials(user.name, user.avatar)}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-[#201F1E] flex items-center gap-1.5">
                              <span className="truncate">{user.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1 py-0.2 rounded shrink-0">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#605E5C] truncate">{user.department || user.roleTitle}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="text-[#323130]">{user.email}</div>
                        <div className="text-[11px] text-[#8A8886] font-mono">{user.phone || '+91 98000 00000'}</div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${getRoleBadgeStyle(user.role)}`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <Lock className="w-3 h-3" /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {user.permissions.canViewCostAndMargin ? (
                            <span className="bg-emerald-50 text-emerald-700 text-[9px] px-1.5 py-0.2 rounded font-medium border border-emerald-200">
                              Cost &amp; Margins
                            </span>
                          ) : (
                            <span className="bg-rose-50 text-rose-700 text-[9px] px-1.5 py-0.2 rounded font-medium border border-rose-200">
                              Cost Hidden
                            </span>
                          )}

                          {user.permissions.canApproveBOQ && (
                            <span className="bg-blue-50 text-blue-700 text-[9px] px-1.5 py-0.2 rounded font-medium border border-blue-200">
                              QS Baseline
                            </span>
                          )}

                          {user.permissions.canManageUsers && (
                            <span className="bg-purple-50 text-purple-700 text-[9px] px-1.5 py-0.2 rounded font-medium border border-purple-200">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap items-center gap-1 max-w-[210px]">
                          {user.assignedProjectIds && user.assignedProjectIds.length > 0 ? (
                            user.assignedProjectIds.map((pid) => (
                              <span key={pid} className="font-mono text-[9px] bg-[#EFF6FC] text-[#0F6CBD] px-1.5 py-0.5 rounded border border-[#C7E0F4] font-bold">
                                {pid.replace('PROJ-', '')}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-[#8A8886] italic">Skyline Default</span>
                          )}
                        </div>
                        {user.notes ? (
                          <div className="text-[10px] text-[#605E5C] truncate max-w-[200px] mt-0.5" title={user.notes}>
                            {user.notes}
                          </div>
                        ) : (
                          <div className="text-[10px] text-[#A19F9D] truncate max-w-[200px] mt-0.5">
                            {user.roleTitle || user.department}
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="font-mono text-xs font-semibold text-[#201F1E]">
                          {moduleCount === 26 ? (
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              All 26 Modules
                            </span>
                          ) : (
                            <span className="text-[#0F6CBD] bg-[#EFF6FC] px-1.5 py-0.5 rounded border border-[#C7E0F4]">
                              {moduleCount} Modules Allowed
                            </span>
                          )}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Personal Profile & Password Action for Current User */}
                          {isCurrent && onOpenProfile && (
                            <button
                              onClick={() => onOpenProfile('security')}
                              title="Update My Profile & Change Password"
                              className="px-2 py-1 bg-[#EFF6FC] hover:bg-[#DEECF9] text-[#0F6CBD] border border-[#C7E0F4] rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition"
                            >
                              <KeyRound className="w-3 h-3 text-[#0F6CBD]" />
                              <span>My Password</span>
                            </button>
                          )}

                          {/* Instant Test Login Switcher */}
                          <button
                            onClick={() => onSwitchUser(user)}
                            title={`Switch Login Session to ${user.name}`}
                            className="px-2 py-1 bg-white hover:bg-[#EFF6FC] text-[#0F6CBD] border border-[#C7E0F4] rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition"
                          >
                            <LogIn className="w-3 h-3" />
                            <span>Login As</span>
                          </button>

                          {/* Edit User Setup */}
                          {isAdmin && (
                            <button
                              onClick={() => handleOpenEditUser(user)}
                              title={`Edit ${user.name} & Permissions`}
                              className="px-2 py-1 bg-white hover:bg-[#F3F2F1] text-[#201F1E] hover:text-[#0F6CBD] border border-[#EDEBE9] hover:border-[#C7E0F4] rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition"
                            >
                              <Edit3 className="w-3 h-3 text-[#0F6CBD]" />
                              <span>Edit</span>
                            </button>
                          )}

                          {/* Delete User from Master Setup */}
                          {isAdmin && (
                            <button
                              onClick={() => setUserToDelete(user)}
                              disabled={isCurrent}
                              title={isCurrent ? 'Cannot delete current logged-in user account' : `Delete ${user.name} from User Master`}
                              className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-[#EDEBE9] hover:border-rose-200 rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-rose-600"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          )}

                          {/* Suspend / Reactivate */}
                          {isAdmin && !isCurrent && (
                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              title={isSuspended ? 'Reactivate User Account' : 'Suspend User Login'}
                              className={`p-1 rounded transition border border-transparent ${
                                isSuspended
                                  ? 'hover:bg-emerald-50 text-emerald-600 hover:border-emerald-200'
                                  : 'hover:bg-amber-50 text-amber-600 hover:border-amber-200'
                              }`}
                            >
                              {isSuspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT USER SETUP MODAL */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-[#EDEBE9] overflow-hidden my-6">
            {/* Modal Header */}
            <div className="bg-[#002050] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#003A70]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0F6CBD] rounded-lg text-white">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold">
                    {editingUser ? `Edit User Setup: ${editingUser.name}` : 'New User Setup & Access Definition'}
                  </h2>
                  <p className="text-xs text-[#89BBE9]">
                    Configure authentication credentials, primary role, and granular ERP access permissions.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="p-1.5 hover:bg-white/10 text-white rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#EDEBE9] bg-[#FAF9F8] px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveSetupTab('GENERAL')}
                className={`py-2 px-3 border-b-2 transition ${
                  activeSetupTab === 'GENERAL'
                    ? 'border-[#0F6CBD] text-[#0F6CBD] font-bold'
                    : 'border-transparent text-[#605E5C] hover:text-[#201F1E]'
                }`}
              >
                1. Identity &amp; Role
              </button>
              <button
                onClick={() => setActiveSetupTab('SECURITY')}
                className={`py-2 px-3 border-b-2 transition ${
                  activeSetupTab === 'SECURITY'
                    ? 'border-[#0F6CBD] text-[#0F6CBD] font-bold'
                    : 'border-transparent text-[#605E5C] hover:text-[#201F1E]'
                }`}
              >
                2. Login Credentials
              </button>
              <button
                onClick={() => setActiveSetupTab('PERMISSIONS')}
                className={`py-2 px-3 border-b-2 transition ${
                  activeSetupTab === 'PERMISSIONS'
                    ? 'border-[#0F6CBD] text-[#0F6CBD] font-bold'
                    : 'border-transparent text-[#605E5C] hover:text-[#201F1E]'
                }`}
              >
                3. Permissions Matrix
              </button>
              <button
                onClick={() => setActiveSetupTab('MODULES')}
                className={`py-2 px-3 border-b-2 transition ${
                  activeSetupTab === 'MODULES'
                    ? 'border-[#0F6CBD] text-[#0F6CBD] font-bold'
                    : 'border-transparent text-[#605E5C] hover:text-[#201F1E]'
                }`}
              >
                4. 26 Module Access Control
              </button>
              <button
                onClick={() => setActiveSetupTab('ALLOCATION')}
                className={`py-2 px-3 border-b-2 transition ${
                  activeSetupTab === 'ALLOCATION'
                    ? 'border-[#0F6CBD] text-[#0F6CBD] font-bold'
                    : 'border-transparent text-[#605E5C] hover:text-[#201F1E]'
                }`}
              >
                5. Project &amp; Work Allocation
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveUserSetup}>
              <div className="p-6 max-h-[480px] overflow-y-auto space-y-4">
                {/* TAB 1: IDENTITY & ROLE */}
                {activeSetupTab === 'GENERAL' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#323130] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="e.g. Vikram Sharma"
                          className="w-full px-3 py-2 text-xs border border-[#C8C6C4] rounded focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#323130] mb-1">
                          Login Username *
                        </label>
                        <input
                          type="text"
                          value={formUsername}
                          onChange={(e) => setFormUsername(e.target.value)}
                          placeholder="e.g. vikram.qs"
                          className="w-full px-3 py-2 text-xs border border-[#C8C6C4] rounded focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] focus:outline-none font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#323130] mb-1">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="e.g. vikram@buildstorys.com"
                          className="w-full px-3 py-2 text-xs border border-[#C8C6C4] rounded focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#323130] mb-1">
                          Contact Phone
                        </label>
                        <input
                          type="text"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder="+91 98200 00000"
                          className="w-full px-3 py-2 text-xs border border-[#C8C6C4] rounded focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#323130] mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          value={formDepartment}
                          onChange={(e) => setFormDepartment(e.target.value)}
                          placeholder="e.g. Estimating & Commercial"
                          className="w-full px-3 py-2 text-xs border border-[#C8C6C4] rounded focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#323130] mb-1">
                          Designation / Job Title
                        </label>
                        <input
                          type="text"
                          value={formRoleTitle}
                          onChange={(e) => setFormRoleTitle(e.target.value)}
                          placeholder="e.g. Senior Quantity Surveyor"
                          className="w-full px-3 py-2 text-xs border border-[#C8C6C4] rounded focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-bold text-[#323130] mb-2">
                        Select Primary Security Role Group:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { role: 'ADMIN', title: 'Administrator', desc: 'Full unrestricted access to all 26 modules & User Master Setup.' },
                          { role: 'ESTIMATOR', title: 'Estimator / QS', desc: 'Full BOQ, baseline approvals, master rates, and cost budgeting.' },
                          { role: 'PROJECT_MANAGER', title: 'Project Manager', desc: 'Site operations, variations, contractor work orders, and billing.' },
                          { role: 'SITE_ENGINEER', title: 'Site Engineer', desc: 'Laser surveys, DPR logs, site inspections. Cost & margin hidden.' },
                          { role: 'CLIENT', title: 'Client / Owner', desc: 'Restricted Customer Portal, quotations, drawings & milestone approvals.' },
                        ].map((item) => (
                          <div
                            key={item.role}
                            onClick={() => handleRoleChange(item.role as UserRole)}
                            className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                              formRole === item.role
                                ? 'bg-[#EFF6FC] border-[#0F6CBD] ring-1 ring-[#0F6CBD]'
                                : 'bg-white border-[#EDEBE9] hover:border-[#C8C6C4]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#201F1E]">{item.title}</span>
                              {formRole === item.role && <CheckCircle2 className="w-3.5 h-3.5 text-[#0F6CBD]" />}
                            </div>
                            <p className="text-[11px] text-[#605E5C] mt-1">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: LOGIN CREDENTIALS & ACCOUNT STATUS */}
                {activeSetupTab === 'SECURITY' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#0F6CBD]" />
                        <span>Authentication Credentials</span>
                      </h3>

                      <div>
                        <label className="block text-xs font-semibold text-[#323130] mb-1">
                          Login Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formPassword}
                            onChange={(e) => setFormPassword(e.target.value)}
                            placeholder={editingUser ? 'Leave blank to keep current password' : 'Set password (min 6 characters)'}
                            className="w-full px-3 pr-10 py-2 text-xs border border-[#C8C6C4] rounded focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] focus:outline-none font-mono"
                            required={!editingUser}
                            minLength={6}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-[#8A8886] hover:text-[#323130]"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-[#605E5C] mt-1">
                          Users can authenticate using either their Email or Username with this password.
                        </p>
                      </div>

                      <div className="pt-2">
                        <label className="block text-xs font-semibold text-[#323130] mb-1.5">
                          Account Access Status:
                        </label>
                        <div className="flex items-center gap-3">
                          {[
                            { value: 'ACTIVE', label: 'Active (Allowed Login)', color: 'text-emerald-700' },
                            { value: 'SUSPENDED', label: 'Suspended (Access Blocked)', color: 'text-rose-700' },
                            { value: 'INACTIVE', label: 'Pending Activation', color: 'text-amber-700' },
                          ].map((st) => (
                            <label key={st.value} className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                              <input
                                type="radio"
                                name="accountStatus"
                                value={st.value}
                                checked={formStatus === st.value}
                                onChange={() => setFormStatus(st.value as any)}
                                className="text-[#0F6CBD] focus:ring-[#0F6CBD]"
                              />
                              <span className={st.color}>{st.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#323130] mb-1">
                        Administrative Notes / Access Reason
                      </label>
                      <textarea
                        rows={2}
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        placeholder="e.g. External quantity surveying consultant with 6-month contract..."
                        className="w-full p-2.5 text-xs border border-[#C8C6C4] rounded focus:border-[#0F6CBD] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: GRANULAR PERMISSIONS MATRIX */}
                {activeSetupTab === 'PERMISSIONS' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#EDEBE9]">
                      <span className="text-xs font-bold text-[#323130]">Individual Feature Authorizations:</span>
                      <button
                        type="button"
                        onClick={() => setFormPermissions({ ...ROLE_DEFAULT_PERMISSIONS[formRole] })}
                        className="text-xs text-[#0F6CBD] hover:underline font-semibold"
                      >
                        Reset to Role Defaults
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        {
                          key: 'canViewCostAndMargin' as keyof UserPermissions,
                          label: 'View Direct Costs & Contractor Margins',
                          desc: 'View confidential material/labour cost rates, markup %, and profit variances.'
                        },
                        {
                          key: 'canApproveBOQ' as keyof UserPermissions,
                          label: 'Approve & Freeze Contractual BOQ Baseline',
                          desc: 'Lead QS sign-off authority to officially freeze baselines.'
                        },
                        {
                          key: 'canEditBOQ' as keyof UserPermissions,
                          label: 'Edit Job Planning Lines (BOQ Items)',
                          desc: 'Add, update quantities, edit rate takeoffs.'
                        },
                        {
                          key: 'canRunAITakeoff' as keyof UserPermissions,
                          label: 'Execute BuildStorys Copilot AI Takeoff',
                          desc: 'Run Gemini AI extraction agents for automated BOQ takeoffs.'
                        },
                        {
                          key: 'canManageMasterRates' as keyof UserPermissions,
                          label: 'Manage Corporate Master Rate Price Book',
                          desc: 'Add and edit rates, wastage norms, and Indian GST tax tables.'
                        },
                        {
                          key: 'canGenerateQuotation' as keyof UserPermissions,
                          label: 'Generate & Post Sales Quotations',
                          desc: 'Create official quotations and milestone payment tranches.'
                        },
                        {
                          key: 'canManageProjects' as keyof UserPermissions,
                          label: 'Create & Manage Project Job Cards',
                          desc: 'Initialize new project records and customer metadata.'
                        },
                        {
                          key: 'canConductSiteSurvey' as keyof UserPermissions,
                          label: 'Conduct Site Survey & Log Laser Dimensions',
                          desc: 'Input room measurements and site survey constraint logs.'
                        },
                        {
                          key: 'canManageUsers' as keyof UserPermissions,
                          label: 'User Administration & Security Management',
                          desc: 'Admin authority to create users and assign permissions.'
                        },
                        {
                          key: 'canViewAuditLogs' as keyof UserPermissions,
                          label: 'View Enterprise System Audit Trails',
                          desc: 'Review change telemetry and security logs.'
                        },
                        {
                          key: 'canExportData' as keyof UserPermissions,
                          label: 'Export Data to Microsoft Excel / CSV',
                          desc: 'Download BOQs, budgets, and traceability ledgers.'
                        }
                      ].map((perm) => (
                        <label
                          key={perm.key}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg border border-[#EDEBE9] hover:bg-[#FAF9F8] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={!!formPermissions[perm.key]}
                            onChange={(e) => setFormPermissions({ ...formPermissions, [perm.key]: e.target.checked })}
                            className="mt-0.5 rounded border-[#8A8886] text-[#0F6CBD] focus:ring-[#0F6CBD]"
                          />
                          <div>
                            <div className="text-xs font-semibold text-[#201F1E]">{perm.label}</div>
                            <div className="text-[10px] text-[#605E5C] mt-0.5">{perm.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: 26 MODULE ACCESS CONTROL */}
                {activeSetupTab === 'MODULES' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#EDEBE9]">
                      <div>
                        <span className="text-xs font-bold text-[#323130]">Authorized Journey Modules (26):</span>
                        <span className="text-[11px] text-[#605E5C] ml-2">
                          {formAllowedModules.length === 0 ? 'All 26 Modules Authorized' : `${formAllowedModules.length} Modules Selected`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormAllowedModules([])}
                          className="text-xs text-[#0F6CBD] hover:underline font-semibold"
                        >
                          Grant All 26 Modules
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setFormAllowedModules(['M02', 'M04', 'M05', 'M08', 'M21'])}
                          className="text-xs text-[#0F6CBD] hover:underline font-semibold"
                        >
                          Client Preset
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                      {ERP_MODULES_REGISTRY.map((mod) => {
                        const modKey = mod.code;
                        const isChecked = formAllowedModules.length === 0 || formAllowedModules.includes(modKey);

                        return (
                          <label
                            key={mod.code}
                            className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition ${
                              isChecked ? 'bg-[#EFF6FC]/30 border-[#C7E0F4]' : 'bg-white border-[#EDEBE9] opacity-70'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleModule(modKey)}
                              className="mt-0.5 rounded border-[#8A8886] text-[#0F6CBD] focus:ring-[#0F6CBD]"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-[#201F1E] font-mono">{mod.code}: {mod.name}</span>
                                <span className="text-[9px] text-[#0F6CBD] font-semibold">{mod.stageLabel}</span>
                              </div>
                              <div className="text-[10px] text-[#605E5C] truncate">{mod.keyFunctionality}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 5: PROJECT & WORK ALLOCATION */}
                {activeSetupTab === 'ALLOCATION' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#EDEBE9]">
                      <div>
                        <span className="text-xs font-bold text-[#323130]">Allocated Projects ({availableProjects.length}):</span>
                        <span className="text-[11px] text-[#605E5C] ml-2">
                          {formAssignedProjects.length} Projects Allocated
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormAssignedProjects(availableProjects.map(p => p.id))}
                          className="text-xs text-[#0F6CBD] hover:underline font-semibold"
                        >
                          Allocate All Projects
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setFormAssignedProjects(['PROJ-SKYLINE-1402'])}
                          className="text-xs text-[#0F6CBD] hover:underline font-semibold"
                        >
                          Primary Only
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {availableProjects.map((proj) => {
                        const isSelected = formAssignedProjects.includes(proj.id);
                        return (
                          <label
                            key={proj.id}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                              isSelected ? 'bg-[#EFF6FC]/60 border-[#0F6CBD]' : 'bg-white border-[#EDEBE9] hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                if (isSelected) {
                                  if (formAssignedProjects.length > 1) {
                                    setFormAssignedProjects(formAssignedProjects.filter(id => id !== proj.id));
                                  }
                                } else {
                                  setFormAssignedProjects([...formAssignedProjects, proj.id]);
                                }
                              }}
                              className="mt-0.5 rounded border-[#8A8886] text-[#0F6CBD] focus:ring-[#0F6CBD]"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-[#0F6CBD]">{proj.projectCode || proj.id}</span>
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                  {proj.stage || 'ACTIVE'}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-[#201F1E] truncate mt-0.5">{proj.title}</div>
                              <div className="text-[10px] text-[#605E5C] truncate">Client: {proj.clientName}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {/* Work Scope / Trade Responsibilities */}
                    <div className="pt-2 border-t border-[#EDEBE9]">
                      <label className="block text-xs font-bold text-[#201F1E] mb-1">
                        Allocated Work Packages, Trade Responsibilities &amp; Site Notes
                      </label>
                      <textarea
                        rows={3}
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#C8C6C4] rounded focus:border-[#0F6CBD] focus:outline-none bg-white font-sans"
                        placeholder="e.g. Lead Quantity Surveyor for Skyline Penthouse; Responsible for MEP vendor tender evaluations, civil milestone signoffs, and change order approvals..."
                      />
                      <span className="text-[10px] text-[#605E5C] mt-0.5 block">
                        These work assignments and project allocations remain stored permanently with this user's profile and persist across future logins.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-[#FAF9F8] px-6 py-3 border-t border-[#EDEBE9] flex items-center justify-between">
                <div>
                  {editingUser && isAdmin && editingUser.id !== currentUser.id && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = editingUser;
                        setIsSetupModalOpen(false);
                        setUserToDelete(target);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded flex items-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete User</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSetupModalOpen(false)}
                    className="px-4 py-1.5 text-xs font-semibold text-[#323130] hover:bg-[#EDEBE9] rounded transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-1.5 bg-[#0F6CBD] hover:bg-[#0B5A9D] text-white text-xs font-semibold rounded shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{editingUser ? 'Update User Setup' : 'Create User & Save'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#EDEBE9] overflow-hidden my-6">
            {/* Header */}
            <div className="bg-rose-50 border-b border-rose-200 p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-600 text-white rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-rose-900">Delete User Account</h3>
                  <p className="text-xs text-rose-700">User Master Setup Removal &amp; Access Revocation</p>
                </div>
              </div>
              <button
                onClick={() => setUserToDelete(null)}
                className="p-1.5 hover:bg-rose-100 text-rose-700 rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* User preview card */}
              <div className="bg-[#FAF9F8] p-3.5 rounded-lg border border-[#EDEBE9] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F6CBD] text-white flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 ring-1 ring-black/10">
                  {isImageAvatar(userToDelete.avatar) ? (
                    <img src={userToDelete.avatar} alt={userToDelete.name} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <span>{getUserInitials(userToDelete.name, userToDelete.avatar)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#201F1E] truncate">{userToDelete.name}</h4>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeStyle(userToDelete.role)}`}>
                      {userToDelete.role}
                    </span>
                  </div>
                  <div className="text-xs text-[#605E5C] flex items-center gap-2">
                    <span className="font-mono text-[#0F6CBD] font-semibold">{userToDelete.id}</span>
                    <span>•</span>
                    <span>{userToDelete.email}</span>
                  </div>
                  <div className="text-[11px] text-[#8A8886] mt-0.5">
                    {userToDelete.department || userToDelete.roleTitle}
                  </div>
                </div>
              </div>

              {/* Security checks warnings */}
              {userToDelete.id === currentUser.id ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-amber-800 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Active Session Guard</div>
                    <p className="mt-0.5">
                      You are currently logged in as <strong>{userToDelete.name}</strong>. You cannot delete your own active session. Please switch users or log in as another Administrator to delete this account.
                    </p>
                  </div>
                </div>
              ) : (userToDelete.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN' && u.id !== userToDelete.id && u.status !== 'INACTIVE').length === 0) ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-rose-800 text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Last Administrator Protection</div>
                    <p className="mt-0.5">
                      This account is the only active Administrator in the system. The ERP requires at least one active Administrator to manage permissions and security.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs text-[#605E5C]">
                    Please select how you would like to remove this user from the system. Once removed, this user will no longer be able to log in or access assigned modules.
                  </p>

                  <div className="space-y-2.5 pt-1">
                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      deletePermanently ? 'bg-rose-50/50 border-rose-300' : 'bg-white border-[#EDEBE9]'
                    }`}>
                      <input
                        type="radio"
                        name="deleteMode"
                        checked={deletePermanently}
                        onChange={() => setDeletePermanently(true)}
                        className="mt-0.5 text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#201F1E]">Permanently Delete User Record</div>
                        <div className="text-[11px] text-[#605E5C]">
                          Completely purges this user record from the database, user master directory, and login portal.
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      !deletePermanently ? 'bg-amber-50/50 border-amber-300' : 'bg-white border-[#EDEBE9]'
                    }`}>
                      <input
                        type="radio"
                        name="deleteMode"
                        checked={!deletePermanently}
                        onChange={() => setDeletePermanently(false)}
                        className="mt-0.5 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#201F1E]">Deactivate / Suspend Account Only</div>
                        <div className="text-[11px] text-[#605E5C]">
                          Disables login access and locks the user out while preserving audit trails and historical records.
                        </div>
                      </div>
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="bg-[#FAF9F8] px-6 py-3 border-t border-[#EDEBE9] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-1.5 text-xs font-semibold text-[#323130] hover:bg-[#EDEBE9] rounded transition"
              >
                Cancel
              </button>

              {userToDelete.id !== currentUser.id && !(userToDelete.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN' && u.id !== userToDelete.id && u.status !== 'INACTIVE').length === 0) && (
                <button
                  type="button"
                  onClick={handleConfirmDeleteUser}
                  disabled={isDeleting}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletePermanently ? 'Permanently Delete' : 'Deactivate Account'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
