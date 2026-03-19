import { Clock, Globe, Bell, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../pages/_app';
import { Language } from '../lib/i18n';

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40 transition-all duration-300">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 ml-8">
        {/* Clock */}
        <div className="flex items-center gap-2 text-slate-600">
          <Clock size={18} />
          <span className="font-mono text-sm font-semibold">{currentTime}</span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
          <Globe size={18} className="text-slate-600 ml-2" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent border-0 outline-none cursor-pointer font-medium text-sm px-2"
          >
            <option value="uz">O'z</option>
            <option value="en">Eng</option>
            <option value="ru">Rus</option>
          </select>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition-shadow">
          A
        </div>
      </div>
    </div>
  );
}
