import React, { useState, useEffect } from 'react';
import {
  Compass,
  Heart,
  PlusCircle,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  Handshake,
  CheckCircle,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

import { MinistryLocation, Minister, NewsArticle, ChurchEvent } from './types';
import {
  INITIAL_LOCATIONS,
  INITIAL_MINISTERS,
  INITIAL_NEWS,
  INITIAL_EVENTS
} from './data';

import petrenkoPhoto from './assets/images/ministers/pastor_petrenko.jpg';
import kovalchukPhoto from './assets/images/ministers/leader_kovalchuk.jpg';
import melnykPhoto from './assets/images/ministers/teacher_melnyk.jpg';

import Header from './components/Header';
import Footer from './components/Footer';
import UkraineMap from './components/UkraineMap';
import AddLocationModal from './components/AddLocationModal';
import AboutView from './components/AboutView';
import MinistersView from './components/MinistersView';
import NewsView from './components/NewsView';
import MinistryDetailView from './components/MinistryDetailView';
import CalendarView from './components/CalendarView';
import AdminView from './components/AdminView';
import { initGoogleAnalytics, trackEvent } from './utils/analytics';

export default function App() {
  // Navigation & Core States
  const [currentTab, setCurrentTab] = useState<string>('map'); // 'map', 'ministers', 'news', 'about', 'details', 'calendar', 'admin'
  
  // Initialize Google Analytics on load
  useEffect(() => {
    const savedId = localStorage.getItem('google_analytics_measurement_id') || '';
    if (savedId) {
      initGoogleAnalytics(savedId);
    }
    trackEvent('System', 'App Init', 'Application Mounted');
  }, []);

  // Track tab navigation changes
  useEffect(() => {
    trackEvent('Navigation', 'Tab Changed', currentTab);
  }, [currentTab]);
  
  // Persistent Data States
  const [locations, setLocations] = useState<MinistryLocation[]>(() => {
    const saved = localStorage.getItem('churches_db_locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [ministers, setMinisters] = useState<Minister[]>(() => {
    const saved = localStorage.getItem('churches_db_ministers');
    const parsed: Minister[] = saved ? JSON.parse(saved) : INITIAL_MINISTERS;
    return parsed.map(m => {
      if (m.id === 'min-1') return { ...m, photoUrl: petrenkoPhoto, socials: m.socials || (INITIAL_MINISTERS[0] as any).socials };
      if (m.id === 'min-2') return { ...m, photoUrl: kovalchukPhoto, socials: m.socials || (INITIAL_MINISTERS[1] as any).socials };
      if (m.id === 'min-3') return { ...m, photoUrl: melnykPhoto, socials: m.socials || (INITIAL_MINISTERS[2] as any).socials };
      return m;
    });
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem('churches_db_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [events, setEvents] = useState<ChurchEvent[]>(() => {
    const saved = localStorage.getItem('churches_db_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // Synchronize data states with localStorage
  useEffect(() => {
    localStorage.setItem('churches_db_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('churches_db_ministers', JSON.stringify(ministers));
  }, [ministers]);

  useEffect(() => {
    localStorage.setItem('churches_db_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('churches_db_events', JSON.stringify(events));
  }, [events]);

  // Focus selection states
  const [selectedLocation, setSelectedLocation] = useState<MinistryLocation | null>(() => {
    return locations[0] || null;
  });
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Handle addition of a new location from the modal form
  const handleAddLocation = (newLoc: Omit<MinistryLocation, 'id'>) => {
    const created: MinistryLocation = {
      ...newLoc,
      id: `loc-${Date.now()}`
    };
    setLocations((prev) => [created, ...prev]);
    setSelectedLocation(created);
    setCurrentTab('map');
  };

  // Handle addition of a new minister from the application form
  const handleAddMinister = (newMin: Omit<Minister, 'id'>) => {
    const created: Minister = {
      ...newMin,
      id: `min-${Date.now()}`
    };
    setMinisters((prev) => [created, ...prev]);
  };

  // Handle addition of suggested news
  const handleAddNews = (newArticle: Omit<NewsArticle, 'id'>) => {
    const created: NewsArticle = {
      ...newArticle,
      id: `news-${Date.now()}`
    };
    setNews((prev) => [created, ...prev]);
  };

  // Master search logic on current tab or simple search trigger
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Detailed view helper
  const handleSelectDetails = (loc: MinistryLocation) => {
    setSelectedLocation(loc);
    setCurrentTab('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col justify-between font-sans antialiased text-[#1b1c1c]">
      
      {/* Dynamic Header Component */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSearchQuery('');
        }}
        onAddLocationClick={() => setIsAddLocationOpen(true)}
        onSearch={handleSearch}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {currentTab === 'map' && (
          <div className="space-y-16 py-8">
            
            {/* Hero & Mission Intro Section */}
            <section className="px-4 md:px-16 max-w-[1280px] mx-auto grid md:grid-cols-2 items-center gap-12 pt-4">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#735c00]">
                  <Sparkles className="w-5 h-5 text-[#fed65b] fill-[#fed65b]" />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider">Єдність, Надія та Віра</span>
                </div>
                <h1 className="font-serif text-3.5xl md:text-5xl font-bold text-[#003466] leading-tight">
                  Єднаємо християнські серця через служіння
                </h1>
                <p className="font-sans text-xs md:text-base text-[#424750] leading-relaxed max-w-lg">
                  Проєкт створений для взаємодії та синергії християнських громад України. Знаходьте можливості для волонтерства, теологічного навчання та отримання духовної опіки у вашому місті.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="#main-map-section"
                    className="bg-[#003466] text-white hover:bg-[#1a4b84] px-6 py-3 rounded text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Переглянути карту
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setCurrentTab('about')}
                    className="border border-[#737781] text-[#003466] hover:bg-[#efeded] px-6 py-3 rounded text-xs font-semibold transition-all cursor-pointer"
                  >
                    Дізнатись більше
                  </button>
                </div>
              </div>

              {/* High-quality cover photo representing community */}
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-md border border-[#c3c6d1]/40">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDStKYYSpEHUcPrGYHRUIA1Vb67PPbq_1h8ZacDMP4c-zzhwRs47XitGfiO81FCZZHBjZ0p2E3XDGP6PLyxLJhscWrGQinz-CZ2bDvRKAARIuWTpIS6_xiKr0kkdfs5Z3qajiykNbUZSrgEtCfymSJridaaUlKZcuSNS3a6ElIrzmGx1-2K6WYvKtNrH8-78LwlMYMCFex-1T_ZU8dhtEj6jW3-KGUAB17mDls7PztBkvfeMKxJ6Ct2WTwJ2dnezo-EexiFcSVVynpz"
                  alt="Християнський центр"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </section>

            {/* Interactive Map Section */}
            <section id="main-map-section" className="px-4 md:px-16 max-w-[1280px] mx-auto space-y-4">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-[#735c00] font-sans text-xs font-bold uppercase tracking-widest">
                  Географія служінь
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#003466]">
                  Знайдіть потрібний осередок
                </h2>
                <p className="font-sans text-xs text-[#737781]">
                  Обирайте напрямок та приєднуйтесь до наших зустрічей та спільних справ
                </p>
              </div>

              <UkraineMap
                locations={locations}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                onSelectDetails={handleSelectDetails}
                onAddLocationClick={() => setIsAddLocationOpen(true)}
              />
            </section>

            {/* Quick Stats Block */}
            <section className="bg-[#003466] py-16 text-white text-center">
              <div className="px-4 md:px-16 max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                  <div className="font-serif text-3.5xl md:text-5xl font-bold text-[#fed65b] mb-1">450+</div>
                  <div className="font-sans text-xs font-semibold text-[#93bcfc] uppercase tracking-wider">Локацій в Україні</div>
                </div>
                <div>
                  <div className="font-serif text-3.5xl md:text-5xl font-bold text-[#fed65b] mb-1">120</div>
                  <div className="font-sans text-xs font-semibold text-[#93bcfc] uppercase tracking-wider">Християнських громад</div>
                </div>
                <div>
                  <div className="font-serif text-3.5xl md:text-5xl font-bold text-[#fed65b] mb-1">15k</div>
                  <div className="font-sans text-xs font-semibold text-[#93bcfc] uppercase tracking-wider font-medium">Залучених волонтерів</div>
                </div>
                <div>
                  <div className="font-serif text-3.5xl md:text-5xl font-bold text-[#fed65b] mb-1">24/7</div>
                  <div className="font-sans text-xs font-semibold text-[#93bcfc] uppercase tracking-wider">Допомога потребуючим</div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* Tab Components routing */}
        {currentTab === 'about' && (
          <AboutView onExploreMapClick={() => setCurrentTab('map')} />
        )}

        {currentTab === 'ministers' && (
          <MinistersView
            ministers={ministers}
            onAddMinister={handleAddMinister}
          />
        )}

        {currentTab === 'news' && (
          <NewsView
            news={news}
            events={events}
            onAddNews={handleAddNews}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarView
            events={events}
            locations={locations}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            locations={locations}
            ministers={ministers}
            events={events}
            news={news}
            onUpdateLocations={setLocations}
            onUpdateMinisters={setMinisters}
            onUpdateEvents={setEvents}
            onUpdateNews={setNews}
          />
        )}

        {currentTab === 'details' && selectedLocation && (
          <MinistryDetailView
            location={selectedLocation}
            onBackToMap={() => {
              setCurrentTab('map');
              setTimeout(() => {
                const el = document.getElementById('main-map-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        )}
      </main>

      {/* Shared Footer Component */}
      <Footer setCurrentTab={(tab) => {
        setCurrentTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Add Location Modal Popup Form */}
      <AddLocationModal
        isOpen={isAddLocationOpen}
        onClose={() => setIsAddLocationOpen(false)}
        onAddLocation={handleAddLocation}
      />

    </div>
  );
}
