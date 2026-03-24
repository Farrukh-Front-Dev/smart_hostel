import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: 'blue' | 'green' | 'red' | 'purple' | 'pink' | 'cyan';
  trend?: number;
}

const colorClasses = {
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-green-500 to-emerald-500',
  red: 'from-red-500 to-pink-500',
  purple: 'from-purple-500 to-pink-500',
  pink: 'from-pink-500 to-rose-500',
  cyan: 'from-[#38C9E6] to-[#43E8A0]',
};

export default function StatCard({ icon: Icon, label, value, color, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2 uppercase tracking-wide truncate">
            {label}
          </p>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center border-2 border-gray-900 shadow-3d-sm flex-shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          {trend >= 0 ? (
            <>
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-green-600 dark:text-green-400 font-bold truncate">
                +{trend}% bu oy
              </span>
            </>
          ) : (
            <>
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-red-600 dark:text-red-400 font-bold truncate">
                {trend}% bu oy
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
