import { getTranslation, Language } from '../../../lib/i18n';

interface DateSelectorProps {
  selectedDate: Date;
  isToday: boolean;
  isTomorrow: boolean;
  onDateChange: (days: number) => void;
  onSetToday: () => void;
  onSetTomorrow: () => void;
  formatDate: (date: Date) => string;
  language: Language;
}

export default function DateSelector({
  selectedDate,
  isToday,
  isTomorrow,
  onDateChange,
  onSetToday,
  onSetTomorrow,
  formatDate,
  language,
}: DateSelectorProps) {
  const t = (key: string) => getTranslation(language, key as any);

  return (
    <div className="mb-4">
      {/* Rounded Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-1.5 border-2 border-gray-900 shadow-3d-md inline-flex items-center gap-1 w-full sm:w-auto">
        {/* Previous Day */}
        <button
          onClick={() => onDateChange(-1)}
          className="p-2 sm:p-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-gray-900 hover:shadow-3d-sm transition-all flex-shrink-0"
          aria-label={t('previousDay')}
        >
          <span className="text-base sm:text-lg font-bold">←</span>
        </button>

        {/* Quick Date Pills */}
        <button
          onClick={onSetToday}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex-shrink-0 ${
            isToday
              ? 'bg-gradient-primary text-black shadow-3d-sm'
              : 'bg-transparent text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {t('today')}
        </button>

        <button
          onClick={onSetTomorrow}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex-shrink-0 ${
            isTomorrow
              ? 'bg-gradient-primary text-black shadow-3d-sm'
              : 'bg-transparent text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {t('tomorrow')}
        </button>

        {/* Date Display */}
        <div className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 text-center">
          <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
            {formatDate(selectedDate)}
          </span>
        </div>

        {/* Next Day */}
        <button
          onClick={() => onDateChange(1)}
          className="p-2 sm:p-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-gray-900 hover:shadow-3d-sm transition-all flex-shrink-0"
          aria-label={t('nextDay')}
        >
          <span className="text-base sm:text-lg font-bold">→</span>
        </button>
      </div>
    </div>
  );
}
