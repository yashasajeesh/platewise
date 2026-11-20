import { useState } from "react";
import { PlusCircle, Sparkles, Utensils } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { LoggedMeal } from "./dashboard-types";

interface AddCustomMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (meal: LoggedMeal) => void;
}

const QUICK_PRESETS = [
  {
    name: "Whey Protein Shake",
    slot: "Snack" as const,
    calories: 140,
    protein: 26,
    carbs: 3,
    fat: 2,
    fiber: 1,
    sodium: 140,
    imageUrl:
      "https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Greek Yogurt Bowl",
    slot: "Breakfast" as const,
    calories: 160,
    protein: 18,
    carbs: 12,
    fat: 4,
    fiber: 2,
    sodium: 90,
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Almonds & Walnuts (30g)",
    slot: "Snack" as const,
    calories: 180,
    protein: 6,
    carbs: 5,
    fat: 16,
    fiber: 3,
    sodium: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1508061252224-40394ccd043c?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Double Espresso",
    slot: "Breakfast" as const,
    calories: 10,
    protein: 1,
    carbs: 1,
    fat: 0,
    fiber: 0,
    sodium: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
  },
];

export function AddCustomMealModal({
  isOpen,
  onClose,
  onAddMeal,
}: AddCustomMealModalProps) {
  const [name, setName] = useState("");
  const [slot, setSlot] = useState<"Breakfast" | "Lunch" | "Snack" | "Dinner">("Lunch");
  const [calories, setCalories] = useState<number | "">("");
  const [protein, setProtein] = useState<number | "">("");
  const [carbs, setCarbs] = useState<number | "">("");
  const [fat, setFat] = useState<number | "">("");
  const [fiber, setFiber] = useState<number | "">("");
  const [sodium, setSodium] = useState<number | "">("");

  const resetForm = () => {
    setName("");
    setSlot("Lunch");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setFiber("");
    setSodium("");
  };

  const handleApplyPreset = (preset: (typeof QUICK_PRESETS)[0]) => {
    setName(preset.name);
    setSlot(preset.slot);
    setCalories(preset.calories);
    setProtein(preset.protein);
    setCarbs(preset.carbs);
    setFat(preset.fat);
    setFiber(preset.fiber);
    setSodium(preset.sodium);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || calories === "") return;

    const numCal = Number(calories) || 0;
    const numP = Number(protein) || 0;
    const numC = Number(carbs) || 0;
    const numF = Number(fat) || 0;
    const numFiber = Number(fiber) || 0;
    const numSodium = Number(sodium) || Math.round(numCal * 0.7);

    const newMeal: LoggedMeal = {
      id: `custom-meal-${Date.now()}`,
      slot,
      name: name.trim(),
      calories: numCal,
      protein: numP,
      carbs: numC,
      fat: numF,
      fiber: numFiber,
      sodium: numSodium,
      potassium: Math.round(numCal * 1.2),
      calcium: Math.round(numP * 7 + 40),
      iron: Number((numP * 0.08 + 1).toFixed(1)),
      vitaminC: Math.round(numFiber * 2),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      imageUrl:
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80",
      dotColor:
        slot === "Breakfast"
          ? "#0d9488"
          : slot === "Lunch"
            ? "#f06543"
            : slot === "Snack"
              ? "#99f6e4"
              : "#6366f1",
      detectedItems: [
        {
          name: name.trim(),
          weight: "1 serving",
          calories: numCal,
          protein: numP,
          carbs: numC,
          fat: numF,
          xPercent: 35,
          yPercent: 45,
        },
      ],
    };

    onAddMeal(newMeal);
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600">
            <Utensils className="h-4 w-4" />
            <span>Manual Meal Logging</span>
          </div>
          <DialogTitle className="text-xl font-bold text-neutral-900 sm:text-2xl">
            Log Custom Meal
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            Enter nutrition manually or select a quick healthy preset.
          </DialogDescription>
        </DialogHeader>

        {/* Quick Presets */}
        <div className="mt-2">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            <Sparkles className="h-3 w-3 text-teal-600" />
            <span>Quick Healthy Presets</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="rounded-lg border border-neutral-200 bg-neutral-50/80 px-2.5 py-1 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-white"
              >
                {preset.name} ({preset.calories} kcal)
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Meal Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Food / Meal Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Scrambled Eggs on Sourdough"
              className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-hidden"
            />
          </div>

          {/* Slot Selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Meal Slot *
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["Breakfast", "Lunch", "Snack", "Dinner"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={`rounded-xl py-1.5 text-xs font-semibold transition ${
                    slot === s
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Calories & Macros Row */}
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Calories *
              </label>
              <input
                type="number"
                required
                min="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="kcal"
                className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                min="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="g"
                className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                min="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="g"
                className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                min="0"
                value={fat}
                onChange={(e) => setFat(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="g"
                className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Optional Micros Row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Dietary Fiber (g)
              </label>
              <input
                type="number"
                min="0"
                value={fiber}
                onChange={(e) => setFiber(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="optional"
                className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Sodium (mg)
              </label>
              <input
                type="number"
                min="0"
                value={sodium}
                onChange={(e) => setSodium(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="optional"
                className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || calories === ""}
              className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-50 active:scale-95"
            >
              <PlusCircle className="h-3.5 w-3.5 text-orange-500" />
              <span>Log Meal</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
