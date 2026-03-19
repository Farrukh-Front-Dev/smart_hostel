import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <main className="flex-1 overflow-auto pt-20 pb-8 px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
