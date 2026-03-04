'use client';

import Image from 'next/image';
import Link from 'next/link';

export type HeaderProps = {
  onMenuToggle?: () => void;
  loggedIn: boolean;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onLogout?: () => void;
  balance?: string;
};

export function Header({
  onMenuToggle,
  loggedIn,
  onSignIn,
  onSignUp,
  onLogout,
  balance = '$0.00',
}: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 min-h-[72px] py-3 mx-2 sm:mx-3 md:mx-4 lg:mx-5 mt-2 sm:mt-3 bg-[#292d2e] rounded-[10px] px-3 sm:px-4 md:pl-[51px] md:pr-4">
      {/* Left: logo only (menu is on the right) */}
      <div className="flex items-center min-w-0">
        <Link href="/" className="flex items-center self-stretch pt-px cursor-pointer shrink-0">
          <Image
            src="/assets/logo.png"
            alt="BKX BETS"
            width={63}
            height={54}
            className="object-contain shrink-0 w-12 h-10 sm:w-[63px] sm:h-[54px]"
            priority
          />
        </Link>
      </div>

      {/* Right: auth/balance + language (desktop) or menu button (mobile) */}
      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 min-w-0">
        {/* Desktop (lg+): show auth or balance as before */}
        {loggedIn ? (
          <>
            <div className="flex h-9 sm:h-10 w-100 rounded-full border border-[#3c9b4c] overflow-hidden bg-[#292d2e] shrink-0 min-w-0">
              <div className="flex items-center flex-1 min-w-0 pl-3 sm:pl-4 pr-2 sm:pr-3">
                <span className="font-semibold text-white text-sm sm:text-base tabular-nums truncate">
                  {balance}
                </span>
              </div>
              <button
                type="button"
                className="h-full px-4 sm:px-6 rounded-r-full bg-gradient-to-r from-[#4cc360] to-[#178842] font-semibold text-sm sm:text-base text-black hover:opacity-95 active:scale-[0.98] transition-all shrink-0 cursor-pointer"
              >
                Deposit
              </button>
            </div>
            {/* Chat / Messages */}
            <button
              type="button"
              aria-label="Messages"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#3A4142] flex items-center justify-center cursor-pointer shrink-0 hover:bg-[#424a4b] transition-colors"
            >
              <Image
                src="/assets/svg/solar_chat-unread-linear.svg"
                alt=""
                width={20}
                height={20}
                className="object-contain"
              />
            </button>
            {/* Gifts */}
            <button
              type="button"
              aria-label="Gifts"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#3A4142] flex items-center justify-center cursor-pointer shrink-0 hover:bg-[#424a4b] transition-colors"
            >
              <Image
                src="/assets/svg/lucide_gift.svg"
                alt=""
                width={20}
                height={20}
                className="object-contain"
              />
            </button>
            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#3A4142] flex items-center justify-center cursor-pointer shrink-0 hover:bg-[#424a4b] transition-colors"
            >
              <Image
                src="/assets/svg/iconoir_bell-notification-solid.svg"
                alt=""
                width={20}
                height={20}
                className="object-contain"
              />
            </button>
            <div className="w-10 h-10 rounded-full border border-[#3c9b4c] overflow-hidden bg-[#3A4142] shrink-0 flex items-center justify-center cursor-pointer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white/80">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="hidden lg:block text-white/60 text-sm hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                Log out
              </button>
            )}
          </>
        ) : (
          <>
            {onSignIn && (
              <div className="hidden lg:block shrink-0 w-[80px] sm:w-[100px] h-9 sm:h-10 rounded-[10px] p-px bg-gradient-to-r from-[#4CC360] to-[#178842]">
                <button
                  type="button"
                  onClick={onSignIn}
                  className="w-full h-full rounded-[9px] bg-[#292d2e] flex items-center justify-center px-2 py-2.5 font-semibold text-sm sm:text-base text-white hover:bg-[#3d4041] hover:text-white cursor-pointer transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
            {onSignUp && (
              <button
                type="button"
                onClick={onSignUp}
                className="hidden lg:flex w-[80px] sm:w-[100px] h-9 sm:h-10 items-center justify-center rounded-[10px] bg-linear-to-br from-[#148440] to-[#61db6c] font-semibold text-sm sm:text-base text-black hover:opacity-95 hover:brightness-110 cursor-pointer transition-all"
              >
                Sign Up
              </button>
            )}
          </>
        )}

        {/* Language icon – visible only when not logged in */}
        {!loggedIn && (
          <div className="flex w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#3A4142] items-center justify-center cursor-pointer shrink-0">
            <Image
              src="/assets/svg/languages.svg"
              alt="Language"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
        )}

        {/* Mobile/tablet: menu button on the right end – opens sidebar (nav + login/register) */}
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden w-10 h-10 rounded-[10px] bg-[#323435] flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
