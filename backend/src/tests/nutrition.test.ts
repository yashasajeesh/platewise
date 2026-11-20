import { describe, expect, it } from "vitest";
import {
  extractImageData,
  NUTRITION_RESPONSE_SCHEMA,
} from "../services/nutrition.server.js";
import {
  nutritionResponseSchema,
  sumNutrition,
} from "../schemas/nutrition-schema.js";

describe("Backend Nutrition Vision & Schema Unit Tests", () => {
  it("sums nutrition values correctly across dishes", () => {
    const items = [
      {
        name: "Steamed Basmati Rice",
        serving: "150g",
        calories: 195,
        proteinGrams: 4.1,
        carbsGrams: 42.5,
        fatGrams: 0.6,
        fiberGrams: 0.9,
        sugarGrams: 0.1,
        sodiumMilligrams: 2,
        confidence: 0.95,
      },
      {
        name: "Yellow Dal Tadka",
        serving: "180g",
        calories: 170,
        proteinGrams: 9.2,
        carbsGrams: 22.8,
        fatGrams: 4.5,
        fiberGrams: 4.8,
        sugarGrams: 1.2,
        sodiumMilligrams: 480,
        confidence: 0.92,
      },
    ];

    const totals = sumNutrition(items);
    expect(totals.calories).toBe(365);
    expect(totals.proteinGrams).toBe(13.3);
    expect(totals.carbsGrams).toBe(65.3);
    expect(totals.fatGrams).toBe(5.1);
    expect(totals.sodiumMilligrams).toBe(482);
  });

  it("extracts base64 data and mimeType accurately", () => {
    const jpegDataUrl = "data:image/jpeg;base64,QUJDREVGRw==";
    const extracted = extractImageData(jpegDataUrl);
    expect(extracted.mimeType).toBe("image/jpeg");
    expect(extracted.base64Data).toBe("QUJDREVGRw==");

    const pngDataUrl = "data:image/png;base64,UE5HR0RBVEE=";
    const extractedPng = extractImageData(pngDataUrl);
    expect(extractedPng.mimeType).toBe("image/png");
    expect(extractedPng.base64Data).toBe("UE5HR0RBVEE=");
  });

  it("validates food response schema with positive items array", () => {
    const validData = {
      isFood: true,
      mealName: "Salmon Quinoa Bowl",
      summary: "Nutritious grilled salmon bowl with avocado and quinoa.",
      items: [
        {
          name: "Grilled Salmon",
          serving: "150g",
          calories: 310,
          proteinGrams: 34,
          carbsGrams: 0,
          fatGrams: 18,
          fiberGrams: 0,
          sugarGrams: 0,
          sodiumMilligrams: 180,
          confidence: 0.98,
        },
      ],
    };

    const parsed = nutritionResponseSchema.parse(validData);
    expect(parsed.isFood).toBe(true);
    expect(parsed.items).toHaveLength(1);
  });

  it("fails schema validation if isFood is true but items is empty", () => {
    const invalidData = {
      isFood: true,
      mealName: "Empty Dish",
      summary: "No food was present",
      items: [],
    };

    expect(() => nutritionResponseSchema.parse(invalidData)).toThrow();
  });
});
