import { Menu, X } from 'lucide-react';

interface SidebarMobileButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function SidebarMobileButton({ isOpen, onClick }: SidebarMobileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-primary text-white rounded-2xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
}
