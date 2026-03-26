import { useState, useEffect } from 'react';

export default function NavbarClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden sm:flex items-center gap-1.5 text-gray-900 dark:text-white font-bold text-xs sm:text-sm">
      <span className="text-xs">🕐</span>
      <span>{time}</span>
    </div>
  );
}
