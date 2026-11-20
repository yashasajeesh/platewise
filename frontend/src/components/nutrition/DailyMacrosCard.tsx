import { Sliders } from "lucide-react";
import type { MacroGoals, MicroGoals, MicrosConsumed } from "./dashboard-types";

interface DailyMacrosCardProps {
  caloriesConsumed: number;
  goals: MacroGoals;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  micros?: MicrosConsumed | undefined;
  microGoals?: MicroGoals | undefined;
  onEditGoals?: (() => void) | undefined;
}

export function DailyMacrosCard({
  caloriesConsumed,
  goals,
  proteinConsumed,
  carbsConsumed,
  fatConsumed,
  micros = {
    fiber: 24,
    sodium: 1140,
    potassium: 2520,
    calcium: 780,
    iron: 13.3,
    vitaminC: 68,
  },
  microGoals = {
    fiber: 30,
    sodium: 2300,
    potassium: 3400,
    calcium: 1000,
    iron: 18,
    vitaminC: 90,
  },
  onEditGoals,
}: DailyMacrosCardProps) {
  const caloriesLeft = goals.calories - caloriesConsumed;
  const isSurplus = caloriesLeft < 0;

  // Gauge calculations for ~260-degree arc
  const radius = 56;
  const totalArcRatio = 0.75; // 270 degrees
  const fullArcLength = 2 * Math.PI * radius * totalArcRatio; // ~263.89
  const progressRatio = Math.min(Math.max(caloriesConsumed / goals.calories, 0), 1.15);
  const strokeDashoffset = fullArcLength - progressRatio * fullArcLength;

  // Percentage calculations for macro bars
  const proteinPercent = Math.min(Math.round((proteinConsumed / goals.protein) * 100), 100);
  const carbsPercent = Math.min(Math.round((carbsConsumed / goals.carbs) * 100), 100);
  const fatPercent = Math.min(Math.round((fatConsumed / goals.fat) * 100), 100);

  // Percentage calculations for key micros
  const fiberPercent = Math.min(Math.round((micros.fiber / microGoals.fiber) * 100), 100);
  const sodiumPercent = Math.min(Math.round((micros.sodium / microGoals.sodium) * 100), 100);
  const potassiumPercent = Math.min(
    Math.round((micros.potassium / microGoals.potassium) * 100),
    100,
  );
  const ironPercent = Math.min(Math.round((micros.iron / microGoals.iron) * 100), 100);

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-neutral-900 sm:text-lg dark:text-neutral-100">
          Daily Energy, Macros & Micros
        </h2>
        {onEditGoals ? (
          <button
            type="button"
            onClick={onEditGoals}
            className="group flex items-center gap-1.5 rounded-lg border border-neutral-200/80 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-700 transition dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-300 dark:hover:border-teal-700 dark:hover:bg-teal-950/40"
            title="Edit targets or calculate with BMI"
          >
            <span>Target: {goals.calories.toLocaleString()} kcal</span>
            <Sliders className="h-3 w-3 text-neutral-400 group-hover:text-teal-600 transition dark:text-neutral-500 dark:group-hover:text-teal-400" />
          </button>
        ) : (
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Target: {goals.calories.toLocaleString()} kcal
          </span>
        )}
      </div>

      <div className="my-auto grid grid-cols-1 items-center gap-6 pt-4 sm:grid-cols-[auto_1fr] sm:gap-8">
        {/* Left: Radial Gauge */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative h-44 w-44">
            <svg className="h-full w-full -rotate-225" viewBox="0 0 140 140">
              {/* Background Track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                className="stroke-neutral-100 dark:stroke-neutral-800"
                strokeWidth="11"
                strokeDasharray={`${fullArcLength} 400`}
                strokeLinecap="round"
              />

              {/* Progress Arc */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#0d9488"
                strokeWidth="11"
                strokeDasharray={`${fullArcLength} 400`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inner Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {caloriesConsumed.toLocaleString()}
              </span>
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">kcal consumed</span>
              <div className="mt-2 rounded-full border border-neutral-200/80 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700 shadow-2xs dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                {isSurplus ? `+${Math.abs(caloriesLeft)} surplus` : `${caloriesLeft} left`}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Macro Progress Bars */}
        <div className="flex flex-col justify-center space-y-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Macronutrients
          </div>

          {/* Protein */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-medium">
              <span className="text-neutral-700 dark:text-neutral-300">Protein</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {proteinConsumed}g / {goals.protein}g
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-[#0d9488] transition-all duration-700 ease-out"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-medium">
              <span className="text-neutral-700 dark:text-neutral-300">Carbs</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {carbsConsumed}g / {goals.carbs}g
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-[#f06543] transition-all duration-700 ease-out"
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
          </div>

          {/* Fats */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-medium">
              <span className="text-neutral-700 dark:text-neutral-300">Fats</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {fatConsumed}g / {goals.fat}g
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-[#99f6e4] transition-all duration-700 ease-out"
                style={{ width: `${fatPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Micronutrients Strip */}
      <div className="mt-5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
        <div className="mb-2.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <span>Key Micronutrients</span>
          <span className="text-[10px] lowercase font-normal text-neutral-600 dark:text-neutral-400">daily values</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {/* Fiber */}
          <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-2 text-center dark:border-neutral-800 dark:bg-neutral-800/50">
            <span className="block text-[10px] font-medium text-neutral-600 dark:text-neutral-400">Fiber</span>
            <span className="font-bold text-neutral-900 text-xs dark:text-neutral-100">
              {micros.fiber}g{" "}
              <span className="text-[10px] text-neutral-600 dark:text-neutral-400">/ {microGoals.fiber}g</span>
            </span>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full bg-teal-600 rounded-full transition-all"
                style={{ width: `${fiberPercent}%` }}
              />
            </div>
          </div>

          {/* Sodium */}
          <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-2 text-center dark:border-neutral-800 dark:bg-neutral-800/50">
            <span className="block text-[10px] font-medium text-neutral-600 dark:text-neutral-400">Sodium</span>
            <span className="font-bold text-neutral-900 text-xs dark:text-neutral-100">
              {micros.sodium}mg <span className="text-[10px] text-neutral-600 dark:text-neutral-400">/ max</span>
            </span>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full bg-sky-500 rounded-full transition-all"
                style={{ width: `${sodiumPercent}%` }}
              />
            </div>
          </div>

          {/* Potassium */}
          <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-2 text-center dark:border-neutral-800 dark:bg-neutral-800/50">
            <span className="block text-[10px] font-medium text-neutral-600 dark:text-neutral-400">Potassium</span>
            <span className="font-bold text-neutral-900 text-xs dark:text-neutral-100">{micros.potassium}mg</span>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${potassiumPercent}%` }}
              />
            </div>
          </div>

          {/* Iron */}
          <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-2 text-center dark:border-neutral-800 dark:bg-neutral-800/50">
            <span className="block text-[10px] font-medium text-neutral-600 dark:text-neutral-400">Iron</span>
            <span className="font-bold text-neutral-900 text-xs dark:text-neutral-100">
              {micros.iron}mg{" "}
              <span className="text-[10px] text-neutral-600 dark:text-neutral-400">/ {microGoals.iron}mg</span>
            </span>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full bg-pink-500 rounded-full transition-all"
                style={{ width: `${ironPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
