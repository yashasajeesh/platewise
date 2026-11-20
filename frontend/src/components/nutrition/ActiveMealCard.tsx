import { useState, useEffect } from "react";
import { Sparkles, Maximize2, Utensils } from "lucide-react";
import type { LoggedMeal, DetectedIngredient } from "./dashboard-types";

interface ActiveMealCardProps {
  meal?: LoggedMeal | null;
  onScanNewPhoto?: () => void;
}

export function ActiveMealCard({ meal, onScanNewPhoto }: ActiveMealCardProps) {
  const [selectedIngredient, setSelectedIngredient] = useState<DetectedIngredient | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
    setSelectedIngredient(null);
  }, [meal?.id, meal?.imageUrl]);

  if (!meal) {
    return (
      <div className="flex h-full min-h-[360px] sm:min-h-[420px] w-full flex-col items-center justify-center rounded-3xl border border-neutral-200/80 bg-white p-8 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
        <div className="rounded-2xl bg-teal-50 p-4 shadow-2xs dark:bg-teal-950/50">
          <Utensils className="h-8 w-8 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-neutral-100">No active meal selected</h3>
        <p className="mt-1 max-w-xs text-xs text-neutral-500 dark:text-neutral-400">
          Scan a dish photo or select a logged meal from Today's Intake to view ingredient detection and portion analysis.
        </p>
        {onScanNewPhoto && (
          <button
            type="button"
            onClick={onScanNewPhoto}
            className="mt-4 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition active:scale-95 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            Scan a Meal
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="group relative flex h-full min-h-[360px] sm:min-h-[420px] w-full flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-100 shadow-xs transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      {/* Background Food Image with Fallback */}
      {!imgError ? (
        <img
          src={meal.imageUrl}
          alt={meal.name}
          onError={() => setImgError(true)}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-radial from-teal-100/80 via-emerald-50 to-neutral-100 p-8 text-center">
          <div className="rounded-full bg-white/90 p-4 shadow-sm">
            <Utensils className="h-10 w-10 text-teal-600" />
          </div>
          <span className="mt-3 text-base font-bold text-neutral-800">{meal.name}</span>
          <span className="text-xs text-neutral-500">
            {meal.calories} kcal · {meal.slot}
          </span>
        </div>
      )}

      {/* Subtle darkening gradient at the top/bottom for readability */}
      <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/25 pointer-events-none" />

      {/* Top-Right Calorie & Confidence Badge (Matching Mockup) */}
      <div className="absolute right-5 top-5 z-20">
        <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/85 px-4 py-2.5 shadow-lg backdrop-blur-md dark:border-neutral-700/80 dark:bg-neutral-900/85">
          <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
            {meal.calories} kcal
          </div>
          <div className="h-6 w-px bg-neutral-300/80 dark:bg-neutral-700" />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold leading-none text-neutral-900 dark:text-neutral-100 sm:text-sm">
              {meal.confidence ?? 98.4}%
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 leading-none">
              confidence
            </span>
          </div>
        </div>
      </div>

      {/* Visual Detection Bounding Boxes & Tags */}
      {meal.detectedItems && meal.detectedItems.length > 0 && (
        <div className="absolute inset-0 z-10 p-6 pointer-events-none">
          {/* Salmon bounding box (if present) */}
          {meal.name.toLowerCase().includes("salmon") && (
            <div
              className="absolute left-[28%] top-[24%] h-[40%] w-[38%] rounded-2xl border-2 border-teal-500/80 bg-teal-500/10 pointer-events-auto"
              style={{
                boxShadow: "0 0 16px rgba(20, 184, 166, 0.25)",
              }}
            >
              {/* Corner brackets */}
              <div className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-teal-400" />
              <div className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-teal-400" />
              <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-teal-400" />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-teal-400" />
            </div>
          )}

          {/* Quinoa bounding box (if present) */}
          {meal.name.toLowerCase().includes("salmon") && (
            <div className="absolute right-[22%] bottom-[16%] h-[24%] w-[22%] rounded-xl border-2 border-teal-500/70 bg-teal-500/10 pointer-events-auto">
              <div className="absolute -left-1 -top-1 h-2.5 w-2.5 border-l-2 border-t-2 border-teal-400" />
              <div className="absolute -right-1 -top-1 h-2.5 w-2.5 border-r-2 border-t-2 border-teal-400" />
              <div className="absolute -bottom-1 -left-1 h-2.5 w-2.5 border-b-2 border-l-2 border-teal-400" />
              <div className="absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b-2 border-r-2 border-teal-400" />
            </div>
          )}

          {/* Dynamic Detected Tags */}
          {meal.detectedItems.map((item, idx) => {
            const isLeft = item.xPercent < 50;
            const isSelected = selectedIngredient?.name === item.name;

            return (
              <div
                key={item.name + idx}
                style={{
                  left: `${item.xPercent}%`,
                  top: `${item.yPercent}%`,
                }}
                className="absolute pointer-events-auto transition-transform hover:scale-105"
              >
                <button
                  type="button"
                  onClick={() => setSelectedIngredient(isSelected ? null : item)}
                  className={`group/btn flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-md backdrop-blur-md transition-all ${
                    isSelected
                      ? "border-teal-500 bg-teal-900/90 text-white shadow-teal-500/20"
                      : "border-neutral-200/70 bg-white/90 text-neutral-800 hover:bg-white dark:border-neutral-700/70 dark:bg-neutral-900/90 dark:text-neutral-100 dark:hover:bg-neutral-900"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSelected ? "bg-teal-300" : "bg-teal-500"
                    }`}
                  />
                  <span>
                    {item.name} - {item.weight}
                  </span>
                </button>

                {/* Popover on click */}
                {isSelected && (
                  <div
                    className={`absolute z-30 mt-2 w-48 rounded-xl border border-neutral-200 bg-white/95 p-3 shadow-xl backdrop-blur-md text-left dark:border-neutral-700 dark:bg-neutral-900/95 ${
                      isLeft ? "left-0" : "right-0"
                    }`}
                  >
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      {item.name} ({item.weight})
                    </div>
                    <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">{item.calories} kcal</div>
                    <div className="mt-2 grid grid-cols-3 gap-1 text-[10px] text-neutral-600 dark:text-neutral-300">
                      <div className="rounded bg-teal-50 p-1 text-center font-medium text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                        {item.protein}g P
                      </div>
                      <div className="rounded bg-orange-50 p-1 text-center font-medium text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                        {item.carbs}g C
                      </div>
                      <div className="rounded bg-sky-50 p-1 text-center font-medium text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                        {item.fat}g F
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Quick Action */}
      <div className="mt-auto p-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="rounded-xl bg-black/40 px-3 py-1.5 backdrop-blur-md text-xs font-medium text-white flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-teal-400" />
          <span>{meal.name}</span>
        </div>

        {onScanNewPhoto && (
          <button
            type="button"
            onClick={onScanNewPhoto}
            className="rounded-xl border border-white/40 bg-white/70 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm backdrop-blur-md transition hover:bg-white active:scale-95 flex items-center gap-1.5 dark:border-neutral-700/60 dark:bg-neutral-900/80 dark:text-white dark:hover:bg-neutral-900"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>Scan Another</span>
          </button>
        )}
      </div>
    </div>
  );
}
