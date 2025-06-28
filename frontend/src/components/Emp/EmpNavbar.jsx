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

const EmployeeSidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isProfileActive = location.pathname === '/Employee-Profile';
  
  const BASE_URl = "https://ems2-backend.onrender.com"

  useEffect(() => {
    fetchEmployeeDetails();
  }, [])

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making request to /api/employee-details...');
      
      // Fetch employee details using the token
      const response = await fetch(`${BASE_URl}/api/employee-details`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      console.log('Employee name from data:', data?.emp_name);
      
      setEmployeeData(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching employee details", error);
      setError(error.message);
      
      // If authentication error, you might want to redirect to login
      if (error.message.includes('Authentication failed') || error.message.includes('No authentication token')) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
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
            <User className="w-7 h-7 text-blue-700" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">FlowDash </h1>
            <p className="text-blue-100 text-sm font-medium">Streamline Your Workforce</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 bg-blue-100 border-b-1 border-slate-300 shadow-2xl">
        <div 
          onClick={handleProfileClick}
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
              {loading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-full"></div>
              ) : error ? (
                <User className="w-6 h-6 text-white" />
              ) : (
                <img 
                  className='w-full h-full object-cover' 
                  src={employeeData?.profile_url || "https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"}
                  alt={employeeData?.emp_name || 'Employee'}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              )}
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full items-center justify-center hidden">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <p className={`font-semibold text-sm 
              ${isProfileActive ? 'text-white' : 'text-slate-800'}`}>
              {loading ? (
                <span className="animate-pulse bg-gray-300 h-4 w-24 rounded block"></span>
              ) : error ? (
                'Login Required'
              ) : (
                employeeData?.emp_name || 'Not Found'
              )}
            </p>
            <p className={`text-xs 
              ${isProfileActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-900'}`}>
              {loading ? (
                <span className="animate-pulse bg-gray-300 h-3 w-16 rounded block mt-1"></span>
              ) : error ? (
                'Please login'
              ) : (
                employeeData?.department || employeeData?.role || 'Not Found'
              )}
            </p>
            <p className={`text-xs font-medium 
              ${isProfileActive ? 'text-emerald-300' : 'text-emerald-600 group-hover:text-emerald-500'}`}>
              {!error && !loading && '● Online'}
              {error && '● Offline'}
              {loading && '● Loading...'}
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

export default EmployeeSidebar;