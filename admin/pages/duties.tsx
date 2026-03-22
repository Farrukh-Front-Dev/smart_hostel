import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Send, Users } from 'lucide-react';
import { dutyAPI } from '../lib/api';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import Button from '../components/Button';
import axios from 'axios';

interface Student {
  id: number;
  username: string;
  floor: number;
}

interface DutyData {
  date: string;
  byFloor: Record<number, Student[]>;
  allStudents: Student[];
}

export default function Duties() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('../lib/i18n').translations.uz) => getTranslation(language, key);

  const [duties, setDuties] = useState<DutyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'today' | 'tomorrow' | 'date'>('today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDuties();
  }, [view, selectedDate]);

  const fetchDuties = async () => {
    try {
      setLoading(true);
      let response;

      if (view === 'today') {
        response = await dutyAPI.getToday();
      } else if (view === 'tomorrow') {
        response = await dutyAPI.getTomorrow();
      } else {
        response = await dutyAPI.getByDate(selectedDate);
      }

      setDuties(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uz-UZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Navbatchiliklar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Navbatchilik tayinlanishlarini ko'rish
          </p>
        </div>
        <div className="flex gap-3">
          {view === 'today' && (
            <button
              onClick={handleManualSend}
              disabled={sending}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl font-bold border-2 border-gray-900 shadow-3d hover:shadow-3d-lg hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              {sending ? 'Yuborilmoqda...' : 'Send Now'}
            </button>
          )}
          <Button onClick={fetchDuties} loading={loading} variant="ghost">
            Yangilash
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-4">
          <p className="text-red-700 dark:text-red-400 font-bold">{error}</p>
        </div>
      )}

      {/* View Selector */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 border-2 border-gray-900 shadow-3d-md">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setView('today')}
              className={`px-6 py-3 rounded-xl font-bold border-2 border-gray-900 transition-all ${
                view === 'today'
                  ? 'bg-gradient-primary text-white shadow-3d'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              Bugun
            </button>
            <button
              onClick={() => setView('tomorrow')}
              className={`px-6 py-3 rounded-xl font-bold border-2 border-gray-900 transition-all ${
                view === 'tomorrow'
                  ? 'bg-gradient-primary text-white shadow-3d'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              Erta
            </button>
            <button
              onClick={() => setView('date')}
              className={`px-6 py-3 rounded-xl font-bold border-2 border-gray-900 transition-all ${
                view === 'date'
                  ? 'bg-gradient-primary text-white shadow-3d'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              Sana Tanlash
            </button>
          </div>

          {view === 'date' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all font-medium"
            />
          )}
        </div>
      </div>

      {/* Duties Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
        </div>
      ) : duties ? (
        <div>
          <div className="mb-6 bg-gradient-primary rounded-2xl p-4 border-2 border-gray-900 shadow-3d">
            <p className="text-white font-bold text-lg text-center">
              📅 {formatDate(duties.date)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((floor) => (
              <div
                key={floor}
                className="bg-white dark:bg-dark-surface rounded-3xl p-6 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                {/* Floor Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {floor}-qavat
                  </h3>
                </div>

                {/* Students List */}
                <div className="space-y-3">
                  {duties.byFloor[floor]?.length > 0 ? (
                    duties.byFloor[floor].map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold border-2 border-gray-900">
                            {student.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {student.username}
                          </span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                        Tayinlanmagan
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-bold">
                    Jami:{' '}
                    <span className="text-gray-900 dark:text-white">
                      {duties.byFloor[floor]?.length || 0} talaba
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-surface border-2 border-gray-900 rounded-3xl p-12 text-center shadow-3d-md">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Navbatchiliklar topilmadi
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Bu sana uchun navbatchiliklar mavjud emas
          </p>
        </div>
      )}
    </div>
  );
}
