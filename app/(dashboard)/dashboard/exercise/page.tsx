"use client";

import React, { useState } from 'react';
import { Dumbbell, Trash2, Search, Check, Clock, Flame, HeartPulse } from 'lucide-react';

interface ExerciseItem {
  _id: string;
  exerciseName: string;
  category: 'cardio' | 'strength' | 'yoga' | 'stretching';
  caloriesPerMin: number;
}

interface LoggedWorkout {
  _id: string;
  exerciseName: string;
  durationMinutes: number;
  caloriesBurned: number;
  category: string;
}

const mockExerciseCatalog: ExerciseItem[] = [
  { _id: 'e1', exerciseName: 'Outdoor Running (Moderate Pace)', category: 'cardio', caloriesPerMin: 9.5 },
  { _id: 'e2', exerciseName: 'Standard Bodyweight Push-ups', category: 'strength', caloriesPerMin: 6.0 },
  { _id: 'e3', exerciseName: 'Barbell Squats', category: 'strength', caloriesPerMin: 8.0 },
  { _id: 'e4', exerciseName: 'Barbell Bench Press', category: 'strength', caloriesPerMin: 7.0 },
  { _id: 'e5', exerciseName: 'Stationary Cycling', category: 'cardio', caloriesPerMin: 7.5 },
  { _id: 'e6', exerciseName: 'Freestyle Swimming', category: 'cardio', caloriesPerMin: 9.0 },
  { _id: 'e7', exerciseName: 'Vinyasa Flow Yoga', category: 'yoga', caloriesPerMin: 4.5 },
  { _id: 'e8', exerciseName: 'Core Plank Hold', category: 'stretching', caloriesPerMin: 3.5 }
];

export default function ExercisePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ExerciseItem[]>(mockExerciseCatalog);

  const [loggedWorkouts, setLoggedWorkouts] = useState<LoggedWorkout[]>([]);

  const [selectedEx, setSelectedEx] = useState<ExerciseItem | null>(null);
  const [duration, setDuration] = useState('20');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const targetBurn = 250;
  const userInjuries = '';

  const isExerciseWarning = (name: string) => {
    const cleanInjuries = userInjuries.toLowerCase();
    if (!cleanInjuries) return null;
    const exName = name.toLowerCase();

    if (cleanInjuries.includes('knee')) {
      if (exName.includes('squat') || exName.includes('running') || exName.includes('lunge')) {
        return 'Knee Injury Warning';
      }
    }
    if (cleanInjuries.includes('shoulder')) {
      if (exName.includes('push up') || exName.includes('bench press') || exName.includes('plank')) {
        return 'Shoulder Injury Warning';
      }
    }
    return null;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults(mockExerciseCatalog);
      return;
    }
    const filtered = mockExerciseCatalog.filter(ex => ex.exerciseName.toLowerCase().includes(val.toLowerCase()));
    setSearchResults(filtered);
  };

  const handleLogWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEx) return;

    const minutes = Number(duration) || 20;
    const computedBurn = Math.round(minutes * selectedEx.caloriesPerMin);

    const newWorkout: LoggedWorkout = {
      _id: Date.now().toString(),
      exerciseName: selectedEx.exerciseName,
      durationMinutes: minutes,
      caloriesBurned: computedBurn,
      category: selectedEx.category
    };

    setLoggedWorkouts(prev => [...prev, newWorkout]);
    setSuccessMsg(`Successfully logged ${selectedEx.exerciseName}!`);
    setSelectedEx(null);
    setDuration('20');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDeleteWorkout = (id: string) => {
    setLoggedWorkouts(prev => prev.filter(w => w._id !== id));
  };

  const totalBurn = loggedWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>Exercise Log</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Track physical workout routines, document strength metrics, and view calories burned today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left columns */}
        <div className="lg:col-span-2 space-y-6">

          {/* Today's Workouts */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold" style={{ color: 'var(--text-main)' }}>Today's Workouts</h3>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-xl">
                <Flame className="w-4 h-4 fill-current" />
                <span>{totalBurn} / {targetBurn} kcal ({Math.round((totalBurn / targetBurn) * 100)}%)</span>
              </div>
            </div>

            {successMsg && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-3 rounded-xl text-xs flex items-center gap-1 font-bold">
                <Check className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            {loggedWorkouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-xl text-xs" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                <Dumbbell className="w-8 h-8 mb-2" style={{ color: 'var(--border-color)' }} />
                <span>No exercises logged for today. Let's get moving!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {loggedWorkouts.map((workout) => (
                  <div key={workout._id} className="p-4 rounded-xl flex items-center justify-between border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs" style={{ color: 'var(--text-main)' }}>{workout.exerciseName}</span>
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-extrabold uppercase rounded-md tracking-wider">
                          {workout.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                        <Clock className="w-3 h-3 text-blue-500" />
                        <span>{workout.durationMinutes} mins</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-red-500 font-extrabold">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          {workout.caloriesBurned} kcal
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteWorkout(workout._id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 transition-all border-none cursor-pointer bg-transparent rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Log Configuration Form */}
          {selectedEx && (
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                <HeartPulse className="w-4.5 h-4.5 text-blue-500" />
                Configure: {selectedEx.exerciseName}
              </h3>

              {isExerciseWarning(selectedEx.exerciseName) && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-xs font-semibold leading-relaxed">
                  ⚠️ Safety Alert: You have a recorded {isExerciseWarning(selectedEx.exerciseName)?.toLowerCase()}.
                  Please consult a clinical practitioner before logging this activity.
                </div>
              )}

              <form onSubmit={handleLogWorkout} className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="space-y-1 flex-1">
                  <label className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Duration (Minutes)</label>
                  <input
                    type="number" min="1" value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                    required
                  />
                </div>

                <div className="shrink-0 p-3 rounded-xl text-center min-w-28 text-xs border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <span className="text-[9px] font-bold uppercase block mb-0.5" style={{ color: 'var(--text-muted)' }}>Est. Burn</span>
                  <span className="text-sm font-extrabold text-red-500">
                    {Math.round((Number(duration) || 0) * selectedEx.caloriesPerMin)} kcal
                  </span>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl border-none cursor-pointer text-xs">
                    Confirm Log
                  </button>
                  <button type="button" onClick={() => setSelectedEx(null)} className="px-3 font-bold py-2.5 rounded-xl border-none cursor-pointer text-xs" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Catalogue Sidebar */}
        <div className="glass-panel p-6 rounded-2xl h-fit space-y-4">
          <h3 className="text-base font-bold" style={{ color: 'var(--text-main)' }}>Exercise Catalogue</h3>

          <div className="relative">
            <input
              type="text"
              placeholder="Search exercise..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {searchResults.length === 0 ? (
              <div className="text-xs py-4 text-center" style={{ color: 'var(--text-muted)' }}>
                No exercises found. Try a different term.
              </div>
            ) : (
              searchResults.map((ex) => {
                const warningText = isExerciseWarning(ex.exerciseName);
                return (
                  <div
                    key={ex._id}
                    onClick={() => { setSelectedEx(ex); setSuccessMsg(null); }}
                    className={`flex justify-between items-center p-2.5 rounded-xl cursor-pointer transition-all text-xs font-semibold border ${
                      warningText ? 'border-red-500/30 bg-red-500/5' : ''
                    }`}
                    style={!warningText ? { backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' } : {}}
                  >
                    <div>
                      <span className="flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                        {ex.exerciseName}
                        {warningText && (
                          <span className="text-[8px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0">
                            ⚠️ {warningText}
                          </span>
                        )}
                      </span>
                      <span className="text-[8px] font-bold uppercase block mt-0.5 text-blue-500">{ex.category}</span>
                    </div>
                    <span className="text-[9px] text-blue-500 hover:underline font-bold">+ Log</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
