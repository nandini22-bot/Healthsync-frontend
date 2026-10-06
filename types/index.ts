/*
  FILE PURPOSE:
  Centralized TypeScript type definitions for the HealthSync application.

  WHY IT EXISTS:
  Establishes structured interfaces and data models throughout the project, 
  ensuring static typing validity, editor autocomplete, and contract safety across client and server files.

  DATA FLOW:
  Imported by layout shells, form submit handles, service layers, and database methods.
*/

// --- USER & PROFILE TYPES ---

export interface UserProfile {
  age: number;
  height: number; // in cm
  weight: number; // in kg
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  fitnessGoal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle' | 'improve_endurance';
  dietaryPreference: 'none' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'pescatarian' | 'gluten_free';
  allergies?: string;
  medicalConditions?: string;
  injuries?: string;
}

export interface User {
  id: string;
  email: string;
  preferredRegion: 'IN' | 'US';
  profile?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

// --- MEDICATION TYPES ---

export interface DosingReminder {
  dosage: string;
  frequency: string; // e.g. "daily", "twice_daily", "weekly"
  times: string[]; // Array of alarms e.g. ["08:00", "20:00"]
  isActive: boolean;
}

export interface Medication {
  id: string;
  userId: string;
  brandName: string;
  genericName: string;
  activeIngredient: string;
  reminders: DosingReminder[];
  createdAt: Date;
}

export interface ReferenceMedicine {
  id: string;
  region: 'IN' | 'US';
  brandName: string;
  genericName: string;
  activeIngredient: string;
  uses: string;
  sideEffects: string;
  warnings: string;
  precautions: string;
  storageInfo: string;
  source: string; // e.g. "Indian Reference Catalogue" or "OpenFDA API"
  lastVerifiedAt: Date;
}

// --- TELEMETRY & LOG TYPES ---

export interface WellnessLog {
  id: string;
  userId: string;
  logDate: string; // YYYY-MM-DD
  weightKg?: number;
  waterMl?: number;
  sleepHours?: number;
  sleepQuality?: number; // 1-5 rating scale
  createdAt: Date;
}

export interface NutritionLog {
  id: string;
  userId: string;
  foodName: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  servingSize: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  logDate: string; // YYYY-MM-DD
}

export interface ActivityLog {
  id: string;
  userId: string;
  exerciseName: string;
  category: 'cardio' | 'strength' | 'stretching' | 'yoga';
  durationMinutes: number;
  caloriesBurned: number;
  sets?: number;
  reps?: number;
  weight?: number;
  logDate: string; // YYYY-MM-DD
}
