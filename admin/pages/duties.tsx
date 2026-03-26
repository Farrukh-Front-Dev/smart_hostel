import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Send, Users } from 'lucide-react';
import { dutyAPI } from '../lib/api';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import { useToast } from '../components/common/Toast';
import Button from '../components/ui/Button';
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
  const { addToast } = useToast();
  const t = (key: any) => getTranslation(language, key as keyof typeof import('../lib/i18n').translations.uz);

  const [duties, setDuties] = useState<DutyData | null>(null);
  const [upcomingDuties, setUpcomingDuties] = useState<DutyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'today' | 'tomorrow' | 'date' | 'upcoming'>('today');
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
        setDuties(response.data);
      } else if (view === 'tomorrow') {
        response = await dutyAPI.getTomorrow();
        setDuties(response.data);
      } else if (view === 'date') {
        response = await dutyAPI.getByDate(selectedDate);
        setDuties(response.data);
      } else if (view === 'upcoming') {
        // Get next 7 days
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 7);
        
        const startDateStr = today.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        response = await dutyAPI.getRange(startDateStr, endDateStr);
        setUpcomingDuties(response.data);
        setDuties(null);
      }

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
    if (!confirm(t('confirmSend'))) {
      return;
    }

    try {
      setSending(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/api/duties/send-now`);
      
      if (response.data.success) {
        addToast('Navbatchiliklar muvaffaqiyatli yuborildi', 'success');
      } else {
        addToast('Xatolik: ' + response.data.error, 'error');
      }
    } catch (error: any) {
      console.error('Failed to send manual notification:', error);
      addToast('Yuborishda xatolik: ' + (error.response?.data?.error || error.message), 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('viewDutiesTitle')}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
            {t('viewDutiesDesc')}
          </p>
        </div>
        {view === 'today' && (
          <button
            onClick={handleManualSend}
            disabled={sending}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-primary text-white rounded-xl font-bold text-sm sm:text-base border-2 border-gray-900 shadow-3d hover:shadow-3d-lg hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          >
            <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
            {sending ? t('sending') : t('sendNow')}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-3 sm:p-4">
          <p className="text-red-700 dark:text-red-400 font-bold text-sm sm:text-base">{error}</p>
        </div>
      )}

      {/* View Selector */}
      <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-gray-900 shadow-3d-md">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setView('today')}
              className={`flex-1 min-w-[100px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base border-2 border-gray-900 transition-all ${
                view === 'today'
                  ? 'bg-gradient-primary text-white shadow-3d'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              {t('today')}
            </button>
            <button
              onClick={() => setView('tomorrow')}
              className={`flex-1 min-w-[100px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base border-2 border-gray-900 transition-all ${
                view === 'tomorrow'
                  ? 'bg-gradient-primary text-white shadow-3d'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              {t('tomorrow')}
            </button>
            <button
              onClick={() => setView('upcoming')}
              className={`flex-1 min-w-[100px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base border-2 border-gray-900 transition-all ${
                view === 'upcoming'
                  ? 'bg-gradient-primary text-white shadow-3d'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              7 kun
            </button>
            <button
              onClick={() => setView('date')}
              className={`flex-1 min-w-[100px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base border-2 border-gray-900 transition-all ${
                view === 'date'
                  ? 'bg-gradient-primary text-white shadow-3d'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              {t('date')}
            </button>
          </div>

          {view === 'date' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all font-medium text-sm sm:text-base"
            />
          )}
        </div>
      </div>

      {/* Duties Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-primary-cyan border-t-transparent"></div>
        </div>
      ) : view === 'upcoming' && upcomingDuties.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {upcomingDuties.map((dayDuties) => (
            <div key={dayDuties.date}>
              <div className="mb-3 sm:mb-4 bg-gradient-primary rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-gray-900 shadow-3d">
                <p className="text-black dark:text-black font-bold text-base sm:text-lg text-center">
                  📅 {formatDate(dayDuties.date)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map((floor) => (
                  <div
                    key={floor}
                    className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    {/* Floor Header */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-sm flex-shrink-0">
                        <Calendar size={20} className="sm:w-6 sm:h-6 text-black dark:text-black" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {floor}-{t('floor')}
                      </h3>
                    </div>

                    {/* Students List */}
                    <div className="space-y-2 sm:space-y-3">
                      {dayDuties.byFloor[floor]?.length > 0 ? (
                        dayDuties.byFloor[floor].map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl border-2 border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold border-2 border-gray-900 flex-shrink-0 text-sm sm:text-base">
                                {student.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                {student.username}
                              </span>
                            </div>
                            <ChevronRight size={14} className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 sm:py-8">
                          <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold">
                            {t('noDutiesAssigned')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-bold">
                        {t('totalStudents')}{' '}
                        <span className="text-gray-900 dark:text-white">
                          {dayDuties.byFloor[floor]?.length || 0} {t('student')}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : duties ? (
        <div>
          <div className="mb-4 sm:mb-6 bg-gradient-primary rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-gray-900 shadow-3d">
            <p className="text-black dark:text-black font-bold text-base sm:text-lg text-center">
              📅 {formatDate(duties.date)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((floor) => (
              <div
                key={floor}
                className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                {/* Floor Header */}
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-sm flex-shrink-0">
                    <Calendar size={20} className="sm:w-6 sm:h-6 text-black dark:text-black" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {floor}-{t('floor')}
                  </h3>
                </div>

                {/* Students List */}
                <div className="space-y-2 sm:space-y-3">
                  {duties.byFloor[floor]?.length > 0 ? (
                    duties.byFloor[floor].map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl border-2 border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold border-2 border-gray-900 flex-shrink-0 text-sm sm:text-base">
                            {student.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                            {student.username}
                          </span>
                        </div>
                        <ChevronRight size={14} className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold">
                        {t('noDutiesAssigned')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-bold">
                    {t('totalStudents')}{' '}
                    <span className="text-gray-900 dark:text-white">
                      {duties.byFloor[floor]?.length || 0} {t('student')}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm border-2 border-gray-900 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-3d-md">
          <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('noDutiesFound')}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {t('noDutiesFoundDesc')}
          </p>
        </div>
      )}
    </div>
  );
}
