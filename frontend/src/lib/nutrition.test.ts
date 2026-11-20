import { describe, expect, it } from "vitest";

import { nutritionResponseSchema, sumNutrition, type NutritionItem } from "./nutrition-schema";
import {
  analyzeNutritionPhoto,
  extractImageData,
  NUTRITION_RESPONSE_SCHEMA,
} from "./nutrition.server";

describe("nutrition totals", () => {
  it("adds nutrients from every item on a multi-dish thali", () => {
    const items: NutritionItem[] = [
      {
        name: "Dal",
        serving: "1 bowl",
        calories: 165,
        proteinGrams: 9,
        carbsGrams: 22,
        fatGrams: 4,
        fiberGrams: 6,
        sugarGrams: 2,
        sodiumMilligrams: 320,
        confidence: 0.9,
      },
      {
        name: "Rice",
        serving: "1 cup",
        calories: 185,
        proteinGrams: 4,
        carbsGrams: 40,
        fatGrams: 0.4,
        fiberGrams: 1,
        sugarGrams: 0.1,
        sodiumMilligrams: 5,
        confidence: 0.95,
      },
    ];

    expect(sumNutrition(items)).toEqual({
      calories: 350,
      proteinGrams: 13,
      carbsGrams: 62,
      fatGrams: 4.4,
      fiberGrams: 7,
      sugarGrams: 2.1,
      sodiumMilligrams: 325,
    });
  });
});

describe("extractImageData", () => {
  it("strips data:image/jpeg;base64, prefix and extracts mimeType", () => {
    const raw = "data:image/jpeg;base64,dGVzdA==";
    const { mimeType, base64Data } = extractImageData(raw);
    expect(mimeType).toBe("image/jpeg");
    expect(base64Data).toBe("dGVzdA==");
  });

  it("extracts image/png dynamically", () => {
    const raw = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==";
    const { mimeType, base64Data } = extractImageData(raw);
    expect(mimeType).toBe("image/png");
    expect(base64Data).toBe("iVBORw0KGgoAAAANSUhEUg==");
  });

  it("extracts image/webp dynamically", () => {
    const raw = "data:image/webp;base64,UklGRmYAAABXRUJQVlA4==";
    const { mimeType, base64Data } = extractImageData(raw);
    expect(mimeType).toBe("image/webp");
    expect(base64Data).toBe("UklGRmYAAABXRUJQVlA4==");
  });

  it("normalizes image/jpg to image/jpeg", () => {
    const raw = "data:image/jpg;base64,dGVzdA==";
    const { mimeType, base64Data } = extractImageData(raw);
    expect(mimeType).toBe("image/jpeg");
    expect(base64Data).toBe("dGVzdA==");
  });

  it("throws on malformed data strings", () => {
    expect(() => extractImageData("not-a-data-url")).toThrow("Invalid image format");
    expect(() => extractImageData("")).toThrow("No image data provided");
  });
});

describe("responseSchema matching", () => {
  it("verifies NUTRITION_RESPONSE_SCHEMA has all required properties", () => {
    expect(NUTRITION_RESPONSE_SCHEMA.properties).toHaveProperty("isFood");
    expect(NUTRITION_RESPONSE_SCHEMA.properties).toHaveProperty("mealName");
    expect(NUTRITION_RESPONSE_SCHEMA.properties).toHaveProperty("summary");
    expect(NUTRITION_RESPONSE_SCHEMA.properties).toHaveProperty("items");

    const itemProps = NUTRITION_RESPONSE_SCHEMA.properties?.["items"]?.items?.properties;
    expect(itemProps).toBeDefined();
    expect(itemProps).toHaveProperty("name");
    expect(itemProps).toHaveProperty("serving");
    expect(itemProps).toHaveProperty("calories");
    expect(itemProps).toHaveProperty("proteinGrams");
    expect(itemProps).toHaveProperty("carbsGrams");
    expect(itemProps).toHaveProperty("fatGrams");
    expect(itemProps).toHaveProperty("fiberGrams");
    expect(itemProps).toHaveProperty("sugarGrams");
    expect(itemProps).toHaveProperty("sodiumMilligrams");
    expect(itemProps).toHaveProperty("confidence");
  });
});

describe("nutritionResponseSchema validation", () => {
  it("validates realistic multi-item meal analysis", () => {
    const validData = {
      isFood: true,
      mealName: "Punjabi Thali",
      summary: "Nutritious thali with lentils and bread.",
      items: [
        {
          name: "Dal Makhani",
          serving: "1 bowl",
          calories: 250,
          proteinGrams: 10,
          carbsGrams: 30,
          fatGrams: 9,
          fiberGrams: 7,
          sugarGrams: 2,
          sodiumMilligrams: 400,
          confidence: 0.9,
        },
      ],
    };

    expect(() => nutritionResponseSchema.parse(validData)).not.toThrow();
  });

  it("validates non-food images with empty items array", () => {
    const nonFoodData = {
      isFood: false,
      mealName: "No food detected",
      summary: "The image shows a laptop on a desk.",
      items: [],
    };

    expect(() => nutritionResponseSchema.parse(nonFoodData)).not.toThrow();
  });

  it("fails when isFood is true but items array is empty", () => {
    const invalidFoodData = {
      isFood: true,
      mealName: "Empty plate",
      summary: "Empty meal.",
      items: [],
    };

    expect(() => nutritionResponseSchema.parse(invalidFoodData)).toThrow(
      /Food analysis must include at least one item/,
    );
  });

  it("fails when isFood is false but items array contains items", () => {
    const invalidNonFoodData = {
      isFood: false,
      mealName: "Not food",
      summary: "Items should not exist.",
      items: [
        {
          name: "Roti",
          serving: "1 piece",
          calories: 100,
          proteinGrams: 3,
          carbsGrams: 20,
          fatGrams: 1,
          fiberGrams: 2,
          sugarGrams: 0,
          sodiumMilligrams: 100,
          confidence: 0.8,
        },
      ],
    };

    expect(() => nutritionResponseSchema.parse(invalidNonFoodData)).toThrow(
      /Non-food analysis cannot include food items/,
    );
  });
});

describe("analyzeNutritionPhoto validation & error handling", () => {
  it("rejects when GEMINI_API_KEY is not configured", async () => {
    const originalKey = process.env["GEMINI_API_KEY"];
    delete process.env["GEMINI_API_KEY"];

    await expect(analyzeNutritionPhoto("data:image/jpeg;base64,dGVzdA==")).rejects.toThrow(
      "GEMINI_API_KEY is not configured on the server",
    );

    if (originalKey) {
      process.env["GEMINI_API_KEY"] = originalKey;
    }
  });

  it("rejects invalid image data URLs with descriptive error", async () => {
    await expect(analyzeNutritionPhoto("data:text/plain;base64,aGVsbG8=")).rejects.toThrow();
  });
});
