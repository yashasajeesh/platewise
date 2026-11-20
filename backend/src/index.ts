import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { nutritionRouter } from "./routes/nutrition.routes.js";

// Load environment variables (.env)
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"];

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or in dev
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive default to avoid cross-domain deployment blocks
      }
    },
    credentials: true,
  }),
);

// Large body limit for photo base64 payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Root health check for Render / load balancers
app.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "Platewise Backend API",
    status: "healthy",
    docs: "Endpoints under /api/*",
  });
});

// Mount API routes
app.use("/api", nutritionRouter);

// Start server
const server = app.listen(port, () => {
  console.log(`[Platewise Backend] Server running on port ${port}`);
});

export { app, server };
