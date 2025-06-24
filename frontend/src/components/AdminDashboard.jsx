import React from 'react';
import AreaChart from './Charts/AreaChartComponent'
import CustomBarChart from './Charts/CustomBarChart'
import SimpleLineChart from './Charts/SimpleLineChart'
import PieChart from './Charts/PieChart'
import DepartmentPerformanceRadarChart from './Charts/DepartmentPerformanceRadarChart';
import LeaveChart from './Charts/LeaveChart'
import HeatMap from './Charts/Heatmap';
import Calendar from './Charts/Calendar'
import TaskCompletionStatus from './Charts/TaskCompletionStatus';
import TaskAlertConvo from './Charts/TaskAlertConvo';
import Navbar from './Navbar';
import { Smartphone, MessageCircle, Settings, Users, UserCheck, CalendarClock, ChartColumn } from 'lucide-react';

function AdminDashboard() {
    return (
        <div className="min-h-screen w-auto bg-blue-100 flex">
            {/* Sidebar / Navbar */}
            <Navbar />

            {/* Dashboard Content */}
            <div className="dash min-h-screen ml-[20%] w-[80%] p-6 flex flex-col">

                <div className='background w-full h-[35vh] relative flex-shrink-0 rounded-2xl'>
                    {/* Wrap image in a clipping container */}
                    <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
                      <img
                        src="https://t3.ftcdn.net/jpg/06/26/16/88/360_F_626168846_2Dq2IUdYouxIjxSymWACWzH0oZRBPCiI.jpg"
                        className='w-full h-full object-cover'
                        alt="Background"
                      />
                    </div>

                    {/* Floating div not clipped */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white/60 backdrop-blur-xl w-[90%] h-[40%] rounded-3xl shadow-xl flex items-center justify-center z-10">
                        <div className='flex w-full'>
                            <img src="https://demos.creative-tim.com/soft-ui-dashboard-react/static/media/bruce-mars.45f6477957606abd2f24.jpg" 
                            className='h-18 w-18 ml-2 rounded-2xl'></img>
                            <div className='w-full flex justify-between'>
                                <div className='flex flex-col justify-center '>
                                    <p className='text-black font-bold text-2xl px-2'>Alex Thompson</p>
                                    <p className='text-black font-semibold text-md px-2'>CEO / Co-Founder</p>
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


                {/* Main content container - flex-grow to take remaining height */}
                <div className='w-full mt-20 flex-grow flex flex-col'>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
                        
                        {/* Card 1 */}
                        <div className="bg-white rounded-3xl shadow-xl p-4 flex items-center justify-between text-left">
                            <div>
                                <p className="font-bold text-lg">Total Employees</p>
                                <p className="text-xl font-semibold text-blue-600">120</p>
                            </div>
                            <span className="text-4xl"><Users size={45} /></span>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-3xl shadow-xl p-4 flex items-center justify-between text-left">
                            <div>
                                <p className="font-bold text-lg">Active Employees</p>
                                <p className="text-xl font-semibold text-green-600">105</p>
                            </div>
                            <span className="text-4xl"><UserCheck size={45} /></span>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-3xl shadow-xl p-4 flex items-center justify-between text-left">
                            <div>
                                <p className="font-bold text-lg">On Leave Today</p>
                                <p className="text-xl font-semibold text-red-600">15</p>
                            </div>
                            <span className="text-4xl"><CalendarClock size={45} /></span>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-white rounded-3xl shadow-xl p-4 flex items-center justify-between text-left">
                           <div>
                                <p className="font-bold text-lg">Attendance % Today</p>
                                <p className="text-xl font-semibold text-yellow-600">87%</p>
                            </div>
                            <span className="text-4xl"><ChartColumn size={45} /></span>
                        </div>
                    </div>

                    {/* Section 1 - Charts Row */}
                    <div className='section1 w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mt-6 p-6'>
                        {/* Attendance Heatmap - spans 4 of 7 columns */}
                        <div className='bg-white shadow-lg border border-gray-100 col-span-4 rounded-2xl max-h-[65vh] flex flex-col overflow-hidden'>
                            <div className='bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6'>
                                <h2 className='font-semibold text-white text-xl tracking-wide leading-tight'>
                                    Current Department-wise Attendance
                                </h2>
                                <p className='text-slate-200 text-sm font-medium mt-2 tracking-wide'>
                                <span className="text-green-300 font-bold drop-shadow-2xl text-stroke-white">+23%</span> improvement from last month
                                </p>
                            </div>
                            <div className='flex-grow overflow-hidden p-4'>
                                <HeatMap />
                            </div>
                        </div>

                        {/* Pie Chart - spans 3 of 7 columns */}
                        <div className='bg-white shadow-lg border border-gray-100 col-span-3 rounded-2xl max-h-[65vh] flex flex-col overflow-hidden'>
                            <div className='bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6'>
                                <h2 className='font-semibold text-white text-xl tracking-wide leading-tight'>
                                    Employee Distribution
                                </h2>
                                <p className='text-blue-100 text-sm font-medium mt-2 tracking-wide'>
                                    Total Employees: 780
                                </p>
                            </div>
                            <div className='flex-grow overflow-hidden p-4'>
                                <PieChart />
                            </div>
                        </div>
                    </div>

                    {/* Section 2 - Leave Chart and Calendar */}
                    <div className='section2 w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-11  gap-4 mt-4 p-4'>
                        <div className='col-span-7 min-h-[60vh] flex flex-col'>
                            <div className='flex-grow overflow-hidden'>
                                <LeaveChart />
                            </div>
                        </div>
                        <div className='col-span-4 rounded-3xl min-h-[60vh] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-3 flex flex-col'>
                            <div className='flex-grow overflow-hidden'>
                                <Calendar />
                            </div>
                        </div>
                    </div>

                    <div className='section3'>
                        <TaskAlertConvo />
                    </div>
                        
                        


                    <div className='section4 w-full p-4 mt-4'>
                        <TaskCompletionStatus />
                    </div>
                    {/* Bottom padding to ensure content doesn't stick to bottom */}
                    <div className='h-6'></div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;