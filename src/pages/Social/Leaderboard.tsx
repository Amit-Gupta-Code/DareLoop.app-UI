import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/src/seo/SEOHead";
import {
  getLeaderboard,
  LeaderboardChallengeEntry,
  LeaderboardCreatorEntry,
} from "@/src/services/socialService";

export default function Leaderboard() {
  const [scope, setScope] = useState<"challenges" | "creators">("challenges");
  const [items, setItems] = useState<(LeaderboardChallengeEntry | LeaderboardCreatorEntry)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getLeaderboard(scope)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load leaderboard.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [scope]);

  return (
    <>
      <SEOHead
        title="Leaderboard"
        description="Top DareLoop challenges and creators by growth and depth."
        canonical="/leaderboard"
      />
      <div className="max-w-3xl mx-auto pt-28 pb-16 px-4 md:px-8 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-text-main">Leaderboard</h1>
          <p className="text-text-muted text-sm mt-1">
            Ranked by real participation — not vanity metrics.
          </p>
        </div>

        <div className="flex gap-2">
          {(["challenges", "creators"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScope(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize ${
                scope === s
                  ? "bg-primary text-white"
                  : "bg-surface border border-border-sleek text-text-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading && <p className="text-text-muted">Loading…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="text-text-muted">No rankings yet.</p>
        )}

        <ul className="space-y-3">
          {items.map((item) => {
            if (scope === "challenges") {
              const c = item as LeaderboardChallengeEntry;
              return (
                <li key={`${c.rank}-${c.challenge_id}`} className="card-sleek">
                  <Link
                    to={c.root_code ? `/c/${c.root_code}` : "/explore"}
                    className="flex items-center gap-4"
                  >
                    <span className="w-10 h-10 rounded-full bg-accent/15 text-accent font-black flex items-center justify-center">
                      #{c.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-text-main truncate">{c.title}</div>
                      <div className="text-xs text-text-muted">
                        {c.participant_count} participants · depth {c.max_depth}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            }
            const u = item as LeaderboardCreatorEntry;
            return (
              <li key={`${u.rank}-${u.user_id}`} className="card-sleek">
                <Link to={`/users/${u.user_id}`} className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-accent/15 text-accent font-black flex items-center justify-center">
                    #{u.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-text-main truncate">
                      {u.name || u.handle || "Creator"}
                    </div>
                    <div className="text-xs text-text-muted">
                      {u.challenges_created} challenges created
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
