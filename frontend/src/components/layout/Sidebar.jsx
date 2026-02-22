import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  CalendarPlus, 
  History, 
  User, 
  Users,
  ClipboardList,
  BarChart3,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();

  const employeeLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
    { to: '/apply-leave', icon: CalendarPlus, label: 'Apply Leave' },
    { to: '/leave-history', icon: History, label: 'Leave History' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: BarChart3, label: 'Dashboard' },
    { to: '/admin-employees', icon: Users, label: 'Employees' },
    { to: '/leave-history', icon: ClipboardList, label: 'Leave Requests' },
    { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64
          bg-white backdrop-blur-xl border-r border-white/40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
         
          <div className="flex items-center justify-between p-6 border-b border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">HR</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  HR System
                </h1>
                <p className="text-xs text-gray-500">Employee Management</p>
              </div>
            </div>

          
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-white/30 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>
          </div>

         
          <nav className="flex-1 p-5 space-y-3 overflow-y-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                  transition-all duration-300 
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-gray-700 hover:bg-white/50 hover:text-indigo-600 hover:shadow-md'
                  }
                `}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

         
          <div className="p-5 border-t border-white/30">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 backdrop-blur-sm hover:bg-white/50 transition-all">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize truncate">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
