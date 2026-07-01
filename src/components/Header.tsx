import React, { useState } from 'react';
import { Church, Search, Menu, X, PlusCircle } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onAddLocationClick: () => void;
  onSearch: (query: string) => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  onAddLocationClick,
  onSearch,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const navItems = [
    { id: 'map', label: 'Карта' },
    { id: 'ministers', label: 'Служителі' },
    { id: 'news', label: 'Новини' },
    { id: 'calendar', label: 'Календар' },
    { id: 'about', label: 'Про нас' },
    { id: 'admin', label: 'Адмінка' },
  ];

  return (
    <header className="bg-white/95 border-b border-[#c3c6d1] sticky top-0 w-full z-50 backdrop-blur-md transition-all duration-300">
      <div className="flex justify-between items-center px-4 md:px-16 h-20 w-full max-w-[1280px] mx-auto">
        {/* Logo */}
        <div
          onClick={() => setCurrentTab('map')}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="header-logo"
        >
          <div className="w-10 h-10 rounded-full bg-[#003466] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Church className="w-5.5 h-5.5" />
          </div>
          <div className="font-serif text-xl md:text-2xl font-bold text-[#003466] tracking-tight">
            Християнська карта
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = currentTab === item.id || (item.id === 'map' && currentTab === 'details');
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`font-sans text-sm font-semibold pb-1 border-b-2 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#003466] border-[#003466]'
                    : 'text-[#424750] border-transparent hover:text-[#003466]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Search bar toggle or input */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#f5f3f3] rounded-lg px-3 py-1.5 border border-[#c3c6d1] w-48 md:w-64 transition-all duration-300">
                <Search className="w-4 h-4 text-[#737781] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Пошук..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-transparent text-sm w-full focus:outline-none border-none p-0 text-[#1b1c1c]"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    onSearch('');
                  }}
                  className="text-[#737781] hover:text-[#003466] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#424750] hover:text-[#003466] rounded-full hover:bg-[#efeded] transition-colors cursor-pointer"
                title="Пошук"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Add Location Button */}
          <button
            onClick={onAddLocationClick}
            className="hidden md:flex items-center gap-2 bg-[#003466] text-white hover:bg-[#1a4b84] px-5 py-2.5 rounded font-sans text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Додати локацію
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#1b1c1c] hover:bg-[#efeded] rounded-lg transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#c3c6d1] bg-white px-6 py-4 space-y-4 animate-fadeIn">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left py-2 font-semibold text-base transition-colors ${
                  currentTab === item.id ? 'text-[#003466]' : 'text-[#424750] hover:text-[#003466]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onAddLocationClick();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 bg-[#003466] text-white px-4 py-3 rounded-lg font-semibold text-sm w-full justify-center transition-all mt-4 cursor-pointer"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              Додати локацію
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
