import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Send, Users, User } from 'lucide-react';
import { dutyAPI } from '../lib/api';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import { useToast } from '../components/common/Toast';
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

function Duties() {
  const { language } = useLanguage();
  const { addToast } = useToast();
  const t = (key: any) => getTranslation(language, key as keyof typeof import('../lib/i18n').translations.uz);

  const [todayDuties, setTodayDuties] = useState<DutyData | null>(null);
  const [tomorrowDuties, setTomorrowDuties] = useState<DutyData | null>(null);
  const [upcomingDuties, setUpcomingDuties] = useState<DutyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [showUpcoming, setShowUpcoming] = useState(false);

  useEffect(() => {
    fetchInitialDuties();
  }, []);

  const fetchInitialDuties = async () => {
    try {
      setLoading(true);
      const [todayRes, tomorrowRes] = await Promise.all([
        dutyAPI.getToday(),
        dutyAPI.getTomorrow(),
      ]);
      setTodayDuties(todayRes.data);
      setTomorrowDuties(tomorrowRes.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingDuties = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 7);

      const startDateStr = today.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // First, generate duties for each day in the range if they don't exist
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      for (let i = 0; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          await axios.post(`${API_URL}/api/duties/generate/${dateStr}`);
        } catch (err) {
          // Duties might already exist, that's ok
          console.log(`Duties for ${dateStr} already exist or error occurred`);
        }
      }

      // Now fetch the duties
      const response = await dutyAPI.getRange(startDateStr, endDateStr);
      setUpcomingDuties(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleShowUpcoming = async () => {
    setShowUpcoming(true);
    await fetchUpcomingDuties();
  };

  const formatDate = (dateStr: string | Date) => {
    let date: Date;

    if (typeof dateStr === 'string') {
      date = new Date(dateStr);
    } else {
      date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const weekdays = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    const weekday = weekdays[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${weekday}, ${day}.${month}.${year}`;
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

  const renderStudentItem = (student: Student) => (
    <div
      key={student.id}
      className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl border-2 border-gray-900 hover:shadow-3d-sm hover:translate-x-1 transition-all duration-200"
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-gray-900 flex-shrink-0 shadow-3d-sm">
          <User size={20} className="sm:w-6 sm:h-6 text-white" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
          {student.username}
        </span>
      </div>
      <ChevronRight size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
    </div>
  );

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
        {!showUpcoming && (
          <button
            onClick={handleManualSend}
            disabled={sending}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-primary text-black dark:text-black rounded-xl font-bold text-sm sm:text-base border-2 border-gray-900 shadow-3d hover:shadow-3d-lg hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-fit"
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
      {!showUpcoming && (
        <div className="flex justify-end">
          <button
            onClick={handleShowUpcoming}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-primary text-black dark:text-black rounded-xl font-bold text-sm sm:text-base border-2 border-gray-900 shadow-3d hover:shadow-3d-lg hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
          >
            <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
            7 kunlik jadvalni ko'rish
          </button>
        </div>
      )}

      {showUpcoming && (
        <div className="flex justify-start">
          <button
            onClick={() => setShowUpcoming(false)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-sm sm:text-base border-2 border-gray-900 shadow-3d hover:shadow-3d-lg hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
          >
            <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px] rotate-180" />
            Orqaga
          </button>
        </div>
      )}

      {/* Duties Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-primary-cyan border-t-transparent"></div>
        </div>
      ) : showUpcoming && upcomingDuties.length > 0 ? (
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
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Floor Header */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7 pb-4 sm:pb-5 border-b-2 border-gray-200 dark:border-gray-700">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-md flex-shrink-0">
                        <Calendar size={24} className="sm:w-7 sm:h-7 text-black dark:text-black" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {floor}-{t('floor')}
                      </h3>
                    </div>

                    {/* Students List */}
                    <div className="space-y-3 sm:space-y-4">
                      {dayDuties.byFloor[floor]?.length > 0 ? (
                        dayDuties.byFloor[floor].map((student) => renderStudentItem(student))
                      ) : (
                        <div className="text-center py-8 sm:py-10">
                          <Users className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 text-gray-400" />
                          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-bold">
                            INTENSIV
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : !showUpcoming && (todayDuties || tomorrowDuties) ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Today's Duties */}
          {todayDuties && (
            <div>
              <div className="mb-4 sm:mb-6 bg-gradient-primary rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-gray-900 shadow-3d">
                <p className="text-black dark:text-black font-bold text-base sm:text-lg text-center">
                  📅 {formatDate(todayDuties.date)} (Bugun)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map((floor) => (
                  <div
                    key={`today-${floor}`}
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Floor Header */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7 pb-4 sm:pb-5 border-b-2 border-gray-200 dark:border-gray-700">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-md flex-shrink-0">
                        <Calendar size={24} className="sm:w-7 sm:h-7 text-black dark:text-black" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {floor}-{t('floor')}
                      </h3>
                    </div>

                    {/* Students List */}
                    <div className="space-y-3 sm:space-y-4">
                      {todayDuties.byFloor[floor]?.length > 0 ? (
                        todayDuties.byFloor[floor].map((student) => renderStudentItem(student))
                      ) : (
                        <div className="text-center py-8 sm:py-10">
                          <Users className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 text-gray-400" />
                          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-bold">
                            INTENSIV
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tomorrow's Duties */}
          {tomorrowDuties && (
            <div>
              <div className="mb-4 sm:mb-6 bg-gradient-primary rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-gray-900 shadow-3d">
                <p className="text-black dark:text-black font-bold text-base sm:text-lg text-center">
                  📅 {formatDate(tomorrowDuties.date)} (Ertaga)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map((floor) => (
                  <div
                    key={`tomorrow-${floor}`}
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Floor Header */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7 pb-4 sm:pb-5 border-b-2 border-gray-200 dark:border-gray-700">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-md flex-shrink-0">
                        <Calendar size={24} className="sm:w-7 sm:h-7 text-black dark:text-black" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {floor}-{t('floor')}
                      </h3>
                    </div>

                    {/* Students List */}
                    <div className="space-y-3 sm:space-y-4">
                      {tomorrowDuties.byFloor[floor]?.length > 0 ? (
                        tomorrowDuties.byFloor[floor].map((student) => renderStudentItem(student))
                      ) : (
                        <div className="text-center py-8 sm:py-10">
                          <Users className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 text-gray-400" />
                          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-bold">
                            INTENSIV
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default Duties;
