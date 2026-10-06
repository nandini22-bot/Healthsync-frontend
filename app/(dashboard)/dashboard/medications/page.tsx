"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Clock, 
  Pill, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  Check 
} from 'lucide-react';

interface MedicineSearchResult {
  _id: string;
  brandName: string;
  genericName: string;
  activeIngredient: string;
  uses: string;
  storageInfo: string;
  warnings: string;
  precautions: string;
  region: 'IN' | 'US';
}

interface UserReminder {
  dosage: string;
  frequency: string;
  times: string[];
}

interface UserMedication {
  _id: string;
  brandName: string;
  genericName: string;
  reminders: UserReminder[];
}

const mockCatalog: MedicineSearchResult[] = [
  {
    _id: 'in-1',
    brandName: 'Dolo 650',
    genericName: 'Paracetamol',
    activeIngredient: 'Paracetamol 650mg',
    uses: 'Fever reduction, mild to moderate body pain relief, headaches.',
    storageInfo: 'Store below 30°C in a dry place. Keep away from direct sunlight.',
    warnings: 'Overdose may cause severe liver damage. Do not exceed 4000mg daily.',
    precautions: 'Use with caution if suffering from pre-existing chronic kidney or liver disease.',
    region: 'IN'
  },
  {
    _id: 'in-2',
    brandName: 'Combiflam',
    genericName: 'Ibuprofen + Paracetamol',
    activeIngredient: 'Ibuprofen 400mg + Paracetamol 325mg',
    uses: 'Relief from joint pain, muscle inflammation, dental pain.',
    storageInfo: 'Store in a cool dry place.',
    warnings: 'Avoid taking on an empty stomach to prevent gastric irritation.',
    precautions: 'May cause stomach ulceration if taken for prolonged periods without acid suppressants.',
    region: 'IN'
  },
  {
    _id: 'in-3',
    brandName: 'Becosules',
    genericName: 'Vitamin B-Complex + Vitamin C',
    activeIngredient: 'Vitamin B1, B2, B6, B12, Niacinamide, Vitamin C',
    uses: 'Nutritional supplementation, mouth ulcers, recovery after fever.',
    storageInfo: 'Store in a cool place protected from light.',
    warnings: 'Bright yellow urine discoloration is harmless and expected.',
    precautions: 'Inform your physician if taking L-Dopa medications.',
    region: 'IN'
  },
  {
    _id: 'us-1',
    brandName: 'Tylenol Extra Strength',
    genericName: 'Acetaminophen',
    activeIngredient: 'Acetaminophen 500mg',
    uses: 'Temporary relief of minor aches and pains due to headache, backache, arthritis.',
    storageInfo: 'Store at 20-25°C (68-77°F).',
    warnings: 'Contains acetaminophen. Severe liver damage may occur if taken with 3 or more alcoholic drinks daily.',
    precautions: 'Do not use with any other drug containing acetaminophen.',
    region: 'US'
  },
  {
    _id: 'us-2',
    brandName: 'Advil Liqui-Gels',
    genericName: 'Ibuprofen',
    activeIngredient: 'Ibuprofen 200mg',
    uses: 'Reduces fever and relieves minor pain from headache, muscle aches, toothache.',
    storageInfo: 'Avoid excessive heat above 40°C (104°F).',
    warnings: 'Ibuprofen may cause severe stomach bleeding.',
    precautions: 'Take with food or milk if stomach upset occurs.',
    region: 'US'
  }
];

export default function MedicationsPage() {
  const [region, setRegion] = useState<'IN' | 'US'>('IN');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MedicineSearchResult[]>([]);
  
  const [activeMeds, setActiveMeds] = useState<UserMedication[]>([]);
  
  const [selectedMed, setSelectedMed] = useState<MedicineSearchResult | null>(null);
  const [dosage, setDosage] = useState('1 Tablet');
  const [frequency, setFrequency] = useState('Daily');
  const [alarmTime, setAlarmTime] = useState('08:00');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = mockCatalog.filter(
      med => med.region === region && (
        med.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setSearchResults(filtered);
    setSelectedMed(null);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed) return;

    const newMed: UserMedication = {
      _id: Date.now().toString(),
      brandName: selectedMed.brandName,
      genericName: selectedMed.genericName,
      reminders: [{
        dosage,
        frequency,
        times: [alarmTime]
      }]
    };

    setActiveMeds(prev => [...prev, newMed]);
    setSuccessMsg(`Added ${selectedMed.brandName} to your dosing schedule!`);
    setSelectedMed(null);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDeleteSchedule = (id: string) => {
    setActiveMeds(prev => prev.filter(m => m._id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Medications</h1>
        <p className="text-slate-500 mt-1">Configure your region-aware dosing catalog, set timers, and review clinical safety notes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Search & Clinical details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Search Reference Catalog</h3>
              
              {/* Region Toggle */}
              <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => { setRegion('IN'); setSearchResults([]); }}
                  className="px-3 py-1.5 text-[10px] font-bold transition-all border-none cursor-pointer flex items-center gap-1"
                  style={region === 'IN'
                    ? { backgroundColor: '#2563eb', color: '#ffffff' }
                    : { backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)' }}
                >
                  <MapPin className="w-3 h-3" />
                  India (IN)
                </button>
                <button
                  type="button"
                  onClick={() => { setRegion('US'); setSearchResults([]); }}
                  className="px-3 py-1.5 text-[10px] font-bold transition-all border-none cursor-pointer flex items-center gap-1"
                  style={region === 'US'
                    ? { backgroundColor: '#2563eb', color: '#ffffff' }
                    : { backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)' }}
                >
                  <MapPin className="w-3 h-3" />
                  United States (US)
                </button>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={`Search ${region === 'IN' ? 'Dolo, Combiflam, Becosules...' : 'Tylenol, Advil, Loratadine...'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Search className="absolute left-3.5 top-3 text-slate-400 w-4.5 h-4.5" />
              </div>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all border-none cursor-pointer flex items-center justify-center min-w-24 text-xs"
              >
                Search
              </button>
            </form>
          </div>

          {/* Search Results Display */}
          {searchResults.length > 0 && (
            <div className="space-y-6">
              {searchResults.map((med) => (
                <div key={med._id} className="glass-panel p-6 rounded-2xl space-y-4 border-l-4 border-l-blue-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{med.brandName}</h4>
                      <p className="text-xs text-slate-500">Generic: {med.genericName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedMed(med)}
                      className="bg-blue-50 text-blue-650 hover:bg-blue-100 font-bold py-1.5 px-3 rounded-lg border-none cursor-pointer text-[10px] flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>AddTo Schedule</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 block">Uses:</span>
                      <p className="text-slate-600 leading-relaxed">{med.uses}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 block">Storage:</span>
                      <p className="text-slate-600 leading-relaxed">{med.storageInfo}</p>
                    </div>
                  </div>

                  {/* Warnings and Precautions Alerts */}
                  <div className="space-y-3 pt-2">
                    {med.warnings && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs space-y-1">
                        <div className="flex items-center gap-2 font-bold">
                          <ShieldAlert className="w-4 h-4" />
                          <span>Contraindications & Warnings</span>
                        </div>
                        <p className="leading-relaxed pl-6">{med.warnings}</p>
                      </div>
                    )}

                    {med.precautions && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl text-xs space-y-1">
                        <div className="flex items-center gap-2 font-bold">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Clinical Precautions</span>
                        </div>
                        <p className="leading-relaxed pl-6">{med.precautions}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Add Modal/Form & Active List */}
        <div className="space-y-6">
          {/* Success Banner */}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-xs flex items-center gap-2 font-bold">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Dosing Configuration Box */}
          {selectedMed && (
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Pill className="w-4.5 h-4.5 text-blue-600" />
                <span>Configure {selectedMed.brandName}</span>
              </h3>

              <form onSubmit={handleAddSchedule} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Dosage size</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 1 Tablet, 5ml"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
                  >
                    <option value="Daily">Once Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Alarm time</label>
                  <input
                    type="time"
                    value={alarmTime}
                    onChange={(e) => setAlarmTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg border-none cursor-pointer text-xs flex items-center justify-center gap-1.5"
                  >
                    Save Reminders
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMed(null)}
                    className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-lg border-none cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Active Schedule Lists */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">My Active Reminders</h3>

            {activeMeds.length === 0 ? (
              <div className="text-slate-400 text-xs py-6 text-center">
                No active dosing reminders set.
              </div>
            ) : (
              <div className="space-y-3">
                {activeMeds.map((med) => (
                  <div key={med._id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 text-xs">{med.brandName}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                        <Clock className="w-3 h-3 text-blue-500" />
                        <span>{med.reminders[0]?.dosage} - {med.reminders[0]?.times[0]} ({med.reminders[0]?.frequency})</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSchedule(med._id)}
                      className="p-2 hover:bg-red-50 text-red-500 hover:text-red-650 transition-all border-none cursor-pointer bg-transparent rounded-lg"
                      aria-label="Remove reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
