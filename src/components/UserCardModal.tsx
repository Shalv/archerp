import React, { useState, useEffect } from 'react';
import { 
  X, 
  Shield, 
  User, 
  Mail, 
  Phone, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Sparkles, 
  Calculator, 
  FileSpreadsheet, 
  FileText, 
  Settings, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Check,
  Save,
  Trash2,
  LogIn,
  Layers,
  History,
  Info
} from 'lucide-react';
import { UserSession, UserRole, UserPermissions, ROLE_DEFAULT_PERMISSIONS } from '../types/erp';

interface UserCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession | null; // null means create new user
  currentUser: UserSession;
  onSaveUser: (savedUser: UserSession) => Promise<boolean>;
  onDeleteUser?: (userId: string) => Promise<boolean>;
  onSwitchUser?: (user: UserSession) => void;
}

const PERMISSION_METADATA: Array<{
  key: keyof UserPermissions;
  label: string;
  category: 'Commercial & Financial' | 'Estimating & Engineering' | 'Site & Operations' | 'Administration & Security';
  description: string;
  critical?: boolean;
}> = [
  // Category 1: Commercial & Financial
  {
    key: 'canViewCostAndMargin',
    label: 'View Direct Costs & Contractor Profit Margins',
    category: 'Commercial & Financial',
    description: 'Enables viewing confidential material/labour unit costs, markup %, purchase bid rates, and internal profit margins. Hidden for Clients & Site Engineers.',
    critical: true
  },
  {
    key: 'canGenerateQuotation',
    label: 'Generate & Post Customer Sales Quotations',
    category: 'Commercial & Financial',
    description: 'Allows creating formal customer quotations, adjusting milestone payment terms, and issuing contractual commercial proposals.'
  },
  {
    key: 'canApprovePO',
    label: 'Approve Material Purchase Orders (PO)',
    category: 'Commercial & Financial',
    description: 'Financial approval authority to issue material purchase orders to verified vendors against BOQ lines.',
    critical: true
  },
  {
    key: 'canCertifyBills',
    label: 'Certify Contractor Measurement Sheets & Bills',
    category: 'Commercial & Financial',
    description: 'Certify site measurements, quality checks, and approve joint measurement sheets (JMS) for contractor billing.'
  },
  {
    key: 'canExportData',
    label: 'Export Financial Ledgers & BOQ to Excel',
    category: 'Commercial & Financial',
    description: 'Grants authorization to download Job Planning Lines, Master Price Books, and ledger summaries into Microsoft Excel (CSV).'
  },

  // Category 2: Estimating & Engineering
  {
    key: 'canEditBOQ',
    label: 'Edit Job Planning Lines (BOQ Studio)',
    category: 'Estimating & Engineering',
    description: 'Add new work items, modify quantities, update line specifications, and delete unapproved takeoff items.',
    critical: true
  },
  {
    key: 'canRunAITakeoff',
    label: 'Execute BuildStorys Copilot AI Takeoff',
    category: 'Estimating & Engineering',
    description: 'Run Gemini AI extraction agents to generate automatic draft BOQ lines from site survey notes and architectural briefs.'
  },
  {
    key: 'canApproveBOQ',
    label: 'Approve & Freeze Contractual Baseline (QS Authority)',
    category: 'Estimating & Engineering',
    description: 'Senior Quantity Surveyor sign-off authority to officially freeze Rev 1+ baselines, locking quantities against variations.',
    critical: true
  },
  {
    key: 'canManageMasterRates',
    label: 'Manage Corporate Master Rate Library',
    category: 'Estimating & Engineering',
    description: 'Create, edit, and update base rates, wastage norms, labour crew rates, and Indian GST tax rules in the Master Hub.',
    critical: true
  },

  // Category 3: Site & Operations
  {
    key: 'canManageProjects',
    label: 'Create & Manage Job Cards (Projects)',
    category: 'Site & Operations',
    description: 'Initialize new project job cards, update customer contacts, change stages, and manage project metadata.'
  },
  {
    key: 'canManageContracts',
    label: 'Issue Work Orders & Subcontractor Agreements',
    category: 'Site & Operations',
    description: 'Create and issue work orders, subcontract packages, and milestone payment schedules to contractors.'
  },
  {
    key: 'canConductSiteSurvey',
    label: 'Conduct Site Survey & Log Dimensions',
    category: 'Site & Operations',
    description: 'Input room dimensions, laser distance measurements, site constraints, and upload survey photos.'
  },

  // Category 4: Administration & Security
  {
    key: 'canManageUsers',
    label: 'User Administration & Security Role Assignment',
    category: 'Administration & Security',
    description: 'Master administrative permission: create new users, modify user cards, and grant or revoke security permissions.',
    critical: true
  },
  {
    key: 'canViewAuditLogs',
    label: 'View Enterprise Audit Trail & Telemetry',
    category: 'Administration & Security',
    description: 'Access the immutable system audit log to inspect user activity, rate modifications, baseline approvals, and session data.'
  }
];

export const UserCardModal: React.FC<UserCardModalProps> = ({
  isOpen,
  onClose,
  user,
  currentUser,
  onSaveUser,
  onDeleteUser,
  onSwitchUser
}) => {
  const isEditing = !!user;
  const isAdmin = currentUser.role === 'ADMIN' || currentUser.permissions?.canManageUsers;

  // Form State
  const [formData, setFormData] = useState<Partial<UserSession>>({
    id: '',
    name: '',
    email: '',
    phone: '+91 98',
    role: 'ESTIMATOR',
    roleTitle: 'Quantity Surveyor',
    department: 'Estimating & Commercial',
    status: 'ACTIVE',
    avatar: 'US',
    notes: '',
    assignedProjectIds: ['PROJ-SKYLINE-1402'],
    permissions: { ...ROLE_DEFAULT_PERMISSIONS.ESTIMATOR }
  });

  const [activeFastTab, setActiveFastTab] = useState<'general' | 'permissions' | 'preview' | 'audit'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form data when user or isOpen changes
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '',
        permissions: {
          ...(ROLE_DEFAULT_PERMISSIONS[user.role] || ROLE_DEFAULT_PERMISSIONS.ESTIMATOR),
          ...(user.permissions || {})
        }
      });
    } else {
      setFormData({
        id: '',
        name: '',
        email: '',
        phone: '+91 98',
        role: 'ESTIMATOR',
        roleTitle: 'Quantity Surveyor & Cost Planner',
        department: 'Estimating & Commercial',
        status: 'ACTIVE',
        avatar: 'NU',
        notes: 'New user created by ' + currentUser.name,
        assignedProjectIds: ['PROJ-SKYLINE-1402'],
        permissions: { ...ROLE_DEFAULT_PERMISSIONS.ESTIMATOR }
      });
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [user, isOpen, currentUser]);

  if (!isOpen) return null;

  // Handlers
  const handleRoleChange = (newRole: UserRole) => {
    const defaultRolePerms = ROLE_DEFAULT_PERMISSIONS[newRole];
    let defaultTitle = 'Team Member';
    let defaultDept = 'Operations';

    switch (newRole) {
      case 'ADMIN':
        defaultTitle = 'System Administrator & Partner';
        defaultDept = 'Executive Management';
        break;
      case 'ESTIMATOR':
        defaultTitle = 'Lead Quantity Surveyor & Cost Planner';
        defaultDept = 'Estimating & Commercial';
        break;
      case 'PROJECT_MANAGER':
        defaultTitle = 'Senior Project Lead (Interiors & Turnkey)';
        defaultDept = 'Project Operations';
        break;
      case 'SITE_ENGINEER':
        defaultTitle = 'Site Execution & QC Engineer';
        defaultDept = 'Field Operations';
        break;
      case 'CLIENT':
        defaultTitle = 'Property Owner / Client';
        defaultDept = 'Customer Accounts';
        break;
    }

    setFormData(prev => ({
      ...prev,
      role: newRole,
      roleTitle: prev.roleTitle === 'Quantity Surveyor' || prev.roleTitle === 'Team Member' ? defaultTitle : prev.roleTitle || defaultTitle,
      department: prev.department || defaultDept,
      // Apply default permissions for this role
      permissions: {
        ...defaultRolePerms
      }
    }));
  };

  const handleTogglePermission = (key: keyof UserPermissions) => {
    if (!isAdmin) return;
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...(prev.permissions as UserPermissions),
        [key]: !prev.permissions?.[key]
      }
    }));
  };

  const handleApplyPreset = (rolePreset: UserRole) => {
    if (!isAdmin) return;
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...ROLE_DEFAULT_PERMISSIONS[rolePreset]
      }
    }));
  };

  const handleToggleAllPermissions = (grantAll: boolean) => {
    if (!isAdmin) return;
    const updated: Partial<UserPermissions> = {};
    PERMISSION_METADATA.forEach(p => {
      updated[p.key] = grantAll;
    });
    setFormData(prev => ({
      ...prev,
      permissions: updated as UserPermissions
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      setErrorMessage('Full Name, Email Address, and Primary Role are required.');
      return;
    }

    // Auto calculate initials
    const initials = formData.name.trim().split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'US';

    setIsSubmitting(true);
    setErrorMessage(null);

    const userToSave: UserSession = {
      id: formData.id || `USR-${formData.role.slice(0, 4)}-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      username: formData.username?.trim().toLowerCase(),
      password: formData.password || undefined,
      phone: formData.phone?.trim() || '+91 98000 00000',
      role: formData.role as UserRole,
      roleTitle: formData.roleTitle?.trim() || formData.role,
      department: formData.department?.trim() || 'Operations',
      status: formData.status || 'ACTIVE',
      avatar: formData.avatar || initials,
      permissions: formData.permissions as UserPermissions,
      assignedProjectIds: formData.assignedProjectIds || ['PROJ-SKYLINE-1402'],
      notes: formData.notes?.trim() || ''
    };

    const success = await onSaveUser(userToSave);
    setIsSubmitting(false);

    if (success) {
      setSuccessMessage('User card and assigned permissions saved successfully!');
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMessage('Failed to save user card. Please check if the email is already in use.');
    }
  };

  const grantedCount = Object.values(formData.permissions || {}).filter(Boolean).length;
  const totalCount = PERMISSION_METADATA.length;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs select-none">
      <div className="relative flex flex-col max-h-[92vh] w-full max-w-4xl rounded-lg border border-[#EDEBE9] bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* 1. DYNAMICS 365 CARD HEADER */}
        <div className="bg-[#002050] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#0F6CBD] flex items-center justify-center font-bold text-sm text-white ring-2 ring-white/30">
              {formData.name ? formData.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() : 'NU'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {formData.name || 'New User Security Card'}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getRoleBadgeStyle(formData.role || 'ESTIMATOR')}`}>
                  {formData.role}
                </span>
                {formData.status === 'ACTIVE' ? (
                  <span className="flex items-center gap-1 text-[10px] text-[#86EFAC] font-medium bg-[#14532D]/50 px-2 py-0.5 rounded border border-[#22C55E]/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]"></span> Active
                  </span>
                ) : (
                  <span className="text-[10px] text-[#FCA5A5] bg-[#7F1D1D]/50 px-2 py-0.5 rounded border border-[#EF4444]/40">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#C7E0F4]">
                {formData.id ? `User ID: ${formData.id} • Table 2000000120 User & Permission Set` : 'Provision new employee or client access credentials'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing && onSwitchUser && (
              <button
                type="button"
                onClick={() => {
                  if (user) {
                    onSwitchUser(user);
                    onClose();
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1.5 rounded border border-white/20 transition font-medium"
                title="Switch session to this user"
              >
                <LogIn className="h-3.5 w-3.5 text-[#89BBE9]" />
                <span>Login As User</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white transition"
              title="Close User Card (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 2. DYNAMICS 365 FASTTAB NAVIGATION RIBBON */}
        <div className="bg-[#FAF9F8] border-b border-[#EDEBE9] px-5 py-1 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveFastTab('general')}
              className={`px-3 py-1.5 font-semibold rounded text-xs transition flex items-center gap-1.5 ${
                activeFastTab === 'general'
                  ? 'bg-white text-[#0F6CBD] shadow-xs border border-[#EDEBE9]'
                  : 'text-[#605E5C] hover:bg-[#EDEBE9]'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>1. General Profile</span>
            </button>

            <button
              onClick={() => setActiveFastTab('permissions')}
              className={`px-3 py-1.5 font-semibold rounded text-xs transition flex items-center gap-1.5 ${
                activeFastTab === 'permissions'
                  ? 'bg-white text-[#0F6CBD] shadow-xs border border-[#EDEBE9]'
                  : 'text-[#605E5C] hover:bg-[#EDEBE9]'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>2. Security &amp; Permissions</span>
              <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded font-mono ${
                grantedCount === totalCount ? 'bg-[#DFF6DD] text-[#107C41]' : 'bg-[#EFF6FC] text-[#0F6CBD]'
              }`}>
                {grantedCount}/{totalCount}
              </span>
            </button>

            <button
              onClick={() => setActiveFastTab('preview')}
              className={`px-3 py-1.5 font-semibold rounded text-xs transition flex items-center gap-1.5 ${
                activeFastTab === 'preview'
                  ? 'bg-white text-[#0F6CBD] shadow-xs border border-[#EDEBE9]'
                  : 'text-[#605E5C] hover:bg-[#EDEBE9]'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>3. Experience Preview</span>
            </button>

            {isEditing && (
              <button
                onClick={() => setActiveFastTab('audit')}
                className={`px-3 py-1.5 font-semibold rounded text-xs transition flex items-center gap-1.5 ${
                  activeFastTab === 'audit'
                    ? 'bg-white text-[#0F6CBD] shadow-xs border border-[#EDEBE9]'
                    : 'text-[#605E5C] hover:bg-[#EDEBE9]'
                }`}
              >
                <History className="h-3.5 w-3.5" />
                <span>4. Audit &amp; System Logs</span>
              </button>
            )}
          </div>

          {!isAdmin && (
            <div className="flex items-center gap-1 text-[11px] text-[#A80000] font-medium bg-[#FDE7E9] px-2 py-0.5 rounded border border-[#F19999]">
              <Lock className="h-3 w-3" />
              <span>Read-Only (Admin rights required to modify permissions)</span>
            </div>
          )}
        </div>

        {/* 3. ALERTS / NOTICES */}
        {errorMessage && (
          <div className="mx-5 mt-3 p-2.5 bg-[#FDE7E9] text-[#A80000] border border-[#F19999] rounded text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-5 mt-3 p-2.5 bg-[#DFF6DD] text-[#107C41] border border-[#B3E5C7] rounded text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 4. MODAL BODY (TABBED FASTTABS) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* TAB 1: GENERAL PROFILE */}
          {activeFastTab === 'general' && (
            <div className="space-y-4">
              <div className="bg-[#FAF9F8] border border-[#EDEBE9] rounded-lg p-4">
                <div className="text-[11px] font-bold text-[#201F1E] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#0F6CBD]" />
                  <span>Employee &amp; Account Identity</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
                      Full Legal Name <span className="text-[#A80000]">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aarav Singhania"
                      className="w-full px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E] focus:outline-none focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] disabled:bg-[#F3F2F1]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
                      Business Email Address <span className="text-[#A80000]">*</span>
                    </label>
                    <input
                      type="email"
                      disabled={!isAdmin}
                      value={formData.email || ''}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. aarav@buildstorys.com"
                      className="w-full px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E] focus:outline-none focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] disabled:bg-[#F3F2F1]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">Login Username</label>
                    <input type="text" autoComplete="off" value={formData.username || ''}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">New Password</label>
                    <input type="password" autoComplete="new-password" minLength={6} value={formData.password || ''}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder={user ? 'Leave blank to keep current password' : 'At least 6 characters'}
                      className="w-full px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E]" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={formData.phone || ''}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98101 22334"
                      className="w-full px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E] focus:outline-none focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] disabled:bg-[#F3F2F1]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
                      Primary Security Role <span className="text-[#A80000]">*</span>
                    </label>
                    <select
                      disabled={!isAdmin}
                      value={formData.role || 'ESTIMATOR'}
                      onChange={e => handleRoleChange(e.target.value as UserRole)}
                      className="w-full px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E] focus:outline-none focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] disabled:bg-[#F3F2F1] font-semibold"
                    >
                      <option value="ADMIN">ADMIN — Managing Director / Full Admin</option>
                      <option value="ESTIMATOR">ESTIMATOR — Lead Quantity Surveyor &amp; Cost Controller</option>
                      <option value="PROJECT_MANAGER">PROJECT_MANAGER — Senior Project &amp; Site Lead</option>
                      <option value="SITE_ENGINEER">SITE_ENGINEER — Site Execution &amp; Quality Engineer</option>
                      <option value="CLIENT">CLIENT — Property Owner &amp; Client Representative</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
                      Job / Role Title
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={formData.roleTitle || ''}
                      onChange={e => setFormData({ ...formData, roleTitle: e.target.value })}
                      placeholder="e.g. Lead Quantity Surveyor"
                      className="w-full px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E] focus:outline-none focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] disabled:bg-[#F3F2F1]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={formData.department || ''}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g. Estimating &amp; Commercial"
                      className="w-full px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E] focus:outline-none focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] disabled:bg-[#F3F2F1]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
                      Account Status
                    </label>
                    <select
                      disabled={!isAdmin}
                      value={formData.status || 'ACTIVE'}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E] focus:outline-none focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] disabled:bg-[#F3F2F1]"
                    >
                      <option value="ACTIVE">ACTIVE — Enabled for Login and Operations</option>
                      <option value="INACTIVE">INACTIVE — Suspended / Deactivated</option>
                      <option value="SUSPENDED">SUSPENDED — Locked pending security review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
                      Project Assignment Scope
                    </label>
                    <select
                      disabled={!isAdmin}
                      value="ALL"
                      onChange={() => {}}
                      className="w-full px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E] focus:outline-none focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] disabled:bg-[#F3F2F1]"
                    >
                      <option value="ALL">All Company Projects (Corporate Access)</option>
                      <option value="RESTRICTED">Unit 1402 Skyline Residences Only</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3.5">
                  <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
                    Internal Security Notes / Responsibilities
                  </label>
                  <textarea
                    disabled={!isAdmin}
                    rows={2}
                    value={formData.notes || ''}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Provide details about signing limits, customer portfolio, or field assignments..."
                    className="w-full px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E] focus:outline-none focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD] disabled:bg-[#F3F2F1]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY & PERMISSIONS MATRIX */}
          {activeFastTab === 'permissions' && (
            <div className="space-y-4">
              {/* Presets & Bulk Controls Toolbar */}
              <div className="bg-[#FAF9F8] border border-[#EDEBE9] rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#605E5C] uppercase tracking-wider">Role Presets:</span>
                  <button
                    type="button"
                    disabled={!isAdmin}
                    onClick={() => handleApplyPreset('ADMIN')}
                    className="px-2 py-1 bg-white hover:bg-[#F3F2F1] text-[#6B21A8] border border-[#D8B4FE] rounded font-semibold text-[11px] transition disabled:opacity-50"
                  >
                    Admin (All 11)
                  </button>
                  <button
                    type="button"
                    disabled={!isAdmin}
                    onClick={() => handleApplyPreset('ESTIMATOR')}
                    className="px-2 py-1 bg-white hover:bg-[#F3F2F1] text-[#0F6CBD] border border-[#C7E0F4] rounded font-semibold text-[11px] transition disabled:opacity-50"
                  >
                    Estimator (QS)
                  </button>
                  <button
                    type="button"
                    disabled={!isAdmin}
                    onClick={() => handleApplyPreset('PROJECT_MANAGER')}
                    className="px-2 py-1 bg-white hover:bg-[#F3F2F1] text-[#92400E] border border-[#FDE68A] rounded font-semibold text-[11px] transition disabled:opacity-50"
                  >
                    Project Manager
                  </button>
                  <button
                    type="button"
                    disabled={!isAdmin}
                    onClick={() => handleApplyPreset('SITE_ENGINEER')}
                    className="px-2 py-1 bg-white hover:bg-[#F3F2F1] text-[#15803D] border border-[#86EFAC] rounded font-semibold text-[11px] transition disabled:opacity-50"
                  >
                    Site Engineer
                  </button>
                  <button
                    type="button"
                    disabled={!isAdmin}
                    onClick={() => handleApplyPreset('CLIENT')}
                    className="px-2 py-1 bg-white hover:bg-[#F3F2F1] text-[#A80000] border border-[#F9C6CA] rounded font-semibold text-[11px] transition disabled:opacity-50"
                  >
                    Client (Read-Only)
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!isAdmin}
                    onClick={() => handleToggleAllPermissions(true)}
                    className="text-[11px] text-[#0F6CBD] hover:underline font-semibold disabled:opacity-50"
                  >
                    Grant All
                  </button>
                  <span className="text-[#EDEBE9]">|</span>
                  <button
                    type="button"
                    disabled={!isAdmin}
                    onClick={() => handleToggleAllPermissions(false)}
                    className="text-[11px] text-[#A80000] hover:underline font-semibold disabled:opacity-50"
                  >
                    Revoke All
                  </button>
                </div>
              </div>

              {/* Granular Permission Checklist by Categories */}
              {(['Commercial & Financial', 'Estimating & Engineering', 'Site & Operations', 'Administration & Security'] as const).map(category => {
                const permsInCategory = PERMISSION_METADATA.filter(p => p.category === category);
                return (
                  <div key={category} className="border border-[#EDEBE9] rounded-lg overflow-hidden">
                    <div className="bg-[#FAF9F8] px-3.5 py-2 border-b border-[#EDEBE9] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-[#0F6CBD]" />
                        <span className="font-bold text-xs text-[#201F1E]">{category}</span>
                      </div>
                      <span className="text-[10px] text-[#605E5C] font-mono">
                        {permsInCategory.filter(p => formData.permissions?.[p.key]).length} / {permsInCategory.length} Granted
                      </span>
                    </div>

                    <div className="divide-y divide-[#EDEBE9] bg-white">
                      {permsInCategory.map(perm => {
                        const isGranted = !!formData.permissions?.[perm.key];
                        return (
                          <div 
                            key={perm.key}
                            onClick={() => isAdmin && handleTogglePermission(perm.key)}
                            className={`p-3 flex items-start justify-between gap-3 transition ${
                              isAdmin ? 'cursor-pointer hover:bg-[#F3F2F1]/60' : 'cursor-not-allowed'
                            } ${isGranted ? 'bg-[#EFF6FC]/30' : ''}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <input
                                type="checkbox"
                                disabled={!isAdmin}
                                checked={isGranted}
                                onChange={() => {}} // Handled by parent div
                                className="mt-0.5 h-4 w-4 rounded border-[#8A8886] text-[#0F6CBD] focus:ring-[#0F6CBD]"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-semibold text-xs ${isGranted ? 'text-[#0F6CBD]' : 'text-[#201F1E]'}`}>
                                    {perm.label}
                                  </span>
                                  {perm.critical && (
                                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#FFF4CE] text-[#795E00] border border-[#FFE7A0]">
                                      Sensitive
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#605E5C] mt-0.5 leading-relaxed">
                                  {perm.description}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isGranted ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#107C41] bg-[#DFF6DD] px-2 py-0.5 rounded border border-[#B3E5C7]">
                                  <Check className="h-3 w-3" />
                                  Granted
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#605E5C] bg-[#F3F2F1] px-2 py-0.5 rounded border border-[#E1DFDD]">
                                  <Lock className="h-3 w-3 text-[#A80000]" />
                                  Restricted
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: EXPERIENCE PREVIEW */}
          {activeFastTab === 'preview' && (
            <div className="space-y-4">
              <div className="bg-[#EFF6FC] border border-[#C7E0F4] rounded-lg p-4">
                <div className="flex items-center gap-2 text-[#0F6CBD] font-bold text-xs mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Role Experience Simulation for {formData.name || 'this User'}</span>
                </div>
                <p className="text-[11px] text-[#201F1E] leading-relaxed">
                  Based on the currently assigned permissions, here is how the BuildStorys ERP interface will adapt when this user is active:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="bg-white p-3 rounded border border-[#C7E0F4]">
                    <div className="font-semibold text-xs text-[#107C41] flex items-center gap-1.5 mb-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Unlocked Capabilities</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-[#201F1E]">
                      {formData.permissions?.canViewCostAndMargin && (
                        <li className="flex items-center gap-1.5 text-[#107C41]">
                          <Check className="h-3 w-3" /> Full direct cost rates &amp; profit margins visible
                        </li>
                      )}
                      {formData.permissions?.canEditBOQ && (
                        <li className="flex items-center gap-1.5 text-[#107C41]">
                          <Check className="h-3 w-3" /> Can add and edit Job Planning Lines (BOQ)
                        </li>
                      )}
                      {formData.permissions?.canRunAITakeoff && (
                        <li className="flex items-center gap-1.5 text-[#107C41]">
                          <Check className="h-3 w-3" /> BuildStorys Copilot AI Takeoff active
                        </li>
                      )}
                      {formData.permissions?.canApproveBOQ && (
                        <li className="flex items-center gap-1.5 text-[#107C41]">
                          <Check className="h-3 w-3" /> Authorized to approve &amp; freeze contractual baselines
                        </li>
                      )}
                      {formData.permissions?.canManageMasterRates && (
                        <li className="flex items-center gap-1.5 text-[#107C41]">
                          <Check className="h-3 w-3" /> Can update corporate Rate Library &amp; taxes
                        </li>
                      )}
                      {formData.permissions?.canGenerateQuotation && (
                        <li className="flex items-center gap-1.5 text-[#107C41]">
                          <Check className="h-3 w-3" /> Can generate and configure milestone quotations
                        </li>
                      )}
                      {formData.permissions?.canConductSiteSurvey && (
                        <li className="flex items-center gap-1.5 text-[#107C41]">
                          <Check className="h-3 w-3" /> Can log spatial room dimensions &amp; laser logs
                        </li>
                      )}
                      {formData.permissions?.canManageUsers && (
                        <li className="flex items-center gap-1.5 text-[#6B21A8] font-bold">
                          <Check className="h-3 w-3" /> Super Admin: Can create users &amp; grant permissions
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded border border-[#C7E0F4]">
                    <div className="font-semibold text-xs text-[#A80000] flex items-center gap-1.5 mb-1.5">
                      <Lock className="h-4 w-4" />
                      <span>Enforced Restrictions</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-[#605E5C]">
                      {!formData.permissions?.canViewCostAndMargin && (
                        <li className="flex items-center gap-1.5 text-[#A80000]">
                          <X className="h-3 w-3" /> Internal costs &amp; contractor margins strictly masked
                        </li>
                      )}
                      {!formData.permissions?.canEditBOQ && (
                        <li className="flex items-center gap-1.5">
                          <X className="h-3 w-3 text-[#A80000]" /> Read-only BOQ matrix (cannot alter lines)
                        </li>
                      )}
                      {!formData.permissions?.canApproveBOQ && (
                        <li className="flex items-center gap-1.5">
                          <X className="h-3 w-3 text-[#A80000]" /> Baseline approval button disabled
                        </li>
                      )}
                      {!formData.permissions?.canRunAITakeoff && (
                        <li className="flex items-center gap-1.5">
                          <X className="h-3 w-3 text-[#A80000]" /> Copilot AI Takeoff button disabled
                        </li>
                      )}
                      {!formData.permissions?.canManageMasterRates && (
                        <li className="flex items-center gap-1.5">
                          <X className="h-3 w-3 text-[#A80000]" /> Master Rate Library is read-only
                        </li>
                      )}
                      {!formData.permissions?.canManageUsers && (
                        <li className="flex items-center gap-1.5">
                          <X className="h-3 w-3 text-[#A80000]" /> Cannot create new users or modify security cards
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT & HISTORY */}
          {activeFastTab === 'audit' && (
            <div className="space-y-3">
              <div className="bg-[#FAF9F8] border border-[#EDEBE9] rounded-lg p-4">
                <div className="text-[11px] font-bold text-[#201F1E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5 text-[#0F6CBD]" />
                  <span>Account Lifecycle &amp; Security Telemetry</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#605E5C] block">Created On:</span>
                    <span className="font-mono font-medium text-[#201F1E]">
                      {formData.createdAt ? new Date(formData.createdAt).toLocaleString('en-IN') : 'Baseline Seeding'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#605E5C] block">Last Login / Activity:</span>
                    <span className="font-mono font-medium text-[#201F1E]">
                      {formData.lastLoginAt ? new Date(formData.lastLoginAt).toLocaleString('en-IN') : 'Just now'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#605E5C] block">Security Protocol:</span>
                    <span className="font-medium text-[#107C41]">D365 Enterprise Role-Based Access Control (RBAC)</span>
                  </div>
                  <div>
                    <span className="text-[#605E5C] block">Authentication Method:</span>
                    <span className="font-medium text-[#201F1E]">BuildStorys ERP Session Token / Header ID</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. DYNAMICS 365 FOOTER ACTION BAR */}
        <div className="bg-[#FAF9F8] border-t border-[#EDEBE9] px-5 py-3 flex items-center justify-between">
          <div>
            {isEditing && onDeleteUser && isAdmin && (
              <button
                type="button"
                onClick={async () => {
                  if (confirm(`Are you sure you want to deactivate the user card for ${formData.name}?`)) {
                    if (formData.id) {
                      await onDeleteUser(formData.id);
                      onClose();
                    }
                  }
                }}
                className="text-[#A80000] hover:text-[#7A0000] text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-[#FDE7E9] transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Deactivate User</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded border border-[#8A8886] bg-white text-xs text-[#201F1E] hover:bg-[#F3F2F1] transition font-semibold"
            >
              Cancel
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded bg-[#0F6CBD] hover:bg-[#0F5DA2] text-xs text-white transition font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create User'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
