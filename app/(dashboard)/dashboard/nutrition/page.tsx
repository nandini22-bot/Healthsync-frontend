"use client";

import React, { useState } from 'react';
import { 
  Apple, 
  Plus, 
  Search, 
  Trash2, 
  Check, 
  TrendingUp 
} from 'lucide-react';

interface LocalFoodItem {
  _id: string;
  foodName: string;
  servingSize: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
}

interface LoggedMeal {
  _id: string;
  foodName: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  servingSize: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const mockFoodCatalog: LocalFoodItem[] = [
  { _id: 'f1', foodName: 'Oatmeal with Honey & Fruits', servingSize: '1 Bowl (250g)', calories: 280, protein: 9.5, fat: 4.5, carbs: 48, fiber: 6 },
  { _id: 'f2', foodName: 'Paneer Tikka (Grilled)', servingSize: '6 Pieces (180g)', calories: 340, protein: 22, fat: 24, carbs: 8, fiber: 2 },
  { _id: 'f3', foodName: 'Chicken Biryani (Hyderabadi)', servingSize: '1 Plate (350g)', calories: 550, protein: 32, fat: 18, carbs: 62, fiber: 3 },
  { _id: 'f4', foodName: 'Dal Tadka & Steamed Rice', servingSize: '1 Bowl Dal + 1 Cup Rice', calories: 420, protein: 14, fat: 9, carbs: 70, fiber: 5 },
  { _id: 'f5', foodName: 'Whole Wheat Roti', servingSize: '2 Pieces (80g)', calories: 170, protein: 6, fat: 2, carbs: 34, fiber: 4 },
  { _id: 'f6', foodName: 'Greek Yogurt Salad', servingSize: '1 Bowl (200g)', calories: 190, protein: 16, fat: 5, carbs: 18, fiber: 2 },
  { _id: 'f7', foodName: 'Boiled Eggs (2 whole)', servingSize: '2 Eggs (100g)', calories: 155, protein: 13, fat: 11, carbs: 1, fiber: 0 }
];

export default function NutritionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocalFoodItem[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);

  const [selectedFood, setSelectedFood] = useState<LocalFoodItem | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [logSuccess, setLogSuccess] = useState<string | null>(null);

  const targets = {
    intake: 2000,
    protein: 120,
    carbs: 250,
    fat: 80
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = mockFoodCatalog.filter(f =>
      f.foodName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
    setSelectedFood(null);
    if (filtered.length === 0) {
      setSearchError('No matching food items found. Try searching for Paneer, Biryani, Roti, or Oats.');
    } else {
      setSearchError(null);
    }
  };

  const handleLogMeal = () => {
    if (!selectedFood) return;

    const scaledLog: LoggedMeal = {
      _id: Date.now().toString(),
      foodName: selectedFood.foodName,
      calories: Math.round(selectedFood.calories * multiplier),
      protein: Number((selectedFood.protein * multiplier).toFixed(1)),
      fat: Number((selectedFood.fat * multiplier).toFixed(1)),
      carbs: Number((selectedFood.carbs * multiplier).toFixed(1)),
      fiber: Number((selectedFood.fiber * multiplier).toFixed(1)),
      servingSize: multiplier === 1 ? selectedFood.servingSize : `${multiplier}x (${selectedFood.servingSize})`,
      mealType
    };

    setLoggedMeals(prev => [...prev, scaledLog]);
    setLogSuccess(`Successfully logged ${selectedFood.foodName}!`);
    setSelectedFood(null);
    setSearchResults([]);
    setSearchQuery('');
    setMultiplier(1);
    setTimeout(() => setLogSuccess(null), 3000);
  };

  const handleDeleteMeal = (id: string) => {
    setLoggedMeals(prev => prev.filter(m => m._id !== id));
  };

  const totalCalories = loggedMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = Number(loggedMeals.reduce((sum, m) => sum + m.protein, 0).toFixed(1));
  const totalFat = Number(loggedMeals.reduce((sum, m) => sum + m.fat, 0).toFixed(1));
  const totalCarbs = Number(loggedMeals.reduce((sum, m) => sum + m.carbs, 0).toFixed(1));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Nutrition Log</h1>
        <p className="text-slate-500 mt-1">Track daily meals, monitor macro ratios, and analyze ingredient balances using our local database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Food Search panel */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Search Local Catalog</h3>
            
            {searchError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs p-3 rounded-xl">
                {searchError}
              </div>
            )}

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search food items (e.g. Biryani, Roti, Paneer, Egg, Rice, Oats)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
                />
                <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
              </div>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl transition-all border-none cursor-pointer text-xs min-w-24 flex items-center justify-center"
              >
                Search
              </button>
            </form>

            {/* Match Results list */}
            {searchResults.length > 0 && !selectedFood && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((item) => (
                  <div 
                    key={item._id} 
                    onClick={() => setSelectedFood(item)}
                    className="p-3 bg-slate-50 border border-slate-100 hover:border-blue-300 rounded-xl cursor-pointer transition-all flex justify-between items-center"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{item.foodName}</span>
                      <span className="text-[10px] text-slate-500">Serving: {item.servingSize}</span>
                    </div>
                    <span className="text-xs font-extrabold text-blue-600">{item.calories} kcal</span>
                  </div>
                ))}
              </div>
            )}

            {/* Selected food portion scaling & log form */}
            {selectedFood && (
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{selectedFood.foodName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Standard serving: {selectedFood.servingSize}</p>
                  </div>
                  
                  <div className="flex gap-2 items-center flex-wrap">
                    {/* Multiplier */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-bold">Qty:</span>
                      <input
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={multiplier}
                        onChange={(e) => setMultiplier(Math.max(0.25, parseFloat(e.target.value) || 1))}
                        className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-center text-xs focus:outline-none"
                      />
                    </div>

                    <select
                      value={mealType}
                      onChange={(e: any) => setMealType(e.target.value)}
                      className="px-2 py-1 bg-white border border-slate-200 text-[10px] font-bold rounded-lg focus:outline-none"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>

                    <button
                      onClick={handleLogMeal}
                      className="bg-blue-650 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg border-none cursor-pointer text-[10px] flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Meal</span>
                    </button>
                    
                    <button
                      onClick={() => { setSelectedFood(null); setMultiplier(1); }}
                      className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-350 text-slate-600 font-bold rounded-lg border-none cursor-pointer text-[10px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Scaled Macro pills preview */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Calories</span>
                    <span className="text-sm font-extrabold text-slate-800">{Math.round(selectedFood.calories * multiplier)} kcal</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Protein</span>
                    <span className="text-sm font-extrabold text-red-650">{((selectedFood.protein * multiplier)).toFixed(1)}g</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Carbs</span>
                    <span className="text-sm font-extrabold text-amber-600">{((selectedFood.carbs * multiplier)).toFixed(1)}g</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Fat</span>
                    <span className="text-sm font-extrabold text-blue-650">{((selectedFood.fat * multiplier)).toFixed(1)}g</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Fiber</span>
                    <span className="text-sm font-extrabold text-green-600">{((selectedFood.fiber * multiplier)).toFixed(1)}g</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logged meals feed */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-800">Today's Meals</h3>

            {logSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-xs flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4" />
                <span>{logSuccess}</span>
              </div>
            )}

            {loggedMeals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-xl text-xs" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                <Apple className="w-8 h-8 mb-2" style={{ color: 'var(--border-color)' }} />
                <span>No meals logged for today. Start searching above.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {loggedMeals.map((meal) => (
                  <div key={meal._id} className="p-4 rounded-xl flex items-center justify-between border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs" style={{ color: 'var(--text-main)' }}>{meal.foodName}</span>
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-extrabold uppercase rounded-md tracking-wider">
                          {meal.mealType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                        <span>Portion: {meal.servingSize}</span>
                        <span>•</span>
                        <span>{meal.calories} kcal (P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g)</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMeal(meal._id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 transition-all border-none cursor-pointer bg-transparent rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Daily Balance target trackers */}
        <div className="glass-panel p-6 rounded-2xl h-fit space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Daily Balance</span>
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Total Calorie Limit: {totalCalories} / {targets.intake} kcal ({Math.round((totalCalories / targets.intake) * 100)}% met)
            </p>
          </div>

          <div className="space-y-5">
            {/* Protein */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-500">Proteins</span>
                <span className="text-slate-850">{totalProtein}g / {targets.protein}g ({Math.round((totalProtein / targets.protein) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (totalProtein / targets.protein) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-500">Carbohydrates</span>
                <span className="text-slate-850">{totalCarbs}g / {targets.carbs}g ({Math.round((totalCarbs / targets.carbs) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (totalCarbs / targets.carbs) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Fats */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-500">Fats</span>
                <span className="text-slate-850">{totalFat}g / {targets.fat}g ({Math.round((totalFat / targets.fat) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (totalFat / targets.fat) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
