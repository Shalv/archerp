import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Building2,
  Database,
  Plus,
  User,
  LogOut,
  ChevronDown,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Lock,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { AppModuleId } from '../types';
import { isImageAvatar } from '../../utils/avatarUtils';

interface TopBarProps {
  activeTab: string;
  onOpenMobileMenu: () => void;
  onOpenNewEnquiry: () => void;
  onOpenBackupModal: () => void;
  onOpenProfileModal: (tab?: 'details' | 'security' | 'permissions') => void;
  onExitToERP?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onOpenMobileMenu,
  onOpenNewEnquiry,
  onOpenBackupModal,
  onOpenProfileModal,
  onExitToERP,
}) => {
  const { activeProject } = useProject();
  const { user, logout, getModulePermission } = useAuth();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activePermission = getModulePermission(activeTab as AppModuleId);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'pipeline':
        return 'Customer Pipeline & Responsibility Radar';
      case 'workspace':
        return 'Project Workspace & Confirmed Brief';
      case 'ai-studio':
        return 'AI Concept Studio (4-5 Options)';
      case 'boq':
        return 'BOQ Commercials & Revision Control';
      case 'execution':
        return 'Site Execution & Snagging Punchlist';
      case 'billing':
        return 'Operational Billing & Warranty Dispatch';
      case 'analytics':
        return 'Data Science & Predictive Intelligence Hub';
      case 'masters':
        return 'Enterprise Master Data Management Hub';
      default:
        return 'Architecture Turnkey Studio';
    }
  };

  const userInitials = (user?.fullName || 'Architect')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    logout();
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shrink-0 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between shadow-2xs">
      {/* Left side: Hamburger on mobile + Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-400">Build Storys</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-slate-800">{getTabTitle(activeTab)}</span>

          {/* Module Permission Status Pill */}
          {activePermission === 'view_only' && (
            <span className="flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs ml-1">
              <Eye className="w-3 h-3 text-amber-700" />
              <span>Read-Only</span>
            </span>
          )}
          {activePermission === 'none' && (
            <span className="flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200 shadow-2xs ml-1">
              <Lock className="w-3 h-3 text-rose-700" />
              <span>Restricted</span>
            </span>
          )}
        </div>

        <div className="sm:hidden text-xs font-bold text-slate-800 truncate max-w-[170px] flex items-center space-x-1.5">
          <span>{getTabTitle(activeTab)}</span>
          {activePermission === 'view_only' && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
              View Only
            </span>
          )}
        </div>
      </div>

      {/* Right side: Active context, quick actions & Profile menu */}
      <div className="flex items-center space-x-2.5">
        {onExitToERP && (
          <button
            type="button"
            onClick={onExitToERP}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#002050] hover:bg-[#001833] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Return to BuildStorys Role Center Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Return to BuildStorys ERP</span>
            <span className="sm:hidden">ERP</span>
          </button>
        )}

        {activeProject && (
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="font-bold text-slate-900 truncate max-w-[140px]">
              {activeProject.clientName}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({activeProject.enquiryNumber})
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onOpenBackupModal}
          className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
          title="Backup and JSON Portability"
        >
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span>JSON Sync</span>
        </button>

        <button
          type="button"
          onClick={onOpenNewEnquiry}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">+ Enquiry</span>
          <span className="sm:hidden">+ Deal</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Profile Button with View & Log Out Options */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-left cursor-pointer shadow-2xs"
            aria-label="User profile menu"
            aria-expanded={isProfileDropdownOpen}
          >
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs font-mono shadow-2xs shrink-0 overflow-hidden">
              {isImageAvatar(user?.avatarUrl) ? (
                <img src={user.avatarUrl} alt={user?.fullName || 'User'} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span>{userInitials}</span>
              )}
            </div>

            <div className="hidden md:block text-left pr-1">
              <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                {user?.fullName || 'Elena Rostova'}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight truncate max-w-[120px]">
                {user?.role || 'Design Principal'}
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Profile Dropdown Popup */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User summary header */}
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm font-mono shrink-0 overflow-hidden">
                    {isImageAvatar(user?.avatarUrl) ? (
                      <img src={user.avatarUrl} alt={user?.fullName || 'User'} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span>{userInitials}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {user?.fullName || 'Elena Rostova'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {user?.email}
                    </div>
                    <div className="text-[10px] text-amber-700 font-medium truncate mt-0.5">
                      {user?.studioName || 'Studio Principal'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action items */}
              <div className="py-1">
                {/* View Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onOpenProfileModal('details');
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">View Profile &amp; Account</div>
                      <div className="text-[10px] text-slate-400">Edit details, license &amp; bio</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    View
                  </span>
                </button>

                {/* Module Permissions */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onOpenProfileModal('permissions');
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-800 transition-colors">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Module Permission Set</div>
                      <div className="text-[10px] text-slate-400">Configure role rights &amp; module gates</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                    RBAC
                  </span>
                </button>

                {/* Change Password */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onOpenProfileModal('security');
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                      <KeyRound className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Change Password</div>
                      <div className="text-[10px] text-slate-400">Update login credentials</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    Edit
                  </span>
                </button>
              </div>

              {/* Status indicator */}
              <div className="px-4 py-2 bg-slate-50 border-y border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Authenticated Session</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Port 3000</span>
              </div>

              {/* Log Out Action */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2.5 font-bold transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                    <LogOut className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div>Log Out</div>
                    <div className="text-[10px] text-rose-400 font-normal">Terminate session &amp; redirect to login</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
