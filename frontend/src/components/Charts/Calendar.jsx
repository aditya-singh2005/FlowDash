import React, { useState } from 'react';
import { Calendar, User, Heart, Briefcase, Star, ChevronLeft, ChevronRight, ChevronDown, Clock, MapPin } from 'lucide-react';

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Professional event categories with distinct colors
  const importantDates = {
    '2025-06-02': { type: 'meeting', title: 'Team Standup', color: 'bg-blue-500', icon: Briefcase, priority: 'high' },
    '2025-06-15': { type: 'project', title: 'Project Milestone', color: 'bg-green-500', icon: Star, priority: 'medium' },
    '2025-06-20': { type: 'urgent', title: 'Client Presentation', color: 'bg-red-500', icon: Clock, priority: 'high' },
    '2025-06-25': { type: 'review', title: 'Quarterly Review', color: 'bg-yellow-500', icon: MapPin, priority: 'medium' },
    '2025-07-01': { type: 'meeting', title: 'Board Meeting', color: 'bg-blue-500', icon: Briefcase, priority: 'high' },
    '2025-07-10': { type: 'project', title: 'Product Launch', color: 'bg-green-500', icon: Star, priority: 'high' },
    '2024-12-25': { type: 'urgent', title: 'Year-end Deadline', color: 'bg-red-500', icon: Clock, priority: 'high' },
    '2024-01-01': { type: 'review', title: 'Annual Planning', color: 'bg-yellow-500', icon: MapPin, priority: 'medium' },
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
      const event = importantDates[dateKey];
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <div
          key={day}
          className={`h-15 border-b border-r border-gray-200 p-2 cursor-pointer transition-all duration-200 relative hover:bg-gray-50 ${
            isToday 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-white'
          }`}
          onClick={() => setSelectedDate({ day, event, dateKey })}
          onMouseEnter={(e) => event && handleMouseEnter(dateKey, e)}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`text-sm font-medium ${
            isToday 
              ? 'text-blue-600' 
              : event 
                ? 'text-gray-900' 
                : 'text-gray-700'
          }`}>
            {day}
          </div>
          {event && (
            <>
              <div className={`absolute bottom-2 left-2 right-2 h-1 rounded-sm ${event.color}`}></div>
              <div className="absolute top-2 right-2">
                {React.createElement(event.icon, { size: 12, className: "text-gray-400" })}
              </div>
              {event.priority === 'high' && (
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

  const getEventTypeLabel = (type) => {
    const types = {
      meeting: 'Meeting',
      project: 'Project',
      urgent: 'Urgent',
      review: 'Review'
    };
    return types[type] || type;
  };

  return (
    <div className="w-full h-full bg-white rounded-3xl p-2 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-1 border-b border-gray-200 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-900 rounded-xl ">
            <Calendar size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Calendar</h1>
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
            <div key={day} className=" py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 ">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredDate && importantDates[hoveredDate] && (
        <div 
          className="fixed pointer-events-none z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y - 10}px`,
          }}
        >
          <div className="flex items-center gap-2 ">
            {React.createElement(importantDates[hoveredDate].icon, { size: 14 })}
            <span className="font-medium">{importantDates[hoveredDate].title}</span>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {hoveredDate} • {getEventTypeLabel(importantDates[hoveredDate].type)}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedDate && selectedDate.event && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedDate(null)}>
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl border border-gray-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${selectedDate.event.color}`}>
                {React.createElement(selectedDate.event.icon, { size:20, className: "text-white" })}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
                <p className="text-sm text-gray-500">
                  {selectedDate.event.priority === 'high' && '🔴 High Priority'}
                  {selectedDate.event.priority === 'medium' && '🟡 Medium Priority'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Date:</span>
                <span className="text-sm text-gray-900">{selectedDate.dateKey}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Event:</span>
                <span className="text-sm text-gray-900">{selectedDate.event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Category:</span>
                <span className={`text-sm px-2 py-1 rounded text-white ${selectedDate.event.color}`}>
                  {getEventTypeLabel(selectedDate.event.type)}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedDate(null)}
              className="mt-4 w-full px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      { /* Upcoming Events Sidebar */ }
      <div className="p-4 border-slate-400 border-2 rounded-3xl">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Upcoming Events</h3>
        </div>
        
        <div className="space-y-3 max-h-41 overflow-y-auto">
          {Object.entries(importantDates)
            .filter(([date]) => new Date(date) >= new Date())
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .slice(0, 5)
            .map(([date, event]) => (
              <div key={date} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                <div className="flex items-center gap-2 min-w-0">
                  {React.createElement(event.icon, { size:14, className: "text-gray-400 flex-shrink-0" })}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {event.priority === 'high' && (
                        <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{event.title}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded text-white ${event.color} flex-shrink-0`}>
                  {getEventTypeLabel(event.type)}
                </span>
              </div>
            ))}
        </div>
        
         {/* // legend // */}
        {/* <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-600 mb-3">LEGEND</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-gray-600">Meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-gray-600">Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-gray-600">Urgent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="text-gray-600">Reviews</span>
            </div>
          </div>
        </div> */}
      </div> 
    </div>
  );
};

export default CalendarComponent;