import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Check,
  XCircle
} from 'lucide-react';
import axios from 'axios'
import EmpNavbar from './EmpNavbar';

const EmpLeaveTracking = () => {
    const [leaveStats, setLeaveStats] = useState({
        totalLeaves: 24,
        leavesTaken: 0,
        leavesRemaining: 24,
        pendingRequests: 0
    });
    
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        leaveType: 'casual',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);

    // Get user data from localStorage
    useEffect(() => {
    const fetchUserData = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            try {
                // Fetch additional user details
                const response = await axios.get(`http://localhost:3000/api/employees/${userData.id}`);
                
                // Check both possible response structures
                const employeeData = response.data.employee || response.data.employees || {};
                const fullUserData = { 
                    ...userData, 
                    ...employeeData,
                    department: employeeData.department || userData.department || 'No department'
                };
                
                setUser(fullUserData);
                await fetchLeaveHistory(userData.id);
            } catch (error) {
                console.error("Error fetching user details:", error);
                // Fallback with default department if needed
                setUser({
                    ...userData,
                    department: userData.department || 'No department'
                });
                fetchLeaveHistory(userData.id);
            }
        }
    };

    fetchUserData();
}, []);

    // Fetch leave history
    const fetchLeaveHistory = async (empId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/leaves/${empId}`);
            if (!response.ok) throw new Error('Failed to fetch leave history');
            
            const result = await response.json();
            const leaves = result.data;
            setLeaveHistory(leaves);
            
            // Calculate stats
            const taken = leaves
                .filter(l => l.status.toLowerCase() === 'approved')
                .reduce((sum, l) => sum + getDuration(l.start_date, l.end_date), 0);
                
            const pending = leaves.filter(l => l.status.toLowerCase() === 'pending').length;
            
            setLeaveStats({
                totalLeaves: 24,
                leavesTaken: taken,
                leavesRemaining: 24 - taken,
                pendingRequests: pending
            });
        } catch (error) {
            console.error('Error:', error);
            setMessage(error.message);
        }
    };

    // Calculate duration in days
    const getDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    };

    // Handle form changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit leave request
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Validation
            if (!formData.startDate || !formData.endDate) {
                throw new Error('Please select both start and end dates');
            }
            
            if (new Date(formData.endDate) < new Date(formData.startDate)) {
                throw new Error('End date cannot be before start date');
            }
            
            if (!formData.reason.trim()) {
                throw new Error('Please provide a reason for leave');
            }

            const response = await fetch(`http://localhost:3000/api/leaves`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    emp_id: user.id,
                    leave_type: formData.leaveType,
                    reason: formData.reason,
                    start_date: formData.startDate,
                    end_date: formData.endDate
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit leave request');
            }

            setMessage('Leave request submitted successfully!');
            setFormData({
                leaveType: 'casual',
                startDate: '',
                endDate: '',
                reason: ''
            });
            setShowForm(false);
            fetchLeaveHistory(user.id);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Get status details
    const getStatusDetails = (status) => {
        const statusMap = {
            approved: { 
                color: 'bg-green-100 text-green-800',
                icon: <CheckCircle className="w-4 h-4" />,
                text: 'Approved'
            },
            rejected: { 
                color: 'bg-red-100 text-red-800',
                icon: <XCircle className="w-4 h-4" />,
                text: 'Rejected'
            },
            pending: { 
                color: 'bg-yellow-100 text-yellow-800',
                icon: <Clock className="w-4 h-4" />,
                text: 'Pending'
            }
        };
        
        return statusMap[status.toLowerCase()] || statusMap.pending;
    };

    // Toggle row expansion
    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <EmpNavbar />
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave Management</h1>
                    <p className="text-gray-600 mb-4">Please log in to view your leave dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-100">
            <EmpNavbar />
            
            <div className="max-w-7xl ml-[21%] mx-auto px-2 py-3">
                {/* Header */}
                <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700">
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">Leave Management</h1>
                    <p className="text-slate-200">Track your leave balance and request time off</p>
                    <p className="text-sm text-slate-200 mt-1">
                        Employee ID: {user.id} - {user.department || 'N/A'}
                    </p>
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center ${
                        message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {message.includes('success') ? (
                            <Check className="w-5 h-5 mr-2" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 mr-2" />
                        )}
                        {message}
                    </div>
                )}

                {/* Leave Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Total Leaves */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Leaves</p>
                                <p className="text-3xl font-bold text-blue-600">{leaveStats.totalLeaves}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Leaves Taken */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Leaves Taken</p>
                                <p className="text-3xl font-bold text-red-600">{leaveStats.leavesTaken}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    {/* Leaves Remaining */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Leaves Remaining</p>
                                <p className="text-3xl font-bold text-green-600">{leaveStats.leavesRemaining}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <Clock className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Pending Requests */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Pending Requests</p>
                                <p className="text-3xl font-bold text-yellow-600">{leaveStats.pendingRequests}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Your Leave History</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        {showForm ? 'Cancel' : 'New Leave Request'}
                    </button>
                </div>

                {/* Leave Request Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">New Leave Request</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Leave Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Leave Type
                                    </label>
                                    <select
                                        name="leaveType"
                                        value={formData.leaveType}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="casual">Casual Leave</option>
                                        <option value="sick">Sick Leave</option>
                                        <option value="earned">Earned Leave</option>
                                        <option value="maternity">Maternity Leave</option>
                                        <option value="paternity">Paternity Leave</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason
                                </label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Please provide details about your leave request..."
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Submit Request
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Leave History Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    {leaveHistory.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No leave records found</h3>
                            <p className="text-gray-500">You haven't applied for any leaves yet</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Apply for Leave
                            </button>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leaveHistory.map((leave, index) => {
                                    const statusDetails = getStatusDetails(leave.status);
                                    const startDate = new Date(leave.start_date).toLocaleDateString();
                                    const endDate = new Date(leave.end_date).toLocaleDateString();
                                    const duration = getDuration(leave.start_date, leave.end_date);
                                    const isExpanded = expandedRow === index;
                                    
                                    return (
                                        <React.Fragment key={leave.leave_id}>
                                            <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRow(index)}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                                                    {leave.leave_type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {startDate} - {endDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {duration} day{duration > 1 ? 's' : ''}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex items-center gap-1 rounded-full text-xs font-medium ${statusDetails.color}`}>
                                                        {statusDetails.icon}
                                                        {statusDetails.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(leave.date_applied).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleRow(index);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-5 h-5" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-4 bg-gray-50">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-500 mb-1">Reason</h4>
                                                                <p className="text-sm text-gray-900">{leave.reason}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-500 mb-1">Details</h4>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <p className="text-xs text-gray-500">Leave Type</p>
                                                                        <p className="text-sm text-gray-900 capitalize">{leave.leave_type}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-gray-500">Duration</p>
                                                                        <p className="text-sm text-gray-900">{duration} day{duration > 1 ? 's' : ''}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-gray-500">Status</p>
                                                                        <p className="text-sm text-gray-900">{statusDetails.text}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-gray-500">Applied On</p>
                                                                        <p className="text-sm text-gray-900">{new Date(leave.date_applied).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmpLeaveTracking;