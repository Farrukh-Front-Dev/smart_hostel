import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Info, Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';

export default function Settings() {
  const { language } = useLanguage();
  const t = (key: any) => getTranslation(language, key as keyof typeof import('../lib/i18n').translations.uz);
  
  const [settings, setSettings] = useState({
    name: 'Admin',
    email: 'admin@smarthostel.uz',
    notifications: true,
    darkMode: false,
    language: 'uz',
  });

  const handleSave = () => {
    alert(t('settingsSaved'));
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
      <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-sm flex-shrink-0">
            <User size={20} className="sm:w-6 sm:h-6 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {t('accountSettings')}
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              {t('name')}
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all font-medium text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all font-medium text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
            <Bell size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('notifications')}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
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
              className={`relative w-14 h-8 rounded-full border-2 border-gray-900 transition-colors ${
                settings.notifications ? 'bg-green-500' : 'bg-gray-300'
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

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
            <Shield size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('security')}
          </h2>
        </div>

        <div className="space-y-4">
          <button className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
            <p className="font-bold text-gray-900 dark:text-white mb-1">
              {t('changePassword')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('changePasswordDesc')}
            </p>
          </button>

          <button className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
            <p className="font-bold text-gray-900 dark:text-white mb-1">
              {t('twoFactor')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('twoFactorDesc')}
            </p>
          </button>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
            <Info size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('systemInfo')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
              {t('versionLabel')}
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {t('version')}
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
              {t('statusLabel')}
            </p>
            <Badge variant="success">{t('active')}</Badge>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
              {t('backendLabel')}
            </p>
            <Badge variant="success">{t('connected')}</Badge>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
              {t('botLabel')}
            </p>
            <Badge variant="success">{t('running')}</Badge>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} variant="primary" size="lg">
          <Save size={20} />
          {t('save')}
        </Button>
      </div>
    </div>
  );
}
