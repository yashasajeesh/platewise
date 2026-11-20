import { describe, expect, it, vi } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";

import {
  DailyMacrosCard,
  DailyMicrosCard,
  ActiveMealCard,
  TodayIntakeTimeline,
  OverviewHeader,
  DEFAULT_GOALS,
  DEFAULT_MICRO_GOALS,
  INITIAL_LOGGED_MEALS,
  SALMON_BOWL_MEAL,
  EVENING_SUGGESTION,
} from "@/components/nutrition";

describe("Dashboard Components Matching Target Mockup with Micros and Platewise Branding", () => {
  it("renders OverviewHeader with Platewise logo, name, date, search shortcut, and scan meal button", () => {
    const handleOpenScan = vi.fn();
    const handleOpenSearch = vi.fn();

    const { getByText } = render(
      <OverviewHeader
        currentDate="Fri, Nov 20"
        searchQuery=""
        onSearchChange={() => {}}
        onOpenScanModal={handleOpenScan}
        onOpenSearchDialog={handleOpenSearch}
      />,
    );

    expect(getByText("platewise")).toBeDefined();
    expect(getByText("Overview")).toBeDefined();
    expect(getByText("Fri, Nov 20")).toBeDefined();
    expect(getByText("⌘K")).toBeDefined();
    expect(getByText("Scan Meal")).toBeDefined();

    fireEvent.click(getByText("Scan Meal"));
    expect(handleOpenScan).toHaveBeenCalledTimes(1);
  });

  it("renders DailyMacrosCard with 1,640 kcal consumed, 400 left, macro targets, and key micros", () => {
    const { getByText } = render(
      <DailyMacrosCard
        caloriesConsumed={1640}
        goals={DEFAULT_GOALS}
        proteinConsumed={128}
        carbsConsumed={165}
        fatConsumed={52}
        micros={{
          fiber: 24,
          sodium: 1140,
          potassium: 2520,
          calcium: 780,
          iron: 13.3,
          vitaminC: 68,
        }}
        microGoals={DEFAULT_MICRO_GOALS}
      />,
    );

    expect(getByText("Daily Energy, Macros & Micros")).toBeDefined();
    expect(getByText("1,640")).toBeDefined();
    expect(getByText("kcal consumed")).toBeDefined();
    expect(getByText("400 left")).toBeDefined();

    expect(getByText("128g / 150g")).toBeDefined();
    expect(getByText("165g / 210g")).toBeDefined();
    expect(getByText("52g / 65g")).toBeDefined();

    expect(getByText("Key Micronutrients")).toBeDefined();
    expect(getByText(/Fiber/i)).toBeDefined();
    expect(getByText(/Sodium/i)).toBeDefined();
    expect(getByText(/Potassium/i)).toBeDefined();
    expect(getByText(/Iron/i)).toBeDefined();
  });

  it("renders DailyMicrosCard with all 6 essential micronutrients and daily targets", () => {
    const { getByText } = render(
      <DailyMicrosCard
        micros={{
          fiber: 24,
          sodium: 1140,
          potassium: 2520,
          calcium: 780,
          iron: 13.3,
          vitaminC: 68,
        }}
        goals={DEFAULT_MICRO_GOALS}
      />,
    );

    expect(getByText("Daily Micronutrients & Minerals")).toBeDefined();
    expect(getByText("Dietary Fiber")).toBeDefined();
    expect(getByText("Sodium")).toBeDefined();
    expect(getByText("Potassium")).toBeDefined();
    expect(getByText("Calcium")).toBeDefined();
    expect(getByText("Iron")).toBeDefined();
    expect(getByText("Vitamin C")).toBeDefined();
  });

  it("renders ActiveMealCard with 540 kcal, 98.4% confidence, and bounding tags", () => {
    const { getByText } = render(<ActiveMealCard meal={SALMON_BOWL_MEAL} />);

    expect(getByText("540 kcal")).toBeDefined();
    expect(getByText("98.4%")).toBeDefined();
    expect(getByText("confidence")).toBeDefined();
    expect(getByText(/Salmon - 150g/)).toBeDefined();
    expect(getByText(/Avocado - 60g/)).toBeDefined();
    expect(getByText(/Quinoa - 90g/)).toBeDefined();
  });

  it("renders TodayIntakeTimeline and handles AI Evening Suggestion logging", () => {
    const handleLog = vi.fn();
    const handleSelect = vi.fn();

    const { getByText } = render(
      <TodayIntakeTimeline
        meals={INITIAL_LOGGED_MEALS}
        activeMealId={SALMON_BOWL_MEAL.id}
        onSelectMeal={handleSelect}
        eveningSuggestion={EVENING_SUGGESTION}
        isEveningSuggestionLogged={false}
        onLogEveningSuggestion={handleLog}
      />,
    );

    expect(getByText("Today's Intake")).toBeDefined();
    expect(getByText("Steel-Cut Oats")).toBeDefined();
    expect(getByText("380 kcal")).toBeDefined();
    expect(getByText("Salmon Quinoa Bowl")).toBeDefined();
    expect(getByText("Skyr & Berries")).toBeDefined();
    expect(getByText("180 kcal")).toBeDefined();

    expect(getByText(/AI Evening Suggestion/i)).toBeDefined();
    expect(getByText(/Herb Chicken & Sweet Potato - 520 kcal/)).toBeDefined();

    const logButton = getByText("Log");
    fireEvent.click(logButton);
    expect(handleLog).toHaveBeenCalledTimes(1);
  });

  it("handles Clear log and empty state in TodayIntakeTimeline", () => {
    const handleClearLog = vi.fn();
    const handleResetDemo = vi.fn();

    const { getByText } = render(
      <TodayIntakeTimeline
        meals={[]}
        onSelectMeal={() => {}}
        onClearLog={handleClearLog}
        onResetDemo={handleResetDemo}
        eveningSuggestion={EVENING_SUGGESTION}
        isEveningSuggestionLogged={false}
        onLogEveningSuggestion={() => {}}
      />
    );

    expect(getByText("No meals logged for today")).toBeDefined();
    expect(getByText("Restore Demo")).toBeDefined();

    fireEvent.click(getByText("Restore Demo"));
    expect(handleResetDemo).toHaveBeenCalledTimes(1);
  });

  it("calculates accurate BMI and Mifflin-St Jeor TDEE & macro targets in nutrition-calculator", async () => {
    const { calculateBmi, calculateNutritionNeeds } = await import(
      "@/components/nutrition/nutrition-calculator"
    );

    // 175cm, 74kg -> BMI ~24.2 (Normal weight)
    const bmiResult = calculateBmi(74, 175);
    expect(bmiResult.bmi).toBe(24.2);
    expect(bmiResult.category).toBe("Normal weight");

    // Male, 28y, 175cm, 74kg, moderate activity, maintain goal
    const needs = calculateNutritionNeeds({
      gender: "male",
      age: 28,
      weightKg: 74,
      heightCm: 175,
      activityLevel: "moderate",
      goal: "maintain",
    });

    expect(needs.bmiResult.bmi).toBe(24.2);
    expect(needs.bmr).toBeGreaterThan(1600);
    expect(needs.tdee).toBeGreaterThan(2400);
    expect(needs.macroGoals.calories).toBe(needs.tdee);
    expect(needs.macroGoals.protein).toBeGreaterThan(120);
    expect(needs.macroGoals.carbs).toBeGreaterThan(200);
    expect(needs.macroGoals.fat).toBeGreaterThan(50);
    expect(needs.microGoals.fiber).toBe(37); // calculated fiber (14g per 1000 kcal)
  });

  it("renders SettingsModal and saves updated targets", async () => {
    const { SettingsModal } = await import("@/components/nutrition/SettingsModal");
    const handleSave = vi.fn();

    const { baseElement } = render(
      <SettingsModal
        isOpen={true}
        onClose={() => {}}
        currentGoals={DEFAULT_GOALS}
        currentMicroGoals={DEFAULT_MICRO_GOALS}
        onSaveGoals={handleSave}
      />
    );

    expect(within(baseElement).getByText("Customize Daily Intake & Targets")).toBeDefined();
    expect(within(baseElement).getByText("BMI & Metabolic Calculator")).toBeDefined();
    expect(within(baseElement).getByText("Manual Targets Override")).toBeDefined();

    // Find and click the apply button
    const applyButton = within(baseElement).getByText(/Apply Calculated Targets/i);
    fireEvent.click(applyButton);

    expect(handleSave).toHaveBeenCalledTimes(1);
    const [savedMacros, savedMicros] = handleSave.mock.calls[0] as [any, any];
    expect(savedMacros.calories).toBeDefined();
    expect(savedMacros.protein).toBeDefined();
    expect(savedMicros.fiber).toBeDefined();
  });

  it("renders AddCustomMealModal and selects quick presets", async () => {
    const { AddCustomMealModal } = await import("@/components/nutrition/AddCustomMealModal");
    const handleAdd = vi.fn();

    const { baseElement } = render(
      <AddCustomMealModal
        isOpen={true}
        onClose={() => {}}
        onAddMeal={handleAdd}
      />
    );

    expect(within(baseElement).getByText("Log Custom Meal")).toBeDefined();
    expect(within(baseElement).getByText(/Whey Protein Shake/i)).toBeDefined();
    expect(within(baseElement).getByText(/Greek Yogurt Bowl/i)).toBeDefined();

    // Click quick preset
    fireEvent.click(within(baseElement).getByText(/Whey Protein Shake/i));

    // Name input should reflect selection
    const nameInput = within(baseElement).getByPlaceholderText(
      /Scrambled Eggs on Sourdough/i,
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("Whey Protein Shake");

    // Click log meal button
    fireEvent.click(within(baseElement).getByText("Log Meal"));
    expect(handleAdd).toHaveBeenCalledTimes(1);
    const [addedMeal] = handleAdd.mock.calls[0] as [any];
    expect(addedMeal.name).toBe("Whey Protein Shake");
    expect(addedMeal.calories).toBe(140);
    expect(addedMeal.protein).toBe(26);
  });

  it("toggles dark and light mode and updates document.documentElement class", async () => {
    const { ThemeProvider, ThemeToggleButton } = await import("@/lib/theme");

    const { getByRole } = render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>,
    );

    const toggleBtn = getByRole("button", { name: /Switch to (dark|light) mode/i });
    expect(toggleBtn).toBeDefined();

    const initialIsDark = document.documentElement.classList.contains("dark");

    // Click to toggle
    fireEvent.click(toggleBtn);
    expect(document.documentElement.classList.contains("dark")).toBe(!initialIsDark);

    // Click again to toggle back
    fireEvent.click(toggleBtn);
    expect(document.documentElement.classList.contains("dark")).toBe(initialIsDark);
  });
});
