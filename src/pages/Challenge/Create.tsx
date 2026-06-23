import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ImagePlus, Sparkles, ShieldCheck, Target, X } from "lucide-react";
import { createLoop } from "../../services/loopService";
import { useAuthStore } from "../../store/authStore";

const CreateChallenge = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    description?: string;
    banner_image?: string;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const titleMin = 5;
  const titleMax = 80;
  const missionMin = 20;
  const missionMax = 500;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signup", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const lockBackNavigation = () => {
      window.history.pushState(null, "", window.location.href);
    };
    lockBackNavigation();
    window.addEventListener("popstate", lockBackNavigation);
    return () => window.removeEventListener("popstate", lockBackNavigation);
  }, []);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, banner_image: "Image must be under 4MB." }));
      return;
    }
    setFieldErrors((prev) => ({ ...prev, banner_image: undefined }));
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const removeBanner = () => {
    setBannerFile(null);
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const nextErrors: typeof fieldErrors = {};
    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title) {
      nextErrors.title = "Loop name is required.";
    } else if (title.length < titleMin) {
      nextErrors.title = `Loop name must be at least ${titleMin} characters.`;
    } else if (title.length > titleMax) {
      nextErrors.title = `Loop name cannot exceed ${titleMax} characters.`;
    }

    if (!description) {
      nextErrors.description = "Growth mission is required.";
    } else if (description.length < missionMin) {
      nextErrors.description = `Growth mission must be at least ${missionMin} characters.`;
    } else if (description.length > missionMax) {
      nextErrors.description = `Growth mission cannot exceed ${missionMax} characters.`;
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      const { code } = await createLoop(formData.title.trim(), formData.description.trim(), bannerFile);
      navigate(`/c/${code}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create loop. Please try again.";
      setError(msg);
      setLoading(false);
    }
  };

  const titleLength = formData.title.trim().length;
  const missionLength = formData.description.trim().length;
  const isFormValid =
    titleLength >= titleMin &&
    titleLength <= titleMax &&
    missionLength >= missionMin &&
    missionLength <= missionMax;

  return (
    <div className="pt-24 pb-20 px-6 max-w-[760px] mx-auto animate-in zoom-in-95 duration-500 relative">
      <div className="absolute -top-16 -left-8 w-56 h-56 bg-accent/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-16 -right-8 w-64 h-64 bg-highlight/10 blur-3xl rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-main space-y-8 shadow-2xl border-accent/10 relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-highlight to-secondary" />
        <div className="text-center space-y-3">
          <span className="badge-green inline-flex items-center gap-2">
            Loop Initiation ⚡ <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Spawn Growth Loop</h2>
          <p className="text-text-muted text-[15px] md:text-[16px] max-w-xl mx-auto">
            Craft a magnetic mission, launch your loop, and attract creators into your growth tree.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border-sleek bg-surface p-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Clear mission wins faster</p>
          </div>
          <div className="rounded-xl border border-border-sleek bg-surface p-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-highlight" />
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Validation protects quality</p>
          </div>
          <div className="rounded-xl border border-border-sleek bg-surface p-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">One click to go live</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Loop Name */}
          <div className="space-y-2">
            <label className="stat-label block cursor-default">Loop Name</label>
            <input
              maxLength={titleMax}
              className="w-full px-5 py-4 rounded-xl border border-border-sleek bg-surface focus:bg-card-bg focus:outline-none focus:ring-4 focus:ring-accent/5 transition-all font-medium text-[15px]"
              placeholder={`e.g. POV: "Don't let this flop" — tag 3 creators chain`}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className={fieldErrors.title ? "text-red-500" : "text-text-muted"}>
                {fieldErrors.title || `Min ${titleMin} characters`}
              </span>
              <span className="text-text-muted">{titleLength}/{titleMax}</span>
            </div>
          </div>

          {/* Growth Mission */}
          <div className="space-y-2">
            <label className="stat-label block cursor-default">
              Growth Mission
            </label>
            <textarea
              maxLength={missionMax}
              rows={4}
              className="w-full px-5 py-4 rounded-xl border border-border-sleek bg-surface focus:bg-card-bg focus:outline-none focus:ring-4 focus:ring-accent/5 transition-all font-medium text-[15px] resize-none"
              placeholder="Creators stitch your hook, drop the loop link in bio + Stories, and tag 2 people who HAVE to keep it going in 48h. First join gets pinned — mid content not invited, we're chasing FYP energy only."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className={fieldErrors.description ? "text-red-500" : "text-text-muted"}>
                {fieldErrors.description || `Min ${missionMin} characters`}
              </span>
              <span className="text-text-muted">{missionLength}/{missionMax}</span>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="btn-viral w-full py-5 text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" />
            ) : (
              "Deploy Viral Loop"
            )}{" "}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateChallenge;
