import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 30;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-primary opacity-5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent-pink opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-md px-6">
        {/* School 21 Logo / Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-32 h-32">
            {/* Rotating rings */}
            <div className="absolute inset-0 border-2 border-transparent border-t-primary-cyan border-r-primary-cyan rounded-full animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-4 border-2 border-transparent border-b-accent-pink border-l-accent-pink rounded-full animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
            
            {/* Center hexagon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-cyan to-accent-pink rounded-lg transform rotate-45 opacity-80 shadow-lg shadow-primary-cyan/50" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3 mb-8">
          <h1 className="text-5xl font-black text-white tracking-tight">
            SmartHostel
          </h1>
          <p className="text-sm font-bold text-primary-cyan uppercase tracking-widest">
            School 21 Tashkent
          </p>
        </div>

        {/* Status text */}
        <div className="space-y-2 mb-8">
          <p className="text-lg font-semibold text-gray-300">
            Tizim yuklanyapti
          </p>
          <p className="text-sm text-gray-500">
            Navbatchilik tizimi tayyorlanmoqda...
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-primary-cyan to-accent-pink rounded-full transition-all duration-300 shadow-lg shadow-primary-cyan/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{Math.round(progress)}%</p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-primary-cyan rounded-full animate-bounce shadow-lg shadow-primary-cyan/50" />
          <div className="w-2 h-2 bg-accent-pink rounded-full animate-bounce shadow-lg shadow-accent-pink/50" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-primary-cyan rounded-full animate-bounce shadow-lg shadow-primary-cyan/50" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Footer text */}
        <p className="text-xs text-gray-600 mt-8">
          Iltimos, kutib turing...
        </p>
      </div>
    </div>
  );
}
