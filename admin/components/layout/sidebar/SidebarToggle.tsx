import { Menu, X } from 'lucide-react';

interface SidebarToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function SidebarToggle({ isOpen, onClick }: SidebarToggleProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-50 p-3 sm:p-4 bg-gradient-primary text-black dark:text-black rounded-2xl border-2 border-gray-900 shadow-3d hover:shadow-3d-lg hover:-translate-y-1 transition-all"
      title={isOpen ? 'Sidebarni yopish' : 'Sidebarni ochish'}
    >
      {isOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  );
}
