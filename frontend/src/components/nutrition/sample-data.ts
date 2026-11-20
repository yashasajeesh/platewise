import sampleThaliImage from "@/assets/indian-thali-example.jpg";
import { sumNutrition, type NutritionItem } from "@/lib/nutrition-schema";
import type { FullNutritionAnalysis } from "./types";

export const sampleThali = sampleThaliImage;

export const sampleItems: NutritionItem[] = [
  {
    name: "Yellow dal",
    serving: "1 katori · about 180 g",
    calories: 165,
    proteinGrams: 9,
    carbsGrams: 22,
    fatGrams: 4,
    fiberGrams: 6,
    sugarGrams: 2,
    sodiumMilligrams: 320,
    confidence: 0.92,
  },
  {
    name: "Palak paneer",
    serving: "1 katori · about 160 g",
    calories: 210,
    proteinGrams: 12,
    carbsGrams: 9,
    fatGrams: 14,
    fiberGrams: 2,
    sugarGrams: 3,
    sodiumMilligrams: 390,
    confidence: 0.89,
  },
  {
    name: "Basmati rice",
    serving: "1 cup · about 160 g",
    calories: 185,
    proteinGrams: 4,
    carbsGrams: 40,
    fatGrams: 0.4,
    fiberGrams: 1,
    sugarGrams: 0.1,
    sodiumMilligrams: 5,
    confidence: 0.96,
  },
  {
    name: "Whole-wheat roti",
    serving: "2 rotis · about 100 g",
    calories: 210,
    proteinGrams: 6,
    carbsGrams: 40,
    fatGrams: 3,
    fiberGrams: 5,
    sugarGrams: 1,
    sodiumMilligrams: 260,
    confidence: 0.88,
  },
  {
    name: "Raita",
    serving: "½ cup · about 100 g",
    calories: 70,
    proteinGrams: 4,
    carbsGrams: 6,
    fatGrams: 3,
    fiberGrams: 0,
    sugarGrams: 5,
    sodiumMilligrams: 75,
    confidence: 0.91,
  },
  {
    name: "Papad, chutney & salad",
    serving: "1 papad with small sides",
    calories: 85,
    proteinGrams: 3,
    carbsGrams: 12,
    fatGrams: 2,
    fiberGrams: 2,
    sugarGrams: 2,
    sodiumMilligrams: 285,
    confidence: 0.78,
  },
];

export const sampleAnalysis: FullNutritionAnalysis = {
  isFood: true,
  mealName: "A little bit of everything",
  summary: "A balanced thali with lentils, leafy greens, rice, roti and cool raita.",
  items: sampleItems,
  totals: sumNutrition(sampleItems),
};
