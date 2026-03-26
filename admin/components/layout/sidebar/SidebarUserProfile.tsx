import { User } from 'lucide-react';

interface SidebarUserProfileProps {
  username: string;
}

export default function SidebarUserProfile({ username }: SidebarUserProfileProps) {
  if (!username) return null;

  return (
    <div className="bg-gradient-primary rounded-2xl p-4 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border-2 border-white shadow-3d-sm">
          <User size={22} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">
            {username}
          </p>
          <p className="text-white/80 text-xs font-semibold">
            Admin
          </p>
        </div>
      </div>
    </div>
  );
}
