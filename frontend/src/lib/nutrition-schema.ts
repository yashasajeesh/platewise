import { z } from "zod";

export const nutritionItemSchema = z.object({
  name: z.string().min(1).max(80),
  serving: z.string().min(1).max(80),
  calories: z.number().int().nonnegative().max(5000),
  proteinGrams: z.number().nonnegative().max(500),
  carbsGrams: z.number().nonnegative().max(1000),
  fatGrams: z.number().nonnegative().max(500),
  fiberGrams: z.number().nonnegative().max(250),
  sugarGrams: z.number().nonnegative().max(500),
  sodiumMilligrams: z.number().int().nonnegative().max(30000),
  confidence: z.number().min(0).max(1),
});

export const nutritionResponseSchema = z
  .object({
    isFood: z.boolean(),
    mealName: z.string().min(1).max(100),
    summary: z.string().min(1).max(240),
    items: z.array(nutritionItemSchema).max(12),
  })
  .superRefine((analysis, context) => {
    if (analysis.isFood && analysis.items.length === 0) {
      context.addIssue({
        code: "custom",
        message: "Food analysis must include at least one item.",
      });
    }
    if (!analysis.isFood && analysis.items.length > 0) {
      context.addIssue({ code: "custom", message: "Non-food analysis cannot include food items." });
    }
  });

export type NutritionItem = z.infer<typeof nutritionItemSchema>;
export type NutritionResponse = z.infer<typeof nutritionResponseSchema>;

export function sumNutrition(items: NutritionItem[]) {
  const total = items.reduce(
    (sum, item) => ({
      calories: sum.calories + item.calories,
      proteinGrams: sum.proteinGrams + item.proteinGrams,
      carbsGrams: sum.carbsGrams + item.carbsGrams,
      fatGrams: sum.fatGrams + item.fatGrams,
      fiberGrams: sum.fiberGrams + item.fiberGrams,
      sugarGrams: sum.sugarGrams + item.sugarGrams,
      sodiumMilligrams: sum.sodiumMilligrams + item.sodiumMilligrams,
    }),
    {
      calories: 0,
      proteinGrams: 0,
      carbsGrams: 0,
      fatGrams: 0,
      fiberGrams: 0,
      sugarGrams: 0,
      sodiumMilligrams: 0,
    },
  );

  return {
    ...total,
    proteinGrams: Number(total.proteinGrams.toFixed(1)),
    carbsGrams: Number(total.carbsGrams.toFixed(1)),
    fatGrams: Number(total.fatGrams.toFixed(1)),
    fiberGrams: Number(total.fiberGrams.toFixed(1)),
    sugarGrams: Number(total.sugarGrams.toFixed(1)),
  };
}
