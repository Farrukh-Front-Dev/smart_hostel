import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating squares */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary opacity-10 rounded-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-pink opacity-10 rounded-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-cyan opacity-5 rounded-2xl animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center">
        {/* 3D Cube Animation */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-24 h-24">
            {/* Cube faces */}
            <div className="absolute inset-0 border-4 border-primary-cyan rounded-lg animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 border-2 border-accent-pink rounded-lg animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
            <div className="absolute inset-4 border-2 border-primary-cyan rounded-lg animate-pulse" />
            
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            SmartHostel
          </h1>
          <p className="text-lg text-gray-400 font-medium">
            Tizim yuklanyapti{dots}
          </p>
          <p className="text-sm text-gray-500">
            Iltimos, kutib turing
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-64 h-1 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
          <div className="h-full bg-gradient-primary rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>

        {/* Status indicators */}
        <div className="mt-8 flex justify-center gap-3">
          <div className="w-2 h-2 bg-primary-cyan rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-primary-cyan rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
