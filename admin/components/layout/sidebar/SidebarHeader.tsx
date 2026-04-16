import { Zap, X, ChevronLeft } from 'lucide-react';

interface SidebarHeaderProps {
  onClose?: () => void;
  onToggle?: () => void;
  isOpen?: boolean;
}

export default function SidebarHeader({ onClose, onToggle, isOpen }: SidebarHeaderProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center border-2 border-gray-900 shadow-3d flex-shrink-0">
            <Zap size={24} className="text-black dark:text-black" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            SmartHostel
          </h1>
          {/* Collapse button - visible on desktop */}
          <button
            onClick={onToggle}
            className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ml-auto"
            title="Sidebarni yopish"
          >
            <ChevronLeft size={20} className="text-gray-900 dark:text-white" />
          </button>
        </div>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X size={24} className="text-gray-900 dark:text-white" />
        </button>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider">
        Navbatchilik Tizimi
      </p>
    </div>
  );
}
