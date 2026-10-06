"use client";

import React, { useState } from 'react';
import { MapPin, Search, Phone, Clock, Pill, Activity, Hospital, Dumbbell } from 'lucide-react';

type ServiceType = 'pharmacy' | 'hospital' | 'clinic' | 'gym';
type FilterType = 'all' | ServiceType;

interface NearbyPlace {
  id: number;
  name: string;
  type: ServiceType;
  address: string;
  phone: string;
  openNow: string;
  distance: string;
}

const filterLabels: { key: FilterType; label: string; icon: React.ReactNode; accent: string }[] = [
  { key: 'all',      label: 'Show All',        icon: <Activity className="w-4 h-4" />,  accent: 'text-blue-500' },
  { key: 'pharmacy', label: 'Pharmacies',       icon: <Pill className="w-4 h-4" />,      accent: 'text-blue-500' },
  { key: 'hospital', label: 'Hospitals',        icon: <Hospital className="w-4 h-4" />,  accent: 'text-red-500' },
  { key: 'clinic',   label: 'Clinics',          icon: <MapPin className="w-4 h-4" />,    accent: 'text-green-500' },
  { key: 'gym',      label: 'Gyms & Fitness',   icon: <Dumbbell className="w-4 h-4" />, accent: 'text-purple-500' },
];

const typeBadge: Record<ServiceType, string> = {
  pharmacy: 'bg-blue-500 text-white',
  hospital: 'bg-red-500 text-white',
  clinic:   'bg-green-500 text-white',
  gym:      'bg-purple-500 text-white',
};

const sampleCatalog: NearbyPlace[] = [
  {
    id: 1,
    name: 'Apollo Speciality Hospital & Emergency',
    type: 'hospital',
    address: '15 Main Healthcare Boulevard, Block B',
    phone: '+91 80 2630 1111',
    openNow: 'Open 24/7 (Emergency Available)',
    distance: '0.8 km'
  },
  {
    id: 2,
    name: 'Apollo Pharmacy & Wellness Store',
    type: 'pharmacy',
    address: 'Shop 4, Central Commercial Complex',
    phone: '+91 80 4123 9876',
    openNow: 'Open 08:00 AM - 11:00 PM',
    distance: '1.2 km'
  },
  {
    id: 3,
    name: 'Apex Orthopedic & General Clinic',
    type: 'clinic',
    address: 'Suite 202, Medical Enclave, Sector 4',
    phone: '+91 80 9876 5432',
    openNow: 'Open 09:00 AM - 08:00 PM',
    distance: '1.5 km'
  },
  {
    id: 4,
    name: 'Gold’s Gym & Fitness Center',
    type: 'gym',
    address: '3rd Floor, Metro Square Galleria',
    phone: '+91 80 5555 1234',
    openNow: 'Open 06:00 AM - 10:00 PM',
    distance: '1.9 km'
  },
  {
    id: 5,
    name: 'MedPlus Chemist & Druggist',
    type: 'pharmacy',
    address: 'Plot 88, Near City Station',
    phone: '+91 80 4433 2211',
    openNow: 'Open 24/7',
    distance: '2.4 km'
  },
  {
    id: 6,
    name: 'Fortis Healthcare & Diagnostic Centre',
    type: 'hospital',
    address: '22 Ring Road Avenue, Phase 2',
    phone: '+91 80 6666 9999',
    openNow: 'Open 24/7',
    distance: '3.1 km'
  }
];

export default function NearbyServicesPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [locationLabel, setLocationLabel] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setPlaces([]);
      setLocationLabel('');
      return;
    }

    setLocationLabel(query.trim());
    const filtered = sampleCatalog.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.address.toLowerCase().includes(query.toLowerCase()) ||
      p.type.toLowerCase().includes(query.toLowerCase())
    );
    setPlaces(filtered.length > 0 ? filtered : sampleCatalog);
  };

  const filteredPlaces = filter === 'all' ? places : places.filter(p => p.type === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>
          Nearby Health Services
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          Find hospitals, pharmacies, clinics, and gyms near you — search healthcare provider catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ── Sidebar ── */}
        <div className="space-y-4">

          {/* Location panel */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
              <MapPin className="w-4 h-4 text-blue-500" />
              Target Location
            </h3>

            {/* Text search */}
            <form onSubmit={handleSearch} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter city or locality..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                />
                <Search className="absolute left-3 top-3 w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              </div>
              <button
                type="submit"
                className="w-full font-bold py-2 rounded-xl text-xs border-none cursor-pointer transition-all bg-blue-600 hover:bg-blue-700 text-white"
              >
                Search Area
              </button>
            </form>

            {locationLabel && (
              <p className="text-[10px] font-semibold flex items-center gap-1 text-green-500 truncate pt-1">
                <MapPin className="w-3 h-3 shrink-0" />
                Active Area: {locationLabel}
              </p>
            )}
          </div>

          {/* Filter */}
          <div className="glass-panel p-5 rounded-2xl space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Filter Category
            </p>
            {filterLabels.map(({ key, label, icon, accent }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-2 ${
                  filter === key ? 'bg-blue-600 text-white' : ''
                }`}
                style={filter !== key ? { backgroundColor: 'transparent', color: 'var(--text-muted)' } : {}}
              >
                <span className={filter === key ? 'text-white' : accent}>{icon}</span>
                {label}
                {filter === key && places.length > 0 && (
                  <span className="ml-auto text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full">
                    {filteredPlaces.length}
                  </span>
                )}
              </button>
            ))}
          </div>

        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-5 rounded-2xl min-h-[450px] flex flex-col space-y-4">

            {/* Results header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>
                {filteredPlaces.length > 0
                  ? `${filteredPlaces.length} healthcare provider${filteredPlaces.length > 1 ? 's' : ''} listed`
                  : 'Nearby Services'}
              </h3>
            </div>

            {/* Empty state */}
            {filteredPlaces.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-16">
                <MapPin className="w-10 h-10" style={{ color: 'var(--border-color)' }} />
                <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                  Enter a city or locality above to search for nearby health services.
                </p>
              </div>
            )}

            {/* Results grid */}
            {filteredPlaces.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="p-4 rounded-xl border space-y-2"
                    style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                  >
                    {/* Name + badge */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-extrabold text-xs leading-snug" style={{ color: 'var(--text-main)' }}>
                        {place.name}
                      </span>
                      <span className={`shrink-0 px-2 py-0.5 text-[8px] font-extrabold uppercase rounded-md ${typeBadge[place.type]}`}>
                        {place.type}
                      </span>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="leading-snug">{place.address}</span>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold">
                      <span className="text-blue-500 font-bold">📍 {place.distance}</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        <Phone className="w-3 h-3 inline mr-0.5" />{place.phone}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        <Clock className="w-3 h-3 inline mr-0.5" />{place.openNow}
                      </span>
                    </div>
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
