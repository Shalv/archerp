import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle, LogIn, X } from 'lucide-react';
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

export const LoginPortalModal: React.FC<LoginPortalModalProps> = ({ isOpen, onLoginSuccess, onClose }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const performLogin = async (idToUse: string, pwdToUse: string) => {
    if (loading) return;
    setError('');
    if (!idToUse.trim() || !pwdToUse) {
      setError('Please enter your work email or username and password.');
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('/api/auth/login', {method:'POST',credentials:'same-origin',signal:controller.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({identifier:idToUse.trim(),password:pwdToUse})});
      const data = await readApiResponse(response);
      if(!response.ok || !data.success || !data.user?.id) throw new Error(data.error || 'Unable to sign in. Check your credentials and server configuration.');
      const authenticatedUser = data.user;
      setPassword('');
      onLoginSuccess(authenticatedUser);
    } catch (err: any) {
      setError(
        err.name === 'AbortError'
          ? 'The sign-in request timed out. Please try again.'
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
    <div className="login-overlay" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <video
        className="login-bg-video"
        src="/videos/login-bg.mp4"
        poster="/videos/login-bg-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="login-bg-scrim" />
      {onClose && (
        <button type="button" onClick={onClose} className="login-close" aria-label="Close sign-in">
          <X size={20} />
        </button>
      )}

      <section className="login-card">
        <header className="login-brand">
          <img className="login-brand-logo" src="/images/buildstorys-logo-icon.png" alt="Build Storys" />
          <div><strong>Build Storys ERP</strong><p>Architecture · Interiors · Construction</p></div>
        </header>

        <div className="login-content">
          <h1 id="login-title">Sign in to your workspace</h1>
          <p className="login-description">Enter your assigned enterprise credentials to access the application.</p>
          
          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="login-form">
            <label htmlFor="erp-login-identifier">Work email or username</label>
            <div className="login-field">
              <Mail size={19} />
              <input
                id="erp-login-identifier"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
                placeholder="name@buildstorys.com"
              />
            </div>

            <label htmlFor="erp-login-password">Password</label>
            <div className="login-field">
              <Lock size={19} />
              <input
                id="erp-login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button className="login-submit mt-2" type="submit" disabled={loading}>
              <LogIn size={20} />
              {loading ? 'Signing in…' : 'Sign in to ERP'}
            </button>
          </form>
        </div>
        <footer className="login-footer">Build Storys ERP · Authorized Access Only</footer>
      </section>
    </div>
  );
};
