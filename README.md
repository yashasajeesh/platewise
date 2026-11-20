# PlateWise 🍽️

PlateWise is an AI-powered nutrition intelligence and food intake tracking platform. It analyzes meal photos (including multi-item Indian thalis and complex plates) using Google Gemini 3.5 multimodal vision models to break down calories, macronutrients, and micronutrients with visual item tags, personalized intake targets, and a BMI calculator.

---

## 🏗️ Architecture: Clean Monorepo Split

This repository is split into two cleanly decoupled services ready for independent production deployment:

```
platewise/
├── frontend/               # Client application (Deploy to Vercel)
│   ├── src/
│   │   ├── components/     # UI cards, modals, timeline, settings, charts
│   │   ├── hooks/          # React hooks (custom targets, intake storage)
│   │   ├── lib/            # Theme context, API client, schema validation
│   │   └── routes/         # TanStack Start / React router pages
│   ├── public/             # Static assets, fallback imagery
│   ├── vercel.json         # Vercel deployment configuration
│   ├── vite.config.ts      # Vite bundler configuration with backend proxy
│   └── package.json        # Frontend dependencies & scripts
│
├── backend/                # API server (Deploy to Render)
│   ├── src/
│   │   ├── routes/         # Express REST routes (/api/health, /api/nutrition/analyze)
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── services/       # Google Gemini vision integration
│   │   └── index.ts        # Express entry point
│   ├── render.yaml         # Render Infrastructure-as-Code Blueprint
│   ├── tsconfig.json       # TypeScript compiler settings
│   └── package.json        # Backend dependencies & scripts
│
├── package.json            # Monorepo coordinator scripts
└── README.md
```

- **Frontend (`frontend/`)**: Vite + React 19 + TanStack Start + Tailwind CSS + Lucide Icons + Radix UI. Built for **Vercel** with client-side caching and responsive dark/light mode.
- **Backend (`backend/`)**: Node.js + Express + TypeScript + Google GenAI SDK. Built for **Render** with dynamic port binding, health check endpoint, CORS protection, and payload handling for high-res images.

---

## ✨ Key Features

1. **AI Vision Meal Scanner**:
   - Takes photos or uploads of single dishes or multi-item thalis.
   - Powered by Gemini 3.5 Flash (`gemini-3.5-flash` with graceful fallback to `gemini-3.8-flash`).
   - Dynamic MIME detection (`image/jpeg`, `image/png`, `image/webp`).
   - Generates visual bounding boxes and tags for each food item.
2. **Macronutrient & Micronutrient Breakdown**:
   - Tracks Energy (kcal), Protein, Carbohydrates, and Fats.
   - Comprehensive micronutrients: Fiber, Sodium, Potassium, Calcium, Iron, Vitamin A, Vitamin C.
3. **Personalized Targets & BMI Calculator**:
   - Settings modal allows manual macro/micro goal editing.
   - Built-in Mifflin-St Jeor & WHO BMI calculator to auto-calculate daily targets based on age, gender, height, weight, activity level, and weight goal.
   - Persisted via `localStorage` with real-time reactive updates across the dashboard.
4. **Daily Intake Log**:
   - Visual timeline of today's meals with meal breakdown.
   - Quick "Add Meal" dialog to log custom foods with instant nutrient addition.
   - Working "Clear Log" action to reset intake for the day with confirmation.
5. **Dark Mode & Light Mode**:
   - Instant toggle with persistence in `localStorage`.
   - Native dark theme styling across all cards, modals, inputs, and navigation elements.

---

## 🚀 Local Development

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or [Node.js](https://nodejs.org/) (v20+)

### 1. Clone & Setup
```bash
git clone <repo-url>
cd platewise
```

### 2. Configure Environment Variables

**Backend Configuration (`backend/.env`):**
```env
PORT=3001
GEMINI_API_KEY="your-google-gemini-api-key"
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"
```

**Frontend Configuration (`frontend/.env`):**
```env
# For local dev, Vite proxies /api to http://localhost:3001 automatically
VITE_API_BASE_URL="http://localhost:3001"
```

### 3. Run Both Services

From the root directory:
```bash
# Start backend API (runs on port 3001)
bun run dev:backend

# In a separate terminal, start frontend (runs on port 3000)
bun run dev:frontend
```

---

## 🧪 Testing & Building

Run all tests across backend and frontend from root:
```bash
bun run test
```

Build both production bundles:
```bash
bun run build
```

Individual service scripts:
```bash
bun run test:backend      # Backend Vitest tests
bun run test:frontend     # Frontend Vitest & React Testing Library tests
bun run build:backend     # Compiles TypeScript into backend/dist
bun run build:frontend    # Compiles client & SSR bundles into frontend/.output
```

---

## 🌐 Deploy to Vercel (Frontend)

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import your GitHub repository.
3. In **Project Settings**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite` (or `Other`)
   - **Build Command**: `bun run build` (or `npm run build`)
   - **Output Directory**: `.output/public`
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: The URL of your deployed Render backend (e.g. `https://platewise-api.onrender.com`).
5. Click **Deploy**.

---

## ☁️ Deploy to Render (Backend)

### Option A: Using `render.yaml` Blueprint (Recommended)
1. Go to [Render Blueprints](https://dashboard.render.com/blueprints).
2. Connect your GitHub repository. Render will automatically detect `backend/render.yaml`.
3. Set your secret `GEMINI_API_KEY` in the Render dashboard.

### Option B: Manual Web Service Setup
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `bun install && bun run build` (or `npm install && npm run build`)
   - **Start Command**: `node dist/index.js`
   - **Health Check Path**: `/api/health`
4. Add Environment Variables:
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `FRONTEND_URL`: Your Vercel domain (e.g. `https://platewise.vercel.app`).
   - `NODE_ENV`: `production`
5. Click **Create Web Service**.

---

## 🔒 Security & Privacy

As outlined in `AGENTS.md`:
- All image processing and Gemini API interactions are kept server-side behind safe functions and Express routes.
- No private API keys are ever bundled into client-side browser code.
- `.env` files are strictly excluded via `.gitignore`.
