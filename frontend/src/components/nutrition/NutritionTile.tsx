export type NutritionTileProps = {
  label: string;
  amount: number;
  unit: string;
  tone: "protein" | "carbohydrate" | "fat" | "fiber";
};

const toneClasses = {
  protein: "bg-protein",
  carbohydrate: "bg-carbohydrate",
  fat: "bg-fat",
  fiber: "bg-fiber",
};

export function NutritionTile({ label, amount, unit, tone }: NutritionTileProps) {
  return (
    <div className="nutrition-tile">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <span className={`h-2 w-2 rounded-full ${toneClasses[tone]}`} />
        {label}
      </div>
      <p className="mt-1 text-lg font-bold tabular-nums">
        {amount} <span className="text-xs font-medium text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}
