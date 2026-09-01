import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SEOHead } from "@/src/seo/SEOHead";
import { useAuthStore } from "@/src/store/authStore";
import {
  followUser,
  getPublicUser,
  PublicUser,
  unfollowUser,
} from "@/src/services/socialService";
import { resolveUserAvatarUrl } from "@/src/utils/resolveUserAvatarUrl";

export default function PublicUserProfile() {
  const { userId } = useParams();
  const id = Number(userId);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    if (!Number.isFinite(id) || id <= 0) {
      setError("Invalid user.");
      setLoading(false);
      return;
    }
    setLoading(true);
    getPublicUser(id)
      .then(setUser)
      .catch(() => setError("Could not load profile. Sign in may be required."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleFollow = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/users/${id}` } } });
      return;
    }
    if (!user || user.is_self) return;
    setBusy(true);
    try {
      if (user.is_following) await unfollowUser(id);
      else await followUser(id);
      load();
    } catch {
      setError("Follow action failed.");
    } finally {
      setBusy(false);
    }
  };

  const avatar =
    resolveUserAvatarUrl(user?.profile_pic || undefined) || user?.profile_pic || "";

  return (
    <>
      <SEOHead
        title={user?.name || user?.handle || "Profile"}
        canonical={`/users/${id}`}
        noindex
      />
      <div className="max-w-md mx-auto pt-28 pb-16 px-4 text-center space-y-4">
        {loading && <p className="text-text-muted">Loading…</p>}
        {error && (
          <div className="space-y-3">
            <p className="text-red-500">{error}</p>
            {!isAuthenticated && (
              <Link to="/login" className="text-accent font-bold hover:underline">
                Sign in
              </Link>
            )}
          </div>
        )}
        {user && (
          <>
            <div className="mx-auto w-24 h-24 rounded-full overflow-hidden bg-surface border border-border-sleek">
              {avatar ? (
                <img src={avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-black">
                  {(user.name || user.handle || "?")[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <h1 className="text-2xl font-black">{user.name || "User"}</h1>
            {user.handle && <p className="text-accent font-bold">@{user.handle}</p>}
            {user.bio && <p className="text-text-muted text-sm">{user.bio}</p>}
            <div className="flex justify-center gap-8 pt-2">
              <div>
                <div className="text-lg font-black">{user.followers_count ?? 0}</div>
                <div className="text-xs text-text-muted">Followers</div>
              </div>
              <div>
                <div className="text-lg font-black">{user.following_count ?? 0}</div>
                <div className="text-xs text-text-muted">Following</div>
              </div>
            </div>
            {!user.is_self && (
              <button
                type="button"
                disabled={busy}
                onClick={toggleFollow}
                className="btn-sleek btn-primary font-bold disabled:opacity-60"
              >
                {user.is_following ? "Unfollow" : "Follow"}
              </button>
            )}
            <p>
              <Link to="/leaderboard" className="text-sm font-semibold text-text-muted hover:text-accent">
                View leaderboard
              </Link>
            </p>
          </>
        )}
      </div>
    </>
  );
}
