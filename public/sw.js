/*
 * Offline reading for the campaign team (visual-first pass, October 2026).
 *
 * The team opens this document daily, often on mobile data in Kitui County. This worker lets a
 * phone reopen what it has already read when the signal drops:
 *
 *   /_next/static/*        cache first: the filenames are content hashes and never change.
 *   pages                  network first, the cached copy only when offline or when the network
 *                          takes longer than a few seconds. A page names the exact stylesheets and
 *                          scripts of the build that served it, and each deploy removes the
 *                          previous build's files from the site; a cached page from an older
 *                          build therefore loads without its styles and waits on scripts that
 *                          no longer exist. Fetching the page first keeps page and files in step.
 *   /content/*.md,         stale-while-revalidate: the cached copy answers at once and the
 *   /data/*, images        network refreshes it behind, so an update the team merges reaches the
 *                          reader on their next online visit, not never.
 *   everything else        network only (RSC payloads, the passcode check, other origins).
 *
 * Only successful same-origin GET responses are stored, so a passcode refusal (401) is never
 * cached. Nothing is sent anywhere: the cache lives on the reader's device.
 */
// v2 (November 2026): pages became network first. Bumping the version clears every page cached
// under v1, including pages from builds whose files are no longer on the site.
const VERSION = "kitui-2027-v2";
const STATIC = `${VERSION}-static`;
const PAGES = `${VERSION}-pages`;

if (typeof self !== "undefined" && self.location && (self.location.hostname.includes("run.app") || self.location.hostname === "localhost")) {
  self.registration?.unregister();
}

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function cacheable(response) {
  return response && response.ok && response.type === "basic";
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (cacheable(response)) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(event, fallbackUrl) {
  const cache = await caches.open(PAGES);
  const hit = await cache.match(event.request, { ignoreVary: true });
  const refresh = fetch(event.request)
    .then((response) => {
      if (cacheable(response)) cache.put(event.request, response.clone());
      return response;
    })
    .catch(() => null);
  if (hit) {
    event.waitUntil(refresh);
    return hit;
  }
  const response = await refresh;
  if (response) return response;
  const fallback = fallbackUrl ? await cache.match(fallbackUrl, { ignoreVary: true }) : null;
  return fallback || Response.error();
}

/** How long a page waits for the network before falling back to the copy on the device. */
const PAGE_TIMEOUT_MS = 3500;

async function networkFirst(event, fallbackUrl) {
  const cache = await caches.open(PAGES);
  const network = fetch(event.request).then((response) => {
    if (cacheable(response)) cache.put(event.request, response.clone());
    return response;
  });
  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), PAGE_TIMEOUT_MS));
  try {
    const first = await Promise.race([network, timeout]);
    if (first) return first;
  } catch {
    // Offline: fall through to the cached copy.
  }
  const hit = (await cache.match(event.request, { ignoreVary: true })) || (fallbackUrl ? await cache.match(fallbackUrl, { ignoreVary: true }) : null);
  if (hit) return hit;
  try {
    return await network;
  } catch {
    return Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // React Server Component payloads are tied to one build and one navigation; never serve stale.
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(event, "/"));
    return;
  }
  if (
    url.pathname.startsWith("/content/") ||
    url.pathname.startsWith("/data/") ||
    url.pathname.startsWith("/portraits/") ||
    url.pathname.startsWith("/_next/image")
  ) {
    event.respondWith(staleWhileRevalidate(event));
  }
});
