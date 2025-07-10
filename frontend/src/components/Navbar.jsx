import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  User
} from 'lucide-react';

const ProfessionalSidebar = () => {
  const [activeItem, setActiveItem] = useState('Overview');
  const navigate = useNavigate();
  const location = useLocation();
  const isProfileActive = location.pathname === '/Admin-Profile';
  
  const menuItems = [
    {
      id: 'Overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics',
      path: '/Admin-Dashboard'
    },
    {
      id: 'Tasks',
      label: 'Task Management',
      icon: CheckSquare,
      description: 'Project Assignments',
      path: '/Admin-Task-Management'
    },
    {
      id: 'Employees',
      label: 'Employee List',
      icon: Users,
      description: 'Manage Staff Records',
      path: '/admin-employees-list'
    },
    {
      id: 'Department',
      label: 'Departments',
      icon: Building2,
      description: 'Organizational Structure',
      path: '/admin-employee-departments'
    },
    {
      id: 'Attendance',
      label: 'Attendance Tracking',
      icon: Calendar,
      description: 'Time & Attendance',
      path: '/admin-attendance-tracking'
    },
    { 
      id: 'Leave',
      label: 'Leave Management',
      icon: FileText,
      description: 'Requests & Approvals',
      path: '/admin-leaves-tracking'
    }
  ];

  // Update active item based on current route
  useEffect(() => {
    const currentMenuItem = menuItems.find(item => item.path === location.pathname);
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.id);
    }
  }, [location.pathname]);

  const handleMenuClick = (itemId, path) => {
    setActiveItem(itemId);
    navigate(path);
    console.log(`Navigating to: ${path}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="nav h-screen fixed top-0 left-0 bg-blue-100 w-80 shadow-2xl border-r border-slate-200/50 flex flex-col">
      {/* Header Section */}
      <div className="p-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-b border-blue-600">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-7 h-7 text-blue-700" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">FlowDash Admin</h1>
            <p className="text-blue-100 text-sm font-medium">Employee Management System</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 bg-blue-100 border-b-1 border-slate-300 shadow-2xl">
        <div 
          className={`flex items-center gap-3 p-3 group cursor-pointer rounded-lg border transition-all duration-300
            ${isProfileActive 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-700 border-blue-700 shadow-md scale-[1.02]' 
              : 'border-slate-200 bg-white/90 hover:bg-slate-50 hover:scale-102 hover:shadow-lg'
            }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
            ${isProfileActive 
              ? 'bg-white/20' 
              : 'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}
          >
            <div className='w-full h-full rounded-full overflow-hidden border-1 border-slate-200 shadow-xl'>
              <img 
                className='w-full h-full object-cover' 
                src="https://demos.creative-tim.com/soft-ui-dashboard-react/static/media/bruce-mars.45f6477957606abd2f24.jpg"
                alt="Admin User"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full items-center justify-center hidden">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <p className={`font-semibold text-sm 
              ${isProfileActive ? 'text-white' : 'text-slate-800'}`}>
              Admin User
            </p>
            <p className={`text-xs 
              ${isProfileActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-900'}`}>
              System Administrator
            </p>
            <p className={`text-xs font-medium 
              ${isProfileActive ? 'text-emerald-300' : 'text-emerald-600 group-hover:text-emerald-500'}`}>
              ● Online
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto bg-blue-100">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <div
                key={item.id}
                onClick={() => handleMenuClick(item.id, item.path)}
                className={`
                  group relative flex items-center gap-4 p-4 border border-white shadow-lg rounded-xl cursor-pointer transition-all duration-200 
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-800 text-white shadow-lg shadow-blue-600/25 transform scale-[1.02]' 
                    : 'text-slate-600 bg-white hover:bg-gradient-to-r from-blue-300 to-indigo-500 hover:text-slate-800 hover:shadow-md'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                  ${isActive 
                    ? 'bg-white/20 shadow-inner' 
                    : 'bg-slate-100 group-hover:bg-slate-200'
                  }
                `}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-700'}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-800'}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-900'}`}>
                    {item.description}
                  </p>
                </div>
                
                <ChevronRight className={`
                  w-4 h-4 transition-all duration-200 
                  ${isActive 
                    ? 'text-white transform rotate-90' 
                    : 'text-slate-400 group-hover:text-slate-600 group-hover:transform group-hover:translate-x-1'
                  }
                `} />
                
                {isActive && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="p-3 border-t border-slate-300 bg-blue-100">
        {/* Quick Stats */}
        <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-blue-700">248</p>
              <p className="text-xs text-slate-600">Active Employees</p>
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-600">94%</p>
              <p className="text-xs text-slate-600">Attendance Rate</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 border border-slate-300 bg-white text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors duration-200">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm">Sign Out</p>
            <p className="text-xs text-red-500">End current session</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProfessionalSidebar;