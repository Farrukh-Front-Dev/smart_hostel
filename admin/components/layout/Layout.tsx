import { ReactNode } from 'react';
import Sidebar from './sidebar/Sidebar';
import Navbar from './navbar/Navbar';
import Squares from '../common/Squares';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
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
      <div className="relative z-10">
        <Sidebar />
        <div className="lg:pl-64">
          <Navbar />
          <main className="pt-20 sm:pt-24 py-4 px-3 sm:py-6 sm:px-4 lg:py-8 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
