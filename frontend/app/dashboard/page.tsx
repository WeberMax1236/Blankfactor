'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  dashboard,
  type DashboardSummary,
  type DashboardToday,
  type RecentTransaction,
  type RecentBet,
} from '@/lib/api';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { SignInModal } from '@/components/auth/SignInModal';
import { SignUpModal } from '@/components/auth/SignUpModal';
import { clearToken, isAuthenticated } from '@/lib/auth';

const SIDEBAR_NAV = [
  {
    label: 'Sports',
    icon: '/assets/sidebar_images/sports.png',
    children: [
      { label: 'Soccer', icon: '/assets/sidebar_subcategories/sports/Soccer.svg' },
      { label: 'Basketball', icon: '/assets/sidebar_subcategories/sports/Basketball.svg' },
      { label: 'eSoccer', icon: '/assets/sidebar_subcategories/sports/eSoccer.svg' },
      { label: 'Tennis', icon: '/assets/sidebar_subcategories/sports/Tennis.svg' },
      { label: 'Ice Hokey', icon: '/assets/sidebar_subcategories/sports/Ice Hokey.svg' },
      { label: 'Handball', icon: '/assets/sidebar_subcategories/sports/Handball.svg' },
      { label: 'American Football', icon: '/assets/sidebar_subcategories/sports/American Football.svg' },
      { label: 'MMA', icon: '/assets/sidebar_subcategories/sports/MMA.svg' },
    ],
  },
  {
    label: 'Lottery',
    icon: '/assets/sidebar_images/lottery.png',
    children: [{ label: 'My Bets', icon: '/assets/sidebar_subcategories/Lottery/My Bets.svg' }],
  },
  {
    label: 'Games',
    icon: '/assets/sidebar_images/games.png',
    children: [
      { label: 'Plinko', icon: '/assets/sidebar_subcategories/Games/Plinko.svg' },
      { label: 'Dice Game', icon: '/assets/sidebar_subcategories/Games/Dice Game.svg' },
      { label: 'Poker', icon: '/assets/sidebar_subcategories/Games/Poker.svg' },
      { label: 'Limbo', icon: '/assets/sidebar_subcategories/Games/Limbo.svg' },
      { label: 'Keno', icon: '/assets/sidebar_subcategories/Games/Keno.svg' },
    ],
  },
  {
    label: 'Casino',
    icon: '/assets/sidebar_images/casino.png',
    children: [
      { label: 'Favorites', icon: '/assets/sidebar_subcategories/Casino/Favorites.svg' },
      { label: 'Recent', icon: '/assets/sidebar_subcategories/Casino/Recent.svg' },
      { label: 'Hot Games', icon: '/assets/sidebar_subcategories/Casino/Hot Games.svg' },
      { label: 'Slots', icon: '/assets/sidebar_subcategories/Casino/Slots.svg' },
      { label: 'Live Casino', icon: '/assets/sidebar_subcategories/Casino/Live Casino.svg' },
      { label: 'New Releases', icon: '/assets/sidebar_subcategories/Casino/New Releases.svg' },
    ],
  },
  { label: 'Live Support', icon: '/assets/sidebar_images/live_support.png', hideArrow: true },
];

function formatMoney(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(d);
  } catch {
    return iso;
  }
}

// Mock daily revenue for chart (Mar 22–28). Replace with API when available.
const DAILY_REVENUE_DATA = [12, 18, 22, 28, 32, 36, 38];
const DAILY_REVENUE_LABELS = ['Mar 22', 'Mar 23', 'Mar 24', 'Mar 25', 'Mar 26', 'Mar 27', 'Mar 28'];

// Bet distribution donut (percent). Replace with API when available.
const BET_DISTRIBUTION = [
  { label: 'Sports Bet', pct: 30, color: '#ef4444' },
  { label: 'Plinko', pct: 27, color: '#eab308' },
  { label: 'Dice Game', pct: 18, color: '#38bdf8' },
  { label: 'Keno', pct: 15, color: '#4ade80' },
  { label: 'Poker', pct: 7, color: '#fb923c' },
];

function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-[10px] border border-[#4CC360]/40 bg-[#292d2e] p-4 sm:p-5">
      <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{value}</p>
      <p className="text-sm text-[#4CC360] mt-1 flex items-center gap-1">
        <span className="inline-block">↑</span>
        <span>{sub}</span>
      </p>
      <p className="text-xs text-white/60 uppercase tracking-wider mt-1">{title}</p>
    </div>
  );
}

function DailyRevenueChart() {
  const dataMax = Math.max(...DAILY_REVENUE_DATA, 1);
  const yAxisMax = Math.ceil(dataMax / 10) * 10 || 40; // round up to nearest 10 for clean axis
  const w = 320;
  const h = 180;
  const pad = { t: 16, r: 12, b: 28, l: 40 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const lastIndex = Math.max(1, DAILY_REVENUE_DATA.length - 1);
  const points = DAILY_REVENUE_DATA.map((v, i) => {
    const x = pad.l + (i / lastIndex) * innerW;
    const y = pad.t + innerH - (v / yAxisMax) * innerH;
    return { x, y };
  });
  const linePath = points.length ? `M${points.map((p) => `${p.x},${p.y}`).join(' L')}` : '';
  const areaPath =
    points.length
      ? `M${pad.l},${pad.t + innerH} L${points.map((p) => `${p.x},${p.y}`).join(' L')} L${pad.l + innerW},${pad.t + innerH} Z`
      : '';

  return (
    <div className="rounded-[10px] border border-[#4CC360]/40 bg-[#292d2e] p-4">
      <h3 className="text-base font-semibold text-white mb-4">Daily Revenue</h3>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full min-w-[280px] h-[180px]"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Daily revenue line chart"
        >
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#4CC360" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4CC360" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#revenue-fill)" />
          <path d={linePath} fill="none" stroke="#4CC360" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#4CC360" />
          ))}
          {/* Y-axis labels: 0 and steps up to yAxisMax */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const val = Math.round(frac * yAxisMax);
            const y = pad.t + innerH - frac * innerH;
            return (
              <text
                key={val}
                x={pad.l - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.6)"
                style={{ fontSize: 10 }}
              >
                ${val}k
              </text>
            );
          })}
          {DAILY_REVENUE_LABELS.map((l, i) => (
            <text
              key={l}
              x={pad.l + (i / Math.max(1, DAILY_REVENUE_LABELS.length - 1)) * innerW}
              y={h - 6}
              textAnchor="middle"
              fill="rgba(255,255,255,0.6)"
              style={{ fontSize: 10 }}
            >
              {l}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

function BetDistributionChart() {
  const total = BET_DISTRIBUTION.reduce((s, { pct }) => s + pct, 0);
  const normalized = total > 0 ? BET_DISTRIBUTION.map((d) => ({ ...d, pct: Math.round((d.pct / total) * 100) })) : BET_DISTRIBUTION;
  let acc = 0;
  const segments = normalized.map(({ pct, color }) => {
    const start = (acc / 100) * 360;
    acc += pct;
    return { start, color, pct };
  });
  const r = 52;
  const cx = 70;
  const cy = 70;
  const stroke = 12;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="rounded-[10px] border border-[#4CC360]/40 bg-[#292d2e] p-4">
      <h3 className="text-base font-semibold text-white mb-4">Bet Distribution</h3>
      <div className="flex flex-wrap items-center gap-6">
        <svg viewBox="0 0 140 140" className="w-full max-w-[140px] h-[140px] shrink-0" role="img" aria-label="Bet distribution by category">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e2223" strokeWidth={stroke} />
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${(s.pct / 100) * circumference} ${circumference}`}
              strokeDashoffset={-(s.start / 360) * circumference}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          ))}
        </svg>
        <ul className="flex flex-col gap-2 text-sm min-w-0">
          {normalized.map(({ label, pct, color }) => (
            <li key={label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden />
              <span className="text-white/90 truncate">{label}</span>
              <span className="text-white/70 tabular-nums shrink-0">{pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [today, setToday] = useState<DashboardToday | null>(null);
  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
  const [bets, setBets] = useState<RecentBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [pendingSignInCredentials, setPendingSignInCredentials] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    const t = requestAnimationFrame(() => setLoggedIn(isAuthenticated()));
    return () => cancelAnimationFrame(t);
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
  }

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      dashboard.getSummary(),
      dashboard.getTodayStats(),
      dashboard.getRecentTransactions(),
      dashboard.getRecentBets(),
    ])
      .then(([s, t, tx, b]) => {
        if (cancelled) return;
        setSummary(s);
        setToday(t);
        setTransactions(Array.isArray(tx) ? tx : []);
        setBets(Array.isArray(b) ? b : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalBalance = summary ? summary.totalDeposits - summary.totalWithdrawals : 0;
  const changePct = summary && summary.totalDeposits > 0
    ? ((summary.houseProfit / summary.totalDeposits) * 100).toFixed(1)
    : '0';
  const activeUsers = today?.activeUsers ?? 0;
  const totalBetsToday = today?.todayBets ?? summary?.totalBets ?? 0;
  const pendingWithdrawals = today?.todayWithdrawals > 0 ? Math.round(today.todayWithdrawals / 100) : 0;

  const layout = (
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
        <div className={`order-2 lg:order-1 shrink-0 ${sidebarOpen ? 'w-0 lg:w-[311px]' : 'w-[72px] lg:w-[72px]'}`}>
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
        <main className="flex-1 min-w-0 order-1 lg:order-2 overflow-x-hidden">
          {loading ? (
            <p className="text-white/60 py-8">Loading dashboard…</p>
          ) : error ? (
            <div className="flex flex-col gap-4 py-8">
              <p className="text-red-400">{error}</p>
              <Link href="/" className="text-[#4CC360] hover:underline">
                ← Back to home
              </Link>
            </div>
          ) : (
            <div className="w-full p-4 md:p-6 space-y-6 min-w-0">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>

              {/* Top row – 4 KPI cards */}
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                  title="Total Balance"
                  value={`$${formatMoney(totalBalance)}`}
                  sub="+5.2%"
                />
                <StatCard
                  title="Active Users"
                  value={activeUsers.toString() + ' online now'}
                  sub="+5,346"
                />
                <StatCard
                  title="Total Bets Today"
                  value={formatMoney(totalBetsToday)}
                  sub="+5,346"
                />
                <StatCard
                  title="Pending Withdrawals"
                  value={pendingWithdrawals.toString()}
                  sub="+5,346"
                />
              </section>

              {/* Middle row – Daily Revenue + Bet Distribution */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DailyRevenueChart />
                <BetDistributionChart />
              </section>

              {/* Bottom row – Recent Users + Latest Bets */}
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="rounded-[10px] border border-[#4CC360]/40 bg-[#292d2e] overflow-hidden">
                  <h3 className="text-base font-semibold text-white px-4 py-3 border-b border-white/10">Recent Users</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-white/70">
                          <th className="px-4 py-3 font-medium">ID</th>
                          <th className="px-4 py-3 font-medium">User</th>
                          <th className="px-4 py-3 font-medium">Balance</th>
                          <th className="px-4 py-3 font-medium">Last Activity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-white/50 text-center">
                              No recent activity
                            </td>
                          </tr>
                        ) : (
                          transactions.slice(0, 8).map((tx) => (
                            <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                              <td className="px-4 py-3 text-white/90 font-mono text-xs">{tx.id.slice(0, 8)}</td>
                              <td className="px-4 py-3 text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#3A4142] flex items-center justify-center text-xs text-[#4CC360] font-semibold">
                                  {(tx.wallet?.user?.username ?? '?').slice(0, 1).toUpperCase()}
                                </span>
                                {tx.wallet?.user?.username ?? '—'}
                              </td>
                              <td className="px-4 py-3 text-white/90">${formatMoney(tx.balanceAfter)}</td>
                              <td className="px-4 py-3 text-white/70">{tx.type}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-[10px] border border-[#4CC360]/40 bg-[#292d2e] overflow-hidden">
                  <h3 className="text-base font-semibold text-white px-4 py-3 border-b border-white/10">Latest Bets</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-white/70">
                          <th className="px-4 py-3 font-medium">Bet ID</th>
                          <th className="px-4 py-3 font-medium">User</th>
                          <th className="px-4 py-3 font-medium">Amount</th>
                          <th className="px-4 py-3 font-medium">Multiplier</th>
                          <th className="px-4 py-3 font-medium">Result</th>
                          <th className="px-4 py-3 font-medium">Profit/Loss</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bets.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-6 text-white/50 text-center">
                              No recent bets
                            </td>
                          </tr>
                        ) : (
                          bets.slice(0, 8).map((bet) => {
                            const multiplier = bet.amount > 0 ? (bet.payout / bet.amount).toFixed(2) : '0';
                            const profit = bet.payout - bet.amount;
                            const isWin = profit >= 0;
                            const winStatus = (bet.status || '').toLowerCase().includes('win') || isWin;
                            return (
                              <tr key={bet.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="px-4 py-3 text-white/90 font-mono text-xs">{bet.id.slice(0, 8)}</td>
                                <td className="px-4 py-3 text-white flex items-center gap-2">
                                  <span className="w-8 h-8 rounded-full bg-[#3A4142] flex items-center justify-center text-xs text-[#4CC360] font-semibold">
                                    {(bet.user?.username ?? '?').slice(0, 1).toUpperCase()}
                                  </span>
                                  {bet.user?.username ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-white/90">${formatMoney(bet.amount)}</td>
                                <td className="px-4 py-3 text-white/90">×{multiplier}</td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                                      winStatus ? 'bg-[#4CC360]/20 text-[#4CC360]' : 'bg-red-500/20 text-red-400'
                                    }`}
                                  >
                                    {winStatus ? 'WIN' : 'LOSS'}
                                  </span>
                                </td>
                                <td className={`px-4 py-3 font-medium tabular-nums ${isWin ? 'text-[#4CC360]' : 'text-red-400'}`}>
                                  {isWin ? '+' : ''}${formatMoney(profit)}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );

  return (
    <>
      {layout}
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
    </>
  );
}
