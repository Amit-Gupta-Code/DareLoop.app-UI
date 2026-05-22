/**
 * Build a browser-usable avatar URL from API user fields.
 * Backend may return a full URL (OAuth or Storage::url) or a relative disk path.
 */
function apiOrigin(): string {
  return (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api$/, "");
}

/** In Vite dev, use /storage/... on the app origin so the dev proxy + canvas export stay same-origin. */
function sameOriginStorageInDev(absoluteUrl: string): string {
  if (!import.meta.env.DEV || !absoluteUrl) return absoluteUrl;
  try {
    const u = new URL(absoluteUrl);
    const api = new URL(apiOrigin());
    if (u.origin === api.origin && u.pathname.startsWith("/storage/")) {
      return `${u.pathname}${u.search}`;
    }
  } catch {
    /* ignore */
  }
  return absoluteUrl;
}

export function resolveUserAvatarUrl(avatar?: string | null): string {
  if (avatar == null || typeof avatar !== "string") return "";
  const trimmed = avatar.trim();
  if (!trimmed) return "";

  let absolute: string;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const u = new URL(trimmed);
      // Fix Laravel disk paths leaked into full URLs: /storage/app/public/... → /storage/...
      let pathname = u.pathname;
      if (pathname.startsWith("/storage/app/public/")) {
        pathname = "/storage/" + pathname.slice("/storage/app/public/".length);
      }
      // Same-origin uploads: re-map onto Vite dev proxy / API host so /storage always resolves.
      if (pathname.startsWith("/storage/")) {
        const origin = apiOrigin();
        absolute = `${origin}${pathname}${u.search}`;
      } else {
        absolute = trimmed;
      }
    } catch {
      absolute = trimmed;
    }
  } else {
    const base = apiOrigin();
    let path = trimmed.replace(/^\//, "");
    // Laravel disk path "storage/app/public/..." → public URL "storage/..."
    if (path.startsWith("storage/app/public/")) {
      path = "storage/" + path.slice("storage/app/public/".length);
    }
    // Laravel sometimes returns "storage/avatars/..." — do not prefix /storage again.
    if (path.startsWith("storage/")) {
      absolute = `${base}/${path}`;
    } else {
      absolute = `${base}/storage/${path}`;
    }
  }

  return sameOriginStorageInDev(absolute);
}
