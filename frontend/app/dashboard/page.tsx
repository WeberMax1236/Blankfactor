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
  { label: 'Sports', icon: '/assets/sidebar_images/sports.png' },
  { label: 'Lottery', icon: '/assets/sidebar_images/lottery.png' },
  { label: 'Games', icon: '/assets/sidebar_images/games.png' },
  { label: 'Casino', icon: '/assets/sidebar_images/casino.png' },
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
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return iso;
  }
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
    const timer = requestAnimationFrame(() => setLoggedIn(isAuthenticated()));
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
        <main className="flex-1 min-w-0 order-1 lg:order-2 overflow-x-hidden">
          {loading ? (
            <p className="text-gray-400 py-8">Loading dashboard…</p>
          ) : error ? (
            <div className="flex flex-col gap-4 py-8">
              <p className="text-red-400">{error}</p>
              <Link href="/" className="text-[#4cc360] hover:underline">
                ← Back to home
              </Link>
            </div>
          ) : (
            <div className="w-full p-4 md:p-6 space-y-8 min-w-0">
        <h1 className="text-2xl font-bold bg-linear-to-r from-[#4cc360] via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Dashboard
        </h1>

        {/* Summary cards */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 pl-3 border-l-4 border-emerald-500">Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {summary && (
              <>
                <div className="rounded-xl bg-[#292d2e] border border-sky-500/30 p-4 shadow-lg shadow-sky-500/5">
                  <p className="text-xs text-sky-300/80 uppercase tracking-wider">Total Users</p>
                  <p className="text-xl font-bold text-sky-300 mt-1">{formatMoney(summary.totalUsers)}</p>
                </div>
                <div className="rounded-xl bg-[#292d2e] border border-violet-500/30 p-4 shadow-lg shadow-violet-500/5">
                  <p className="text-xs text-violet-300/80 uppercase tracking-wider">Total Bets</p>
                  <p className="text-xl font-bold text-violet-300 mt-1">{formatMoney(summary.totalBets)}</p>
                </div>
                <div className="rounded-xl bg-[#292d2e] border border-emerald-500/30 p-4 shadow-lg shadow-emerald-500/5">
                  <p className="text-xs text-emerald-300/80 uppercase tracking-wider">Total Deposits</p>
                  <p className="text-xl font-bold text-emerald-300 mt-1">{formatMoney(summary.totalDeposits)}</p>
                </div>
                <div className="rounded-xl bg-[#292d2e] border border-amber-500/30 p-4 shadow-lg shadow-amber-500/5">
                  <p className="text-xs text-amber-300/80 uppercase tracking-wider">Total Withdrawals</p>
                  <p className="text-xl font-bold text-amber-300 mt-1">{formatMoney(summary.totalWithdrawals)}</p>
                </div>
                <div className="rounded-xl bg-[#292d2e] border border-[#4cc360]/40 p-4 shadow-lg shadow-[#4cc360]/10">
                  <p className="text-xs text-[#6ee07a]/90 uppercase tracking-wider">House Profit</p>
                  <p className="text-xl font-bold text-[#4cc360] mt-1">{formatMoney(summary.houseProfit)}</p>
                </div>
                <div className="rounded-xl bg-[#292d2e] border border-cyan-500/30 p-4 shadow-lg shadow-cyan-500/5">
                  <p className="text-xs text-cyan-300/80 uppercase tracking-wider">RTP %</p>
                  <p className="text-xl font-bold text-cyan-300 mt-1">{summary.rtp}%</p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Today stats */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 pl-3 border-l-4 border-sky-500">Today</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {today && (
              <>
                <div className="rounded-xl bg-[#292d2e] border border-emerald-500/25 p-4">
                  <p className="text-xs text-emerald-300/70 uppercase tracking-wider">Deposits</p>
                  <p className="text-lg font-semibold text-emerald-300 mt-1">{formatMoney(today.todayDeposits)}</p>
                </div>
                <div className="rounded-xl bg-[#292d2e] border border-amber-500/25 p-4">
                  <p className="text-xs text-amber-300/70 uppercase tracking-wider">Withdrawals</p>
                  <p className="text-lg font-semibold text-amber-300 mt-1">{formatMoney(today.todayWithdrawals)}</p>
                </div>
                <div className="rounded-xl bg-[#292d2e] border border-violet-500/25 p-4">
                  <p className="text-xs text-violet-300/70 uppercase tracking-wider">Bets</p>
                  <p className="text-lg font-semibold text-violet-300 mt-1">{formatMoney(today.todayBets)}</p>
                </div>
                <div className="rounded-xl bg-[#292d2e] border border-cyan-500/25 p-4">
                  <p className="text-xs text-cyan-300/70 uppercase tracking-wider">Payouts</p>
                  <p className="text-lg font-semibold text-cyan-300 mt-1">{formatMoney(today.todayPayouts)}</p>
                </div>
                <div className="rounded-xl bg-[#292d2e] border border-[#4cc360]/30 p-4">
                  <p className="text-xs text-[#6ee07a]/80 uppercase tracking-wider">Profit</p>
                  <p className="text-lg font-semibold text-[#4cc360] mt-1">{formatMoney(today.todayProfit)}</p>
                </div>
                <div className="rounded-xl bg-[#292d2e] border border-sky-500/25 p-4">
                  <p className="text-xs text-sky-300/70 uppercase tracking-wider">Active Users</p>
                  <p className="text-lg font-semibold text-sky-300 mt-1">{today.activeUsers}</p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Recent transactions */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 pl-3 border-l-4 border-amber-500">Recent Transactions</h2>
          <div className="rounded-xl border border-amber-500/20 overflow-hidden bg-[#292d2e] shadow-lg shadow-amber-500/5">
            {transactions.length === 0 ? (
              <p className="p-6 text-amber-200/70 text-sm">No recent transactions.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-amber-500/20 bg-amber-500/5 text-amber-200/90">
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Balance after</th>
                      <th className="px-4 py-3 font-medium">Currency</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-white/5 hover:bg-amber-500/5">
                        <td className="px-4 py-3 text-white">{tx.wallet?.user?.username ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-300">{tx.type}</td>
                        <td className="px-4 py-3 text-emerald-300">{formatMoney(tx.amount)}</td>
                        <td className="px-4 py-3 text-gray-300">{formatMoney(tx.balanceAfter)}</td>
                        <td className="px-4 py-3 text-gray-300">{tx.wallet?.currency?.symbol ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-400">{formatDate(tx.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Recent bets */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 pl-3 border-l-4 border-violet-500">Recent Bets</h2>
          <div className="rounded-xl border border-violet-500/20 overflow-hidden bg-[#292d2e] shadow-lg shadow-violet-500/5">
            {bets.length === 0 ? (
              <p className="p-6 text-violet-200/70 text-sm">No recent bets.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-violet-500/20 bg-violet-500/5 text-violet-200/90">
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium">Game</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Payout</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bets.map((bet) => (
                      <tr key={bet.id} className="border-b border-white/5 hover:bg-violet-500/5">
                        <td className="px-4 py-3 text-white">{bet.user?.username ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-300">{bet.game?.name ?? '—'}</td>
                        <td className="px-4 py-3 text-amber-300">{formatMoney(bet.amount)}</td>
                        <td className="px-4 py-3 text-emerald-300">{formatMoney(bet.payout)}</td>
                        <td className="px-4 py-3 text-gray-300">{bet.status}</td>
                        <td className="px-4 py-3 text-gray-400">{formatDate(bet.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
