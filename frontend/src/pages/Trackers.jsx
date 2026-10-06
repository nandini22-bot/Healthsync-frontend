import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Droplet, Moon, Scale, Plus, Calendar, Trash2, Loader, Smile } from 'lucide-react';

export default function Trackers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('water'); // 'water', 'sleep', 'weight'

  // Input states
  const [waterInput, setWaterInput] = useState('250');
  const [sleepInput, setSleepInput] = useState('8');
  const [sleepQuality, setSleepQuality] = useState('3');
  const [weightInput, setWeightInput] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchTrackers = async () => {
    try {
      const res = await api.wellness.getSummary();
      setData(res);
      if (res.calculators && !weightInput) {
        setWeightInput(res.today?.weight || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackers();
  }, []);

  const handleWaterSubmit = async (e) => {
    e.preventDefault();
    if (!waterInput) return;
    try {
      await api.wellness.logWater(parseInt(waterInput), logDate, 'set');
      fetchTrackers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSleepSubmit = async (e) => {
    e.preventDefault();
    if (!sleepInput) return;
    try {
      await api.wellness.logSleep(parseFloat(sleepInput), parseInt(sleepQuality), logDate);
      fetchTrackers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    if (!weightInput) return;
    try {
      await api.wellness.logWeight(parseFloat(weightInput), logDate);
      fetchTrackers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex">
        <Sidebar />
        <div className="flex-1 pl-64 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-green-400" />
        </div>
      </div>
    );
  }

  const { logs } = data || {};

  return (
    <div className="min-h-screen bg-[#0b0f19] flex">
      <Sidebar />

      <main className="flex-1 pl-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white font-sans">Health Trackers</h1>
              <p className="text-gray-400 mt-1">Log and review physical telemetry logs over the last 7 entries.</p>
            </div>
            
            <div className="flex bg-[#111827] p-1.5 rounded-xl border border-gray-800">
              <button
                onClick={() => setActiveTab('water')}
                className={`py-2 px-4 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                  activeTab === 'water' ? 'bg-blue-500 text-white' : 'text-gray-450 hover:text-white'
                }`}
              >
                Water Intake
              </button>
              <button
                onClick={() => setActiveTab('sleep')}
                className={`py-2 px-4 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                  activeTab === 'sleep' ? 'bg-purple-500 text-white' : 'text-gray-450 hover:text-white'
                }`}
              >
                Sleep Logs
              </button>
              <button
                onClick={() => setActiveTab('weight')}
                className={`py-2 px-4 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                  activeTab === 'weight' ? 'bg-green-500 text-white' : 'text-gray-450 hover:text-white'
                }`}
              >
                Weight Logs
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Control Panel / Form Card */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">Log Entry</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Date</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none text-sm font-semibold font-mono"
                />
              </div>

              {activeTab === 'water' && (
                <form onSubmit={handleWaterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Water Volume (ml)</label>
                    <input
                      type="number"
                      value={waterInput}
                      onChange={(e) => setWaterInput(e.target.value)}
                      className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none text-sm font-semibold font-mono"
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5">
                    <Droplet className="w-4 h-4" />
                    <span>Log Hydration</span>
                  </button>
                </form>
              )}

              {activeTab === 'sleep' && (
                <form onSubmit={handleSleepSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Sleep Duration (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={sleepInput}
                      onChange={(e) => setSleepInput(e.target.value)}
                      className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none text-sm font-semibold font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Quality Rating</label>
                    <select
                      value={sleepQuality}
                      onChange={(e) => setSleepQuality(e.target.value)}
                      className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none text-sm font-semibold"
                    >
                      <option value="1">1 - Very Poor</option>
                      <option value="2">2 - Poor</option>
                      <option value="3">3 - Fair</option>
                      <option value="4">4 - Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-purple-500/10 flex items-center justify-center gap-1.5">
                    <Moon className="w-4 h-4" />
                    <span>Log Sleep</span>
                  </button>
                </form>
              )}

              {activeTab === 'weight' && (
                <form onSubmit={handleWeightSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Body Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none text-sm font-semibold font-mono"
                    />
                  </div>
                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-green-500/10 flex items-center justify-center gap-1.5">
                    <Scale className="w-4 h-4" />
                    <span>Log Weight</span>
                  </button>
                </form>
              )}
            </div>

            {/* Logs Table / History Card */}
            <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">Log History</h3>
              </div>

              <div className="overflow-x-auto">
                {activeTab === 'water' && (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-850 text-gray-500 font-semibold">
                        <th className="pb-3 font-normal uppercase tracking-wider text-xs">Date</th>
                        <th className="pb-3 font-normal uppercase tracking-wider text-xs">Hydration Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-850">
                      {logs?.water?.length > 0 ? (
                        logs.water.map(log => (
                          <tr key={log.id} className="text-white hover:bg-gray-900/20 transition-all">
                            <td className="py-3 font-mono font-semibold">{new Date(log.log_date).toLocaleDateString()}</td>
                            <td className="py-3 text-blue-400 font-bold">{log.amount_ml} ml</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="py-6 text-center text-gray-550 text-xs">No hydration logs recorded.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {activeTab === 'sleep' && (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-850 text-gray-500 font-semibold">
                        <th className="pb-3 font-normal uppercase tracking-wider text-xs">Date</th>
                        <th className="pb-3 font-normal uppercase tracking-wider text-xs">Duration</th>
                        <th className="pb-3 font-normal uppercase tracking-wider text-xs">Quality Index</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-850">
                      {logs?.sleep?.length > 0 ? (
                        logs.sleep.map(log => (
                          <tr key={log.id} className="text-white hover:bg-gray-900/20 transition-all">
                            <td className="py-3 font-mono font-semibold">{new Date(log.log_date).toLocaleDateString()}</td>
                            <td className="py-3 text-purple-400 font-bold">{log.duration_hours} hours</td>
                            <td className="py-3 font-semibold">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                log.quality >= 4 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                log.quality >= 3 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                                'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {log.quality === 5 ? 'Excellent' : log.quality === 4 ? 'Good' : log.quality === 3 ? 'Fair' : log.quality === 2 ? 'Poor' : 'Very Poor'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-gray-550 text-xs">No sleep logs recorded.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {activeTab === 'weight' && (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-850 text-gray-500 font-semibold">
                        <th className="pb-3 font-normal uppercase tracking-wider text-xs">Date</th>
                        <th className="pb-3 font-normal uppercase tracking-wider text-xs">Logged Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-850">
                      {logs?.weight?.length > 0 ? (
                        logs.weight.map(log => (
                          <tr key={log.id} className="text-white hover:bg-gray-900/20 transition-all">
                            <td className="py-3 font-mono font-semibold">{new Date(log.log_date).toLocaleDateString()}</td>
                            <td className="py-3 text-green-400 font-bold">{log.weight} kg</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="py-6 text-center text-gray-550 text-xs">No weight logs recorded.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
