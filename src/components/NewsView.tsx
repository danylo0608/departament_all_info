import React, { useState } from 'react';
import { Newspaper, CalendarDays, MapPin, ChevronLeft, ChevronRight, X, Sparkles, CheckCircle, Send } from 'lucide-react';
import { NewsArticle, ChurchEvent } from '../types';

interface NewsViewProps {
  news: NewsArticle[];
  events: ChurchEvent[];
  onAddNews: (article: Omit<NewsArticle, 'id'>) => void;
}

export default function NewsView({ news, events, onAddNews }: NewsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  
  // Suggest news modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Громади');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(false);

  // Filter articles
  const categories = ['Всі', 'Конференції', 'Громади', 'Освіта', 'Місія'];
  const filteredNews = news.filter((item) => {
    if (selectedCategory === 'Всі') return true;
    return item.category === selectedCategory || (selectedCategory === 'Місія' && item.category === 'Громади');
  });

  // Featured article (first item or most relevant)
  const featuredArticle = news[0];
  const secondaryArticles = filteredNews.filter((item) => item.id !== featuredArticle?.id);

  const handleSubmitNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !content) {
      alert('Будь ласка, заповніть усі необхідні поля.');
      return;
    }

    const today = new Date();
    const formattedDate = `${today.getDate()} ${today.toLocaleString('uk-UA', { month: 'long' })}, 2026`;
    
    // Placeholder image
    const imageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0QRwkbGZaLnR2IEthLO-PwT_UwCNZsJT_f8yN1sf46n5p2iL8E-SMxmEYFjNL4NpbAbB_cdyscdl2kBD7TP5FaZz0r1__DAWiuh7y4NTz73KI1a3ywi8KW8UeG8A5c2XCGMHwuASVIB9NvRoVnxOcdCQ76vb6vdTnQ4QPVsAs3V_ytFWAIX0Zp5IrckOiS1-VtZI0xJPW1Ya4PVmZqjEUC4JP_bPflG0ObIKIfTTcUEWQ3QB3gwUM9GqAAHbPnDx1qharVwdtPQn6';

    onAddNews({
      title,
      date: formattedDate,
      category,
      description,
      imageUrl,
      content,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setTitle('');
      setDescription('');
      setContent('');
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-16 py-12 text-[#1b1c1c]">
      
      {/* Hero Header with church background */}
      <section className="relative h-[320px] md:h-[400px] flex items-center overflow-hidden rounded-2xl border border-[#c3c6d1]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0QRwkbGZaLnR2IEthLO-PwT_UwCNZsJT_f8yN1sf46n5p2iL8E-SMxmEYFjNL4NpbAbB_cdyscdl2kBD7TP5FaZz0r1__DAWiuh7y4NTz73KI1a3ywi8KW8UeG8A5c2XCGMHwuASVIB9NvRoVnxOcdCQ76vb6vdTnQ4QPVsAs3V_ytFWAIX0Zp5IrckOiS1-VtZI0xJPW1Ya4PVmZqjEUC4JP_bPflG0ObIKIfTTcUEWQ3QB3gwUM9GqAAHbPnDx1qharVwdtPQn6"
            alt="Християнське життя"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
        </div>
        <div className="relative z-10 px-8 md:px-16 w-full max-w-[1280px]">
          <div className="max-w-xl space-y-4">
            <span className="inline-block py-1 px-3 bg-[#fed65b] text-[#745c00] font-sans text-xs font-bold rounded">
              Спільнота та події
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#003466]">
              Новини та майбутні події
            </h1>
            <p className="font-sans text-sm text-[#424750] leading-relaxed">
              Залишайтеся на зв\'язку з духовним життям нашої країни. Свіжі новини громад, анонси конференцій та соціальні ініціативи християн.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="px-4 md:px-16 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: News Listing */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#c3c6d1]/30 pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#003466]">Останні новини</h2>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold border transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#003466] text-white border-[#003466]'
                      : 'bg-white text-[#424750] border-[#c3c6d1] hover:bg-[#efeded]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Article Card */}
          {selectedCategory === 'Всі' && featuredArticle && (
            <article
              onClick={() => setSelectedArticle(featuredArticle)}
              className="group cursor-pointer bg-white border border-[#c3c6d1] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#fed65b]">
                    {featuredArticle.category} • {featuredArticle.date}
                  </span>
                  <h3 className="font-serif text-lg md:text-2xl font-bold leading-tight group-hover:underline">
                    {featuredArticle.title}
                  </h3>
                  <p className="font-sans text-xs text-gray-200 line-clamp-2 max-w-2xl leading-relaxed">
                    {featuredArticle.description}
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* Secondary News Listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {secondaryArticles.map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedArticle(item)}
                className="flex flex-col gap-4 group cursor-pointer bg-white border border-[#c3c6d1]/65 p-4 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="overflow-hidden rounded-lg aspect-video bg-[#efeded]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                  />
                </div>
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#735c00]">
                      {item.category} • {item.date}
                    </span>
                    <h4 className="font-serif text-md font-bold text-[#1b1c1c] leading-tight group-hover:text-[#003466] transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="font-sans text-xs text-[#424750] leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#003466] hover:underline flex items-center gap-1 mt-2">
                    Читати повністю →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right: Interactive Events Calendar Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Calendar Box */}
          <div className="bg-[#f5f3f3] rounded-xl border border-[#c3c6d1] p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#c3c6d1]/45">
              <h3 className="font-serif text-md font-bold text-[#003466]">Червень 2026</h3>
              <div className="flex gap-2 text-[#737781]">
                <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-[#003466]" />
                <ChevronRight className="w-4 h-4 cursor-pointer hover:text-[#003466]" />
              </div>
            </div>

            {/* Custom Interactive Calendar layout */}
            <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center text-xs">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((day) => (
                <span key={day} className="text-[#737781] font-bold text-[10px] uppercase">
                  {day}
                </span>
              ))}
              
              {/* Previous month days */}
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={`prev-${i}`} className="text-[#c3c6d1] py-1">
                  {27 + i}
                </span>
              ))}

              {/* Current month days */}
              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                const isToday = dayNum === 12;
                const hasEvent = dayNum === 15 || dayNum === 22 || dayNum === 29;

                return (
                  <span
                    key={`day-${dayNum}`}
                    className={`py-1 rounded-full font-semibold relative flex items-center justify-center text-xs ${
                      isToday
                        ? 'bg-[#003466] text-white font-bold'
                        : 'text-[#1b1c1c]'
                    }`}
                  >
                    {dayNum}
                    {hasEvent && (
                      <span className="absolute bottom-0 w-1 h-1 bg-[#735c00] rounded-full" />
                    )}
                  </span>
                );
              })}
            </div>

            {/* Upcoming Events List */}
            <div className="space-y-4">
              <h4 className="font-sans text-xs font-bold text-[#003466] uppercase tracking-wider border-b border-[#c3c6d1]/30 pb-1.5">
                Найближчі події
              </h4>
              
              <div className="space-y-3.5">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex gap-3.5 items-start p-2 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center min-w-[46px] h-11 bg-white rounded border border-[#c3c6d1] text-center">
                      <span className="text-xs font-bold text-[#003466] leading-none">
                        {evt.day}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-[#737781]">
                        {evt.month}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-bold text-[#1b1c1c] leading-tight">
                        {evt.title}
                      </h5>
                      <p className="text-[11px] text-[#424750] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#735c00]" />
                        {evt.location}
                      </p>
                      <p className="text-[10px] text-[#737781] leading-relaxed line-clamp-2 pt-0.5">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Banner to propose a news item */}
          <div className="bg-[#003466] rounded-xl text-white p-6 text-center space-y-4 shadow-sm border border-[#1a4b84]">
            <Sparkles className="w-8 h-8 text-[#fed65b] mx-auto animate-pulse" />
            <h4 className="font-serif text-md font-bold leading-snug">
              Діліться життям своєї громади
            </h4>
            <p className="font-sans text-xs text-[#93bcfc] leading-relaxed">
              Надсилайте новини, анонси зустрічей чи звіти про волонтерську діяльність у вашому місті.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2.5 bg-[#735c00] text-white hover:bg-[#ffe088] hover:text-[#574500] rounded font-sans text-xs font-bold transition-all cursor-pointer"
            >
              Запропонувати новину
            </button>
          </div>
        </aside>
      </section>

      {/* Suggest News Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1b1c1c]/55 backdrop-blur-sm flex items-center justify-center z-[110] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#c3c6d1] w-full max-w-lg shadow-2xl relative overflow-hidden animate-zoomIn max-h-[90vh] flex flex-col text-[#1b1c1c]">
            <div className="p-6 border-b border-[#efeded] flex justify-between items-center bg-[#fbf9f8]">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5.5 h-5.5 text-[#003466]" />
                <h3 className="font-serif text-lg font-bold text-[#003466]">
                  Запропонувати новину
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#efeded] text-[#737781] hover:text-[#1b1c1c] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#d5e3ff] rounded-full flex items-center justify-center text-[#003466] animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#003466]">Новину надіслано!</h4>
                <p className="font-sans text-sm text-[#424750] max-w-xs">
                  Вашу новину успішно надіслано на премодерацію. Вона з\'явиться на сайті після схвалення редактором.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitNews} className="p-6 space-y-4 overflow-y-auto flex-1 text-[#1b1c1c]">
                <div>
                  <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                    Заголовок статті *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="наприклад, Волонтерська зустріч у Києві..."
                    className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                    Категорія *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466] cursor-pointer"
                  >
                    <option value="Конференції">Конференції</option>
                    <option value="Громади">Громади</option>
                    <option value="Освіта">Освіта</option>
                    <option value="Місія">Місія / Соціальне</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                    Короткий опис *
                  </label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Короткий лід-абзац, що пояснює суть новини..."
                    className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                    Повний текст статті *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Напишіть детально про подію, цитати учасників та висновки..."
                    className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466]"
                  />
                </div>

                <div className="border-t border-[#efeded] pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-[#c3c6d1] text-[#424750] hover:bg-[#fbf9f8] rounded text-xs font-semibold cursor-pointer"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#003466] hover:bg-[#1a4b84] text-white rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Надіслати
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Expanded Article Modal Popup */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-[#1b1c1c]/60 backdrop-blur-xs flex items-center justify-center z-[120] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#c3c6d1] w-full max-w-2xl shadow-2xl relative overflow-hidden animate-zoomIn max-h-[90vh] flex flex-col text-[#1b1c1c]">
            {/* Cover image header */}
            <div className="relative h-60 md:h-80 bg-[#efeded] shrink-0">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/45 hover:bg-black/70 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#fed65b]">
                  {selectedArticle.category} • {selectedArticle.date}
                </span>
                <h3 className="font-serif text-lg md:text-xl font-bold leading-tight">
                  {selectedArticle.title}
                </h3>
              </div>
            </div>

            {/* Scrollable contents */}
            <div className="p-6 md:p-8 space-y-4 overflow-y-auto flex-1">
              <p className="font-sans text-xs font-semibold text-[#735c00] border-l-3 border-[#735c00] pl-3 leading-relaxed">
                {selectedArticle.description}
              </p>
              <div className="font-sans text-sm text-[#424750] leading-relaxed space-y-3 pt-2">
                <p>{selectedArticle.content}</p>
                <p className="text-xs text-[#737781] italic">
                  *Думки та звіти надані представниками християнської спільноти України. Матеріал опубліковано у прес-службі «Християнська карта».
                </p>
              </div>
            </div>

            {/* Modal footer action */}
            <div className="p-4 border-t border-[#efeded] flex justify-end bg-[#fbf9f8]">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2 bg-[#003466] hover:bg-[#1a4b84] text-white rounded text-xs font-semibold cursor-pointer shadow-sm"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
