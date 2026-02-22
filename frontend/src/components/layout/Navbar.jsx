import { Menu, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/40 backdrop-blur-xl border-b border-white/50 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        
        <div className="flex items-center gap-4 sm:gap-6 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/40 rounded-lg transition-colors text-gray-700 hover:text-gray-900"
            title="Menu"
          >
            <Menu size={24} />
          </button>
          
          
          <div className="hidden md:block flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/40 border border-white/60 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                       placeholder-gray-500 text-sm transition-all hover:bg-white/50"
            />
          </div>
        </div>

      
        <div className="flex items-center gap-3 sm:gap-5">
        
          <button className="relative p-2 hover:bg-white/40 rounded-lg transition-colors text-gray-700 hover:text-gray-900" title="Notifications">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

         
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors border border-white/20">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          
         
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 
                     rounded-lg transition-colors font-medium text-sm border border-red-200/50 hover:border-red-300/50 cursor-pointer"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
