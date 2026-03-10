import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy: browser (3001) /api/* → backend http://127.0.0.1:3000/api/*
 * The browser only sees localhost:3001; this route forwards to port 3000.
 * Use 127.0.0.1 so the server always reaches the backend on the same machine.
 * Override with API_BACKEND_URL in .env.local if needed.
 */
const DEFAULT_BACKEND = 'http://127.0.0.1:3000';
const BACKEND_URL = (process.env.API_BACKEND_URL?.trim() || DEFAULT_BACKEND).replace(/\/$/, '');

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxy('GET', context.params);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxy('POST', context.params, request);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxy('PUT', context.params, request);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxy('PATCH', context.params, request);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxy('DELETE', context.params, request);
}

async function proxy(
  method: string,
  paramsPromise: Promise<{ path: string[] }>,
  request?: NextRequest
) {
  const { path } = await paramsPromise;
  const pathStr = path.join('/');
  // Never use frontend port (3001) for backend; backend runs on 3000
  const baseUrl =
    BACKEND_URL.includes(':3001') ? DEFAULT_BACKEND : BACKEND_URL;
  const url = `${baseUrl}/api/${pathStr}`;
  const search = request?.url ? new URL(request.url).search : '';
  const fullUrl = search ? `${url}${search}` : url;

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[API proxy] ${method} /api/${pathStr} → ${fullUrl}`);
  }

  const headers = new Headers();
  request?.headers.forEach((value, key) => {
    if (
      key.toLowerCase() === 'content-type' ||
      key.toLowerCase() === 'authorization'
    ) {
      headers.set(key, value);
    }
  });

  let body: string | undefined;
  if (request && method !== 'GET') {
    try {
      body = await request.text();
    } catch {
      // no body
    }
  }

  let res: Response;
  try {
    const fetchHeaders: Record<string, string> = {};
    headers.forEach((value, key) => {
      fetchHeaders[key] = value;
    });
    if (method !== 'GET' && body && !fetchHeaders['content-type']) {
      fetchHeaders['content-type'] = 'application/json';
    }
    res = await fetch(fullUrl, {
      method,
      headers: Object.keys(fetchHeaders).length ? fetchHeaders : undefined,
      body: body ?? undefined,
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[API proxy] Backend fetch failed. Is it running on', fullUrl, err);
    }
    return new NextResponse(
      JSON.stringify({
        message:
          'Backend unreachable. Ensure the backend is running on ' +
          DEFAULT_BACKEND +
          ' and restart the frontend.',
      }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const data = await res.text();
  if (process.env.NODE_ENV === 'development' && !res.ok) {
    // eslint-disable-next-line no-console
    console.error('[API proxy] Backend returned error:', res.status, res.statusText, data.slice(0, 500));
  }

  const resHeaders = new Headers();
  const contentType = res.headers.get('content-type');
  if (contentType) resHeaders.set('content-type', contentType);
  if (process.env.NODE_ENV === 'development') {
    resHeaders.set('X-Backend-URL', fullUrl);
    resHeaders.set('X-Backend-Status', String(res.status));
  }

  return new NextResponse(data, {
    status: res.status,
    statusText: res.statusText,
    headers: resHeaders,
  });
}
