import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { 
  Flame, Droplet, Moon, Scale, Pill, Plus, ArrowUpRight, Loader, Award 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [nutritionLogs, setNutritionLogs] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Weekly Summary states
  const [aiSummary, setAiSummary] = useState('');
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  // Quick Action Modal states
  const [waterModal, setWaterModal] = useState(false);
  const [waterAmount, setWaterAmount] = useState(250);

  const [weightModal, setWeightModal] = useState(false);
  const [logWeightVal, setLogWeightVal] = useState('');

  const fetchDashboardData = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      
      const wellnessData = await api.wellness.getSummary();
      const nutData = await api.food.getLogs(todayStr);
      const exData = await api.exercise.getLogs(todayStr);
      const activeReminders = await api.medication.getReminders();

      setData(wellnessData);
      setNutritionLogs(nutData);
      setWorkoutLogs(exData);
      setReminders(activeReminders);

      // Fetch AI Summary in background
      setAiSummaryLoading(true);
      try {
        const summary = await api.ai.getWeeklySummary();
        setAiSummary(summary);
      } catch (err) {
        console.warn('Failed to load AI weekly summary on dashboard:', err.message);
      } finally {
        setAiSummaryLoading(false);
      }
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickWater = async () => {
    try {
      await api.wellness.logWater(waterAmount, null, 'add');
      setWaterModal(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleQuickWeight = async () => {
    if (!logWeightVal) return;
    try {
      await api.wellness.logWeight(parseFloat(logWeightVal));
      setWeightModal(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c1530] flex">
        <Sidebar />
        <div className="flex-1 pl-64 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-green-400" />
        </div>
      </div>
    );
  }

  const { calculators, logs, today } = data || {};
  const weightData = logs?.weight?.map(log => ({
    date: new Date(log.log_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: log.weight
  })) || [];

  const calorieBurned = workoutLogs?.totals?.caloriesBurned || 0;
  const calorieConsumed = nutritionLogs?.totals?.calories || 0;
  const calorieLimit = calculators?.tdee || 2000;
  const waterConsumed = today?.water || 0;
  const sleepDuration = today?.sleep || 0;

  return (
    <div className="min-h-screen bg-[#0c1530] flex">
      <Sidebar />

      <main className="flex-1 pl-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Daily Snapshot</h1>
              <p className="text-gray-400 mt-1">Here is a review of your biometric feeds, hydration stats, and nutrition targets today.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setWaterModal(true)} 
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-2.5 px-4 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-all text-sm"
              >
                <Droplet className="w-4 h-4" />
                <span>Log Hydration</span>
              </button>

              <button 
                onClick={() => setWeightModal(true)} 
                className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 py-2.5 px-4 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-all text-sm"
              >
                <Scale className="w-4 h-4" />
                <span>Log Weight</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Calories Card */}
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nutrition Deficit</span>
                <h3 className="text-2xl font-extrabold text-white">
                  {calorieConsumed} <span className="text-sm font-normal text-gray-400">/ {calorieLimit} kcal</span>
                </h3>
                <p className="text-xs text-gray-400">Consumed today</p>
              </div>
              <div className="p-3.5 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
                <Flame className="w-6 h-6" />
              </div>
            </div>

            {/* Hydration Card */}
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hydration Log</span>
                <h3 className="text-2xl font-extrabold text-white">
                  {waterConsumed} <span className="text-sm font-normal text-gray-400">/ 2500 ml</span>
                </h3>
                <p className="text-xs text-gray-400">{Math.round((waterConsumed / 2500) * 100)}% of daily target</p>
              </div>
              <div className="p-3.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                <Droplet className="w-6 h-6" />
              </div>
            </div>

            {/* Sleep Card */}
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sleep Summary</span>
                <h3 className="text-2xl font-extrabold text-white">
                  {sleepDuration} <span className="text-sm font-normal text-gray-400">hrs</span>
                </h3>
                <p className="text-xs text-gray-400">Recommended: 7-9 hrs</p>
              </div>
              <div className="p-3.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                <Moon className="w-6 h-6" />
              </div>
            </div>

            {/* BMI Card */}
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Calculated BMI</span>
                <h3 className="text-2xl font-extrabold text-white">
                  {calculators?.bmi || 'N/A'}
                </h3>
                <p className="text-xs text-gray-400">
                  {calculators ? (calculators.bmi < 25 ? 'Normal status' : 'Needs attention') : 'Configure profile'}
                </p>
              </div>
              <div className="p-3.5 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20">
                <Scale className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Charts & Graphs Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weight log timeline */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Weight Tracking Timeline</h3>
                <p className="text-xs text-gray-400 mb-6">Telemetry tracking for body weight logs over the last 7 entries.</p>
              </div>
              <div className="h-64">
                {weightData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                        labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2.5} fillOpacity={1} fill="url(#weightGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-500">
                    No weight records logged. Press "Log Weight" above to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Daily nutrition macros */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Nutrient Balance</h3>
                <p className="text-xs text-gray-400 mb-6">Today's target macros (g)</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-400">Proteins</span>
                    <span className="text-white">{nutritionLogs?.totals?.protein || 0}g</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(((nutritionLogs?.totals?.protein || 0) / 120) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-400">Carbohydrates</span>
                    <span className="text-white">{nutritionLogs?.totals?.carbs || 0}g</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(((nutritionLogs?.totals?.carbs || 0) / 250) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-400">Fats</span>
                    <span className="text-white">{nutritionLogs?.totals?.fat || 0}g</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(((nutritionLogs?.totals?.fat || 0) / 80) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-850">
                <Link to="/nutrition" className="text-xs font-semibold text-green-400 hover:text-green-300 flex items-center gap-1">
                  <span>Log meal details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Reminders & AI Recommendation Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Reminders Panel */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-green-400" />
                  <span>Medicine Reminders</span>
                </h3>
                <p className="text-xs text-gray-400 mb-6">Upcoming scheduled dosing alerts</p>
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto">
                {reminders.length > 0 ? (
                  reminders.map((reminder) => (
                    <div key={reminder.id} className="p-3 bg-gray-900/40 border border-gray-850 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-white">{reminder.medicine_name}</p>
                        <span className="text-xs text-gray-500">{reminder.dosage} • {reminder.frequency}</span>
                      </div>
                      <div className="bg-green-500/10 text-green-400 font-mono text-xs px-2.5 py-1 rounded-lg border border-green-500/20 font-bold">
                        {reminder.times}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-gray-500">
                    No medication reminders configured. Add filters in the Medications tab.
                  </div>
                )}
              </div>
            </div>

            {/* Weekly AI Health Summary */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span>Weekly AI Health Summary</span>
                </h3>
                
                {aiSummaryLoading ? (
                  <div className="flex items-center gap-2 py-4 text-xs text-gray-550">
                    <Loader className="w-4 h-4 animate-spin text-blue-400" />
                    <span>Analyzing weekly telemetry feeds...</span>
                  </div>
                ) : aiSummary ? (
                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                    {aiSummary}
                  </p>
                ) : (
                  <p className="text-xs text-gray-450 leading-relaxed">
                    Log your daily weight, water, and exercises to unlock a personalized trends summary from our AI engines.
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Water Modal */}
      {waterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-6">
            <div>
              <h4 className="text-lg font-bold text-white">Log Hydration</h4>
              <p className="text-xs text-gray-400 mt-1">Select the volume consumed</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[150, 250, 500].map(amount => (
                <button
                  key={amount}
                  onClick={() => setWaterAmount(amount)}
                  className={`py-3 rounded-xl font-bold font-mono text-sm border cursor-pointer transition-all ${
                    waterAmount === amount 
                      ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                      : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {amount}ml
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3 text-sm">
              <button 
                onClick={() => setWaterModal(false)} 
                className="py-2.5 px-4 font-semibold text-gray-450 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleQuickWater} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-500/10"
              >
                Add Water
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weight Modal */}
      {weightModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-6">
            <div>
              <h4 className="text-lg font-bold text-white">Log Body Weight</h4>
              <p className="text-xs text-gray-400 mt-1">Enter your current weight in kilograms</p>
            </div>

            <input
              type="number"
              step="0.1"
              placeholder="e.g. 74.8"
              value={logWeightVal}
              onChange={(e) => setLogWeightVal(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-green-500 transition-all font-mono font-bold text-lg text-center"
            />

            <div className="flex justify-end gap-3 text-sm">
              <button 
                onClick={() => setWeightModal(false)} 
                className="py-2.5 px-4 font-semibold text-gray-450 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleQuickWeight} 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-lg shadow-green-500/10"
              >
                Log Weight
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
