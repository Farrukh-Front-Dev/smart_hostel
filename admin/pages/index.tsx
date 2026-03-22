import { useState, useEffect } from 'react';
import { Users, Calendar, Lock, TrendingUp, Send, ArrowRight, Plus } from 'lucide-react';
import { studentAPI, dutyAPI } from '../lib/api';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import axios from 'axios';

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
    } finally {
      setLoading(false);
    }
  };

  const handleManualSend = async () => {
    if (!confirm('Bugungi navbatchilarni Telegram guruhga yuborishni xohlaysizmi?')) {
      return;
    }

    try {
      setSending(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/api/duties/send-now`);
      
      if (response.data.success) {
        alert('✅ Xabar muvaffaqiyatli yuborildi!');
      } else {
        alert('❌ Xatolik yuz berdi: ' + response.data.error);
      }
    } catch (error: any) {
      console.error('Failed to send manual notification:', error);
      alert('❌ Xabar yuborishda xatolik: ' + (error.response?.data?.error || error.message));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Yotoqxona boshqaruv tizimiga xush kelibsiz! 👋
          </p>
        </div>
        <Button onClick={fetchStats} loading={loading} variant="ghost">
          Yangilash
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Jami Talabalar"
          value={stats.total}
          color="cyan"
          trend={5}
        />
        <StatCard
          icon={TrendingUp}
          label="Faol Talabalar"
          value={stats.active}
          color="green"
          trend={8}
        />
        <StatCard
          icon={Lock}
          label="Frozen Talabalar"
          value={stats.frozen}
          color="red"
          trend={-2}
        />
        <StatCard
          icon={Calendar}
          label="Bugungi Navbatchilar"
          value={stats.todaysDuties}
          color="purple"
          trend={3}
        />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Manual Send Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center border-2 border-gray-900 shadow-3d-sm mb-4">
            <Send className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Manual Send
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Bugungi navbatchilarni Telegram guruhga yuborish
          </p>
          <button
            onClick={handleManualSend}
            disabled={sending}
            className="w-full bg-gradient-to-br from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 border-2 border-gray-900 shadow-3d hover:shadow-3d-lg hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? 'Yuborilmoqda...' : 'Hozir Yuborish'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Add Student Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center border-2 border-gray-900 shadow-3d-sm mb-4">
            <Plus className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Talaba Qo'shish
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Yangi talabani tizimga qo'shish
          </p>
          <button className="w-full bg-gradient-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 border-2 border-gray-900 shadow-3d hover:shadow-3d-lg hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
            Qo'shish
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* View Duties Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-gray-900 shadow-3d-sm mb-4">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Navbatchiliklar
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Barcha navbatchiliklar ro'yxati
          </p>
          <button className="w-full bg-gradient-to-br from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 border-2 border-gray-900 shadow-3d hover:shadow-3d-lg hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
            Ko'rish
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 border-2 border-gray-900 shadow-3d-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          So'nggi Faoliyat
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white">Talaba qo'shildi</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">2 soat oldin</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white">Navbatchilik yuborildi</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">5 soat oldin</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white">Talaba freeze qilindi</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">1 kun oldin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
