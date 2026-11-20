import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { analyzeNutritionApi } from "./api-client";
import { analyzeNutritionPhoto } from "./nutrition.server";

export const analyzeNutrition = createServerFn({ method: "POST" })
  .validator((input) =>
    z
      .object({
        imageDataUrl: z
          .string()
          .max(12_000_000)
          .regex(/^data:image\/(?:jpeg|png|webp|jpg);base64,/i),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const backendUrl =
      process.env["BACKEND_API_URL"] ||
      process.env["VITE_API_BASE_URL"] ||
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL);

    if (backendUrl) {
      return analyzeNutritionApi(data.imageDataUrl);
    }
    return analyzeNutritionPhoto(data.imageDataUrl);
  });
