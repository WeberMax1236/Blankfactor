'use client';

import { useState } from 'react';
import { auth, DEFAULT_CURRENCY_ID } from '@/lib/api';
import { setToken } from '@/lib/auth';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 32;
const HAS_LETTER = /[A-Za-z]/;
const HAS_NUMBER = /\d/;
// Backend only allows: letters, digits, and @$!%*?& (see RegisterDto)
const PASSWORD_ALLOWED = /^[A-Za-z\d@$!%*?&]+$/;

function validateUsername(value: string): string | null {
  if (value.length < 3 || value.length > 20) return 'Username must be 3–20 characters';
  if (!USERNAME_REGEX.test(value)) return 'Only letters, numbers, and underscore allowed';
  return null;
}

/** Returns human-readable suggestions for what the password is missing. */
function getPasswordSuggestions(value: string): string[] {
  if (!value) return [];
  const suggestions: string[] = [];
  if (value.length < PASSWORD_MIN) suggestions.push(`At least ${PASSWORD_MIN} characters`);
  if (value.length > PASSWORD_MAX) suggestions.push(`No more than ${PASSWORD_MAX} characters`);
  if (!HAS_LETTER.test(value)) suggestions.push('Add letters (a–z, A–Z)');
  if (!HAS_NUMBER.test(value)) suggestions.push('Add a number');
  if (!PASSWORD_ALLOWED.test(value)) suggestions.push('Only letters, numbers, and @$!%*?& allowed');
  return suggestions;
}

function validatePassword(value: string): string | null {
  if (value.length < PASSWORD_MIN || value.length > PASSWORD_MAX) return 'Password must be 8–32 characters';
  if (!HAS_LETTER.test(value)) return 'Password must contain letters and numbers';
  if (!HAS_NUMBER.test(value)) return 'Password must contain letters and numbers';
  if (!PASSWORD_ALLOWED.test(value)) return 'Password may only contain letters, numbers, and @$!%*?&';
  return null;
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 15);
}

type SignUpModalProps = {
  onClose: () => void;
  onSwitchToSignIn: () => void;
  /** Called after successful registration. For email signup, passes credentials so Sign In can be pre-filled. */
  onSuccess?: (credentials?: { email: string; password: string }) => void;
};

type SignUpMode = 'email' | 'phone';

export function SignUpModal({
  onClose,
  onSwitchToSignIn,
  onSuccess,
}: SignUpModalProps) {
  const [signUpMode, setSignUpMode] = useState<SignUpMode>('email');
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

  // Phone / OTP flow
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const normalized = normalizePhone(phone);
    if (normalized.length < 8) {
      setError('Enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      await auth.sendOtp(normalized);
      setOtpSent(true);
      setOtpCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!otpCode.trim() || otpCode.length < 4) {
      setError('Enter the OTP code you received');
      return;
    }
    const normalized = normalizePhone(phone);
    setLoading(true);
    try {
      const res = await auth.verifyOtp(normalized, otpCode.trim(), DEFAULT_CURRENCY_ID);
      if (res.access_token) {
        setToken(res.access_token);
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setError('');
    // Backend must expose POST /auth/google with body { googleUser: { id, email }, currencyId }.
    // When ready, integrate Google Sign-In (e.g. @react-oauth/google), get profile, then:
    // const res = await auth.googleLogin(profile, DEFAULT_CURRENCY_ID); setToken(res.access_token); onSuccess?.(); onClose();
    setError('Google sign-in will be available soon. Use Email or Phone for now.');
  }

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
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[SignUp] Sending register request:', { email, username, passwordLength: password.length });
    }
    try {
      await auth.register({ email, username, password });
      onSuccess?.({ email, password });
      onClose();
      onSwitchToSignIn();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.error('[SignUp] Register error:', message, err instanceof Error ? err.message : err);
      }
      // In development, show the real error (e.g. "Backend unreachable..." or "Internal Server Error (HTTP 500)")
      const isDev = typeof window !== 'undefined' && process.env.NODE_ENV === 'development';
      const is500 = message.includes('500') || message === 'Internal Server Error';
      setError(
        !isDev && is500
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
        className="auth-modal-box auth-modal-animate flex w-full max-w-[608px] max-h-[90vh] flex-col overflow-hidden rounded-2xl"
        style={{ minHeight: '560px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed top: Sign Up title, tabs – stays in place when content scrolls */}
        <div className="sticky top-0 z-10 shrink-0 rounded-t-2xl bg-[#222222]">
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

          <div className="relative flex border-b border-white/10 px-8">
            <button
              type="button"
              onClick={() => { setSignUpMode('email'); setError(''); setOtpSent(false); }}
              className={`relative z-10 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all duration-300 ease-out ${
                signUpMode === 'email'
                  ? 'border-green-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => { setSignUpMode('phone'); setError(''); }}
              className={`relative z-10 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all duration-300 ease-out ${
                signUpMode === 'phone'
                  ? 'border-green-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Phone
            </button>
          </div>

          <div className="px-8 pt-4 pb-0">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="auth-modal-input w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-medium text-white border border-white/20 hover:bg-white/5 transition-colors disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          </div>
        </div>

        {/* Form body – fixed min-height so header/tabs don’t move when switching Email/Phone */}
        <form
          onSubmit={signUpMode === 'email' ? handleSubmit : otpSent ? handleVerifyOtp : handleSendOtp}
          className="flex min-h-[340px] flex-1 flex-col justify-start space-y-3 px-8 pb-7 pt-4 overflow-y-auto"
        >
          {error && (
            <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          {signUpMode === 'phone' && (
            <>
              {!otpSent ? (
                <>
                  <div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(normalizePhone(e.target.value))}
                      className="auth-modal-input w-full rounded-xl px-4 py-3.5 text-sm transition-colors"
                      placeholder="Phone number"
                    />
                  </div>
                  <p className="text-xs text-gray-500">We’ll send you an OTP to verify your number.</p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-modal-btn-primary w-full rounded-xl py-3.5 text-base font-bold tracking-wider transition disabled:opacity-60"
                  >
                    {loading ? 'Sending…' : 'Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-400">Code sent to {phone || 'your number'}. Enter it below.</p>
                  <div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="auth-modal-input w-full rounded-xl px-4 py-3.5 text-sm transition-colors text-center tracking-widest"
                      placeholder="OTP code"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-modal-btn-primary w-full rounded-xl py-3.5 text-base font-bold tracking-wider transition disabled:opacity-60"
                  >
                    {loading ? 'Verifying…' : 'Verify & Sign up'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setError(''); }}
                    className="text-sm text-gray-500 hover:text-gray-300"
                  >
                    Use a different number
                  </button>
                </>
              )}
            </>
          )}

          {signUpMode === 'email' && (
            <>
          <div>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-modal-input w-full rounded-xl px-4 py-3.5 text-sm transition-colors"
              placeholder="Email"
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

          <div>
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
            {password && getPasswordSuggestions(password).length > 0 && (
              <p className="mt-1.5 text-xs text-amber-400/90">
                Strong password requires: {getPasswordSuggestions(password).join('; ')}.
              </p>
            )}
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
              disabled={loading || !agreeTerms}
              className="auth-modal-btn-primary w-full rounded-xl py-3.5 text-base font-bold tracking-wider transition disabled:opacity-60 disabled:transform-none"
            >
              {loading ? 'Signing up…' : 'Sign Up'}
            </button>
          </div>
            </>
          )}
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
