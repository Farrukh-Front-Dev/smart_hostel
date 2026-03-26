import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Home, Users, Calendar, Settings } from 'lucide-react';
import { getTranslation } from '../../../lib/i18n';
import { useLanguage } from '../../../pages/_app';
import SidebarToggle from './SidebarToggle';
import SidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation';
import SidebarProfile from './SidebarProfile';
import SidebarLogout from './SidebarLogout';

const getMenuItems = (t: (key: any) => string) => [
  { icon: Home, label: t('dashboard'), href: '/' },
  { icon: Users, label: t('students'), href: '/students' },
  { icon: Calendar, label: t('duties'), href: '/duties' },
  { icon: Settings, label: t('settings'), href: '/settings' },
];

export default function Sidebar() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof import('../../../lib/i18n').translations.uz) => getTranslation(language, key);
  const menuItems = getMenuItems(t);
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <SidebarToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-r-3xl border-r-4 border-gray-900 transition-transform flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 shadow-3d-lg`}
      >
        {/* Header */}
        <SidebarHeader onClose={() => setIsOpen(false)} />

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
