import { Check, MoreHorizontal, Plus, Trash2, Utensils, RotateCcw } from "lucide-react";
import type { LoggedMeal } from "./dashboard-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TodayIntakeTimelineProps {
  meals: LoggedMeal[];
  activeMealId?: string | undefined;
  onSelectMeal: (meal: LoggedMeal) => void;
  onDeleteMeal?: ((mealId: string) => void) | undefined;
  onClearLog?: (() => void) | undefined;
  onResetDemo?: (() => void) | undefined;
  eveningSuggestion: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  isEveningSuggestionLogged: boolean;
  onLogEveningSuggestion: () => void;
  onAddCustomMeal?: (() => void) | undefined;
}

export function TodayIntakeTimeline({
  meals,
  activeMealId,
  onSelectMeal,
  onDeleteMeal,
  onClearLog,
  onResetDemo,
  eveningSuggestion,
  isEveningSuggestionLogged,
  onLogEveningSuggestion,
  onAddCustomMeal,
}: TodayIntakeTimelineProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-neutral-900 sm:text-lg dark:text-neutral-100">
              Today's Intake
            </h2>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
              {meals.length} {meals.length === 1 ? "meal" : "meals"}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                aria-label="Intake options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onAddCustomMeal} className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4 text-neutral-500" />
                <span>Add custom meal</span>
              </DropdownMenuItem>

              {onResetDemo && (
                <DropdownMenuItem onClick={onResetDemo} className="cursor-pointer">
                  <RotateCcw className="mr-2 h-4 w-4 text-neutral-500" />
                  <span>Reset demo log</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={onClearLog}
                className="cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40"
              >
                <Trash2 className="mr-2 h-4 w-4 text-rose-600" />
                <span>Clear today's log</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Empty state when all meals cleared */}
        {meals.length === 0 ? (
          <div className="my-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/70 p-6 text-center dark:border-neutral-800 dark:bg-neutral-850/50">
            <div className="rounded-full bg-white p-3 shadow-2xs dark:bg-neutral-800">
              <Utensils className="h-5 w-5 text-neutral-400" />
            </div>
            <p className="mt-2.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
              No meals logged for today
            </p>
            <p className="mt-0.5 max-w-xs text-[11px] text-neutral-500 dark:text-neutral-400">
              Your log is clear. Scan a photo with AI vision or log a dish to track your macros.
            </p>
            <div className="mt-3.5 flex gap-2">
              <button
                type="button"
                onClick={onAddCustomMeal}
                className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition active:scale-95 dark:bg-teal-600 dark:hover:bg-teal-700"
              >
                <Plus className="h-3.5 w-3.5 text-orange-500 dark:text-orange-300" />
                <span>Scan Meal</span>
              </button>
              {onResetDemo && (
                <button
                  type="button"
                  onClick={onResetDemo}
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 transition dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  Restore Demo
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Timeline list */
          <div className="relative mt-4 space-y-3.5">
            {/* Vertical connecting line */}
            <div className="absolute bottom-5 left-[7px] top-4 w-0.5 bg-neutral-200 dark:bg-neutral-800" />

            {meals.map((meal) => {
              const isActive = activeMealId === meal.id;

              return (
                <div
                  key={meal.id}
                  onClick={() => onSelectMeal(meal)}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-xl p-1.5 transition-all ${
                    isActive
                      ? "bg-neutral-100/90 shadow-2xs ring-1 ring-neutral-300/80 dark:bg-neutral-800/80 dark:ring-neutral-700"
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Timeline Dot */}
                    <div
                      className="relative z-10 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white shadow-xs dark:border-neutral-900"
                      style={{
                        backgroundColor: meal.dotColor || "#0d9488",
                      }}
                    />

                    {/* Meal Thumbnail */}
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800"
                    />

                    {/* Title & Slot */}
                    <div>
                      <div className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                        {meal.slot}
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {meal.name}
                      </div>
                    </div>
                  </div>

                  {/* Calories & Action */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {meal.calories} kcal
                    </span>

                    {/* Per-meal delete button */}
                    {onDeleteMeal && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMeal(meal.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 rounded-md p-1 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                        title="Delete meal"
                        aria-label={`Delete ${meal.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Evening Suggestion Callout */}
      <div className="mt-5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          AI Evening Suggestion
        </div>

        <div className="flex items-center justify-between rounded-xl border border-neutral-200/60 bg-neutral-100/90 px-3.5 py-2.5 dark:border-neutral-800 dark:bg-neutral-800/60">
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 sm:text-sm">
            {eveningSuggestion.name} - {eveningSuggestion.calories} kcal
          </span>

          {isEveningSuggestionLogged ? (
            <div className="flex items-center gap-1 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
              <Check className="h-3 w-3" />
              <span>Logged</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLogEveningSuggestion}
              className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-800 shadow-2xs transition hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              <Plus className="h-3 w-3" />
              <span>Log</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
