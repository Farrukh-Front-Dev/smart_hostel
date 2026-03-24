import { useState, useEffect } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { useLanguage, useTheme } from '../pages/_app';

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const { isDark, setIsDark } = useTheme();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getLanguageName = () => {
    const names: { [key: string]: string } = {
      uz: 'O\'z',
      en: 'Eng',
      ru: 'Rus'
    };
    return names[language] || 'O\'z';
  };

  return (
    <header className="lg:pl-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b-4 border-gray-900 sticky top-0 z-20 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          {/* Clock */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 border-gray-900 shadow-3d font-bold text-sm">
            <span className="text-xs">🕐</span>
            <span>{time}</span>
          </div>

          {/* Language Selector */}
          <div className="relative group">
            <button
              onClick={() => {
                const langs = ['uz', 'en', 'ru'];
                const currentIndex = langs.indexOf(language);
                const nextIndex = (currentIndex + 1) % langs.length;
                setLanguage(langs[nextIndex] as any);
              }}
              className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 border-gray-900 hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold text-xs sm:text-sm"
              title="Tilni o'zgartirish"
            >
              <Globe size={18} className="sm:w-5 sm:h-5" />
            </button>
            <div className="absolute right-0 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {getLanguageName()}
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="relative group">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 border-gray-900 hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={18} className="sm:w-5 sm:h-5" /> : <Moon size={18} className="sm:w-5 sm:h-5" />}
            </button>
            <div className="absolute right-0 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {isDark ? 'Light' : 'Dark'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
