import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Bookmark, CheckCircle2, MapPin, Clock, Tag, Archive, Sparkles } from 'lucide-react';
import { ChurchEvent, MinistryLocation } from '../types';

interface CalendarViewProps {
  events: ChurchEvent[];
  locations: MinistryLocation[];
}

export default function CalendarView({ events, locations }: CalendarViewProps) {
  // Date State: default to July 2026 (based on events data in JSON)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 0-indexed (6 is July)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-07-15');
  
  // Category Filtering
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Toggle for active calendar vs general completed archive
  const [activeTab, setActiveTab] = useState<'calendar' | 'ministries_archive'>('calendar');

  const categories = [
    { id: 'youth', label: 'Молодіжне', color: 'bg-yellow-400 text-yellow-900 border-yellow-500', dot: '#facc15' },
    { id: 'social', label: 'Соціальне', color: 'bg-blue-400 text-blue-900 border-blue-500', dot: '#60a5fa' },
    { id: 'education', label: 'Освіта', color: 'bg-emerald-400 text-emerald-900 border-emerald-500', dot: '#34d399' },
    { id: 'children', label: 'Дитяче', color: 'bg-pink-400 text-pink-900 border-pink-500', dot: '#f472b6' },
    { id: 'mercy', label: 'Милосердя', color: 'bg-purple-400 text-purple-900 border-purple-500', dot: '#c084fc' }
  ];

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const resetFilters = () => setSelectedCategories([]);

  // Generate calendar days for the selected month & year
  const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // Adjusting to make Monday the first day (0 = Monday, 6 = Sunday)
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Filter events based on active category filters
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      if (selectedCategories.length === 0) return true;
      return evt.category && selectedCategories.includes(evt.category);
    });
  }, [events, selectedCategories]);

  // Group filtered events by date string
  const eventsByDate = useMemo(() => {
    const map: Record<string, ChurchEvent[]> = {};
    filteredEvents.forEach(evt => {
      if (evt.date) {
        if (!map[evt.date]) {
          map[evt.date] = [];
        }
        map[evt.date].push(evt);
      }
    });
    return map;
  }, [filteredEvents]);

  // Clicked Day Archive: get events for currently clicked day
  const selectedDateEvents = useMemo(() => {
    return events.filter(evt => evt.date === selectedDateStr);
  }, [events, selectedDateStr]);

  // Ministries Archive (Requirement 5): Completed/Past initiatives
  const pastMinistries = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    // Return events that are marked as archived or have a past date
    return events.filter(evt => evt.isArchived || (evt.date && evt.date < todayStr));
  }, [events]);

  const activeMinistries = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return events.filter(evt => !evt.isArchived && (!evt.date || evt.date >= todayStr));
  }, [events]);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-16 py-8 space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#c3c6d1]/30 pb-5">
        <div>
          <span className="text-[#735c00] font-sans text-xs font-bold uppercase tracking-widest">
            Календар та архіви
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#003466] mt-1">
            Християнський календар служінь
          </h1>
          <p className="font-sans text-xs text-[#737781] mt-1">
            Стежте за заходами, фільтруйте за категоріями та переглядайте архіви виконаних справ
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-[#efeded] p-1 rounded-lg border border-[#c3c6d1]/60">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-white text-[#003466] shadow-sm'
                : 'text-[#424750] hover:text-[#003466]'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Активний календар
          </button>
          <button
            onClick={() => setActiveTab('ministries_archive')}
            className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ministries_archive'
                ? 'bg-white text-[#003466] shadow-sm'
                : 'text-[#424750] hover:text-[#003466]'
            }`}
          >
            <Archive className="w-4 h-4" />
            Архів служінь
          </button>
        </div>
      </div>

      {activeTab === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Calendar Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-6">
            
            {/* Filter Pills */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#424750]">
                <Filter className="w-3.5 h-3.5 text-[#003466]" />
                <span>Фільтр за напрямками служіння:</span>
                {selectedCategories.length > 0 && (
                  <button 
                    onClick={resetFilters}
                    className="ml-auto text-xs text-[#003466] hover:underline cursor-pointer"
                  >
                    Скинути всі
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected 
                          ? `${cat.color} scale-[1.03] shadow-sm` 
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.dot }} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calendar Grid & Nav */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#faf9f8] p-3 rounded-xl border border-gray-100">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:text-[#003466] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h3 className="font-serif text-lg font-bold text-[#003466] tracking-tight">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:text-[#003466] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day of Week Labels */}
              <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-[#737781] pb-1">
                {daysOfWeek.map(d => (
                  <div key={d} className="py-2">{d}</div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2.5">
                {/* Blank days before first day of month */}
                {Array.from({ length: firstDayIndex }).map((_, idx) => (
                  <div key={`blank-${idx}`} className="aspect-square bg-[#fbf9f8]/40 rounded-lg border border-transparent" />
                ))}

                {/* Actual days of the month */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const dayEvents = eventsByDate[dateString] || [];
                  const isSelected = selectedDateStr === dateString;
                  const isToday = new Date().toISOString().split('T')[0] === dateString;

                  return (
                    <button
                      key={`day-${dayNum}`}
                      onClick={() => setSelectedDateStr(dateString)}
                      className={`aspect-square rounded-xl border flex flex-col items-center justify-between p-1.5 transition-all relative hover:scale-[1.03] cursor-pointer ${
                        isSelected
                          ? 'bg-[#003466] text-white border-[#003466] shadow-sm z-10'
                          : isToday
                          ? 'bg-[#ffe088]/30 border-[#fed65b] text-[#735c00] font-bold'
                          : 'bg-white text-gray-800 border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      {/* Day Number */}
                      <span className="text-xs md:text-sm font-semibold">{dayNum}</span>

                      {/* Event category indicator dots */}
                      <div className="flex gap-1 justify-center w-full min-h-[6px] pb-1">
                        {dayEvents.slice(0, 3).map((evt, eIdx) => {
                          const catInfo = categories.find(c => c.id === evt.category);
                          return (
                            <span
                              key={`${evt.id}-${eIdx}`}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: isSelected ? '#ffffff' : (catInfo?.dot || '#9ca3af') }}
                            />
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <span className={`text-[8px] leading-none ${isSelected ? 'text-white' : 'text-[#737781]'}`}>+</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Helper Legend */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-1 justify-center text-[10px] text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#facc15]" /> Молодіжне
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" /> Соціальне
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" /> Освіта
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f472b6]" /> Дитяче
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc]" /> Милосердя
              </span>
            </div>

          </div>

          {/* Right Panel: Daily Archive / Clicked Date Events (Requirement 4) */}
          <div className="bg-[#faf9f8] rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-[#c3c6d1]/40 pb-3">
              <Bookmark className="w-5 h-5 text-[#003466]" />
              <div>
                <h3 className="font-serif text-md font-bold text-[#003466]">
                  Архів за датою
                </h3>
                <p className="font-sans text-[11px] text-[#737781]">
                  Заходи на вибраний день: {selectedDateStr}
                </p>
              </div>
            </div>

            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {selectedDateEvents.map(evt => {
                  const catInfo = categories.find(c => c.id === evt.category);
                  return (
                    <div
                      key={evt.id}
                      className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all shadow-sm space-y-2.5 relative overflow-hidden group"
                    >
                      {/* Left border badge based on category */}
                      <span className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: catInfo?.dot || '#e5e7eb' }} />
                      
                      <div className="flex justify-between items-start pl-1">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${catInfo?.color || 'bg-gray-100 text-gray-700'}`}>
                          {evt.categoryNameUk || 'Служіння'}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-[#737781] font-medium">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>{evt.day} {evt.month}</span>
                        </div>
                      </div>

                      <h4 className="font-serif text-sm font-bold text-[#1b1c1c] group-hover:text-[#003466] leading-tight transition-colors">
                        {evt.title}
                      </h4>

                      <p className="font-sans text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {evt.description}
                      </p>

                      <div className="flex items-center gap-1 pt-1 border-t border-gray-50 text-[10px] text-gray-500">
                        <MapPin className="w-3 h-3 text-[#003466]" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 space-y-2">
                <CalendarIcon className="w-10 h-10 mx-auto opacity-40 text-[#737781]" />
                <p className="font-sans text-xs font-semibold">На цю дату немає запланованих подій</p>
                <p className="font-sans text-[10px] max-w-xs mx-auto">
                  Оберіть іншу дату на календарі або скористайтеся фільтрами для пошуку
                </p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Requirement 5: Archive of Ministries / Completed Services */
        <div className="space-y-8 animate-fadeIn">
          
          {/* Quick Accomplishment Hero Banner */}
          <div className="bg-gradient-to-r from-[#003466] to-[#1a4b84] rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm border border-white/10">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="bg-[#ffe088] text-[#735c00] px-3 py-1 rounded-full text-[10px] font-bold uppercase w-fit tracking-wider">
                Минулі справи служіння
              </span>
              <h2 className="font-serif text-xl md:text-2xl font-bold">
                Архів благословінь та реалізованих проєктів
              </h2>
              <p className="font-sans text-xs text-gray-200 leading-relaxed">
                Тут зібрані історичні записи про роботу наших служінь у Полтавській області — успішно проведені благодійні концерти, волонтерські виїзди, завершені недільні семінари та гуманітарні місії.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center w-48 shrink-0">
              <div className="font-serif text-3xl font-bold text-[#fed65b]">{pastMinistries.length}</div>
              <div className="font-sans text-[10px] font-semibold tracking-wider text-blue-200 uppercase mt-0.5">Успішних подій</div>
            </div>
          </div>

          {/* Grid Layout of Completed Initiatives */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastMinistries.length > 0 ? (
              pastMinistries.map(evt => {
                const catInfo = categories.find(c => c.id === evt.category);
                return (
                  <div
                    key={evt.id}
                    className="bg-white rounded-2xl p-6 border border-[#c3c6d1] shadow-sm flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
                  >
                    <span className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: catInfo?.dot || '#003466' }} />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${catInfo?.color || 'bg-gray-100 text-gray-700'}`}>
                          {evt.categoryNameUk || 'Служіння'}
                        </span>
                        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Виконано
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-serif text-md font-bold text-[#003466] group-hover:underline">
                          {evt.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                          <span>{evt.day} {evt.month} 2026</span>
                          <span>•</span>
                          <span>{evt.location}</span>
                        </div>
                      </div>

                      <p className="font-sans text-xs text-gray-600 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-500">
                      <span className="font-medium">Координатор: Полтавський Хаб</span>
                      <span className="text-[#003466] font-bold group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                );
              })
            ) : (
              // In case the list is empty, display a pleasant placeholder
              <div className="md:col-span-3 text-center py-16 bg-white rounded-2xl border border-[#c3c6d1]/50 text-gray-400 space-y-3">
                <Archive className="w-12 h-12 mx-auto text-gray-300 opacity-80" />
                <h3 className="font-serif text-md font-bold text-gray-700">Архів поки порожній</h3>
                <p className="font-sans text-xs max-w-xs mx-auto text-gray-500">
                  Усі заходи, які пройшли чи були перенесені до архіву, з\'являться в цій секції для історичного перегляду.
                </p>
              </div>
            )}
          </div>

          {/* Active Ministries Listing inside Archive view to explore ongoing operations */}
          <div className="pt-8 border-t border-[#c3c6d1]/30 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#fed65b] fill-[#fed65b]" />
              <h3 className="font-serif text-lg font-bold text-[#003466]">Поточні активні процеси служінь</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMinistries.slice(0, 4).map(evt => (
                <div key={`act-${evt.id}`} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 items-start">
                  <div className="bg-[#003466]/10 text-[#003466] p-2 rounded-lg font-serif font-bold text-center w-12 shrink-0">
                    <div className="text-md leading-none">{evt.day}</div>
                    <div className="text-[10px] uppercase mt-1">{evt.month}</div>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-serif text-sm font-bold text-gray-800 truncate">{evt.title}</h4>
                    <p className="font-sans text-xs text-gray-500 line-clamp-1">{evt.location}</p>
                    <p className="font-sans text-[11px] text-gray-600 line-clamp-2">{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
