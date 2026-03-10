'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const LG_BREAKPOINT = 1024;

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`shrink-0 text-white/70 transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
    >
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
}

export type SidebarNavSubItem = { label: string; icon: string };
export type SidebarNavItem = {
  label: string;
  icon: string;
  hideArrow?: boolean;
  children?: SidebarNavSubItem[];
};

type SidebarProps = {
  items: SidebarNavItem[];
  open?: boolean;
  onClose?: () => void;
  loggedIn?: boolean;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onLogout?: () => void;
};

const SIDEBAR_COLLAPSED_W = 72;
const SIDEBAR_EXPANDED_W = 311;

export function Sidebar({ items, open = true, onClose, loggedIn = false, onSignIn, onSignUp, onLogout }: SidebarProps) {
  const expanded = open;
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [closingKey, setClosingKey] = useState<string | null>(null);
  // Lock body scroll when drawer is expanded on mobile (same as modal)
  useEffect(() => {
    if (!onClose || !expanded) return;
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
  }, [expanded, onClose]);

  return (
    <>
      {/* Mobile overlay only when expanded (drawer) – otherwise it blocks all clicks */}
      {onClose && expanded && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
        />
      )}
      <aside
        className={`
          flex flex-col gap-2.5 bg-[#292d2e] rounded-[10px] shrink-0 h-full overflow-hidden
          transition-[width,transform] duration-300 ease-out
          ${expanded ? 'p-4' : 'p-2 items-center'}
          ${onClose
            ? expanded
              ? 'fixed top-0 right-0 bottom-0 z-50 w-[311px] max-w-[100vw] lg:relative lg:right-auto lg:translate-x-0'
              : 'relative w-[72px]'
            : 'w-[311px] max-w-[311px]'}
        `}
        style={onClose && expanded ? { width: SIDEBAR_EXPANDED_W } : undefined}
      >
        {/* Explore: full input when expanded, icon-only when collapsed */}
        <div className={`relative flex h-11 items-center rounded-[10px] bg-[#323435] overflow-hidden ${expanded ? 'w-full max-w-[275px]' : 'w-11 h-11 justify-center shrink-0'}`}>
          {expanded ? (
            <>
              <input
                type="text"
                placeholder="Explore..."
                aria-label="Search or explore"
                className="w-full h-full pl-3 pr-10 bg-transparent text-white text-sm sm:text-base placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#4CC360]/30 focus:ring-inset"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#4CC360]">
                <SearchIcon />
              </span>
            </>
          ) : (
            <span className="text-[#4CC360] shrink-0 flex items-center justify-center" aria-label="Search">
              <SearchIcon />
            </span>
          )}
        </div>

        {/* Nav items: labels + dropdown chevron when expanded; subcategories when open */}
        <nav className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto">
          {items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = expandedKey === item.label;
            const isClosing = closingKey === item.label;
            const showSubList = isOpen || isClosing;
            return (
              <div key={item.label} className="flex flex-col gap-1">
                <button
                  type="button"
                  title={!expanded ? item.label : undefined}
                  onClick={() => {
                    if (!expanded) return;
                    if (item.hideArrow) return;
                    if (!hasChildren) return;
                    if (expandedKey === item.label) setClosingKey(item.label);
                    else {
                      setExpandedKey(item.label);
                      setClosingKey(null);
                    }
                  }}
                  className={`flex h-11 rounded-[10px] hover:bg-[#3d4041] cursor-pointer transition-colors duration-200
                    ${isOpen ? 'bg-[#3d4041]' : 'bg-[#323435]'}
                    ${expanded ? 'w-full max-w-[275px] items-center justify-between p-2.5' : 'w-11 h-11 items-center justify-center shrink-0 p-0'}`}
                >
                  <div className={`flex items-center min-w-0 ${expanded ? 'gap-2.5' : 'justify-center'}`}>
                    <Image src={item.icon} alt="" width={24} height={24} className="shrink-0 object-contain" />
                    {expanded && (
                      <span className="font-semibold text-white text-sm sm:text-base truncate">
                        {item.label}
                      </span>
                    )}
                  </div>
                  {expanded && hasChildren && (
                    <span className="shrink-0">
                      <Chevron open={isOpen} />
                    </span>
                  )}
                </button>
                {expanded && hasChildren && showSubList && (
                  <div
                    className={`flex flex-col gap-1 pl-1 pr-1 ${isClosing ? 'animate-dropdown-sub-out' : 'animate-dropdown-sub-in'}`}
                    onAnimationEnd={(e) => {
                      if (e.animationName === 'dropdown-sub-out' && isClosing) {
                        setExpandedKey(null);
                        setClosingKey(null);
                      }
                    }}
                  >
                    {item.children!.map((sub) => (
                      <a
                        key={sub.label}
                        href="#"
                        className="flex h-10 items-center gap-2.5 rounded-[10px] bg-[#2a2d2e] pl-3 pr-2.5 hover:bg-[#323435] transition-colors"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={encodeURI(sub.icon)}
                          alt=""
                          width={20}
                          height={20}
                          className="shrink-0 w-5 h-5 object-contain opacity-90"
                        />
                        <span className="font-medium text-white text-sm truncate">{sub.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Login / Register – bottom of sidebar; hidden when collapsed; hidden on desktop when expanded (header has Sign In / Sign Up) */}
        {expanded && (
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
        )}
      </aside>
    </>
  );
}
