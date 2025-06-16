import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  CheckSquare, 
  LogOut,
  ChevronRight,
  User,
  Clock,
  Target,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import axios from 'axios';

const EmployeeSidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [employeeData, setEmployeeData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isProfileActive = location.pathname === '/Employee-Profile';
  
  useEffect(() => {
    fetchEmployeeDetails('Gracie Hamilton');
  }, [])

  const fetchEmployeeDetails = async (employeeName) => {
        try{
            const response = await axios.get(`http://localhost:3000/api/employee-details?name=${encodeURIComponent(employeeName)}`);
            
            const data = response.data;
            setEmployeeData(data);
        }
        catch(err){
            console.log("Error fetching employee details",err);
        }
  }

  const menuItems = [
    {
      id: 'Dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics',
      path: '/Employee-Dashboard'
    },
    {
      id: 'MyTasks',
      label: 'My Tasks',
      icon: CheckSquare,
      description: 'Active Assignments',
      path: '/Employee-Task-Management'
    },
    {
      id: 'TimeTracker',
      label: 'Time Tracker',
      icon: Clock,
      description: 'Log Work Hours',
      path: '/employee-time-tracker'
    },
    {
      id: 'Attendance',
      label: 'Attendance',
      icon: Calendar,
      description: 'Check In/Out & History',
      path: '/employee-attendance'
    },
    {
      id: 'Leave',
      label: 'Leave Management',
      icon: FileText,
      description: 'Apply & Track Leaves',
      path: '/employee-leave'
    },
    {
      id: 'Goals',
      label: 'My Goals',
      icon: Target,
      description: 'Performance Goals',
      path: '/employee-goals'
    },
    {
      id: 'Learning',
      label: 'Learning & Development',
      icon: BookOpen,
      description: 'Training Modules',
      path: '/employee-learning'
    },
    {
      id: 'Communication',
      label: 'Team Chat',
      icon: MessageSquare,
      description: 'Messages & Updates',
      path: '/employee-chat'
    }
  ];

  const handleMenuClick = (itemId, path) => {
    setActiveItem(itemId);
    navigate(path)
    // Navigation logic would go here
    console.log(`Navigating to: ${path}`);
  };

  const handleProfileClick = () => {
    navigate('/Employee-Profile');
    console.log('Navigating to: /Employee-Profile');
  };

  return (
    <div className="nav h-screen fixed top-0 left-0 bg-white w-80 shadow-2xl border-r border-slate-200/50 flex flex-col">
      {/* Header Section */}
      <div className="p-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-b border-blue-600">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-7 h-7 text-blue-700" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">Employee Portal</h1>
            <p className="text-blue-100 text-sm font-medium">Your Workspace Hub</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div 
  onClick={handleProfileClick}
  className={`flex items-center gap-3 p-3 group cursor-pointer rounded-lg border transition-all duration-300
    ${isProfileActive 
      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 border-blue-700 shadow-md scale-[1.02]' 
      : 'bg-white border-slate-200 hover:bg-slate-50 hover:shadow-lg'
    }`}
>
  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
    ${isProfileActive 
      ? 'bg-white/20' 
      : 'bg-gradient-to-br from-blue-500 to-blue-600'
    }`}
  >
    <div className='w-full h-full rounded-full overflow-hidden border-1 border-slate-200 shadow-xl'>
      <img  className='w-full h-full object-cover' src={employeeData?.profile_url || 'Img Not Found'}></img>
    </div>
  </div>

  <div className="flex-1">
    <p className={`font-semibold text-sm 
      ${isProfileActive ? 'text-white' : 'text-slate-800'}`}>
      {employeeData?.emp_name || `Not Found`}
    </p>
    <p className={`text-xs 
      ${isProfileActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-900'}`}>
      {employeeData?.department || `Not Found`}
    </p>
    <p className={`text-xs font-medium 
      ${isProfileActive ? 'text-emerald-300' : 'text-emerald-600 group-hover:text-emerald-500'}`}>
      ● Online
    </p>
  </div>
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
                onClick={() => handleMenuClick(item.id, item.path)}
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
        {/* Today's Summary */}
        <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Today's Summary</h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-blue-600">8.5h</p>
              <p className="text-xs text-slate-500">Hours Logged</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-600">3/5</p>
              <p className="text-xs text-slate-500">Tasks Done</p>
            </div>
          </div>
          <div className=" pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">This Week Progress</span>
              <span className="text-xs font-medium text-slate-700">85%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
              <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-1.5 rounded-full" style={{width: '85%'}}></div>
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

export default EmployeeSidebar;