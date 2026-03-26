import { Zap } from 'lucide-react';

export default function SidebarLogo() {
  return (
    <div className="p-6 border-b-4 border-gray-900 bg-white/20 dark:bg-white/10 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center border-2 border-gray-900 shadow-3d flex-shrink-0">
          <Zap size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
          SmartHostel
        </h1>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider">
        Navbatchilik Tizimi
      </p>
    </div>
  );
}
