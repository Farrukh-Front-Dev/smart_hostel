import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Users, Calendar, Settings, Menu, X, LogOut, User, Zap } from 'lucide-react';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from '../pages/_app';

const getMenuItems = (t: (key: any) => string) => [
  { icon: Home, label: t('dashboard'), href: '/' },
  { icon: Users, label: t('students'), href: '/students' },
  { icon: Calendar, label: t('duties'), href: '/duties' },
  { icon: Settings, label: t('settings'), href: '/settings' },
];

export default function Sidebar() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof import('../lib/i18n').translations.uz) => getTranslation(language, key);
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

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-primary text-white rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r-4 border-gray-900 transition-transform flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo Section - 3D Design */}
        <div className="p-6 border-b-4 border-gray-900 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center border-2 border-gray-900 shadow-3d flex-shrink-0">
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              SmartHostel
            </h1>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider ml-15">
            Navbatchilik Tizimi
          </p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold border-2 border-gray-900 transition-all ${
                  isActive
                    ? 'bg-gradient-primary text-white shadow-3d'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px]'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout - 3D Design */}
        <div className="p-4 border-t-4 border-gray-900 space-y-3 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-700 dark:to-transparent">
          {/* User Profile Card - 3D */}
          {currentUser && (
            <div className="bg-gradient-primary rounded-2xl p-4 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border-2 border-white shadow-3d-sm">
                  <User size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">
                    {currentUser}
                  </p>
                  <p className="text-white/80 text-xs font-semibold">
                    Admin
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Logout Button - 3D */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <LogOut size={18} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>
    </>
  );
}
