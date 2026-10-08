import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyToBackend(request: Request, context: RouteContext) {
  const configuredBaseUrl = process.env.BACKEND_API_URL?.trim();
  const baseUrl = configuredBaseUrl || (
    process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000/api" : ""
  );

  if (!baseUrl) {
    return NextResponse.json(
      { detail: "Backend is not configured. Set BACKEND_API_URL to the deployed API base URL." },
      { status: 503 }
    );
  }

  try {
    const { path } = await context.params;
    const incomingUrl = new URL(request.url);
    const backendUrl = new URL(
      `${path.map(encodeURIComponent).join("/")}${incomingUrl.search}`,
      `${baseUrl.replace(/\/+$/, "")}/`
    );
    const headers = new Headers();

    for (const headerName of ["accept", "authorization", "content-type"]) {
      const value = request.headers.get(headerName);
      if (value) headers.set(headerName, value);
    }

    const method = request.method.toUpperCase();
    const body = method === "GET" || method === "HEAD"
      ? undefined
      : await request.arrayBuffer();
    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body: body?.byteLength ? body : undefined,
      cache: "no-store",
    });
    const responseHeaders = new Headers();

    for (const headerName of ["content-type", "content-disposition", "cache-control"]) {
      const value = backendResponse.headers.get(headerName);
      if (value) responseHeaders.set(headerName, value);
    }

    const responseBody = method === "HEAD" ? null : await backendResponse.arrayBuffer();
    return new Response(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      { detail: "The backend service could not be reached." },
      { status: 502 }
    );
  }
}

export const GET = proxyToBackend;
export const POST = proxyToBackend;
export const PUT = proxyToBackend;
export const PATCH = proxyToBackend;
export const DELETE = proxyToBackend;