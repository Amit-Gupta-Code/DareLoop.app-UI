import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Crown,
  EyeOff,
  Flag,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import API from "../../api/client";
import { SEOHead } from "@/src/seo/SEOHead";
import { useAuthStore } from "../../store/authStore";

type FollowUp = { id: string; prompt: string; placeholder: string };

type CreateContext = {
  onboarding: {
    goal_type?: string;
    target?: string;
    custom_goal?: string;
    daily_time?: string;
    skill_level?: string;
    instagram_url?: string;
  } | null;
  can_create_plan: boolean;
  is_paid: boolean;
  subscription_tier: string;
  follow_up_questions: FollowUp[];
  active_plan?: { uuid: string; title: string; status: string } | null;
};

const GOAL_LABELS: Record<string, string> = {
  creator: "Creator",
  developer: "Software Developer",
  fitness: "Fitness",
  freelancer: "Freelancer",
  abroad_job: "Abroad Job",
  startup_founder: "Startup Founder",
  student: "Student",
};

const TIME_LABELS: Record<string, string> = {
  "15_min": "15 min / day",
  "30_min": "30 min / day",
  "1_hour": "1 hour / day",
  "2_hour": "2 hours / day",
  "3_plus_hour": "3+ hours / day",
};

const ROADMAP = [
  { icon: Wand2, title: "Generate plan", text: "AI builds your day-wise mission from onboarding." },
  { icon: Target, title: "Complete every day", text: "Show up, finish tasks, keep the streak." },
  { icon: Flag, title: "Publish public dare", text: "Only after full completion can others join." },
];

export default function CreatePlan() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [ctx, setCtx] = useState<CreateContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({
    niche: "",
    constraints: "",
    north_star: "",
  });
  const [chatStep, setChatStep] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await API.get("/plans/create-context");
        const data = res.data?.data ?? res.data;
        if (cancelled) return;
        if (data?.active_plan?.uuid && !data?.can_create_plan) {
          navigate(`/plans/${data.active_plan.uuid}`, { replace: true });
          return;
        }
        setCtx(data);
      } catch {
        if (!cancelled) setError("Could not load plan context.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const chips = useMemo(() => {
    const o = ctx?.onboarding;
    if (!o) return [];
    return [
      o.goal_type ? GOAL_LABELS[o.goal_type] || o.goal_type : null,
      o.target,
      o.skill_level ? o.skill_level[0].toUpperCase() + o.skill_level.slice(1) : null,
      o.daily_time ? TIME_LABELS[o.daily_time] || o.daily_time : null,
    ].filter(Boolean) as string[];
  }, [ctx]);

  const questions = ctx?.follow_up_questions ?? [];
  const currentQ = questions[chatStep];

  const generate = async () => {
    if (ctx && !ctx.can_create_plan) {
      setError("Free users get one plan. Upgrade for unlimited AI plans.");
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const res = await API.post("/plans", {
        niche: answers.niche || undefined,
        constraints: answers.constraints || undefined,
        north_star: answers.north_star || undefined,
        duration_days: 30,
      });
      const plan = res.data?.data ?? res.data;
      navigate(`/plans/${plan.uuid}`, { replace: true });
    } catch (err: unknown) {
      const ax = err as {
        response?: { data?: { message?: string; errors?: { upgrade_required?: boolean; code?: string } } };
      };
      setError(ax.response?.data?.message || "Plan generation failed. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Create Plan — DareLoop" description="Generate your personalized AI execution plan." />
      <div className="relative min-h-[calc(100dvh-64px)] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(34,197,94,0.18),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(245,158,11,0.12),_transparent_45%)]" />
        <motion.div
          className="pointer-events-none absolute -left-16 top-32 w-56 h-56 rounded-full bg-accent/15 blur-3xl"
          animate={{ x: [0, 24, 0], y: [0, 16, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="pointer-events-none absolute right-0 bottom-20 w-64 h-64 rounded-full bg-highlight/15 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, -18, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-5 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 text-accent mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Your plan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              Hey {user?.name?.split(" ")[0] || "there"}, craft the mission you&apos;ll finish
            </h1>
            <p className="text-text-muted font-medium">
              A short conversation, then a day-wise plan. Complete it fully before you can publish as a public dare.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mb-8 rounded-[28px] border border-highlight/35 bg-gradient-to-br from-highlight/15 via-card-bg to-accent/10 p-5 sm:p-6 shadow-[0_20px_50px_rgba(245,158,11,0.12)]"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-highlight/20 text-highlight flex items-center justify-center shrink-0">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-highlight mb-1">
                  Required before public dare
                </p>
                <h2 className="text-lg font-black text-text-main mb-1">
                  Complete this plan before you publish
                </h2>
                <p className="text-sm text-text-muted font-medium leading-relaxed">
                  Your plan stays private while you execute. Only a finished, verified mission can become a public dare
                  (Blueprint) that others join.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {ROADMAP.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06 }}
                  className="rounded-2xl border border-border-sleek/80 bg-card-bg/80 backdrop-blur px-3.5 py-3"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <step.icon className="w-4 h-4 text-accent" />
                    <span className="text-[11px] font-black uppercase tracking-wide text-text-muted">
                      Step {i + 1}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-text-main">{step.title}</p>
                  <p className="text-xs text-text-muted mt-0.5 leading-snug">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                <Wand2 className="w-4 h-4" />
              </div>
              <div className="card-sleek !p-4 !rounded-2xl !shadow-none flex-1">
                <p className="text-sm font-bold text-text-main mb-3">
                  I already know this about you:
                </p>
                <div className="flex flex-wrap gap-2">
                  {chips.length ? (
                    chips.map((c) => (
                      <span
                        key={c}
                        className="text-xs font-black uppercase tracking-wide px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20"
                      >
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-text-muted">Onboarding answers will appear here.</span>
                  )}
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {currentQ && chatStep < questions.length && (
                <motion.div
                  key={currentQ.id}
                  initial={{ opacity: 0, y: 20, rotateX: -8 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="card-main !p-5 flex-1 !rounded-[24px]">
                    <p className="font-bold mb-3">{currentQ.prompt}</p>
                    <textarea
                      rows={3}
                      value={answers[currentQ.id] || ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
                      }
                      placeholder={currentQ.placeholder}
                      className="w-full resize-none rounded-2xl border border-border-sleek bg-surface px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                    <div className="mt-4 flex justify-between gap-2">
                      <button
                        type="button"
                        className="text-sm font-bold text-text-muted hover:text-text-main"
                        onClick={() => setChatStep((s) => Math.min(s + 1, questions.length))}
                      >
                        Skip
                      </button>
                      <button
                        type="button"
                        className="btn-viral !py-2.5 !px-5 text-sm"
                        onClick={() => setChatStep((s) => Math.min(s + 1, questions.length))}
                      >
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {chatStep >= questions.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-main !p-6 !rounded-[28px] border-accent/30 shadow-[0_20px_60px_rgba(34,197,94,0.15)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  <h2 className="text-xl font-black">Ready to generate</h2>
                </div>
                <p className="text-sm text-text-muted font-medium mb-5">
                  AI builds a day-wise plan from your onboarding + answers. Stay private until you finish — then unlock
                  publish for a public dare.
                </p>

                {!ctx?.can_create_plan && (
                  <div className="mb-4 rounded-2xl border border-highlight/40 bg-highlight/10 p-4 flex gap-3">
                    <Crown className="w-5 h-5 text-highlight shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Free plan limit reached</p>
                      <p className="text-xs text-text-muted mt-1">
                        You already have a challenge. Upgrade for unlimited plans and AI edits.
                      </p>
                      {ctx?.active_plan?.uuid && (
                        <button
                          type="button"
                          className="mt-2 text-xs font-black uppercase tracking-wide text-accent hover:underline"
                          onClick={() => navigate(`/plans/${ctx.active_plan!.uuid}`)}
                        >
                          Open my plan →
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {error && <p className="text-red-500 text-sm font-bold mb-4">{error}</p>}

                <button
                  type="button"
                  disabled={generating || !ctx?.can_create_plan}
                  onClick={generate}
                  className="btn-viral w-full py-4 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Crafting your 30-day plan…
                    </>
                  ) : (
                    <>
                      Generate my plan <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
