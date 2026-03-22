import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Info, Save } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function Settings() {
  const [settings, setSettings] = useState({
    name: 'Admin',
    email: 'admin@smarthostel.uz',
    notifications: true,
    darkMode: false,
    language: 'uz',
  });

  const handleSave = () => {
    alert('Sozlamalar saqlandi!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Sozlamalar
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Tizim sozlamalarini boshqarish
        </p>
      </div>

      {/* Account Settings */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
            <User size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hisob Sozlamalari
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Ism
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
            <Bell size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bildirishnomalar
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <div>
              <p className="font-bold text-gray-900 dark:text-white mb-1">
                Email Bildirishnomalar
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Muhim yangiliklar haqida email orqali xabardor bo'ling
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
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
            <Shield size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Xavfsizlik
          </h2>
        </div>

        <div className="space-y-4">
          <button className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
            <p className="font-bold text-gray-900 dark:text-white mb-1">
              Parolni O'zgartirish
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hisobingiz xavfsizligini oshiring
            </p>
          </button>

          <button className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
            <p className="font-bold text-gray-900 dark:text-white mb-1">
              Ikki Bosqichli Autentifikatsiya
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Qo'shimcha xavfsizlik qatlami qo'shing
            </p>
          </button>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
            <Info size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tizim Ma'lumotlari
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
              Versiya
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              v1.0.0
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
              Status
            </p>
            <Badge variant="success">Faol</Badge>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
              Backend
            </p>
            <Badge variant="success">Ulangan</Badge>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
              Bot
            </p>
            <Badge variant="success">Ishlamoqda</Badge>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} variant="primary" size="lg">
          <Save size={20} />
          Saqlash
        </Button>
      </div>
    </div>
  );
}
