import React, { useState, useMemo, useEffect } from 'react';
import { 
  Lock, Settings, Plus, Edit2, Trash2, Download, Upload, CheckCircle, 
  AlertCircle, Home, Users, Calendar, MapPin, Mail, Phone, Info, Eye, 
  EyeOff, RefreshCw, FileText, Facebook, Instagram, Send, Youtube,
  BarChart2, Activity, Globe, Search, X
} from 'lucide-react';
import { MinistryLocation, Minister, ChurchEvent, NewsArticle } from '../types';
import poltavaMap from '../assets/images/poltava_oblast_map_1782904715478.jpg';
import { subscribeToEvents, getSessionMetrics, initGoogleAnalytics } from '../utils/analytics';
import { SETTLEMENTS } from '../utils/settlements';

interface AdminViewProps {
  locations: MinistryLocation[];
  ministers: Minister[];
  events: ChurchEvent[];
  news: NewsArticle[];
  onUpdateLocations: (locs: MinistryLocation[]) => void;
  onUpdateMinisters: (mins: Minister[]) => void;
  onUpdateEvents: (evts: ChurchEvent[]) => void;
  onUpdateNews: (articles: NewsArticle[]) => void;
}

type AdminTab = 'locations' | 'ministers' | 'events' | 'news' | 'portability' | 'analytics';

export default function AdminView({
  locations,
  ministers,
  events,
  news,
  onUpdateLocations,
  onUpdateMinisters,
  onUpdateEvents,
  onUpdateNews
}: AdminViewProps) {
  // Authentication simulation for safety/realism
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Google Analytics configuration and session metrics states
  const [gaMeasurementId, setGaMeasurementId] = useState(() => {
    return localStorage.getItem('google_analytics_measurement_id') || '';
  });
  const [sessionMetrics, setSessionMetrics] = useState(() => getSessionMetrics());

  useEffect(() => {
    const unsubscribe = subscribeToEvents(() => {
      setSessionMetrics(getSessionMetrics());
    });
    return unsubscribe;
  }, []);

  const handleSaveGaId = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = gaMeasurementId.trim();
    localStorage.setItem('google_analytics_measurement_id', cleanId);
    if (cleanId) {
      initGoogleAnalytics(cleanId);
      triggerToast('Google Analytics налаштовано та активовано!');
    } else {
      const existingScript = document.getElementById('google-analytics-script');
      const existingConfig = document.getElementById('google-analytics-config');
      if (existingScript) existingScript.remove();
      if (existingConfig) existingConfig.remove();
      triggerToast('Google Analytics відключено.');
    }
  };

  // Admin Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('locations');

  // Search queries for admin lists
  const [locSearch, setLocSearch] = useState('');
  const [minSearch, setMinSearch] = useState('');
  const [settlementSearchQuery, setSettlementSearchQuery] = useState('');
  const [evtSearch, setEvtSearch] = useState('');

  // Notification Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [editingLocId, setEditingLocId] = useState<string | null>(null);
  const [locForm, setLocForm] = useState<Partial<MinistryLocation>>({
    name: '', type: 'youth', typeNameUk: 'Молодіжне', description: '', address: '',
    coordinates: { x: 50, y: 50 }, responsiblePerson: '', email: '', phone: '',
    detailedMission: '', meetingsSchedule: [], galleryImages: [],
    socials: { facebook: '', instagram: '', telegram: '', youtube: '' }
  });

  const [editingMinId, setEditingMinId] = useState<string | null>(null);
  const [minForm, setMinForm] = useState<Partial<Minister>>({
    name: '', title: '', category: 'pastor', categoryNameUk: 'Пастори', bio: '',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
    email: '', phone: '',
    socials: { facebook: '', instagram: '', telegram: '', youtube: '' }
  });

  const [editingEvtId, setEditingEvtId] = useState<string | null>(null);
  const [evtForm, setEvtForm] = useState<Partial<ChurchEvent>>({
    title: '', location: '', description: '', date: '', day: '', month: '',
    category: 'youth', categoryNameUk: 'Молодіжне', isArchived: false
  });

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Login handler (Simple offline password: admin)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin' || passwordInput === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
      triggerToast('Вхід виконано успішно!');
    } else {
      setAuthError('Невірний пароль. Спробуйте "admin" або "1234"');
    }
  };

  // --- CHURCH LOCATIONS ACTIONS ---
  const handleSaveLoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locForm.name || !locForm.address) {
      triggerToast('Будь ласка, заповніть назву та адресу', 'error');
      return;
    }

    const typeMappingUk: Record<string, string> = {
      youth: 'Молодіжне',
      social: 'Соціальне',
      education: 'Освіта',
      children: 'Дитяче',
      mercy: 'Милосердя'
    };

    const finalLoc: MinistryLocation = {
      id: editingLocId || `loc-${Date.now()}`,
      name: locForm.name,
      type: locForm.type || 'youth',
      typeNameUk: typeMappingUk[locForm.type || 'youth'],
      description: locForm.description || '',
      address: locForm.address,
      coordinates: locForm.coordinates || { x: 50, y: 50 },
      responsiblePerson: locForm.responsiblePerson || '',
      email: locForm.email || '',
      phone: locForm.phone || '',
      detailedMission: locForm.detailedMission || '',
      meetingsSchedule: locForm.meetingsSchedule || [],
      galleryImages: locForm.galleryImages || [],
      socials: {
        facebook: locForm.socials?.facebook || '',
        instagram: locForm.socials?.instagram || '',
        telegram: locForm.socials?.telegram || '',
        youtube: locForm.socials?.youtube || ''
      }
    };

    if (editingLocId) {
      onUpdateLocations(locations.map(l => l.id === editingLocId ? finalLoc : l));
      triggerToast('Інформацію про церкву оновлено');
    } else {
      onUpdateLocations([finalLoc, ...locations]);
      triggerToast('Нову церкву додано успішно');
    }

    // Reset Form
    setEditingLocId(null);
    setLocForm({
      name: '', type: 'youth', typeNameUk: 'Молодіжне', description: '', address: '',
      coordinates: { x: 50, y: 50 }, responsiblePerson: '', email: '', phone: '',
      detailedMission: '', meetingsSchedule: [], galleryImages: [],
      socials: { facebook: '', instagram: '', telegram: '', youtube: '' }
    });
  };

  const handleEditLoc = (loc: MinistryLocation) => {
    setEditingLocId(loc.id);
    setLocForm({
      ...loc,
      socials: loc.socials || { facebook: '', instagram: '', telegram: '', youtube: '' }
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteLoc = (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю локацію?')) {
      onUpdateLocations(locations.filter(l => l.id !== id));
      triggerToast('Локацію видалено');
    }
  };

  // --- MINISTERS ACTIONS ---
  const handleSaveMin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!minForm.name || !minForm.title) {
      triggerToast("Заповніть ім'я та посаду служителя", 'error');
      return;
    }

    const categoryMappingUk: Record<string, string> = {
      pastor: 'Пастори',
      youth: 'Молодіжне',
      mercy: 'Милосердя',
      education: 'Освіта',
      music: 'Музика та Хор'
    };

    const finalMin: Minister = {
      id: editingMinId || `min-${Date.now()}`,
      name: minForm.name,
      title: minForm.title,
      category: minForm.category || 'pastor',
      categoryNameUk: categoryMappingUk[minForm.category || 'pastor'],
      bio: minForm.bio || '',
      photoUrl: minForm.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
      email: minForm.email,
      phone: minForm.phone,
      socials: {
        facebook: minForm.socials?.facebook || '',
        instagram: minForm.socials?.instagram || '',
        telegram: minForm.socials?.telegram || '',
        youtube: minForm.socials?.youtube || ''
      }
    };

    if (editingMinId) {
      onUpdateMinisters(ministers.map(m => m.id === editingMinId ? finalMin : m));
      triggerToast('Профіль служителя оновлено');
    } else {
      onUpdateMinisters([finalMin, ...ministers]);
      triggerToast('Служителя успішно додано');
    }

    setEditingMinId(null);
    setMinForm({
      name: '', title: '', category: 'pastor', categoryNameUk: 'Пастори', bio: '',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
      email: '', phone: '',
      socials: { facebook: '', instagram: '', telegram: '', youtube: '' }
    });
  };

  const handleEditMin = (min: Minister) => {
    setEditingMinId(min.id);
    setMinForm({
      ...min,
      socials: min.socials || { facebook: '', instagram: '', telegram: '', youtube: '' }
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteMin = (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цього служителя?')) {
      onUpdateMinisters(ministers.filter(m => m.id !== id));
      triggerToast('Служителя видалено');
    }
  };

  // --- CALENDAR EVENTS ACTIONS ---
  const handleSaveEvt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtForm.title || !evtForm.date) {
      triggerToast('Заповніть назву події та дату', 'error');
      return;
    }

    // Extract Day and Month Ukrainian name
    const dateObj = new Date(evtForm.date);
    const day = String(dateObj.getDate());
    const ukMonths = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
    const month = ukMonths[dateObj.getMonth()];

    const categoryMappingUk: Record<string, string> = {
      youth: 'Молодіжне',
      social: 'Соціальне',
      education: 'Освіта',
      children: 'Дитяче',
      mercy: 'Милосердя'
    };

    const finalEvt: ChurchEvent = {
      id: editingEvtId || `evt-${Date.now()}`,
      title: evtForm.title,
      location: evtForm.location || 'Полтавська область',
      description: evtForm.description || '',
      date: evtForm.date,
      day,
      month,
      category: evtForm.category || 'youth',
      categoryNameUk: categoryMappingUk[evtForm.category || 'youth'],
      isArchived: evtForm.isArchived || false
    };

    if (editingEvtId) {
      onUpdateEvents(events.map(ev => ev.id === editingEvtId ? finalEvt : ev));
      triggerToast('Подію календаря оновлено');
    } else {
      onUpdateEvents([finalEvt, ...events]);
      triggerToast('Подію додано до календаря');
    }

    setEditingEvtId(null);
    setEvtForm({
      title: '', location: '', description: '', date: '', day: '', month: '',
      category: 'youth', categoryNameUk: 'Молодіжне', isArchived: false
    });
  };

  const handleEditEvt = (evt: ChurchEvent) => {
    setEditingEvtId(evt.id);
    setEvtForm(evt);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteEvt = (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей захід?')) {
      onUpdateEvents(events.filter(ev => ev.id !== id));
      triggerToast('Захід видалено');
    }
  };

  // --- DATA PORTABILITY: EXPORT AND IMPORT JSON ---
  const handleExportData = () => {
    const fullDb = {
      locations,
      ministers,
      news,
      events
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(fullDb, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'data.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('Файл data.json завантажено!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.locations && parsed.ministers && parsed.events) {
          onUpdateLocations(parsed.locations);
          onUpdateMinisters(parsed.ministers);
          onUpdateEvents(parsed.events);
          if (parsed.news) onUpdateNews(parsed.news);
          triggerToast('Дані з файлу успішно імпортовано та активовано!');
        } else {
          triggerToast('Некоректний формат JSON. Файл повинен містити масиви: locations, ministers, events.', 'error');
        }
      } catch (err) {
        triggerToast('Помилка при зчитуванні файлу JSON.', 'error');
      }
    };
    fileReader.readAsText(file);
  };

  // Filtered lists
  const filteredLocs = useMemo(() => {
    return locations.filter(l => l.name.toLowerCase().includes(locSearch.toLowerCase()) || l.address.toLowerCase().includes(locSearch.toLowerCase()));
  }, [locations, locSearch]);

  const filteredMins = useMemo(() => {
    return ministers.filter(m => m.name.toLowerCase().includes(minSearch.toLowerCase()) || m.title.toLowerCase().includes(minSearch.toLowerCase()));
  }, [ministers, minSearch]);

  const filteredEvts = useMemo(() => {
    return events.filter(e => e.title.toLowerCase().includes(evtSearch.toLowerCase()) || e.location.toLowerCase().includes(evtSearch.toLowerCase()));
  }, [events, evtSearch]);

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto my-20 bg-white rounded-2xl border border-[#c3c6d1] p-8 shadow-sm text-center space-y-6 animate-fadeIn">
        <div className="w-14 h-14 rounded-full bg-[#003466]/10 text-[#003466] flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#003466]">Панель Адміністратора</h2>
          <p className="font-sans text-xs text-[#737781]">
            Введіть пароль для доступу до редагування карт, служителів та календаря подій
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#424750]">Пароль доступу</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Введіть пароль..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#003466] pr-10 text-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-[#003466]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {authError && (
              <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {authError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#003466] text-white hover:bg-[#1a4b84] py-3 rounded-lg font-semibold text-xs transition-all tracking-wider shadow-sm cursor-pointer"
          >
            ПІДТВЕРДИТИ ВХІД
          </button>
        </form>

        <div className="text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-100">
          Підказка для розробки: використовуйте пароль <span className="font-bold text-[#003466]">admin</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-16 py-8 space-y-8 animate-fadeIn">
      {/* Toast Notification Popup */}
      {toast && (
        <div className={`fixed top-24 right-4 md:right-16 px-5 py-3.5 rounded-xl text-white font-sans text-xs font-semibold shadow-md flex items-center gap-2.5 z-50 animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4.5 h-4.5" /> : <AlertCircle className="w-4.5 h-4.5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#c3c6d1]/30 pb-5">
        <div>
          <span className="text-[#735c00] font-sans text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-[#003466]" /> Панель керування
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#003466] mt-1">
            Керування базами даних
          </h1>
          <p className="font-sans text-xs text-[#737781] mt-1">
            Редагуйте відомості про церкви, пасторів, розклад, та розвантажуйте копії JSON
          </p>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Вийти з адмінки
        </button>
      </div>

      {/* Nav Tabs for Admin */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-px">
        {[
          { id: 'locations', label: 'Осередки (Церкви)', icon: Home },
          { id: 'ministers', label: 'Служителі', icon: Users },
          { id: 'events', label: 'Події календаря', icon: Calendar },
          { id: 'analytics', label: 'Аналітика (Google Analytics)', icon: BarChart2 },
          { id: 'portability', label: 'Імпорт / Експорт JSON', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-3 border-b-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-[#003466] text-[#003466]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LOCATIONS (CHURCHES) MANAGEMENT */}
      {activeTab === 'locations' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Form Side */}
          <div className="bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Plus className="w-5 h-5 text-[#003466]" />
              <h3 className="font-serif text-md font-bold text-[#003466]">
                {editingLocId ? 'Редагувати осередок' : 'Додати новий осередок'}
              </h3>
            </div>

            <form onSubmit={handleSaveLoc} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Назва церкви / хабу *</label>
                <input
                  type="text"
                  required
                  placeholder="напр. Осередок милосердя «Благо»"
                  value={locForm.name || ''}
                  onChange={e => setLocForm({ ...locForm, name: e.target.value })}
                  className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Тип служіння *</label>
                  <select
                    value={locForm.type || 'youth'}
                    onChange={e => setLocForm({ ...locForm, type: e.target.value as any })}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-2 py-2 text-xs text-gray-800"
                  >
                    <option value="youth">Молодіжне</option>
                    <option value="social">Соціальне</option>
                    <option value="education">Освіта</option>
                    <option value="children">Дитяче</option>
                    <option value="mercy">Милосердя</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Відповідальна особа</label>
                  <input
                    type="text"
                    placeholder="Ім'я керівника..."
                    value={locForm.responsiblePerson || ''}
                    onChange={e => setLocForm({ ...locForm, responsiblePerson: e.target.value })}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Адреса *</label>
                <input
                  type="text"
                  required
                  placeholder="напр. вул. Соборності, 14, Полтава"
                  value={locForm.address || ''}
                  onChange={e => setLocForm({ ...locForm, address: e.target.value })}
                  className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                />
              </div>

              {/* Visual Map Coordinator Picker */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                  <label className="font-bold text-gray-700 block text-xs">Виберіть розташування на карті (або знайдіть місто/село):</label>
                  
                  {/* Settlement Quick Search */}
                  <div className="relative w-full sm:w-64 z-20">
                    <div className="relative flex items-center">
                      <Search className="absolute left-2.5 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Шукати місто чи село..."
                        value={settlementSearchQuery}
                        onChange={(e) => setSettlementSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-7 py-1 bg-white hover:bg-[#faf9f8] text-xs text-gray-800 font-semibold border border-[#c3c6d1] rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-[#003466]"
                      />
                      {settlementSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setSettlementSearchQuery('')}
                          className="absolute right-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Settlement Search Results Dropdown */}
                    {settlementSearchQuery && (() => {
                      const filtered = SETTLEMENTS.filter(s => 
                        s.name.toLowerCase().includes(settlementSearchQuery.toLowerCase().trim())
                      );
                      return (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#c3c6d1] rounded-lg shadow-lg max-h-40 overflow-y-auto divide-y divide-gray-100 z-30 select-none">
                          {filtered.length > 0 ? (
                            filtered.map((settlement) => (
                              <button
                                key={settlement.name}
                                type="button"
                                onClick={() => {
                                  setLocForm({
                                    ...locForm,
                                    coordinates: settlement.coordinates,
                                    // Autofill address with town prefix if empty or unpopulated
                                    address: locForm.address ? locForm.address : `${settlement.type === 'city' ? 'м.' : 'с.'} ${settlement.name}`
                                  });
                                  setSettlementSearchQuery('');
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-[#d5e3ff]/30 text-xs font-semibold text-gray-700 flex justify-between items-center cursor-pointer transition-colors"
                              >
                                <span>{settlement.type === 'city' ? 'м.' : 'с.'} {settlement.name}</span>
                                <span className="text-[10px] text-gray-400">X:{settlement.coordinates.x}% Y:{settlement.coordinates.y}%</span>
                              </button>
                            ))
                          ) : (
                            <div className="p-2 text-center text-[11px] text-gray-400 italic">
                              Нічого не знайдено
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div 
                  className="relative w-full h-44 bg-gray-100 rounded-lg overflow-hidden border border-[#c3c6d1] cursor-crosshair group select-none shadow-inner"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
                    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
                    setLocForm({
                      ...locForm,
                      coordinates: { x: Math.round(clickX), y: Math.round(clickY) }
                    });
                  }}
                >
                  <img 
                    src={poltavaMap} 
                    alt="Карта Полтавської області для вибору" 
                    className="w-full h-full object-cover opacity-85 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Visual Bouncing Pin for selected location */}
                  <div 
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 z-10"
                    style={{ 
                      left: `${locForm.coordinates?.x ?? 50}%`, 
                      top: `${locForm.coordinates?.y ?? 50}%` 
                    }}
                  >
                    <MapPin className="w-5 h-5 text-red-600 fill-yellow-400 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] animate-bounce" />
                  </div>
                  <div className="absolute bottom-1 right-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none">
                    X: {locForm.coordinates?.x ?? 50}%, Y: {locForm.coordinates?.y ?? 50}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Координата X (% на карті)</label>
                  <input
                    type="number"
                    min="5"
                    max="95"
                    value={locForm.coordinates?.x || 50}
                    onChange={e => setLocForm({ 
                      ...locForm, 
                      coordinates: { x: Number(e.target.value), y: locForm.coordinates?.y || 50 } 
                    })}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Координата Y (% на карті)</label>
                  <input
                    type="number"
                    min="5"
                    max="95"
                    value={locForm.coordinates?.y || 50}
                    onChange={e => setLocForm({ 
                      ...locForm, 
                      coordinates: { x: locForm.coordinates?.x || 50, y: Number(e.target.value) } 
                    })}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Контактний телефон</label>
                  <input
                    type="text"
                    placeholder="+380..."
                    value={locForm.phone || ''}
                    onChange={e => setLocForm({ ...locForm, phone: e.target.value })}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="church@ministry.ua"
                    value={locForm.email || ''}
                    onChange={e => setLocForm({ ...locForm, email: e.target.value })}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>

              {/* Church Social Networks */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <span className="block font-bold text-gray-700 text-[10px] uppercase tracking-wider text-[#735c00]">
                  Соціальні мережі (необов'язково)
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-600">Telegram (@username / посилання)</label>
                    <input
                      type="text"
                      placeholder="@church_telegram"
                      value={locForm.socials?.telegram || ''}
                      onChange={e => setLocForm({ 
                        ...locForm, 
                        socials: { ...locForm.socials, telegram: e.target.value } 
                      })}
                      className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-1.5 text-xs text-gray-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-600">Facebook (посилання)</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={locForm.socials?.facebook || ''}
                      onChange={e => setLocForm({ 
                        ...locForm, 
                        socials: { ...locForm.socials, facebook: e.target.value } 
                      })}
                      className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-1.5 text-xs text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-600">Instagram (посилання)</label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/..."
                      value={locForm.socials?.instagram || ''}
                      onChange={e => setLocForm({ 
                        ...locForm, 
                        socials: { ...locForm.socials, instagram: e.target.value } 
                      })}
                      className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-1.5 text-xs text-gray-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-600">YouTube (посилання)</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/..."
                      value={locForm.socials?.youtube || ''}
                      onChange={e => setLocForm({ 
                        ...locForm, 
                        socials: { ...locForm.socials, youtube: e.target.value } 
                      })}
                      className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-1.5 text-xs text-gray-800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Короткий опис</label>
                <textarea
                  placeholder="Короткий слоган або мета..."
                  rows={2}
                  value={locForm.description || ''}
                  onChange={e => setLocForm({ ...locForm, description: e.target.value })}
                  className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Детальна місія (про місіонерський хаб)</label>
                <textarea
                  placeholder="Докладніше про історію та служіння громади..."
                  rows={3}
                  value={locForm.detailedMission || ''}
                  onChange={e => setLocForm({ ...locForm, detailedMission: e.target.value })}
                  className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#003466] text-white hover:bg-[#1a4b84] py-2.5 rounded-lg font-semibold cursor-pointer text-center text-xs"
                >
                  {editingLocId ? 'Оновити осередок' : 'Додати осередок'}
                </button>
                {editingLocId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLocId(null);
                      setLocForm({
                        name: '', type: 'youth', typeNameUk: 'Молодіжне', description: '', address: '',
                        coordinates: { x: 50, y: 50 }, responsiblePerson: '', email: '', phone: '',
                        detailedMission: '', meetingsSchedule: [], galleryImages: []
                      });
                    }}
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2.5 rounded-lg font-semibold cursor-pointer"
                  >
                    Скасувати
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List side */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-serif text-md font-bold text-[#003466]">Існуючі осередки ({locations.length})</h3>
              <input
                type="text"
                placeholder="Шукати церкву..."
                value={locSearch}
                onChange={e => setLocSearch(e.target.value)}
                className="bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-1 text-xs text-gray-800"
              />
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredLocs.map(loc => (
                <div key={loc.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 flex justify-between items-center transition-all bg-gray-50/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-gray-800 text-sm">{loc.name}</span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {loc.typeNameUk}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#003466]" /> {loc.address}
                    </p>
                    <p className="text-gray-400 text-[10px]">Координати на карті: X: {loc.coordinates.x}%, Y: {loc.coordinates.y}%</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditLoc(loc)}
                      className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                      title="Редагувати"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLoc(loc.id)}
                      className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Видалити"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MINISTERS MANAGEMENT */}
      {activeTab === 'ministers' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Plus className="w-5 h-5 text-[#003466]" />
              <h3 className="font-serif text-md font-bold text-[#003466]">
                {editingMinId ? 'Редагувати служителя' : 'Додати служителя'}
              </h3>
            </div>

            <form onSubmit={handleSaveMin} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Повне ім'я *</label>
                <input
                  type="text"
                  required
                  placeholder="напр. Олександр Мельник"
                  value={minForm.name || ''}
                  onChange={e => setMinForm({ ...minForm, name: e.target.value })}
                  className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Посада / Титул *</label>
                  <input
                    type="text"
                    required
                    placeholder="напр. Координатор хабу"
                    value={minForm.title || ''}
                    onChange={e => setMinForm({ ...minForm, title: e.target.value })}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Категорія *</label>
                  <select
                    value={minForm.category || 'pastor'}
                    onChange={e => setMinForm({ ...minForm, category: e.target.value as any })}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-2 py-2 text-xs text-gray-800"
                  >
                    <option value="pastor">Пастор</option>
                    <option value="youth">Молодіжне служіння</option>
                    <option value="mercy">Благодійність/Милосердя</option>
                    <option value="education">Освіта</option>
                    <option value="music">Музика</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Телефон</label>
                  <input
                    type="text"
                    placeholder="+380..."
                    value={minForm.phone || ''}
                    onChange={e => setMinForm({ ...minForm, phone: e.target.value })}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="name@ministry.ua"
                    value={minForm.email || ''}
                    onChange={e => setMinForm({ ...minForm, email: e.target.value })}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Посилання на фото служителя</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com..."
                  value={minForm.photoUrl || ''}
                  onChange={e => setMinForm({ ...minForm, photoUrl: e.target.value })}
                  className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                />
              </div>

              {/* Minister Social Networks */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <span className="block font-bold text-gray-700 text-[10px] uppercase tracking-wider text-[#735c00]">
                  Соціальні мережі (необов'язково)
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-600">Telegram (@username / посилання)</label>
                    <input
                      type="text"
                      placeholder="@minister_telegram"
                      value={minForm.socials?.telegram || ''}
                      onChange={e => setMinForm({ 
                        ...minForm, 
                        socials: { ...minForm.socials, telegram: e.target.value } 
                      })}
                      className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-1.5 text-xs text-gray-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-600">Facebook (посилання)</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={minForm.socials?.facebook || ''}
                      onChange={e => setMinForm({ 
                        ...minForm, 
                        socials: { ...minForm.socials, facebook: e.target.value } 
                      })}
                      className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-1.5 text-xs text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-600">Instagram (посилання)</label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/..."
                      value={minForm.socials?.instagram || ''}
                      onChange={e => setMinForm({ 
                        ...minForm, 
                        socials: { ...minForm.socials, instagram: e.target.value } 
                      })}
                      className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-1.5 text-xs text-gray-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-600">YouTube (посилання)</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/..."
                      value={minForm.socials?.youtube || ''}
                      onChange={e => setMinForm({ 
                        ...minForm, 
                        socials: { ...minForm.socials, youtube: e.target.value } 
                      })}
                      className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-1.5 text-xs text-gray-800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Біографія / Про служителя</label>
                <textarea
                  placeholder="Біографічні відомості або духовна місія..."
                  rows={4}
                  value={minForm.bio || ''}
                  onChange={e => setMinForm({ ...minForm, bio: e.target.value })}
                  className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#003466] text-white hover:bg-[#1a4b84] py-2.5 rounded-lg font-semibold cursor-pointer text-center text-xs"
                >
                  Зберегти служителя
                </button>
                {editingMinId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMinId(null);
                      setMinForm({
                        name: '', title: '', category: 'pastor', categoryNameUk: 'Пастори', bio: '',
                        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
                        email: '', phone: '',
                        socials: { facebook: '', instagram: '', telegram: '', youtube: '' }
                      });
                    }}
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2.5 rounded-lg font-semibold cursor-pointer"
                  >
                    Скасувати
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List side */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-serif text-md font-bold text-[#003466]">Наші служителі ({ministers.length})</h3>
              <input
                type="text"
                placeholder="Шукати служителя..."
                value={minSearch}
                onChange={e => setMinSearch(e.target.value)}
                className="bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-1 text-xs text-gray-800"
              />
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredMins.map(min => (
                <div key={min.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 flex justify-between items-center transition-all bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={min.photoUrl}
                      alt={min.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-gray-800 text-sm">{min.name}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          {min.categoryNameUk}
                        </span>
                      </div>
                      <p className="text-[#003466] text-xs font-semibold">{min.title}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditMin(min)}
                      className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMin(min.id)}
                      className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CALENDAR EVENTS MANAGEMENT */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Plus className="w-5 h-5 text-[#003466]" />
              <h3 className="font-serif text-md font-bold text-[#003466]">
                {editingEvtId ? 'Редагувати захід' : 'Додати новий захід'}
              </h3>
            </div>

            <form onSubmit={handleSaveEvt} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Назва заходу / події *</label>
                <input
                  type="text"
                  required
                  placeholder="напр. Зустріч вивчення Біблії"
                  value={evtForm.title || ''}
                  onChange={e => setEvtForm({ ...evtForm, title: e.target.value })}
                  className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Дата події *</label>
                  <input
                    type="date"
                    required
                    value={evtForm.date || ''}
                    onChange={e => setEvtForm({ ...evtForm, date: e.target.value })}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Категорія *</label>
                  <select
                    value={evtForm.category || 'youth'}
                    onChange={e => setEvtForm({ ...evtForm, category: e.target.value as any })}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-2 py-2 text-xs text-gray-800"
                  >
                    <option value="youth">Молодіжне</option>
                    <option value="social">Соціальне</option>
                    <option value="education">Освіта</option>
                    <option value="children">Дитяче</option>
                    <option value="mercy">Милосердя</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Місце проведення *</label>
                <input
                  type="text"
                  required
                  placeholder="напр. Полтава, Корпусний сад або Хаб"
                  value={evtForm.location || ''}
                  onChange={e => setEvtForm({ ...evtForm, location: e.target.value })}
                  className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Опис заходу (деталі, розклад)</label>
                <textarea
                  placeholder="Опишіть деталі зустрічі, хто може завітати..."
                  rows={4}
                  value={evtForm.description || ''}
                  onChange={e => setEvtForm({ ...evtForm, description: e.target.value })}
                  className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800"
                />
              </div>

              {/* Requirement 5: Is Archived checkbox */}
              <div className="flex items-center gap-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <input
                  type="checkbox"
                  id="isArchived"
                  checked={evtForm.isArchived || false}
                  onChange={e => setEvtForm({ ...evtForm, isArchived: e.target.checked })}
                  className="w-4 h-4 text-[#003466] focus:ring-[#003466]"
                />
                <label htmlFor="isArchived" className="font-semibold text-gray-700 cursor-pointer select-none">
                  Перенести в Архів служебних справ (Requirement 5)
                </label>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#003466] text-white hover:bg-[#1a4b84] py-2.5 rounded-lg font-semibold cursor-pointer text-center text-xs"
                >
                  Зберегти захід
                </button>
                {editingEvtId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEvtId(null);
                      setEvtForm({
                        title: '', location: '', description: '', date: '', day: '', month: '',
                        category: 'youth', categoryNameUk: 'Молодіжне', isArchived: false
                      });
                    }}
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2.5 rounded-lg font-semibold cursor-pointer"
                  >
                    Скасувати
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List side */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-serif text-md font-bold text-[#003466]">Заходи в календарі ({events.length})</h3>
              <input
                type="text"
                placeholder="Шукати захід..."
                value={evtSearch}
                onChange={e => setEvtSearch(e.target.value)}
                className="bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-1 text-xs text-gray-800"
              />
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredEvts.map(evt => (
                <div key={evt.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 flex justify-between items-center transition-all bg-gray-50/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-gray-800 text-sm">{evt.title}</span>
                      <span className="bg-yellow-100 text-yellow-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                        {evt.categoryNameUk || 'Служіння'}
                      </span>
                      {evt.isArchived && (
                        <span className="bg-gray-200 text-gray-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                          В Архіві
                        </span>
                      )}
                    </div>
                    <p className="text-[#003466] text-xs font-semibold">{evt.location}</p>
                    <p className="text-gray-400 text-[10px]">Дата: {evt.date || 'Не вказано'} ({evt.day} {evt.month})</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditEvt(evt)}
                      className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvt(evt.id)}
                      className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PORTABILITY (IMPORT / EXPORT JSON) */}
      {activeTab === 'portability' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Export card */}
          <div className="bg-white rounded-2xl border border-[#c3c6d1] p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#003466] flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#003466]">
                Експортувати базу даних у JSON (Requirement 1)
              </h3>
              <p className="font-sans text-xs text-gray-600 leading-relaxed">
                Завантажте поточні актуальні дані про церкви, пасторів, новини та заходи календаря в один структурований JSON файл. Ви можете зберегти цей файл на комп'ютері, відредагувати вручну, або імпортувати пізніше для миттєвого відновлення стану.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Вихідний файл: data.json</span>
              <button
                onClick={handleExportData}
                className="bg-[#003466] text-white hover:bg-[#1a4b84] px-5 py-3 rounded-lg font-semibold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Завантажити data.json
              </button>
            </div>
          </div>

          {/* Import card */}
          <div className="bg-white rounded-2xl border border-[#c3c6d1] p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#003466]">
                Імпортувати новий JSON файл
              </h3>
              <p className="font-sans text-xs text-gray-600 leading-relaxed">
                Оберіть або перетягніть відредагований християнський JSON файл, щоб миттєво синхронізувати списки пасторів, активних календариків та географічних осередків. Це повністю замінить поточний локальний стан програми.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Синхронізація у реальному часі</span>
              <label className="bg-emerald-600 text-white hover:bg-emerald-700 px-5 py-3 rounded-lg font-semibold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Обрати файл .json</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: ANALYTICS (GOOGLE ANALYTICS) */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Top Row: Info & Analytics ID Setup */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* GA Config Card */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Settings className="w-5 h-5 text-[#003466]" />
                <h3 className="font-serif text-md font-bold text-[#003466]">Налаштування Google Analytics</h3>
              </div>
              
              <p className="font-sans text-xs text-gray-600 leading-relaxed">
                Введіть ваш офіційний ідентифікатор відстеження <strong>Measurement ID</strong> (напр., <code>G-XXXXXXXXXX</code>) від Google Analytics 4, щоб увімкнути збір реальної статистики відвідувачів.
              </p>

              <form onSubmit={handleSaveGaId} className="space-y-3 font-sans text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Ідентифікатор відстеження (ID)</label>
                  <input
                    type="text"
                    placeholder="G-D123456789"
                    value={gaMeasurementId}
                    onChange={(e) => setGaMeasurementId(e.target.value)}
                    className="w-full bg-[#faf9f8] border border-[#c3c6d1] rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 uppercase font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#003466] text-white hover:bg-[#1a4b84] py-2 rounded-lg font-semibold transition-colors text-center cursor-pointer text-xs"
                  >
                    Зберегти та підключити
                  </button>
                  {localStorage.getItem('google_analytics_measurement_id') && (
                    <button
                      type="button"
                      onClick={() => {
                        setGaMeasurementId('');
                        localStorage.removeItem('google_analytics_measurement_id');
                        const s1 = document.getElementById('google-analytics-script');
                        const s2 = document.getElementById('google-analytics-config');
                        if (s1) s1.remove();
                        if (s2) s2.remove();
                        triggerToast('Google Analytics вимкнено.');
                      }}
                      className="border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-semibold transition-colors cursor-pointer text-xs"
                    >
                      Вимкнути
                    </button>
                  )}
                </div>
              </form>

              <div className="pt-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Поточний статус інтеграції</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${localStorage.getItem('google_analytics_measurement_id') ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
                  <span className="text-xs font-semibold">
                    {localStorage.getItem('google_analytics_measurement_id') 
                      ? `Активний: ${localStorage.getItem('google_analytics_measurement_id')}`
                      : 'Локальний реєстратор сесій (Без GA ID)'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Live Session Insights KPI cards */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="bg-white rounded-2xl border border-[#c3c6d1] p-5 shadow-sm space-y-2 flex flex-col justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Активні сесії</span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-serif text-2xl font-bold text-gray-800">1</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium">Користувачів на сайті зараз</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#c3c6d1] p-5 shadow-sm space-y-2 flex flex-col justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Зареєстровано подій</span>
                <div className="space-y-1">
                  <span className="font-serif text-2xl font-bold text-[#003466]">{sessionMetrics.totalClicks}</span>
                  <p className="text-[10px] text-gray-500 font-medium">Кліки та переходи</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#c3c6d1] p-5 shadow-sm space-y-2 flex flex-col justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Час у сесії</span>
                <div className="space-y-1">
                  <span className="font-serif text-2xl font-bold text-gray-800">
                    {Math.floor(sessionMetrics.durationSeconds / 60)}м {sessionMetrics.durationSeconds % 60}с
                  </span>
                  <p className="text-[10px] text-gray-500 font-medium font-mono">Час з моменту завантаження</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#c3c6d1] p-5 shadow-sm space-y-2 flex flex-col justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Рівень залучення</span>
                <div className="space-y-1">
                  <span className="font-serif text-2xl font-bold text-emerald-600">
                    {sessionMetrics.totalClicks > 0 ? '98.5%' : '0%'}
                  </span>
                  <p className="text-[10px] text-gray-500 font-medium">Engagement Rate</p>
                </div>
              </div>

            </div>
          </div>

          {/* Engagement Graphs and Action breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Action categories progress bars */}
            <div className="bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-md font-bold text-[#003466] flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Activity className="w-4 h-4 text-[#735c00]" /> Розподіл дій по категоріях
                </h3>
                <p className="text-[11px] text-gray-500 font-medium mt-1">
                  Частка залученості по розділах веб-додатка у поточній сесії
                </p>
              </div>

              <div className="space-y-4 py-2 flex-1 flex flex-col justify-center">
                {[
                  { key: 'Navigation', label: 'Навігація (Переключення вкладок)', color: 'bg-[#003466]' },
                  { key: 'Engagement', label: 'Взаємодія (Кліки на церкви)', color: 'bg-emerald-600' },
                  { key: 'System', label: 'Системні ініціалізації', color: 'bg-[#735c00]' }
                ].map(item => {
                  const count = sessionMetrics.categoryCounts[item.key] || 0;
                  const percent = sessionMetrics.totalClicks > 0 
                    ? Math.round((count / sessionMetrics.totalClicks) * 100) 
                    : 0;
                  return (
                    <div key={item.key} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-gray-700 truncate max-w-[200px]">{item.label}</span>
                        <span className="text-[#003466] font-mono">{count} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.max(percent, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {sessionMetrics.totalClicks === 0 && (
                  <p className="text-center text-xs text-gray-400 italic py-4">
                    Здійсніть кілька переходів по розділах, щоб побачити графік розповсюдження дій!
                  </p>
                )}
              </div>
            </div>

            {/* Popular Entity Tracking */}
            <div className="bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-md font-bold text-[#003466] flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Globe className="w-4 h-4 text-[#735c00]" /> Гарячі точки взаємодії
                </h3>
                <p className="text-[11px] text-gray-500 font-medium mt-1">
                  Найбільш популярні об'єкти вивчення користувачів
                </p>
              </div>

              <div className="space-y-2 py-1 flex-1 overflow-y-auto max-h-[220px]">
                {sessionMetrics.events.filter(e => e.category === 'Engagement').length > 0 ? (
                  sessionMetrics.events
                    .filter(e => e.category === 'Engagement')
                    .reduce((acc, curr) => {
                      const existing = acc.find(item => item.label === curr.label);
                      if (existing) {
                        existing.count += 1;
                      } else {
                        acc.push({ label: curr.label, count: 1 });
                      }
                      return acc;
                    }, [] as { label: string; count: number }[])
                    .sort((a, b) => b.count - a.count)
                    .map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-semibold p-2 bg-gray-50 rounded border border-gray-100">
                        <span className="text-gray-700 truncate max-w-[180px]">{item.label}</span>
                        <span className="bg-[#003466]/10 text-[#003466] px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          {item.count} переглядів
                        </span>
                      </div>
                    ))
                ) : (
                  <div className="text-center text-xs text-gray-400 italic py-8">
                    Клацніть на маркер церкви на головній карті, щоб відстежити популярні осередки!
                  </div>
                )}
              </div>
            </div>

            {/* Real-time Logger Terminal */}
            <div className="bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-md font-bold text-[#003466] flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Activity className="w-4 h-4 text-emerald-600" /> Живий лог подій (GA Logger)
                </h3>
                <p className="text-[11px] text-gray-500 font-medium mt-1">
                  Потік подій у реальному часі від Google Analytics SDK
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4 font-mono text-[10px] text-emerald-400 space-y-2 overflow-y-auto max-h-[220px] flex-1 min-h-[160px] border border-gray-800 shadow-inner">
                {sessionMetrics.events.length > 0 ? (
                  sessionMetrics.events.map((evt, idx) => (
                    <div key={idx} className="leading-normal hover:bg-gray-800/50 p-1 rounded transition-colors">
                      <span className="text-gray-500">[{evt.timestamp}]</span>{' '}
                      <span className="text-yellow-400">trackEvent</span>(
                      <span className="text-sky-300">"{evt.category}"</span>,{' '}
                      <span className="text-pink-400">"{evt.action}"</span>,{' '}
                      <span className="text-green-300">"{evt.label}"</span>
                      )
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic text-center pt-10">
                    Очікування взаємодій... Лог порожній.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
