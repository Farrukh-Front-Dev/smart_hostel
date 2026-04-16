import { useState, useEffect } from 'react';
import { Calendar, LogIn } from 'lucide-react';
import { useRouter } from 'next/router';
import NavbarClock from './NavbarClock';
import NavbarLanguageSelector from './NavbarLanguageSelector';
import NavbarThemeToggle from './NavbarThemeToggle';
import { getTranslation, Language } from '../../../lib/i18n';

interface BoardNavbarProps {
  selectedDate: Date;
  isToday: boolean;
  isTomorrow: boolean;
  formatDate: (date: Date) => string;
  language: Language;
}

export default function BoardNavbar({ selectedDate, isToday, isTomorrow, formatDate, language }: BoardNavbarProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const t = (key: string) => getTranslation(language, key as any);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const getDateLabel = () => {
    if (isToday) return t('today');
    if (isTomorrow) return t('tomorrow');
    return formatDate(selectedDate);
  };

  return (
    <header className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl'
        : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg shadow-md'
    } rounded-2xl border-2 border-white/40 dark:border-white/20 lg:left-8 lg:right-8`}>
      <div className="px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Title (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
              <Calendar size={16} className="sm:w-5 sm:h-5 text-black" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                {t('dutySchedule')}
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
                {getDateLabel()}
              </p>
            </div>
          </div>

          {/* Mobile: Just Icon */}
          <div className="flex sm:hidden items-center">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
              <Calendar size={16} className="text-black" />
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Clock */}
            <div>
              <NavbarClock />
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-white/30 dark:bg-white/20"></div>

            {/* Language Selector */}
            <div>
              <NavbarLanguageSelector />
            </div>

            {/* Dark Mode Toggle */}
            <div>
              <NavbarThemeToggle />
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-white/30 dark:bg-white/20"></div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-primary text-black rounded-lg font-bold text-xs sm:text-sm border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              <LogIn size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('login')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
