import { Router, type Request, type Response } from "express";
import { analyzeNutritionPhoto } from "../services/nutrition.server.js";

export const nutritionRouter = Router();

// Health check endpoint
nutritionRouter.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "platewise-backend",
    timestamp: new Date().toISOString(),
  });
});

// Food photo nutrition analysis endpoint
nutritionRouter.post("/nutrition/analyze", async (req: Request, res: Response) => {
  try {
    const { imageDataUrl } = req.body;
    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      res.status(400).json({
        ok: false,
        error: "Missing or invalid imageDataUrl in request body.",
      });
      return;
    }

    const result = await analyzeNutritionPhoto(imageDataUrl);
    res.json({
      ok: true,
      data: result,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected server error occurred.";
    const isClientError =
      message.includes("Invalid image") || message.includes("No image data");

    res.status(isClientError ? 400 : 500).json({
      ok: false,
      error: message,
    });
  }
});
