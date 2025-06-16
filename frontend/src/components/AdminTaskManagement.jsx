import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from "axios"

function AdminTaskManagement() {
    const [formData, setFormData] = useState({
        employeeName: '',
        taskDescription: '',
        department: '',
        dueDate: '',
        taskTag: '',
        task_id: ''
    });

    const [tasks, setTasks] = useState([]);
    const [expandedTasks, setExpandedTasks] = useState({});

    // Function to generate unique task ID (BigInt compatible)
    const generateUniqueTaskId = () => {
        // Method 1: Timestamp + Random number (as number)
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000); // 3-digit random number
        return parseInt(`${timestamp}${randomNum}`);
        
        // Alternative Method 2: Just timestamp (simpler)
        // return Date.now();
        
        // Alternative Method 3: Timestamp + counter
        // const counter = tasks.length + 1;
        // return parseInt(`${timestamp}${String(counter).padStart(3, '0')}`);
    };

    useEffect(() =>{
        fetchAllTasks();
    },[]);

    useEffect(() => {
        // Generate new task ID whenever form is reset or component mounts
        if (!formData.task_id) {
            setFormData(prev => ({
                ...prev,
                task_id: generateUniqueTaskId()
            }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchAllTasks = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/get-tasks');
            setTasks(res.data.tasks);
            console.log(res.data.tasks);
        } catch (err) {
            console.error('❌ Failed to fetch tasks:', err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.employeeName && formData.taskDescription && formData.department && formData.dueDate && formData.taskTag) {
            const newTask = {
                id: Date.now(),
                ...formData,
                assignedDate: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
            };
            
            try {
                const res = await axios.post('http://localhost:3000/api/tasks', newTask);
                setTasks(prev => [...prev, res.data.task]);

                // Generate new task ID for next task
                const newTaskId = generateUniqueTaskId();
                
                setFormData({
                    employeeName: '',
                    taskDescription: '',
                    department: '',
                    dueDate: '',
                    taskTag: '',
                    task_id: newTaskId // Set new unique ID for next task
                });

                alert('✅ Task assigned and saved to DB!');
                fetchAllTasks()
            } catch (err) {
                console.error('❌ Failed to save task:', err.message);
                alert('❌ Failed to assign task. Please try again.');
            }
        } else {
            alert('⚠️ Please fill in all fields');
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar />
            <div className='tasks-form min-h-screen w-[80%] flex justify-center ml-[20%]'>
                <div className='w-[95%] mt-6 space-y-6'>
                    
                    {/* Header Section */}
                    <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                        <div className='bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-8 py-6'>
                            <h1 className='text-3xl font-bold text-white flex items-center gap-3'>
                                <span className="text-4xl">📋</span>
                                Task Management Center
                            </h1>
                            <p className='text-slate-50 mt-2'>Efficiently assign and track tasks across your organization</p>
                        </div>
                    </div>

                    {/* Task Assignment Form */}
                    <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                        <div className='bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-4'>
                            <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
                                <span className='bg-slate-300 rounded-[50%] p-[2px]'>➕</span>
                                Assign New Task
                            </h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className='p-8'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Task ID Field - Read Only */}
                                <div className="space-y-2">
                                    <label htmlFor="task_id" className='block text-sm font-semibold text-gray-700'>
                                        🔑 Task ID
                                    </label>
                                    <input
                                        type="number"
                                        id="task_id"
                                        name="task_id"
                                        value={formData.task_id}
                                        readOnly
                                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-mono text-sm'
                                        placeholder="Auto-generated unique ID"
                                    />
                                </div>

                                {/* Employee Name */}
                                <div className="space-y-2">
                                    <label htmlFor="employeeName" className='block text-sm font-semibold text-gray-700'>
                                        👤 Employee Name
                                    </label>
                                    <input
                                        type="text"
                                        id="employeeName"
                                        name="employeeName"
                                        value={formData.employeeName}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300'
                                        placeholder="Enter employee name"
                                        required
                                    />
                                </div>

                                {/* Department */}
                                <div className="space-y-2">
                                    <label htmlFor="department" className='block text-sm font-semibold text-gray-700'>
                                        🏢 Department
                                    </label>
                                    <select
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300'
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="IT">💻 IT</option>
                                        <option value="HR">👥 HR</option>
                                        <option value="Finance">💰 Finance</option>
                                        <option value="Marketing">📢 Marketing</option>
                                        <option value="Operations">⚙️ Operations</option>
                                        <option value="Sales">📈 Sales</option>
                                    </select>
                                </div>

                                {/* Due Date */}
                                <div className="space-y-2">
                                    <label htmlFor="dueDate" className='block text-sm font-semibold text-gray-700'>
                                        📅 Due Date
                                    </label>
                                    <input
                                        type="date"
                                        id="dueDate"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300'
                                        required
                                    />
                                </div>

                                {/* Task Tags */}
                                <div className="space-y-2">
                                    <label htmlFor='taskTag' className='block text-sm font-semibold text-gray-700'>
                                        🏷️ Task Tag
                                    </label>
                                    <select
                                        id='taskTag'
                                        name='taskTag'
                                        value={formData.taskTag}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300'
                                        required
                                    >
                                        <option value="">Select Task Tag</option>
                                        <option value="Project">🚧 Project</option>
                                        <option value="Meeting">📅 Meeting</option>
                                        <option value="Urgent">⚠️ Urgent</option>
                                        <option value="Review">🔍 Review</option>
                                    </select>
                                </div>

                                {/* Task Description */}
                                <div className='md:col-span-2 space-y-2'>
                                    <label htmlFor="taskDescription" className='block text-sm font-semibold text-gray-700'>
                                        📝 Task Description
                                    </label>
                                    <textarea
                                        id="taskDescription"
                                        name="taskDescription"
                                        value={formData.taskDescription}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 resize-none'
                                        placeholder="Enter detailed task description..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-start mt-8">
                                <button
                                    type="submit"
                                    className='bg-gradient-to-br from-blue-600 to-blue-700  text-white font-semibold px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2'
                                >
                                    Assign Task
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Assigned Tasks List */}
                    {tasks.length > 0 && (
                        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                            <div className='bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between'>
                                <div>
                                    <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
                                        <span>📊</span>
                                        Active Tasks Overview
                                    </h2>
                                    <p className='text-indigo-100 text-sm mt-1'>
                                        {tasks.length} task{tasks.length !== 1 ? 's' : ''} currently assigned
                                    </p>
                                </div>
                                <div className='bg-white/20 rounded-full px-4 py-2'>
                                    <span className='text-white font-bold text-lg'>{tasks.length}</span>
                                </div>
                            </div>
                            
                            <div className='p-6'>
                                <div className='overflow-x-auto rounded-lg border border-gray-200'>
                                    <table className='min-w-full'>
                                        <thead>
                                            <tr className='bg-gradient-to-r from-gray-50 to-blue-50'>
                                                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                    Task ID
                                                </th>
                                                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                    Employee
                                                </th>
                                                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                    Department
                                                </th>
                                                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                    Task Description
                                                </th>
                                                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                    Tag
                                                </th>
                                                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                    Assigned
                                                </th>
                                                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200'>
                                                    Due Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200'>
                                            {tasks.map((task, index) => {
                                                const isExpanded = expandedTasks[task.id];
                                                const showToggle = task.task_description && task.task_description.length > 100;
                                                
                                                return (
                                                    <tr key={task.id} className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                        <td className='px-6 py-4 align-top'>
                                                            <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border">
                                                                {task.task_id || task.id}
                                                            </span>
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap flex'>
                                                            <div className="flex items-center">
                                                                <div className="flex items-start">
                                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                                                        {task.emp_name ? task.emp_name.charAt(0).toUpperCase() : 'U'}
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-semibold text-gray-900">{task.emp_name}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className='px-6 py-4 align-top'>
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                                {task.department}
                                                            </span>
                                                        </td>
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
                                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getTaskTagColor(task.task_tag)}`}>
                                                                <span>{getTaskTagIcon(task.task_tag)}</span>
                                                                {task.task_tag}
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
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminTaskManagement;