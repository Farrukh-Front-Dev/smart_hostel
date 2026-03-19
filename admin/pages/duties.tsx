import { useState, useEffect } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { dutyAPI } from '../lib/api';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import Button from '../components/Button';

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
      setError(err.response?.data?.error || t('failedToFetchDuties'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('duties')}</h1>
          <p className="text-slate-600 mt-1">View and manage duty assignments</p>
        </div>
        <Button onClick={fetchDuties} loading={loading}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* View Selector */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setView('today')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              view === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {t('today')}
          </button>
          <button
            onClick={() => setView('tomorrow')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              view === 'tomorrow'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {t('tomorrow')}
          </button>
          <button
            onClick={() => setView('date')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              view === 'date'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {t('selectDate')}
          </button>
        </div>

        {view === 'date' && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* Duties Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : duties ? (
        <div>
          <p className="text-sm text-slate-600 mb-6">
            Duties for <span className="font-semibold">{formatDate(duties.date)}</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((floor) => (
              <div
                key={floor}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {t('floor')} {floor}
                  </h3>
                </div>

                <div className="space-y-3">
                  {duties.byFloor[floor]?.length > 0 ? (
                    duties.byFloor[floor].map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {student.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900">{student.username}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-slate-500 text-sm">{t('noDutiesAssigned')}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">
                      {duties.byFloor[floor]?.length || 0}
                    </span>{' '}
                    students assigned
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500">{t('noDutiesFound')}</p>
        </div>
      )}
    </div>
  );
}
