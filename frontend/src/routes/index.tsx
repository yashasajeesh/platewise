import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import {
  OverviewHeader,
  ActiveMealCard,
  DailyMacrosCard,
  DailyMicrosCard,
  TodayIntakeTimeline,
  ScanMealModal,
  SearchCommandDialog,
  SettingsModal,
  AddCustomMealModal,
  DEFAULT_GOALS,
  DEFAULT_MICRO_GOALS,
  INITIAL_BASE_MICROS,
  INITIAL_LOGGED_MEALS,
  EVENING_SUGGESTION,
  SALMON_BOWL_MEAL,
  type LoggedMeal,
  type MicrosConsumed,
  type MacroGoals,
  type MicroGoals,
} from "@/components/nutrition";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Platewise — Nutritional & Metabolic Overview" },
      {
        name: "description",
        content:
          "Daily energy, macros, micronutrient biomarkers, and AI food vision scanning.",
      },
      { property: "og:title", content: "Platewise — Nutritional & Metabolic Overview" },
      {
        property: "og:description",
        content:
          "Daily energy, macros, micronutrient biomarkers, and AI food vision scanning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap",
      },
    ],
  }),
  component: DashboardOverview,
});

// Base nutrition offset (e.g. morning brew/smoothie: 540 kcal, 54g P, 33g C, 24g F)
// Ensures initial state matches target:
// Consumed: 1,640 kcal (400 left of 2,040 target)
// Protein: 128g / 150g | Carbs: 165g / 210g | Fats: 52g / 65g
const BASE_OFFSET = {
  calories: 540,
  protein: 54,
  carbs: 33,
  fat: 24,
};

export function DashboardOverview() {
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>(INITIAL_LOGGED_MEALS);
  const [activeMeal, setActiveMeal] = useState<LoggedMeal | null>(SALMON_BOWL_MEAL);
  const [isEveningSuggestionLogged, setIsEveningSuggestionLogged] = useState(false);
  const [hasClearedLog, setHasClearedLog] = useState(false);

  // User Customizable Nutrition Goals (Macros & Micros)
  const [macroGoals, setMacroGoals] = useState<MacroGoals>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("platewise_macro_goals");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_GOALS;
  });

  const [microGoals, setMicroGoals] = useState<MicroGoals>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("platewise_micro_goals");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_MICRO_GOALS;
  });

  // Search & Modals
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCustomMealOpen, setIsCustomMealOpen] = useState(false);

  // Calculate dynamic totals from logged meals + base
  const totalCalories = useMemo(() => {
    if (hasClearedLog || loggedMeals.length === 0) {
      return loggedMeals.reduce((acc, m) => acc + m.calories, 0);
    }
    return (
      BASE_OFFSET.calories +
      loggedMeals.reduce((acc, m) => acc + m.calories, 0) -
      INITIAL_LOGGED_MEALS.reduce((acc, m) => acc + m.calories, 0) +
      1100
    );
  }, [loggedMeals, hasClearedLog]);

  const totalProtein = useMemo(() => {
    if (hasClearedLog || loggedMeals.length === 0) {
      return loggedMeals.reduce((acc, m) => acc + m.protein, 0);
    }
    return (
      BASE_OFFSET.protein +
      loggedMeals.reduce((acc, m) => acc + m.protein, 0) -
      INITIAL_LOGGED_MEALS.reduce((acc, m) => acc + m.protein, 0) +
      74
    );
  }, [loggedMeals, hasClearedLog]);

  const totalCarbs = useMemo(() => {
    if (hasClearedLog || loggedMeals.length === 0) {
      return loggedMeals.reduce((acc, m) => acc + m.carbs, 0);
    }
    return (
      BASE_OFFSET.carbs +
      loggedMeals.reduce((acc, m) => acc + m.carbs, 0) -
      INITIAL_LOGGED_MEALS.reduce((acc, m) => acc + m.carbs, 0) +
      132
    );
  }, [loggedMeals, hasClearedLog]);

  const totalFat = useMemo(() => {
    if (hasClearedLog || loggedMeals.length === 0) {
      return loggedMeals.reduce((acc, m) => acc + m.fat, 0);
    }
    return (
      BASE_OFFSET.fat +
      loggedMeals.reduce((acc, m) => acc + m.fat, 0) -
      INITIAL_LOGGED_MEALS.reduce((acc, m) => acc + m.fat, 0) +
      28
    );
  }, [loggedMeals, hasClearedLog]);

  // Calculate dynamic micronutrients from logged meals + base
  const totalMicros = useMemo<MicrosConsumed>(() => {
    const mealMicros = loggedMeals.reduce(
      (acc, m) => ({
        fiber: acc.fiber + (m.fiber || 0),
        sodium: acc.sodium + (m.sodium || 0),
        potassium: acc.potassium + (m.potassium || 0),
        calcium: acc.calcium + (m.calcium || 0),
        iron: acc.iron + (m.iron || 0),
        vitaminC: acc.vitaminC + (m.vitaminC || 0),
        sugar: (acc.sugar || 0) + (m.sugar || 0),
      }),
      { fiber: 0, sodium: 0, potassium: 0, calcium: 0, iron: 0, vitaminC: 0, sugar: 0 }
    );

    if (hasClearedLog || loggedMeals.length === 0) {
      return {
        fiber: Number(mealMicros.fiber.toFixed(1)),
        sodium: Math.round(mealMicros.sodium),
        potassium: Math.round(mealMicros.potassium),
        calcium: Math.round(mealMicros.calcium),
        iron: Number(mealMicros.iron.toFixed(1)),
        vitaminC: Math.round(mealMicros.vitaminC),
        sugar: Math.round(mealMicros.sugar || 0),
      };
    }

    return {
      fiber: Number((INITIAL_BASE_MICROS.fiber + mealMicros.fiber).toFixed(1)),
      sodium: Math.round(INITIAL_BASE_MICROS.sodium + mealMicros.sodium),
      potassium: Math.round(INITIAL_BASE_MICROS.potassium + mealMicros.potassium),
      calcium: Math.round(INITIAL_BASE_MICROS.calcium + mealMicros.calcium),
      iron: Number((INITIAL_BASE_MICROS.iron + mealMicros.iron).toFixed(1)),
      vitaminC: Math.round(INITIAL_BASE_MICROS.vitaminC + mealMicros.vitaminC),
      sugar: Math.round((INITIAL_BASE_MICROS.sugar || 0) + (mealMicros.sugar || 0)),
    };
  }, [loggedMeals, hasClearedLog]);

  // Filtered meals based on search input
  const filteredMeals = useMemo(() => {
    if (!searchQuery.trim()) return loggedMeals;
    const q = searchQuery.toLowerCase();
    return loggedMeals.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.slot.toLowerCase().includes(q) ||
        m.detectedItems?.some((d) => d.name.toLowerCase().includes(q))
    );
  }, [loggedMeals, searchQuery]);

  // Clear today's entire log
  const handleClearLog = () => {
    setLoggedMeals([]);
    setActiveMeal(null);
    setIsEveningSuggestionLogged(false);
    setHasClearedLog(true);

    toast.info("Today's meal log has been cleared", {
      action: {
        label: "Restore",
        onClick: () => handleResetDemo(),
      },
    });
  };

  // Restore initial demo log
  const handleResetDemo = () => {
    setLoggedMeals(INITIAL_LOGGED_MEALS);
    setActiveMeal(SALMON_BOWL_MEAL);
    setIsEveningSuggestionLogged(false);
    setHasClearedLog(false);
    toast.success("Demo log restored");
  };

  // Delete an individual meal
  const handleDeleteMeal = (mealId: string) => {
    const deleted = loggedMeals.find((m) => m.id === mealId);
    const updated = loggedMeals.filter((m) => m.id !== mealId);
    setLoggedMeals(updated);

    if (activeMeal?.id === mealId) {
      setActiveMeal(updated[0] || null);
    }

    if (deleted?.name === EVENING_SUGGESTION.name) {
      setIsEveningSuggestionLogged(false);
    }

    toast.info(`Removed ${deleted?.name || "meal"} from log`);
  };

  // Log AI Evening Suggestion
  const handleLogEveningSuggestion = () => {
    if (isEveningSuggestionLogged) return;

    const newDinnerMeal: LoggedMeal = {
      id: `meal-dinner-${Date.now()}`,
      slot: "Dinner",
      name: EVENING_SUGGESTION.name,
      calories: EVENING_SUGGESTION.calories,
      protein: EVENING_SUGGESTION.protein,
      carbs: EVENING_SUGGESTION.carbs,
      fat: EVENING_SUGGESTION.fat,
      fiber: EVENING_SUGGESTION.fiber,
      sodium: EVENING_SUGGESTION.sodium,
      potassium: EVENING_SUGGESTION.potassium,
      calcium: EVENING_SUGGESTION.calcium,
      iron: EVENING_SUGGESTION.iron,
      vitaminC: EVENING_SUGGESTION.vitaminC,
      sugar: EVENING_SUGGESTION.sugar,
      time: "7:15 PM",
      confidence: EVENING_SUGGESTION.confidence,
      imageUrl: EVENING_SUGGESTION.imageUrl,
      dotColor: "#6366f1",
      detectedItems: EVENING_SUGGESTION.detectedItems,
    };

    setLoggedMeals((prev) => [...prev, newDinnerMeal]);
    setIsEveningSuggestionLogged(true);
    setActiveMeal(newDinnerMeal);

    toast.success(
      `Logged ${EVENING_SUGGESTION.name} for Dinner (+${EVENING_SUGGESTION.calories} kcal)`,
      {
        description: `Daily total: ${(totalCalories + EVENING_SUGGESTION.calories).toLocaleString()} kcal · ${EVENING_SUGGESTION.fiber}g fiber added`,
      }
    );
  };

  // Add scanned meal from modal
  const handleMealScanned = (newMeal: LoggedMeal) => {
    setLoggedMeals((prev) => [...prev, newMeal]);
    setActiveMeal(newMeal);

    toast.success(`Logged ${newMeal.name} (+${newMeal.calories} kcal)`, {
      description: `${newMeal.slot} logged with ${newMeal.protein}g protein, ${newMeal.carbs}g carbs, ${newMeal.fat}g fats, ${newMeal.fiber || 0}g fiber`,
    });
  };

  // Add custom manual meal
  const handleCustomMealAdded = (newMeal: LoggedMeal) => {
    setLoggedMeals((prev) => [...prev, newMeal]);
    setActiveMeal(newMeal);
    setIsCustomMealOpen(false);

    toast.success(`Logged ${newMeal.name} (+${newMeal.calories} kcal)`, {
      description: `${newMeal.slot} logged with ${newMeal.protein}g protein, ${newMeal.carbs}g carbs, ${newMeal.fat}g fat`,
    });
  };

  // Save Goals from Settings & BMI Calculator
  const handleSaveGoals = (newMacros: MacroGoals, newMicros: MicroGoals) => {
    setMacroGoals(newMacros);
    setMicroGoals(newMicros);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("platewise_macro_goals", JSON.stringify(newMacros));
        localStorage.setItem("platewise_micro_goals", JSON.stringify(newMicros));
      } catch {}
    }

    setIsSettingsOpen(false);
    toast.success("Daily targets updated successfully!", {
      description: `Target: ${newMacros.calories.toLocaleString()} kcal · ${newMacros.protein}g protein · ${newMacros.carbs}g carbs · ${newMacros.fat}g fat`,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased font-sans transition-colors duration-200">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Top Header Bar with Platewise Logo & Name */}
        <OverviewHeader
          currentDate="Fri, Nov 20"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenScanModal={() => setIsScanModalOpen(true)}
          onOpenSearchDialog={() => setIsSearchDialogOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 2x2 Grid Layout with Energy, Macros & Micros */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7">
          {/* Row 1, Col 1: Active Meal Photo Card with Vision Overlays */}
          <section aria-label="Selected Meal">
            <ActiveMealCard
              meal={activeMeal}
              onScanNewPhoto={() => setIsScanModalOpen(true)}
            />
          </section>

          {/* Row 1, Col 2: Daily Energy, Macros & Key Micros */}
          <section aria-label="Daily Energy and Macros">
            <DailyMacrosCard
              caloriesConsumed={totalCalories}
              goals={macroGoals}
              proteinConsumed={totalProtein}
              carbsConsumed={totalCarbs}
              fatConsumed={totalFat}
              micros={totalMicros}
              microGoals={microGoals}
              onEditGoals={() => setIsSettingsOpen(true)}
            />
          </section>

          {/* Row 2, Col 1: Daily Micronutrients & Essential Minerals */}
          <section aria-label="Daily Micronutrients and Minerals">
            <DailyMicrosCard
              micros={totalMicros}
              goals={microGoals}
              onEditGoals={() => setIsSettingsOpen(true)}
            />
          </section>

          {/* Row 2, Col 2: Today's Intake & Timeline */}
          <section aria-label="Today's Intake">
            <TodayIntakeTimeline
              meals={filteredMeals}
              activeMealId={activeMeal?.id}
              onSelectMeal={(meal) => setActiveMeal(meal)}
              onDeleteMeal={handleDeleteMeal}
              onClearLog={handleClearLog}
              onResetDemo={handleResetDemo}
              eveningSuggestion={EVENING_SUGGESTION}
              isEveningSuggestionLogged={isEveningSuggestionLogged}
              onLogEveningSuggestion={handleLogEveningSuggestion}
              onAddCustomMeal={() => setIsCustomMealOpen(true)}
            />
          </section>
        </div>
      </main>

      {/* Interactive Scan Meal Modal */}
      <ScanMealModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onMealScanned={handleMealScanned}
      />

      {/* ⌘K Command Palette / Search Dialog */}
      <SearchCommandDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        meals={loggedMeals}
        onSelectMeal={(meal) => setActiveMeal(meal)}
        onOpenScanModal={() => setIsScanModalOpen(true)}
        onLogEveningSuggestion={handleLogEveningSuggestion}
      />

      {/* Settings & BMI / Metabolic Calculator Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentGoals={macroGoals}
        currentMicroGoals={microGoals}
        onSaveGoals={handleSaveGoals}
      />

      {/* Add Custom / Manual Meal Modal */}
      <AddCustomMealModal
        isOpen={isCustomMealOpen}
        onClose={() => setIsCustomMealOpen(false)}
        onAddMeal={handleCustomMealAdded}
      />
    </div>
  );
}

export default DashboardOverview;
