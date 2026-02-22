import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50 flex flex-col">
     
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      
      <div className="lg:ml-64 min-h-screen flex flex-col">
        
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      
        <footer className="border-t border-gray-200/30 bg-white/20 backdrop-blur-sm mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10 text-center text-sm text-gray-600">
            <p>© 2026 HR System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;

