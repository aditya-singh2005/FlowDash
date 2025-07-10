import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import EmpNavbar from './EmpNavbar';
import axios from 'axios';

const EmpAttendanceTracking = () => {
    const [selectedView, setSelectedView] = useState('monthly');
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);
    const [todayStatus, setTodayStatus] = useState('Not Marked');
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [employeeData, setEmployeeData] = useState(null);
    const [todayAttendance, setTodayAttendance] = useState(null);
    
    // Office timings
    const OFFICE_START_TIME = '09:00';
    const OFFICE_END_TIME = '18:00';
    const LATE_THRESHOLD = '09:30';
    
    // Helper function to safely parse dates
    const parseDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    };
    
    // Helper function to safely create date from date and time strings
    const createDateTime = (dateStr, timeStr) => {
        if (!dateStr || !timeStr) return null;
        
        try {
            // Ensure dateStr is in YYYY-MM-DD format
            const normalizedDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
            const dateTime = new Date(`${normalizedDate}T${timeStr}`);
            return isNaN(dateTime.getTime()) ? null : dateTime;
        } catch (error) {
            console.error('Error creating date time:', error);
            return null;
        }
    };
    
    // Get employee data from token
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const userData = JSON.parse(localStorage.getItem('user'));
            
            if (token && userData) {
                try {
                    // Get basic info from token
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    
                    // Fetch additional user details from API
                    const response = await axios.get(`http://localhost:3000/api/employees/${userData.id}`);
                    const fullUserData = { 
                        ...userData, 
                        ...response.data.employee,
                        department: response.data.employee?.department || userData.department || 'No department'
                    };
                    
                    setEmployeeData(fullUserData);
                    fetchTodayAttendance(fullUserData.id);
                    fetchAttendanceHistory(fullUserData.id);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    // Fallback to basic user data if API fails
                    setEmployeeData({
                        ...userData,
                        department: userData.department || 'No department'
                    });
                    fetchTodayAttendance(userData.id);
                    fetchAttendanceHistory(userData.id);
                }
            } else {
                setMessage('Error: No authentication token found');
            }
        };

        fetchUserData();
    }, []);
    
    // Fetch today's attendance status
    const fetchTodayAttendance = async (empId) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`http://localhost:3000/api/attendance/today/${empId}?date=${today}`);
            
            if (!response.ok) throw new Error('Failed to fetch today attendance');
            
            const data = await response.json();
            
            if (data.attendance) {
                const attendance = data.attendance;
                setTodayAttendance(attendance);
                
                // Determine status based on check-in time
                let status = 'Absent';
                if (attendance.check_in) {
                    const checkInDate = createDateTime(attendance.date, attendance.check_in);
                    if (checkInDate) {
                        status = getAttendanceStatus(checkInDate);
                    }
                }
                setTodayStatus(status);
                
                // Set check-in/check-out times
                if (attendance.check_in) {
                    const checkInDate = createDateTime(attendance.date, attendance.check_in);
                    setCheckInTime(checkInDate);
                    setIsCheckedIn(!attendance.check_out);
                } else {
                    setCheckInTime(null);
                    setIsCheckedIn(false);
                }
                
                if (attendance.check_out) {
                    const checkOutDate = createDateTime(attendance.date, attendance.check_out);
                    setCheckOutTime(checkOutDate);
                } else {
                    setCheckOutTime(null);
                }
            } else {
                // No attendance record for today
                setTodayAttendance(null);
                setTodayStatus('Not Marked');
                setIsCheckedIn(false);
                setCheckInTime(null);
                setCheckOutTime(null);
            }
        } catch (error) {
            console.error('Error fetching today attendance:', error);
            setMessage('Error fetching today\'s attendance');
        }
    };
    
    // Fetch attendance history
    const fetchAttendanceHistory = async (empId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/attendance/history/${empId}`);
            
            if (!response.ok) throw new Error('Failed to fetch attendance history');
            
            const data = await response.json();
            setAttendanceHistory(data.attendance || []);
        } catch (error) {
            console.error('Error fetching attendance history:', error);
            setMessage('Error fetching attendance history');
        }
    };
    
    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    
    // Format time for display
    const formatTime = (date) => {
        if (!date || isNaN(date.getTime())) return '-';
        
        try {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error('Error formatting time:', error);
            return '-';
        }
    };
    
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        
        try {
            const date = parseDate(dateString);
            if (!date) return '-';
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return '-';
        }
    };
    
    // Determine attendance status based on check-in time
    const getAttendanceStatus = (checkInDate) => {
        if (!checkInDate || isNaN(checkInDate.getTime())) return 'Absent';
        
        try {
            const checkInTime = checkInDate.toTimeString().slice(0, 5);
            
            if (checkInTime > LATE_THRESHOLD) {
                return 'Late';
            } else {
                return 'Present';
            }
        } catch (error) {
            console.error('Error determining attendance status:', error);
            return 'Absent';
        }
    };
    
    // Calculate working hours between two times
    const calculateWorkingHours = (checkIn, checkOut) => {
        if (!checkIn || isNaN(checkIn.getTime())) return '0:00';
        
        try {
            const endTime = checkOut && !isNaN(checkOut.getTime()) ? checkOut : new Date();
            const diffMs = endTime.getTime() - checkIn.getTime();
            
            // Ensure positive difference
            if (diffMs < 0) return '0:00';
            
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            
            return `${hours}:${minutes.toString().padStart(2, '0')}`;
        } catch (error) {
            console.error('Error calculating working hours:', error);
            return '0:00';
        }
    };
    
    // Handle check-in
    const handleCheckIn = async () => {
        if (!employeeData) {
            setMessage('Error: Employee data not loaded');
            return;
        }
        
        const now = new Date();
        const status = getAttendanceStatus(now);
        
        setLoading(true);
        setMessage('');
        
        try {
            const response = await fetch('http://localhost:3000/api/attendance/check-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    emp_id: employeeData.id,
                    timestamp: now.toISOString(),
                    status: status
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to check in');
            }
            
            setMessage('Checked in successfully!');
            setCheckInTime(now);
            setIsCheckedIn(true);
            setTodayStatus(status);
            
            // Refresh data
            fetchTodayAttendance(employeeData.id);
            fetchAttendanceHistory(employeeData.id);
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.message);
            console.error('Check-in error:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // Handle check-out
    const handleCheckOut = async () => {
        if (!employeeData) {
            setMessage('Error: Employee data not loaded');
            return;
        }
        
        const now = new Date();
        
        setLoading(true);
        setMessage('');
        
        try {
            const response = await fetch('http://localhost:3000/api/attendance/check-out', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    emp_id: employeeData.id,
                    timestamp: now.toISOString()
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to check out');
            }
            
            setMessage('Checked out successfully!');
            setCheckOutTime(now);
            setIsCheckedIn(false);
            
            // Refresh data
            fetchTodayAttendance(employeeData.id);
            fetchAttendanceHistory(employeeData.id);
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.message);
            console.error('Check-out error:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // Sample data for charts (replace with actual data from API)
    const attendanceData = [
        { name: 'Jan', attendance: 95, present: 20, absent: 1, late: 2 },
        { name: 'Feb', attendance: 88, present: 18, absent: 2, late: 3 },
        { name: 'Mar', attendance: 92, present: 19, absent: 1, late: 2 },
        { name: 'Apr', attendance: 89, present: 18, absent: 2, late: 2 },
        { name: 'May', attendance: 94, present: 20, absent: 1, late: 1 },
        { name: 'Jun', attendance: 91, present: 19, absent: 2, late: 1 }
    ];

    const weeklyData = [
        { name: 'Week 1', attendance: 92, present: 4, absent: 1 },
        { name: 'Week 2', attendance: 100, present: 5, absent: 0 },
        { name: 'Week 3', attendance: 80, present: 4, absent: 1 },
        { name: 'Week 4', attendance: 95, present: 5, absent: 0 }
    ];

    // Format attendance history for display
    const formatAttendanceHistory = (history) => {
        if (!Array.isArray(history)) return [];
        
        return history.map(record => {
            const checkInTime = record.check_in ? createDateTime(record.date, record.check_in) : null;
            const checkOutTime = record.check_out ? createDateTime(record.date, record.check_out) : null;
            
            return {
                date: formatDate(record.date),
                status: record.status || 'Absent',
                checkIn: checkInTime ? formatTime(checkInTime) : '-',
                checkOut: checkOutTime ? formatTime(checkOutTime) : '-',
                workingHours: (checkInTime && checkOutTime) ? 
                    calculateWorkingHours(checkInTime, checkOutTime) : '0:00'
            };
        }).reverse(); // Show most recent first
    };

    const recentActivity = formatAttendanceHistory(attendanceHistory);

    // Calculate stats for dashboard cards
    const currentData = selectedView === 'monthly' ? attendanceData : weeklyData;
    const totalAttendance = currentData.reduce((sum, period) => sum + (period.attendance || 0), 0);
    const averageAttendance = currentData.length > 0 ? Math.round(totalAttendance / currentData.length) : 0;
    const currentPeriod = currentData[currentData.length - 1] || { attendance: 0 };
    const attendanceStatusText = currentPeriod.attendance >= 90 ? 'Excellent' : 
                               currentPeriod.attendance >= 80 ? 'Good' : 'Needs Improvement';
    const statusColor = currentPeriod.attendance >= 90 ? 'text-emerald-600' : 
                       currentPeriod.attendance >= 80 ? 'text-blue-600' : 'text-amber-600';

    return (
        <div className="min-h-screen bg-blue-100">
            <EmpNavbar />
            
            <div className="max-w-7xl ml-[21%] mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-xl">
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">Attendance Tracking</h1>
                    <p className="text-slate-100 font-semibold">Monitor your attendance performance and track your progress</p>
                    {employeeData && (
                        <p className="text-sm font-semibold text-slate-100 mt-1">
                            Welcome, {employeeData.emp_name} ({employeeData.id}) - {employeeData.department}
                        </p>
                    )}
                </div>

                {/* Check-in/Check-out Form */}
                <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Today's Attendance</h3>
                            <p className="text-sm text-gray-500">Current time: {formatTime(currentTime)}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                            todayStatus === 'Present' ? 'bg-green-100 text-green-800' :
                            todayStatus === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                            todayStatus === 'Absent' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {todayStatus}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Check-in Section */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-3">Check In</h4>
                            <div className="space-y-3">
                                <div className="text-sm text-gray-600">
                                    Office Start: {OFFICE_START_TIME}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Late After: {LATE_THRESHOLD}
                                </div>
                                {checkInTime && (
                                    <div className="text-sm font-medium text-green-600">
                                        Checked in at: {formatTime(checkInTime)}
                                    </div>
                                )}
                                <button
                                    onClick={handleCheckIn}
                                    disabled={checkInTime || loading || !employeeData}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                        checkInTime || loading || !employeeData
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                >
                                    {loading ? 'Processing...' : 
                                     !employeeData ? 'Loading...' :
                                     checkInTime ? 'Already Checked In' : 'Check In'}
                                </button>
                            </div>
                        </div>

                        {/* Check-out Section */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-3">Check Out</h4>
                            <div className="space-y-3">
                                <div className="text-sm text-gray-600">
                                    Office End: {OFFICE_END_TIME}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Working Hours: {checkInTime ? calculateWorkingHours(checkInTime, checkOutTime || currentTime) : '0:00'}
                                </div>
                                {checkOutTime && (
                                    <div className="text-sm font-medium text-red-600">
                                        Checked out at: {formatTime(checkOutTime)}
                                    </div>
                                )}
                                <button
                                    onClick={handleCheckOut}
                                    disabled={!checkInTime || checkOutTime || loading || !employeeData}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                        !checkInTime || checkOutTime || loading || !employeeData
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                                >
                                    {loading ? 'Processing...' : 
                                     !employeeData ? 'Loading...' :
                                     !checkInTime ? 'Check In First' : 
                                     checkOutTime ? 'Already Checked Out' : 'Check Out'}
                                </button>
                            </div>
                        </div>

                        {/* Today's Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-3">Today's Summary</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-medium ${
                                        todayStatus === 'Present' ? 'text-green-600' :
                                        todayStatus === 'Late' ? 'text-yellow-600' :
                                        'text-gray-600'
                                    }`}>{todayStatus}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Check In:</span>
                                    <span className="font-medium">{formatTime(checkInTime)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Check Out:</span>
                                    <span className="font-medium">{formatTime(checkOutTime)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Working Hours:</span>
                                    <span className="font-medium">
                                        {checkInTime ? calculateWorkingHours(checkInTime, checkOutTime || currentTime) : '0:00'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Status Message */}
                    {message && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${
                            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                            {message}
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Current Status</p>
                                <p className={`text-2xl font-bold ${statusColor}`}>{attendanceStatusText}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Current Period</p>
                                <p className="text-2xl font-bold text-blue-600">{currentPeriod.attendance || 0}%</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Average</p>
                                <p className="text-2xl font-bold text-emerald-600">{averageAttendance}%</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Target</p>
                                <p className="text-2xl font-bold text-purple-600">90%</p>
                                <p className={`text-xs ${averageAttendance >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {averageAttendance >= 90 ? '✓ Achieved' : `${90 - averageAttendance}% to go`}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Attendance Trends</h3>
                                    <p className="text-sm text-gray-500">Track your attendance over time</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setSelectedView('monthly')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            selectedView === 'monthly' 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setSelectedView('weekly')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            selectedView === 'weekly' 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Weekly
                                    </button>
                                </div>
                            </div>

                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                        />
                                        <YAxis 
                                            domain={[70, 100]}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                            tickFormatter={(value) => `${value}%`}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                            formatter={(value, name) => [`${value}%`, name === 'attendance' ? 'Attendance Rate' : name]}
                                            labelFormatter={(label) => `${label}`}
                                        />
                                        <Legend />
                                        <Line 
                                            type="monotone" 
                                            dataKey="attendance" 
                                            name="Attendance Rate"
                                            stroke="#3b82f6" 
                                            strokeWidth={3}
                                            dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.slice(0, 5).map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                activity.status === 'Present' ? 'bg-green-500' : 
                                                activity.status === 'Late' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{activity.date}</p>
                                                <p className={`text-xs ${
                                                    activity.status === 'Present' ? 'text-green-600' : 
                                                    activity.status === 'Late' ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                    {activity.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-600">{activity.checkIn}</p>
                                            <p className="text-xs text-gray-500">{activity.checkOut}</p>
                                            <p className="text-xs text-gray-400">{activity.workingHours}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    No attendance records found
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detailed Stats */}
                <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Detailed Statistics</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="present" fill="#10b981" name="Present Days" />
                                <Bar dataKey="absent" fill="#ef4444" name="Absent Days" />
                                <Bar dataKey="late" fill="#f59e0b" name="Late Days" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpAttendanceTracking;