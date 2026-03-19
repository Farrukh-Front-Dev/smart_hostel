import { useState, useEffect } from 'react';
import { Users, Calendar, Lock, TrendingUp } from 'lucide-react';
import { studentAPI, dutyAPI } from '../lib/api';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import StatCard from '../components/StatCard';
import Button from '../components/Button';

interface Stats {
  total: number;
  active: number;
  frozen: number;
  todaysDuties: number;
}

export default function Dashboard() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('../lib/i18n').translations.uz) => getTranslation(language, key);

  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, frozen: 0, todaysDuties: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const studentsRes = await studentAPI.getAll();
      const dutiesRes = await dutyAPI.getToday();

      const students = studentsRes.data;
      const total = students.length;
      const frozen = students.filter((s: any) => s.isFrozen).length;
      const active = total - frozen;
      const todaysDuties = dutiesRes.data?.allStudents?.length || 0;

      setStats({ total, active, frozen, todaysDuties });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's your hostel overview.</p>
        </div>
        <Button onClick={fetchStats} loading={loading}>
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label={t('totalStudents')}
          value={stats.total}
          color="blue"
          trend={5}
        />
        <StatCard
          icon={TrendingUp}
          label={t('activeStudents')}
          value={stats.active}
          color="green"
          trend={8}
        />
        <StatCard
          icon={Lock}
          label={t('frozenStudents')}
          value={stats.frozen}
          color="red"
          trend={-2}
        />
        <StatCard
          icon={Calendar}
          label="Today's Duties"
          value={stats.todaysDuties}
          color="purple"
          trend={3}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="primary" size="lg" className="w-full">
            Add New Student
          </Button>
          <Button variant="secondary" size="lg" className="w-full">
            View All Duties
          </Button>
          <Button variant="secondary" size="lg" className="w-full">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 pb-4 border-b border-slate-200 last:border-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Student added</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
