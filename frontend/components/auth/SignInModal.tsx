'use client';

import { useState } from 'react';

type SignInModalProps = {
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onSuccess?: () => void;
};

export function SignInModal({
  onClose,
  onSwitchToSignUp,
  onSuccess,
}: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { auth } = await import('@/lib/api');
      const { setToken } = await import('@/lib/auth');
      const res = await auth.login({ email, password });
      setToken(res.access_token);
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
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
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Sign In
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[#aaa] transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M1 1l11 11M12 1L1 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="auth-modal-divider mx-8" />

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col justify-center gap-3 px-8 pb-8 pt-6"
        >
          {error && (
            <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div>
            <input
              type="text"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-modal-input w-full rounded-xl px-4 py-3.5 text-[15px] transition-colors"
              placeholder="Email/Phone Number"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-modal-input w-full rounded-xl px-4 py-3.5 pr-12 text-[15px] transition-colors"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center text-[#555] transition-colors hover:text-[#aaa]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
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
                  width="20"
                  height="20"
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

          <button
            type="button"
            className="mt-[-2px] cursor-pointer text-right text-sm font-medium text-[#6b6b6b] transition-colors hover:text-[#aaa]"
            onClick={() => {}}
          >
            Forgot your password?
          </button>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="auth-modal-btn-primary w-full max-w-[530px] rounded-xl py-4 text-base font-bold tracking-wide transition disabled:opacity-60 disabled:transform-none"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="auth-modal-divider mx-8" />
        <div className="py-5 text-center">
          <span className="text-sm font-semibold text-[#aaa]">
            New to BKX BETS?{' '}
          </span>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-sm font-semibold text-[#4ade80] transition-colors hover:text-[#86efac]"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
