import React, { useState } from 'react';
import { Calendar, User, Clock, Users, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, MapPin } from 'lucide-react';

const AttendanceTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Employee attendance data with professional categories
  const attendanceData = {
    '2025-06-02': { type: 'present', status: 'On Time', color: 'bg-green-500', icon: CheckCircle, priority: 'normal', hours: '9.0' },
    '2025-06-03': { type: 'late', status: 'Late Arrival', color: 'bg-yellow-500', icon: AlertCircle, priority: 'medium', hours: '8.5' },
    '2025-06-04': { type: 'absent', status: 'Absent', color: 'bg-red-500', icon: XCircle, priority: 'high', hours: '0.0' },
    '2025-06-05': { type: 'present', status: 'On Time', color: 'bg-green-500', icon: CheckCircle, priority: 'normal', hours: '9.0' },
    '2025-06-06': { type: 'holiday', status: 'Holiday', color: 'bg-purple-500', icon: Calendar, priority: 'normal', hours: 'N/A' },
    '2025-06-09': { type: 'present', status: 'On Time', color: 'bg-green-500', icon: CheckCircle, priority: 'normal', hours: '9.0' },
    '2025-06-10': { type: 'late', status: 'Late Arrival', color: 'bg-yellow-500', icon: AlertCircle, priority: 'medium', hours: '7.5' },
    '2025-06-11': { type: 'present', status: 'On Time', color: 'bg-green-500', icon: CheckCircle, priority: 'normal', hours: '9.0' },
    '2025-06-12': { type: 'halfday', status: 'Half Day', color: 'bg-blue-500', icon: Clock, priority: 'normal', hours: '4.5' },
    '2025-06-13': { type: 'present', status: 'On Time', color: 'bg-green-500', icon: CheckCircle, priority: 'normal', hours: '9.0' },
    '2025-06-16': { type: 'present', status: 'On Time', color: 'bg-green-500', icon: CheckCircle, priority: 'normal', hours: '9.0' },
    '2025-06-17': { type: 'absent', status: 'Sick Leave', color: 'bg-red-500', icon: XCircle, priority: 'high', hours: '0.0' },
    '2025-06-18': { type: 'present', status: 'On Time', color: 'bg-green-500', icon: CheckCircle, priority: 'normal', hours: '9.0' },
    '2025-06-19': { type: 'late', status: 'Late Arrival', color: 'bg-yellow-500', icon: AlertCircle, priority: 'medium', hours: '8.0' },
    '2025-06-20': { type: 'present', status: 'On Time', color: 'bg-green-500', icon: CheckCircle, priority: 'normal', hours: '9.0' },
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const navigateToYear = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearPicker(false);
  };

  const handleMouseEnter = (dateKey, e) => {
    setHoveredDate(dateKey);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  const renderYearPicker = () => {
    const currentYear = currentDate.getFullYear();
    const years = [];
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      years.push(year);
    }

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
        {years.map(year => (
          <button
            key={year}
            onClick={() => navigateToYear(year)}
            className={`w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
              year === currentYear ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-700'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 border-b border-r border-gray-200 bg-gray-25"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
      const attendance = attendanceData[dateKey];
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <div
          key={day}
          className={`h-15 border-b border-r border-gray-200 p-2 cursor-pointer transition-all duration-200 relative hover:bg-gray-50 ${
            isToday 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-white'
          }`}
          onClick={() => setSelectedDate({ day, attendance, dateKey })}
          onMouseEnter={(e) => attendance && handleMouseEnter(dateKey, e)}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`text-sm font-medium ${
            isToday 
              ? 'text-blue-600' 
              : attendance 
                ? 'text-gray-900' 
                : 'text-gray-700'
          }`}>
            {day}
          </div>
          {attendance && (
            <>
              <div className={`absolute bottom-2 left-2 right-2 h-1 rounded-sm ${attendance.color}`}></div>
              <div className="absolute top-2 right-2">
                {React.createElement(attendance.icon, { 
                  size: 12, 
                  className: `${
                    attendance.type === 'present' ? 'text-green-500' :
                    attendance.type === 'absent' ? 'text-red-500' :
                    attendance.type === 'late' ? 'text-orange-500' :
                    attendance.type === 'halfday' ? 'text-blue-500' :
                    attendance.type === 'holiday' ? 'text-purple-500' :
                    'text-gray-400'
                  }` 
                })}
              </div>
              {attendance.priority === 'high' && (
                <div className="absolute top-1 left-1 w-2 h-2 bg-orange-400 rounded-full"></div>
              )}
            </>
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getAttendanceTypeLabel = (type) => {
    const types = {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      halfday: 'Half Day',
      holiday: 'Holiday'
    };
    return types[type] || type;
  };

  const getAttendanceStats = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthlyData = Object.entries(attendanceData).filter(([date]) => {
      const d = new Date(date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const stats = {
      present: monthlyData.filter(([, data]) => data.type === 'present').length,
      absent: monthlyData.filter(([, data]) => data.type === 'absent').length,
      late: monthlyData.filter(([, data]) => data.type === 'late').length,
      halfday: monthlyData.filter(([, data]) => data.type === 'halfday').length,
      total: monthlyData.length
    };

    return stats;
  };

  const stats = getAttendanceStats();

  return (
    <div className="w-full h-full bg-white rounded-3xl p-2 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-1 border-b border-gray-200 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Attendance Tracker</h1>
            <p className="text-xs text-gray-500">Employee: John Doe | ID: EMP001</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowYearPicker(!showYearPicker)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 min-w-40 justify-center"
            >
              <span className="font-medium text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${showYearPicker ? 'rotate-180' : ''}`} />
            </button>
            {showYearPicker && renderYearPicker()}
          </div>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border-b border-gray-200 mb-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-gray-50">
          {dayNames.map(day => (
            <div key={day} className="py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredDate && attendanceData[hoveredDate] && (
        <div 
          className="fixed pointer-events-none z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y - 10}px`,
          }}
        >
          <div className="flex items-center gap-2">
            {React.createElement(attendanceData[hoveredDate].icon, { size: 14 })}
            <span className="font-medium">{attendanceData[hoveredDate].status}</span>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {hoveredDate} • {attendanceData[hoveredDate].hours !== 'N/A' ? `${attendanceData[hoveredDate].hours} hrs` : 'Holiday'}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Attendance Details Modal */}
      {selectedDate && selectedDate.attendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedDate(null)}>
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl border border-gray-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${selectedDate.attendance.color}`}>
                {React.createElement(selectedDate.attendance.icon, { size: 20, className: "text-white" })}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Attendance Details</h3>
                <p className="text-sm text-gray-500">
                  {selectedDate.attendance.priority === 'high' && '🔴 Requires Attention'}
                  {selectedDate.attendance.priority === 'medium' && '🟡 Minor Issue'}
                  {selectedDate.attendance.priority === 'normal' && '✅ Normal'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Date:</span>
                <span className="text-sm text-gray-900">{selectedDate.dateKey}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <span className="text-sm text-gray-900">{selectedDate.attendance.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Hours Worked:</span>
                <span className="text-sm text-gray-900">{selectedDate.attendance.hours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Category:</span>
                <span className={`text-sm px-2 py-1 rounded text-white ${selectedDate.attendance.color}`}>
                  {getAttendanceTypeLabel(selectedDate.attendance.type)}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedDate(null)}
              className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Monthly Summary */}
      <div className="p-4 border-slate-400 border-2 rounded-3xl">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Monthly Summary</h3>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">Present</span>
            </div>
            <p className="text-lg font-bold text-green-600">{stats.present}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="flex items-center gap-2">
              <XCircle size={14} className="text-red-600" />
              <span className="text-sm font-medium text-red-800">Absent</span>
            </div>
            <p className="text-lg font-bold text-red-600">{stats.absent}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Late</span>
            </div>
            <p className="text-lg font-bold text-orange-600">{stats.late}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Half Day</span>
            </div>
            <p className="text-lg font-bold text-blue-600">{stats.halfday}</p>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
            <span className="text-sm font-bold text-green-600">
              {stats.total > 0 ? Math.round(((stats.present + stats.halfday * 0.5) / stats.total) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.total > 0 ? ((stats.present + stats.halfday * 0.5) / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;