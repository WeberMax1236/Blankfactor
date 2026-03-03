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
  const res = await fetch(`${API_BASE}${path}`, {
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
    throw new Error(message || res.statusText || 'Request failed');
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

  verifyOtp: (phone: string, currencyId: string) =>
    request<{ access_token: string }>('/auth/verify-otp', {
      method: 'POST',
      body: { phone, currencyId },
    }),
};
