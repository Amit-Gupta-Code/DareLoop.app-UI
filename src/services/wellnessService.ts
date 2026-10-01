import API from "../api/client";

export interface WellnessProof {
  id: number;
  type: string;
  url: string | null;
  caption: string | null;
  verification_status: string;
  visibility: string;
  uploaded_at: string;
}

export interface WellnessSummary {
  workouts_logged: number;
  meals_logged: number;
  metrics_logged: number;
  last_workout_at: string | null;
  last_meal_at: string | null;
  latest_weight: { value: number; unit: string; recorded_at: string } | null;
  computed_bmi: number | null;
}

export interface Exercise {
  id: number;
  workout_day_id: number;
  sort_order: number;
  name: string;
  sets: number | null;
  reps: number | null;
  rest_seconds: number | null;
  notes: string | null;
}

export interface WorkoutDay {
  id: number;
  day_number: number;
  title: string;
  notes: string | null;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: number;
  title: string;
  notes: string | null;
  status: string;
  days: WorkoutDay[];
}

export interface WorkoutLog {
  id: number;
  workout_plan_id: number | null;
  exercise_id: number | null;
  exercise_name: string;
  logged_at: string;
  sets_completed: number | null;
  reps_completed: number | null;
  weight_kg: number | null;
  duration_seconds: number | null;
  notes: string | null;
  has_proof: boolean;
  proof: WellnessProof | null;
}

export interface NutritionPlan {
  id: number;
  title: string;
  notes: string | null;
  daily_calorie_target: number | null;
  daily_protein_g: number | null;
  daily_carbs_g: number | null;
  daily_fat_g: number | null;
  status: string;
}

export interface FoodEntry {
  id: number;
  meal_id: number;
  name: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  quantity: number | null;
  unit: string | null;
}

export interface Meal {
  id: number;
  nutrition_plan_id: number | null;
  name: string;
  custom_name: string | null;
  eaten_at: string;
  notes: string | null;
  totals: { calories: number; protein_g: number; carbs_g: number; fat_g: number };
  food_entries: FoodEntry[];
  has_proof: boolean;
  proof: WellnessProof | null;
}

export interface BodyMetric {
  id: number;
  type: string;
  value: number;
  unit: string;
  recorded_at: string;
  notes: string | null;
  has_proof: boolean;
  proof: WellnessProof | null;
}

export interface BodyMetricSummary {
  latest: Record<string, BodyMetric | null>;
  computed_bmi: number | null;
}

const dataOf = <T>(res: { data: { data: T } }) => res.data.data;

export const getWellnessSummary = async () =>
  dataOf<WellnessSummary>(await API.get("/wellness/summary"));

export const getWorkoutPlans = async () =>
  dataOf<WorkoutPlan[]>(await API.get("/workout-plans"));

export const createWorkoutPlan = async (title: string) =>
  dataOf<WorkoutPlan>(await API.post("/workout-plans", { title }));

export const generateWorkoutPlan = async (payload?: {
  focus?: string;
  duration_days?: number;
  prompt?: string;
}) => {
  const data = dataOf<{ plan: WorkoutPlan; generated_from: string }>(
    await API.post("/workout-plans/generate", payload ?? {}),
  );
  return data.plan;
};

export const addWorkoutDay = async (planId: number, title: string) =>
  dataOf<WorkoutDay>(await API.post(`/workout-plans/${planId}/days`, { title }));

export const addExercise = async (
  planId: number,
  dayId: number,
  payload: { name: string; sets?: number; reps?: number },
) =>
  dataOf<Exercise>(
    await API.post(`/workout-plans/${planId}/days/${dayId}/exercises`, payload),
  );

export const getWorkoutLogs = async () =>
  dataOf<WorkoutLog[]>(await API.get("/workout-logs"));

export const createWorkoutLog = async (payload: {
  exercise_name: string;
  sets_completed?: number;
  reps_completed?: number;
  weight_kg?: number;
}) => dataOf<WorkoutLog>(await API.post("/workout-logs", payload));

export const getNutritionPlans = async () =>
  dataOf<NutritionPlan[]>(await API.get("/nutrition-plans"));

export const createNutritionPlan = async (payload: {
  title: string;
  daily_calorie_target?: number;
}) => dataOf<NutritionPlan>(await API.post("/nutrition-plans", payload));

export const generateNutritionPlan = async (payload?: {
  goal?: string;
  prompt?: string;
}) => {
  const data = dataOf<{
    plan: NutritionPlan;
    generated_from: string;
    suggested_meals: { name: string; items: string | null; calories: number | null }[];
  }>(await API.post("/nutrition-plans/generate", payload ?? {}));
  return data;
};

export const getMeals = async () => dataOf<Meal[]>(await API.get("/meals"));

export const createMeal = async (payload: { name: string; custom_name?: string }) =>
  dataOf<Meal>(await API.post("/meals", payload));

export const addFoodEntry = async (
  mealId: number,
  payload: { name: string; calories?: number; protein_g?: number },
) => dataOf<FoodEntry>(await API.post(`/meals/${mealId}/food-entries`, payload));

export const getBodyMetrics = async () =>
  dataOf<BodyMetric[]>(await API.get("/body-metrics"));

export const getBodyMetricSummary = async () =>
  dataOf<BodyMetricSummary>(await API.get("/body-metrics/summary"));

export const createBodyMetric = async (payload: {
  type: string;
  value: number;
  unit?: string;
}) => dataOf<BodyMetric>(await API.post("/body-metrics", payload));

export const uploadWellnessProof = async (path: string, file: File, note?: string) => {
  const form = new FormData();
  form.append("proof", file);
  if (note?.trim()) form.append("note", note.trim());
  const { data } = await API.post(path, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
