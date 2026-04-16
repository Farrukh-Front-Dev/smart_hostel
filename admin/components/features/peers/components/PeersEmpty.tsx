import { Users } from 'lucide-react';
import { Language, getTranslation } from '@/lib/i18n';

interface PeersEmptyProps {
  language: Language;
}

export default function PeersEmpty({ language }: PeersEmptyProps) {
  const t = (key: string) => getTranslation(language, key as any);
  
  return (
    <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm border-2 border-gray-900 rounded-3xl p-12 text-center shadow-3d-md">
      <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {t('noStudents')}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {t('noStudentsDesc')}
      </p>
    </div>
  );
}
