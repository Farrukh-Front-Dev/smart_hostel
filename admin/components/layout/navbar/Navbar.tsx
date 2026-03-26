import { useState, useEffect } from 'react';
import NavbarClock from './NavbarClock';
import NavbarLanguageSelector from './NavbarLanguageSelector';
import NavbarThemeToggle from './NavbarThemeToggle';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl'
        : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg shadow-md'
    } rounded-2xl border-2 border-white/40 dark:border-white/20 pointer-events-none lg:right-8`}>
      <div className="px-4 sm:px-6 py-2.5 sm:py-3 pointer-events-auto">
        <div className="flex items-center justify-end gap-2 sm:gap-2.5">
          {/* Clock */}
          <div className="pointer-events-auto">
            <NavbarClock />
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-white/30 dark:bg-white/20"></div>

          {/* Language Selector */}
          <div className="pointer-events-auto">
            <NavbarLanguageSelector />
          </div>

          {/* Dark Mode Toggle */}
          <div className="pointer-events-auto">
            <NavbarThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
