import { getTranslation, Language } from '../../../lib/i18n';

interface Student {
  id: number;
  name: string;
  username: string;
}

interface DutyFloorCardProps {
  floor: number;
  students: Student[];
  language: Language;
}

export default function DutyFloorCard({ floor, students, language }: DutyFloorCardProps) {
  const t = (key: string) => getTranslation(language, key as any);
  
  const floorLabel = t(`floor${floor}` as any);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-lg transition-all">
      {/* Floor Header */}
      <div className="flex items-center gap-2.5 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-primary rounded-xl flex items-center justify-center border-2 border-gray-900 font-bold text-base sm:text-lg text-black shadow-3d-sm">
          {floor}
        </div>
        <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
          {floorLabel}
        </h3>
      </div>

      {/* Students List */}
      <div className="space-y-2 sm:space-y-2.5">
        {students.length > 0 ? (
          students.map((student, index) => (
            <div
              key={index}
              className="group flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl border-2 border-gray-900 dark:border-gray-600 hover:shadow-3d-sm transition-all"
            >
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full flex-shrink-0 shadow-lg"></div>
              <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                {student.username || student.name}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-6 sm:py-8 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl border-2 border-orange-300 dark:border-orange-700">
            <p className="text-sm sm:text-base font-bold text-orange-600 dark:text-orange-400">
              {t('intensive')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
