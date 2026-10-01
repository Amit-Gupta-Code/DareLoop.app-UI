import { useEffect, useRef, useState, type FormEvent } from "react";
import { Dumbbell, Utensils, Scale, ImagePlus } from "lucide-react";
import { SEOHead } from "@/src/seo/SEOHead";
import { cn } from "@/src/utils/cn";
import {
  addExercise,
  addFoodEntry,
  addWorkoutDay,
  createBodyMetric,
  createMeal,
  createNutritionPlan,
  createWorkoutLog,
  createWorkoutPlan,
  generateNutritionPlan,
  generateWorkoutPlan,
  getBodyMetricSummary,
  getBodyMetrics,
  getMeals,
  getNutritionPlans,
  getWellnessSummary,
  getWorkoutLogs,
  getWorkoutPlans,
  uploadWellnessProof,
  type BodyMetric,
  type BodyMetricSummary,
  type Meal,
  type NutritionPlan,
  type WellnessSummary,
  type WorkoutLog,
  type WorkoutPlan,
} from "@/src/services/wellnessService";

type Tab = "workouts" | "nutrition" | "metrics";

const mealNames = ["breakfast", "lunch", "dinner", "snack", "custom"] as const;
const metricTypes = [
  "weight",
  "height",
  "bmi",
  "body_fat",
  "chest",
  "waist",
  "hips",
  "neck",
  "arms",
  "thighs",
] as const;

function errMessage(err: unknown, fallback: string) {
  const ax = err as { response?: { data?: { message?: string } } };
  return ax.response?.data?.message || fallback;
}

export default function Wellness() {
  const [tab, setTab] = useState<Tab>("workouts");
  const [summary, setSummary] = useState<WellnessSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reloadSummary = () =>
    getWellnessSummary()
      .then(setSummary)
      .catch(() => setSummary(null));

  useEffect(() => {
    reloadSummary();
  }, []);

  return (
    <>
      <SEOHead
        title="Wellness"
        description="Log workouts, meals, and body metrics on DareLoop. Proof is optional and private by default."
        canonical="/wellness"
        noindex={true}
      />
      <div className="max-w-[1240px] mx-auto pt-24 pb-12 px-4 md:px-8 lg:px-12 space-y-8 animate-in fade-in duration-700">
        <div className="card-main p-8 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Dream. Dare. Done.</p>
          <h1 className="text-3xl md:text-4xl font-black">Personal wellness</h1>
          <p className="text-text-muted font-medium max-w-2xl">
            Manual logging plus optional AI workout/diet generation. Proof stays private unless you opt in later. Empty counts are zeros — nothing is invented.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { label: "Workouts logged", val: summary?.workouts_logged ?? 0 },
              { label: "Meals logged", val: summary?.meals_logged ?? 0 },
              { label: "Computed BMI", val: summary?.computed_bmi ?? "—" },
            ].map((s) => (
              <div key={s.label} className="p-4 bg-surface rounded-2xl border border-border-sleek text-center">
                <div className="text-xl font-black">{s.val}</div>
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 border-b border-border-sleek pb-4">
          {[
            { id: "workouts" as const, label: "Workouts", icon: Dumbbell },
            { id: "nutrition" as const, label: "Nutrition", icon: Utensils },
            { id: "metrics" as const, label: "Body metrics", icon: Scale },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "px-6 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                tab === item.id ? "bg-primary text-white shadow-lg" : "text-text-muted hover:bg-surface",
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        {tab === "workouts" && <WorkoutsPane onError={setError} onChanged={reloadSummary} />}
        {tab === "nutrition" && <NutritionPane onError={setError} onChanged={reloadSummary} />}
        {tab === "metrics" && <MetricsPane onError={setError} onChanged={reloadSummary} />}
      </div>
    </>
  );
}

function WorkoutsPane({
  onError,
  onChanged,
}: {
  onError: (m: string | null) => void;
  onChanged: () => void;
}) {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [planTitle, setPlanTitle] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [aiFocus, setAiFocus] = useState("");
  const [generating, setGenerating] = useState(false);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const load = () => {
    setLoading(true);
    Promise.all([getWorkoutPlans(), getWorkoutLogs()])
      .then(([p, l]) => {
        setPlans(p);
        setLogs(l);
      })
      .catch((e) => onError(errMessage(e, "Could not load workouts.")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const submitPlan = async (e: FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim()) return;
    try {
      onError(null);
      await createWorkoutPlan(planTitle.trim());
      setPlanTitle("");
      load();
    } catch (err) {
      onError(errMessage(err, "Could not create plan."));
    }
  };

  const submitLog = async (e: FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;
    try {
      onError(null);
      await createWorkoutLog({
        exercise_name: exerciseName.trim(),
        sets_completed: sets ? Number(sets) : undefined,
        reps_completed: reps ? Number(reps) : undefined,
        weight_kg: weight ? Number(weight) : undefined,
      });
      setExerciseName("");
      setSets("");
      setReps("");
      setWeight("");
      load();
      onChanged();
    } catch (err) {
      onError(errMessage(err, "Could not log workout."));
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-text-muted animate-pulse font-black uppercase tracking-[0.2em]">Loading workouts...</div>;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="text-xl font-black">Session logs</h2>
        <form onSubmit={submitLog} className="card-main p-5 space-y-3">
          <input className="w-full bg-surface border border-border-sleek rounded-xl px-4 py-2" placeholder="Exercise name" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />
          <div className="grid grid-cols-3 gap-2">
            <input className="bg-surface border border-border-sleek rounded-xl px-3 py-2" placeholder="Sets" value={sets} onChange={(e) => setSets(e.target.value)} />
            <input className="bg-surface border border-border-sleek rounded-xl px-3 py-2" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} />
            <input className="bg-surface border border-border-sleek rounded-xl px-3 py-2" placeholder="kg" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <button type="submit" className="btn-viral text-xs py-2 px-5">Log workout</button>
        </form>
        {logs.length === 0 ? (
          <EmptyBox text="No workouts logged yet." />
        ) : (
          logs.map((log) => (
            <div key={log.id} className="card-main p-5 space-y-2">
              <div className="flex justify-between gap-3">
                <h3 className="font-black">{log.exercise_name}</h3>
                {log.has_proof && <span className="badge-green text-[10px]">Proof</span>}
              </div>
              <p className="text-xs text-text-muted">
                {[log.sets_completed && `${log.sets_completed} sets`, log.reps_completed && `${log.reps_completed} reps`, log.weight_kg && `${log.weight_kg} kg`]
                  .filter(Boolean)
                  .join(" · ") || "Logged"}
              </p>
              {log.proof?.url && <img src={log.proof.url} alt="" className="max-h-40 w-full object-cover rounded-xl" />}
              <input
                ref={(el) => { fileRefs.current[log.id] = el; }}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  try {
                    await uploadWellnessProof(`/workout-logs/${log.id}/proof`, file);
                    load();
                  } catch (err) {
                    onError(errMessage(err, "Proof upload failed."));
                  }
                }}
              />
              <button type="button" className="text-xs font-bold text-accent flex items-center gap-1" onClick={() => fileRefs.current[log.id]?.click()}>
                <ImagePlus className="w-3.5 h-3.5" /> {log.has_proof ? "Replace proof" : "Add proof"}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black">Plans</h2>
        <form onSubmit={submitPlan} className="card-main p-5 flex gap-2">
          <input className="flex-1 bg-surface border border-border-sleek rounded-xl px-4 py-2" placeholder="Plan title" value={planTitle} onChange={(e) => setPlanTitle(e.target.value)} />
          <button type="submit" className="btn-viral text-xs py-2 px-4">Create</button>
        </form>
        <form
          className="card-main p-5 flex flex-wrap gap-2 items-center"
          onSubmit={async (e) => {
            e.preventDefault();
            setGenerating(true);
            try {
              onError(null);
              await generateWorkoutPlan({
                focus: aiFocus.trim() || undefined,
                duration_days: 7,
              });
              setAiFocus("");
              load();
            } catch (err) {
              onError(errMessage(err, "Could not generate workout plan."));
            } finally {
              setGenerating(false);
            }
          }}
        >
          <input className="flex-1 bg-surface border border-border-sleek rounded-xl px-4 py-2" placeholder="AI focus (optional)" value={aiFocus} onChange={(e) => setAiFocus(e.target.value)} />
          <button type="submit" className="btn-viral text-xs py-2 px-4" disabled={generating}>
            {generating ? "Generating…" : "Generate with AI"}
          </button>
        </form>
        {plans.length === 0 ? (
          <EmptyBox text="No workout plans yet." />
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="card-main p-5 space-y-3">
              <h3 className="font-black">{plan.title}</h3>
              {plan.days.map((day) => (
                <div key={day.id} className="bg-surface rounded-xl p-3 space-y-1">
                  <p className="text-sm font-bold">Day {day.day_number}: {day.title}</p>
                  <p className="text-xs text-text-muted">
                    {day.exercises.length ? day.exercises.map((x) => x.name).join(", ") : "No exercises"}
                  </p>
                  <button
                    type="button"
                    className="text-xs font-bold text-accent"
                    onClick={async () => {
                      const name = window.prompt("Exercise name");
                      if (!name?.trim()) return;
                      try {
                        await addExercise(plan.id, day.id, { name: name.trim() });
                        load();
                      } catch (err) {
                        onError(errMessage(err, "Could not add exercise."));
                      }
                    }}
                  >
                    Add exercise
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-xs font-bold text-accent"
                onClick={async () => {
                  const title = window.prompt("Day title");
                  if (!title?.trim()) return;
                  try {
                    await addWorkoutDay(plan.id, title.trim());
                    load();
                  } catch (err) {
                    onError(errMessage(err, "Could not add day."));
                  }
                }}
              >
                Add day
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function NutritionPane({
  onError,
  onChanged,
}: {
  onError: (m: string | null) => void;
  onChanged: () => void;
}) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<(typeof mealNames)[number]>("lunch");
  const [customName, setCustomName] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const [planCalories, setPlanCalories] = useState("");
  const [aiGoal, setAiGoal] = useState("");
  const [generating, setGenerating] = useState(false);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const load = () => {
    setLoading(true);
    Promise.all([getMeals(), getNutritionPlans()])
      .then(([m, p]) => {
        setMeals(m);
        setPlans(p);
      })
      .catch((e) => onError(errMessage(e, "Could not load nutrition.")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) {
    return <div className="text-center py-20 text-text-muted animate-pulse font-black uppercase tracking-[0.2em]">Loading meals...</div>;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
      <form
        className="card-main p-5 flex flex-wrap gap-3 items-end"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await createMeal({
              name,
              custom_name: name === "custom" ? customName.trim() || undefined : undefined,
            });
            setCustomName("");
            load();
            onChanged();
          } catch (err) {
            onError(errMessage(err, "Could not log meal."));
          }
        }}
      >
        <select className="bg-surface border border-border-sleek rounded-xl px-4 py-2" value={name} onChange={(e) => setName(e.target.value as typeof name)}>
          {mealNames.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        {name === "custom" && (
          <input className="bg-surface border border-border-sleek rounded-xl px-4 py-2" placeholder="Custom name" value={customName} onChange={(e) => setCustomName(e.target.value)} />
        )}
        <button type="submit" className="btn-viral text-xs py-2 px-5">Log meal</button>
      </form>
      {meals.length === 0 ? (
        <EmptyBox text="No meals logged yet." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {meals.map((meal) => (
            <div key={meal.id} className="card-main p-5 space-y-3">
              <div className="flex justify-between">
                <h3 className="font-black capitalize">{meal.custom_name || meal.name}</h3>
                {meal.has_proof && <span className="badge-green text-[10px]">Proof</span>}
              </div>
              <p className="text-xs text-text-muted">
                {meal.totals.calories} kcal · P {meal.totals.protein_g} · C {meal.totals.carbs_g} · F {meal.totals.fat_g}
              </p>
              <ul className="text-sm space-y-1">
                {meal.food_entries.map((f) => (
                  <li key={f.id} className="flex justify-between">
                    <span>{f.name}</span>
                    <span className="text-text-muted">{f.calories ?? 0} kcal</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="text-xs font-bold text-accent"
                onClick={async () => {
                  const food = window.prompt("Food name");
                  if (!food?.trim()) return;
                  const cal = window.prompt("Calories (optional)");
                  try {
                    await addFoodEntry(meal.id, {
                      name: food.trim(),
                      calories: cal ? Number(cal) : undefined,
                    });
                    load();
                  } catch (err) {
                    onError(errMessage(err, "Could not add food."));
                  }
                }}
              >
                Add food
              </button>
              {meal.proof?.url && <img src={meal.proof.url} alt="" className="max-h-40 w-full object-cover rounded-xl" />}
              <input
                ref={(el) => { fileRefs.current[meal.id] = el; }}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  try {
                    await uploadWellnessProof(`/meals/${meal.id}/proof`, file);
                    load();
                  } catch (err) {
                    onError(errMessage(err, "Proof upload failed."));
                  }
                }}
              />
              <button type="button" className="text-xs font-bold text-accent" onClick={() => fileRefs.current[meal.id]?.click()}>
                {meal.has_proof ? "Replace proof" : "Add proof"}
              </button>
            </div>
          ))}
        </div>
      )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black">Plans</h2>
        <form
          className="card-main p-5 flex flex-wrap gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!planTitle.trim()) return;
            try {
              await createNutritionPlan({
                title: planTitle.trim(),
                daily_calorie_target: planCalories ? Number(planCalories) : undefined,
              });
              setPlanTitle("");
              setPlanCalories("");
              load();
            } catch (err) {
              onError(errMessage(err, "Could not create nutrition plan."));
            }
          }}
        >
          <input className="flex-1 bg-surface border border-border-sleek rounded-xl px-4 py-2" placeholder="Plan title" value={planTitle} onChange={(e) => setPlanTitle(e.target.value)} />
          <input className="w-32 bg-surface border border-border-sleek rounded-xl px-3 py-2" placeholder="kcal/day" value={planCalories} onChange={(e) => setPlanCalories(e.target.value)} />
          <button type="submit" className="btn-viral text-xs py-2 px-4">Create</button>
        </form>
        <form
          className="card-main p-5 flex flex-wrap gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setGenerating(true);
            try {
              onError(null);
              await generateNutritionPlan({ goal: aiGoal.trim() || undefined });
              setAiGoal("");
              load();
            } catch (err) {
              onError(errMessage(err, "Could not generate nutrition plan."));
            } finally {
              setGenerating(false);
            }
          }}
        >
          <input className="flex-1 bg-surface border border-border-sleek rounded-xl px-4 py-2" placeholder="AI goal (optional)" value={aiGoal} onChange={(e) => setAiGoal(e.target.value)} />
          <button type="submit" className="btn-viral text-xs py-2 px-4" disabled={generating}>
            {generating ? "Generating…" : "Generate with AI"}
          </button>
        </form>
        {plans.length === 0 ? (
          <EmptyBox text="No nutrition plans yet." />
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="card-main p-5 space-y-1">
              <h3 className="font-black">{plan.title}</h3>
              <p className="text-xs text-text-muted">
                {[plan.daily_calorie_target && `${plan.daily_calorie_target} kcal/day`, plan.daily_protein_g && `P ${plan.daily_protein_g}`]
                  .filter(Boolean)
                  .join(" · ") || plan.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MetricsPane({
  onError,
  onChanged,
}: {
  onError: (m: string | null) => void;
  onChanged: () => void;
}) {
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [summary, setSummary] = useState<BodyMetricSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<(typeof metricTypes)[number]>("weight");
  const [value, setValue] = useState("");
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const load = () => {
    setLoading(true);
    Promise.all([getBodyMetrics(), getBodyMetricSummary()])
      .then(([list, sum]) => {
        setMetrics(list);
        setSummary(sum);
      })
      .catch((e) => onError(errMessage(e, "Could not load metrics.")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) {
    return <div className="text-center py-20 text-text-muted animate-pulse font-black uppercase tracking-[0.2em]">Loading metrics...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="card-main p-5">
        {summary?.computed_bmi != null ? (
          <p className="font-black">Computed BMI: {summary.computed_bmi} <span className="text-xs font-medium text-text-muted">(from latest weight + height — not stored unless you log BMI yourself)</span></p>
        ) : (
          <p className="text-text-muted">BMI appears here once both a weight and a height are logged. Nothing is invented.</p>
        )}
      </div>
      <form
        className="card-main p-5 flex flex-wrap gap-3 items-end"
        onSubmit={async (e) => {
          e.preventDefault();
          const parsed = Number(value);
          if (!value || Number.isNaN(parsed)) return;
          try {
            await createBodyMetric({ type, value: parsed });
            setValue("");
            load();
            onChanged();
          } catch (err) {
            onError(errMessage(err, "Could not log metric."));
          }
        }}
      >
        <select className="bg-surface border border-border-sleek rounded-xl px-4 py-2" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
          {metricTypes.map((t) => (
            <option key={t} value={t}>{t.replaceAll("_", " ")}</option>
          ))}
        </select>
        <input className="bg-surface border border-border-sleek rounded-xl px-4 py-2" placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="submit" className="btn-viral text-xs py-2 px-5">Log metric</button>
      </form>
      {metrics.length === 0 ? (
        <EmptyBox text="No body metrics logged yet." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="card-main p-5 space-y-2">
              <div className="flex justify-between">
                <h3 className="font-black capitalize">{metric.type.replaceAll("_", " ")} {metric.value} {metric.unit}</h3>
                {metric.has_proof && <span className="badge-green text-[10px]">Proof</span>}
              </div>
              {metric.proof?.url && <img src={metric.proof.url} alt="" className="max-h-40 w-full object-cover rounded-xl" />}
              <input
                ref={(el) => { fileRefs.current[metric.id] = el; }}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  try {
                    await uploadWellnessProof(`/body-metrics/${metric.id}/proof`, file);
                    load();
                  } catch (err) {
                    onError(errMessage(err, "Proof upload failed."));
                  }
                }}
              />
              <button type="button" className="text-xs font-bold text-accent" onClick={() => fileRefs.current[metric.id]?.click()}>
                {metric.has_proof ? "Replace proof" : "Add proof"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div className="text-center py-16 bg-surface rounded-[32px] border-2 border-dashed border-border-sleek">
      <p className="text-sm text-text-muted">{text}</p>
    </div>
  );
}
