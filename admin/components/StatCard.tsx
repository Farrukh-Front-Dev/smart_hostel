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
    <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-5xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center border-2 border-gray-900 shadow-3d-sm`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-2 text-sm">
          {trend >= 0 ? (
            <>
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400 font-bold">
                +{trend}% bu oy
              </span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-red-600 dark:text-red-400 font-bold">
                {trend}% bu oy
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
