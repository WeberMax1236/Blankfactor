import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API requests to the backend so the browser only talks to the same origin.
 * Browser calls: http://localhost:3001/api/... → this route forwards to the backend.
 * Backend must run on port 3000 (or set API_BACKEND_URL in .env.local).
 */
const DEFAULT_BACKEND = 'http://localhost:3000';
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
    res = await fetch(fullUrl, {
      method,
      headers: headers.toString() ? headers : undefined,
      body,
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[API proxy] Backend fetch failed. Is it running on', baseUrl, err);
    }
    return new NextResponse(
      JSON.stringify({
        message:
          'Backend unreachable. Ensure the backend is running on ' +
          baseUrl +
          ' and restart the frontend.',
      }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const resHeaders = new Headers();
  const contentType = res.headers.get('content-type');
  if (contentType) resHeaders.set('content-type', contentType);
  if (process.env.NODE_ENV === 'development') {
    resHeaders.set('X-Backend-URL', fullUrl);
  }

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    statusText: res.statusText,
    headers: resHeaders,
  });
}
