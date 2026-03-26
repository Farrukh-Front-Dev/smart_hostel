import { useState, useEffect } from 'react';
import { Users, Calendar, Lock, TrendingUp, Send, ArrowRight, Plus } from 'lucide-react';
import { studentAPI, dutyAPI } from '../lib/api';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import { useToast } from '../components/common/Toast';
import StatCard from '../components/features/StatCard';
import Button from '../components/ui/Button';
import axios from 'axios';

interface Stats {
  total: number;
  active: number;
  frozen: number;
  todaysDuties: number;
}

export default function Dashboard() {
  const { language } = useLanguage();
  const { addToast } = useToast();
  const t = (key: any) => getTranslation(language, key as keyof typeof import('../lib/i18n').translations.uz);

  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, frozen: 0, todaysDuties: 0 });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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
      addToast(t('failedToSave' as any), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSend = async () => {
    if (!confirm(t('confirmSend' as any))) {
      return;
    }

    try {
      setSending(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/api/duties/send-now`);
      
      if (response.data.success) {
        addToast(t('successMessage' as any), 'success');
      } else {
        addToast(t('errorMessage' as any) + response.data.error, 'error');
      }
    } catch (error: any) {
      console.error('Failed to send manual notification:', error);
      addToast(t('sendError' as any) + (error.response?.data?.error || error.message), 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('dashboard' as any)}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t('welcomeMessage' as any)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label={t('totalStudents' as any)}
          value={stats.total}
          color="cyan"
        />
        <StatCard
          icon={TrendingUp}
          label={t('activeStudents' as any)}
          value={stats.active}
          color="cyan"
        />
        <StatCard
          icon={Lock}
          label={t('frozenStudents' as any)}
          value={stats.frozen}
          color="cyan"
        />
        <StatCard
          icon={Calendar}
          label={t('todaysDuties' as any)}
          value={stats.todaysDuties}
          color="cyan"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('todaysDuties' as any)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {stats.todaysDuties} ta peer navbatda
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center border-2 border-gray-900 shadow-3d">
            <Send size={24} className="text-white" />
          </div>
        </div>
        <button
          onClick={handleManualSend}
          disabled={sending}
          className="w-full bg-gradient-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? t('sending' as any) : t('sendNow' as any)}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
