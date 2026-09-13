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
  AlertCircle
} from 'lucide-react';
import { UserSession } from '../types/erp';
import { updateStoredUserPassword, getStoredUsers, saveStoredUsers } from '../data/defaultUsers';

interface UserProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession;
  onUserUpdated: (updatedUser: UserSession) => void;
  initialTab?: 'profile' | 'security';
}

export const UserProfileEditModal: React.FC<UserProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  initialTab = 'profile'
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>(initialTab);
  
  // Profile form state
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [roleTitle, setRoleTitle] = useState(currentUser.roleTitle || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [department, setDepartment] = useState(currentUser.department || 'Commercial & Costing');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');

  // Synchronize on modal open or user change
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setRoleTitle(currentUser.roleTitle || '');
      setPhone(currentUser.phone || '');
      setDepartment(currentUser.department || 'Commercial & Costing');
      setBio(currentUser.bio || '');
      setAvatar(currentUser.avatar || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage(null);
    }
  }, [isOpen, initialTab, currentUser]);
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Feedback states
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setMessage({ text: 'Photo loaded. Click "Save Changes" to store permanently with your user profile.', type: 'success' });
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
      email: email.trim() || currentUser.email,
      roleTitle: roleTitle.trim() || currentUser.roleTitle,
      phone: phone.trim(),
      department: department.trim(),
      bio: bio.trim(),
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
          const err = await res.json();
          throw new Error(err.error || 'Failed to update profile');
        }
      } catch (fetchErr: any) { throw fetchErr; }

      if (savedUser) {
        onUserUpdated(savedUser);
      }
      setMessage({ text: 'Profile updated and saved successfully!', type: 'success' });
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

        if (res.ok) {
          const data = await res.json();
        } else {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update password');
        }
      } catch (fetchErr: any) { throw fetchErr; }

      setMessage({ text: 'Password successfully changed. Use the new password for your next login.', type: 'success' });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        id="user-profile-modal" 
        className="bg-white rounded-xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600/30 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                User Profile & Credentials
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono font-normal">
                  {currentUser.id}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage personal identification, assigned role card, security tokens & profile photo
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 gap-6 text-sm font-medium">
          <button
            onClick={() => { setActiveTab('profile'); setMessage(null); }}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            General Information & Photo
          </button>
          <button
            onClick={() => { setActiveTab('security'); setMessage(null); }}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'security'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Change Password & Security
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
          {activeTab === 'profile' ? (
            <form id="profile-edit-form" onSubmit={handleProfileSave} className="space-y-6">
              {/* Photo Upload Section */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt={name} 
                      className="w-20 h-20 rounded-full object-cover border-2 border-teal-600 shadow-sm" 
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-2xl shadow-sm border-2 border-teal-600">
                      {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-md transition-transform active:scale-95"
                    title="Upload new photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-sm font-semibold text-slate-800">Profile Photograph</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload a high-resolution portrait. Stored with user record <span className="font-mono text-slate-700">{currentUser.id}</span> across all Role Centers and audit logs.
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
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-md text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-teal-600" />
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-white"
                      placeholder="e.g. Rajesh Sharma"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Corporate Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-white"
                      placeholder="name@buildstorys.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Business / Functional Role Title
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-white"
                      placeholder="e.g. Lead Quantity Surveyor & Cost Planner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Direct Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-white"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Department / Business Unit
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-white"
                      placeholder="e.g. Costing & Estimation"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    System Assigned Role Code
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      disabled
                      value={currentUser.role}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-100 text-slate-600 font-mono text-xs cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Professional Bio / Notes
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-white"
                  placeholder="Responsibilities, certifications (e.g. MRICS), active cost centres..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Save Profile Changes
                </button>
              </div>
            </form>
          ) : (
            <form id="password-change-form" onSubmit={handlePasswordChange} className="space-y-5">
              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Security Credential Update</p>
                  <p className="mt-0.5 text-amber-800">
                    Your password protects your approval authority, budget releases, and project signing permissions for ID <span className="font-mono font-semibold">{currentUser.id}</span>.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Password (if set)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-white"
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
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-white"
                    placeholder="Minimum 4 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-white"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <KeyRound className="w-4 h-4" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
