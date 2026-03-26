import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Info, Save, LogOut } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import { useToast } from '../components/common/Toast';
import { useRouter } from 'next/router';

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const { addToast } = useToast();
  const router = useRouter();
  const t = (key: any) => getTranslation(language, key as keyof typeof import('../lib/i18n').translations.uz);
  
  const [currentUser, setCurrentUser] = useState('');
  const [settings, setSettings] = useState({
    notifications: true,
  });

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    setCurrentUser(user || 'Admin');
  }, []);

  const handleSave = () => {
    addToast('Sozlamalar saqlandi', 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    addToast('Tizimdan chiqdingiz', 'success');
    router.push('/login');
  };

  const handleLanguageChange = (lang: 'uz' | 'ru' | 'en') => {
    setLanguage(lang);
    addToast(`Til o'zgartirildi: ${lang.toUpperCase()}`, 'success');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('settingsTitle')}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
          {t('settingsDesc')}
        </p>
      </div>

      {/* Account Settings */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7 pb-4 sm:pb-5 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-md flex-shrink-0">
            <User size={24} className="sm:w-7 sm:h-7 text-black dark:text-black" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('accountSettings')}
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              {t('username')}
            </label>
            <div className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium text-sm sm:text-base">
              {currentUser}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              {t('language')}
            </label>
            <div className="flex gap-2 sm:gap-3">
              {['uz', 'ru', 'en'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang as 'uz' | 'ru' | 'en')}
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base border-2 border-gray-900 transition-all ${
                    language === lang
                      ? 'bg-gradient-primary text-black dark:text-black shadow-3d'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-3d-sm'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7 pb-4 sm:pb-5 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-md flex-shrink-0">
            <Bell size={24} className="sm:w-7 sm:h-7 text-black dark:text-black" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('notifications')}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900 hover:shadow-3d-sm transition-all">
            <div>
              <p className="font-bold text-gray-900 dark:text-white mb-1">
                {t('emailNotifications')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('emailNotificationsDesc')}
              </p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
              className={`relative w-14 h-8 rounded-full border-2 border-gray-900 transition-colors flex-shrink-0 ${
                settings.notifications ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full border-2 border-gray-900 transition-transform ${
                  settings.notifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7 pb-4 sm:pb-5 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-md flex-shrink-0">
            <Info size={24} className="sm:w-7 sm:h-7 text-black dark:text-black" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('systemInfo')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">
              {t('versionLabel')}
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              v1.0.0
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">
              {t('statusLabel')}
            </p>
            <Badge variant="success">{t('active')}</Badge>
          </div>

          <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">
              {t('backendLabel')}
            </p>
            <Badge variant="success">{t('connected')}</Badge>
          </div>

          <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">
              {t('botLabel')}
            </p>
            <Badge variant="success">{t('running')}</Badge>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm sm:text-base border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <LogOut size={18} />
          {t('logout')}
        </button>
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-primary text-black dark:text-black rounded-xl font-bold text-sm sm:text-base border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <Save size={18} />
          {t('save')}
        </button>
      </div>
    </div>
  );
}
