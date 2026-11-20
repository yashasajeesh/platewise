import type { MacroGoals, MicroGoals, UserProfile } from "./dashboard-types";

export interface BmiResult {
  bmi: number;
  category: "Underweight" | "Normal weight" | "Overweight" | "Obesity";
  color: string;
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  if (heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: "Normal weight", color: "text-neutral-500" };
  }

  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category: BmiResult["category"] = "Normal weight";
  let color = "text-teal-600";

  if (bmi < 18.5) {
    category = "Underweight";
    color = "text-sky-600";
  } else if (bmi <= 24.9) {
    category = "Normal weight";
    color = "text-teal-600";
  } else if (bmi <= 29.9) {
    category = "Overweight";
    color = "text-amber-600";
  } else {
    category = "Obesity";
    color = "text-rose-600";
  }

  return { bmi, category, color };
}

export function calculateNutritionNeeds(profile: UserProfile): {
  bmiResult: BmiResult;
  bmr: number;
  tdee: number;
  macroGoals: MacroGoals;
  microGoals: MicroGoals;
} {
  const { gender, age, heightCm, weightKg, activityLevel, goal } = profile;
  const bmiResult = calculateBmi(weightKg, heightCm);

  // Mifflin-St Jeor equation for BMR
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr = gender === "male" ? bmr + 5 : bmr - 161;
  bmr = Math.round(bmr);

  // Activity multipliers
  const activityFactors: Record<UserProfile["activityLevel"], number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };

  const tdee = Math.round(bmr * (activityFactors[activityLevel] || 1.2));

  // Goal calorie adjustment
  let targetCalories = tdee;
  if (goal === "fat_loss") {
    targetCalories = Math.max(1200, tdee - 450); // Safe deficit
  } else if (goal === "muscle_gain") {
    targetCalories = tdee + 300; // Lean surplus
  }

  // Macro calculation
  // Protein: 1.8g - 2.2g per kg of bodyweight
  const proteinMultiplier = goal === "fat_loss" ? 2.1 : goal === "muscle_gain" ? 2.0 : 1.8;
  const proteinGrams = Math.round(weightKg * proteinMultiplier);
  const proteinCalories = proteinGrams * 4;

  // Fats: 25% of total calories (9 kcal per gram)
  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);

  // Carbs: remaining calories (4 kcal per gram)
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatGrams * 9));
  const carbsGrams = Math.round(remainingCalories / 4);

  // Micronutrient recommendations tailored to profile & calories
  const fiberGrams = Math.round((targetCalories / 1000) * 14); // 14g per 1000 kcal
  const sodiumMg = 2300;
  const potassiumMg = gender === "male" ? 3400 : 2600;
  const calciumMg = age > 50 ? 1200 : 1000;
  const ironMg = gender === "female" && age <= 50 ? 18 : 10;
  const vitaminCMg = gender === "male" ? 90 : 75;

  return {
    bmiResult,
    bmr,
    tdee,
    macroGoals: {
      calories: targetCalories,
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams,
    },
    microGoals: {
      fiber: fiberGrams,
      sodium: sodiumMg,
      potassium: potassiumMg,
      calcium: calciumMg,
      iron: ironMg,
      vitaminC: vitaminCMg,
    },
  };
}
