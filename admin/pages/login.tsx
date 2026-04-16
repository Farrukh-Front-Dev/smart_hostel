import { useState } from 'react';
import { useRouter } from 'next/router';
import { LogIn, Eye, EyeOff, ArrowLeft, Sun, Moon } from 'lucide-react';
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

  const handleBack = () => {
    router.push('/board');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = credentials.users.find(
        (u) => u.login === login && u.password === password
      );

      if (!user) {
        setError('Login yoki password noto\'g\'ri');
        setLoading(false);
        return;
      }

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', login);
      window.location.href = '/';
    } catch (err) {
      setError('Xatolik yuz berdi');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-100 pointer-events-none z-0">
        <Squares
          direction="diagonal"
          speed={0.2}
          borderColor={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}
          squareSize={60}
          hoverFillColor={isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)"}
        />
      </div>

      {/* Top Controls */}
      <div className="fixed top-4 left-4 right-4 z-20 flex items-center justify-between">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-900 dark:text-white rounded-xl border-2 border-gray-900 dark:border-white/20 hover:shadow-3d-sm transition-all"
          aria-label="Orqaga"
        >
          <ArrowLeft size={20} />
          <span className="font-bold text-sm hidden sm:inline">Orqaga</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-900 dark:text-white rounded-xl border-2 border-gray-900 dark:border-white/20 hover:shadow-3d-sm transition-all"
          aria-label="Theme toggle"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mt-16 sm:mt-0">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-gray-900 dark:border-white/20 shadow-3d-lg">
          {/* Logo Section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-primary flex items-center justify-center border-2 border-gray-900 shadow-3d">
                <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              SmartHostel
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-semibold text-base sm:text-lg">
              Navbatchilik Tizimi
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-xl">
                <p className="text-red-700 dark:text-red-400 font-bold text-sm text-center">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Login Input */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Login
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Login kiriting"
                className="w-full px-4 py-3 border-2 border-gray-900 dark:border-white/20 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan focus:outline-none transition-all font-medium placeholder-gray-500 dark:placeholder-gray-400"
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parol kiriting"
                  className="w-full px-4 py-3 border-2 border-gray-900 dark:border-white/20 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan focus:outline-none transition-all font-medium placeholder-gray-500 dark:placeholder-gray-400"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-primary text-black font-bold text-lg rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                  <span>Kirish...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Kirish</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            SmartHostel v1.0.0 • Navbatchilik Tizimi
          </p>
        </div>
      </div>
    </div>
  );
}
