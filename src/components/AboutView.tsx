import { Heart, Globe, Award, Shield, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onExploreMapClick: () => void;
}

export default function AboutView({ onExploreMapClick }: AboutViewProps) {
  const stats = [
    { value: '450+', label: 'Локацій на карті' },
    { value: '120', label: 'Громад та хабів' },
    { value: '15k', label: 'Активних волонтерів' },
    { value: '24/7', label: 'Духовна підтримка' },
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6 text-[#ba1a1a]" />,
      title: 'Християнське милосердя',
      desc: 'Надаємо практичну підтримку переселенцям, малозабезпеченим сім\'ям та одиноким літнім людям.',
    },
    {
      icon: <Globe className="w-6 h-6 text-[#003466]" />,
      title: 'Міжконфесійна єдність',
      desc: 'Об\'єднуємо християнські громади України задля спільної молитви, гуманітарних місій та праці.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#735c00]" />,
      title: 'Якісна християнська освіта',
      desc: 'Допомагаємо молодим лідерам здобути корисні теологічні знання та лідерські інструменти.',
    },
    {
      icon: <Shield className="w-6 h-6 text-[#144780]" />,
      title: 'Духовна фортеця',
      desc: 'Створюємо у кожному куточку України осередки духовної реабілітації та дружнього плеча.',
    },
  ];

  return (
    <div className="space-y-20 py-12 text-[#1b1c1c]">
      {/* Hero Intro */}
      <section className="px-4 md:px-16 max-w-[1280px] mx-auto grid md:grid-cols-2 items-center gap-16">
        <div className="space-y-6">
          <span className="bg-[#d5e3ff] text-[#144780] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
            Про проєкт
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#003466] leading-tight">
            Єднаємо християнські серця через спільне служіння
          </h1>
          <p className="font-sans text-base text-[#424750] leading-relaxed max-w-lg">
            Наша місія — надати зручний простір для взаємодії та синергії християнських громад в Україні. Ми прагнемо допомогти кожній людині знайти можливості для волонтерства, навчання, соціальної та духовної підтримки у своєму місті.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onExploreMapClick}
              className="bg-[#003466] text-white px-8 py-3.5 rounded font-sans text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
            >
              Переглянути карту
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cinematic Illustration card */}
        <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg group border border-[#c3c6d1]/50">
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            alt="Християнська спільнота"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDStKYYSpEHUcPrGYHRUIA1Vb67PPbq_1h8ZacDMP4c-zzhwRs47XitGfiO81FCZZHBjZ0p2E3XDGP6PLyxLJhscWrGQinz-CZ2bDvRKAARIuWTpIS6_xiKr0kkdfs5Z3qajiykNbUZSrgEtCfymSJridaaUlKZcuSNS3a6ElIrzmGx1-2K6WYvKtNrH8-78LwlMYMCFex-1T_ZU8dhtEj6jW3-KGUAB17mDls7PztBkvfeMKxJ6Ct2WTwJ2dnezo-EexiFcSVVynpz"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003466]/40 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Core values block */}
      <section className="bg-white py-16 border-y border-[#c3c6d1]/50">
        <div className="px-4 md:px-16 max-w-[1280px] mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[#735c00] font-sans text-xs font-bold uppercase tracking-widest">
              Наші орієнтири
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#003466]">
              Цінності, що рухають нами
            </h2>
            <p className="font-sans text-xs text-[#737781]">
              Ми віримо, що щире служіння іншим — це найвища форма прояву християнської віри.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="bg-[#fbf9f8] p-6 rounded-xl border border-[#c3c6d1] flex flex-col justify-between group hover:border-[#003466] transition-colors duration-300 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-[#c3c6d1]/60 group-hover:bg-[#d5e3ff]/30 transition-colors shadow-xs">
                    {v.icon}
                  </div>
                  <h4 className="font-serif text-md font-bold text-[#1b1c1c] group-hover:text-[#003466] transition-colors">
                    {v.title}
                  </h4>
                  <p className="font-sans text-xs text-[#424750] leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section with dark blue branding */}
      <section className="bg-[#003466] py-16 text-white text-center">
        <div className="px-4 md:px-16 max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-2">
              <div className="font-serif text-4xl md:text-5xl font-bold text-[#fed65b] tracking-tight">
                {s.value}
              </div>
              <div className="font-sans text-xs font-semibold text-[#93bcfc] uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
