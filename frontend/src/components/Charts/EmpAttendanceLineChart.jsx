import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const EmployeeAttendanceChart = () => {
    const attendanceData = [
        { name: 'Jan', attendance: 95 },
        { name: 'Feb', attendance: 88 },
        { name: 'Mar', attendance: 92 },
        { name: 'Apr', attendance: 89 },
        { name: 'May', attendance: 94 },
        { name: 'Jun', attendance: 91 }
    ]

    // Calculate average attendance for current year (up to current month)
    const totalAttendance = attendanceData.reduce((sum, month) => sum + month.attendance, 0)
    const averageAttendance = Math.round(totalAttendance / attendanceData.length)

    // Get current month for display
    const currentMonth = attendanceData[attendanceData.length - 1]
    const attendanceStatus = currentMonth.attendance >= 90 ? 'Excellent' : currentMonth.attendance >= 80 ? 'Good' : 'Needs Improvement'
    const statusColor = currentMonth.attendance >= 90 ? 'text-emerald-600' : currentMonth.attendance >= 80 ? 'text-blue-600' : 'text-amber-600'

    return (
        <div className='h-full w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 rounded-3xl shadow-2xl border border-gray-100'>
            {/* Header Section */}
            <div className='mb-4'>
                <div className='bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl flex items-center justify-between mb-4 px-6 py-4'>
                    <div>
                        <h1 className='text-3xl font-bold text-white mb-2'>Attendance Analytics</h1>
                        <p className='text-blue-100 text-base'>Track your monthly attendance performance</p>
                    </div>
                    <div>
                        <div className='bg-white rounded-md px-4 py-1 mr-2 shadow-lg border border-blue-100'>
                            <p className='text-sm text-gray-600 font-medium mb-1'>Current Status</p>
                            <p className={`text-lg font-bold ${statusColor}`}>{attendanceStatus}</p>
                        </div>
                    </div>
                </div>
                
                <div className='px-4'>
                {/* Stats Cards */}
                <div className='grid grid-cols-3 gap-4'>
                    <div className='bg-white rounded-2xl p-6 shadow-md border border-gray-200'>
                        <div className='flex items-center justify-between'>
                            <div className='flex-1'>
                                <p className='text-sm font-medium text-gray-500 mb-2'>Current Month</p>
                                <p className='text-2xl font-bold text-blue-600 mb-1'>{currentMonth.attendance}%</p>
                                <p className='text-xs text-gray-400'>{currentMonth.name} 2025</p>
                            </div>
                            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ml-4'>
                                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-2xl p-6 shadow-md border border-gray-200'>
                        <div className='flex items-center justify-between'>
                            <div className='flex-1'>
                                <p className='text-sm font-medium text-gray-500 mb-2'>YTD Average</p>
                                <p className='text-2xl font-bold text-emerald-600 mb-1'>{averageAttendance}%</p>
                                <p className='text-xs text-gray-400'>Jan - {currentMonth.name}</p>
                            </div>
                            <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 ml-4'>
                                <svg className='w-6 h-6 text-emerald-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-2xl p-6 shadow-md border border-gray-200'>
                        <div className='flex items-center justify-between'>
                            <div className='flex-1'>
                                <p className='text-sm font-medium text-gray-500 mb-2'>Target</p>
                                <p className='text-2xl font-bold text-purple-600 mb-1'>90%</p>
                                <p className={`text-xs ${averageAttendance >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {averageAttendance >= 90 ? '✓ Achieved' : `${90 - averageAttendance}% to go`}
                                </p>
                            </div>
                            <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 ml-4'>
                                <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            </div>

            <div className='px-4'>

            {/* Chart Section */}
            <div className='bg-white rounded-2xl p-6 shadow-md border border-gray-200'>
                <div className='mb-6'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-1'>Monthly Attendance Trend</h3>
                    <p className='text-sm text-gray-500'>Your attendance percentage over the months</p>
                </div>
                <div className='h-80'>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={attendanceData} margin={{ top: 20, right: 30, left: 30, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickMargin={8}
                                />
                            <YAxis 
                                domain={[80, 100]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickFormatter={(value) => `${value}%`}
                                tickMargin={8}
                                width={50}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    fontSize: '14px',
                                    padding: '12px 16px'
                                }}
                                formatter={(value) => [`${value}%`, 'Attendance']}
                                labelStyle={{ color: '#374151', fontWeight: 600, marginBottom: '4px' }}
                                />
                            <Line 
                                type="monotone" 
                                dataKey="attendance" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
                                activeDot={{ r: 8, fill: '#3b82f6', strokeWidth: 3, stroke: '#ffffff' }}
                                />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Footer */}
            <div className='mt-6 text-center'>
                <p className='text-xs text-gray-400'>
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>
        </div>
        </div>
        
    )
}

export default EmployeeAttendanceChart