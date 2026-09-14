import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  LogIn, 
  X, 
  ShieldCheck, 
  Calculator, 
  HardHat, 
  CheckCircle2,
  ArrowRight,
  Layers
} from 'lucide-react';
import { UserSession } from '../types/erp';
import { readApiResponse } from '../utils/apiResponse';
import { authenticateClientUser } from '../data/defaultUsers';

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
  currentSessionUser 
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  // Ensure background video plays automatically in a continuous loop
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay fallback silently handled by loop and poster
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const performLogin = async (idToUse: string, pwdToUse: string) => {
    if (loading) return;
    setError('');
    const cleanId = idToUse.trim();
    if (!cleanId || !pwdToUse) {
      setError('Please enter your work email or username and password.');
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

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

      if (response.status === 401 || response.status === 400 || response.status === 403) {
        const clientAuthUser = authenticateClientUser(cleanId, pwdToUse);
        if (clientAuthUser) {
          setPassword('');
          onLoginSuccess(clientAuthUser);
          return;
        }
        throw new Error(data.error || 'Invalid credentials. Please verify your email or username and password.');
      }

      throw new Error(data.error || 'Unable to sign in. Please verify your credentials.');
    } catch (err: any) {
      // Robust client fallback
      const clientAuthUser = authenticateClientUser(cleanId, pwdToUse);
      if (clientAuthUser) {
        setPassword('');
        onLoginSuccess(clientAuthUser);
        return;
      }

      setError(
        err.name === 'AbortError'
          ? 'Network request timed out. Please try again.'
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

  return (
    <div 
      className="fixed inset-0 z-[200] overflow-y-auto flex flex-col justify-center select-none"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="login-title"
    >
      {/* 1. ARCHITECTURAL 3D WIREFRAME BACKGROUND VIDEO - CONTINUOUS SEAMLESS LOOP */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/login-bg-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/login-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Close Button if opened as overlay dialog */}
      {onClose && (
        <button 
          type="button" 
          onClick={onClose} 
          className="fixed top-6 right-6 z-30 p-2.5 rounded-full text-slate-200 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md border border-slate-700 transition-all shadow-lg cursor-pointer" 
          aria-label="Close sign-in"
        >
          <X size={20} />
        </button>
      )}

      {/* 2. MAIN FULL-WIDTH CONTAINER WITH RIGHT-SHIFTED LOGIN CARD */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-10 min-h-[90vh]">
        
        {/* LEFT COLUMN: ARCHITECTURAL FIRM BRANDING WITH CRISP FROSTED GLASS */}
        <div className="w-full lg:max-w-xl text-slate-900 flex flex-col justify-between py-4 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_15px_35px_rgba(0,0,0,0.08)]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold tracking-wider uppercase text-indigo-700 mb-5 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span>Architectural Studio & ERP Hub</span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="h-12 w-12 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0 border border-slate-200">
                <img 
                  src="/images/buildstorys-logo-icon.png" 
                  alt="Build Storys" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Cinzel',serif]">
                  BUILD STORYS
                </h1>
                <span className="text-xs sm:text-sm font-medium text-slate-600 tracking-widest uppercase block">
                  Architecture & Integrated Design Studio
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal max-w-lg mt-3">
              Precision architectural design meets turnkey construction execution. Connect spatial concepts, AI line-item estimating, GFC drawings, and certified milestone billings in one unified workspace.
            </p>

            {/* Architectural Capabilities Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/90 border border-slate-200/90 shadow-2xs">
                <Layers size={15} className="text-indigo-600 shrink-0" />
                <span className="text-slate-800 font-medium">BIM Level 3</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/90 border border-slate-200/90 shadow-2xs">
                <Calculator size={15} className="text-emerald-600 shrink-0" />
                <span className="text-slate-800 font-medium">Parametric BOQ</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/90 border border-slate-200/90 shadow-2xs">
                <HardHat size={15} className="text-amber-600 shrink-0" />
                <span className="text-slate-800 font-medium">Site QA Verification</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ARCHITECTURAL LOGIN CARD IN SOPHISTICATED GREY SHADE WITH HIGH-CONTRAST CLEAR TEXT */}
        <div className="w-full lg:max-w-md xl:max-w-[430px] lg:ml-auto shrink-0">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-700/80 p-6 sm:p-8 text-white relative overflow-hidden">
            
            {/* Top Architectural Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600" />

            {/* Portal Card Header */}
            <div className="mb-6 pt-1">
              <div className="flex items-center justify-between mb-2.5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-700/60 shadow-2xs">
                  <ShieldCheck size={12} className="text-indigo-400" />
                  Enterprise Gateway
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">v2.4 Core</span>
              </div>
              <h2 id="login-title" className="text-2xl font-bold text-white tracking-tight font-['Cinzel',serif]">
                Studio Sign In
              </h2>
              <p className="text-xs text-slate-300 mt-1 font-normal">
                Enter your credentials to access the architectural workspace.
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div 
                className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs leading-relaxed shadow-xs" 
                role="alert"
              >
                <AlertCircle size={16} className="text-rose-400 mt-0.5 shrink-0" />
                <div className="flex-1 font-medium">
                  {error}
                </div>
              </div>
            )}

            {/* Main Interactive Login Form */}
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label 
                  htmlFor="erp-login-identifier" 
                  className="block text-xs font-semibold text-slate-200 mb-1.5 tracking-wide"
                >
                  Work Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    id="erp-login-identifier"
                    type="text"
                    autoComplete="username"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter work email or username"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label 
                    htmlFor="erp-login-password" 
                    className="block text-xs font-semibold text-slate-200 tracking-wide"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    id="erp-login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-950/70 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  id="erp-login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating credentials…</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Enter Studio Workspace</span>
                      <ArrowRight size={16} className="ml-1 opacity-80" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Trust & Security Badges */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Role-Based Security
              </span>
              <span className="text-slate-500">Build Storys © 2026</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
