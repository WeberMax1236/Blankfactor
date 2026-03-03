'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignInModal } from '@/components/auth/SignInModal';
import { SignUpModal } from '@/components/auth/SignUpModal';
import { clearToken, isAuthenticated } from '@/lib/auth';

const SIDEBAR_NAV = [
  { label: 'Sports', icon: '/assets/sidebar_images/material-symbols_sports.png' },
  { label: 'Lottery', icon: '/assets/sidebar_images/fluent_lottery-20-filled.png' },
  { label: 'Games', icon: '/assets/sidebar_images/fluent_games-16-filled.png' },
  { label: 'Casino', icon: '/assets/sidebar_images/temaki_casino.png' },
];

const TRENDING_GAMES = [
  { name: 'PLINKO', image: '/assets/cards/Frame%202121454900.png', count: 60 },
  { name: 'DICE GAME', image: '/assets/cards/Frame%202121454902.png', count: 23 },
  { name: 'POKER', image: '/assets/cards/Frame%202121454903.png', count: 16 },
  { name: 'Aviator', image: '/assets/cards/Frame%202121454905.png', count: 56 },
  { name: 'Aviator', image: '/assets/cards/image%2010.png', count: null },
  { name: 'Aviator', image: '/assets/cards/image%2010.png', count: null },
];

const LIVE_MATCHES = [
  {
    team1: 'FC BARCELONA',
    team2: 'REAL MADRID',
    logo1: '/assets/flags/8daf981a61db7bae41bb2763a944a6b9031f0f9c.png',
    logo2: '/assets/flags/f0bbeb02d81052db1c4dd210b7959961-removebg-preview%201.png',
    date: 'Feb 28',
    time: '13:30',
    odds: { '1': 2.08, draw: 3.2, '2': 3.65 },
  },
  {
    team1: 'VILLAREAL',
    team2: 'LEVANTE',
    logo1: '/assets/flags/83502e2b49396304f32212e75e10d2f6b5047b1c.png',
    logo2: '/assets/flags/c988347b8fc691baf69c6d9971bebce0-removebg-preview%20(1)%201.png',
    date: 'Mar 2',
    time: '16:00',
    odds: { '1': 1.9, draw: 2.56, '2': 5.65 },
  },
  {
    team1: 'VILLAREAL',
    team2: 'LEVANTE',
    logo1: '/assets/flags/6f4baf1eeb3f109ba06048e39062f416-removebg-preview%201.png',
    logo2: '/assets/flags/a96fbcafe1c3adfd2103a47fafca8690-removebg-preview%201.png',
    date: 'Feb 28',
    time: '12:30',
    odds: { '1': 1.9, draw: 2.56, '2': 5.65 },
  },
];

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setLoggedIn(isAuthenticated());
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  function openSignIn() {
    setSignUpOpen(false);
    setSignInOpen(true);
  }

  function openSignUp() {
    setSignInOpen(false);
    setSignUpOpen(true);
  }

  function closeSignIn() {
    setSignInOpen(false);
  }

  function closeSignUp() {
    setSignUpOpen(false);
  }

  function handleLogout() {
    clearToken();
    setLoggedIn(false);
  }

  function handleLoginSuccess() {
    setLoggedIn(true);
    setSignInOpen(false);
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-[#232626] text-white">
      {/* Header */}
      <header className="flex items-center justify-between h-[72px] mx-2.5 mt-2.5 bg-[#292d2e] rounded-[10px] px-4 md:px-[51px]">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="BKX BETS"
            width={63}
            height={54}
            className="object-cover"
            priority
          />
        </Link>
        <div className="flex items-center gap-2.5">
          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-[100px] h-10 items-center justify-center rounded-[10px] bg-[#323435] font-semibold text-base text-white hover:bg-[#3d4041]"
            >
              Log out
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={openSignIn}
                className="flex w-[100px] h-10 items-center justify-center rounded-[10px] font-semibold text-base text-white hover:bg-[#323435]"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={openSignUp}
                className="flex w-[100px] h-10 items-center justify-center rounded-[10px] bg-linear-to-br from-[#148440] to-[#61db6c] font-semibold text-base text-black"
              >
                Sign Up
              </button>
            </>
          )}
          <Image
            src="/assets/languages.svg"
            alt="Language"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </div>
      </header>

      <div className="flex gap-5 mx-2.5 mt-5 pb-8">
        {/* Sidebar */}
        <aside className="w-[311px] shrink-0 flex flex-col items-center gap-2.5 bg-[#292d2e] rounded-[10px] p-4">
          <div className="flex h-11 w-full max-w-[275px] items-center justify-between p-2.5 bg-[#484a4b] rounded-[10px]">
            <span className="font-semibold text-white text-base">Explore</span>
            <span className="text-white/80">
              <SearchIcon />
            </span>
          </div>
          {SIDEBAR_NAV.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex h-11 w-full max-w-[275px] items-center justify-between p-2.5 bg-[#323435] rounded-[10px] hover:bg-[#3d4041]"
            >
              <div className="flex items-center gap-2.5">
                <Image src={item.icon} alt="" width={24} height={24} />
                <span className="font-semibold text-white text-base">
                  {item.label}
                </span>
              </div>
              <Image src="/assets/arrow.svg" alt="" width={20} height={20} />
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Banners row */}
          <div className="flex gap-5 mb-6">
            {/* Left banner - Experience fast payouts */}
            <div className="flex-1 min-w-0 h-[469px] rounded-[10px] overflow-hidden relative bg-linear-to-b from-[#a09595] to-[#555555]">
              <Image
                src="/assets/logo.png"
                alt=""
                width={396}
                height={309}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[396px] h-[309px] object-cover blur-[4.5px] opacity-30"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-6 p-6 w-[375px] bg-[#4d4c4c]/50 rounded-[10px] backdrop-blur-[2px]">
                <p className="text-center text-2xl font-bold text-white leading-normal">
                  Experience fast payouts
                  <br />
                  <span className="text-[#4cc360]">and premium online</span>
                  <br />
                  <span className="font-semibold text-white">betting.</span>
                </p>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    className="h-[34px] px-6 flex items-center justify-center bg-[#292d2e] rounded-[10px] font-semibold text-white text-base"
                  >
                    Start Playing
                  </button>
                  <button
                    type="button"
                    className="h-[34px] px-6 flex items-center justify-center rounded-[10px] border-2 border-[#292d2e] font-semibold text-[#232626] text-base bg-white/20"
                  >
                    View Games
                  </button>
                </div>
              </div>
            </div>

            {/* Right banner - FC Barcelona vs Real Madrid */}
            <div className="flex-1 min-w-0 h-[469px] rounded-[10px] overflow-hidden relative bg-linear-to-b from-[#a09595] to-[#555555]">
              <Image
                src="/assets/small_background.png"
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 w-10 h-10 bg-[#4cc360] rotate-[-51deg]" />
              <Image
                src="/assets/players/71fdf7aa00afb8d1b078a9e43bbacf2b-removebg-preview%201.png"
                alt=""
                width={236}
                height={286}
                className="absolute bottom-8 left-8 object-contain"
              />
              <Image
                src="/assets/players/9f19fd380407337915759b71f05ebcae-removebg-preview%201.png"
                alt=""
                width={195}
                height={295}
                className="absolute bottom-4 left-16 object-contain"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      i === 5 ? 'bg-[#4cc360]' : 'bg-[#d9d9d9]'
                    }`}
                  />
                ))}
              </div>
              <Image
                src="/assets/flags/8daf981a61db7bae41bb2763a944a6b9031f0f9c.png"
                alt=""
                width={49}
                height={50}
                className="absolute top-8 right-1/2 translate-x-8 object-contain"
              />
              <div className="absolute top-12 left-8 flex items-center gap-2">
                <Image
                  src="/assets/flags/8daf981a61db7bae41bb2763a944a6b9031f0f9c.png"
                  alt=""
                  width={65}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-2 text-4xl font-extrabold text-white">
                <span>FC BARCELONA</span>
                <span className="text-[#4cc360]">VS</span>
                <span>REAL MADRID</span>
                <button
                  type="button"
                  className="ml-4 px-4 py-1 rounded-[5px] border border-white text-white text-xs font-semibold"
                >
                  BET NOW
                </button>
              </div>
              <div className="absolute bottom-4 right-8 text-sm font-semibold text-white">
                PREMIER LEAGUE
              </div>
            </div>
          </div>

          {/* Trending Games */}
          <h2 className="font-bold text-white text-base mb-4">Trending Games</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 mb-8">
            {TRENDING_GAMES.map((game, i) => (
              <div
                key={i}
                className="shrink-0 w-[173px] h-[232px] rounded-[10px] overflow-hidden border-2 border-[#4cc360] bg-white relative"
              >
                <Image
                  src={game.image}
                  alt={game.name}
                  width={173}
                  height={232}
                  className="w-full h-full object-cover"
                />
                {game.count != null && (
                  <div className="absolute top-[5px] right-[5px] flex items-center gap-1 px-2 py-1.5 bg-black/20 rounded-[10px] backdrop-blur-sm text-white">
                    <ProfileIcon />
                    <span className="font-semibold text-sm">
                      {game.count}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Live Sports */}
          <h2 className="font-bold text-white text-base mb-4">Live Sports</h2>
          <div className="flex gap-5 overflow-x-auto">
            {LIVE_MATCHES.map((match, i) => (
              <div
                key={i}
                className="shrink-0 w-[359px] h-[200px] bg-[#292d2e] rounded-[10px] p-5 relative"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-bold text-white text-xs">Soccer</span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="font-bold text-white text-xs">
                    Premier League
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/50 mb-4">
                  <span>{match.date}</span>
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                  <span className="text-white">{match.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src={match.logo1}
                      alt={match.team1}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                    <span className="text-white text-xs text-center">
                      {match.team1}
                    </span>
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-[#4cc360] rounded-[5px]">
                      <span className="text-black text-sm font-normal">1</span>
                      <span className="text-[#07622b] text-sm font-normal">
                        {match.odds['1']}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-bold text-white text-xl">0 : 0</span>
                    <span className="text-white/50 text-[11px]">Not started</span>
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-[#4cc360] rounded-[5px]">
                      <span className="text-black text-sm font-normal">draw</span>
                      <span className="text-[#07622b] text-sm font-normal">
                        {match.odds.draw}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src={match.logo2}
                      alt={match.team2}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                    <span className="text-white text-xs text-center">
                      {match.team2}
                    </span>
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-[#4cc360] rounded-[5px]">
                      <span className="text-black text-sm font-normal">2</span>
                      <span className="text-[#07622b] text-sm font-normal">
                        {match.odds['2']}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {signInOpen && (
        <SignInModal
          onClose={closeSignIn}
          onSwitchToSignUp={openSignUp}
          onSuccess={handleLoginSuccess}
        />
      )}
      {signUpOpen && (
        <SignUpModal
          onClose={closeSignUp}
          onSwitchToSignIn={openSignIn}
          onSuccess={() => openSignIn()}
        />
      )}
    </div>
  );
}
