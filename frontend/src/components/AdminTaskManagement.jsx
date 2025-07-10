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

    const BASE_URl = "https://ems2-backend.onrender.com"

    const generateUniqueTaskId = () => {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);
        return `TASK-${String(timestamp).slice(-6)}${String(randomNum).padStart(3, '0')}`;
    };

    const fetchEmployees = async () => {
        try {
            setLoadingEmployees(true);
            setEmployeeError(null);
            
            const res = await axios.get(`${BASE_URl}/api/employees`);
            
            const employeeData = res.data.employees || res.data || [];
            
            if (Array.isArray(employeeData)) {
                setEmployees(employeeData);
                setFilteredEmployees(employeeData);
            } else {
                throw new Error('Invalid employee data format received');
            }
        } catch (err) {
            console.error('Failed to fetch employees:', err.message);
            setEmployeeError(err.message);
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

        if (name === 'emp_name') {
            const filtered = employees.filter(emp => 
                emp.emp_name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredEmployees(filtered);
            setShowEmployeeDropdown(value.length > 0);
            
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
            const res = await axios.get(`${BASE_URl}/api/get-tasks`);
            setTasks(res.data.tasks);
        } catch (err) {
            console.error('Failed to fetch tasks:', err.message);
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
                const res = await axios.post(`${BASE_URl}/api/tasks`, newTask);
                setTasks(prev => [...prev, res.data.task]);

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

                alert('Task assigned successfully');
                fetchAllTasks();
            } catch (err) {
                console.error('Failed to save task:', err.message);
                alert('Failed to assign task. Please try again.');
            }
        } else {
            alert('Please fill in all required fields');
        }
    };

    const getTaskTagColor = (tag) => {
        switch(tag) {
            case 'project': return 'bg-blue-100 text-blue-800';
            case 'meeting': return 'bg-green-100 text-green-800';
            case 'support': return 'bg-orange-100 text-orange-800';
            case 'review': return 'bg-yellow-100 text-yellow-800';
            case 'training': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'new task': return 'bg-blue-100 text-blue-800';
            case 'in progress': return 'bg-yellow-100 text-yellow-800';
            case 'pending': return 'bg-orange-100 text-orange-800';
            case 'completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getDueDateColor = (dueDate) => {
        const days = getDaysUntilDue(dueDate);
        if (days < 0) return 'text-red-600';
        if (days <= 3) return 'text-orange-600';
        if (days <= 7) return 'text-yellow-600';
        return 'text-gray-600';
    };

    const toggleDescription = (taskId) => {
        setExpandedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    return (
        <div className="min-h-screen bg-blue-100">
            <Navbar />
            <div className="min-h-screen w-[80%] ml-[20%]">
                <div className="w-[95%] mx-auto py-8 space-y-8">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-sm border border-gray-200">
                        <div className="px-8 py-6 border-b border-gray-200">
                            <h1 className="text-2xl font-bold text-slate-100">
                                Task Management
                            </h1>
                            <p className="text-slate-200 mt-1">Manage and track employee tasks across departments</p>
                        </div>
                    </div>

                    {/* Employee Loading/Error States */}
                    {employeeError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error Loading Employees</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{employeeError}</p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={fetchEmployees}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Task Assignment Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-slate-100">
                                Assign New Task
                            </h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Task ID Field */}
                                <div>
                                    <label htmlFor="task_id" className="block text-sm font-medium text-gray-700">
                                        Task ID
                                    </label>
                                    <input
                                        type="text"
                                        id="task_id"
                                        name="task_id"
                                        value={formData.task_id}
                                        readOnly
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                                    />
                                </div>

                                {/* Employee Selection */}
                                <div className="relative">
                                    <label htmlFor="emp_name" className="block text-sm font-medium text-gray-700">
                                        Employee
                                    </label>
                                    <div className="mt-1 relative">
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
                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder={loadingEmployees ? "Loading..." : "Search employee"}
                                            required
                                            autoComplete="off"
                                            disabled={loadingEmployees}
                                        />
                                        {loadingEmployees && (
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Employee Dropdown */}
                                    {showEmployeeDropdown && filteredEmployees.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            {filteredEmployees.map((employee) => (
                                                <div
                                                    key={employee.emp_id}
                                                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
                                                    onClick={() => handleEmployeeSelect(employee)}
                                                >
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                            {employee.profile_url ? (
                                                                <img className="h-8 w-8 rounded-full" src={employee.profile_url} alt="" />
                                                            ) : (
                                                                <span className="text-gray-600 text-sm font-medium">
                                                                    {employee.emp_name.charAt(0).toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="ml-3">
                                                            <span className="font-medium text-gray-900 block truncate">
                                                                {employee.emp_name}
                                                            </span>
                                                            <span className="text-gray-500 text-xs block">
                                                                {employee.department} • ID: {employee.emp_id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Employee ID */}
                                <div>
                                    <label htmlFor="emp_id" className="block text-sm font-medium text-gray-700">
                                        Employee ID
                                    </label>
                                    <input
                                        type="text"
                                        id="emp_id"
                                        name="emp_id"
                                        value={formData.emp_id}
                                        readOnly
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                                    />
                                </div>

                                {/* Department */}
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        readOnly
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                                    />
                                </div>

                                {/* Due Date */}
                                <div>
                                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        id="dueDate"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                {/* Task Tag */}
                                <div>
                                    <label htmlFor="taskTag" className="block text-sm font-medium text-gray-700">
                                        Task Type
                                    </label>
                                    <select
                                        id="taskTag"
                                        name="taskTag"
                                        value={formData.taskTag}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Select task type</option>
                                        <option value="project">Project</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="support">Support</option>
                                        <option value="review">Review</option>
                                        <option value="training">Training</option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    >
                                        <option value="new task">New Task</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>

                                {/* Task Description */}
                                <div className="md:col-span-2">
                                    <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">
                                        Task Description
                                    </label>
                                    <textarea
                                        id="taskDescription"
                                        name="taskDescription"
                                        value={formData.taskDescription}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Provide detailed task description..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={loadingEmployees}
                                >
                                    Assign Task
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Employee Stats Section */}
                    {!loadingEmployees && employees.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-slate-100">
                                    Employee Overview
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="text-2xl font-semibold text-gray-900">{employees.length}</div>
                                        <div className="text-sm text-gray-500">Total Employees</div>
                                    </div>
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {[...new Set(employees.map(emp => emp.department))].length}
                                        </div>
                                        <div className="text-sm text-gray-500">Departments</div>
                                    </div>
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {employees.filter(emp => emp.role).length}
                                        </div>
                                        <div className="text-sm text-gray-500">With Roles</div>
                                    </div>
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {employees.filter(emp => emp.profile_url).length}
                                        </div>
                                        <div className="text-sm text-gray-500">With Photos</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Assigned Tasks List */}
                    {tasks.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-indigo-700 border-gray-200 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-medium text-slate-100">
                                        Active Tasks
                                    </h2>
                                    <p className="text-sm text-slate-200 mt-1">
                                        {tasks.length} task{tasks.length !== 1 ? 's' : ''} currently assigned
                                    </p>
                                </div>
                                <div className="bg-gray-100 rounded-full px-3 py-1">
                                    <span className="text-gray-800 font-medium">{tasks.length}</span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Task ID
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Employee
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Department
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Description
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Assigned
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Due Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {tasks.map((task, index) => {
                                                const isExpanded = expandedTasks[task.task_id];
                                                const showToggle = task.task_description && task.task_description.length > 100;
                                                // Find the employee data for this task
                                                const employee = employees.find(emp => emp.emp_id === task.emp_id);

                                                return (
                                                    <tr key={task.task_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-mono text-gray-900">{task.task_id}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                            {employee?.profile_url ? (
                                                                <img 
                                                                    src={employee.profile_url} 
                                                                    alt={task.emp_name}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = 'default-profile-url'; // Add a default profile image URL here
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span className="text-gray-600 font-medium">
                                                                    {task.emp_name ? task.emp_name.charAt(0).toUpperCase() : 'U'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{task.emp_name}</div>
                                                            <div className="text-sm text-gray-500">ID: {task.emp_id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{task.department}</div>
                                                        </td>
                                                        <td className="px-6 py-4 max-w-xs">
                                                            <div className="text-sm text-gray-900">
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
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTaskTagColor(task.task_tag)}`}>
                                                                {task.task_tag}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                                                {task.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(task.assigned_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm">
                                                                <div className={getDueDateColor(task.due_date)}>
                                                                    {new Date(task.due_date).toLocaleDateString()}
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