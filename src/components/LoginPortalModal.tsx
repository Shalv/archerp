import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  LogIn, 
  X, 
  ShieldCheck, 
  Building2, 
  Compass, 
  Calculator, 
  HardHat, 
  UserCheck, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UserSession } from '../types/erp';
import { readApiResponse } from '../utils/apiResponse';
import { authenticateClientUser, INITIAL_ERP_USERS } from '../data/defaultUsers';

interface LoginPortalModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: UserSession) => void;
  onClose?: () => void;
  users?: UserSession[];
  currentSessionUser?: UserSession | null;
}

interface DemoRoleQuickOption {
  role: string;
  label: string;
  name: string;
  email: string;
  defaultPassword: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

const DEMO_ACCOUNTS: DemoRoleQuickOption[] = [
  {
    role: 'ADMIN',
    label: 'Managing Director & Partner',
    name: 'Aarav Singhania',
    email: 'aarav@buildstorys.com',
    defaultPassword: 'Admin@123',
    icon: ShieldCheck,
    accentBg: 'bg-indigo-50 hover:bg-indigo-100/80',
    accentText: 'text-indigo-900',
    accentBorder: 'border-indigo-200'
  },
  {
    role: 'ESTIMATOR',
    label: 'Lead Quantity Surveyor',
    name: 'Rajesh Sharma',
    email: 'rajesh.qs@buildstorys.com',
    defaultPassword: 'Estimator@123',
    icon: Calculator,
    accentBg: 'bg-emerald-50 hover:bg-emerald-100/80',
    accentText: 'text-emerald-900',
    accentBorder: 'border-emerald-200'
  },
  {
    role: 'PROJECT_MANAGER',
    label: 'Senior Project Lead',
    name: 'Kavita Nair',
    email: 'kavita.pm@buildstorys.com',
    defaultPassword: 'Pm@123',
    icon: Compass,
    accentBg: 'bg-amber-50 hover:bg-amber-100/80',
    accentText: 'text-amber-900',
    accentBorder: 'border-amber-200'
  },
  {
    role: 'SITE_ENGINEER',
    label: 'Site Execution & QC',
    name: 'Ramesh Verma',
    email: 'ramesh.site@buildstorys.com',
    defaultPassword: 'Site@123',
    icon: HardHat,
    accentBg: 'bg-orange-50 hover:bg-orange-100/80',
    accentText: 'text-orange-900',
    accentBorder: 'border-orange-200'
  },
  {
    role: 'CLIENT',
    label: 'High-Net-Worth Client',
    name: 'Vikram Malhotra',
    email: 'vikram@malhotragroup.in',
    defaultPassword: 'Client@123',
    icon: UserCheck,
    accentBg: 'bg-purple-50 hover:bg-purple-100/80',
    accentText: 'text-purple-900',
    accentBorder: 'border-purple-200'
  }
];

export const LoginPortalModal: React.FC<LoginPortalModalProps> = ({ 
  isOpen, 
  onLoginSuccess, 
  onClose,
  currentSessionUser 
}) => {
  const [identifier, setIdentifier] = useState('aarav@buildstorys.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<string>('ADMIN');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const performLogin = async (idToUse: string, pwdToUse: string) => {
    if (loading) return;
    setError('');
    const cleanId = idToUse.trim();
    if (!cleanId || !pwdToUse) {
      setError('Please enter your work email, username, or role and password.');
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    try {
      // 1. Try server API login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password: pwdToUse })
      });

      const data = await readApiResponse(response);
      if (response.ok && data.success && data.user?.id) {
        setPassword('');
        onLoginSuccess(data.user);
        return;
      }

      // If server returned a distinct auth failure, check client-side fallback
      const clientAuthUser = authenticateClientUser(cleanId, pwdToUse);
      if (clientAuthUser) {
        setPassword('');
        onLoginSuccess(clientAuthUser);
        return;
      }

      throw new Error(data.error || 'Invalid credentials. Please verify your username and password.');
    } catch (err: any) {
      // 2. Client-side fallback if server timed out or had network issue
      const clientAuthUser = authenticateClientUser(cleanId, pwdToUse);
      if (clientAuthUser) {
        setPassword('');
        onLoginSuccess(clientAuthUser);
        return;
      }

      setError(
        err.name === 'AbortError'
          ? 'Network request timed out. Please try again or select a demo account.'
          : err.message || 'Unable to sign in. Please verify your credentials.'
      );
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await performLogin(identifier, password);
  };

  const handleSelectDemo = (account: DemoRoleQuickOption) => {
    setSelectedDemoRole(account.role);
    setIdentifier(account.email);
    setPassword(account.defaultPassword);
    setError('');
  };

  const handleQuickLoginDirect = async (account: DemoRoleQuickOption) => {
    handleSelectDemo(account);
    await performLogin(account.email, account.defaultPassword);
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="login-title"
    >
      {/* Background Architectural Poster Wallpaper */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url('/assets/images/minimalist_concept_render_1789216644600.jpg')` }}
      />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/90" />

      {onClose && (
        <button 
          type="button" 
          onClick={onClose} 
          className="fixed top-4 right-4 z-20 p-2.5 rounded-full text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur border border-slate-700 transition-colors shadow-lg" 
          aria-label="Close sign-in"
        >
          <X size={20} />
        </button>
      )}

      {/* Main Responsive Portal Card */}
      <div className="relative z-10 w-full max-w-5xl my-auto bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Left Column: Enterprise Brand & Architectural Overview */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle architectural grid pattern */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" 
          />

          <div>
            {/* Logo and Brand Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-11 w-11 rounded-xl bg-white p-1 shadow-md flex items-center justify-center shrink-0">
                <img 
                  src="/images/buildstorys-logo-icon.png" 
                  alt="Build Storys" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">Build Storys ERP</span>
                <span className="text-xs text-indigo-200 font-medium block">Design-Build & Commercial Operating System</span>
              </div>
            </div>

            {/* Architecture Headline */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-3">
                <Sparkles size={13} className="text-indigo-400" />
                Integrated Turnkey Platform
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                Architectural Design to Site Handover
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Connect spatial concepts, AI line-item estimating, GFC drawings, and certified milestone billings in one unified workspace.
              </p>
            </div>

            {/* Feature Highlights List */}
            <div className="space-y-3 my-6">
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <Building2 size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Bespoke Architectural Concepts</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">High-fidelity 3D schemes, client inspiration boards, and material schedules.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <Calculator size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Parametric AI BOQ Takeoffs</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">Real-time ledger recalculation, margin protection, and multi-tier quotations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <HardHat size={18} className="text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Site Execution & Quality Control</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">Stage milestones, contractor snag tracking, and verified RA billings.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              Role-Based Access Control Active
            </span>
            <span className="font-mono text-slate-500">v2.4 Enterprise</span>
          </div>
        </div>

        {/* Right Column: Interactive Login Portal Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-slate-50/50">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 id="login-title" className="text-2xl font-bold text-slate-900 tracking-tight">
                  Sign in to your workspace
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Enter your assigned credentials or choose a pre-configured demo persona.
                </p>
              </div>
            </div>

            {/* Quick Demo Role Picker Chips */}
            <div className="mb-5 bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                  Quick 1-Click Role Login
                </span>
                <span className="text-[10px] text-indigo-600 font-medium">Click persona to auto-fill</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map((acc) => {
                  const Icon = acc.icon;
                  const isSelected = selectedDemoRole === acc.role;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleQuickLoginDirect(acc)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                        isSelected 
                          ? `${acc.accentBg} ${acc.accentBorder} ring-2 ring-indigo-500/20 shadow-xs` 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${acc.accentBg}`}>
                        <Icon size={15} className={acc.accentText} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-slate-900 truncate block">
                          {acc.name.split(' ')[0]} ({acc.role})
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {acc.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Alert Box */}
            {error && (
              <div className="mb-4 flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed" role="alert">
                <AlertCircle size={16} className="text-rose-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span>{error}</span>
                  <div className="mt-1 text-[11px] text-rose-700">
                    Hint: Use <code className="bg-rose-100 font-mono px-1 py-0.5 rounded">aarav@buildstorys.com</code> or <code className="bg-rose-100 font-mono px-1 py-0.5 rounded">admin</code> with password <code className="bg-rose-100 font-mono px-1 py-0.5 rounded">Admin@123</code>.
                  </div>
                </div>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label 
                  htmlFor="erp-login-identifier" 
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Work Email, Username or Role
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    id="erp-login-identifier"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    required
                    placeholder="e.g. aarav@buildstorys.com or admin"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 shadow-xs transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label 
                    htmlFor="erp-login-password" 
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Default: Admin@123
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    id="erp-login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 shadow-xs transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-wait"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating credentials…</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Sign in to ERP Workspace</span>
                      <ArrowRight size={16} className="ml-1 opacity-70" />
                    </>
                  )}
                </button>

                {/* Direct Admin 1-Click Action */}
                <button
                  type="button"
                  onClick={() => handleQuickLoginDirect(DEMO_ACCOUNTS[0])}
                  disabled={loading}
                  className="w-full py-2.5 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-100/80 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <ShieldCheck size={16} className="text-indigo-600" />
                  <span>Instant Admin Access (Aarav Singhania - Super Admin)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card Footer */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span>Enterprise Security v2.4</span>
            <div className="flex items-center gap-3 text-slate-600">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Audit Trail Protected
              </span>
              <span>•</span>
              <span>Confidential Financials</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
