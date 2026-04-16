import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import BoardNavbar from '../components/layout/navbar/BoardNavbar';
import Squares from '../components/common/Squares';
import { DateSelector, DutyGrid } from '../components/features/board';
import { useTheme, useLanguage } from './_app';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function DutyBoard() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [duties, setDuties] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadDuties();
    const interval = setInterval(loadDuties, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const loadDuties = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(`${API_URL}/api/duties/date/${dateStr}`);
      setDuties(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load duties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isTomorrow = selectedDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
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

      {/* Board Navbar */}
      <BoardNavbar 
        selectedDate={selectedDate}
        isToday={isToday}
        isTomorrow={isTomorrow}
        formatDate={formatDate}
        language={language}
      />

      {/* Main Content */}
      <div className="relative z-10 pb-6 px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Date Selector */}
          <DateSelector
            selectedDate={selectedDate}
            isToday={isToday}
            isTomorrow={isTomorrow}
            onDateChange={handleDateChange}
            onSetToday={() => setSelectedDate(new Date())}
            onSetTomorrow={() => setSelectedDate(new Date(Date.now() + 86400000))}
            formatDate={formatDate}
            language={language}
          />

          {/* Duties Grid */}
          <DutyGrid duties={duties} loading={loading} language={language} />
        </div>
      </div>
    </div>
  );
}
