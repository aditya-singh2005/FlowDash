import React from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const TaskCompletionStatus = () => {

  const employees = [
    {
      id: 1,
      name: "Sarah Johnson",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      task: "Q4 Financial Report Analysis",
      department: "Finance",
      dueDate: "2025-06-15",
      completion: 85,
      status: "on-track"
    },
    {
      id: 2,
      name: "Michael Chen",
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      task: "Mobile App UI Redesign",
      department: "Design",
      dueDate: "2025-06-08",
      completion: 92,
      status: "ahead"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      task: "Customer Database Migration",
      department: "IT",
      dueDate: "2025-06-05",
      completion: 45,
      status: "behind"
    },
    {
      id: 4,
      name: "David Park",
      profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      task: "Marketing Campaign Launch",
      department: "Marketing",
      dueDate: "2025-06-12",
      completion: 78,
      status: "on-track"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
      task: "Quarterly Sales Review",
      department: "Sales",
      dueDate: "2025-06-10",
      completion: 100,
      status: "completed"
    },
    {
      id: 6,
      name: "James Wilson",
      profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      task: "HR Policy Documentation",
      department: "Human Resources",
      dueDate: "2025-06-20",
      completion: 35,
      status: "behind"
    }
  ];

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'ahead': return 'text-blue-600 bg-blue-100';
      case 'on-track': return 'text-yellow-600 bg-yellow-100';
      case 'behind': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (completion, status) => {
    if (completion === 100) return 'bg-green-500';
    if (status === 'behind') return 'bg-red-500';
    if (status === 'ahead') return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'behind': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div class='section4 bg-gray-800 w-full mt-4 rounded-lg shadow-lg'>
        <div class='bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 w-full px-6 py-5 rounded-t-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div class='flex flex-col space-y-1'>
                <h1 class="text-white font-bold text-2xl tracking-tight">Task Completion Status</h1>
                <p class='text-indigo-100 font-medium text-base'>Recent 5 Tasks Overview</p>
            </div>
            <div>
                <button class='bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/50 hover:border-white/30 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2'>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Detailed Report
                </button>
            </div>
        </div>
      
      <div className="bg-white rounded-b-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {employees.map((employee) => {
            const daysLeft = getDaysUntilDue(employee.dueDate);
            
            return (
              <div key={employee.id} className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    <img
                      src={employee.profilePic}
                      alt={employee.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                  
                  {/* Employee Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 truncate">{employee.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{employee.task}</p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                        {getStatusIcon(employee.status)}
                        <span className="capitalize">{employee.status.replace('-', ' ')}</span>
                      </div>
                    </div>
                    
                    {/* Department and Due Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Dept:</span>
                        <span>{employee.department}</span>
                      </div>
                      <div className="hidden sm:block">•</div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{employee.dueDate}</span>
                        <span className={`ml-1 ${daysLeft < 0 ? 'text-red-600' : daysLeft <= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                          ({daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`})
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-semibold text-gray-900">{employee.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(employee.completion, employee.status)}`}
                          style={{ width: `${employee.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary Footer */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {employees.filter(emp => emp.status === 'completed').length}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {employees.filter(emp => emp.status === 'ahead').length}
              </div>
              <div className="text-xs text-gray-600">Ahead</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {employees.filter(emp => emp.status === 'on-track').length}
              </div>
              <div className="text-xs text-gray-600">On Track</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {employees.filter(emp => emp.status === 'behind').length}
              </div>
              <div className="text-xs text-gray-600">Behind</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionStatus;