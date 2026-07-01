import { Church, Mail, Globe, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  return (
    <footer className="bg-[#efeded] border-t border-[#c3c6d1]">
      <div className="flex flex-col md:flex-row justify-between items-start py-12 px-6 md:px-16 w-full max-w-[1280px] mx-auto gap-8">
        <div className="flex flex-col gap-4">
          <div
            onClick={() => setCurrentTab('map')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#003466] flex items-center justify-center text-white">
              <Church className="w-4 h-4" />
            </div>
            <span className="font-serif text-lg font-bold text-[#1b1c1c]">Християнська карта</span>
          </div>
          <p className="font-sans text-sm text-[#424750] max-w-xs leading-relaxed">
            Простір єднання та співпраці для кожної християнської душі в Україні. Знаходьте можливості для духовного зростання та допомоги іншим.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 md:gap-16">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-xs font-bold text-[#003466] uppercase tracking-wider">
              Проект
            </span>
            <button
              onClick={() => setCurrentTab('about')}
              className="text-left font-sans text-xs text-[#424750] hover:underline hover:text-[#003466] transition-colors"
            >
              Про проєкт
            </button>
            <button
              onClick={() => setCurrentTab('map')}
              className="text-left font-sans text-xs text-[#424750] hover:underline hover:text-[#003466] transition-colors"
            >
              Карта служінь
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-sans text-xs font-bold text-[#003466] uppercase tracking-wider">
              Ресурси
            </span>
            <button
              onClick={() => setCurrentTab('news')}
              className="text-left font-sans text-xs text-[#424750] hover:underline hover:text-[#003466] transition-colors"
            >
              Новини та події
            </button>
            <button
              onClick={() => setCurrentTab('ministers')}
              className="text-left font-sans text-xs text-[#424750] hover:underline hover:text-[#003466] transition-colors"
            >
              Служителі
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-sans text-xs font-bold text-[#003466] uppercase tracking-wider">
              Контакти
            </span>
            <a
              href="mailto:info@ministry.ua"
              className="font-sans text-xs text-[#424750] hover:underline hover:text-[#003466] transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              info@ministry.ua
            </a>
            <span className="font-sans text-xs text-[#424750] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Україна
            </span>
          </div>
        </div>
      </div>

      <div className="py-6 px-6 md:px-16 w-full max-w-[1280px] mx-auto text-center border-t border-[#c3c6d1]/30 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-sans text-xs text-[#424750] opacity-80">
          © 2026 Християнська карта. Усі права захищено.
        </p>
        <p className="font-sans text-xs text-[#424750] opacity-80 flex items-center gap-1 justify-center">
          Зроблено з любов\'ю та вірою <Heart className="w-3 h-3 text-[#ba1a1a] fill-current" /> в Україні.
        </p>
      </div>
    </footer>
  );
}
