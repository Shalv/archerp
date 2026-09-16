import React, { useState } from 'react';
import { 
  Building2, 
  Shield, 
  UserCheck, 
  History, 
  RotateCcw, 
  ChevronDown, 
  Sparkles,
  Info,
  Check,
  KeyRound
} from 'lucide-react';
import { UserSession, ProjectRecord } from '../types/erp';
import { isImageAvatar, getUserInitials } from '../utils/avatarUtils';

interface NavbarProps {
  currentUser: UserSession;
  allUsers: UserSession[];
  onSelectUser: (user: UserSession) => void;
  activeProject: ProjectRecord | null;
  projects: ProjectRecord[];
  onSelectProject: (projectId: string) => void;
  onOpenStatusModal: () => void;
  onOpenAuditLogs: () => void;
  onResetDemo: () => void;
  onOpenProfile?: (initialTab?: 'profile' | 'security') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  activeProject,
  projects,
  onSelectProject,
  onOpenStatusModal,
  onOpenAuditLogs,
  onResetDemo,
  onOpenProfile
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-[#F3E8FF] text-[#6B21A8] border-[#D8B4FE]';
      case 'ESTIMATOR':
        return 'bg-[#E0F2FE] text-[#0369A1] border-[#7DD3FC]';
      case 'PROJECT_MANAGER':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
      case 'SITE_ENGINEER':
        return 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]';
      case 'CLIENT':
        return 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]';
      default:
        return 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]';
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E7E1D8] bg-[#FDFCFB]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand & Monogram */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#273034] text-[#E0A96D] shadow-xs">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-bold tracking-tight text-[#1F2421]">
                BUILD STORYS
              </span>
              <span className="rounded bg-[#273034] px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#E0A96D]">
                ERP
              </span>
              <span className="hidden rounded-full bg-[#EBF3EF] px-2 py-0.5 text-[10px] font-medium text-[#236846] sm:inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#236846] animate-pulse"></span>
                Phase 1 Live
              </span>
            </div>
            <p className="hidden text-[11px] text-[#7A7369] md:block">
              Architecture • Interiors • Turnkey Construction
            </p>
          </div>
        </div>

        {/* Project Selector */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-[#E0D8CE] bg-white px-3 py-1.5 text-xs text-[#2A2F33] hover:border-[#C4BAAC] transition shadow-2xs"
          >
            <span className="text-[#877E71] font-medium hidden sm:inline">Project:</span>
            <span className="font-semibold truncate max-w-[150px] sm:max-w-[220px]">
              {activeProject ? activeProject.title : 'Select Project'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-[#877E71]" />
          </button>

          {projectDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-72 rounded-xl border border-[#DFD6CA] bg-white p-1.5 shadow-xl z-50">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#8C8274]">
                Active Turnkey Projects
              </div>
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p.id);
                    setProjectDropdownOpen(false);
                  }}
                  className={`flex w-full items-start justify-between rounded-lg p-2 text-left text-xs transition ${
                    activeProject?.id === p.id ? 'bg-[#F5EFEB] text-[#1F2421] font-medium' : 'hover:bg-[#FAF7F4] text-[#4F565C]'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-[#1F2421]">{p.title}</div>
                    <div className="text-[11px] text-[#827B70]">{p.clientName} • {p.city}</div>
                  </div>
                  {activeProject?.id === p.id && <Check className="h-3.5 w-3.5 text-[#A36934] mt-0.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions & User Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* System Capabilities Modal Button */}
          <button
            onClick={onOpenStatusModal}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[#DDD4C7] bg-[#F7F4EF] px-2.5 py-1.5 text-xs font-medium text-[#4E473D] hover:bg-[#EFEAE2] transition"
            title="System Capabilities Statement & Assumptions"
          >
            <Shield className="h-3.5 w-3.5 text-[#B87A38]" />
            <span>Capabilities</span>
          </button>

          {/* Audit Logs Button */}
          <button
            onClick={onOpenAuditLogs}
            className="flex items-center gap-1.5 rounded-lg border border-[#DDD4C7] bg-white px-2.5 py-1.5 text-xs font-medium text-[#4E473D] hover:bg-[#F9F7F4] transition shadow-2xs"
            title="Enterprise Audit Logs"
          >
            <History className="h-3.5 w-3.5 text-[#5D5549]" />
            <span className="hidden md:inline">Audit Trail</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1 rounded-lg border border-[#E8DFC8] bg-[#FBF7EE] px-2 py-1.5 text-xs font-medium text-[#8F6325] hover:bg-[#F3ECD9] transition"
            title="Reset to clean synthetic residential interior turnkey demo"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>

          {/* Quick My Profile Button */}
          {onOpenProfile && (
            <button
              id="navbar-profile-quick-btn"
              onClick={() => onOpenProfile('security')}
              className="flex items-center gap-1.5 rounded-lg border border-[#DDD4C7] bg-[#FDFBF7] px-2.5 py-1.5 text-xs font-medium text-[#4E473D] hover:bg-[#F4EFE6] transition"
              title="My Profile & Change Password"
            >
              <KeyRound className="h-3.5 w-3.5 text-[#B87A38]" />
              <span className="hidden sm:inline">My Profile</span>
            </button>
          )}

          {/* User Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-[#DDD4C7] bg-white p-1 sm:px-2.5 sm:py-1.5 text-xs shadow-2xs hover:border-[#C4BAAC] transition"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#313A3E] text-white text-[11px] font-bold overflow-hidden shrink-0">
                {isImageAvatar(currentUser.avatar) ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover rounded-full" />
                ) : (
                  <span>{getUserInitials(currentUser.name, currentUser.avatar)}</span>
                )}
              </div>
              <div className="hidden text-left sm:block">
                <div className="font-semibold text-[#1F2421] text-xs leading-none">{currentUser.name}</div>
                <div className="mt-0.5 text-[10px] text-[#7A7369] leading-none">{currentUser?.roleTitle}</div>
              </div>
              <span className={`hidden md:inline-block rounded border px-1.5 py-0.2 text-[10px] font-bold ${getRoleBadgeStyle(currentUser?.role || '')}`}>
                {currentUser?.role || ''}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#877E71]" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-72 rounded-xl border border-[#DFD6CA] bg-white p-2 shadow-2xl z-50">
                <div className="p-2 border-b border-[#F0EBE3] flex items-center gap-2.5 mb-1.5">
                  <div className="h-8 w-8 rounded-full bg-[#313A3E] text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                    {isImageAvatar(currentUser.avatar) ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover rounded-full" />
                    ) : (
                      <span>{getUserInitials(currentUser.name, currentUser.avatar)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[#1F2421] text-xs truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-[#827B70] truncate">{currentUser.email}</div>
                  </div>
                </div>

                {onOpenProfile && (
                  <button
                    id="navbar-dropdown-profile-btn"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenProfile('profile');
                    }}
                    className="w-full mb-2 flex items-center justify-between p-2 rounded-lg bg-[#FAF7F4] hover:bg-[#F3EBE1] text-[#1F2421] border border-[#E7DFD5] text-xs font-semibold transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-[#A36934]" />
                      <span>My Profile &amp; Photo</span>
                    </div>
                    <span className="text-[10px] bg-white px-1.5 py-0.2 rounded border border-[#DFD6CA] text-[#A36934]">Security</span>
                  </button>
                )}

                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#8C8274] border-b border-[#F0EBE3] pb-1.5 mb-1.5">
                  Simulate Role & Permissions (RBAC)
                </div>
                {allUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      setUserDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg p-2 text-left text-xs transition ${
                      currentUser.id === user.id ? 'bg-[#F5EFEB] text-[#1F2421] font-medium' : 'hover:bg-[#FAF7F4] text-[#4F565C]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-6 w-6 rounded-full bg-[#313A3E] text-white text-[10px] font-bold flex items-center justify-center overflow-hidden shrink-0">
                        {isImageAvatar(user.avatar) ? (
                          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover rounded-full" />
                        ) : (
                          <span>{getUserInitials(user.name, user.avatar)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#1F2421] truncate">{user.name}</div>
                        <div className="text-[11px] text-[#827B70] truncate">{user.roleTitle}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`rounded border px-1.5 py-0.2 text-[9px] font-bold ${getRoleBadgeStyle(user.role)}`}>
                        {user.role}
                      </span>
                      {currentUser.id === user.id && <Check className="h-3.5 w-3.5 text-[#A36934]" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
