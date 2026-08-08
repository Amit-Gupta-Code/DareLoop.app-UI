import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  EyeOff,
  Flag,
  Lightbulb,
  Loader2,
  Lock,
  Sparkles,
  Trophy,
  Wand2,
} from "lucide-react";
import API from "../../api/client";
import { SEOHead } from "@/src/seo/SEOHead";

type PlanTask = {
  id: number;
  title: string;
  description?: string;
  estimated_minutes?: number;
  difficulty?: string;
  proof_required?: boolean;
  status: string;
};

type PlanDay = {
  id: number;
  day_number: number;
  week_number?: number;
  title: string;
  summary?: string;
  ai_suggestion?: string;
  status: string;
  tasks: PlanTask[];
};

type Plan = {
  uuid: string;
  title: string;
  summary?: string;
  duration_days: number;
  current_version: number;
  status?: string;
  challenge_type?: { name: string; icon?: string } | null;
  progress?: {
    current_day: number;
    tasks_completed: number;
    days_completed: number;
    xp_earned: number;
  } | null;
  days: PlanDay[];
};

function dayFromHash(days: PlanDay[], fallback: number) {
  const raw = window.location.hash.replace("#", "").replace("day-", "");
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return days.some((d) => d.day_number === n) ? n : fallback;
}

export default function PlanDetail() {
  const { uuid } = useParams<{ uuid: string }>();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [showAi, setShowAi] = useState(false);
  const [busyTask, setBusyTask] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [focusDay, setFocusDay] = useState(1);
  const [slideDir, setSlideDir] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  const load = async (quiet = false) => {
    if (!uuid) return;
    if (!quiet) setLoading(true);
    try {
      const res = await API.get(`/plans/${uuid}`);
      setPlan(res.data?.data ?? res.data);
      setError(null);
    } catch {
      setError("Plan not found.");
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [uuid]);

  const unlockedDay = useMemo(() => {
    if (!plan?.days?.length) return 1;
    const firstOpen = plan.days.find((d) => d.status !== "completed");
    return firstOpen?.day_number ?? plan.duration_days;
  }, [plan]);

  useEffect(() => {
    if (!plan?.days?.length) return;
    const initial = dayFromHash(plan.days, unlockedDay);
    setFocusDay(initial);
  }, [plan?.uuid, unlockedDay]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectDay = useCallback(
    (n: number, dir?: number) => {
      if (!plan?.days?.length) return;
      const clamped = Math.min(Math.max(n, 1), plan.duration_days);
      setSlideDir(dir ?? (clamped > focusDay ? 1 : -1));
      setFocusDay(clamped);
      window.history.replaceState(null, "", `#day-${clamped}`);
    },
    [plan, focusDay]
  );

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const btn = rail.querySelector<HTMLElement>(`[data-day="${focusDay}"]`);
    btn?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [focusDay]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft") selectDay(focusDay - 1, -1);
      if (e.key === "ArrowRight") selectDay(focusDay + 1, 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusDay, selectDay]);

  const requestEdit = async () => {
    if (!uuid || !editPrompt.trim()) return;
    setEditing(true);
    setEditError(null);
    try {
      const res = await API.post(`/plans/${uuid}/ai-edit`, { prompt: editPrompt.trim() });
      setPlan(res.data?.data ?? res.data);
      setEditPrompt("");
      setShowAi(false);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setEditError(ax.response?.data?.message || "AI edit failed.");
    } finally {
      setEditing(false);
    }
  };

  const completeTask = async (taskId: number, dayNumber: number) => {
    if (!uuid || dayNumber > unlockedDay) return;
    setBusyTask(taskId);
    setActionError(null);
    try {
      await API.post(`/plans/${uuid}/tasks/${taskId}/complete`);
      await load(true);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setActionError(ax.response?.data?.message || "Could not complete task.");
    } finally {
      setBusyTask(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="max-w-lg mx-auto py-20 px-6 text-center">
        <p className="font-bold text-text-muted mb-4">{error || "Missing plan"}</p>
        <Link to="/plans/create" className="btn-viral inline-flex">
          Create a plan
        </Link>
      </div>
    );
  }

  const completedDays = plan.days.filter((d) => d.status === "completed").length;
  const pct = plan.duration_days ? Math.round((completedDays / plan.duration_days) * 100) : 0;
  const isComplete = completedDays >= plan.duration_days && plan.duration_days > 0;
  const day = plan.days.find((d) => d.day_number === focusDay) ?? plan.days[0];
  const done = day.status === "completed";
  const actionable = day.day_number === unlockedDay && !done;
  const locked = day.day_number > unlockedDay;
  const taskDone = day.tasks.filter((t) => t.status === "completed").length;
  const week = day.week_number ?? Math.ceil(day.day_number / 7);

  const ringStyle = {
    background: `conic-gradient(#22C55E ${pct}%, rgba(148,163,184,0.25) 0)`,
  };

  return (
    <>
      <SEOHead title={`${plan.title} — DareLoop`} description={plan.summary || ""} />
      <div className="relative min-h-[calc(100dvh-64px)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,197,94,0.12),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.08),_transparent_45%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* Compact command header */}
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div
                className="relative w-16 h-16 rounded-full p-[3px] shrink-0 shadow-lg shadow-accent/10"
                style={ringStyle}
                aria-label={`${pct}% complete`}
              >
                <div className="w-full h-full rounded-full bg-card-bg flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-accent leading-none">{pct}%</span>
                  <span className="text-[8px] font-black uppercase tracking-wider text-text-muted">done</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-accent mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {plan.challenge_type?.icon} {plan.challenge_type?.name || "Mission"} · Day {unlockedDay} active
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight truncate">{plan.title}</h1>
                <p className="text-sm text-text-muted font-medium mt-1 line-clamp-2">{plan.summary}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">
                  <span>{plan.progress?.xp_earned ?? 0} XP</span>
                  <span>
                    {completedDays}/{plan.duration_days} days
                  </span>
                  <span>v{plan.current_version}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => selectDay(unlockedDay, unlockedDay >= focusDay ? 1 : -1)}
                  className="btn-sleek !py-2.5 !px-4 text-xs bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
                >
                  Jump to today
                </button>
                <button
                  type="button"
                  onClick={() => setShowAi((v) => !v)}
                  className={`btn-sleek !py-2.5 !px-4 text-xs ${
                    showAi ? "bg-secondary/15 border-secondary/40 text-secondary" : "bg-card-bg"
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5" /> AI refine
                </button>
              </div>
            </div>

            <div
              className={`mt-5 rounded-2xl border px-4 py-3 flex gap-3 ${
                isComplete
                  ? "border-accent/35 bg-accent/10"
                  : "border-highlight/30 bg-highlight/10"
              }`}
            >
              {isComplete ? (
                <Trophy className="w-5 h-5 text-accent shrink-0" />
              ) : (
                <EyeOff className="w-5 h-5 text-highlight shrink-0" />
              )}
              <p className="text-sm font-medium text-text-main/90">
                {isComplete
                  ? "Mission complete — publish as a public dare when you’re ready."
                  : "One day on stage. Mark tasks only on your active day — peek ahead anytime."}
              </p>
            </div>
          </motion.header>

          {/* AI panel (collapsed by default) */}
          <AnimatePresence>
            {showAi && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="card-main !p-5 border-secondary/25">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-secondary" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-secondary">
                      Ask AI to refine
                    </h2>
                  </div>
                  <p className="text-sm text-text-muted mb-3">
                    Plans aren&apos;t manually editable. Try: “make it easier”, “skip weekends”, “add more workout”.
                  </p>
                  <textarea
                    rows={2}
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Describe the change…"
                    className="w-full rounded-2xl border border-border-sleek bg-surface px-4 py-3 text-sm font-medium mb-3 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  {editError && (
                    <p className="text-sm font-bold text-amber-600 mb-3 flex items-start gap-2">
                      <Crown className="w-4 h-4 shrink-0 mt-0.5" /> {editError}
                    </p>
                  )}
                  <button
                    type="button"
                    disabled={editing || !editPrompt.trim()}
                    onClick={requestEdit}
                    className="btn-viral !py-3 disabled:opacity-50"
                  >
                    {editing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Regenerate with AI"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Day orbit rail */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                Mission timeline · Week {week}
              </span>
              <span className="text-[10px] font-bold text-text-muted tabular-nums">
                {focusDay} / {plan.duration_days}
              </span>
            </div>
            <div className="relative rounded-[22px] border border-border-sleek bg-card-bg/80 backdrop-blur-sm p-3 overflow-hidden">
              <div className="absolute left-3 right-3 top-1/2 h-px bg-border-sleek pointer-events-none" />
              <div
                ref={railRef}
                className="relative flex gap-2 overflow-x-auto pb-0.5 scrollbar-thin snap-x snap-mandatory"
                style={{ scrollbarWidth: "thin" }}
              >
                {plan.days.map((d) => {
                  const isFocus = d.day_number === focusDay;
                  const isDone = d.status === "completed";
                  const isActive = d.day_number === unlockedDay && !isDone;
                  const isLocked = d.day_number > unlockedDay;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      data-day={d.day_number}
                      onClick={() => selectDay(d.day_number)}
                      className={`snap-center shrink-0 relative z-[1] w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                        isFocus
                          ? "bg-accent text-white scale-110 shadow-lg shadow-accent/30"
                          : isDone
                            ? "bg-accent/15 text-accent border border-accent/30"
                            : isActive
                              ? "bg-highlight/15 text-highlight border border-highlight/40 animate-pulse-subtle"
                              : isLocked
                                ? "bg-surface text-text-muted/60 border border-border-sleek"
                                : "bg-surface text-text-muted border border-border-sleek"
                      }`}
                      title={d.title}
                      aria-current={isFocus ? "true" : undefined}
                    >
                      {isDone && !isFocus ? <Check className="w-3.5 h-3.5" /> : d.day_number}
                      {isLocked && !isFocus && (
                        <Lock className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 text-text-muted" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {actionError && (
            <p className="text-sm font-bold text-amber-600 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" /> {actionError}
            </p>
          )}

          {/* Focus stage — one day */}
          <div className="relative" style={{ perspective: 1200 }}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <button
                type="button"
                disabled={focusDay <= 1}
                onClick={() => selectDay(focusDay - 1, -1)}
                className="btn-sleek !py-2 !px-3 text-xs disabled:opacity-30 bg-card-bg"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                  {actionable ? "Today’s mission" : done ? "Completed" : locked ? "Preview" : "Day focus"}
                </p>
              </div>
              <button
                type="button"
                disabled={focusDay >= plan.duration_days}
                onClick={() => selectDay(focusDay + 1, 1)}
                className="btn-sleek !py-2 !px-3 text-xs disabled:opacity-30 bg-card-bg"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative" style={{ transformStyle: "preserve-3d" }}>
              <AnimatePresence mode="wait" custom={slideDir}>
                <motion.article
                  key={day.id}
                  custom={slideDir}
                  initial={{ opacity: 0, x: slideDir * 48, rotateY: slideDir * -10, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, x: slideDir * -40, rotateY: slideDir * 8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  className={`rounded-[28px] border bg-card-bg p-5 sm:p-8 shadow-xl ${
                    actionable
                      ? "border-accent/45 shadow-accent/15"
                      : done
                        ? "border-accent/25"
                        : "border-border-sleek"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${
                        done
                          ? "bg-accent text-white"
                          : actionable
                            ? "bg-accent/15 text-accent border border-accent/40"
                            : "bg-surface text-text-muted border border-border-sleek"
                      }`}
                    >
                      {done ? <CheckCircle2 className="w-6 h-6" /> : day.day_number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-xl sm:text-2xl font-black text-text-main leading-tight">
                          {day.title}
                        </h2>
                        {actionable && (
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent text-white">
                            Active
                          </span>
                        )}
                        {locked && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-surface border border-border-sleek text-text-muted">
                            <Lock className="w-2.5 h-2.5" /> Preview
                          </span>
                        )}
                        {done && (
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                            Done
                          </span>
                        )}
                      </div>
                      {day.summary && (
                        <p className="text-sm sm:text-base text-text-muted font-medium">{day.summary}</p>
                      )}
                      <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted mt-2">
                        {taskDone}/{day.tasks.length} tasks
                        {locked ? " · read to prepare" : ""}
                      </p>
                    </div>
                  </div>

                  {day.ai_suggestion && (
                    <div className="rounded-2xl border border-secondary/30 bg-secondary/10 p-4 mb-5 flex gap-3">
                      <Lightbulb className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-0.5">
                          AI tip
                        </p>
                        <p className="text-sm font-medium">{day.ai_suggestion}</p>
                      </div>
                    </div>
                  )}

                  {locked && (
                    <div className="mb-5 rounded-xl border border-dashed border-border-sleek bg-surface/80 px-3 py-2.5 flex items-center gap-2 text-xs font-medium text-text-muted">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      Locked for completion — finish Day {unlockedDay} first. You can still read tasks below.
                    </div>
                  )}

                  <div className="space-y-3">
                    {day.tasks.map((task, i) => {
                      const taskComplete = task.status === "completed";
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 + i * 0.06 }}
                          className={`rounded-2xl border p-4 sm:p-5 ${
                            taskComplete
                              ? "border-accent/35 bg-accent/5"
                              : "border-border-sleek bg-surface/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-bold text-text-main text-base">{task.title}</p>
                              {task.description && (
                                <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-3 mt-2.5 text-[11px] font-bold uppercase tracking-wide text-text-muted">
                                {task.estimated_minutes != null && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {task.estimated_minutes} min
                                  </span>
                                )}
                                {task.difficulty && <span>{task.difficulty}</span>}
                                {task.proof_required && <span>Proof required</span>}
                              </div>
                            </div>

                            {taskComplete ? (
                              <span className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-accent text-white px-3 py-2 text-xs font-black uppercase tracking-wide">
                                <Check className="w-3.5 h-3.5" /> Done
                              </span>
                            ) : actionable ? (
                              <button
                                type="button"
                                disabled={busyTask === task.id}
                                onClick={() => completeTask(task.id, day.day_number)}
                                className="shrink-0 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wide bg-accent text-white hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50 transition-shadow"
                              >
                                {busyTask === task.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Complete"
                                )}
                              </button>
                            ) : (
                              <span
                                className="shrink-0 inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wide bg-surface border border-border-sleek text-text-muted"
                                title="Finish earlier days to unlock"
                              >
                                <Lock className="w-3 h-3" /> Locked
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 rounded-2xl border border-border-sleek bg-card-bg/70 px-4 py-3.5 flex gap-3">
              <BookOpen className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium text-text-muted">
                Use the timeline to peek any day. Completion stays sequential — Day {unlockedDay} is your live mission.
              </p>
            </div>
            {!isComplete && (
              <div className="flex-1 rounded-2xl border border-highlight/30 bg-highlight/10 px-4 py-3.5 flex gap-3">
                <Flag className="w-4 h-4 text-highlight shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-medium text-text-main/90">
                  Public dare publish unlocks after all {plan.duration_days} days.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
