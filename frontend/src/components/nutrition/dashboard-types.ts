export interface DetectedIngredient {
  name: string;
  weight: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number | undefined;
  sodium?: number | undefined; // mg
  potassium?: number | undefined; // mg
  calcium?: number | undefined; // mg
  iron?: number | undefined; // mg
  vitaminC?: number | undefined; // mg
  xPercent: number; // 0 - 100 for visual overlay
  yPercent: number; // 0 - 100 for visual overlay
  boxWidth?: number | undefined;
  boxHeight?: number | undefined;
}

export interface LoggedMeal {
  id: string;
  slot: "Breakfast" | "Lunch" | "Snack" | "Dinner";
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number | undefined; // g
  sodium?: number | undefined; // mg
  potassium?: number | undefined; // mg
  calcium?: number | undefined; // mg
  iron?: number | undefined; // mg
  vitaminC?: number | undefined; // mg
  sugar?: number | undefined; // g
  time?: string | undefined;
  imageUrl: string;
  confidence?: number | undefined;
  detectedItems?: DetectedIngredient[] | undefined;
  dotColor?: string | undefined;
}

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MicroGoals {
  fiber: number; // g
  sodium: number; // mg (max limit)
  potassium: number; // mg
  calcium: number; // mg
  iron: number; // mg
  vitaminC: number; // mg
}

export interface MicrosConsumed {
  fiber: number;
  sodium: number;
  potassium: number;
  calcium: number;
  iron: number;
  vitaminC: number;
  sugar?: number | undefined;
}

export interface DayConsistency {
  day: string;
  calories: number;
  target: number;
  isToday?: boolean | undefined;
}

export interface UserProfile {
  gender: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: "sedentary" | "light" | "moderate" | "very_active" | "extra_active";
  goal: "fat_loss" | "maintain" | "muscle_gain";
}
