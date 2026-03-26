import Link from 'next/link';
import { useRouter } from 'next/router';
import { LucideIcon } from 'lucide-react';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface SidebarNavigationProps {
  items: MenuItem[];
  onItemClick?: () => void;
}

export default function SidebarNavigation({ items, onItemClick }: SidebarNavigationProps) {
  const router = useRouter();

  return (
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = router.pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold border-2 border-gray-900 transition-all ${
              isActive
                ? 'bg-gradient-primary text-black dark:text-black shadow-3d'
                : 'bg-white/20 dark:bg-white/10 text-gray-900 dark:text-white hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] border-white/40 dark:border-white/30'
            }`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
