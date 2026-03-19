import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Users, Calendar, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../pages/_app';
import { getTranslation } from '../lib/i18n';

export default function Sidebar() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof import('../lib/i18n').translations.uz) => getTranslation(language, key);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/students', icon: Users, label: t('students') },
    { href: '/duties', icon: Calendar, label: t('duties') },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 flex flex-col border-r border-slate-800`}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">SmartHostel</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-sm font-bold">
            A
          </div>
          {!collapsed && (
            <div className="text-sm">
              <p className="font-medium">Admin</p>
              <p className="text-slate-400 text-xs">Online</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
