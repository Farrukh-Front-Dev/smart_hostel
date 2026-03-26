import { ReactNode } from 'react';

interface NavbarButtonProps {
  onClick?: () => void;
  children: ReactNode;
  title?: string;
  tooltip?: string;
}

export default function NavbarButton({ onClick, children, title, tooltip }: NavbarButtonProps) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        title={title}
        className="p-1.5 sm:p-2 bg-white/20 dark:bg-white/10 hover:bg-white/40 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-full border-2 border-white/40 dark:border-white/30 shadow-3d hover:shadow-3d-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all font-bold text-xs sm:text-sm"
      >
        {children}
      </button>
      {tooltip && (
        <div className="absolute right-0 mt-1.5 px-2.5 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-semibold shadow-lg border-2 border-gray-900">
          {tooltip}
        </div>
      )}
    </div>
  );
}
