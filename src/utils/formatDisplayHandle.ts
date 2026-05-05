/** Public display: always a single leading @ (creator-style). */
export function formatDisplayHandle(handle?: string | null): string {
  const h = (handle ?? "").trim();
  if (!h) return "";
  const core = h.replace(/^@+/, "").trim();
  return core ? `@${core}` : "";
}
