import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  CalendarDays,
  Loader2,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';

import Navbar from './Navbar'

const AdminLeaveTracking = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');

  // Fetch leaves data from backend
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API, fallback to mock data
      try {
        const response = await fetch('http://localhost:3000/api/leaves');
        if (!response.ok) {
          throw new Error('Failed to fetch from API');
        }
        const data = await response.json();
        setLeaves(data);
      } catch (apiError) {
        console.log('API not available, using mock data');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLeaves(mockLeaves);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter leaves based on search and filters
  useEffect(() => {
    let filtered = leaves;

    if (searchTerm) {
      filtered = filtered.filter(leave => 
        leave.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.emp_id.toString().includes(searchTerm) ||
        leave.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leave_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(leave => leave.status === statusFilter);
    }

    if (leaveTypeFilter !== 'all') {
      filtered = filtered.filter(leave => leave.leave_type === leaveTypeFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(leave => leave.department === departmentFilter);
    }

    if (dateRangeFilter !== 'all') {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(leave => {
        const appliedDate = new Date(leave.date_applied);
        switch (dateRangeFilter) {
          case 'week':
            return appliedDate >= sevenDaysAgo;
          case 'month':
            return appliedDate >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    setFilteredLeaves(filtered);
  }, [searchTerm, statusFilter, leaveTypeFilter, departmentFilter, dateRangeFilter, leaves]);

  // Update leave status
  const updateLeaveStatus = async (leaveId, newStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [leaveId]: true }));
      
      // Try to update via API, fallback to local state update
      try {
        const response = await fetch(`http://localhost:3000/api/leaves/${leaveId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error('API update failed');
        }
      } catch (apiError) {
        console.log('API not available, updating locally');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Update local state
      setLeaves(prev => prev.map(leave => 
        leave.leave_id === leaveId ? { ...leave, status: newStatus } : leave
      ));

    } catch (error) {
      console.error('Error updating leave status:', error);
      setError('Failed to update leave status');
    } finally {
      setUpdating(prev => ({ ...prev, [leaveId]: false }));
    }
  };

  // Get unique values for filters
  const getUniqueValues = (key) => {
    return [...new Set(leaves.map(leave => leave[key]))];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ml-[20%]">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading leave requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ml-[20%]">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchLeaves}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ml-[20%]">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calendar className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-100">Leave Management</h1>
                <p className="text-slate-200 mt-1">Review and manage employee leave requests</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button 
                onClick={fetchLeaves}
                className="flex items-center gap-2 px-4 py-2 border text-gray-900 border-gray-300 bg-gray-200 rounded-lg hover:bg-gray-50  delay-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white border-[.1px] border-gray-400 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add Leave Policy
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
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{leaves.length}</p>
                <p className="text-sm text-blue-600 mt-1">All time</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {leaves.filter(l => l.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-500 mt-1">Awaiting approval</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {leaves.filter(l => l.status === 'approved').length}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {leaves.length > 0 ? ((leaves.filter(l => l.status === 'approved').length / leaves.length) * 100).toFixed(1) : 0}% approval rate
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {leaves.filter(l => l.status === 'rejected').length}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {leaves.length > 0 ? ((leaves.filter(l => l.status === 'rejected').length / leaves.length) * 100).toFixed(1) : 0}% rejection rate
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-80">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by employee name, ID, department, or leave type..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Leave Type Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={leaveTypeFilter}
              onChange={(e) => setLeaveTypeFilter(e.target.value)}
            >
              <option value="all">All Leave Types</option>
              {getUniqueValues('leave_type').map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Department Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {getUniqueValues('department').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Date Range Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Leave Requests</h2>
              <div className="text-sm text-gray-500">
                Showing {filteredLeaves.length} of {leaves.length} requests
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No leave requests found matching your criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((leave) => (
                    <tr key={leave.leave_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {leave.profile_url ? (
                              <img 
                                src={leave.profile_url} 
                                alt={leave.emp_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{leave.emp_name}</div>
                            <div className="text-sm text-gray-500">ID: {leave.emp_id}</div>
                            <div className="text-sm text-gray-500">
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {leave.department}
                              </span>
                              <span className="ml-2 text-xs">{leave.role}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{leave.leave_type}</div>
                        <div className="text-sm text-gray-500 mt-1 max-w-xs truncate" title={leave.reason}>
                          {leave.reason}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Applied: {formatDate(leave.date_applied)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(leave.start_date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {formatDate(leave.end_date)}
                        </div>
                        <div className="text-sm font-medium text-blue-600 mt-1">
                          {calculateLeaveDays(leave.start_date, leave.end_date)} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(leave.status)}
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(leave.status)}`}>
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {leave.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateLeaveStatus(leave.leave_id, 'approved')}
                                disabled={updating[leave.leave_id]}
                                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                {updating[leave.leave_id] ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                                Approve
                              </button>
                              <button
                                onClick={() => updateLeaveStatus(leave.leave_id, 'rejected')}
                                disabled={updating[leave.leave_id]}
                                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                {updating[leave.leave_id] ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <XCircle className="w-3 h-3" />
                                )}
                                Reject
                              </button>
                            </>
                          )}
                                                    {leave.status !== 'pending' && (
                            <button
                              onClick={() => updateLeaveStatus(leave.leave_id, 'pending')}
                              disabled={updating[leave.leave_id]}
                              className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {updating[leave.leave_id] ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <RefreshCw className="w-3 h-3" />
                              )}
                              Reset
                            </button>
                          )}
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

export default AdminLeaveTracking;