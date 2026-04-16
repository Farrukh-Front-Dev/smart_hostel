import DutyFloorCard from './DutyFloorCard';
import { getTranslation, Language } from '../../../lib/i18n';

interface DutyData {
  byFloor: {
    [key: number]: Array<{
      id: number;
      name: string;
      username: string;
    }>;
  };
}

interface DutyGridProps {
  duties: DutyData | null;
  loading: boolean;
  language: Language;
}

export default function DutyGrid({ duties, loading, language }: DutyGridProps) {
  const t = (key: string) => getTranslation(language, key as any);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('loading')}
        </p>
      </div>
    );
  }

  if (!duties) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-900">
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('noDataFound')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {[1, 2, 3, 4].map((floor) => {
        const floorStudents = duties.byFloor?.[floor] || [];
        return <DutyFloorCard key={floor} floor={floor} students={floorStudents} language={language} />;
      })}
    </div>
  );
}
