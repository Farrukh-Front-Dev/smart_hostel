import { useState } from 'react';
import { useRouter } from 'next/router';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../pages/_app';
import Squares from '../components/common/Squares';
import credentials from '../lib/credentials.json';

export default function Login() {
  const router = useRouter();
  const { isDark, setIsDark } = useTheme();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Credentials-dan tekshirish
      const user = credentials.users.find(
        (u) => u.login === login && u.password === password
      );

      if (!user) {
        setError('Login yoki password noto\'g\'ri');
        setLoading(false);
        return;
      }

      // Session-ga saqlash
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', login);

      // Dashboard-ga yo'naltirish
      router.push('/');
    } catch (err) {
      setError('Xatolik yuz berdi');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-100 pointer-events-none z-0">
        <Squares
          direction="diagonal"
          speed={0.2}
          borderColor="rgba(255, 255, 255, 0.05)"
          squareSize={60}
          hoverFillColor="rgba(255, 255, 255, 0.02)"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Dark Mode Toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border-2 border-gray-900 hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-900 shadow-3d-lg">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center border-2 border-gray-900 shadow-3d">
                <LogIn className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              SmartHostel
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
              Navbatchilik Tizimi
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl animate-pulse">
                <p className="text-red-700 dark:text-red-400 font-bold text-sm">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Login Input */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                Login
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Login kiriting"
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan focus:outline-none transition-all font-medium placeholder-gray-500 dark:placeholder-gray-400"
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parol kiriting"
                  className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan focus:outline-none transition-all font-medium placeholder-gray-500 dark:placeholder-gray-400"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-primary text-white font-bold text-lg rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Kirish...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Kirish
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            SmartHostel v1.0.0 • Navbatchilik Tizimi
          </p>
        </div>
      </div>
    </div>
  );
}
