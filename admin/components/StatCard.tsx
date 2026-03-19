import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: number;
  color: 'blue' | 'green' | 'red' | 'purple';
}

const colorClasses = {
  blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
  green: 'from-green-50 to-green-100 border-green-200 text-green-600',
  red: 'from-red-50 to-red-100 border-red-200 text-red-600',
  purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-600',
};

const iconBgClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
};

export default function StatCard({ icon: Icon, label, value, trend, color }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs font-semibold mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`${iconBgClasses[color]} p-3 rounded-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
