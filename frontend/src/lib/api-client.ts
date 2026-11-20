import type { NutritionResponse, NutritionItem } from "./nutrition-schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface AnalyzeResponse {
  ok: boolean;
  data?: NutritionResponse & {
    totals: {
      calories: number;
      proteinGrams: number;
      carbsGrams: number;
      fatGrams: number;
      fiberGrams: number;
      sugarGrams: number;
      sodiumMilligrams: number;
    };
  };
  error?: string;
}

export async function analyzeNutritionApi(imageDataUrl: string): Promise<
  NutritionResponse & {
    totals: {
      calories: number;
      proteinGrams: number;
      carbsGrams: number;
      fatGrams: number;
      fiberGrams: number;
      sugarGrams: number;
      sodiumMilligrams: number;
    };
  }
> {
  const endpoint = `${API_BASE_URL}/api/nutrition/analyze`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageDataUrl }),
  });

  const json: AnalyzeResponse = await res.json();

  if (!res.ok || !json.ok || !json.data) {
    throw new Error(
      json.error || `Server responded with error status ${res.status}: Failed to analyze meal photo.`
    );
  }

  return json.data;
}
