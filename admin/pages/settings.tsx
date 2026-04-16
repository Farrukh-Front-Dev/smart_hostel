import { useState, useEffect } from 'react';
import { Save, MessageSquare, Globe, Server, RefreshCw } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import { useToast } from '../components/common/Toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const { addToast } = useToast();
  const t = (key: any) => getTranslation(language, key as keyof typeof import('../lib/i18n').translations.uz);
  
  const [dutyFormat, setDutyFormat] = useState<'simple' | 'timed'>('simple');
  const [postWithImage, setPostWithImage] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  
  // Original values to track changes
  const [originalDutyFormat, setOriginalDutyFormat] = useState<'simple' | 'timed'>('simple');
  const [originalPostWithImage, setOriginalPostWithImage] = useState<boolean>(true);

  // Service status
  const [services, setServices] = useState<any[]>([]);
  const [statusLoading, setStatusLoading] = useState(false);

  // Check if there are unsaved changes
  const hasChanges = dutyFormat !== originalDutyFormat || postWithImage !== originalPostWithImage;

  const checkServiceStatus = async () => {
    setStatusLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/status/all`);
      setServices(response.data.services);
    } catch (error) {
      console.error('Failed to check service status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    loadDutyFormat();
    loadPostImageSetting();
    checkServiceStatus();
    
    // Check service status every 30 seconds
    const interval = setInterval(checkServiceStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDutyFormat = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/settings/duty_message_format`);
      const format = response.data.value || 'simple';
      setDutyFormat(format);
      setOriginalDutyFormat(format);
    } catch (error) {
      console.error('Failed to load duty format:', error);
    }
  };

  const loadPostImageSetting = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/settings/post_with_image`);
      const withImage = response.data.value === 'true' || response.data.value === true;
      setPostWithImage(withImage);
      setOriginalPostWithImage(withImage);
    } catch (error) {
      console.error('Failed to load post image setting:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/settings/duty_message_format`, {
        value: dutyFormat
      });
      
      await axios.post(`${API_URL}/api/settings/post_with_image`, {
        value: postWithImage.toString()
      });
      
      // Update original values after successful save
      setOriginalDutyFormat(dutyFormat);
      setOriginalPostWithImage(postWithImage);
      
      addToast('Sozlamalar saqlandi', 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      addToast('Xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
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

      {/* Service Status */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-7 pb-4 sm:pb-5 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-md flex-shrink-0">
              <Server size={24} className="sm:w-7 sm:h-7 text-black dark:text-black" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Xizmatlar Holati
            </h2>
          </div>
          <button
            onClick={checkServiceStatus}
            disabled={statusLoading}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            <RefreshCw size={20} className={`text-gray-600 dark:text-gray-400 ${statusLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.name}
              className="p-4 rounded-xl border-2 border-gray-900 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  {service.name}
                </h3>
                <Badge variant={service.status === 'online' ? 'success' : 'error'}>
                  {service.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                </Badge>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>Javob vaqti: {service.responseTime}ms</p>
                <p>Tekshirilgan: {new Date(service.lastChecked).toLocaleTimeString('uz-UZ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7 pb-4 sm:pb-5 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-md flex-shrink-0">
            <Globe size={24} className="sm:w-7 sm:h-7 text-black dark:text-black" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('language')}
          </h2>
        </div>

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

      {/* Duty Message Format */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-gray-900 shadow-3d-md">
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7 pb-4 sm:pb-5 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-primary rounded-2xl flex items-center justify-center border-2 border-gray-900 shadow-3d-md flex-shrink-0">
            <MessageSquare size={24} className="sm:w-7 sm:h-7 text-black dark:text-black" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Navbatchilik Xabari Formati
          </h2>
        </div>

        <div className="space-y-6">
          {/* Post Image Setting */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Post Turi
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setPostWithImage(true)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  postWithImage
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-3d'
                    : 'border-gray-900 bg-gray-50 dark:bg-gray-800 hover:shadow-3d-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    🖼️ Rasm bilan
                  </h3>
                  {postWithImage && (
                    <Badge variant="success">✓</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Xabar rasm bilan yuboriladi
                </p>
              </div>

              <div
                onClick={() => setPostWithImage(false)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  !postWithImage
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-3d'
                    : 'border-gray-900 bg-gray-50 dark:bg-gray-800 hover:shadow-3d-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    📝 Rasmsiz
                  </h3>
                  {!postWithImage && (
                    <Badge variant="success">✓</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Faqat matn yuboriladi
                </p>
              </div>
            </div>
          </div>

          {/* Message Format */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Xabar Formati
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Simple Format */}
              <div
                onClick={() => setDutyFormat('simple')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  dutyFormat === 'simple'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-3d'
                    : 'border-gray-900 bg-gray-50 dark:bg-gray-800 hover:shadow-3d-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    Oddiy Format
                  </h3>
                  {dutyFormat === 'simple' && (
                    <Badge variant="success">Tanlangan</Badge>
                  )}
                </div>
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-mono">
                  <div className="text-gray-700 dark:text-gray-300">
                    📅 10.04.2026y. navbatchilar:<br />
                    ━━━━━━━━━━━━━<br />
                    1-qavat:<br />
                    &nbsp;&nbsp;• phoenix<br />
                    &nbsp;&nbsp;• dragon<br />
                    &nbsp;&nbsp;• shadow<br />
                    ━━━━━━━━━━━━━
                  </div>
                </div>
              </div>

              {/* Timed Format */}
              <div
                onClick={() => setDutyFormat('timed')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  dutyFormat === 'timed'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-3d'
                    : 'border-gray-900 bg-gray-50 dark:bg-gray-800 hover:shadow-3d-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    Vaqt Bilan Format
                  </h3>
                  {dutyFormat === 'timed' && (
                    <Badge variant="success">Tanlangan</Badge>
                  )}
                </div>
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-mono">
                  <div className="text-gray-700 dark:text-gray-300">
                    📅 Navbatchilar 10.04.2026<br />
                    <br />
                    1-qavat<br />
                    Tong 10:00-15:00<br />
                    phoenix<br />
                    Kun 15:00-20:00<br />
                    dragon<br />
                    Kech 23:00-04:00<br />
                    shadow
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-primary text-black dark:text-black rounded-xl font-bold text-sm sm:text-base border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {loading ? 'Saqlanmoqda...' : t('save')}
          </button>
        </div>
      )}
    </div>
  );
}
