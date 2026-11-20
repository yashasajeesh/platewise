import { GoogleGenAI, Type, type Schema } from "@google/genai";

import { nutritionResponseSchema, sumNutrition } from "./nutrition-schema";

const SYSTEM_INSTRUCTION =
  "You estimate nutrition from food photos. Identify every visible substantial food on a single dish or multi-item plate such as an Indian thali, and estimate realistic portions from the image. Return only valid JSON with keys isFood (boolean), mealName (string), summary (one short plain-language sentence), and items (array). Each item must have name, serving, calories (integer kcal), proteinGrams, carbsGrams, fatGrams, fiberGrams, sugarGrams (numbers in grams), sodiumMilligrams (integer), and confidence (number from 0 to 1). Include separate foods individually; do not combine distinct bowls or compartments. Skip tiny garnishes. Use 0 for nutrients that cannot reasonably be estimated. If the image does not show food, return isFood false, an empty items array, mealName 'No food detected', and a brief summary. Estimates are approximate, not medical advice.";

export const NUTRITION_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    isFood: {
      type: Type.BOOLEAN,
      description: "Whether food is detected in the image.",
    },
    mealName: {
      type: Type.STRING,
      description: "Name of the meal or 'No food detected'.",
    },
    summary: {
      type: Type.STRING,
      description: "One short plain-language sentence summarizing the meal.",
    },
    items: {
      type: Type.ARRAY,
      description: "List of individual food items detected on the plate.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Name of the food item.",
          },
          serving: {
            type: Type.STRING,
            description: "Estimated portion/serving description.",
          },
          calories: {
            type: Type.INTEGER,
            description: "Estimated energy in kcal (integer).",
          },
          proteinGrams: {
            type: Type.NUMBER,
            description: "Estimated protein in grams.",
          },
          carbsGrams: {
            type: Type.NUMBER,
            description: "Estimated carbohydrates in grams.",
          },
          fatGrams: {
            type: Type.NUMBER,
            description: "Estimated fat in grams.",
          },
          fiberGrams: {
            type: Type.NUMBER,
            description: "Estimated dietary fiber in grams.",
          },
          sugarGrams: {
            type: Type.NUMBER,
            description: "Estimated sugars in grams.",
          },
          sodiumMilligrams: {
            type: Type.INTEGER,
            description: "Estimated sodium in milligrams (integer).",
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence score between 0 and 1.",
          },
        },
        required: [
          "name",
          "serving",
          "calories",
          "proteinGrams",
          "carbsGrams",
          "fatGrams",
          "fiberGrams",
          "sugarGrams",
          "sodiumMilligrams",
          "confidence",
        ],
      },
    },
  },
  required: ["isFood", "mealName", "summary", "items"],
};

export function extractImageData(imageDataUrl: string): { mimeType: string; base64Data: string } {
  if (!imageDataUrl || typeof imageDataUrl !== "string") {
    throw new Error("No image data provided. Please upload a food photo.");
  }

  // Regex matches image data URLs: data:image/<subtype>;base64,<base64Data>
  const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9-.+]+);base64,(.+)$/s);
  if (match && match[1] && match[2]) {
    const rawMime = match[1].toLowerCase();
    const mimeType = rawMime === "image/jpg" ? "image/jpeg" : rawMime;
    // Strip data prefix and any whitespace/newlines
    const base64Data = match[2].trim().replace(/\s/g, "");
    return { mimeType, base64Data };
  }

  // Fallback if semicolon separated without strict prefix
  if (imageDataUrl.includes(";base64,")) {
    const [header, rawData] = imageDataUrl.split(";base64,");
    const rawMime =
      header
        ?.replace(/^data:/, "")
        .trim()
        .toLowerCase() || "";
    if (rawMime.startsWith("image/")) {
      const mimeType = rawMime === "image/jpg" ? "image/jpeg" : rawMime;
      const base64Data = (rawData || "").trim().replace(/\s/g, "");
      if (base64Data) {
        return { mimeType, base64Data };
      }
    }
  }

  throw new Error(
    "Invalid image format: must be an image base64 data URL (e.g. data:image/jpeg;base64,...)",
  );
}

export async function analyzeNutritionPhoto(imageDataUrl: string) {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    const err = new Error(
      "GEMINI_API_KEY is not configured on the server. Please set it in your environment.",
    );
    console.error("Nutrition analysis error:", err);
    throw err;
  }

  let imageData: { mimeType: string; base64Data: string };
  try {
    imageData = extractImageData(imageDataUrl);
  } catch (parseError) {
    console.error("Nutrition analysis error:", parseError);
    throw parseError instanceof Error
      ? parseError
      : new Error("Invalid image format. Please upload a JPG, PNG, or WebP photo.");
  }

  const { mimeType, base64Data } = imageData;

  const preferredModel = process.env["GEMINI_MODEL"] || "gemini-3.5-flash-lite";
  const candidateModels = [
    preferredModel,
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-3.8-flash",
    "gemini-3.7-flash",
  ].filter((model, idx, arr) => arr.indexOf(model) === idx);

  const ai = new GoogleGenAI({ apiKey });

  let lastError: unknown = null;
  let content: string | undefined;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "Estimate the portions and nutrition for each food visible in this meal photo.",
              },
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: NUTRITION_RESPONSE_SCHEMA,
        },
      });

      content = response.text;
      if (content) {
        break;
      }
    } catch (err: unknown) {
      lastError = err;
      const errStr = String(err).toLowerCase();
      // Auto-fallback if model is unavailable, overloaded, or rate-limited/quota-exhausted
      if (
        errStr.includes("404") ||
        errStr.includes("not_found") ||
        errStr.includes("503") ||
        errStr.includes("unavailable") ||
        errStr.includes("429") ||
        errStr.includes("resource_exhausted") ||
        errStr.includes("quota") ||
        errStr.includes("rate-limit") ||
        errStr.includes("rate_limit") ||
        errStr.includes("high demand")
      ) {
        console.warn(
          `[Platewise AI] Model "${model}" unavailable or quota exceeded. Falling back to next candidate...`,
        );
        continue;
      }
      break;
    }
  }

  if (!content) {
    console.error("Nutrition analysis error:", lastError);
    if (lastError instanceof Error) {
      const msg = lastError.message;
      if (
        msg.includes("429") ||
        msg.includes("RESOURCE_EXHAUSTED") ||
        msg.toLowerCase().includes("quota")
      ) {
        throw new Error(
          "Gemini Free Tier daily quota exceeded across all available models. Please retry in a few hours or configure a paid Gemini API key.",
        );
      }
      throw new Error(`AI analysis failed: ${msg}`);
    }
    throw new Error("The image analysis returned no readable result.");
  }

  try {
    const rawParsed = JSON.parse(content);
    const analysis = nutritionResponseSchema.parse(rawParsed);
    return { ...analysis, totals: sumNutrition(analysis.items) };
  } catch (validationError: unknown) {
    console.error("Nutrition analysis error:", validationError);
    if (validationError instanceof Error) {
      throw new Error(`Nutrition schema validation failed: ${validationError.message}`);
    }
    throw new Error("Received malformed nutrition data from the analysis service.");
  }
}
