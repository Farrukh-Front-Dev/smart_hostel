import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Home, Users, Calendar, Settings } from 'lucide-react';
import { getTranslation } from '../../../lib/i18n';
import { useLanguage } from '../../../pages/_app';
import { useSidebar } from '../../../lib/context/SidebarContext';
import SidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation';
import SidebarProfile from './SidebarProfile';
import SidebarLogout from './SidebarLogout';

const getMenuItems = (t: (key: any) => string) => [
  { icon: Home, label: t('dashboard'), href: '/' },
  { icon: Users, label: t('students'), href: '/peers' },
  { icon: Calendar, label: t('duties'), href: '/duties' },
  { icon: Settings, label: t('settings'), href: '/settings' },
];

export default function Sidebar() {
  const router = useRouter();
  const { language } = useLanguage();
  const { isOpen, setIsOpen } = useSidebar();
  const t = (key: keyof typeof import('../../../lib/i18n').translations.uz) => getTranslation(language, key);
  const menuItems = getMenuItems(t);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    setCurrentUser(user || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const handleMenuItemClick = () => {
    // Don't close on desktop
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Toggle Button - Visible when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 sm:p-4 bg-gradient-primary text-black dark:text-black rounded-2xl border-2 border-gray-900 shadow-3d hover:shadow-3d-lg hover:-translate-y-1 transition-all"
          title="Sidebarni ochish"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-r-3xl border-r-4 border-gray-900 transition-all flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-3d-lg`}
      >
        {/* Header */}
        <SidebarHeader onClose={() => setIsOpen(false)} onToggle={() => setIsOpen(false)} isOpen={isOpen} />

        {/* Navigation */}
        <SidebarNavigation items={menuItems} onItemClick={handleMenuItemClick} />

        {/* Footer */}
        <div className="p-4 space-y-3">
          <SidebarProfile username={currentUser} />
          <SidebarLogout onClick={handleLogout} />
        </div>
      </aside>
    </>
  );
}
