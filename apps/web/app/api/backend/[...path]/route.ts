const BACKEND_URL = process.env.SENTINEL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

async function proxyRequest(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const targetUrl = new URL(path.join("/"), withTrailingSlash(BACKEND_URL));
  targetUrl.search = new URL(request.url).search;

  const forwardedHeaders = new Headers({
    "Content-Type": request.headers.get("Content-Type") ?? "application/json",
    "X-Request-Id": request.headers.get("X-Request-Id") ?? crypto.randomUUID()
  });
  forwardHeader(request.headers, forwardedHeaders, "Cookie");
  forwardHeader(request.headers, forwardedHeaders, "Idempotency-Key");

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: forwardedHeaders,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
    cache: "no-store"
  });

  const headers = new Headers({
    "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    "Cache-Control": "no-store"
  });
  const setCookie = response.headers.get("Set-Cookie");
  if (setCookie) headers.set("Set-Cookie", setCookie);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function forwardHeader(source: Headers, target: Headers, name: string) {
  const value = source.get(name);
  if (value) target.set(name, value);
}

function withTrailingSlash(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}
