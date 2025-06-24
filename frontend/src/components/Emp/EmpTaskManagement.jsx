import React, { useEffect, useState } from 'react';
import EmpNavbar from "./EmpNavbar";
import axios from "axios";

function EmpTaskManagement() {
    const [tasks, setTasks] = useState([]);
    const [expandedTasks, setExpandedTasks] = useState({});
    const [filter, setFilter] = useState('all');
    const [taskStats, setTaskStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0
    });

    // Mock employee data - in real app, get from auth context
    const currentEmployee = "Khushi"; // This should come from authentication

    useEffect(() => {
        fetchEmployeeTasks();
    }, []);

    const fetchEmployeeTasks = async () => {
        try {
            const token = localStorage.getItem('token')
            
            if(!token){
                console.log(`No token found!`);
                return;
            }

            const res = await axios.get('http://localhost:3000/api/get-tasks', {
                headers : {
                    Authorization: token
                }
            });
            // Filter tasks for current employee
            console.log(res.data)
            const employeeTasks = res.data;
            setTasks(employeeTasks);
            calculateStats(employeeTasks);
            console.log('Employee tasks:', employeeTasks);
        } catch (err) {
            console.error('❌ Failed to fetch tasks:', err.message);
        }
    };

    const calculateStats = (tasks) => {
        const stats = {
            total: tasks.length,
            pending: tasks.filter(task => task.status === 'pending' || !task.status).length,
            inProgress: tasks.filter(task => task.status === 'in progress').length,
            completed: tasks.filter(task => task.status === 'completed').length
        };
        setTaskStats(stats);
    };

    const updateTaskStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token')
            if(!token){
                console.log(`No token found`)
                return;
            }

            await axios.put(`http://localhost:3000/api/tasks/${id}/status`, {
                status: newStatus
            },{
                headers: {
                    Authorization : token 
                }
            });
            
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === id ? { ...task, status: newStatus } : task
                )
            );
            
            fetchEmployeeTasks(); // Refresh to update stats
            
        } catch (err) {
            console.error('❌ Failed to update task status:', err.message);
            alert('❌ Failed to update task status. Please try again.');
        }
    };

    const getTaskTagIcon = (tag) => {
        switch(tag) {
            case 'Project': return '🚧';
            case 'Meeting': return '📅';
            case 'Urgent': return '⚠️';
            case 'Review': return '🔍';
            default: return '📋';
        }
    };

    const getTaskTagColor = (tag) => {
        switch(tag) {
            case 'Project': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Meeting': return 'bg-green-100 text-green-800 border-green-200';
            case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
            case 'Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'pending':
            default: return 'bg-red-100 text-red-800 border-red-200';
        }
    };

    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getDueDateColor = (dueDate) => {
        const days = getDaysUntilDue(dueDate);
        if (days < 0) return 'text-red-600 font-semibold';
        if (days <= 3) return 'text-orange-600 font-semibold';
        if (days <= 7) return 'text-yellow-600 font-medium';
        return 'text-gray-600';
    };

    const toggleDescription = (taskId) => {
        setExpandedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'pending') return task.status === 'pending' || !task.status;
        if (filter === 'in progress') return task.status === 'in progress';
        if (filter === 'completed') return task.status === 'completed';
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <EmpNavbar />
            {/* Main content with proper spacing to avoid navbar overlap */}
            <div className="px-4 sm:px-6 lg:px-8">
                {/* Content container with left margin to account for sidebar */}
                <div className="ml-80 py-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        
                        {/* Header Section */}
                        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                            <div className='bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-8 py-6'>
                                <h1 className='text-3xl font-bold text-white flex items-center gap-3'>
                                    <span className="text-4xl">✅</span>
                                    My Tasks
                                </h1>
                                <p className='text-slate-50 mt-2'>Track and manage your assigned tasks</p>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                                        <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
                                    </div>
                                    <div className="bg-blue-100 rounded-full p-3">
                                        <span className="text-2xl">📋</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Pending</p>
                                        <p className="text-2xl font-bold text-gray-900">{taskStats.pending}</p>
                                    </div>
                                    <div className="bg-red-100 rounded-full p-3">
                                        <span className="text-2xl">⏳</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">In Progress</p>
                                        <p className="text-2xl font-bold text-gray-900">{taskStats.inProgress}</p>
                                    </div>
                                    <div className="bg-yellow-100 rounded-full p-3">
                                        <span className="text-2xl">🔄</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Completed</p>
                                        <p className="text-2xl font-bold text-gray-900">{taskStats.completed}</p>
                                    </div>
                                    <div className="bg-green-100 rounded-full p-3">
                                        <span className="text-2xl">✅</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filter Buttons */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        filter === 'all' 
                                            ? 'bg-blue-600 text-white shadow-lg' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    All Tasks ({taskStats.total})
                                </button>
                                <button
                                    onClick={() => setFilter('pending')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        filter === 'pending' 
                                            ? 'bg-red-600 text-white shadow-lg' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Pending ({taskStats.pending})
                                </button>
                                <button
                                    onClick={() => setFilter('in progress')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        filter === 'in progress' 
                                            ? 'bg-yellow-600 text-white shadow-lg' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    In Progress ({taskStats.inProgress})
                                </button>
                                <button
                                    onClick={() => setFilter('completed')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        filter === 'completed' 
                                            ? 'bg-green-600 text-white shadow-lg' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Completed ({taskStats.completed})
                                </button>
                            </div>
                        </div>

                        {/* Tasks List */}
                        {filteredTasks.length > 0 ? (
                            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                                <div className='bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between'>
                                    <div>
                                        <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
                                            <span>📊</span>
                                            Your Tasks
                                        </h2>
                                        <p className='text-indigo-100 text-sm mt-1'>
                                            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} {filter !== 'all' ? `(${filter})` : ''}
                                        </p>
                                    </div>
                                    <div className='bg-white/20 rounded-full px-4 py-2'>
                                        <span className='text-white font-bold text-lg'>{filteredTasks.length}</span>
                                    </div>
                                </div>
                                
                                <div className='p-6'>
                                    <div className='overflow-x-auto rounded-lg border border-gray-200'>
                                        <table className='min-w-full'>
                                            <thead>
                                                <tr className='bg-gradient-to-r from-gray-50 to-blue-50'>
                                                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                        Task Description
                                                    </th>
                                                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                        Department
                                                    </th>
                                                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                        Tag
                                                    </th>
                                                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                        Status
                                                    </th>
                                                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                        Assigned
                                                    </th>
                                                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                        Due Date
                                                    </th>
                                                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className='divide-y divide-gray-200'>
                                                {filteredTasks.map((task, index) => {
                                                    const isExpanded = expandedTasks[task.id];
                                                    const showToggle = task.task_description && task.task_description.length > 100;
                                                    
                                                    return (
                                                        <tr key={task.id} className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                            <td className='px-6 py-4 min-w-[250px] max-w-[400px] align-top'>
                                                                <div className="text-sm text-gray-900 break-words">
                                                                    <p className={`whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-2'}`}>
                                                                        {task.task_description}
                                                                    </p>
                                                                    {showToggle && (
                                                                        <button 
                                                                            onClick={() => toggleDescription(task.id)}
                                                                            className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1 focus:outline-none"
                                                                        >
                                                                            {isExpanded ? 'Show less' : 'Show more'}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className='px-6 py-4 align-top'>
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                                    {task.department}
                                                                </span>
                                                            </td>
                                                            <td className='px-6 py-4 align-top'>
                                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getTaskTagColor(task.task_tag)}`}>
                                                                    <span>{getTaskTagIcon(task.task_tag)}</span>
                                                                    {task.task_tag}
                                                                </span>
                                                            </td>
                                                            <td className='px-6 py-4 align-top'>
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status || 'pending')}`}>
                                                                    {task.status || 'pending'}
                                                                </span>
                                                            </td>
                                                            <td className='px-6 py-4 align-top text-sm text-gray-600'>
                                                                {new Date(task.assigned_date).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </td>
                                                            <td className='px-6 py-4 align-top'>
                                                                <div className="text-sm">
                                                                    <div className={getDueDateColor(task.due_date)}>
                                                                        {new Date(task.due_date).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {(() => {
                                                                            const days = getDaysUntilDue(task.due_date);
                                                                            if (days < 0) return `${Math.abs(days)} days overdue`;
                                                                            if (days === 0) return 'Due today';
                                                                            if (days === 1) return 'Due tomorrow';
                                                                            return `${days} days left`;
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className='px-6 py-4 align-top'>
                                                                <select
                                                                    value={task.status || 'pending'}
                                                                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                                                    className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                >
                                                                    <option value="pending">Pending</option>
                                                                    <option value="in progress">In Progress</option>
                                                                    <option value="completed">Completed</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='bg-white rounded-xl shadow-lg p-12 text-center'>
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {filter === 'all' ? 'No tasks assigned' : `No ${filter} tasks`}
                                </h3>
                                <p className="text-gray-600">
                                    {filter === 'all' 
                                        ? 'You have no tasks assigned at the moment.' 
                                        : `You have no ${filter} tasks.`
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmpTaskManagement;