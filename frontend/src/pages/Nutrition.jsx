import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Search, Apple, Calendar, Plus, Trash2, Loader, Sparkles } from 'lucide-react';

export default function Nutrition() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [logs, setLogs] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 });
  const [tdeeTarget, setTdeeTarget] = useState(2000);
  
  const [searchLoading, setSearchLoading] = useState(false);
  const [logLoading, setLogLoading] = useState(true);

  // Log Form Modal states
  const [selectedFood, setSelectedFood] = useState(null);
  const [mealType, setMealType] = useState('breakfast');
  const [servingMultiplier, setServingMultiplier] = useState(1);

  const fetchMealLogs = async () => {
    setLogLoading(true);
    try {
      const data = await api.food.getLogs(date);
      setLogs(data.logs);
      setTotals(data.totals);

      // Get user TDEE target from wellness summary
      const summary = await api.wellness.getSummary();
      if (summary.calculators) {
        setTdeeTarget(summary.calculators.tdee);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLogLoading(false);
    }
  };

  useEffect(() => {
    fetchMealLogs();
  }, [date]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setSearchLoading(true);
    try {
      const data = await api.food.search(query);
      setSearchResults(data);
      if (data.length > 0) {
        setSelectedFood(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLogMeal = async (e) => {
    e.preventDefault();
    if (!selectedFood) return;
    try {
      const multiplier = parseFloat(servingMultiplier) || 1;
      await api.food.logMeal({
        food_name: selectedFood.name,
        calories: Math.round(selectedFood.calories * multiplier),
        protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
        fat: Math.round(selectedFood.fat * multiplier * 10) / 10,
        carbs: Math.round(selectedFood.carbs * multiplier * 10) / 10,
        fiber: Math.round(selectedFood.fiber * multiplier * 10) / 10,
        serving_size: `${multiplier}x (${selectedFood.serving_size})`,
        meal_type: mealType,
        date
      });
      setSelectedFood(null);
      fetchMealLogs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await api.food.deleteLog(id);
      fetchMealLogs();
    } catch (err) {
      alert(err.message);
    }
  };

  // Group logs by meal type
  const mealGroups = {
    breakfast: logs.filter(l => l.meal_type === 'breakfast'),
    lunch: logs.filter(l => l.meal_type === 'lunch'),
    dinner: logs.filter(l => l.meal_type === 'dinner'),
    snack: logs.filter(l => l.meal_type === 'snack')
  };

  return (
    <div className="min-h-screen bg-[#0c1530] flex">
      <Sidebar />

      <main className="flex-1 pl-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Nutrition Engine</h1>
              <p className="text-gray-400 mt-1">Track calorie counts, manage protein logs, and log daily ingredients.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-[#111827] border border-gray-800 rounded-xl py-2 px-3 text-sm text-white font-semibold font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Food search & USDA results */}
            <div className="space-y-6">
              
              <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Apple className="w-4 h-4 text-green-400" />
                  <span>USDA Database Lookup</span>
                </h3>

                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search foods (e.g. Oats)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-green-500 transition-all text-sm placeholder:text-gray-600"
                  />
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                </form>

                {searchLoading && (
                  <div className="flex items-center justify-center py-6">
                    <Loader className="w-6 h-6 animate-spin text-green-400" />
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {searchResults.map((food, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedFood(food)}
                        className={`w-full text-left p-3 rounded-xl border flex justify-between items-center transition-all cursor-pointer ${
                          selectedFood?.name === food.name 
                            ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                            : 'bg-gray-900/40 border-gray-850 hover:bg-gray-800/40 text-gray-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="text-xs font-bold truncate">{food.name}</p>
                          <span className="text-[10px] text-gray-500 font-medium font-mono">{food.serving_size}</span>
                        </div>
                        <span className="text-xs font-bold shrink-0">{food.calories} Cal</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Log Selector Details Form */}
              {selectedFood && (
                <form onSubmit={handleLogMeal} className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">Log Selection</h3>
                  <div className="p-3 bg-[#0b0f19] rounded-xl border border-gray-850 text-xs space-y-2">
                    <p className="font-bold text-white">{selectedFood.name}</p>
                    <div className="grid grid-cols-4 gap-2 text-center text-gray-400 font-mono mt-2">
                      <div>
                        <span className="text-[10px]">Protein</span>
                        <p className="font-bold text-white">{selectedFood.protein}g</p>
                      </div>
                      <div>
                        <span className="text-[10px]">Carbs</span>
                        <p className="font-bold text-white">{selectedFood.carbs}g</p>
                      </div>
                      <div>
                        <span className="text-[10px]">Fat</span>
                        <p className="font-bold text-white">{selectedFood.fat}g</p>
                      </div>
                      <div>
                        <span className="text-[10px]">Fiber</span>
                        <p className="font-bold text-white">{selectedFood.fiber}g</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-500 font-semibold mb-1">Meal category</label>
                      <select
                        value={mealType}
                        onChange={(e) => setMealType(e.target.value)}
                        className="w-full bg-[#0b0f19] border border-gray-800 rounded-lg py-2 px-3 text-white focus:outline-none"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-500 font-semibold mb-1">Serving multiplier</label>
                      <input
                        type="number"
                        step="0.1"
                        value={servingMultiplier}
                        onChange={(e) => setServingMultiplier(e.target.value)}
                        className="w-full bg-[#0b0f19] border border-gray-800 rounded-lg py-2 px-3 text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Log Meal Entry</span>
                  </button>
                </form>
              )}

              {/* Diet Planner Phase 2 Advisor */}
              <div className="glass-panel p-5 rounded-2xl bg-gradient-to-br from-[#111827]/40 to-[#0b0f19] border border-gray-850 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span>AI Meal Planner (Phase 2)</span>
                </h4>
                <p className="text-[11px] text-gray-450 leading-relaxed">
                  Personalized AI diet plans balancing protein objectives and allergy filters are scheduled for Phase 2 integration utilizing Google Gemini reasoning.
                </p>
              </div>

            </div>

            {/* Right Column: Daily meal categories list & macro totals */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Daily Macro Progress Summary */}
              <div className="glass-panel p-6 rounded-2xl border border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-550">Daily Calorie Target</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-white">{totals.calories}</span>
                    <span className="text-sm text-gray-500">/ {tdeeTarget} kcal</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden mt-3">
                    <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${Math.min((totals.calories / tdeeTarget) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center border-l border-gray-850 pl-6">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Protein</span>
                    <p className="text-sm font-extrabold text-red-400 mt-1">{totals.protein}g</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Carbs</span>
                    <p className="text-sm font-extrabold text-amber-400 mt-1">{totals.carbs}g</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Fats</span>
                    <p className="text-sm font-extrabold text-blue-400 mt-1">{totals.fat}g</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Fiber</span>
                    <p className="text-sm font-extrabold text-purple-400 mt-1">{totals.fiber}g</p>
                  </div>
                </div>
              </div>

              {/* Grouped Meal logs */}
              {logLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-green-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => {
                    const groupLogs = mealGroups[type] || [];
                    return (
                      <div key={type} className="glass-panel p-5 rounded-2xl border border-gray-850 space-y-3">
                        <h4 className="text-sm font-bold text-white capitalize flex justify-between items-center">
                          <span>{type}</span>
                          <span className="text-xs font-semibold text-gray-500">
                            {groupLogs.reduce((acc, log) => acc + log.calories, 0)} kcal
                          </span>
                        </h4>

                        <div className="divide-y divide-gray-850/60">
                          {groupLogs.length > 0 ? (
                            groupLogs.map((log) => (
                              <div key={log.id} className="py-2.5 flex justify-between items-center text-xs text-gray-300">
                                <div>
                                  <p className="font-bold text-white">{log.food_name}</p>
                                  <span className="text-gray-500">{log.serving_size} • P: {log.protein}g C: {log.carbs}g F: {log.fat}g</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-bold font-mono">{log.calories} kcal</span>
                                  <button onClick={() => handleDeleteLog(log.id)} className="text-red-400 hover:text-red-300 p-1 cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-550 italic py-1">No meals logged for {type}.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
