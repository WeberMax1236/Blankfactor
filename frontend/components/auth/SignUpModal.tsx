'use client';

import { useState } from 'react';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

function validateUsername(value: string): string | null {
  if (value.length < 3 || value.length > 20) return 'Username must be 3–20 characters';
  if (!USERNAME_REGEX.test(value)) return 'Only letters, numbers, and underscore allowed';
  return null;
}

function validatePassword(value: string): string | null {
  if (value.length < 8 || value.length > 32) return 'Password must be 8–32 characters';
  if (!PASSWORD_REGEX.test(value)) return 'Password must contain at least one letter and one number';
  return null;
}

type SignUpModalProps = {
  onClose: () => void;
  onSwitchToSignIn: () => void;
  onSuccess?: () => void;
};

export function SignUpModal({
  onClose,
  onSwitchToSignIn,
  onSuccess,
}: SignUpModalProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [promoOptIn, setPromoOptIn] = useState(true);
  const [showPromo, setShowPromo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const userErr = validateUsername(username);
    if (userErr) {
      setError(userErr);
      return;
    }
    const pwErr = validatePassword(password);
    if (pwErr) {
      setError(pwErr);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the User Agreement and confirm you are 18+');
      return;
    }

    setLoading(true);
    try {
      const { auth } = await import('@/lib/api');
      await auth.register({ email, username, password });
      onSuccess?.();
      onClose();
      onSwitchToSignIn();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      // Backend 500: show a user-friendly message (actual fix is on the backend)
      setError(
        message === 'Internal Server Error' || message.includes('500')
          ? 'Something went wrong on our side. Please try again in a moment or contact support.'
          : message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="auth-modal-box auth-modal-animate flex w-full max-w-[608px] flex-col overflow-hidden rounded-2xl"
        style={{ minHeight: '400px', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sign Up
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="auth-modal-divider mx-8" />

        {/* Form body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col justify-center space-y-3 px-8 pb-7 pt-7"
        >
          {error && (
            <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-modal-input w-full rounded-xl px-4 py-3.5 text-sm transition-colors"
              placeholder="Email/Phone Number"
            />
          </div>

          <div>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-modal-input w-full rounded-xl px-4 py-3.5 text-sm transition-colors"
              placeholder="Username"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-modal-input w-full rounded-xl px-4 py-3.5 pr-12 text-sm transition-colors"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 flex -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-modal-input w-full rounded-xl px-4 py-3.5 pr-12 text-sm transition-colors"
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-4 top-1/2 flex -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Promo code (collapsible with animation) */}
          <div className="overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPromo((v) => !v)}
              className="flex w-full items-center gap-1.5 py-1 text-left text-sm text-[#6b6b6b] transition-colors hover:text-[#9a9a9a]"
            >
              <span>Enter Referral / Promo code</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`shrink-0 transition-transform duration-200 ease-out ${showPromo ? 'rotate-180' : ''}`}
              >
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-200 ease-out"
              style={{
                gridTemplateRows: showPromo ? '1fr' : '0fr',
              }}
            >
              <div className="min-h-0 overflow-hidden">
                <input
                  type="text"
                  className="auth-modal-input mt-2 w-full rounded-xl px-4 py-3.5 text-sm transition-colors"
                  placeholder="Referral or promo code"
                />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-1">
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="auth-checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span className="text-sm leading-snug text-gray-400 transition-colors group-hover:text-gray-300">
                I agree to the{' '}
                <strong className="font-semibold text-white">
                  User Agreement
                </strong>{' '}
                and I am 18+
              </span>
            </label>
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="auth-checkbox"
                checked={promoOptIn}
                onChange={(e) => setPromoOptIn(e.target.checked)}
              />
              <span className="text-sm text-gray-400 transition-colors group-hover:text-gray-300">
                Notify me for promotions
              </span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="auth-modal-btn-primary w-full rounded-xl py-3.5 text-base font-bold tracking-wider transition disabled:opacity-60 disabled:transform-none"
            >
              {loading ? 'Signing up…' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="auth-modal-divider mx-8" />
        <div className="py-6 text-center">
          <span className="text-sm text-gray-400">Already have an account? </span>
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-sm font-semibold text-green-400 transition-colors hover:text-green-300"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
