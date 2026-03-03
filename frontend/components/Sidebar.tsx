'use client';

import { useEffect } from 'react';
import Image from 'next/image';

const LG_BREAKPOINT = 1024;

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

export type SidebarNavItem = { label: string; icon: string; hideArrow?: boolean };

type SidebarProps = {
  items: SidebarNavItem[];
  open?: boolean;
  onClose?: () => void;
  loggedIn?: boolean;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onLogout?: () => void;
};

export function Sidebar({ items, open = true, onClose, loggedIn = false, onSignIn, onSignUp, onLogout }: SidebarProps) {
  // Lock body scroll when drawer is open on mobile (same as modal)
  useEffect(() => {
    if (!onClose || !open) return;
    const mql = window.matchMedia(`(max-width: ${LG_BREAKPOINT - 1}px)`);
    const unlock = () => {
      document.body.style.overflow = '';
    };
    const update = () => {
      if (mql.matches) document.body.style.overflow = 'hidden';
      else unlock();
    };
    update();
    mql.addEventListener('change', update);
    return () => {
      mql.removeEventListener('change', update);
      unlock();
    };
  }, [open, onClose]);

  return (
    <>
      {/* Mobile overlay only when drawer is open – otherwise it blocks all clicks */}
      {onClose && open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
        />
      )}
      <aside
        className={`
          flex flex-col gap-2.5 bg-[#292d2e] rounded-[10px] p-4
          w-full h-full max-w-[311px] lg:max-w-none lg:w-[311px] shrink-0
          transition-transform duration-300 ease-out
          ${onClose
            ? `fixed top-0 right-0 bottom-0 z-50 lg:relative lg:right-auto lg:translate-x-0
               ${open ? 'translate-x-0' : 'translate-x-full'}
               lg:translate-x-0`
            : ''}
        `}
      >
        {/* Explore row */}
        <div className="flex h-11 w-full max-w-[275px] items-center justify-between p-2.5 bg-[#484a4b] rounded-[10px]">
          <span className="font-semibold text-white text-sm sm:text-base">Explore</span>
          <span className="text-[#4CC360]">
            <SearchIcon />
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-2 flex-1 min-h-0">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex h-11 w-full max-w-[275px] items-center justify-between p-2.5 bg-[#323435] rounded-[10px] hover:bg-[#3d4041] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Image src={item.icon} alt="" width={24} height={24} className="shrink-0 object-contain" />
                <span className="font-semibold text-white text-sm sm:text-base truncate">
                  {item.label}
                </span>
              </div>
              {!item.hideArrow && (
                <Image src="/assets/svg/arrow.svg" alt="" width={10} height={10} className="shrink-0 w-3 h-3" />
              )}
            </button>
          ))}
        </nav>

        {/* Login / Register – bottom of sidebar; hidden on desktop (header has Sign In / Sign Up) */}
        <div className="mt-auto pt-2 flex flex-col gap-2 w-full max-w-[275px] lg:hidden">
          {loggedIn ? (
            onLogout && (
              <button
                type="button"
                onClick={() => { onLogout(); onClose?.(); }}
                className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[#323435] text-white/80 font-semibold text-sm hover:bg-[#3d4041] hover:text-white cursor-pointer transition-colors"
              >
                Log out
              </button>
            )
          ) : (
            <>
              {onSignIn && (
                <button
                  type="button"
                  onClick={() => { onSignIn(); onClose?.(); }}
                  className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[#323435] text-white font-semibold text-sm hover:bg-[#3d4041] cursor-pointer transition-colors"
                >
                  Sign In
                </button>
              )}
              {onSignUp && (
                <button
                  type="button"
                  onClick={() => { onSignUp(); onClose?.(); }}
                  className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[#4cc360] text-black font-semibold text-sm hover:bg-[#5dd471] cursor-pointer transition-colors"
                >
                  Sign Up
                </button>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
