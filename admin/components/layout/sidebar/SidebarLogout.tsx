import { LogOut } from 'lucide-react';

interface SidebarLogoutProps {
  onClick: () => void;
}

export default function SidebarLogout({ onClick }: SidebarLogoutProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
    >
      <LogOut size={18} />
      <span>Chiqish</span>
    </button>
  );
}
