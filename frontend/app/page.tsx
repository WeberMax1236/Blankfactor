'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignInModal } from '@/components/auth/SignInModal';
import { SignUpModal } from '@/components/auth/SignUpModal';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import {
  HeroPromoBanner,
  HeroCarousel,
  HeroBonusSection,
  TrendingGamesSection,
  LiveSportsSection,
} from '@/components/home';
import { clearToken, isAuthenticated } from '@/lib/auth';

const SIDEBAR_NAV = [
  { label: 'Sports', icon: '/assets/sidebar_images/sports.png' },
  { label: 'Lottery', icon: '/assets/sidebar_images/lottery.png' },
  { label: 'Games', icon: '/assets/sidebar_images/games.png' },
  { label: 'Casino', icon: '/assets/sidebar_images/casino.png' },
  { label: 'Live Support', icon: '/assets/sidebar_images/live_support.png', hideArrow: true },
];

const TRENDING_GAMES = [
  { name: 'PLINKO', image: '/assets/cards/plinko.png', count: 60 },
  { name: 'DICE GAME', image: '/assets/cards/dice.png', count: 23 },
  { name: 'POKER', image: '/assets/cards/poker.png', count: 16 },
  { name: 'CRASH', image: '/assets/cards/crash.png', count: 42 },
  { name: 'MINES', image: '/assets/cards/mines.png', count: 38 },
  { name: 'Aviator', image: '/assets/cards/aviator-alt.png', comingSoon: true},
];

const LIVE_MATCHES = [
  {
    team1: 'FC BARCELONA',
    team2: 'REAL MADRID',
    logo1: '/assets/flags/FC_Barcelona.png',
    logo2: '/assets/flags/Real_Madrid.png',
    date: 'Feb 28',
    time: '13:30',
    odds: { '1': 2.08, draw: 3.2, '2': 3.65 },
  },
  {
    team1: 'VILLAREAL',
    team2: 'LEVANTE',
    logo1: '/assets/flags/Villarreal.png',
    logo2: '/assets/flags/Levante.png',
    date: 'Mar 2',
    time: '16:00',
    odds: { '1': 1.9, draw: 2.56, '2': 5.65 },
  },
  {
    team1: 'VILLAREAL',
    team2: 'LEVANTE',
    logo1: '/assets/flags/Villarreal.png',
    logo2: '/assets/flags/Levante.png',
    date: 'Feb 28',
    time: '12:30',
    odds: { '1': 1.9, draw: 2.56, '2': 5.65 },
  },
];

const HERO_SLIDES = [
  { team1: 'FC BARCELONA', team2: 'REAL MADRID', logo1: '/assets/flags/FC_Barcelona.png', logo2: '/assets/flags/Real_Madrid.png', league: 'PREMIER LEAGUE', player1: '/assets/players/Lamine_Yamal.png', player2: '/assets/players/Vinicius_Junior.png', alt1: 'Lamine Yamal', alt2: 'Vinícius Júnior' },
  { team1: 'VILLAREAL', team2: 'LEVANTE U.D      ', logo1: '/assets/flags/Villarreal.png', logo2: '/assets/flags/Levante.png', league: 'LA LIGA', player1: '/assets/players/gerard-moreno.png', player2: '/assets/players/roger-marti.png', alt1: 'Gerard Moreno', alt2: 'Roger Martí' },
  { team1: 'BULLS', team2: 'LAKERS ', logo1: '/assets/flags/chicago-bulls.png', logo2: '/assets/flags/toronto-raptors.png', league: 'NBA', player1: '/assets/players/michael-jordan.png', player2: '/assets/players/scottie-barnes.png', alt1: 'Michael Jordan', alt2: 'Scottie Barnes', background: '/assets/featured-image.png' },
  { team1: 'RAPTORS', team2: 'TIMBERWOLVES ', logo1: '/assets/flags/detroit-lions.png', logo2: '/assets/flags/buffalo-bills.png', league: 'NFL', player1: '/assets/players/amon-ra-st-brown.png', player2: '/assets/players/josh-allen.png', alt1: 'Amon-Ra St. Brown', alt2: 'Josh Allen' },
  { team1: 'BUFALLO BILLS', team2: 'DETROIT LIONS', logo1: '/assets/flags/los-angeles-lakers.png', logo2: '/assets/flags/minnesota-timberwolves.png', league: 'NBA', player1: '/assets/players/lebron-james.png', player2: '/assets/players/anthony-edwards.png', alt1: 'LeBron James', alt2: 'Anthony Edwards', background: '/assets/featured-image.png' },
];

export default function Home() {
  const router = useRouter();
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [pendingSignInCredentials, setPendingSignInCredentials] = useState<{ email: string; password: string } | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [liveSportsShowAll, setLiveSportsShowAll] = useState(true);
  const [liveSportsPage, setLiveSportsPage] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const LIVE_SPORTS_PER_PAGE = 3;
  const liveSportsTotalPages = Math.max(1, Math.ceil(LIVE_MATCHES.length / LIVE_SPORTS_PER_PAGE));
  const liveSportsMatches = liveSportsShowAll
    ? LIVE_MATCHES
    : LIVE_MATCHES.slice(
        liveSportsPage * LIVE_SPORTS_PER_PAGE,
        (liveSportsPage + 1) * LIVE_SPORTS_PER_PAGE
      );

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setLoggedIn(isAuthenticated());
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setHeroSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
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
    setPendingSignInCredentials(null);
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#232626] text-white">
      <Header
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        loggedIn={loggedIn}
        onSignIn={openSignIn}
        onSignUp={openSignUp}
        onLogout={handleLogout}
        balance="$0.00"
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 mx-2 sm:mx-3 md:mx-4 lg:mx-5 mt-4 lg:mt-5 pb-6 lg:pb-8 min-w-0">
        {/* Sidebar – drawer on mobile (no layout space when closed), inline on lg+ */}
        <div className={`order-2 lg:order-1 ${!sidebarOpen ? 'w-0 overflow-hidden lg:w-auto lg:overflow-visible' : ''}`}>
          <Sidebar
            items={SIDEBAR_NAV}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            loggedIn={loggedIn}
            onSignIn={openSignIn}
            onSignUp={openSignUp}
            onLogout={handleLogout}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 order-1 lg:order-2 overflow-x-hidden">
          {/* Banners row: bonus section when logged in, hero + carousel when not */}
          <div className="mb-6 lg:mb-8 min-w-0">
            {loggedIn ? (
              <HeroBonusSection />
            ) : (
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-w-0">
                <HeroPromoBanner />
                <HeroCarousel
                  slides={HERO_SLIDES}
                  currentIndex={heroSlide}
                  onSlideChange={setHeroSlide}
                />
              </div>
            )}
          </div>

          <TrendingGamesSection games={TRENDING_GAMES} />

          <LiveSportsSection
            matches={liveSportsMatches}
            showAll={liveSportsShowAll}
            onShowAllChange={setLiveSportsShowAll}
            currentPage={liveSportsPage}
            totalPages={liveSportsTotalPages}
            onPrevPage={() => setLiveSportsPage((p) => Math.max(0, p - 1))}
            onNextPage={() =>
              setLiveSportsPage((p) => Math.min(liveSportsTotalPages - 1, p + 1))
            }
          />
        </main>
      </div>

      {signInOpen && (
        <SignInModal
          onClose={closeSignIn}
          onSwitchToSignUp={openSignUp}
          onSuccess={handleLoginSuccess}
          initialEmail={pendingSignInCredentials?.email ?? ''}
          initialPassword={pendingSignInCredentials?.password ?? ''}
        />
      )}
      {signUpOpen && (
        <SignUpModal
          onClose={closeSignUp}
          onSwitchToSignIn={openSignIn}
          onSuccess={(creds) => {
            if (creds) setPendingSignInCredentials(creds);
            openSignIn();
          }}
        />
      )}
    </div>
  );
}
