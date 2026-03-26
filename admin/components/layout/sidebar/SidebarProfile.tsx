import { User } from 'lucide-react';

interface SidebarProfileProps {
  username: string;
}

export default function SidebarProfile({ username }: SidebarProfileProps) {
  if (!username) return null;

  return (
    <div className="bg-gradient-primary p-4 rounded-2xl border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-3d-sm">
          <User size={22} className="text-black dark:text-black" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-black dark:text-black font-bold text-sm truncate">
            {username}
          </p>
          <p className="text-black/80 dark:text-black/80 text-xs font-semibold">
            Admin
          </p>
        </div>
      </div>
    </div>
  );
}
