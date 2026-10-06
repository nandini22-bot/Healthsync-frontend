import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Search, Dumbbell, Calendar, Plus, Trash2, Loader, Sparkles } from 'lucide-react';

export default function Exercise() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [catalog, setCatalog] = useState([]);
  const [logs, setLogs] = useState([]);
  const [totals, setTotals] = useState({ duration: 0, caloriesBurned: 0, count: 0 });
  
  const [catLoading, setCatLoading] = useState(false);
  const [logLoading, setLogLoading] = useState(true);

  // Logging Form states
  const [selectedEx, setSelectedEx] = useState(null);
  const [duration, setDuration] = useState('30');
  const [caloriesBurnedInput, setCaloriesBurnedInput] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weightInput, setWeightInput] = useState('');

  const fetchWorkoutLogs = async () => {
    setLogLoading(true);
    try {
      const data = await api.exercise.getLogs(date);
      setLogs(data.logs);
      setTotals(data.totals);
    } catch (err) {
      console.error(err);
    } finally {
      setLogLoading(false);
    }
  };

  const loadExerciseCatalog = async () => {
    setCatLoading(true);
    try {
      const data = await api.exercise.search(query, category);
      setCatalog(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCatLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutLogs();
  }, [date]);

  useEffect(() => {
    loadExerciseCatalog();
  }, [query, category]);

  const handleLogWorkout = async (e) => {
    e.preventDefault();
    if (!selectedEx) return;

    try {
      const parsedDuration = parseInt(duration) || 30;
      const payload = {
        exercise_name: selectedEx.name,
        category: selectedEx.category,
        duration_minutes: parsedDuration,
        date
      };

      if (selectedEx.category === 'strength') {
        payload.sets = parseInt(sets) || null;
        payload.reps = parseInt(reps) || null;
        payload.weight = parseFloat(weightInput) || null;
      }

      if (caloriesBurnedInput) {
        payload.calories_burned = parseFloat(caloriesBurnedInput);
      }

      await api.exercise.logWorkout(payload);
      setSelectedEx(null);
      setCaloriesBurnedInput('');
      setSets('3');
      setReps('10');
      setWeightInput('');
      fetchWorkoutLogs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await api.exercise.deleteLog(id);
      fetchWorkoutLogs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1530] flex">
      <Sidebar />

      <main className="flex-1 pl-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Exercise Tracker</h1>
              <p className="text-gray-400 mt-1">Log cardiovascular routines, track lift duration, and view calorie metrics.</p>
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
            
            {/* Left Column: Exercises search & filters */}
            <div className="space-y-6">
              
              <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-green-400" />
                  <span>Exercise Database</span>
                </h3>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search exercises (e.g. Squat)..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 transition-all text-xs placeholder:text-gray-650"
                    />
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  </div>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none font-semibold"
                  >
                    <option value="">All Categories</option>
                    <option value="cardio">Cardiovascular</option>
                    <option value="strength">Strength Training</option>
                    <option value="stretching">Stretching / Warmup</option>
                    <option value="yoga">Yoga Practice</option>
                  </select>
                </div>

                {catLoading && (
                  <div className="flex items-center justify-center py-6">
                    <Loader className="w-6 h-6 animate-spin text-green-400" />
                  </div>
                )}

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {catalog.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedEx(ex)}
                      className={`w-full text-left p-3 rounded-xl border flex justify-between items-center transition-all cursor-pointer ${
                        selectedEx?.name === ex.name 
                          ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                          : 'bg-gray-900/40 border-gray-850 hover:bg-gray-800/40 text-gray-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">{ex.name}</p>
                        <span className="text-[10px] text-gray-500 capitalize">{ex.category} • {ex.difficulty}</span>
                      </div>
                      <span className="text-[10px] bg-gray-950 border border-gray-850 px-2 py-0.5 rounded text-gray-400 font-medium">
                        {ex.calories_burned_per_min} cal/m
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Workout Logging Form */}
              {selectedEx && (
                <form onSubmit={handleLogWorkout} className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">Log Workout</h3>
                  
                  <div className="p-3 bg-[#0b0f19] rounded-xl border border-gray-850 text-xs">
                    <p className="font-bold text-white">{selectedEx.name}</p>
                    <p className="text-gray-500 mt-1 font-semibold">Targets: {selectedEx.muscle_group} (Using {selectedEx.equipment})</p>
                    <p className="text-gray-400 mt-2 italic text-[11px] leading-relaxed">{selectedEx.instructions}</p>
                  </div>

                  {selectedEx.category === 'strength' && (
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-gray-500 font-semibold mb-1">Sets</label>
                        <input
                          type="number"
                          value={sets}
                          onChange={e => setSets(e.target.value)}
                          className="w-full bg-[#0b0f19] border border-gray-850 rounded-lg py-2 px-3 text-white focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-semibold mb-1">Reps</label>
                        <input
                          type="number"
                          value={reps}
                          onChange={e => setReps(e.target.value)}
                          className="w-full bg-[#0b0f19] border border-gray-850 rounded-lg py-2 px-3 text-white focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-semibold mb-1">Weight (lbs/kg)</label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="e.g. 50"
                          value={weightInput}
                          onChange={e => setWeightInput(e.target.value)}
                          className="w-full bg-[#0b0f19] border border-gray-850 rounded-lg py-2 px-3 text-white focus:outline-none font-mono placeholder:text-gray-600"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-500 font-semibold mb-1">Duration (minutes)</label>
                      <input
                        type="number"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        className="w-full bg-[#0b0f19] border border-gray-800 rounded-lg py-2 px-3 text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-semibold mb-1">Calories Burned (optional)</label>
                      <input
                        type="number"
                        placeholder="Auto calculated"
                        value={caloriesBurnedInput}
                        onChange={e => setCaloriesBurnedInput(e.target.value)}
                        className="w-full bg-[#0b0f19] border border-gray-800 rounded-lg py-2 px-3 text-white focus:outline-none font-mono placeholder:text-gray-650"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Log Workout</span>
                  </button>
                </form>
              )}

              {/* Workout Planner Advice Placeholder */}
              <div className="glass-panel p-5 rounded-2xl bg-gradient-to-br from-[#111827]/40 to-[#0b0f19] border border-gray-850 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span>AI Workout Routine (Phase 2)</span>
                </h4>
                <p className="text-[11px] text-gray-450 leading-relaxed">
                  Phase 2 AI workout planners will check your Profile details (injuries and limitations) and construct a weekly workout schedule automatically.
                </p>
              </div>

            </div>

            {/* Right Column: Historical logs lists */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Daily Telemetry Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Workout Count</span>
                  <p className="text-2xl font-extrabold text-white mt-1">{totals.count}</p>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Total Duration</span>
                  <p className="text-2xl font-extrabold text-green-400 mt-1">{totals.duration} min</p>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Energy Expelled</span>
                  <p className="text-2xl font-extrabold text-amber-400 mt-1">{totals.caloriesBurned} kcal</p>
                </div>
              </div>

              {/* Log lists */}
              <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Logged Workouts</h3>
                
                {logLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-8 h-8 animate-spin text-green-400" />
                  </div>
                ) : logs.length > 0 ? (
                  <div className="divide-y divide-gray-850/60">
                    {logs.map((log) => (
                      <div key={log.id} className="py-3 flex justify-between items-center text-xs text-gray-300">
                        <div>
                          <p className="font-bold text-white">{log.exercise_name}</p>
                          <span className="text-gray-500 capitalize">
                            {log.category} • {log.duration_minutes} min
                            {log.sets && ` • ${log.sets} sets`}
                            {log.reps && ` x ${log.reps} reps`}
                            {log.weight && ` @ ${log.weight} lbs/kg`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-amber-400 font-mono">-{log.calories_burned} kcal</span>
                          <button onClick={() => handleDeleteLog(log.id)} className="text-red-400 hover:text-red-300 p-1 cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-center text-gray-550 py-6">No workouts logged on this date.</p>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
