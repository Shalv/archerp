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
  Sliders,
  Sparkles,
  UserCheck,
  UserX
} from 'lucide-react';
import { UserSession, UserRole, UserPermissions } from '../types/erp';
import { UserCardModal } from './UserCardModal';
import { isImageAvatar, getUserInitials } from '../utils/avatarUtils';

interface UsersRegisterViewProps {
  users: UserSession[];
  currentUser: UserSession;
  onRefreshUsers: () => void;
  onSaveUser: (user: UserSession) => Promise<boolean>;
  onDeleteUser: (userId: string) => Promise<boolean>;
  onSwitchUser: (user: UserSession) => void;
}

export const UsersRegisterView: React.FC<UsersRegisterViewProps> = ({
  users,
  currentUser,
  onRefreshUsers,
  onSaveUser,
  onDeleteUser,
  onSwitchUser
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedUserForCard, setSelectedUserForCard] = useState<UserSession | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const isAdmin = currentUser.role === 'ADMIN' || currentUser.permissions?.canManageUsers;

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
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
  const estimatorPMCount = users.filter(u => u.role === 'ESTIMATOR' || u.role === 'PROJECT_MANAGER').length;
  const siteClientCount = users.filter(u => u.role === 'SITE_ENGINEER' || u.role === 'CLIENT').length;
  const activeCount = users.filter(u => (u.status || 'ACTIVE') === 'ACTIVE').length;

  const handleOpenNewUser = () => {
    setSelectedUserForCard(null);
    setIsCreatingNew(true);
    setIsCardModalOpen(true);
  };

  const handleOpenEditUser = (user: UserSession) => {
    setSelectedUserForCard(user);
    setIsCreatingNew(false);
    setIsCardModalOpen(true);
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
        return 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF9F8] p-4 sm:p-6 space-y-5">
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDEBE9] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#605E5C] mb-1 font-medium">
            <span>Administration</span>
            <span>/</span>
            <span>Security &amp; Roles</span>
            <span>/</span>
            <span className="text-[#0F6CBD] font-semibold">Table 2000000120 User &amp; Access Control</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#201F1E] tracking-tight">
              User Administration &amp; Security Roles
            </h1>
            <span className="bg-[#DFF6DD] text-[#107C41] border border-[#B3E5C7] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              RBAC Governed
            </span>
          </div>
          <p className="text-xs text-[#605E5C] mt-1 max-w-2xl leading-relaxed">
            Provision employee access cards, assign granular functional permissions, enforce commercial cost privacy, and inspect active user telemetry.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefreshUsers}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#8A8886] bg-white text-xs text-[#201F1E] hover:bg-[#F3F2F1] transition font-medium shadow-xs"
            title="Reload user list"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#605E5C]" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleOpenNewUser}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#0F6CBD] hover:bg-[#0F5DA2] text-xs text-white transition font-semibold shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>+ New User Card</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. DYNAMICS 365 CUE TILES / METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-[#EDEBE9] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#605E5C] font-semibold">
            <span>Total Provisioned</span>
            <Users className="h-4 w-4 text-[#0F6CBD]" />
          </div>
          <div className="text-2xl font-bold text-[#201F1E] mt-1 font-mono">
            {totalUsersCount}
          </div>
          <div className="text-[11px] text-[#107C41] mt-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#107C41]"></span>
            <span>{activeCount} Active Accounts</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#EDEBE9] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#605E5C] font-semibold">
            <span>Executive &amp; Admins</span>
            <Shield className="h-4 w-4 text-[#6B21A8]" />
          </div>
          <div className="text-2xl font-bold text-[#201F1E] mt-1 font-mono">
            {adminCount}
          </div>
          <div className="text-[11px] text-[#605E5C] mt-1">
            Full Enterprise Control
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#EDEBE9] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#605E5C] font-semibold">
            <span>Estimating &amp; PMs</span>
            <Key className="h-4 w-4 text-[#0F6CBD]" />
          </div>
          <div className="text-2xl font-bold text-[#201F1E] mt-1 font-mono">
            {estimatorPMCount}
          </div>
          <div className="text-[11px] text-[#605E5C] mt-1">
            BOQ &amp; Cost Controllers
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#EDEBE9] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#605E5C] font-semibold">
            <span>Site &amp; Clients</span>
            <Lock className="h-4 w-4 text-[#A80000]" />
          </div>
          <div className="text-2xl font-bold text-[#201F1E] mt-1 font-mono">
            {siteClientCount}
          </div>
          <div className="text-[11px] text-[#A80000] mt-1">
            Cost &amp; Margin Masked
          </div>
        </div>
      </div>

      {/* 3. FILTER & COMMAND BAR */}
      <div className="bg-white p-3 rounded-lg border border-[#EDEBE9] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#605E5C]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by name, email, department, ID..."
              className="w-full pl-8 pr-3 py-1.5 border border-[#8A8886] rounded text-xs text-[#201F1E] placeholder:text-[#8A8886] focus:outline-none focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD]"
            />
          </div>

          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E] focus:outline-none focus:border-[#0F6CBD]"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">ADMIN (Managing Director)</option>
            <option value="ESTIMATOR">ESTIMATOR (Quantity Surveyor)</option>
            <option value="PROJECT_MANAGER">PROJECT_MANAGER (Site Lead)</option>
            <option value="SITE_ENGINEER">SITE_ENGINEER (Field Operations)</option>
            <option value="CLIENT">CLIENT (Property Owner)</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-[#8A8886] rounded bg-white text-xs text-[#201F1E] focus:outline-none focus:border-[#0F6CBD]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>

        <div className="text-[11px] text-[#605E5C] font-mono shrink-0">
          Showing {filteredUsers.length} of {users.length} registered users
        </div>
      </div>

      {/* 4. DYNAMICS 365 USERS TABLE */}
      <div className="bg-white rounded-lg border border-[#EDEBE9] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F3F2F1] border-b border-[#EDEBE9] text-[#605E5C] font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">User Card &amp; ID</th>
                <th className="py-2.5 px-4">Role &amp; Title</th>
                <th className="py-2.5 px-4">Department &amp; Contact</th>
                <th className="py-2.5 px-4">Key Permissions Granted</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBE9]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#605E5C]">
                    <Users className="h-8 w-8 mx-auto mb-2 text-[#8A8886]/60" />
                    <p className="font-semibold text-xs">No users matching search filters</p>
                    <p className="text-[11px] mt-0.5">Try resetting search criteria or create a new user card.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(userItem => {
                  const isCurrent = userItem.id === currentUser.id;
                  const perms: Partial<UserSession['permissions']> = userItem.permissions || {};
                  const grantedCount = Object.values(perms).filter(Boolean).length;
                  const isActive = (userItem.status || 'ACTIVE') === 'ACTIVE';

                  return (
                    <tr
                      key={userItem.id}
                      className={`hover:bg-[#FAF9F8] transition ${isCurrent ? 'bg-[#EFF6FC]/40' : ''}`}
                    >
                      {/* 1. USER IDENTITY */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-black/10 overflow-hidden ${
                            userItem.role === 'ADMIN' ? 'bg-[#6B21A8] text-white' :
                            userItem.role === 'ESTIMATOR' ? 'bg-[#0F6CBD] text-white' :
                            userItem.role === 'PROJECT_MANAGER' ? 'bg-[#D97706] text-white' :
                            userItem.role === 'SITE_ENGINEER' ? 'bg-[#15803D] text-white' :
                            'bg-[#A80000] text-white'
                          }`}>
                            {isImageAvatar(userItem.avatar) ? (
                              <img src={userItem.avatar} alt={userItem.name} className="h-full w-full object-cover rounded-full" />
                            ) : (
                              <span>{getUserInitials(userItem.name, userItem.avatar)}</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span 
                                onClick={() => handleOpenEditUser(userItem)}
                                className="font-bold text-[#201F1E] hover:text-[#0F6CBD] hover:underline cursor-pointer"
                              >
                                {userItem.name}
                              </span>
                              {isCurrent && (
                                <span className="bg-[#0F6CBD] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-[#605E5C] block">
                              {userItem.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. ROLE & TITLE */}
                      <td className="py-3 px-4">
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getRoleBadgeStyle(userItem.role)}`}>
                            {userItem.role}
                          </span>
                          <span className="block text-[11px] text-[#605E5C] mt-0.5 font-medium">
                            {userItem.roleTitle || 'User'}
                          </span>
                        </div>
                      </td>

                      {/* 3. DEPARTMENT & CONTACT */}
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-medium text-[#201F1E] flex items-center gap-1 text-[11px]">
                            <Building className="h-3 w-3 text-[#605E5C]" />
                            {userItem.department || 'Operations'}
                          </span>
                          <span className="text-[11px] text-[#605E5C] flex items-center gap-1 mt-0.5 font-mono">
                            <Mail className="h-3 w-3 text-[#605E5C]" />
                            {userItem.email}
                          </span>
                        </div>
                      </td>

                      {/* 4. KEY PERMISSIONS GRANTED */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {perms.canViewCostAndMargin ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] bg-[#DFF6DD] text-[#107C41] border border-[#B3E5C7] px-1.5 py-0.2 rounded font-medium" title="Can view confidential costs and contractor profit margins">
                                <CheckCircle2 className="h-2.5 w-2.5" /> Margin Visible
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[10px] bg-[#FDE7E9] text-[#A80000] border border-[#F9C6CA] px-1.5 py-0.2 rounded font-medium" title="Internal direct costs and margins are masked">
                                <Lock className="h-2.5 w-2.5" /> Costs Masked
                              </span>
                            )}

                            {perms.canApproveBOQ && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] bg-[#EFF6FC] text-[#0F6CBD] border border-[#C7E0F4] px-1.5 py-0.2 rounded font-medium" title="Authorized to approve and freeze contractual baseline">
                                Baseline QS
                              </span>
                            )}

                            {perms.canManageMasterRates && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-1.5 py-0.2 rounded font-medium" title="Can modify Master Price Library">
                                Master Rates
                              </span>
                            )}

                            {perms.canManageUsers && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] bg-[#F3E8FF] text-[#6B21A8] border border-[#D8B4FE] px-1.5 py-0.2 rounded font-bold" title="Can create users and assign permissions">
                                Security Admin
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#605E5C] font-mono block">
                            {grantedCount} of 11 Permissions Granted
                          </span>
                        </div>
                      </td>

                      {/* 5. STATUS */}
                      <td className="py-3 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#107C41] bg-[#DFF6DD] px-2 py-0.5 rounded border border-[#B3E5C7]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#107C41]"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#A80000] bg-[#FDE7E9] px-2 py-0.5 rounded border border-[#F9C6CA]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#A80000]"></span>
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* 6. ACTIONS */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditUser(userItem)}
                            className="px-2.5 py-1 rounded border border-[#8A8886] bg-white text-[#201F1E] hover:bg-[#F3F2F1] text-[11px] font-semibold transition"
                            title="Open detailed user card"
                          >
                            Edit Card
                          </button>

                          {!isCurrent && (
                            <button
                              onClick={() => onSwitchUser(userItem)}
                              className="px-2.5 py-1 rounded bg-[#0F6CBD] hover:bg-[#0F5DA2] text-white text-[11px] font-semibold transition flex items-center gap-1"
                              title={`Switch session to test ${userItem.name}'s view`}
                            >
                              <LogIn className="h-3 w-3" />
                              <span>Login As</span>
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

      {/* 5. USER CARD MODAL (FOR DETAILED CARD AND PERMISSION ASSIGNMENT) */}
      <UserCardModal
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setSelectedUserForCard(null);
        }}
        user={selectedUserForCard}
        currentUser={currentUser}
        onSaveUser={async (userToSave) => {
          const success = await onSaveUser(userToSave);
          if (success) {
            onRefreshUsers();
          }
          return success;
        }}
        onDeleteUser={async (userId) => {
          const success = await onDeleteUser(userId);
          if (success) {
            onRefreshUsers();
          }
          return success;
        }}
        onSwitchUser={onSwitchUser}
      />
    </div>
  );
};
