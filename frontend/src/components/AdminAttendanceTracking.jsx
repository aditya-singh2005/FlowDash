import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  Award, 
  AlertTriangle,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Eye,
  CheckCircle,
  XCircle,
  User,
  CalendarDays,
  Loader2
} from 'lucide-react';
import Navbar from './Navbar'

// Heatmap Component with real data
const AttendanceHeatMap = ({ employeeData }) => {
  // Calculate attendance rates by department for last 4 weeks
  const calculateDepartmentAttendance = () => {
    const departments = [...new Set(employeeData.map(emp => emp.department))];
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    
    return departments.map(dept => {
      const deptEmployees = employeeData.filter(emp => emp.department === dept);
      const totalEmployees = deptEmployees.length;
      
      return {
        id: dept,
        data: weeks.map(week => {
          // Simulate weekly data - in real app, you'd fetch historical data
          const presentCount = deptEmployees.filter(emp => emp.status === 'Present').length;
          const lateCount = deptEmployees.filter(emp => emp.status === 'Late').length;
          const baseRate = totalEmployees > 0 ? ((presentCount + lateCount) / totalEmployees) * 100 : 0;
          
          // Add some variation for each week (simulate historical data)
          const variation = Math.random() * 10 - 5; // -5 to +5
          const attendance = Math.max(60, Math.min(100, baseRate + variation));
          
          return { x: week, y: Math.round(attendance) };
        })
      };
    });
  };

  const data = calculateDepartmentAttendance();

  const getColor = (value) => {
    if (value >= 100) return '#0033cc';
    if (value >= 98) return '#0040e6';
    if (value >= 96) return '#004dff';
    if (value >= 94) return '#1a5aff';
    if (value >= 92) return '#3366ff';
    if (value >= 90) return '#4d73ff';
    if (value >= 88) return '#6680ff';
    if (value >= 86) return '#808cff';
    if (value >= 84) return '#9999ff';
    if (value >= 82) return '#b3a6ff';
    if (value >= 80) return '#ccb3ff';
    if (value >= 78) return '#d9c2ff';
    if (value >= 76) return '#e6d1ff';
    if (value >= 75) return '#ff002b';
    if (value >= 74) return '#eb0028';
    if (value >= 73) return '#db0227';
    if (value >= 72) return '#c70022';
    if (value >= 70) return '#b3001e';
    if (value >= 68) return '#9e001a';
    if (value >= 66) return '#8f0017';
    if (value >= 64) return '#8f0017';
    if (value >= 62) return '#610010';
    if (value >= 60) return '#52000d';
    return '#110000';
  };

  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const departments = data.map(d => d.id);

  const getValue = (dept, week) => {
    const deptData = data.find(d => d.id === dept);
    if (!deptData) return 0;
    const weekData = deptData.data.find(w => w.x === week);
    return weekData ? weekData.y : 0;
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="text-center py-8">
          <p className="text-gray-500">No data available for heatmap</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Department Attendance Heatmap</h3>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-600">Last 4 Weeks</span>
        </div>
      </div>
      
      <div className="overflow-auto">
        <div className="min-w-full flex flex-col items-center">
          <div className="flex mb-4">
            <div className="w-20 text-right pr-4 font-semibold text-gray-700">Week</div>
            {departments.map(dept => (
              <div key={dept} className="w-24 text-center font-semibold text-gray-700 text-sm">
                {dept}
              </div>
            ))}
          </div>
          
          {weeks.map(week => (
            <div key={week} className="flex mb-2">
              <div className="w-20 text-right pr-4 font-medium text-gray-800 flex items-center justify-end text-sm">
                {week}
              </div>
              {departments.map(dept => (
                <div 
                  key={dept}
                  className="w-24 h-14 mx-1 flex items-center justify-center text-white font-bold text-sm rounded-lg border border-gray-200 shadow-sm"
                  style={{ backgroundColor: getColor(getValue(dept, week)) }}
                >
                  {getValue(dept, week)}%
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold mb-3 text-center text-gray-700">Attendance Rate Legend</h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Low</span>
            {[60, 65, 70, 75, 80, 85, 90, 95, 100].map(val => (
              <div 
                key={val}
                className="w-8 h-6 border border-gray-300 rounded"
                style={{ backgroundColor: getColor(val) }}
                title={`${val}%`}
              />
            ))}
            <span className="text-xs text-gray-600">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminAttendanceTracking = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const BASE_URl = "https://ems2-backend.onrender.com"

  // Fetch data from API
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URl}/api/attendance`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        
        const data = await response.json();
        
        // Transform the data to match expected format
        const transformedData = data.map(employee => ({
          id: employee.emp_id,
          name: employee.emp_name,
          department: employee.department,
          position: employee.role, // Since position isn't in DB
          attendance: calculateMonthlyAttendance(employee), // Calculate based on available data
          status: employee.status,
          checkIn: employee.check_in || '--',
          checkOut: employee.check_out || '--',
          avatar: employee.profile_url || `--`
        }));
        
        setEmployeeData(transformedData);
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  // Calculate monthly attendance (mock calculation since we only have one day's data)
  const calculateMonthlyAttendance = (employee) => {
    // In a real app, this would calculate based on historical data
    // For now, simulate based on current status
    if (employee.status === 'Present') return Math.floor(Math.random() * 10) + 85; // 85-95%
    if (employee.status === 'Late') return Math.floor(Math.random() * 15) + 75; // 75-90%
    if (employee.status === 'Absent') return Math.floor(Math.random() * 15) + 60; // 60-75%
    return 85;
  };

  // Filter employees
  const filteredEmployees = employeeData.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'present' && employee.status === 'Present') ||
                         (selectedFilter === 'absent' && employee.status === 'Absent') ||
                         (selectedFilter === 'late' && employee.status === 'Late');
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    return matchesSearch && matchesFilter && matchesDepartment;
  });

  // Get unique departments for filter dropdown
  const uniqueDepartments = [...new Set(employeeData.map(emp => emp.department))].sort();

  // Calculate statistics
  const totalEmployees = employeeData.length;
  const presentCount = employeeData.filter(emp => emp.status === 'Present').length;
  const lateCount = employeeData.filter(emp => emp.status === 'Late').length;
  const absentCount = employeeData.filter(emp => emp.status === 'Absent').length;
  const attendanceRate = totalEmployees > 0 ? ((presentCount + lateCount) / totalEmployees * 100).toFixed(1) : 0;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      case 'Late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Present': return <CheckCircle className="w-4 h-4" />;
      case 'Absent': return <XCircle className="w-4 h-4" />;
      case 'Late': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ml-[20%] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ml-[20%] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ml-[20%]">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-b-xl shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calendar className="w-12 h-12 rounded-lg text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-100">Attendance Tracking</h1>
                <p className="text-slate-200 mt-1">Monitor and analyze employee attendance patterns</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 border-gray-400 border-[.1px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r text-shadow-white from-gray-200 to-gray-300 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <CalendarDays className="w-4 h-4" />
                Date Range
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalEmployees}</p>
                <p className="text-sm text-blue-600 mt-1">Active today</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{presentCount}</p>
                <p className="text-sm text-gray-500 mt-1">{attendanceRate}% attendance</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{lateCount}</p>
                <p className="text-sm text-gray-500 mt-1">{totalEmployees > 0 ? (lateCount / totalEmployees * 100).toFixed(1) : 0}% of total</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent Today</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{absentCount}</p>
                <p className="text-sm text-gray-500 mt-1">{totalEmployees > 0 ? (absentCount / totalEmployees * 100).toFixed(1) : 0}% absence rate</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="mb-8">
          <AttendanceHeatMap employeeData={employeeData} />
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">Employee Attendance Today</h2>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Rate</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No employees found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {employee.avatar !== '--' ? (
                            <img 
                              src={employee.avatar} 
                              alt={employee.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.position}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          {getStatusIcon(employee.status)}
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.checkIn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.checkOut}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${employee.attendance >= 90 ? 'bg-green-500' : employee.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${employee.attendance}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{employee.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceTracking;