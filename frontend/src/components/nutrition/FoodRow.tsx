import type React from "react";
import { Utensils } from "lucide-react";
import type { NutritionItem } from "@/lib/nutrition-schema";

export type FoodRowProps = {
  item: NutritionItem;
  index: number;
};

const palette = [
  { color: "var(--protein)", tint: "color-mix(in oklab, var(--protein) 12%, var(--card))" },
  {
    color: "var(--carbohydrate)",
    tint: "color-mix(in oklab, var(--carbohydrate) 13%, var(--card))",
  },
  { color: "var(--fiber)", tint: "color-mix(in oklab, var(--fiber) 12%, var(--card))" },
  { color: "var(--fat)", tint: "color-mix(in oklab, var(--fat) 12%, var(--card))" },
];

export function FoodRow({ item, index }: FoodRowProps) {
  const color = palette[index % palette.length] ?? {
    color: "var(--protein)",
    tint: "color-mix(in oklab, var(--protein) 12%, var(--card))",
  };

  return (
    <div className="flex items-center gap-3 py-3">
      <span
        className="food-dot"
        style={
          {
            "--food-tint": color.tint,
            "--food-color": color.color,
          } as React.CSSProperties
        }
      >
        <Utensils size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{item.name}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {item.serving} · P {item.proteinGrams} g · C {item.carbsGrams} g · F {item.fatGrams} g
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold tabular-nums">
          {item.calories}{" "}
          <span className="text-[10px] font-medium text-muted-foreground">kcal</span>
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {Math.round(item.confidence * 100)}% match
        </p>
      </div>
    </div>
  );
}
