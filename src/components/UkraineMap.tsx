import React, { useState } from 'react';
import { MapPin, X, Navigation, Filter, Info, Plus, Search, Eye, EyeOff, Map as MapIcon, Layers } from 'lucide-react';
import { MinistryLocation } from '../types';
import poltavaMap from '../assets/images/poltava_oblast_map_1782904715478.jpg';
import { trackEvent } from '../utils/analytics';
import { SETTLEMENTS } from '../utils/settlements';

interface UkraineMapProps {
  locations: MinistryLocation[];
  selectedLocation: MinistryLocation | null;
  setSelectedLocation: (loc: MinistryLocation | null) => void;
  onSelectDetails: (loc: MinistryLocation) => void;
  onAddLocationClick: () => void;
}

export default function UkraineMap({
  locations,
  selectedLocation,
  setSelectedLocation,
  onSelectDetails,
  onAddLocationClick,
}: UkraineMapProps) {
  // Map mode state: 'schematic' or 'google'
  const [mapMode, setMapMode] = useState<'schematic' | 'google'>('schematic');

  // Filters visible state
  const [showFilters, setShowFilters] = useState(true);

  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    youth: true,
    social: true,
    education: true,
    children: true,
    mercy: true,
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'youth', label: 'Молодіжне', color: 'bg-[#d5e3ff] text-[#144780] border-[#a6c8ff]' },
    { id: 'social', label: 'Соціальне', color: 'bg-[#ffe088] text-[#574500] border-[#e9c349]' },
    { id: 'education', label: 'Освіта', color: 'bg-[#e1e3e4] text-[#454748] border-[#c5c7c8]' },
    { id: 'children', label: 'Дитяче', color: 'bg-[#fed65b] text-[#745c00] border-[#ffe088]' },
    { id: 'mercy', label: 'Милосердя', color: 'bg-[#ffdad6] text-[#93000a] border-[#ffdad6]' },
  ];

  const handleFilterToggle = (id: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [id as keyof typeof prev]: !prev[id as keyof typeof prev],
    }));
  };

  const handleResetFilters = () => {
    setActiveFilters({
      youth: true,
      social: true,
      education: true,
      children: true,
      mercy: true,
    });
  };

  // Search query filtered results (search across all locations)
  const searchedLocations = locations.filter((loc) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return false;
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.address.toLowerCase().includes(q) ||
      loc.typeNameUk.toLowerCase().includes(q) ||
      loc.description.toLowerCase().includes(q) ||
      (loc.responsiblePerson && loc.responsiblePerson.toLowerCase().includes(q))
    );
  });

  // Filter locations based on checked categories
  const filteredLocations = locations.filter(
    (loc) => activeFilters[loc.type as keyof typeof activeFilters]
  );

  return (
    <section className="relative bg-[#f5f3f3] overflow-hidden rounded-2xl border border-[#c3c6d1]">
      {/* Map Header and Toolbar */}
      <div className="bg-white px-6 py-4 border-b border-[#c3c6d1] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#003466]">Християнська карта Полтавської області</h2>
          <p className="font-sans text-xs text-[#737781] mt-0.5">Оберіть режим карти та натисніть на маркер для перегляду інформації про служіння</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          {/* Map Mode Selector */}
          <div className="bg-[#f5f3f3] p-1 rounded-lg border border-[#c3c6d1] flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => {
                setMapMode('schematic');
                trackEvent('Engagement', 'Switch Map Mode', 'Schematic');
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                mapMode === 'schematic'
                  ? 'bg-[#003466] text-white shadow-sm'
                  : 'text-[#424750] hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Схематична
            </button>
            <button
              onClick={() => {
                setMapMode('google');
                trackEvent('Engagement', 'Switch Map Mode', 'Google Maps');
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                mapMode === 'google'
                  ? 'bg-[#003466] text-white shadow-sm'
                  : 'text-[#424750] hover:bg-white/60'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Google Maps
            </button>
          </div>

          {/* Show/Hide Filters Toggle (only interactive in schematic mode) */}
          <button
            onClick={() => {
              setShowFilters(!showFilters);
              trackEvent('Engagement', 'Toggle Filters Visibility', (!showFilters).toString());
            }}
            disabled={mapMode !== 'schematic'}
            className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              mapMode !== 'schematic'
                ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400'
                : showFilters
                ? 'bg-[#ffe088] text-[#574500] border-[#e9c349] hover:bg-[#fed65b]'
                : 'bg-white text-[#424750] border-[#c3c6d1] hover:bg-gray-50'
            }`}
          >
            {showFilters && mapMode === 'schematic' ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
            {showFilters && mapMode === 'schematic' ? 'Сховати фільтри' : 'Показати фільтри'}
          </button>

          <button
            onClick={onAddLocationClick}
            className="flex items-center gap-1.5 bg-[#735c00] text-white hover:bg-[#574500] px-4 py-2.5 rounded text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Додати точку
          </button>
        </div>
      </div>

      {/* Map Stage Container */}
      <div className="relative h-[480px] md:h-[600px] w-full bg-[#efeded] select-none overflow-hidden">
        {mapMode === 'google' ? (
          <div className="w-full h-full relative">
            <iframe
              title="Google Maps"
              src={
                selectedLocation
                  ? `https://maps.google.com/maps?q=${encodeURIComponent(
                      `${selectedLocation.address}, ${selectedLocation.name}`
                    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                  : `https://maps.google.com/maps?q=Полтавська%20область&t=&z=9&ie=UTF8&iwloc=&output=embed`
              }
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {!selectedLocation && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-4 sm:right-auto bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#c3c6d1] shadow-lg max-w-sm pointer-events-none z-10">
                <p className="text-xs font-bold text-[#003466] flex items-center gap-1.5">
                  <MapIcon className="w-4 h-4 text-[#735c00]" />
                  Інтерактивна Google Карта Полтавщини
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Оберіть осередок у списку або через пошук вгорі, щоб побачити його точну адресу та околиці прямо на Google Maps.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Cartographer Background Image */}
            <img
              src={poltavaMap}
              alt="Карта Полтавської області"
              className="w-full h-full object-cover opacity-90 mix-blend-normal pointer-events-none"
            />

            {/* Floating Category Filters Panel */}
            {showFilters && (
              <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md p-5 rounded-xl border border-[#c3c6d1] shadow-md w-64 hidden sm:block animate-fadeIn">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#efeded]">
                  <span className="font-serif text-sm font-semibold text-[#1b1c1c] flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-[#003466]" />
                    Фільтрувати служіння
                  </span>
                  <button
                    onClick={handleResetFilters}
                    className="text-[10px] text-[#003466] hover:underline font-semibold cursor-pointer"
                  >
                    Скинути
                  </button>
                </div>
                <div className="space-y-2.5">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={activeFilters[cat.id as keyof typeof activeFilters]}
                        onChange={() => handleFilterToggle(cat.id)}
                        className="w-4 h-4 rounded border-[#737781] text-[#003466] focus:ring-[#003466] cursor-pointer"
                      />
                      <span className="font-sans text-xs font-semibold text-[#424750] group-hover:text-[#003466] transition-colors">
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Responsive Mini Filters for Mobile */}
            {showFilters && (
              <div className="absolute top-3 left-3 right-3 z-20 flex sm:hidden flex-wrap gap-1.5 p-2 bg-white/95 backdrop-blur-md rounded-lg border border-[#c3c6d1] shadow-sm animate-fadeIn">
                {categories.map((cat) => {
                  const isChecked = activeFilters[cat.id as keyof typeof activeFilters];
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleFilterToggle(cat.id)}
                      className={`px-2 py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#003466] text-white border-[#003466]'
                          : 'bg-[#f5f3f3] text-[#424750] border-[#c3c6d1]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Dynamic Interactive Pins & Predefined Settlements */}
            {(() => {
              const matchedLocationIds = new Set<string>();

              // Match predefined settlements to active locations in filteredLocations
              const settlementsWithStatus = SETTLEMENTS.map((settlement) => {
                const matchingLoc = filteredLocations.find((loc) => {
                  const nameMatch = loc.name.toLowerCase().includes(settlement.name.toLowerCase()) ||
                                    loc.address.toLowerCase().includes(settlement.name.toLowerCase());
                  const coordMatch = Math.abs(loc.coordinates.x - settlement.coordinates.x) < 4 &&
                                     Math.abs(loc.coordinates.y - settlement.coordinates.y) < 4;
                  return nameMatch || coordMatch;
                });

                if (matchingLoc) {
                  matchedLocationIds.add(matchingLoc.id);
                  return {
                    settlement,
                    hasChurch: true,
                    location: matchingLoc,
                  };
                }

                return {
                  settlement,
                  hasChurch: false,
                  location: null,
                };
              });

              // Custom/Admin added locations not matching predefined settlements list
              const unmatchedLocations = filteredLocations.filter((loc) => !matchedLocationIds.has(loc.id));

              return (
                <>
                  {/* Predefined settlements */}
                  {settlementsWithStatus.map(({ settlement, hasChurch, location }) => {
                    if (hasChurch && location) {
                      const isSelected = selectedLocation?.id === location.id;
                      
                      // Style markers based on types
                      let pinColor = 'text-[#003466]'; // default
                      if (location.type === 'youth') pinColor = 'text-[#1a4b84]';
                      else if (location.type === 'social') pinColor = 'text-[#735c00]';
                      else if (location.type === 'education') pinColor = 'text-[#323435]';
                      else if (location.type === 'children') pinColor = 'text-[#745c00]';
                      else if (location.type === 'mercy') pinColor = 'text-[#ba1a1a]';

                      return (
                        <div
                          key={`church-${location.id}`}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10"
                          style={{ left: `${location.coordinates.x}%`, top: `${location.coordinates.y}%` }}
                          onClick={() => {
                            setSelectedLocation(location);
                            trackEvent('Engagement', 'Map Pin Clicked', location.name);
                          }}
                        >
                          <div className="relative group flex flex-col items-center">
                            {/* Tooltip Hover Overlay */}
                            <div className="absolute bottom-8 bg-white text-xs font-bold text-[#1b1c1c] px-2.5 py-1 rounded shadow-md border border-[#c3c6d1] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                              {location.name} ({settlement.name})
                            </div>

                            {/* Animated Pulsing Ring under the selected pin */}
                            {isSelected && (
                              <div className="absolute w-8 h-8 rounded-full bg-[#fed65b]/40 animate-ping -mt-1.5" />
                            )}

                            {/* Main Pin Icon */}
                            <div
                              className={`transition-transform duration-300 ${
                                isSelected ? 'scale-130 rotate-3 z-20' : 'hover:scale-115'
                              }`}
                            >
                              <MapPin
                                className={`w-8 h-8 ${pinColor} filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]`}
                                fill={isSelected ? '#fed65b' : 'currentColor'}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      const labelPrefix = settlement.type === 'city' ? 'м.' : 'с.';
                      return (
                        <div
                          key={`settlement-${settlement.name}`}
                          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-5"
                          style={{ left: `${settlement.coordinates.x}%`, top: `${settlement.coordinates.y}%` }}
                        >
                          <div className="relative group flex flex-col items-center">
                            {/* Tooltip Hover Overlay */}
                            <div className="absolute bottom-6 bg-white text-[11px] font-bold text-[#1b1c1c] px-2 py-0.5 rounded shadow border border-[#c3c6d1] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                              {labelPrefix} {settlement.name}
                            </div>

                            {/* Black Square Cartographic Symbol */}
                            <div className="w-2.5 h-2.5 bg-[#1b1c1c] border border-white shadow-[0_1.5px_3px_rgba(0,0,0,0.6)] group-hover:scale-135 group-hover:bg-[#003466] transition-transform duration-200" />
                            
                            {/* Label under the square */}
                            <span className="mt-1 text-[9px] font-sans font-bold text-[#1b1c1c]/90 bg-white/75 px-1 rounded-sm border border-transparent group-hover:bg-white group-hover:shadow group-hover:border-[#c3c6d1] whitespace-nowrap transition-all select-none">
                              {settlement.name}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  })}

                  {/* Custom / unmatched locations */}
                  {unmatchedLocations.map((loc) => {
                    const isSelected = selectedLocation?.id === loc.id;
                    
                    // Style markers based on types
                    let pinColor = 'text-[#003466]'; // default
                    if (loc.type === 'youth') pinColor = 'text-[#1a4b84]';
                    else if (loc.type === 'social') pinColor = 'text-[#735c00]';
                    else if (loc.type === 'education') pinColor = 'text-[#323435]';
                    else if (loc.type === 'children') pinColor = 'text-[#745c00]';
                    else if (loc.type === 'mercy') pinColor = 'text-[#ba1a1a]';

                    return (
                      <div
                        key={`unmatched-church-${loc.id}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10"
                        style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
                        onClick={() => {
                          setSelectedLocation(loc);
                          trackEvent('Engagement', 'Map Pin Clicked', loc.name);
                        }}
                      >
                        <div className="relative group flex flex-col items-center">
                          {/* Tooltip Hover Overlay */}
                          <div className="absolute bottom-8 bg-white text-xs font-bold text-[#1b1c1c] px-2.5 py-1 rounded shadow-md border border-[#c3c6d1] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                            {loc.name}
                          </div>

                          {/* Animated Pulsing Ring under the selected pin */}
                          {isSelected && (
                            <div className="absolute w-8 h-8 rounded-full bg-[#fed65b]/40 animate-ping -mt-1.5" />
                          )}

                          {/* Main Pin Icon */}
                          <div
                            className={`transition-transform duration-300 ${
                              isSelected ? 'scale-130 rotate-3 z-20' : 'hover:scale-115'
                            }`}
                          >
                            <MapPin
                              className={`w-8 h-8 ${pinColor} filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]`}
                              fill={isSelected ? '#fed65b' : 'currentColor'}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </>
        )}

        {/* Floating Search Widget */}
        <div className="absolute top-16 sm:top-4 right-4 left-4 sm:left-auto z-20 w-auto sm:w-80 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#c3c6d1] shadow-lg">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-[#737781]" />
            <input
              type="text"
              placeholder="Шукати осередок чи адресу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#f5f3f3] hover:bg-white focus:bg-white text-xs text-[#1b1c1c] font-semibold border border-[#c3c6d1] focus:border-[#003466] rounded-lg transition-all focus:outline-none animate-fadeIn"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#737781] hover:text-[#1b1c1c] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchQuery && (
            <div className="mt-1.5 bg-white border border-[#c3c6d1] rounded-lg shadow-xl max-h-48 overflow-y-auto divide-y divide-[#efeded] z-30 relative select-none">
              {searchedLocations.length > 0 ? (
                searchedLocations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setSearchQuery('');
                      trackEvent('Engagement', 'Map Search Select', loc.name);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex flex-col gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-[#1b1c1c] line-clamp-1">{loc.name}</span>
                    <span className="text-[10px] text-gray-500 font-medium truncate">{loc.address}</span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-gray-400 italic">
                  Нічого не знайдено за вашим запитом
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Marker Detail Card on the map */}
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-20 bg-white/95 backdrop-blur-md p-5 rounded-xl border border-[#c3c6d1] shadow-xl w-auto sm:w-80 transition-all duration-300 animate-slideUp">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-[#d5e3ff] text-[#144780] text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                {selectedLocation.typeNameUk}
              </span>
              <button
                onClick={() => setSelectedLocation(null)}
                className="p-1 rounded-full hover:bg-[#efeded] text-[#737781] hover:text-[#1b1c1c] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <h4 className="font-serif text-md font-bold text-[#1b1c1c] mb-1.5">
              {selectedLocation.name}
            </h4>
            
            <p className="font-sans text-xs text-[#424750] leading-relaxed mb-4 line-clamp-3">
              {selectedLocation.description}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => onSelectDetails(selectedLocation)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#003466] hover:bg-[#1a4b84] text-white text-xs font-bold rounded shadow-sm transition-all cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                Детальніше
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLocation.address)}`}
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#ffe088] hover:bg-[#fed65b] text-[#574500] text-xs font-bold rounded shadow-sm transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                Маршрут
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
