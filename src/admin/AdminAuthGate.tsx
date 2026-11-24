import React, {useCallback, useEffect, useState} from 'react';
import {AlertCircle, ArrowLeft, Lock, ShieldCheck} from 'lucide-react';
import {SolmonixHorizontalLogo, SolmonixMonogram} from '../components/SolmonixLogo';
import {useStudio} from '../context/StudioContext';
import {AdminUser} from '../types/studio';
import {AdminDashboard} from './AdminDashboard';

export function AdminAuthGate() {
  const {navigate} = useStudio();
  const [loading, setLoading] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(true);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  // Setup state
  const [setupName, setSetupName] = useState('');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = (await res.json()) as {
        ok?: boolean;
        hasAdmin?: boolean;
        authenticated?: boolean;
        admin?: AdminUser | null;
      };
      setHasAdmin(Boolean(data.hasAdmin));
      setAdmin(data.authenticated && data.admin ? data.admin : null);
    } catch {
      setError('Unable to verify administrator session with the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (setupPassword.length < 8) {
      setError('Administrator password must be at least 8 characters long.');
      return;
    }
    if (setupPassword !== setupConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: setupName.trim(),
          email: setupEmail.trim(),
          password: setupPassword,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        admin?: AdminUser;
      };
      if (!res.ok || !data.ok || !data.admin) {
        setError(data.message || 'Unable to create administrator account.');
        return;
      }
      setHasAdmin(true);
      setAdmin(data.admin);
    } catch {
      setError('Network error initializing administrator account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        admin?: AdminUser;
      };
      if (!res.ok || !data.ok || !data.admin) {
        setError(data.message || 'Invalid credentials.');
        return;
      }
      setAdmin(data.admin);
      setLoginPassword('');
    } catch {
      setError('Network error signing in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {method: 'POST'});
    setAdmin(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#101216] text-sm text-[#BFC3CA]">
        <SolmonixMonogram size={44} />
        <span>Verifying SOLMONIX STUDIO session...</span>
      </div>
    );
  }

  if (admin) {
    return <AdminDashboard admin={admin} onLogout={handleLogout} />;
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#101216] px-4 py-12 text-white">
      <div className="mx-auto w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center gap-2 text-xs font-medium text-[#BFC3CA] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Public Website</span>
        </button>

        <div className="rounded-2xl border border-[rgba(191,195,202,0.18)] bg-[#16191F] p-7 sm:p-9">
          <div className="flex flex-col gap-2">
            <SolmonixHorizontalLogo size="sm" />
            <p className="text-xs text-[#BFC3CA]">Administrator Control Centre</p>
          </div>

          {!hasAdmin ? (
            <form onSubmit={handleSetup} className="mt-8 space-y-4">
              <div className="flex items-start gap-2.5 rounded-lg border border-[#1769FF]/40 bg-[#1769FF]/10 p-3.5 text-xs leading-relaxed text-[#BFC3CA]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1769FF]" />
                <span>
                  No administrator account exists yet. Create your private studio administrator
                  credentials to secure the dashboard.
                </span>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-xs text-red-200"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="setup-name" className="block text-xs font-medium text-[#BFC3CA]">
                  Administrator Name
                </label>
                <input
                  id="setup-name"
                  type="text"
                  required
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  placeholder="Solomon"
                  className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="setup-email" className="block text-xs font-medium text-[#BFC3CA]">
                  Administrator Email
                </label>
                <input
                  id="setup-email"
                  type="email"
                  required
                  value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}
                  placeholder="admin@solmonixstudio.com"
                  className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="setup-pass" className="block text-xs font-medium text-[#BFC3CA]">
                  Password (min 8 characters)
                </label>
                <input
                  id="setup-pass"
                  type="password"
                  required
                  minLength={8}
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="setup-confirm" className="block text-xs font-medium text-[#BFC3CA]">
                  Confirm Password
                </label>
                <input
                  id="setup-confirm"
                  type="password"
                  required
                  value={setupConfirm}
                  onChange={(e) => setSetupConfirm(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#1769FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2F7BFF] disabled:opacity-60"
              >
                <Lock className="h-4 w-4" aria-hidden="true" />
                <span>{submitting ? 'Creating Account...' : 'Initialize Administrator Access'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <h1 className="font-display text-xl font-semibold text-white">
                  Administrator Sign In
                </h1>
                <p className="mt-1 text-xs text-[#BFC3CA]">
                  Sign in to manage portfolio work, client applications, and studio settings.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-xs text-red-200"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="login-email" className="block text-xs font-medium text-[#BFC3CA]">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@solmonixstudio.com"
                  className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="login-pass" className="block text-xs font-medium text-[#BFC3CA]">
                  Password
                </label>
                <input
                  id="login-pass"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[rgba(191,195,202,0.2)] bg-[#101216] px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#1769FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2F7BFF] disabled:opacity-60"
              >
                <Lock className="h-4 w-4" aria-hidden="true" />
                <span>{submitting ? 'Signing In...' : 'Sign In to Control Centre'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
