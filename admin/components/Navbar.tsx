import { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, Globe } from 'lucide-react';
import { useLanguage } from '../pages/_app';

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="lg:pl-0 bg-white dark:bg-dark-surface border-b-4 border-gray-900 sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Qidirish..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all font-medium"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Clock */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-xl border-2 border-gray-900 shadow-3d font-bold">
              <span>{time}</span>
            </div>

            {/* Language */}
            <button
              onClick={() => {
                const langs = ['uz', 'en', 'ru'];
                const currentIndex = langs.indexOf(language);
                const nextIndex = (currentIndex + 1) % langs.length;
                setLanguage(langs[nextIndex] as any);
              }}
              className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border-2 border-gray-900 hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Globe size={20} />
            </button>

            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border-2 border-gray-900 hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <button className="p-3 bg-accent-pink text-white rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-gray-900">
                3
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
