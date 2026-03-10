'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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

const PROFILE_MENU_ITEMS: { label: string; icon: string; href?: string; action?: 'logout' }[] = [
  { label: 'Wallet', icon: '/assets/profile_svg/Wallet.svg' },
  { label: 'Withdraw', icon: '/assets/profile_svg/Withdraw.svg' },
  { label: 'Buy Crypto', icon: '/assets/profile_svg/Buy Crypto.svg' },
  { label: 'Transactions', icon: '/assets/profile_svg/Transactions.svg' },
  { label: 'Bet History', icon: '/assets/profile_svg/Bet History.svg' },
  { label: 'My Profile', icon: '/assets/profile_svg/Profile.svg' },
  { label: 'Log Out', icon: '/assets/profile_svg/Logout.svg', action: 'logout' },
];

export function Header({
  onMenuToggle,
  loggedIn,
  onSignIn,
  onSignUp,
  onLogout,
  balance = '$0.00',
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileClosing, setProfileClosing] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationClosing, setNotificationClosing] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'Promotions' | 'Transactions' | 'System'>('Promotions');
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const closeProfile = useCallback(() => {
    setProfileClosing((prev) => prev || profileOpen);
  }, [profileOpen]);
  const closeNotification = useCallback(() => {
    setNotificationClosing((prev) => prev || notificationOpen);
  }, [notificationOpen]);

  useEffect(() => {
    if (!profileOpen || profileClosing) return;
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) closeProfile();
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [profileOpen, profileClosing, closeProfile]);

  useEffect(() => {
    if (!notificationOpen || notificationClosing) return;
    function handleClick(e: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) closeNotification();
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [notificationOpen, notificationClosing, closeNotification]);

  return (
    <header className="relative z-50 flex flex-wrap items-center justify-between gap-2 min-h-[72px] py-3 mx-2 sm:mx-3 md:mx-4 lg:mx-5 mt-2 sm:mt-3 bg-[#292d2e] rounded-[10px] pl-4 pr-3 sm:pl-4 sm:pr-4">
      {/* Left: menu toggle (header_logo icon) + logo */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#3A4142] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#424a4b] transition-colors [&_img]:pointer-events-none"
          >
            <Image
              src="/assets/svg/header_logo.svg"
              alt=""
              width={22}
              height={12}
              className="object-contain pointer-events-none"
            />
          </button>
        )}
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
            <div className="flex h-9 sm:h-10 min-w-[140px] sm:min-w-[180px] rounded-[10px] border-2 border-[#4CC360] overflow-hidden bg-[#292d2e] shrink-0">
              <div className="flex items-center flex-1 min-w-0 pl-2 sm:pl-3 pr-2 gap-1 sm:gap-1.5">
                <Image
                  src="/assets/svg/Group.svg"
                  alt=""
                  width={15}
                  height={20}
                  className="object-contain shrink-0 text-[#4CC360]"
                />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-white/50" aria-hidden>
                  <path d="M7 10l5 5 5-5z" />
                </svg>
                <span className="font-semibold text-white text-sm sm:text-base tabular-nums truncate">
                  {balance}
                </span>
              </div>
              <button
                type="button"
                className="h-full px-4 sm:px-6 rounded-r-[8px] bg-gradient-to-b from-[#5dd471] to-[#149145] font-semibold text-sm sm:text-base text-white hover:opacity-95 active:scale-[0.98] transition-all shrink-0 cursor-pointer"
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
            <div className="relative shrink-0" ref={notificationRef}>
              <button
                type="button"
                onClick={() => {
                  closeProfile();
                  if (notificationClosing) return;
                  if (notificationOpen) closeNotification();
                  else setNotificationOpen(true);
                }}
                aria-expanded={notificationOpen}
                aria-haspopup="true"
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
              {(notificationOpen || notificationClosing) && (
                <div
                  className={`absolute right-0 top-full mt-2 w-[320px] sm:w-[360px] rounded-[10px] bg-[#363738] border border-white/10 shadow-xl z-50 overflow-hidden origin-top-right ${
                    notificationClosing ? 'animate-dropdown-out' : 'animate-dropdown-in'
                  }`}
                  role="dialog"
                  aria-label="Notification panel"
                  onAnimationEnd={(e) => {
                    if (e.animationName === 'dropdown-out' && notificationClosing) {
                      setNotificationOpen(false);
                      setNotificationClosing(false);
                    }
                  }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <h3 className="font-bold text-white text-base">Notification</h3>
                    <button
                      type="button"
                      onClick={closeNotification}
                      aria-label="Close notifications"
                      className="w-8 h-8 rounded-full bg-[#3d4041] flex items-center justify-center text-white hover:bg-[#424a4b] transition-colors cursor-pointer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex gap-1 p-2 border-b border-white/10">
                    {(['Promotions', 'Transactions', 'System'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setNotificationTab(tab)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          notificationTab === tab
                            ? 'bg-[#3d4041] text-white'
                            : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="min-h-[460px] p-4 bg-[#363738]">
                    {/* Notification list placeholder – can be filled with real data later */}
                    <p className="text-white/50 text-sm text-center py-8">No {notificationTab.toLowerCase()} notifications</p>
                  </div>
                </div>
              )}
            </div>
            <div className="relative shrink-0" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  closeNotification();
                  if (profileClosing) return;
                  if (profileOpen) closeProfile();
                  else setProfileOpen(true);
                }}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="Profile menu"
                className="w-10 h-10 rounded-full border border-[#3c9b4c] overflow-hidden bg-[#3A4142] flex items-center justify-center cursor-pointer hover:bg-[#424a4b] transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white/80">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </button>
              {(profileOpen || profileClosing) && (
                <div
                  className={`absolute right-0 top-full mt-2 min-w-[200px] py-2 rounded-b-[10px] bg-[#323435] border border-t-0 border-white/10 shadow-xl z-50 origin-top-right ${
                    profileClosing ? 'animate-dropdown-out' : 'animate-dropdown-in'
                  }`}
                  role="menu"
                  onAnimationEnd={(e) => {
                    if (e.animationName === 'dropdown-out' && profileClosing) {
                      setProfileOpen(false);
                      setProfileClosing(false);
                    }
                  }}
                >
                  {PROFILE_MENU_ITEMS.map((item) => {
                    if (item.action === 'logout') {
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            closeProfile();
                            onLogout?.();
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-white text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                          role="menuitem"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={encodeURI(item.icon)} alt="" width={20} height={20} className="shrink-0 w-5 h-5 object-contain opacity-90" />
                          <span>{item.label}</span>
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={item.label}
                        href={item.href ?? '#'}
                        onClick={() => closeProfile()}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-white text-sm font-medium hover:bg-white/10 transition-colors"
                        role="menuitem"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={encodeURI(item.icon)} alt="" width={20} height={20} className="shrink-0 w-5 h-5 object-contain opacity-90" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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

      </div>
    </header>
  );
}
