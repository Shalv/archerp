import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  X, 
  Check,
  Building2,
  Mail,
  ShieldCheck
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

export const LoginPortalModal: React.FC<LoginPortalModalProps> = ({ 
  isOpen, 
  onLoginSuccess, 
  onClose,
  users = INITIAL_ERP_USERS,
  currentSessionUser 
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [adminContactOpen, setAdminContactOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (forgotModalOpen) {
          setForgotModalOpen(false);
        } else if (adminContactOpen) {
          setAdminContactOpen(false);
        } else if (onClose) {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, forgotModalOpen, adminContactOpen]);

  if (!isOpen) return null;

  const performLogin = async (idToUse: string, pwdToUse: string) => {
    if (loading) return;
    setError('');
    
    // If empty, default to j.alvarez@buildstorys.com for instant frictionless preview
    const cleanId = idToUse.trim() || 'j.alvarez@buildstorys.com';
    const cleanPwd = pwdToUse || 'demo';

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    try {
      // 1. Server authentication request
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password: cleanPwd })
      });

      const data = await readApiResponse(response);
      if (response.ok && data.success && data.user?.id) {
        setPassword('');
        onLoginSuccess(data.user);
        return;
      }

      if (response.status === 401 || response.status === 400 || response.status === 403) {
        const clientAuthUser = authenticateClientUser(cleanId, cleanPwd);
        if (clientAuthUser) {
          setPassword('');
          onLoginSuccess(clientAuthUser);
          return;
        }
        throw new Error(data.error || 'Invalid credentials. Please verify your work email and password.');
      }

      throw new Error(data.error || 'Unable to sign in. Please verify your credentials.');
    } catch (err: any) {
      // Client fallback for seamless offline authentication
      const clientAuthUser = authenticateClientUser(cleanId, cleanPwd);
      if (clientAuthUser) {
        setPassword('');
        onLoginSuccess(clientAuthUser);
        return;
      }

      setError(
        err.name === 'AbortError'
          ? 'Network request timed out. Please try again.'
          : err.message || 'Invalid credentials. Please try again.'
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

  return (
    <div 
      id="buildstorys-login-page"
      className="fixed inset-0 z-[200] overflow-y-auto flex flex-col bg-[#07162C] text-slate-900 select-none min-h-screen"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="login-title"
    >
      {/* Optional Close Button if modal opened by an authenticated session */}
      {onClose && (
        <button 
          id="login-close-btn"
          type="button" 
          onClick={onClose} 
          className="fixed top-6 right-6 z-50 p-2.5 rounded-full text-slate-500 bg-white hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-sm transition cursor-pointer" 
          aria-label="Close sign-in"
        >
          <X size={18} />
        </button>
      )}

      {/* Main Split-Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen w-full">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: ARCHITECTURAL BLUEPRINT ELEVATION & GRID    */}
        {/* ======================================================== */}
        <div className="relative w-full lg:w-[55%] xl:w-[55%] min-h-[580px] lg:min-h-screen bg-[#07162C] flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden text-white border-r border-[#102947]">
          
          {/* Blueprint Grid Background Pattern */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none opacity-45"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(58, 110, 165, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(58, 110, 165, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Subtle Secondary Finer Grid */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(80, 140, 200, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(80, 140, 200, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px'
            }}
          />

          {/* Top Left Official Build Storys Brand Logo */}
          <div className="relative z-10 flex items-center">
            <img 
              src="/images/buildstorys-logo-full.png" 
              alt="Build Storys - Crafting Spaces | Building Stories" 
              className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-md select-none"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Center Architectural Building Sketch */}
          <div className="relative z-10 my-auto py-6 sm:py-8 flex items-center justify-center">
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-lg border border-[#22446A]/80 shadow-2xl bg-[#061427] group">
              <img 
                src="/images/building_sketch.jpg" 
                alt="Architectural Building Concept Sketch"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              
              {/* Subtle Architectural Blueprint Label */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#07162C]/85 border border-[#3A6EA5]/40 backdrop-blur-sm pointer-events-none">
                <span className="text-[10px] font-mono tracking-widest text-[#8BB4DD] uppercase">
                  CONCEPT STUDY
                </span>
              </div>

              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-[#07162C]/85 border border-[#3A6EA5]/40 backdrop-blur-sm text-[9.5px] font-mono text-[#6E8DA7] pointer-events-none">
                BUILDING SCHEMATIC &middot; PERSPECTIVE
              </div>
            </div>
          </div>

          {/* Bottom Left Headline & Blueprint Copy */}
          <div className="relative z-10 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              One system for schedules,<br />
              drawings, and billable hours.
            </h1>
            <p className="mt-4 text-xs sm:text-[13px] text-[#6E8DA7] font-mono leading-relaxed max-w-lg">
              Project data, timesheets, and consultant coordination<br className="hidden sm:inline" />
              for every active commission — drafted with the same<br className="hidden sm:inline" />
              precision as the work itself.
            </p>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: PRACTICE CREDENTIAL SIGN-IN PANE           */}
        {/* ======================================================== */}
        <div className="relative w-full lg:w-[45%] xl:w-[45%] bg-[#FAF9F5] flex flex-col justify-center items-center p-8 sm:p-14 lg:p-16 text-slate-900">
          
          {/* Main Form Container */}
          <div className="w-full max-w-[400px]">
            
            {/* Header */}
            <div className="mb-8">
              <h2 
                id="login-title" 
                className="text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight"
              >
                Sign in to your practice
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Enter your credentials to access active projects.
              </p>

              {/* Clean Subtle Horizontal Divider */}
              <div className="w-full h-px bg-slate-200/90 mt-6" />
            </div>

            {/* Error Banner */}
            {error && (
              <div 
                id="login-error-alert"
                className="mb-6 flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed" 
                role="alert"
              >
                <AlertCircle size={15} className="text-rose-600 mt-0.5 shrink-0" />
                <div className="flex-1 font-medium">
                  {error}
                </div>
              </div>
            )}

            {/* Architectural Underline Sign-in Form */}
            <form onSubmit={submit} className="space-y-6">
              
              {/* Field 1: Work Email */}
              <div>
                <div className="mb-1 text-[11px] font-mono tracking-wider">
                  <label 
                    htmlFor="erp-work-email" 
                    className="text-slate-500 font-semibold uppercase"
                  >
                    WORK EMAIL
                  </label>
                </div>
                <input
                  id="erp-work-email"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="j.alvarez@buildstorys.com"
                  className="w-full border-b border-slate-300 focus:border-[#0F1E36] py-2 text-sm text-slate-900 bg-transparent outline-none transition placeholder:text-slate-400"
                />
              </div>

              {/* Field 2: Password */}
              <div>
                <div className="mb-1 text-[11px] font-mono tracking-wider">
                  <label 
                    htmlFor="erp-work-password" 
                    className="text-slate-500 font-semibold uppercase"
                  >
                    PASSWORD
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="erp-work-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="••••••••••••"
                    className="w-full border-b border-slate-300 focus:border-[#0F1E36] py-2 pr-8 text-sm text-slate-900 bg-transparent outline-none transition placeholder:text-slate-400"
                  />
                  <button
                    id="toggle-password-btn"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Keep me signed in & Forgot Password Row */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0F1E36] focus:ring-[#0F1E36] cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-slate-900 hover:text-slate-600 font-medium transition cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <div className="pt-2">
                <button
                  id="erp-login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 py-3 px-6 rounded-sm bg-[#0E1B2E] hover:bg-[#162744] active:bg-[#071322] text-white text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating…</span>
                    </>
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>
              </div>

            </form>

            {/* Bottom Meta Bar: NEED ACCESS? CONTACT ADMIN & BS-ERP-04 */}
            <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-slate-400 mt-12 pt-4 border-t border-slate-200/80">
              <button 
                type="button"
                onClick={() => setAdminContactOpen(true)}
                className="hover:text-slate-700 transition cursor-pointer uppercase"
              >
                NEED ACCESS? CONTACT ADMIN
              </button>
              <span>BS-ERP-04</span>
            </div>

          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Reset Credentials</h3>
              <button 
                onClick={() => setForgotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Credentials are authenticated through the practice directory. Please reach out to your administrator to request a secure password reset link.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 mb-4 space-y-1 font-mono">
              <div>ADMIN: aarav@buildstorys.com</div>
              <div>DIRECTOR: shruthi@buildstory.com</div>
            </div>
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="w-full py-2.5 rounded-sm bg-[#0E1B2E] text-white text-xs font-medium hover:bg-slate-800 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Need Access Admin Contact Modal */}
      {adminContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Practice Access Request</h3>
              <button 
                onClick={() => setAdminContactOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              To provision a new seat or link your corporate SSO with your project assignments, contact the system administrator.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 mb-4 space-y-1 font-mono">
              <div>PRACTICE: Build Storys Architecture ERP</div>
              <div>SUPPORT: admin@buildstorys.com</div>
              <div>CODE: BS-ERP-04</div>
            </div>
            <button
              type="button"
              onClick={() => setAdminContactOpen(false)}
              className="w-full py-2.5 rounded-sm bg-[#0E1B2E] text-white text-xs font-medium hover:bg-slate-800 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
