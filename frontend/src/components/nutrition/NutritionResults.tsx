import type React from "react";
import { Check, CircleHelp, Flame, Salad, Utensils } from "lucide-react";
import { NutritionTile } from "./NutritionTile";
import { FoodRow } from "./FoodRow";
import type { FullNutritionAnalysis, Photo } from "./types";

export type NutritionResultsProps = {
  analysis: FullNutritionAnalysis;
  photo: Photo;
  isAnalyzing: boolean;
};

export function NutritionResults({ analysis, photo, isAnalyzing }: NutritionResultsProps) {
  const hasItems = analysis.items.length > 0;

  return (
    <section
      className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5"
      aria-label="Nutrition results"
      aria-live="polite"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-success px-2.5 py-1 text-[11px] font-semibold text-success-foreground">
            <Check size={13} />
            {photo.isSample ? "Example estimate" : hasItems ? "Meal analyzed" : "Ready to scan"}
          </div>
          <h2 className="font-display text-2xl leading-tight">{analysis.mealName}</h2>
          <p className="mt-1.5 text-sm leading-5 text-muted-foreground">{analysis.summary}</p>
        </div>
        <span
          className="food-dot"
          style={
            {
              "--food-tint": "var(--success)",
              "--food-color": "var(--success-foreground)",
            } as React.CSSProperties
          }
        >
          <Salad size={19} />
        </span>
      </div>

      {isAnalyzing ? (
        <div className="mb-4 space-y-3 rounded-md border border-border p-4">
          <div className="h-8 w-28 rounded bg-muted" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 rounded bg-muted" />
            <div className="h-16 rounded bg-muted" />
          </div>
        </div>
      ) : !analysis.isFood ? (
        <div className="mb-4 rounded-md border border-border bg-muted/40 px-4 py-6 text-center">
          <CircleHelp size={24} className="mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm font-semibold">No food spotted</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a brighter photo with the food in view.
          </p>
        </div>
      ) : hasItems ? (
        <>
          <div className="mb-3 flex items-center justify-between rounded-md bg-primary px-4 py-3.5 text-primary-foreground">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-80">
                Estimated energy
              </p>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tabular-nums">
                  {analysis.totals.calories.toLocaleString()}
                </span>
                <span className="text-sm font-medium opacity-90">kcal total</span>
              </div>
            </div>
            <span className="calorie-disc">
              <Flame size={22} />
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <NutritionTile
              label="Protein"
              amount={analysis.totals.proteinGrams}
              unit="g"
              tone="protein"
            />
            <NutritionTile
              label="Carbs"
              amount={analysis.totals.carbsGrams}
              unit="g"
              tone="carbohydrate"
            />
            <NutritionTile label="Fat" amount={analysis.totals.fatGrams} unit="g" tone="fat" />
            <NutritionTile
              label="Fiber"
              amount={analysis.totals.fiberGrams}
              unit="g"
              tone="fiber"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-border pb-4 text-xs text-muted-foreground">
            <span>
              Sugars{" "}
              <strong className="font-semibold text-foreground">
                {analysis.totals.sugarGrams} g
              </strong>
            </span>
            <span>
              Sodium{" "}
              <strong className="font-semibold text-foreground">
                {analysis.totals.sodiumMilligrams} mg
              </strong>
            </span>
            <span className="ml-auto inline-flex items-center gap-1">
              <CircleHelp size={12} /> Estimated values
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">What’s on your plate</h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                {analysis.items.length}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">Portion estimates</span>
          </div>
          <div className="mt-2 divide-y divide-border">
            {analysis.items.map((item, index) => (
              <FoodRow key={`${item.name}-${index}`} item={item} index={index} />
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-md bg-muted/55 p-3 text-[11px] leading-4 text-muted-foreground">
            <CircleHelp size={14} className="mt-0.5 shrink-0" />
            <p>
              Photo-based estimates can vary with ingredients and portion size. Check packaging or a
              nutrition professional for precise values.
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-md border border-dashed border-border bg-muted/30 px-4 py-5 text-center">
          <Utensils size={22} className="mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm font-semibold">Your plate is ready</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Scan the photo to see calories and nutrition for each dish.
          </p>
        </div>
      )}
    </section>
  );
}
