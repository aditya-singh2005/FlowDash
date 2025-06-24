import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from "axios"

function AdminTaskManagement() {
    const [formData, setFormData] = useState({
        emp_id: '',
        emp_name: '',
        taskDescription: '',
        department: '',
        dueDate: '',
        taskTag: '',
        task_id: '',
        status: 'new task'
    });

    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [expandedTasks, setExpandedTasks] = useState({});
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [employeeError, setEmployeeError] = useState(null);

    // Function to generate unique task ID
    const generateUniqueTaskId = () => {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);
        return `TASK-${String(timestamp).slice(-6)}${String(randomNum).padStart(3, '0')}`;
    };

    // Function to fetch employees from API
    const fetchEmployees = async () => {
        try {
            setLoadingEmployees(true);
            setEmployeeError(null);
            
            const res = await axios.get('http://localhost:3000/api/employees');
            
            // Handle different possible response structures
            const employeeData = res.data.employees || res.data || [];
            
            if (Array.isArray(employeeData)) {
                setEmployees(employeeData);
                setFilteredEmployees(employeeData);
                console.log('✅ Employees loaded successfully:', employeeData.length, 'employees');
            } else {
                throw new Error('Invalid employee data format received');
            }
        } catch (err) {
            console.error('❌ Failed to fetch employees:', err.message);
            setEmployeeError(err.message);
            
            // Fallback to empty array to prevent crashes
            setEmployees([]);
            setFilteredEmployees([]);
        } finally {
            setLoadingEmployees(false);
        }
    };

    useEffect(() => {
        fetchAllTasks();
        fetchEmployees();
    }, []);

    useEffect(() => {
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

        // Handle employee name search
        if (name === 'emp_name') {
            const filtered = employees.filter(emp => 
                emp.emp_name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredEmployees(filtered);
            setShowEmployeeDropdown(value.length > 0);
            
            // Clear emp_id and department if name doesn't match exactly
            const exactMatch = employees.find(emp => emp.emp_name === value);
            if (!exactMatch) {
                setFormData(prev => ({
                    ...prev,
                    emp_id: '',
                    department: ''
                }));
            }
        }
    };

    const handleEmployeeSelect = (employee) => {
        setFormData(prev => ({
            ...prev,
            emp_name: employee.emp_name,
            emp_id: employee.emp_id,
            department: employee.department
        }));
        setShowEmployeeDropdown(false);
        setFilteredEmployees(employees);
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
        if (formData.emp_name && formData.taskDescription && formData.department && formData.dueDate && formData.taskTag && formData.emp_id) {
            const newTask = {
                task_id: formData.task_id,
                emp_id: formData.emp_id,
                emp_name: formData.emp_name,
                department: formData.department,
                task_tag: formData.taskTag,
                status: formData.status,
                assigned_date: new Date().toISOString().split('T')[0],
                due_date: formData.dueDate,
                task_description: formData.taskDescription
            };
            
            try {
                const res = await axios.post('http://localhost:3000/api/tasks', newTask);
                setTasks(prev => [...prev, res.data.task]);

                // Generate new task ID for next task
                const newTaskId = generateUniqueTaskId();
                
                setFormData({
                    emp_id: '',
                    emp_name: '',
                    taskDescription: '',
                    department: '',
                    dueDate: '',
                    taskTag: '',
                    task_id: newTaskId,
                    status: 'new task'
                });

                alert('✅ Task assigned and saved to DB!');
                fetchAllTasks();
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
            case 'project': return '🚧';
            case 'meeting': return '📅';
            case 'support': return '🛠️';
            case 'review': return '🔍';
            case 'training': return '📚';
            default: return '📋';
        }
    };

    const getTaskTagColor = (tag) => {
        switch(tag) {
            case 'project': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'meeting': return 'bg-green-100 text-green-800 border-green-200';
            case 'support': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'training': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'new task': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
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

                    {/* Employee Loading/Error States */}
                    {employeeError && (
                        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                            <div className='flex items-center gap-2'>
                                <span className='text-red-600 text-xl'>⚠️</span>
                                <div>
                                    <h3 className='text-red-800 font-semibold'>Error Loading Employees</h3>
                                    <p className='text-red-700 text-sm'>{employeeError}</p>
                                    <button 
                                        onClick={fetchEmployees}
                                        className='mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline'
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
                                        type="text"
                                        id="task_id"
                                        name="task_id"
                                        value={formData.task_id}
                                        readOnly
                                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-mono text-sm'
                                        placeholder="Auto-generated unique ID"
                                    />
                                </div>

                                {/* Employee Selection with Search */}
                                <div className="space-y-2 relative">
                                    <label htmlFor="emp_name" className='block text-sm font-semibold text-gray-700'>
                                        👤 Employee Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="emp_name"
                                            name="emp_name"
                                            value={formData.emp_name}
                                            onChange={handleInputChange}
                                            onFocus={() => {
                                                if (formData.emp_name) {
                                                    setShowEmployeeDropdown(true);
                                                }
                                            }}
                                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300'
                                            placeholder={loadingEmployees ? "Loading employees..." : "Search employee name..."}
                                            required
                                            autoComplete="off"
                                            disabled={loadingEmployees}
                                        />
                                        {loadingEmployees && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Employee Dropdown */}
                                    {showEmployeeDropdown && filteredEmployees.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {filteredEmployees.map((employee) => (
                                                <div
                                                    key={employee.emp_id}
                                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                    onClick={() => handleEmployeeSelect(employee)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-gray-900">{employee.emp_name}</div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {employee.emp_id} • {employee.department}
                                                                {employee.role && ` • ${employee.role}`}
                                                            </div>
                                                            {employee.email && (
                                                                <div className="text-xs text-gray-400">{employee.email}</div>
                                                            )}
                                                        </div>
                                                        {employee.profile_url && (
                                                            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                                                                <img 
                                                                    src={employee.profile_url} 
                                                                    alt={employee.emp_name}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* No employees found message */}
                                    {showEmployeeDropdown && filteredEmployees.length === 0 && formData.emp_name && !loadingEmployees && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                            <div className="text-gray-500 text-sm text-center">
                                                No employees found matching "{formData.emp_name}"
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Employee ID - Read Only */}
                                <div className="space-y-2">
                                    <label htmlFor="emp_id" className='block text-sm font-semibold text-gray-700'>
                                        🆔 Employee ID
                                    </label>
                                    <input
                                        type="number"
                                        id="emp_id"
                                        name="emp_id"
                                        value={formData.emp_id}
                                        readOnly
                                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600'
                                        placeholder="Auto-filled from employee selection"
                                    />
                                </div>

                                {/* Department - Auto-filled */}
                                <div className="space-y-2">
                                    <label htmlFor="department" className='block text-sm font-semibold text-gray-700'>
                                        🏢 Department
                                    </label>
                                    <input
                                        type="text"
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        readOnly
                                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600'
                                        placeholder="Auto-filled from employee selection"
                                    />
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
                                        <option value="project">🚧 Project</option>
                                        <option value="meeting">📅 Meeting</option>
                                        <option value="support">🛠️ Support</option>
                                        <option value="review">🔍 Review</option>
                                        <option value="training">📚 Training</option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label htmlFor='status' className='block text-sm font-semibold text-gray-700'>
                                        📊 Status
                                    </label>
                                    <select
                                        id='status'
                                        name='status'
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300'
                                        required
                                    >
                                        <option value="new task">🆕 New Task</option>
                                        <option value="in progress">⏳ In Progress</option>
                                        <option value="pending">⏸️ Pending</option>
                                        <option value="completed">✅ Completed</option>
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
                                    className='bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2'
                                    disabled={loadingEmployees}
                                >
                                    {loadingEmployees ? 'Loading...' : 'Assign Task'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Employee Stats Section */}
                    {!loadingEmployees && employees.length > 0 && (
                        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                            <div className='bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4'>
                                <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
                                    <span>👥</span>
                                    Employee Database
                                </h3>
                            </div>
                            <div className='p-4'>
                                <div className='grid grid-cols-1 md:grid-cols-4 gap-4 text-center'>
                                    <div className='bg-blue-50 rounded-lg p-4'>
                                        <div className='text-2xl font-bold text-blue-600'>{employees.length}</div>
                                        <div className='text-sm text-blue-800'>Total Employees</div>
                                    </div>
                                    <div className='bg-green-50 rounded-lg p-4'>
                                        <div className='text-2xl font-bold text-green-600'>
                                            {[...new Set(employees.map(emp => emp.department))].length}
                                        </div>
                                        <div className='text-sm text-green-800'>Departments</div>
                                    </div>
                                    <div className='bg-purple-50 rounded-lg p-4'>
                                        <div className='text-2xl font-bold text-purple-600'>
                                            {employees.filter(emp => emp.role).length}
                                        </div>
                                        <div className='text-sm text-purple-800'>With Roles</div>
                                    </div>
                                    <div className='bg-orange-50 rounded-lg p-4'>
                                        <div className='text-2xl font-bold text-orange-600'>
                                            {employees.filter(emp => emp.profile_url).length}
                                        </div>
                                        <div className='text-sm text-orange-800'>With Photos</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
                                                    Status
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
                                                const isExpanded = expandedTasks[task.task_id];
                                                const showToggle = task.task_description && task.task_description.length > 100;
                                                
                                                return (
                                                    <tr key={task.task_id} className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                        <td className='px-6 py-4 align-top'>
                                                            <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border">
                                                                {task.task_id}
                                                            </span>
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                                                    {task.emp_name ? task.emp_name.charAt(0).toUpperCase() : 'U'}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-semibold text-gray-900">{task.emp_name}</div>
                                                                    <div className="text-xs text-gray-500">ID: {task.emp_id}</div>
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
                                                                        onClick={() => toggleDescription(task.task_id)}
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
                                                        <td className='px-6 py-4 align-top'>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                                                                {task.status}
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