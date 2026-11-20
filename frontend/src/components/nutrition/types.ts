import type { NutritionResponse, sumNutrition } from "@/lib/nutrition-schema";

export type Photo = {
  src: string;
  file: File | null;
  isSample: boolean;
};

export type FullNutritionAnalysis = NutritionResponse & {
  totals: ReturnType<typeof sumNutrition>;
};
