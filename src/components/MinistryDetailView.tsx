import React, { useState } from 'react';
import { ChevronLeft, Calendar, User, Mail, Phone, MapPin, Check, HeartHandshake, ShieldCheck, HelpCircle, Facebook, Instagram, Send, Youtube } from 'lucide-react';
import { MinistryLocation } from '../types';

interface MinistryDetailViewProps {
  location: MinistryLocation;
  onBackToMap: () => void;
}

export default function MinistryDetailView({ location, onBackToMap }: MinistryDetailViewProps) {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !nameInput) {
      alert('Будь ласка, введіть ваше ім\'я та email.');
      return;
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setEmailInput('');
      setNameInput('');
    }, 4000);
  };

  const schedule = location.meetingsSchedule || [
    { day: 'Понеділок', title: 'Молитовна зустріч', time: '19:00' },
    { day: 'Середа', title: 'Вивчення Писання', time: '18:30' },
    { day: 'Субота', title: 'Волонтерський виїзд', time: '10:00' }
  ];

  const gallery = location.galleryImages || [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBGi2LL_M3zd2wqMSJOJopS8sb9CE5mNoAhySQyagbFkTziE6i4qiCGXkgfNXocttDt0fMJCws3whgdsJuBWV2YU9QrohRde3OElp7UPrjr6xpAF7nKrHnY_iYraStWRJhhuDNzbysarX2tKIFMKtPVmJbiKQpXjg47fO7n7Me4V1gbWO-NYzMcw9m22h-Efa-dde_3YS0wcowtF929EmhAuftxtrpns8NRB_DG0hIuQKuEBKiVT-X8mfm3GbqwdaBgrYJD9pQ-xlHx',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD9XKzhE6N_gIZ651MQc9XACyZqF70aQDGREAbqcISO66l5DVf20n-pD1ga_DxxS-zc679xS9x_Ksk4h3bzcJSeMVMcRtBHVeRfxq-mHCPsV5PzQGvvh6J04DP9INp29OJPHWfuS4LlnrUMK_2TiESZ0p67ragXDdVG3PaVV8t7nEp8-RPLsmj0Wmc8VfVxRiA0xcr_653fP29ZvGe0G6M0_mPeO8QZBS-FIgA7ZrzXOU1Cv4IDrO7E_Zr-5iRny94FdjB4VDkoSPLE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDWYLdyyyCcfZnQjOI-R_AfimyxrV65IpvI2eFnoSi5qx4zM2Nd6ays28lajgCRozb-ppDV8pzpOqbVobwp5d5LHuRW_z9XzWIuFKcygbgIBkbcOnUmmEOjY0Ai7y0fXn-EdpXZ_rXDnAYIj1jqylS2SqMBbBwxesZVQFDVzLlcgUcSNhOIx2l0FoZ_J-yX9kVQ3yCUWNSqxPgzRyKr_GsaREvbzFYt3PsYqwxZc5rk34mCxyu8urAJ2jSi6itVdZX2K6kd8reBtQIK',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAMv80L0ve4yoNwfdS8splpVjvAzRG_dYCgDpTypIciEfM2pjx0BtdXzEwyyOOyZOwdW2bkvH3czrvuBti0jNV2y5y7sbOITMUuFI2_9MkHGMEbi7-c9dh3l5EYUxA6ZD5CgCPtXF-pZhrUutCCmWP2Iu1TemJ4k_qT7xInsBC8CQMjbxeZwyOHHW-v7F9IRIXYvaFjQ5yHRDOdYfDphQTyR1R1To0snhCW1_VWz9deNKfN98okstlwTP-OXT0DWmhWmVa-1hmmEO7-',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA-b35fYQoTl_6jNtZcaF_yQZm0D-yaDhHITL27iBo476WmblI6rMsu3st5a1a6UvZNdBpu0hXPnrSgZAvdYgNCDv6-9CDxHZqgf4RvgmvdbHnw3BiJPfsk0tjNlJdGM7u7FoFmh-29YbIPGhkskHA1pKuDtwlHltl-Hgzhds_UUwtuV5WthM5Exg6GFZnvzUT-38SgrUavCQF_FXFl1SYOXW3voC0GxYD3kwwkDKUbJYalRIIfMymzXW4nE8v_CkwwzFNAkp-M2xwG'
  ];

  return (
    <div className="space-y-12 pb-20 text-[#1b1c1c]">
      
      {/* Back navigation button row */}
      <div className="px-4 md:px-16 max-w-[1280px] mx-auto pt-6">
        <button
          onClick={onBackToMap}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#003466] hover:text-[#735c00] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад до карти
        </button>
      </div>

      {/* Hero Header with golden hills landscape background */}
      <section className="relative h-[360px] md:h-[480px] flex items-end overflow-hidden rounded-2xl border border-[#c3c6d1] mx-4 md:mx-16 max-w-[1280px] md:mx-auto">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuUFubWWW2MNwAjqYN70bUraqb0uRbX_iiqhD-tDKvSMLvBUkzzKUs-R199TP6_rFWXne-H1HeFuy1yBSyHU808SvTCIw3K6a_OoEk7-2k5cn2x1FBz4JnsOdy3AxVwVdJC4Q2UhVT-ZSTWg6bBDiuH_FvqChJYEVAiHAYu8--pS0O1uLtYlotMMOXu-lWfI0uXDZM51k0bT-t6rDetMnGf56i4msAsxUFe_5BiaSKhD5d6GEqbTL405viiTbtHJWv9ZyMWje4coHK"
            alt={location.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        </div>
        <div className="relative z-10 p-6 md:p-10 w-full">
          <div className="max-w-3xl space-y-3">
            <span className="inline-block px-3 py-1 bg-[#fed65b] text-[#745c00] font-sans text-xs font-bold rounded">
              Служіння • {location.typeNameUk}
            </span>
            <h1 className="font-serif text-2xl md:text-4xl font-bold text-[#003466] leading-tight">
              {location.name}
            </h1>
            <p className="font-sans text-xs md:text-sm text-[#424750] max-w-2xl leading-relaxed">
              {location.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Bento Grid */}
      <section className="px-4 md:px-16 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Mission & Gallery */}
        <div className="md:col-span-8 space-y-10">
          
          {/* Mission detailed panel */}
          <div className="bg-white p-6 md:p-10 border border-[#c3c6d1] rounded-xl space-y-6 shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-[#003466]">Наша місія та діяльність</h2>
            <div className="space-y-4 text-xs md:text-sm text-[#424750] leading-relaxed">
              <p>
                {location.detailedMission || 'Наше служіння спрямоване на надання практичної християнської допомоги, створення осередків підтримки, спільне поклоніння та допомогу сім\'ям і молоді у нашому регіоні.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-[#d5e3ff] flex items-center justify-center text-[#003466]">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-xs font-bold text-[#003466]">Духовна опіка</h4>
                    <p className="text-[11px] leading-snug">Групи вивчення Писання, спільна молитва та взаємопідтримка.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-[#fed65b]/45 flex items-center justify-center text-[#745c00]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-xs font-bold text-[#003466]">Надійний осередок</h4>
                    <p className="text-[11px] leading-snug">Дружня й безпечна атмосфера спілкування для підлітків та сімей.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Gallery */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="font-serif text-xl font-bold text-[#003466]">Галерея служіння</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl aspect-square border border-[#c3c6d1]/45 hover:shadow-md transition-shadow group relative bg-[#efeded]"
                >
                  <img
                    src={img}
                    alt="Фото служіння"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Schedule & Contacts */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Schedule Card */}
          <div className="bg-[#f5f3f3] p-6 border border-[#c3c6d1] rounded-xl space-y-6 shadow-xs">
            <h3 className="font-serif text-md font-bold text-[#003466] flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5" />
              Графік зустрічей
            </h3>
            
            <ul className="space-y-3 text-xs">
              {schedule.map((sch, index) => (
                <li key={index} className="flex justify-between items-start pb-3 border-b border-[#c3c6d1]/20 last:border-0 last:pb-0">
                  <div>
                    <span className="block font-bold text-[#003466]">{sch.day}</span>
                    <span className="text-[11px] text-[#424750]">{sch.title}</span>
                  </div>
                  <span className="font-semibold text-[#1b1c1c] bg-white px-2 py-0.5 rounded border border-[#c3c6d1]/40 shrink-0">
                    {sch.time}
                  </span>
                </li>
              ))}
            </ul>

            {/* Coordinator Info */}
            <div className="pt-4 border-t border-[#c3c6d1]/30">
              <h4 className="text-[10px] uppercase tracking-wider font-bold text-[#737781] mb-3">
                Відповідальний координатор
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#c3c6d1] bg-[#efeded] shrink-0">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1Z8XTYXCsTXbbIcxso7byo0bRgCAmCGI3ubdv1PZbHIsk1LSrXwCzxNl3uoKkAddJHkAldYQQcwFw5fZIzphqns9NZt9LAItXzvoq7ecgvRigZnBghhIcMySLaQBtNdcVG6TSHxdSZvPHsH42UTMuFk6Vqs1Xa6BSi3FjVWaIdqZrNylaglh2GP4whsqGLQgZRmQ6dFViL4hWKVlXxu1RObeX2N4i4w_coGRkkWeP6idNfcEFzRZvFIWF5QpTrVM9VVMJLOudLz4v"
                    alt={location.responsiblePerson}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="block font-bold text-xs text-[#003466]">
                    {location.responsiblePerson}
                  </span>
                  <span className="text-[10px] text-[#424750]">
                    Координатор програм
                  </span>
                </div>
              </div>
            </div>

            {/* Volunteering join form */}
            <div className="pt-4 border-t border-[#c3c6d1]/30 space-y-3">
              {isSubmitted ? (
                <div className="p-3 bg-[#d5e3ff] rounded border border-[#a6c8ff] text-center space-y-1.5 animate-fadeIn">
                  <Check className="w-5 h-5 text-[#144780] mx-auto" />
                  <span className="block text-xs font-bold text-[#144780]">Запит надіслано!</span>
                  <span className="block text-[10px] text-[#144780]">
                    Дякуємо, координатор зв\'яжеться з вами найближчим часом.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleJoinSubmit} className="space-y-2.5">
                  <span className="block text-[11px] font-bold text-[#003466] uppercase tracking-wider text-center">
                    Бажаєте долучитись як волонтер?
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ваше ім'я"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-white border border-[#c3c6d1] rounded px-3 py-1.5 text-xs text-[#1b1c1c] focus:outline-none focus:ring-1 focus:ring-[#003466]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Ваш email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-white border border-[#c3c6d1] rounded px-3 py-1.5 text-xs text-[#1b1c1c] focus:outline-none focus:ring-1 focus:ring-[#003466]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#003466] hover:bg-[#1a4b84] text-white text-xs font-bold rounded shadow-sm transition-all cursor-pointer"
                  >
                    Долучитися до служіння
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Contacts details card */}
          <div className="bg-white p-6 border border-[#c3c6d1] rounded-xl space-y-4 shadow-xs">
            <h4 className="font-serif text-sm font-bold text-[#003466]">Контакти та зв'язок</h4>
            <div className="space-y-3 text-xs text-[#424750]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#735c00] shrink-0 mt-0.5" />
                <span>{location.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#735c00] shrink-0" />
                <a href={`mailto:${location.email}`} className="hover:underline break-all">
                  {location.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#735c00] shrink-0" />
                <a href={`tel:${location.phone}`} className="hover:underline">
                  {location.phone}
                </a>
              </div>
            </div>

            {location.socials && Object.values(location.socials).some(Boolean) && (
              <div className="pt-3 border-t border-gray-100">
                <span className="block text-[10px] uppercase font-bold text-gray-400 mb-2.5">Соціальні мережі</span>
                <div className="flex flex-wrap gap-2 text-gray-500">
                  {location.socials.telegram && (
                    <a
                      href={location.socials.telegram.startsWith('http') ? location.socials.telegram : `https://t.me/${location.socials.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-gray-50 hover:bg-[#0088cc]/10 hover:text-[#0088cc] transition-colors"
                      title="Telegram"
                    >
                      <Send className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {location.socials.facebook && (
                    <a
                      href={location.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-gray-50 hover:bg-[#1877f2]/10 hover:text-[#1877f2] transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {location.socials.instagram && (
                    <a
                      href={location.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-gray-50 hover:bg-[#e1306c]/10 hover:text-[#e1306c] transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {location.socials.youtube && (
                    <a
                      href={location.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-gray-50 hover:bg-[#ff0000]/10 hover:text-[#ff0000] transition-colors"
                      title="YouTube"
                    >
                      <Youtube className="w-4.5 h-4.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
