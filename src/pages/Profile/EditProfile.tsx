import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Camera, Save, ArrowLeft, Loader2, Sparkles, User, AtSign, FileText } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import API from "../../api/client";
import { resolveUserAvatarUrl } from "../../utils/resolveUserAvatarUrl";

const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = words[0][0].toUpperCase();
  const last = words.length > 1 ? words[words.length - 1][0].toUpperCase() : "";
  return first + last;
};

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, setLoading, setAuth } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleCheckReqId = useRef(0);
  const [imgError, setImgError] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    handle: user?.handle || "",
    bio: user?.bio || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || "");
  const [error, setError] = useState<string | null>(null);
  const [handleSoftError, setHandleSoftError] = useState<string | null>(null);
  const [handleChecking, setHandleChecking] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        handle: user.handle || "",
        bio: user.bio || "",
      });
      setAvatarPreview(resolveUserAvatarUrl(user.avatar) || user.avatar || "");
    }
  }, [user]);

  /** Fresh profile from server (includes profile_pic resolved as avatar URL from backend). */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await API.get("/auth/me");
        const raw = res.data?.data ?? res.data;
        if (cancelled || !raw) return;
        const avatarUrl = resolveUserAvatarUrl(raw.avatar) || raw.avatar || "";
        setAuth({ ...raw, avatar: avatarUrl });
        setFormData({
          name: raw.name || "",
          handle: raw.handle || "",
          bio: raw.bio || "",
        });
        setAvatarPreview(avatarUrl);
      } catch {
        // Unauthenticated or expired token; keep persisted store user.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setAuth]);

  useEffect(() => {
    const reqId = ++handleCheckReqId.current;
    const raw = formData.handle.replace(/^@/, "").trim();
    if (!raw) {
      setHandleSoftError(null);
      setHandleChecking(false);
      return;
    }

    const ac = new AbortController();
    const timer = window.setTimeout(async () => {
      if (handleCheckReqId.current !== reqId) return;
      setHandleChecking(true);
      try {
        const res = await API.get("/auth/profile/handle-availability", {
          params: { handle: raw },
          signal: ac.signal,
        });
        if (handleCheckReqId.current !== reqId) return;
        const body = res.data?.data ?? res.data;
        if (body?.available === false) {
          setHandleSoftError("This handle is already in use. Pick another or leave blank to auto-generate from your name.");
        } else {
          setHandleSoftError(null);
        }
      } catch (err: unknown) {
        if (handleCheckReqId.current !== reqId) return;
        const code = (err as { code?: string })?.code;
        if (code === "ERR_CANCELED") return;
        setHandleSoftError(null);
      } finally {
        if (handleCheckReqId.current === reqId) {
          setHandleChecking(false);
        }
      }
    }, 450);

    return () => {
      ac.abort();
      window.clearTimeout(timer);
    };
  }, [formData.handle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setImgError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (handleSoftError) return;
    setError(null);
    setLoading(true);

    try {
      const payload = new FormData();
      if (formData.name) payload.append("name", formData.name);
      payload.append("handle", formData.handle.replace(/^@/, "").trim());
      if (formData.bio) payload.append("bio", formData.bio);
      if (avatarFile) payload.append("avatar", avatarFile);

      const res = await API.post("/auth/profile/update", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data?.data ?? res.data;
      const storageUrl = resolveUserAvatarUrl(updatedUser.avatar) || updatedUser.avatar || "";

      // Store the backend URL in the auth store (persistent)
      setAuth({ ...updatedUser, avatar: storageUrl || updatedUser.avatar });

      // Pass the local blob preview via router state so UserProfile shows it instantly
      // (storage symlink may not be ready immediately in dev)
      navigate("/profile", { state: { freshAvatar: avatarFile ? avatarPreview : storageUrl } });
    } catch (err: any) {
      const msg =
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : err.response?.data?.message || "Update failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-24 pb-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors font-black text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            <h1 className="text-2xl font-black text-text-main tracking-tight uppercase italic">Edit Your Node</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-main p-8 md:p-10 bg-card-bg border-border-sleek shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />

          <div className="space-y-10 relative z-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] border-4 border-border-sleek overflow-hidden bg-surface transition-transform group-hover:scale-105 flex items-center justify-center">
                  {avatarPreview && !imgError ? (
                    <img
                      src={avatarPreview}
                      className="w-full h-full object-cover"
                      alt="Current Avatar"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span className="text-2xl md:text-3xl font-black text-accent select-none">
                      {getInitials(formData.name || user?.name || "")}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-3 bg-accent text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                {avatarFile ? avatarFile.name : "Evolution starts with your visual"}
              </p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-xs font-bold text-center">{error}</p>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                  <User className="w-3 h-3 text-accent" /> Display Identity
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full bg-surface border border-border-sleek rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-text-main placeholder:text-text-muted/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                  <AtSign className="w-3 h-3 text-accent" /> Network Handle
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-accent font-black">@</span>
                  <input
                    type="text"
                    name="handle"
                    value={formData.handle.replace(/^@/, "")}
                    onChange={(e) => {
                      const val = e.target.value.replace(/^@/, "");
                      setFormData((prev) => ({ ...prev, handle: val }));
                    }}
                    placeholder="handle"
                    aria-invalid={!!handleSoftError}
                    className={`w-full bg-surface border rounded-2xl py-4 pl-10 pr-6 text-sm font-bold focus:outline-none focus:ring-2 transition-all text-text-main placeholder:text-text-muted/30 ${
                      handleSoftError
                        ? "border-amber-500/80 focus:ring-amber-500/30 focus:border-amber-500"
                        : "border-border-sleek focus:ring-accent/40 focus:border-accent"
                    }`}
                  />
                </div>
                {handleChecking && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Checking availability…</p>
                )}
                {handleSoftError && (
                  <p className="text-amber-600 dark:text-amber-400 text-xs font-bold">{handleSoftError}</p>
                )}
                {!handleSoftError && !handleChecking && (
                  <p className="text-[10px] font-bold text-text-muted/70 uppercase tracking-widest">
                    Leave blank to set a default from your first and last name (from display identity).
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                  <FileText className="w-3 h-3 text-accent" /> Growth Manifesto (Bio)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell the survivors your mission..."
                  rows={4}
                  className="w-full bg-surface border border-border-sleek rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-text-main placeholder:text-text-muted/30 resize-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border-sleek">
              <button
                type="submit"
                disabled={loading || !!handleSoftError}
                className="btn-viral w-full py-5 text-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    SYNC PROFILE UPDATE
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfile;
