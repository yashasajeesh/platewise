import { useState, useId } from "react";
import {
  Calculator,
  Sliders,
  Sparkles,
  Check,
  Scale,
  Flame,
  Activity,
  HeartPulse,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { MacroGoals, MicroGoals, UserProfile } from "./dashboard-types";
import { calculateNutritionNeeds, calculateBmi } from "./nutrition-calculator";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoals: MacroGoals;
  currentMicroGoals: MicroGoals;
  onSaveGoals: (macroGoals: MacroGoals, microGoals: MicroGoals) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  gender: "male",
  age: 28,
  heightCm: 175,
  weightKg: 74,
  activityLevel: "moderate",
  goal: "maintain",
};

export function SettingsModal({
  isOpen,
  onClose,
  currentGoals,
  currentMicroGoals,
  onSaveGoals,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"calculator" | "manual">("calculator");

  // Calculator State
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      try {
        const saved = window.localStorage.getItem("platewise_user_profile");
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {}
    }
    return DEFAULT_PROFILE;
  });

  // Manual Goals State
  const [manualMacros, setManualMacros] = useState<MacroGoals>(currentGoals);
  const [manualMicros, setManualMicros] = useState<MicroGoals>(currentMicroGoals);

  // Live calculation results from current profile
  const calculated = calculateNutritionNeeds(profile);

  // Apply macro preset in manual mode
  const applyPreset = (proteinPct: number, carbsPct: number, fatPct: number) => {
    const totalCal = manualMacros.calories;
    const proteinG = Math.round((totalCal * (proteinPct / 100)) / 4);
    const carbsG = Math.round((totalCal * (carbsPct / 100)) / 4);
    const fatG = Math.round((totalCal * (fatPct / 100)) / 9);

    setManualMacros((prev) => ({
      ...prev,
      protein: proteinG,
      carbs: carbsG,
      fat: fatG,
    }));
  };

  // Save from Calculator
  const handleApplyCalculated = () => {
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      try {
        window.localStorage.setItem("platewise_user_profile", JSON.stringify(profile));
      } catch {}
    }
    onSaveGoals(calculated.macroGoals, calculated.microGoals);
    onClose();
  };

  // Save from Manual Form
  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGoals(manualMacros, manualMicros);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] sm:max-w-2xl overflow-y-auto rounded-3xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600">
            <Sliders className="h-4 w-4" />
            <span>Nutrition & Goals Settings</span>
          </div>
          <DialogTitle className="text-xl font-bold text-neutral-900 sm:text-2xl">
            Customize Daily Intake & Targets
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            Configure your personalized daily calorie, macro, and micronutrient goals
            using our clinical BMI & metabolic calculator or manual overrides.
          </DialogDescription>
        </DialogHeader>

        {/* Mode Selector Tabs */}
        <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-neutral-100 p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("calculator")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition ${
              activeTab === "calculator"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Calculator className="h-3.5 w-3.5 text-teal-600" />
            <span>BMI & Metabolic Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition ${
              activeTab === "manual"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Sliders className="h-3.5 w-3.5 text-orange-500" />
            <span>Manual Targets Override</span>
          </button>
        </div>

        {/* TAB 1: BMI & METABOLIC CALCULATOR */}
        {activeTab === "calculator" && (
          <div className="mt-4 space-y-4">
            {/* Form grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* Gender */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Biological Sex
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {(["male", "female"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setProfile((p) => ({ ...p, gender: g }))}
                      className={`rounded-lg py-1.5 text-xs font-semibold capitalize transition ${
                        profile.gender === g
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Age (years)
                </label>
                <input
                  type="number"
                  min="12"
                  max="110"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, age: Number(e.target.value) || 25 }))
                  }
                  className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={profile.heightCm}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, heightCm: Number(e.target.value) || 170 }))
                  }
                  className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={profile.weightKg}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, weightKg: Number(e.target.value) || 70 }))
                  }
                  className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Daily Physical Activity Level
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  { id: "sedentary", title: "Sedentary", desc: "Desk job, little/no exercise" },
                  { id: "light", title: "Light Activity", desc: "1-2 light workouts/wk" },
                  { id: "moderate", title: "Moderate", desc: "3-5 moderate training/wk" },
                  { id: "very_active", title: "Very Active", desc: "6-7 hard workouts/wk" },
                  { id: "extra_active", title: "Athlete", desc: "Physical work & training" },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() =>
                      setProfile((p) => ({
                        ...p,
                        activityLevel: act.id as UserProfile["activityLevel"],
                      }))
                    }
                    className={`rounded-xl border p-2.5 text-left transition ${
                      profile.activityLevel === act.id
                        ? "border-teal-600 bg-teal-50/70 text-teal-900 ring-1 ring-teal-600"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="text-xs font-bold">{act.title}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{act.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Health Goal */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Primary Goal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: "fat_loss",
                    title: "Fat Loss / Cut",
                    desc: "Safe ~450 kcal deficit",
                    icon: Flame,
                    color: "text-rose-500",
                  },
                  {
                    id: "maintain",
                    title: "Maintenance",
                    desc: "Sustain current weight",
                    icon: Scale,
                    color: "text-teal-600",
                  },
                  {
                    id: "muscle_gain",
                    title: "Lean Gain / Bulk",
                    desc: "+300 kcal clean surplus",
                    icon: Activity,
                    color: "text-indigo-600",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setProfile((p) => ({
                          ...p,
                          goal: item.id as UserProfile["goal"],
                        }))
                      }
                      className={`rounded-xl border p-2.5 text-left transition ${
                        profile.goal === item.id
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                          : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon className={`h-3.5 w-3.5 ${profile.goal === item.id ? "text-orange-400" : item.color}`} />
                        <span className="text-xs font-bold">{item.title}</span>
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          profile.goal === item.id ? "text-neutral-300" : "text-neutral-500"
                        }`}
                      >
                        {item.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calculated Results Banner */}
            <div className="rounded-2xl border border-neutral-200 bg-linear-to-br from-teal-50/70 via-white to-neutral-50 p-4">
              <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-teal-600 p-1.5 text-white">
                    <HeartPulse className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-900">
                      Calculated Metabolic Metrics
                    </span>
                    <div className="text-[11px] text-neutral-500">
                      BMR: {calculated.bmr.toLocaleString()} kcal · TDEE: {calculated.tdee.toLocaleString()} kcal
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                    BMI Index
                  </span>
                  <span className="text-base font-extrabold text-neutral-900">
                    {calculated.bmiResult.bmi}{" "}
                    <span className={`text-xs font-bold ${calculated.bmiResult.color}`}>
                      ({calculated.bmiResult.category})
                    </span>
                  </span>
                </div>
              </div>

              {/* Recommended Targets Display */}
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                <div className="rounded-xl border border-teal-200 bg-white p-2">
                  <span className="block text-[10px] text-neutral-500">Target Calories</span>
                  <span className="text-sm font-extrabold text-neutral-900">
                    {calculated.macroGoals.calories.toLocaleString()}
                  </span>
                  <span className="block text-[10px] text-neutral-400">kcal/day</span>
                </div>

                <div className="rounded-xl border border-teal-200 bg-white p-2">
                  <span className="block text-[10px] text-neutral-500">Protein</span>
                  <span className="text-sm font-extrabold text-teal-700">
                    {calculated.macroGoals.protein}g
                  </span>
                  <span className="block text-[10px] text-neutral-400">
                    {Math.round((calculated.macroGoals.protein * 4 * 100) / calculated.macroGoals.calories)}%
                  </span>
                </div>

                <div className="rounded-xl border border-orange-200 bg-white p-2">
                  <span className="block text-[10px] text-neutral-500">Carbs</span>
                  <span className="text-sm font-extrabold text-orange-700">
                    {calculated.macroGoals.carbs}g
                  </span>
                  <span className="block text-[10px] text-neutral-400">
                    {Math.round((calculated.macroGoals.carbs * 4 * 100) / calculated.macroGoals.calories)}%
                  </span>
                </div>

                <div className="rounded-xl border border-sky-200 bg-white p-2">
                  <span className="block text-[10px] text-neutral-500">Fats</span>
                  <span className="text-sm font-extrabold text-sky-700">
                    {calculated.macroGoals.fat}g
                  </span>
                  <span className="block text-[10px] text-neutral-400">
                    {Math.round((calculated.macroGoals.fat * 9 * 100) / calculated.macroGoals.calories)}%
                  </span>
                </div>
              </div>

              {/* Micro Recommendations */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-600 px-1">
                <span>
                  Fiber: <strong>{calculated.microGoals.fiber}g</strong>
                </span>
                <span>
                  Sodium max: <strong>{calculated.microGoals.sodium}mg</strong>
                </span>
                <span>
                  Potassium: <strong>{calculated.microGoals.potassium}mg</strong>
                </span>
                <span>
                  Iron: <strong>{calculated.microGoals.iron}mg</strong>
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCalculated}
                className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-95"
              >
                <Check className="h-4 w-4" />
                <span>Apply Calculated Targets to Dashboard</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MANUAL TARGET OVERRIDE */}
        {activeTab === "manual" && (
          <form onSubmit={handleSaveManual} className="mt-4 space-y-4">
            {/* Quick Presets */}
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <Sparkles className="h-3 w-3 text-orange-500" />
                <span>Macro Ratio Presets</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Balanced (30P / 45C / 25F)", p: 30, c: 45, f: 25 },
                  { label: "High Protein / Fitness (40P / 40C / 20F)", p: 40, c: 40, f: 20 },
                  { label: "Low Carb / Keto (25P / 10C / 65F)", p: 25, c: 10, f: 65 },
                  { label: "High Carb Endurance (20P / 60C / 20F)", p: 20, c: 60, f: 20 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.p, preset.c, preset.f)}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700 transition hover:bg-white hover:border-neutral-300"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Macro Goals Inputs */}
            <div>
              <span className="block text-xs font-bold text-neutral-800 mb-2">
                Daily Calorie & Macronutrient Targets
              </span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Calories (kcal) *
                  </label>
                  <input
                    type="number"
                    required
                    min="800"
                    max="6000"
                    value={manualMacros.calories}
                    onChange={(e) =>
                      setManualMacros((prev) => ({
                        ...prev,
                        calories: Number(e.target.value) || 2000,
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 font-bold focus:border-neutral-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Protein (g) *
                  </label>
                  <input
                    type="number"
                    required
                    min="20"
                    max="400"
                    value={manualMacros.protein}
                    onChange={(e) =>
                      setManualMacros((prev) => ({
                        ...prev,
                        protein: Number(e.target.value) || 100,
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-teal-200 bg-white px-2.5 text-xs text-teal-800 font-bold focus:border-teal-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Carbs (g) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="800"
                    value={manualMacros.carbs}
                    onChange={(e) =>
                      setManualMacros((prev) => ({
                        ...prev,
                        carbs: Number(e.target.value) || 150,
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-orange-200 bg-white px-2.5 text-xs text-orange-800 font-bold focus:border-orange-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Fats (g) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="300"
                    value={manualMacros.fat}
                    onChange={(e) =>
                      setManualMacros((prev) => ({
                        ...prev,
                        fat: Number(e.target.value) || 60,
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-sky-200 bg-white px-2.5 text-xs text-sky-800 font-bold focus:border-sky-400 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Micronutrient Targets Inputs */}
            <div>
              <span className="block text-xs font-bold text-neutral-800 mb-2">
                Micronutrient Daily Goals & Limits
              </span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Dietary Fiber (g)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={manualMicros.fiber}
                    onChange={(e) =>
                      setManualMicros((prev) => ({
                        ...prev,
                        fiber: Number(e.target.value) || 30,
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Sodium Max (mg)
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="6000"
                    value={manualMicros.sodium}
                    onChange={(e) =>
                      setManualMicros((prev) => ({
                        ...prev,
                        sodium: Number(e.target.value) || 2300,
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Potassium (mg)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max="6000"
                    value={manualMicros.potassium}
                    onChange={(e) =>
                      setManualMicros((prev) => ({
                        ...prev,
                        potassium: Number(e.target.value) || 3400,
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Calcium (mg)
                  </label>
                  <input
                    type="number"
                    min="200"
                    max="3000"
                    value={manualMicros.calcium}
                    onChange={(e) =>
                      setManualMicros((prev) => ({
                        ...prev,
                        calcium: Number(e.target.value) || 1000,
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Iron (mg)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={manualMicros.iron}
                    onChange={(e) =>
                      setManualMicros((prev) => ({
                        ...prev,
                        iron: Number(e.target.value) || 18,
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Vitamin C (mg)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={manualMicros.vitaminC}
                    onChange={(e) =>
                      setManualMicros((prev) => ({
                        ...prev,
                        vitaminC: Number(e.target.value) || 90,
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 active:scale-95"
              >
                <Check className="h-4 w-4 text-teal-400" />
                <span>Save Custom Targets</span>
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
