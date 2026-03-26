import { ReactNode } from 'react';

interface SidebarFooterProps {
  children: ReactNode;
}

export default function SidebarFooter({ children }: SidebarFooterProps) {
  return (
    <div className="p-4 border-t-4 border-gray-900 space-y-3 bg-white/20 dark:bg-white/10 backdrop-blur-md">
      {children}
    </div>
  );
}
