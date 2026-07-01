import React, { useState } from 'react';
import { Search, UserPlus, CheckCircle, Mail, Phone, ChevronRight, X, Heart, Facebook, Instagram, Youtube, Send } from 'lucide-react';
import { Minister } from '../types';

interface MinistersViewProps {
  ministers: Minister[];
  onAddMinister: (min: Omit<Minister, 'id'>) => void;
}

export default function MinistersView({ ministers, onAddMinister }: MinistersViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection state for minister details modal
  const [selectedMinister, setSelectedMinister] = useState<Minister | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'pastor' | 'youth' | 'mercy' | 'education' | 'music'>('pastor');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [success, setSuccess] = useState(false);

  // Category definitions
  const categories = [
    { id: 'all', label: 'Всі' },
    { id: 'pastor', label: 'Пастори' },
    { id: 'youth', label: 'Молодіжне' },
    { id: 'mercy', label: 'Милосердя' },
    { id: 'education', label: 'Освіта' },
    { id: 'music', label: 'Музика / Хор' },
  ];

  // Filter logic
  const filteredMinisters = ministers.filter((min) => {
    const matchesCategory = selectedCategory === 'all' || min.category === selectedCategory;
    const matchesSearch =
      min.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      min.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      min.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !title || !bio || !email || !phone) {
      alert('Будь ласка, заповніть усі обов\'язкові поля.');
      return;
    }

    let categoryNameUk = 'Пастор';
    if (category === 'youth') categoryNameUk = 'Молодіжний лідер';
    else if (category === 'mercy') categoryNameUk = 'Координатор милосердя';
    else if (category === 'education') categoryNameUk = 'Освітній лідер';
    else if (category === 'music') categoryNameUk = 'Музичне служіння';

    // Generates a nice placeholder avatar image path
    const photoUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1Z8XTYXCsTXbbIcxso7byo0bRgCAmCGI3ubdv1PZbHIsk1LSrXwCzxNl3uoKkAddJHkAldYQQcwFw5fZIzphqns9NZt9LAItXzvoq7ecgvRigZnBghhIcMySLaQBtNdcVG6TSHxdSZvPHsH42UTMuFk6Vqs1Xa6BSi3FjVWaIdqZrNylaglh2GP4whsqGLQgZRmQ6dFViL4hWKVlXxu1RObeX2N4i4w_coGRkkWeP6idNfcEFzRZvFIWF5QpTrVM9VVMJLOudLz4v';

    onAddMinister({
      name,
      title,
      category,
      categoryNameUk,
      bio,
      photoUrl,
      email,
      phone,
      socials: {
        ...(facebook ? { facebook } : {}),
        ...(instagram ? { instagram } : {}),
        ...(telegram ? { telegram } : {}),
        ...(youtube ? { youtube } : {}),
      }
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setName('');
      setTitle('');
      setBio('');
      setEmail('');
      setPhone('');
      setFacebook('');
      setInstagram('');
      setTelegram('');
      setYoutube('');
      setIsFormOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-12 py-12 text-[#1b1c1c]">
      {/* Intro and Filters */}
      <section className="px-4 md:px-16 max-w-[1280px] mx-auto space-y-6">
        <div>
          <span className="text-[#735c00] font-sans text-xs font-bold uppercase tracking-widest">
            Духовний Провід
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#003466] mt-2 mb-4">
            Наші служителі та лідери
          </h1>
          <p className="font-sans text-base text-[#424750] max-w-2xl leading-relaxed">
            Знайомтеся з лідерами, які присвятили своє життя служінню Богу та громаді. Кожен із них несе унікальне покликання та готовий підтримати вас на духовному шляху.
          </p>
        </div>

        {/* Filters and search block */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-t border-[#c3c6d1]/40 pt-6">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full font-sans text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#003466] text-white'
                    : 'bg-[#efeded] text-[#424750] hover:bg-[#ffe088] hover:text-[#574500]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737781]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#c3c6d1] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#003466] text-[#1b1c1c]"
              placeholder="Пошук за ім'ям чи описом..."
            />
          </div>
        </div>
      </section>

      {/* Leaders Grid */}
      <section className="px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMinisters.map((min) => (
            <div
              key={min.id}
              onClick={() => setSelectedMinister(min)}
              className="group bg-white border border-[#c3c6d1] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Photo container with category badge */}
                <div className="h-80 overflow-hidden relative bg-[#efeded]">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    src={min.photoUrl}
                    alt={min.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#003466]/90 text-white text-[10px] uppercase tracking-wider font-bold rounded">
                      {min.categoryNameUk}
                    </span>
                  </div>
                </div>

                {/* Profile contents */}
                <div className="p-8 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#1b1c1c] group-hover:text-[#003466] transition-colors">
                    {min.name}
                  </h3>
                  <p className="font-sans text-xs font-semibold text-[#735c00]">
                    {min.title}
                  </p>
                  <p className="font-sans text-xs text-[#424750] leading-relaxed line-clamp-3">
                    {min.bio}
                  </p>
                </div>
              </div>

              {/* Contact / Connection bar */}
              <div 
                className="p-8 pt-0 mt-auto border-t border-[#efeded]/60 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-wrap gap-2 text-[#737781] items-center">
                  {min.email && (
                    <a
                      href={`mailto:${min.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-[#003466] transition-colors p-1 rounded hover:bg-[#efeded]/60"
                      title="Надіслати email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {min.phone && (
                    <a
                      href={`tel:${min.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-[#003466] transition-colors p-1 rounded hover:bg-[#efeded]/60"
                      title="Зателефонувати"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  {min.socials?.telegram && (
                    <a
                      href={min.socials.telegram.startsWith('http') ? min.socials.telegram : `https://t.me/${min.socials.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-[#0088cc] transition-colors p-1 rounded hover:bg-[#efeded]/60"
                      title="Telegram"
                    >
                      <Send className="w-4 h-4" />
                    </a>
                  )}
                  {min.socials?.facebook && (
                    <a
                      href={min.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-[#1877f2] transition-colors p-1 rounded hover:bg-[#efeded]/60"
                      title="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {min.socials?.instagram && (
                    <a
                      href={min.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-[#e1306c] transition-colors p-1 rounded hover:bg-[#efeded]/60"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {min.socials?.youtube && (
                    <a
                      href={min.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-[#ff0000] transition-colors p-1 rounded hover:bg-[#efeded]/60"
                      title="YouTube"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMinister(min);
                  }}
                  className="inline-flex items-center gap-1.5 text-[#003466] text-xs font-bold hover:gap-2.5 transition-all self-end sm:self-auto cursor-pointer"
                >
                  Детальніше
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Call to action for adding minister profile */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#c3c6d1] rounded-2xl p-10 bg-[#efeded]/20 text-center space-y-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-[#c3c6d1] shadow-xs">
              <UserPlus className="w-6 h-6 text-[#737781]" />
            </div>
            <h3 className="font-serif text-md font-bold text-[#1b1c1c]">
              Не знайшли свого служителя?
            </h3>
            <p className="font-sans text-xs text-[#424750] max-w-xs leading-relaxed">
              Кожна християнська громада може додати своїх пасторів, координаторів соціальної чи молодіжної праці для розширення мережі.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-white border border-[#003466] text-[#003466] px-6 py-2.5 rounded font-sans text-xs font-bold hover:bg-[#d5e3ff]/30 transition-all cursor-pointer"
            >
              Надіслати анкету
            </button>
          </div>
        </div>
      </section>

      {/* Minister Registration Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-[#1b1c1c]/55 backdrop-blur-sm flex items-center justify-center z-[110] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#c3c6d1] w-full max-w-md shadow-2xl relative overflow-hidden animate-zoomIn max-h-[90vh] flex flex-col text-[#1b1c1c]">
            <div className="p-6 border-b border-[#efeded] flex justify-between items-center bg-[#fbf9f8]">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#ba1a1a]" />
                <h3 className="font-serif text-lg font-bold text-[#003466]">
                  Реєстрація служителя
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-full hover:bg-[#efeded] text-[#737781] hover:text-[#1b1c1c] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#ffe088] rounded-full flex items-center justify-center text-[#735c00] animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#003466]">Анкету надіслано!</h4>
                <p className="font-sans text-sm text-[#424750] max-w-xs">
                  Профіль лідера буде додано до каталогу після проходження швидкої перевірки та погодження.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-[#1b1c1c]">
                <div>
                  <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                    ПІБ служителя *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="наприклад, Олександр Петренко"
                    className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                      Категорія *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466] cursor-pointer"
                    >
                      <option value="pastor">Пастор</option>
                      <option value="youth">Молодіжне</option>
                      <option value="mercy">Милосердя</option>
                      <option value="education">Освіта</option>
                      <option value="music">Музика</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                      Посада / Статус *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Старший пастор"
                      className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                    Біографія / Досвід *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Розкажіть про духовний шлях, освіту та напрями активності..."
                    className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                      Електронна пошта *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="prowid@church.ua"
                      className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#003466]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                      Мобільний телефон *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+380 50 123 45 67"
                      className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#003466]"
                    />
                  </div>
                </div>

                {/* Social Networks Section */}
                <div className="border-t border-[#efeded] pt-3 space-y-3">
                  <span className="block text-xs font-bold text-[#735c00] uppercase tracking-wider">
                    Соціальні мережі (необов'язково)
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#424750] uppercase tracking-wider mb-1">
                        Telegram (@username або посилання)
                      </label>
                      <input
                        type="text"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        placeholder="@username"
                        className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#003466]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#424750] uppercase tracking-wider mb-1">
                        Facebook (посилання)
                      </label>
                      <input
                        type="url"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#003466]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#424750] uppercase tracking-wider mb-1">
                        Instagram (посилання)
                      </label>
                      <input
                        type="url"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#003466]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#424750] uppercase tracking-wider mb-1">
                        YouTube (посилання)
                      </label>
                      <input
                        type="url"
                        value={youtube}
                        onChange={(e) => setYoutube(e.target.value)}
                        placeholder="https://youtube.com/..."
                        className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#003466]"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#efeded] pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-[#c3c6d1] text-[#424750] hover:bg-[#fbf9f8] rounded text-xs font-semibold cursor-pointer"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#003466] hover:bg-[#1a4b84] text-white rounded text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    Подати профіль
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Minister Details Info Modal */}
      {selectedMinister && (
        <div className="fixed inset-0 bg-[#1b1c1c]/65 backdrop-blur-sm flex items-center justify-center z-[115] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#c3c6d1] w-full max-w-2xl shadow-2xl relative overflow-hidden animate-zoomIn max-h-[90vh] flex flex-col text-[#1b1c1c]">
            {/* Header with Close Button */}
            <div className="p-6 border-b border-[#efeded] flex justify-between items-center bg-[#fbf9f8]">
              <span className="px-3 py-1 bg-[#003466] text-white text-[10px] uppercase tracking-wider font-bold rounded">
                {selectedMinister.categoryNameUk}
              </span>
              <button
                onClick={() => setSelectedMinister(null)}
                className="p-1.5 rounded-full hover:bg-[#efeded] text-[#737781] hover:text-[#1b1c1c] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto flex-1 space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                {/* Photo */}
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#ffe088] bg-[#efeded] shrink-0 shadow-md">
                  <img
                    className="w-full h-full object-cover"
                    src={selectedMinister.photoUrl}
                    alt={selectedMinister.name}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Main Info */}
                <div className="space-y-3 flex-1">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#003466]">
                    {selectedMinister.name}
                  </h2>
                  <p className="font-sans text-xs font-semibold text-[#735c00] uppercase tracking-widest">
                    {selectedMinister.title}
                  </p>

                  {/* Social Networks Icons */}
                  <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start pt-2">
                    {selectedMinister.socials?.telegram && (
                      <a
                        href={selectedMinister.socials.telegram.startsWith('http') ? selectedMinister.socials.telegram : `https://t.me/${selectedMinister.socials.telegram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#efeded] hover:bg-[#0088cc]/10 text-gray-700 hover:text-[#0088cc] rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" /> Telegram
                      </a>
                    )}
                    {selectedMinister.socials?.facebook && (
                      <a
                        href={selectedMinister.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#efeded] hover:bg-[#1877f2]/10 text-gray-700 hover:text-[#1877f2] rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Facebook className="w-3.5 h-3.5" /> Facebook
                      </a>
                    )}
                    {selectedMinister.socials?.instagram && (
                      <a
                        href={selectedMinister.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#efeded] hover:bg-[#e1306c]/10 text-gray-700 hover:text-[#e1306c] rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Instagram className="w-3.5 h-3.5" /> Instagram
                      </a>
                    )}
                    {selectedMinister.socials?.youtube && (
                      <a
                        href={selectedMinister.socials.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#efeded] hover:bg-[#ff0000]/10 text-gray-700 hover:text-[#ff0000] rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Youtube className="w-3.5 h-3.5" /> YouTube
                      </a>
                    )}
                    {(!selectedMinister.socials || Object.keys(selectedMinister.socials).length === 0) && (
                      <span className="text-gray-400 text-xs italic">Соціальні мережі не вказані</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Biography Section */}
              <div className="space-y-2 border-t border-[#efeded]/80 pt-6">
                <h4 className="font-serif text-sm font-bold text-[#003466] uppercase tracking-wider">
                  Про служителя
                </h4>
                <p className="font-sans text-xs text-[#424750] leading-relaxed whitespace-pre-line">
                  {selectedMinister.bio}
                </p>
              </div>

              {/* Contact Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#efeded]/30 p-4 rounded-xl border border-[#c3c6d1]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#c3c6d1]/60">
                    <Mail className="w-4.5 h-4.5 text-[#003466]" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400">Електронна пошта</span>
                    {selectedMinister.email ? (
                      <a href={`mailto:${selectedMinister.email}`} className="text-xs font-semibold text-[#003466] hover:underline">
                        {selectedMinister.email}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-500">Не вказано</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#c3c6d1]/60">
                    <Phone className="w-4.5 h-4.5 text-[#003466]" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400">Мобільний телефон</span>
                    {selectedMinister.phone ? (
                      <a href={`tel:${selectedMinister.phone}`} className="text-xs font-semibold text-[#003466] hover:underline">
                        {selectedMinister.phone}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-500">Не вказано</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-[#efeded] flex gap-3 justify-end bg-[#fbf9f8]">
              <button
                onClick={() => setSelectedMinister(null)}
                className="px-5 py-2.5 border border-[#c3c6d1] text-gray-700 hover:bg-gray-100 rounded text-xs font-bold cursor-pointer transition-colors"
              >
                Закрити вікно
              </button>
              {selectedMinister.email && (
                <a
                  href={`mailto:${selectedMinister.email}?subject=Духовна розмова`}
                  className="px-6 py-2.5 bg-[#003466] hover:bg-[#1a4b84] text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-white text-white" />
                  Надіслати звернення
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
