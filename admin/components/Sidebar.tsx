import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Users, Calendar, Settings, Menu, X } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Talabalar', href: '/students' },
  { icon: Calendar, label: 'Navbatchiliklar', href: '/duties' },
  { icon: Settings, label: 'Sozlamalar', href: '/settings' },
];

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-dark-surface border-r-4 border-gray-900 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b-4 border-gray-900">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SmartHostel
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-semibold">
              Navbatchilik Tizimi
            </p>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold border-2 border-gray-900 transition-all ${
                    isActive
                      ? 'bg-gradient-primary text-white shadow-3d'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px]'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t-4 border-gray-900">
            <div className="bg-gradient-primary rounded-xl p-4 border-2 border-gray-900 shadow-3d">
              <p className="text-white font-bold text-sm">
                School 21 Yotoqxonasi
              </p>
              <p className="text-white/80 text-xs mt-1">
                v1.0.0
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
