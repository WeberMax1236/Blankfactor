// In the browser, always call same-origin /api so Next.js can proxy to the backend (avoids CORS when backend has no CORS headers).
// For server-side or if you later point directly at the backend, set NEXT_PUBLIC_API_URL (e.g. https://api.example.com/api).
const API_BASE =
  typeof window !== 'undefined'
    ? '/api'
    : (process.env.NEXT_PUBLIC_API_URL ??
        (process.env.API_BACKEND_URL
          ? `${process.env.API_BACKEND_URL}/api`
          : 'http://localhost:3000/api'));

type RequestOptions = Omit<RequestInit, 'body'> & { body?: object };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, ...rest } = options;
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(rest.headers as Record<string, string>),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const raw = (data as { message?: string | string[] }).message;
    const message =
      Array.isArray(raw) ? raw.join(', ') : typeof raw === 'string' ? raw : null;
    const statusText = res.statusText || 'Request failed';
    const finalMessage = message || statusText;
    const devMessage =
      typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
        ? `${finalMessage} (HTTP ${res.status})`
        : finalMessage;
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Use console.warn so Next.js dev overlay doesn't show a red "Console Error" for expected API failures
      console.warn(
        `[API] Request failed: ${devMessage}`,
        `\n  ${rest.method ?? 'GET'} ${url}`,
        `\n  Status: ${res.status} ${res.statusText}`,
        data && Object.keys(data).length > 0 ? data : undefined,
      );
    }
    throw new Error(devMessage);
  }

  return data as T;
}

export const auth = {
  register: (data: { email: string; username: string; password: string }) =>
    request<{ message: string; userId: string }>('/auth/register', {
      method: 'POST',
      body: data,
    }),

  login: (data: { email: string; password: string }) =>
    request<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: data,
    }),

  sendOtp: (phone: string) =>
    request<{ message: string }>('/auth/send-otp', {
      method: 'POST',
      body: { phone },
    }),

  verifyOtp: (phone: string, code: string, currencyId: string) =>
    request<{ access_token: string }>('/auth/verify-otp', {
      method: 'POST',
      body: { phone, code, currencyId },
    }),

  /** Requires backend POST /auth/google with body { googleUser: { id, email }, currencyId } */
  googleLogin: (googleUser: { id: string; email: string }, currencyId: string) =>
    request<{ access_token: string }>('/auth/google', {
      method: 'POST',
      body: { googleUser, currencyId },
    }),
};

/** Default currency for OTP and social sign-up (backend creates wallet with this). */
export const DEFAULT_CURRENCY_ID = '1';

// --- Dashboard API (GET /api/dashboard/...) ---

export interface DashboardSummary {
  totalUsers: number;
  totalBets: number;
  totalDeposits: number;
  totalWithdrawals: number;
  houseProfit: number;
  rtp: number;
}

export interface DashboardToday {
  todayDeposits: number;
  todayWithdrawals: number;
  todayBets: number;
  todayPayouts: number;
  todayProfit: number;
  activeUsers: number;
}

export interface RecentTransaction {
  id: string;
  amount: number;
  balanceAfter: number;
  type: string;
  createdAt: string;
  wallet: {
    user: { username: string };
    currency: { symbol: string; name: string };
  };
}

export interface RecentBet {
  id: string;
  amount: number;
  payout: number;
  status: string;
  createdAt: string;
  user: { username: string };
  game: { name: string };
}

export const dashboard = {
  getSummary: () => request<DashboardSummary>('/dashboard/summary'),
  getTodayStats: () => request<DashboardToday>('/dashboard/today'),
  getRecentTransactions: () => request<RecentTransaction[]>('/dashboard/recent-transactions'),
  getRecentBets: () => request<RecentBet[]>('/dashboard/recent-bets'),
};
