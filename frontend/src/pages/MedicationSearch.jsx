import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import { 
  Search, Pill, Info, History, ShieldAlert, Star, Bell, MapPin, 
  Layers, ArrowRightLeft, Plus, Loader, Trash2, Sparkles 
} from 'lucide-react';

export default function MedicationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedMed, setSelectedMed] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [savedMeds, setSavedMeds] = useState([]);
  const [history, setHistory] = useState([]);
  const [reminders, setReminders] = useState([]);
  
  // Reminder Input states
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [dosage, setDosage] = useState('1 Tablet');
  const [frequency, setFrequency] = useState('daily');
  const [reminderTime, setReminderTime] = useState('08:00');

  const [loading, setLoading] = useState(false);
  const [medLoading, setMedLoading] = useState(false);

  // AI explanation & comparison states
  const [explainText, setExplainText] = useState('');
  const [explainLoading, setExplainLoading] = useState(false);
  const [compareText, setCompareText] = useState('');
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareTargetId, setCompareTargetId] = useState('');

  const handleAIExplain = async () => {
    if (!selectedMed) return;
    setExplainLoading(true);
    setExplainText('');
    try {
      const resp = await api.ai.explainMedicine(selectedMed);
      setExplainText(resp);
    } catch (err) {
      alert(err.message);
    } finally {
      setExplainLoading(false);
    }
  };

  const handleAICompare = async (targetId) => {
    if (!selectedMed || !targetId) return;
    setCompareTargetId(targetId);
    setCompareLoading(true);
    setCompareText('');
    try {
      const match = savedMeds.find(s => s.id === parseInt(targetId));
      if (!match) return;
      const resp = await api.ai.compareMedicines(selectedMed, match);
      setCompareText(resp);
    } catch (err) {
      alert(err.message);
    } finally {
      setCompareLoading(false);
    }
  };
  
  // Leaflet Map ref & instance
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const loadListsAndHistory = async () => {
    try {
      const saved = await api.medication.getSaved();
      const hist = await api.medication.getHistory();
      const rem = await api.medication.getReminders();
      setSavedMeds(saved);
      setHistory(hist);
      setReminders(rem);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadListsAndHistory();
    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const initializeMap = () => {
    if (!window.L || !mapContainerRef.current || mapInstanceRef.current) return;

    // Use user geolocation or fallback to a standard city coordinate
    const lat = 28.6139; // Default: Delhi
    const lng = 77.2090;

    const map = window.L.map(mapContainerRef.current).setView([lat, lng], 14);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Draw mock pharmacies nearby
    drawPharmacies(lat, lng);

    // Try to get actual location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        map.setView([userLat, userLng], 14);
        drawPharmacies(userLat, userLng);
      }, async () => {
        console.log('Browser geolocation blocked, attempting IP geolocation...');
        try {
          const ipResponse = await fetch('https://ipapi.co/json/');
          if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            if (ipData.latitude && ipData.longitude) {
              console.log(`Centered map to IP location: ${ipData.city}, ${ipData.region}`);
              map.setView([ipData.latitude, ipData.longitude], 14);
              drawPharmacies(ipData.latitude, ipData.longitude);
            }
          }
        } catch (ipErr) {
          console.warn('IP geolocation failed:', ipErr.message);
        }
      });
    }
  };

  const drawPharmacies = (lat, lng) => {
    if (!window.L || !mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Place User Marker
    const userIcon = window.L.divIcon({
      html: `<div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white ring-4 ring-blue-500/20"></div>`,
      className: 'custom-user-marker'
    });
    const userMarker = window.L.marker([lat, lng], { icon: userIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup('<b>Your Location</b>')
      .openPopup();
    markersRef.current.push(userMarker);

    // Generate 4 mock pharmacies nearby
    const offsetMultipliers = [
      { lat: 0.003, lng: 0.005, name: "Apollo Pharmacy" },
      { lat: -0.004, lng: 0.008, name: "Fortis Healthworld" },
      { lat: 0.006, lng: -0.002, name: "MedPlus Pharmacy" },
      { lat: -0.002, lng: -0.006, name: "Guardian Life Care" }
    ];

    const pharmacyIcon = window.L.divIcon({
      html: `<div class="w-7 h-7 rounded-xl bg-green-500 border-2 border-white text-white flex items-center justify-center shadow-lg"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg></div>`,
      className: 'custom-pharmacy-marker'
    });

    offsetMultipliers.forEach(pharm => {
      const pLat = lat + pharm.lat;
      const pLng = lng + pharm.lng;
      const marker = window.L.marker([pLat, pLng], { icon: pharmacyIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${pharm.name}</b><br/>Open 24/7 • Nearby Pharmacy`);
      markersRef.current.push(marker);
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const data = await api.medication.search(query);
      setResults(data);
      if (data.length > 0) {
        handleSelectMed(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMed = async (med) => {
    setSelectedMed(med);
    setMedLoading(true);
    try {
      // Load alternatives matching active ingredient
      if (med.active_ingredient && med.active_ingredient !== 'Unknown') {
        const alts = await api.medication.getAlternatives(med.active_ingredient);
        setAlternatives(alts.filter(a => a.brand_name.toLowerCase() !== med.brand_name.toLowerCase()));
      } else {
        setAlternatives([]);
      }
      loadListsAndHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setMedLoading(false);
    }
  };

  const toggleSaveMed = async (med) => {
    const isSaved = savedMeds.some(s => s.brand_name.toLowerCase() === med.brand_name.toLowerCase());
    try {
      if (isSaved) {
        const match = savedMeds.find(s => s.brand_name.toLowerCase() === med.brand_name.toLowerCase());
        await api.medication.deleteSaved(match.id);
      } else {
        await api.medication.save({
          brand_name: med.brand_name,
          generic_name: med.generic_name,
          active_ingredient: med.active_ingredient
        });
      }
      loadListsAndHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!selectedMed) return;
    try {
      await api.medication.createReminder({
        medicine_name: selectedMed.brand_name,
        dosage,
        frequency,
        times: reminderTime
      });
      setShowReminderForm(false);
      loadListsAndHistory();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await api.medication.deleteReminder(id);
      loadListsAndHistory();
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
          <div>
            <h1 className="text-3xl font-extrabold text-white">Medication Library</h1>
            <p className="text-gray-400 mt-1">Search FDA drug labels, check warnings, find alternatives, and setup dosage planners.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Search & Lists */}
            <div className="space-y-6">
              
              {/* Search Box */}
              <div className="glass-panel p-5 rounded-2xl">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search by brand or ingredient..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-green-500 transition-all text-sm placeholder:text-gray-600"
                  />
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <button type="submit" className="absolute right-2 top-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition-all">
                    Search
                  </button>
                </form>

                {loading && (
                  <div className="flex items-center justify-center py-6">
                    <Loader className="w-6 h-6 animate-spin text-green-400" />
                  </div>
                )}

                {results.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-56 overflow-y-auto">
                    {results.map((med, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectMed(med)}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          selectedMed?.brand_name === med.brand_name 
                            ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                            : 'bg-[#111827]/40 border-gray-850 hover:bg-gray-800/40 text-gray-300'
                        }`}
                      >
                        <div className="truncate">
                          <p className="text-sm font-bold truncate">{med.brand_name}</p>
                          <span className="text-xs text-gray-500 font-mono truncate block">{med.generic_name}</span>
                        </div>
                        <Pill className="w-4 h-4 shrink-0 text-gray-500 ml-2" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved Medicines */}
              <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-green-400 fill-green-400/20" />
                  <span>Saved Medications</span>
                </h3>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {savedMeds.length > 0 ? (
                    savedMeds.map(med => (
                      <div key={med.id} className="p-3 bg-gray-900/40 border border-gray-850 rounded-xl flex justify-between items-center text-xs">
                        <div className="truncate">
                          <p className="font-bold text-white truncate">{med.brand_name}</p>
                          <span className="text-gray-500 font-mono truncate block">{med.active_ingredient}</span>
                        </div>
                        <button
                          onClick={() => api.medication.deleteSaved(med.id).then(loadListsAndHistory)}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-gray-550 py-2">Save labels to access them quickly.</p>
                  )}
                </div>
              </div>

              {/* History list */}
              <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-gray-400" />
                  <span>Recent Searches</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {history.length > 0 ? (
                    history.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => { setQuery(h.query); }}
                        className="bg-gray-900/80 hover:bg-gray-800 border border-gray-850 px-2.5 py-1 rounded-lg text-xs text-gray-400 hover:text-white transition-all cursor-pointer"
                      >
                        {h.query}
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-gray-550">No search logs yet.</span>
                  )}
                </div>
              </div>

            </div>

            {/* Center/Right Column: Selected Medicine Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {selectedMed ? (
                <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
                  
                  {/* Top Bar Details */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">{selectedMed.brand_name}</h2>
                      <p className="text-sm text-green-400 mt-1 font-mono">{selectedMed.generic_name}</p>
                      <span className="text-xs text-gray-500 font-medium block mt-1">Active Ingredient: {selectedMed.active_ingredient}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {savedMeds.length > 0 && (
                        <select
                          value={compareTargetId}
                          onChange={(e) => handleAICompare(e.target.value)}
                          className="bg-[#111827] border border-gray-850 rounded-xl py-2 px-3 text-xs text-gray-400 focus:outline-none focus:border-green-500"
                        >
                          <option value="">Compare with...</option>
                          {savedMeds.filter(s => s.brand_name.toLowerCase() !== selectedMed.brand_name.toLowerCase()).map(s => (
                            <option key={s.id} value={s.id}>{s.brand_name}</option>
                          ))}
                        </select>
                      )}

                      <button
                        onClick={handleAIExplain}
                        disabled={explainLoading}
                        className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/25 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>{explainLoading ? 'Explaining...' : 'Explain (AI)'}</span>
                      </button>

                      <button
                        onClick={() => toggleSaveMed(selectedMed)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          savedMeds.some(s => s.brand_name.toLowerCase() === selectedMed.brand_name.toLowerCase())
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                        title="Save Medicine"
                      >
                        <Star className={`w-4 h-4 ${savedMeds.some(s => s.brand_name.toLowerCase() === selectedMed.brand_name.toLowerCase()) ? 'fill-green-400/20' : ''}`} />
                      </button>

                      <button
                        onClick={() => setShowReminderForm(!showReminderForm)}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg hover:shadow-green-500/10"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Setup Alarm</span>
                      </button>
                    </div>
                  </div>

                  {/* Reminder Creation Form */}
                  {showReminderForm && (
                    <form onSubmit={handleAddReminder} className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-4">
                      <h4 className="text-sm font-bold text-white">Create Daily Dosage Reminder</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Dosage</label>
                          <input 
                            type="text" 
                            value={dosage} 
                            onChange={e => setDosage(e.target.value)} 
                            className="w-full bg-[#0b0f19] border border-gray-800 rounded-lg py-2 px-3 text-xs text-white" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Frequency</label>
                          <select 
                            value={frequency} 
                            onChange={e => setFrequency(e.target.value)}
                            className="w-full bg-[#0b0f19] border border-gray-800 rounded-lg py-2 px-3 text-xs text-white"
                          >
                            <option value="daily">Daily</option>
                            <option value="twice_daily">Twice Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Time</label>
                          <input 
                            type="time" 
                            value={reminderTime} 
                            onChange={e => setReminderTime(e.target.value)} 
                            className="w-full bg-[#0b0f19] border border-gray-800 rounded-lg py-2 px-3 text-xs text-white font-mono font-bold" 
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 text-xs">
                        <button type="button" onClick={() => setShowReminderForm(false)} className="py-2 px-3 font-semibold text-gray-450">Cancel</button>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg">Save Reminder</button>
                      </div>
                    </form>
                  )}

                  {/* AI Explanation Box */}
                  {explainText && (
                    <div className="p-4 bg-purple-500/5 border border-purple-500/15 text-purple-200 text-xs rounded-xl space-y-2">
                      <h4 className="font-bold flex items-center gap-1.5 text-white">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>AI Layman Explanation</span>
                      </h4>
                      <p className="leading-relaxed whitespace-pre-line">{explainText}</p>
                    </div>
                  )}

                  {/* AI Comparison Box */}
                  {compareText && (
                    <div className="p-4 bg-blue-500/5 border border-blue-500/15 text-blue-200 text-xs rounded-xl space-y-2">
                      <h4 className="font-bold flex items-center gap-1.5 text-white">
                        <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                        <span>Comparison Summary</span>
                      </h4>
                      <p className="leading-relaxed whitespace-pre-line">{compareText}</p>
                    </div>
                  )}

                  {/* Core Drug Information Tab */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        <Info className="w-3.5 h-3.5 text-blue-400" />
                        <span>Indications & Usage</span>
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed bg-gray-900/30 p-3.5 rounded-xl border border-gray-850">{selectedMed.uses}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                          <span>Side Effects</span>
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed bg-gray-900/30 p-3.5 rounded-xl border border-gray-850 h-36 overflow-y-auto">{selectedMed.side_effects}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                          <span>Warnings & Precautions</span>
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed bg-gray-900/30 p-3.5 rounded-xl border border-gray-850 h-36 overflow-y-auto">{selectedMed.warnings}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                        <span>Alternatives (Same Ingredient)</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {medLoading ? (
                          <Loader className="w-4 h-4 animate-spin text-green-400" />
                        ) : alternatives.length > 0 ? (
                          alternatives.map((alt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelectMed(alt)}
                              className="bg-gray-900 border border-gray-850 hover:border-green-500/30 text-xs px-3 py-2 rounded-xl text-gray-300 hover:text-white flex items-center gap-2 cursor-pointer transition-all"
                            >
                              <Pill className="w-3.5 h-3.5 text-green-400" />
                              <span>{alt.brand_name}</span>
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-gray-550">No alternatives found containing {selectedMed.active_ingredient}.</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="glass-panel p-12 rounded-2xl border border-gray-800 text-center text-gray-550 flex flex-col items-center justify-center gap-3">
                  <Pill className="w-12 h-12 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-bold text-white">No Drug Selected</h3>
                    <p className="text-sm text-gray-400 mt-1">Search for a medication on the left panel to review its uses, side effects, and warning labels.</p>
                  </div>
                </div>
              )}

              {/* Reminders & Pharmacy Map section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Active Alarm List */}
                <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-green-400" />
                    <span>Dosing Schedule</span>
                  </h3>
                  <div className="space-y-3 max-h-56 overflow-y-auto">
                    {reminders.length > 0 ? (
                      reminders.map(rem => (
                        <div key={rem.id} className="p-3 bg-gray-900/40 border border-gray-850 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-white">{rem.medicine_name}</p>
                            <span className="text-gray-500">{rem.dosage} • {rem.frequency}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-green-500/10 text-green-400 font-mono px-2 py-0.5 rounded border border-green-500/20">{rem.times}</span>
                            <button
                              onClick={() => handleDeleteReminder(rem.id)}
                              className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-xs text-gray-550 py-4">No active reminders configured.</p>
                    )}
                  </div>
                </div>

                {/* Nearby Pharmacies Map */}
                <div className="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col justify-between h-80">
                  <div className="mb-3 flex justify-between items-center gap-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span>Nearby Pharmacies</span>
                    </h3>
                    <div className="flex items-center">
                      <input 
                        type="text" 
                        placeholder="Search City/PIN..." 
                        className="bg-[#0b0f19] border border-gray-800 rounded-lg px-2.5 py-1 text-[10px] text-white focus:outline-none focus:border-green-500 w-28 placeholder:text-gray-650"
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter') {
                            const val = e.target.value;
                            if (!val) return;
                            try {
                              const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=1`);
                              if (res.ok) {
                                const data = await res.json();
                                if (data && data[0]) {
                                  const targetLat = parseFloat(data[0].lat);
                                  const targetLng = parseFloat(data[0].lon);
                                  if (mapInstanceRef.current) {
                                    mapInstanceRef.current.setView([targetLat, targetLng], 14);
                                    drawPharmacies(targetLat, targetLng);
                                  }
                                }
                              }
                            } catch (err) {
                              console.error('OSM Geocoding failed:', err.message);
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Map box */}
                  <div className="flex-1 w-full bg-gray-950 rounded-xl border border-gray-800 overflow-hidden relative">
                    <div ref={mapContainerRef} className="absolute inset-0 z-10"></div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
