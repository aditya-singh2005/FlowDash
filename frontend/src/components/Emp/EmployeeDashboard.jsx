import React, { useState, useEffect } from 'react'
import EmpNavbar from "../Emp/EmpNavbar"
import { Smartphone, MessageCircle, Settings, NotepadText, Ellipsis, Loader, LaptopMinimalCheck, SquareCheckBig, SquareCheckBigIcon, CircleAlert, Calendar1 } from 'lucide-react';
import EmpTaskStatus from '../Charts/EmpTaskStatus';
import EmpMonthlyPerformance from "../Charts/EmpMonthlyPerformance"
import EmpDeptBarChart from '../Charts/EmpDeptBarChart'
import PeerCompariosnRaceChart from '../Charts/EmpPeerComparisonRaceChart'
import EmpCalendar from '../Charts/EmpCalendar'
import EmpLeaveInfo from '../Charts/EmpLeaveInfo';
import EmpMonthlyAttendance from '../Charts/EmpMonthlyAttendance';

function EmployeeDashboard() {
    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
     const BASE_URl = "https://ems2-backend.onrender.com"

    useEffect(() => {
    const fetchEmployeeDetails = async () => {
        try {
            setLoading(true);
            
            // Get token from localStorage
            const token = localStorage.getItem('token');
            console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('Making request to /api/employee-details...');
            
            // Fetch employee details using the token
            const response = await fetch(`${BASE_URl}/api/employee-details`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response:', errorText);
                
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    throw new Error('Authentication failed. Please login again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Received data:', data);
            console.log('Employee name from data:', data?.emp_name);
            
            setEmployeeData(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching employee:", error);
            setError(error.message);
            
            // If authentication error, you might want to redirect to login
            if (error.message.includes('Authentication failed') || error.message.includes('No authentication token')) {
                window.location.href = '/';
            }
        } finally {
            setLoading(false);
        }
    };

    fetchEmployeeDetails();
}, []);

    // Show loading state
    if (loading) {
        return (
            <div>
                <EmpNavbar />
                <div className="dash min-h-screen ml-[20%] w-[80%] p-6 bg-blue-100 flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="animate-spin h-8 w-8 mx-auto mb-4" />
                        <p>Loading employee data...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div>
                <EmpNavbar />
                <div className="dash min-h-screen ml-[20%] w-[80%] p-6 bg-blue-100 flex items-center justify-center">
                    <div className="text-center text-red-600">
                        <CircleAlert className="h-8 w-8 mx-auto mb-4" />
                        <p>Error loading employee data: {error}</p>
                        {error.includes('Authentication failed') && (
                            <button 
                                onClick={() => window.location.href = '/'}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Go to Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Show main dashboard when data is loaded
    return (
        <div>
            <EmpNavbar />

            <div className="dash min-h-screen ml-[20%] w-[80%] p-6 bg-blue-100 flex flex-col">
                
                <div className='background w-full h-[35vh] relative flex-shrink-0 rounded-2xl'>
                    <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
                      <img
                        src="https://img.pikbest.com/origin/09/32/81/29fpIkbEsTgys.jpg!sw800"
                        className='w-full h-full scale-x-[-1] '
                        alt="Background"
                      />
                    </div>

                    <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white/60 backdrop-blur-xl w-[90%] h-[40%] rounded-3xl shadow-xl flex items-center justify-center z-10'>
                        <div className='flex w-full'>
                            <img src={employeeData?.profile_url || "https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"}
                            className='h-18 w-18 ml-2 rounded-2xl object-cover'
                            alt="profile-pic"></img>
                            <div className='w-full flex justify-between'>
                                <div className='flex flex-col justify-center '>
                                    <p className='text-black font-bold text-2xl px-2'>
                                        {employeeData?.emp_name || 'Loading...'}
                                    </p>
                                    <p className='text-black font-semibold text-md px-2'>
                                        {employeeData?.department || employeeData?.job_title || 'Software Developer Engineer - II'}
                                    </p>
                                </div>
                                <div className=' flex items-center justify-evenly w-2/5'>
                                    <div className='px-4 py-1 font-medium text-black border-slate-100 border bg-white/8 shadow-xl backdrop-blur-3xl rounded-lg flex gap-1 items-center'><Smartphone size={18} />App</div>
                                    <div className='px-4 py-1 font-medium text-black border-slate-100 border bg-white/8 shadow-xl backdrop-blur-3xl rounded-lg flex gap-1 items-center'><MessageCircle size={18} />Message</div>
                                    <div className='px-4 py-1 font-medium text-black border-slate-100 border bg-white/8 shadow-xl backdrop-blur-3xl rounded-lg flex gap-1 items-center'><Settings size={18} /> Settings</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full mt-20 flex-grow flex flex-col'>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
                        
                        {/* Card 1 */}
                        <div className="bg-white rounded-3xl shadow-xl p-4 flex items-center justify-between text-left">
                            <div>
                                <p className="font-bold text-lg">New Tasks</p>
                                <p className="text-xl font-semibold text-blue-600">2</p>
                            </div>
                            <span className="text-4xl"><NotepadText size={50}/></span>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-3xl shadow-xl p-4 flex items-center justify-between text-left">
                            <div>
                                <p className="font-bold text-lg">In Progress</p>
                                <p className="text-xl font-semibold text-yellow-500">1</p>
                            </div>
                            <span className="text-4xl"><Loader size={45} /></span>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-3xl shadow-xl p-4 flex items-center justify-between text-left">
                            <div>
                                <p className="font-bold text-lg">Completed</p>
                                <p className="text-xl font-semibold text-green-600">4</p>
                            </div>
                            <span className="text-4xl"><SquareCheckBigIcon size={45} /></span>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-white rounded-3xl shadow-xl p-4 flex items-center justify-between text-left">
                           <div>
                                <p className="font-bold text-lg">Overdue</p>
                                <p className="text-xl font-semibold text-red-600">0</p>
                            </div>
                            <span className="text-4xl"><CircleAlert size={45} /></span>
                        </div>
                    </div>

                    <div className='section1 w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 h-auto p-4'>
                        <div className='col-span-3 bg-white rounded-3xl'>
                            <EmpTaskStatus />
                        </div>
                        <div className='col-span-4  bg-white rounded-3xl'>
                            <EmpMonthlyPerformance />
                        </div>
                    </div>

                    <div className='section2 w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-9  gap-4 mt-4 p-4'>
                        <div className='col-span-4 min-h-[60vh] flex flex-col'>
                            <div className='flex-grow bg-white rounded-3xl overflow-hidden'>
                                <EmpDeptBarChart />
                            </div>
                        </div>
                        <div className='col-span-5 rounded-3xl min-h-[70vh] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-3 flex flex-col'>
                            <div className='flex-grow overflow-hidden'>
                                <PeerCompariosnRaceChart />
                            </div>
                        </div>
                    </div>

                    <div className='section3 w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-11  gap-4 mt-4 p-4'>
                        <div className='col-span-7 min-h-[60vh] flex flex-col space-y-2'>
                            <div className='flex-grow-1 bg-red-200 rounded-3xl overflow-hidden'>
                                <EmpLeaveInfo />
                            </div>
                            <div className=' flex-grow-5 overflow-hidden rounded-3xl bg-green-400'>
                                <EmpMonthlyAttendance />
                            </div>
                        </div>
                        <div className='col-span-4 rounded-3xl min-h-[60vh] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-3 flex flex-col'>
                            <div className='flex-grow overflow-hidden'>
                                <EmpCalendar />
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    )
}

export default EmployeeDashboard