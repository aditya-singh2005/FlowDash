import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
   const menuItems = [
    {
      id: 'Overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics',
      path: '/Admin-Dashboard'
    },
    {
      id: 'Employees',
      label: 'Employee Management',
      icon: Users,
      description: 'Manage Staff Records',
      path: '/employees'
    },
    {
      id: 'Department',
      label: 'Departments',
      icon: Building2,
      description: 'Organizational Structure',
      path: '/departments'
    },
    {
      id: 'Attendance',
      label: 'Attendance Tracking',
      icon: Calendar,
      description: 'Time & Attendance',
      path: '/attendance'
    },
    { 
      id: 'Leave',
      label: 'Leave Management',
      icon: FileText,
      description: 'Requests & Approvals',
      path: '/leave'
    },
    {
      id: 'Tasks',
      label: 'Task Management',
      icon: CheckSquare,
      description: 'Project Assignments',
      path: '/Admin-Task-Management' // <-- Important
    },
    {
      id: 'Settings',
      label: 'System Settings',
      icon: Settings,
      description: 'Configuration',
      path: '/settings'
    }
  ];

  const handleMenuClick = (itemId, path) => {
    setActiveItem(itemId);
    navigate(path);
  };

  return (
    <div className="nav h-screen fixed top-0 left-0 bg-white w-80 shadow-2xl border-r border-slate-200/50 flex flex-col">
      {/* Header Section */}
      <div className="p-4 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-7 h-7 text-slate-700" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">HR Portal</h1>
            <p className="text-slate-300 text-sm font-medium">Employee Management System</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800 text-sm">Admin User</p>
            <p className="text-slate-500 text-xs">System Administrator</p>
          </div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <div
                key={item.id}
                onClick={() => handleMenuClick(item.id,item.path)}
                className={`
                  group relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-800 text-white shadow-lg shadow-blue-600/25 transform scale-[1.02]' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:shadow-md'
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
                  <p className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-600'}`}>
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
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        {/* Quick Stats */}
        <div className="mb-4 p-2 bg-white rounded-lg border border-slate-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-800">248</p>
              <p className="text-xs text-slate-500">Active Employees</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">94%</p>
              <p className="text-xs text-slate-500">Attendance Rate</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full flex items-center gap-3 p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group">
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