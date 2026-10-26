import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Search,
  Share2,
  Lock,
  Menu,
  X,
  Youtube,
  CloudSun,
  Tv,
  FileText,
  PhoneCall,
  Flame,
  Radio,
} from 'lucide-react';
import { NewsCategory, SiteConfig } from '../types/news';

interface HeaderProps {
  currentCategory: NewsCategory | 'व्हिडिओ' | 'ई-पेपर' | 'संपर्क';
  onSelectCategory: (cat: NewsCategory | 'व्हिडिओ' | 'ई-पेपर' | 'संपर्क') => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenLiveTv: () => void;
  siteConfig: SiteConfig;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenAdmin,
  onOpenLiveTv,
  siteConfig,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      // Format in Marathi locale
      try {
        setCurrentDate(now.toLocaleDateString('mr-IN', options));
        setCurrentTime(
          now.toLocaleTimeString('mr-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })
        );
      } catch {
        setCurrentDate(now.toDateString());
        setCurrentTime(now.toLocaleTimeString());
      }
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const categories: (NewsCategory | 'व्हिडिओ' | 'ई-पेपर' | 'संपर्क')[] = [
    'सर्व',
    'महाराष्ट्र',
    'वाशिम',
    'अकोला',
    'विदर्भ',
    'देश',
    'राजकारण',
    'कृषी',
    'शिक्षण',
    'गुन्हेगारी',
    'क्रीडा',
    'मनोरंजन',
    'ई-पेपर',
    'व्हिडिओ',
    'संपर्क',
  ];

  const handleCategoryClick = (cat: NewsCategory | 'व्हिडिओ' | 'ई-पेपर' | 'संपर्क') => {
    onSelectCategory(cat);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      {/* 1. Top Mini Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Date, Time & Weather */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="flex items-center gap-1 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-red-400" />
              <span className="font-medium">{currentDate || '२६ ऑक्टोबर २०२६'}</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-400 border-l border-slate-700 pl-3">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentTime || '१०:३० AM'}</span>
            </span>
            <span className="hidden lg:flex items-center gap-1 text-slate-400 border-l border-slate-700 pl-3">
              <CloudSun className="w-3.5 h-3.5 text-amber-300" />
              <span>वाशिम: ३१°C उबदार</span>
            </span>
          </div>

          {/* Right: Quick actions, WhatsApp & Admin */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
            {/* Live TV Button */}
            <button
              onClick={onOpenLiveTv}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition animate-pulse"
              title="थेट प्रक्षेपण पहा"
            >
              <Radio className="w-3 h-3 text-white" />
              <span>थेट टीव्ही</span>
            </button>

            {/* E-Paper Quick Link */}
            <button
              onClick={() => handleCategoryClick('ई-पेपर')}
              className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-white transition px-2 py-0.5 rounded hover:bg-slate-800"
            >
              <FileText className="w-3 h-3 text-red-400" />
              <span>आजचा ई-पेपर</span>
            </button>

            {/* WhatsApp Community */}
            <a
              href={`https://wa.me/${siteConfig.contactWhatsapp}?text=${encodeURIComponent(
                'विचार लहरी न्यूज २४ च्या व्हॉट्सॲप ग्रुपमध्ये सामील करा.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded transition font-medium"
            >
              <Share2 className="w-3 h-3" />
              <span className="hidden xs:inline">व्हॉट्सॲप ग्रुप</span>
            </a>

            {/* Admin Login */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition px-2 py-0.5 rounded border border-slate-700 hover:border-amber-400/50"
              title="संपादक / ॲडमिन पॅनेल"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>ॲडमिन</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Channel Identity */}
          <div
            onClick={() => handleCategoryClick('सर्व')}
            className="cursor-pointer flex items-center gap-3 group select-none"
          >
            <div className="relative">
              {/* Channel badge box */}
              <div className="bg-gradient-to-br from-red-600 via-red-700 to-rose-900 text-white p-2 sm:p-2.5 rounded-lg shadow-md flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200 border-2 border-red-500">
                <span className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                  VL
                </span>
                <span className="ml-1 px-1 bg-amber-400 text-slate-900 text-[10px] sm:text-xs font-bold rounded">
                  24
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-marathi-title leading-tight">
                  <span className="text-red-700">विचार</span> <span className="text-blue-950">लहरी</span>
                </h1>
                <span className="bg-red-600 text-white text-xs sm:text-sm font-black px-1.5 py-0.5 rounded tracking-wider shadow-sm">
                  NEWS 24
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold tracking-wide flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                <span>{siteConfig.tagline}</span>
                <span className="hidden md:inline text-slate-400">|</span>
                <span className="hidden md:inline text-slate-500 text-xs font-normal">
                  वाशिम • अकोला • विदर्भ • महाराष्ट्र
                </span>
              </p>
            </div>
          </div>

          {/* YouTube Channel Promo Badge & Search (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={siteConfig.youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-red-50 hover:bg-red-100 border border-red-200 p-2 rounded-xl transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center shadow group-hover:scale-105 transition">
                <Youtube className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">आमचे यूट्यूब चॅनल</p>
                <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                  🔴 सबस्क्राईब करा • {siteConfig.youtubeSubscribersCount}
                </p>
              </div>
            </a>

            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm transition border border-slate-200 shadow-inner"
              title="बातमी शोधा"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>बातमी शोधा...</span>
              <kbd className="hidden xl:inline text-[10px] bg-white border border-slate-300 px-1.5 py-0.5 rounded text-slate-400">
                /
              </kbd>
            </button>
          </div>

          {/* Mobile Right Controls: Search button & Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-700 hover:text-red-600 rounded-lg bg-slate-100"
              aria-label="शोधा"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 hover:text-red-600 rounded-lg bg-slate-100 border border-slate-200"
              aria-label="मेनू"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar (Desktop & Tablet) */}
      <nav className="bg-blue-950 text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar scroll-smooth py-1">
            <div className="flex items-center space-x-1 sm:space-x-1.5 whitespace-nowrap text-sm font-semibold">
              {categories.map((cat) => {
                const isActive = currentCategory === cat;
                const isSpecial = cat === 'ई-पेपर' || cat === 'व्हिडिओ' || cat === 'कृषी';
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-3 py-2 rounded transition-all flex items-center gap-1.5 select-none ${
                      isActive
                        ? 'bg-red-600 text-white shadow font-bold'
                        : isSpecial
                        ? 'text-amber-300 hover:bg-blue-900/80 hover:text-white'
                        : 'text-slate-200 hover:bg-blue-900/60 hover:text-white'
                    }`}
                  >
                    {cat === 'ई-पेपर' && <FileText className="w-3.5 h-3.5 text-amber-300" />}
                    {cat === 'व्हिडिओ' && <Youtube className="w-3.5 h-3.5 text-red-400" />}
                    {cat === 'कृषी' && <Flame className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white border-b border-slate-800 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 space-y-3">
            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => {
                  onOpenLiveTv();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 py-2 rounded text-white text-sm font-bold"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>थेट टीव्ही (Live)</span>
              </button>
              <button
                onClick={() => handleCategoryClick('ई-पेपर')}
                className="flex items-center justify-center gap-1.5 bg-blue-800 hover:bg-blue-700 py-2 rounded text-white text-sm font-bold"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>ई-वृत्तपत्र</span>
              </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`py-2 px-2 rounded text-center truncate ${
                    currentCategory === cat
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mobile Footer Links */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <a
                href={siteConfig.youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-red-400 font-bold"
              >
                <Youtube className="w-4 h-4" />
                <span>यूट्यूब चॅनल</span>
              </a>
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1 text-amber-400 hover:underline"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>संपादक ॲडमिन</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
