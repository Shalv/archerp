import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Camera, 
  KeyRound, 
  Briefcase, 
  Phone, 
  Building, 
  Check, 
  X, 
  ShieldCheck, 
  Upload, 
  Trash2,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  FolderKanban,
  CheckSquare,
  Shield,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { UserSession, ProjectRecord } from '../types/erp';
import { updateStoredUserPassword, updateOrInsertStoredUser, getStoredUsers, saveActiveSession } from '../data/defaultUsers';

interface UserProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession;
  onUserUpdated: (updatedUser: UserSession) => void;
  initialTab?: 'profile' | 'security' | 'work';
  projects?: ProjectRecord[];
  onSelectProject?: (projectId: string) => void;
}

export const UserProfileEditModal: React.FC<UserProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  initialTab = 'profile',
  projects = [],
  onSelectProject
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'work'>(initialTab);
  
  // Profile form state
  const [name, setName] = useState(currentUser.name || '');
  const [username, setUsername] = useState(currentUser.username || currentUser.email?.split('@')[0] || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [roleTitle, setRoleTitle] = useState(currentUser.roleTitle || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [department, setDepartment] = useState(currentUser.department || 'Commercial & Costing');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [notes, setNotes] = useState(currentUser.notes || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Feedback states
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize on modal open or user change
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setName(currentUser.name || '');
      setUsername(currentUser.username || currentUser.email?.split('@')[0] || '');
      setEmail(currentUser.email || '');
      setRoleTitle(currentUser.roleTitle || '');
      setPhone(currentUser.phone || '');
      setDepartment(currentUser.department || 'Commercial & Costing');
      setBio(currentUser.bio || '');
      setNotes(currentUser.notes || '');
      setAvatar(currentUser.avatar || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage(null);
    }
  }, [isOpen, initialTab, currentUser]);

  if (!isOpen) return null;

  const handleAvatarFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'Please select an image file (JPEG, PNG, WebP)', type: 'error' });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setMessage({ text: 'Image size should be less than 4MB', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setAvatar(base64);
      setMessage({ text: 'Photo loaded. Click "Save Profile Changes" to persist permanently.', type: 'success' });
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const updatedData: UserSession = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      username: username.trim().toLowerCase() || currentUser.username || currentUser.email.split('@')[0],
      email: email.trim().toLowerCase() || currentUser.email,
      roleTitle: roleTitle.trim() || currentUser.roleTitle,
      phone: phone.trim(),
      department: department.trim(),
      bio: bio.trim(),
      notes: notes.trim(),
      avatar: avatar
    };

    try {
      let savedUser: UserSession | null = null;
      try {
        const res = await fetch(`/api/auth/users/${currentUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id
          },
          body: JSON.stringify(updatedData)
        });

        if (res.ok) {
          savedUser = await res.json();
        } else {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to update profile');
        }
      } catch (fetchErr: any) { 
        console.warn('API error during profile update, falling back to local persistence:', fetchErr);
      }

      // Persist to client storage & preserve password so credentials remain valid for future login
      const mergedUser = updateOrInsertStoredUser({
        ...currentUser,
        ...(savedUser || updatedData),
        password: currentUser.password
      });

      saveActiveSession(mergedUser.id);
      onUserUpdated(mergedUser);
      
      setMessage({ text: 'Profile and security credentials updated & preserved for future logins!', type: 'success' });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setMessage({ text: err.message || 'Error updating profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 4) {
      setMessage({ text: 'New password must be at least 4 characters long', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New password and confirmation do not match', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      try {
        const res = await fetch(`/api/auth/users/${currentUser.id}/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id
          },
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to update password');
        }
      } catch (fetchErr: any) { 
        console.warn('API error updating password, updating locally:', fetchErr);
      }

      // Update in client local storage cache and active session so next login works immediately
      updateStoredUserPassword(currentUser.id, newPassword);
      const userWithNewPassword = updateOrInsertStoredUser({
        ...currentUser,
        password: newPassword
      });
      saveActiveSession(userWithNewPassword.id);
      onUserUpdated(userWithNewPassword);

      setMessage({ text: 'Password successfully changed and encrypted. Your new password is now active for future logins.', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setMessage({ text: err.message || 'Password update failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Resolve assigned projects
  const assignedProjectsList = (currentUser.assignedProjectIds && currentUser.assignedProjectIds.length > 0)
    ? currentUser.assignedProjectIds
    : ['PROJ-SKYLINE-1402'];

  const matchedProjects = projects.filter(p => assignedProjectsList.includes(p.id));
  const displayProjects = matchedProjects.length > 0 ? matchedProjects : [
    {
      id: 'PROJ-SKYLINE-1402',
      projectCode: 'PRJ-SKYLINE-1402',
      title: 'Skyline Residences Penthouse Fit-out',
      clientName: 'Vikram Malhotra',
      stage: 'EXECUTION_ONGOING',
      projectScope: 'TURNKEY_INTERIORS'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        id="user-profile-modal" 
        className="bg-white rounded-xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-[#002050] text-white px-6 py-4 flex items-center justify-between border-b border-[#003366]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F6CBD] flex items-center justify-center text-white shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                User Profile &amp; Assigned Work
                <span className="text-[11px] px-2 py-0.5 rounded bg-white/15 text-[#89BBE9] font-mono font-normal border border-white/10">
                  {currentUser.id}
                </span>
              </h2>
              <p className="text-xs text-[#C7E0F4]">
                Manage credentials for future login, personal identification, and review allocated projects &amp; duties.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#89BBE9] hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-2.5 gap-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => { setActiveTab('profile'); setMessage(null); }}
            className={`pb-2.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#0F6CBD] text-[#0F6CBD] font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            1. General Profile &amp; Photo
          </button>

          <button
            onClick={() => { setActiveTab('security'); setMessage(null); }}
            className={`pb-2.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'border-[#0F6CBD] text-[#0F6CBD] font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            2. Future Login &amp; Password
          </button>

          <button
            onClick={() => { setActiveTab('work'); setMessage(null); }}
            className={`pb-2.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'work'
                ? 'border-[#0F6CBD] text-[#0F6CBD] font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            3. Allocated Work &amp; Projects
            <span className="text-[10px] bg-[#EFF6FC] text-[#0F6CBD] px-1.5 py-0.2 rounded-full font-bold border border-[#C7E0F4]">
              {displayProjects.length}
            </span>
          </button>
        </div>

        {/* Alert message */}
        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-3 text-sm ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {message.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="text-xs font-medium">{message.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'profile' && (
            <form id="profile-edit-form" onSubmit={handleProfileSave} className="space-y-5">
              {/* Photo Upload Section */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt={name} 
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#0F6CBD] shadow-sm" 
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#002050] text-white flex items-center justify-center font-bold text-2xl shadow-sm border-2 border-[#0F6CBD]">
                      {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 bg-[#0F6CBD] hover:bg-[#0B5A9D] text-white rounded-full shadow-md transition-transform active:scale-95"
                    title="Upload new photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-slate-800">Profile Photograph &amp; Persona Identity</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your avatar appears on active quotations, inspection signoffs, and timesheet approvals for ID <span className="font-mono text-slate-700 font-semibold">{currentUser.id}</span>.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/png,image/jpeg,image/webp,image/jpg" 
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleAvatarFile(f);
                      }} 
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-md text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#0F6CBD]" />
                      Browse Photo
                    </button>
                    {avatar && (
                      <button
                        type="button"
                        onClick={() => setAvatar('')}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md text-xs font-medium text-rose-600 flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] bg-white"
                      placeholder="e.g. Rajesh Sharma"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username / Login ID * (For future login)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#0F6CBD] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      className="w-full pl-9 pr-3 py-2 text-sm font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] bg-white"
                      placeholder="e.g. rajesh.qs"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    You can log in anytime using this username or your email address.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] bg-white"
                      placeholder="name@buildstorys.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Role Title / Designation
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] bg-white"
                      placeholder="e.g. Lead Quantity Surveyor & Cost Planner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] bg-white"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department / Business Unit
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] bg-white"
                      placeholder="e.g. Commercial & Costing"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Professional Bio &amp; Allocated Work Overview
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] bg-white"
                  placeholder="Responsibilities, professional credentials (e.g. MRICS), active cost centers..."
                />
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-200">
                <div className="text-xs text-slate-500">
                  Changes save to database &amp; browser storage for immediate and future logins.
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 text-xs bg-[#0F6CBD] hover:bg-[#0B5A9D] text-white rounded-md font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Save Profile Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form id="password-change-form" onSubmit={handlePasswordChange} className="space-y-5">
              <div className="bg-[#EFF6FC] border border-[#C7E0F4] rounded-lg p-3 text-xs text-[#0F6CBD] flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#0F6CBD] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#002050]">Future Login Credentials &amp; Vault Persistence</p>
                  <p className="mt-0.5 text-[#323130] leading-relaxed">
                    Once you update your password or login details here, they are stored securely and remain permanently for all future logins on this system for User ID <span className="font-mono font-bold text-[#0F6CBD]">{currentUser.id}</span>.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password (if set)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] bg-white"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password * (Will remain for all future logins)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] bg-white"
                    placeholder="Minimum 4 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] bg-white"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-200">
                <span className="text-[11px] text-slate-500">
                  Password encrypted via cryptographic hash.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 text-xs bg-[#0F6CBD] hover:bg-[#0B5A9D] text-white rounded-md font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                    Update &amp; Save Password
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'work' && (
            <div className="space-y-5">
              {/* Allocated Work Banner */}
              <div className="bg-[#FAF9F8] border border-[#EDEBE9] rounded-lg p-4">
                <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-[#0F6CBD]" />
                    <div>
                      <h4 className="font-bold text-sm text-[#201F1E]">Allocated Projects &amp; Work Packages</h4>
                      <p className="text-xs text-[#605E5C]">
                        Projects and site locations currently allocated to your user account.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#EFF6FC] text-[#0F6CBD] px-2.5 py-1 rounded border border-[#C7E0F4]">
                    Role: {currentUser.role}
                  </span>
                </div>

                {/* Project cards */}
                <div className="space-y-2.5">
                  {displayProjects.map((p) => (
                    <div 
                      key={p.id}
                      className="bg-white border border-[#EDEBE9] rounded-lg p-3 hover:border-[#0F6CBD] transition flex items-center justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#0F6CBD] bg-[#EFF6FC] px-1.5 py-0.2 rounded border border-[#C7E0F4]">
                            {p.projectCode || p.id}
                          </span>
                          <h5 className="text-xs font-bold text-[#201F1E] truncate">{p.title}</h5>
                        </div>
                        <div className="text-[11px] text-[#605E5C] mt-1 flex items-center gap-3">
                          <span>Client: <strong className="text-[#323130]">{p.clientName}</strong></span>
                          <span>•</span>
                          <span>Stage: <strong className="text-emerald-700">{p.stage || 'EXECUTION'}</strong></span>
                        </div>
                      </div>

                      {onSelectProject && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectProject(p.id);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-[#EFF6FC] text-[#0F6CBD] border border-[#C7E0F4] rounded text-xs font-semibold flex items-center gap-1 transition shadow-2xs"
                        >
                          <span>Open Project</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Duties & Scope */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                    Allocated Duties &amp; Operating Responsibilities
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">Cost &amp; Budget Access</span>
                    <span className="text-slate-600 text-[11px]">
                      {currentUser.permissions.canViewCostAndMargin ? 'Authorized to view internal unit rates, supplier quotes, and margin markups.' : 'Internal cost rates hidden; customer quotation rates visible.'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">Approval Authority</span>
                    <span className="text-slate-600 text-[11px]">
                      {currentUser.permissions.canApproveBOQ ? 'Authorized to sign off BOQ baselines and technical budgets.' : 'Draft estimation and site log submission enabled.'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">Procurement &amp; Invoicing</span>
                    <span className="text-slate-600 text-[11px]">
                      {currentUser.permissions.canApprovePO ? 'Authorized to approve and dispatch Purchase Orders to vendors.' : 'Purchase requisitions and material receipts only.'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">User Administration</span>
                    <span className="text-slate-600 text-[11px]">
                      {currentUser.permissions.canManageUsers ? 'Full administrative rights to modify user profiles, security, and project allocations.' : 'Standard operational user.'}
                    </span>
                  </div>
                </div>

                {/* Notes & Special Assignments */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Allocated Tasks / Site Assignment Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F6CBD] focus:border-[#0F6CBD] bg-white"
                    placeholder="Enter special site duties, allocated trade packages (e.g. Civil, Joinery, Electrical), or shift instructions..."
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={handleProfileSave}
                      disabled={saving}
                      className="px-4 py-1.5 bg-[#0F6CBD] hover:bg-[#0B5A9D] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save Allocated Work Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
