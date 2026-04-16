import { getTranslation, Language } from '../../../lib/i18n';

interface BoardFooterProps {
  lastUpdate: Date;
  language: Language;
}

export default function BoardFooter({ lastUpdate, language }: BoardFooterProps) {
  const t = (key: string) => getTranslation(language, key as any);

  return (
    <div className="mt-6 sm:mt-8 text-center">
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        {t('autoRefresh')} • {t('lastUpdate')}:{' '}
        {lastUpdate.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 sm:mt-2">
        {t('loginToEdit')}
      </p>
    </div>
  );
}
