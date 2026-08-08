import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Camera,
  Check,
  Flame,
  ImagePlus,
  Instagram,
  Link2,
  Loader2,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Upload,
  Zap,
} from "lucide-react";
import API from "../../api/client";
import { useAuthStore } from "../../store/authStore";
import { SEOHead } from "@/src/seo/SEOHead";

type GoalType =
  | "creator"
  | "developer"
  | "fitness"
  | "freelancer"
  | "abroad_job"
  | "startup_founder"
  | "student";

type SkillLevel = "beginner" | "intermediate" | "advanced";
type DailyTime = "15_min" | "30_min" | "1_hour" | "2_hour" | "3_plus_hour";

const GOALS: { id: GoalType; label: string; emoji: string }[] = [
  { id: "creator", label: "Creator", emoji: "🎬" },
  { id: "developer", label: "Software Developer", emoji: "💻" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "freelancer", label: "Freelancer", emoji: "🧳" },
  { id: "abroad_job", label: "Abroad Job", emoji: "✈️" },
  { id: "startup_founder", label: "Startup Founder", emoji: "🚀" },
  { id: "student", label: "Student", emoji: "📚" },
];

const TARGETS = [
  "10K Followers",
  "100K Followers",
  "First Viral Reel",
  "Earn ₹1 Lakh",
  "Custom Goal",
] as const;

const TIMES: { id: DailyTime; label: string }[] = [
  { id: "15_min", label: "15 min" },
  { id: "30_min", label: "30 min" },
  { id: "1_hour", label: "1 hour" },
  { id: "2_hour", label: "2 hour" },
  { id: "3_plus_hour", label: "3+ hour" },
];

const LEVELS: { id: SkillLevel; label: string }[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const TOTAL_STEPS = 7;

function OptionCard({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03, rotateY: selected ? 0 : 4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{ transformStyle: "preserve-3d" }}
      className={`relative text-left rounded-2xl border px-4 py-4 font-bold transition-colors ${
        selected
          ? "border-accent bg-accent/10 text-text-main shadow-[0_12px_40px_rgba(34,197,94,0.25)]"
          : "border-border-sleek bg-card-bg text-text-main/80 hover:border-accent/40"
      } ${className}`}
    >
      {selected && (
        <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center">
          <Check className="w-3.5 h-3.5" />
        </span>
      )}
      {children}
    </motion.button>
  );
}

function FunnyIntroHero() {
  const letters = "Ab Akal Aaii".split("");
  return (
    <div className="relative mb-8 flex flex-col items-center" style={{ perspective: 900 }}>
      <motion.div
        className="relative w-36 h-36 mb-4"
        animate={{ rotateY: [0, 18, -12, 0], rotateX: [0, -8, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent via-highlight to-secondary opacity-90 shadow-[0_25px_60px_rgba(34,197,94,0.35)]" />
        <div className="absolute inset-2 rounded-[1.6rem] bg-card-bg flex items-center justify-center">
          <motion.span
            className="text-6xl"
            animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            🧠💡
          </motion.span>
        </div>
        <motion.div
          className="absolute -top-3 -right-3 bg-highlight text-primary text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow-lg"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          Finally!
        </motion.div>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-1 mb-2" style={{ transformStyle: "preserve-3d" }}>
        {letters.map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            className={`inline-block text-3xl sm:text-4xl font-black italic ${
              ch === " " ? "w-3" : "text-transparent bg-clip-text bg-gradient-to-r from-accent via-highlight to-secondary"
            }`}
            initial={{ opacity: 0, y: 40, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.08 * i, type: "spring", stiffness: 220, damping: 14 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </div>
      <motion.p
        className="text-sm font-bold text-text-muted text-center max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        Brain finally online. Let&apos;s turn the dream into daily missions.
      </motion.p>
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [goalType, setGoalType] = useState<GoalType | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [customGoal, setCustomGoal] = useState("");
  const [dailyTime, setDailyTime] = useState<DailyTime | null>(null);
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(null);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [aiProgress, setAiProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.onboarding_completed) {
      navigate("/plans/create", { replace: true });
    }
  }, [user?.onboarding_completed, navigate]);

  useEffect(() => {
    if (step !== 6) return;
    setAiProgress(0);
    const start = Date.now();
    const duration = 2800;
    const tick = window.setInterval(() => {
      const p = Math.min(100, Math.round(((Date.now() - start) / duration) * 100));
      setAiProgress(p);
      if (p >= 100) {
        window.clearInterval(tick);
        window.setTimeout(() => setStep(7), 350);
      }
    }, 40);
    return () => window.clearInterval(tick);
  }, [step]);

  const canNext = useMemo(() => {
    if (step === 1) return !!goalType;
    if (step === 2) return !!target && (target !== "Custom Goal" || customGoal.trim().length > 1);
    if (step === 3) return !!dailyTime;
    if (step === 4) return !!skillLevel;
    if (step === 5) return !!instagramUrl.trim() || !!screenshot;
    return true;
  }, [step, goalType, target, customGoal, dailyTime, skillLevel, instagramUrl, screenshot]);

  const goNext = () => {
    setError(null);
    if (step === 5) {
      setStep(6);
      return;
    }
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 1 && step !== 6) setStep((s) => s - 1);
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const finish = async () => {
    if (!goalType || !target || !dailyTime || !skillLevel) return;
    setSaving(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("goal_type", goalType);
      form.append("target", target === "Custom Goal" ? customGoal.trim() : target);
      if (target === "Custom Goal") form.append("custom_goal", customGoal.trim());
      form.append("daily_time", dailyTime);
      form.append("skill_level", skillLevel);
      if (instagramUrl.trim()) form.append("instagram_url", instagramUrl.trim());
      if (screenshot) form.append("screenshot", screenshot);
      form.append("current_step", "7");

      const res = await API.post("/auth/onboarding", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const payload = res.data?.data ?? res.data;
      if (payload?.user) {
        setAuth({ ...user!, ...payload.user, onboarding_completed: true });
      } else if (user) {
        setAuth({ ...user, onboarding_completed: true });
      }
      navigate("/plans/create", { replace: true });
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const msg =
        ax.response?.data?.errors
          ? Object.values(ax.response.data.errors).flat().join(" ")
          : ax.response?.data?.message || "Could not save onboarding. Try again.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEOHead title="Onboarding — DareLoop" description="Set your first DareLoop mission." />
      <div className="relative min-h-[calc(100dvh-64px)] overflow-hidden bg-surface">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,197,94,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.14),_transparent_50%)]" />
        <motion.div
          className="pointer-events-none absolute -left-20 top-24 w-64 h-64 rounded-full bg-accent/20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="pointer-events-none absolute right-0 bottom-10 w-72 h-72 rounded-full bg-secondary/20 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-xl mx-auto px-5 pt-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">
                First Onboarding
              </span>
            </div>
            <span className="text-xs font-bold text-text-muted">
              {Math.min(step, TOTAL_STEPS)} / {TOTAL_STEPS}
            </span>
          </div>

          <div className="h-2 rounded-full bg-border-sleek overflow-hidden mb-8">
            <motion.div
              className="h-full bg-gradient-to-r from-accent via-highlight to-secondary"
              initial={false}
              animate={{ width: `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, rotateY: -18, z: -40 }}
              animate={{ opacity: 1, rotateY: 0, z: 0 }}
              exit={{ opacity: 0, rotateY: 18, z: -40 }}
              transition={{ duration: 0.35 }}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              className="card-main !p-6 sm:!p-8 bg-card-bg/90 backdrop-blur border-border-sleek shadow-2xl"
            >
              {step === 1 && (
                <div>
                  <FunnyIntroHero />
                  <h1 className="text-2xl sm:text-3xl font-black text-center mb-2">
                    Welcome to Dare<span className="text-accent">Loop</span>
                  </h1>
                  <p className="text-center text-text-muted font-medium mb-6">What do you want to become?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {GOALS.map((g) => (
                      <OptionCard key={g.id} selected={goalType === g.id} onClick={() => setGoalType(g.id)}>
                        <span className="text-2xl mr-2">{g.emoji}</span>
                        <span>{g.label}</span>
                      </OptionCard>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-accent">
                    <Target className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Target</span>
                  </div>
                  <h2 className="text-2xl font-black mb-6">What is your target?</h2>
                  <div className="grid gap-3">
                    {TARGETS.map((t) => (
                      <OptionCard key={t} selected={target === t} onClick={() => setTarget(t)}>
                        {t}
                      </OptionCard>
                    ))}
                  </div>
                  {target === "Custom Goal" && (
                    <input
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      placeholder="Type your custom goal..."
                      className="mt-4 w-full rounded-2xl border border-border-sleek bg-surface px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-accent">
                    <Timer className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Daily time</span>
                  </div>
                  <h2 className="text-2xl font-black mb-6">How much time daily?</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TIMES.map((t) => (
                      <OptionCard key={t.id} selected={dailyTime === t.id} onClick={() => setDailyTime(t.id)}>
                        {t.label}
                      </OptionCard>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-accent">
                    <Flame className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Level</span>
                  </div>
                  <h2 className="text-2xl font-black mb-6">Current Level</h2>
                  <div className="grid gap-3">
                    {LEVELS.map((l) => (
                      <OptionCard key={l.id} selected={skillLevel === l.id} onClick={() => setSkillLevel(l.id)}>
                        {l.label}
                      </OptionCard>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-accent">
                    <Upload className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Proof</span>
                  </div>
                  <h2 className="text-2xl font-black mb-2">Upload</h2>
                  <p className="text-text-muted font-medium mb-6">Instagram profile link or a screenshot</p>

                  <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2">
                    <Instagram className="inline w-3 h-3 mr-1" /> Instagram Profile
                  </label>
                  <div className="relative mb-5">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                    <input
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/yourhandle"
                      className="w-full rounded-2xl border border-border-sleek bg-surface pl-10 pr-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  </div>

                  <p className="text-center text-xs font-black uppercase tracking-widest text-text-muted mb-3">or</p>

                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full rounded-2xl border-2 border-dashed border-border-sleek hover:border-accent/50 bg-surface p-6 flex flex-col items-center gap-2 transition-colors"
                  >
                    {preview ? (
                      <img src={preview} alt="Screenshot preview" className="max-h-40 rounded-xl object-cover" />
                    ) : (
                      <>
                        <ImagePlus className="w-8 h-8 text-accent" />
                        <span className="font-bold">Upload Screenshot</span>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Camera className="w-3 h-3" /> PNG / JPG
                        </span>
                      </>
                    )}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
                </div>
              )}

              {step === 6 && (
                <div className="py-10 text-center">
                  <motion.div
                    className="mx-auto mb-6 w-24 h-24 rounded-[2rem] bg-gradient-to-br from-accent to-secondary flex items-center justify-center shadow-[0_20px_50px_rgba(34,197,94,0.35)]"
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Brain className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-black mb-2">AI is analysing...</h2>
                  <p className="text-text-muted font-medium mb-8">Cooking your personal 30-day mission</p>
                  <div className="h-3 rounded-full bg-border-sleek overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent via-highlight to-secondary"
                      style={{ width: `${aiProgress}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs font-black tracking-widest text-accent">{aiProgress}%</p>
                </div>
              )}

              {step === 7 && (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0.6, rotateX: -40 }}
                    animate={{ scale: 1, rotateX: 0 }}
                    transition={{ type: "spring", stiffness: 160 }}
                    className="mx-auto mb-5 w-28 h-28 rounded-[2rem] bg-gradient-to-br from-accent via-highlight to-secondary flex items-center justify-center shadow-2xl"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Trophy className="w-12 h-12 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-black mb-2">Mission Ready</h2>
                  <p className="text-text-muted font-medium mb-4">
                    Next up: build your personal plan. Finish every day before you can publish it as a public dare.
                  </p>
                  <div className="mb-6 rounded-2xl border border-highlight/40 bg-highlight/10 px-4 py-3 text-left">
                    <p className="text-xs font-black uppercase tracking-widest text-highlight mb-1">Before public dare</p>
                    <p className="text-sm font-medium text-text-main/90">
                      Plans stay private until you complete the full mission. Only then can you publish for others to join.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { icon: Timer, label: "30 Days" },
                      { icon: Zap, label: "XP" },
                      { icon: Check, label: "Daily Tasks" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-border-sleek bg-surface p-4 flex flex-col items-center gap-2"
                      >
                        <item.icon className="w-5 h-5 text-accent" />
                        <span className="text-xs font-black uppercase tracking-wide">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  {error && <p className="text-red-500 text-sm font-bold mb-4">{error}</p>}
                  <button
                    type="button"
                    disabled={saving}
                    onClick={finish}
                    className="btn-viral w-full py-4 text-base disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Go to my plan <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {step < 6 && (
                <div className="mt-8 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 1}
                    className="px-4 py-3 rounded-xl font-bold text-text-muted disabled:opacity-30 hover:text-text-main"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className="btn-viral px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
