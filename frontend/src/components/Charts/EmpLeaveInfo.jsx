import React from 'react'
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react'

function EmpLeaveInfo() {
    return (
        <div className='h-full w-full'>
            <div className='bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl h-full w-full p-4 shadow-lg'>
                <div className='grid grid-cols-4 gap-4 h-full'>
                    <div className='bg-white rounded-2xl p-2 flex flex-col justify-center items-center text-center shadow-lg border border-slate-200 hover:shadow-3xl hover:scale-[1.05] hover:rounded-3xl duration-500 ease-in-out transition-all'>
                        <div className='mb-3'>
                            <Calendar className='w-8 h-8 text-blue-500' />
                        </div>
                        <div className='text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide'>
                            Total Leaves Alloted
                        </div>
                        <div className='text-4xl font-bold text-slate-800 mb-2'>
                            24
                        </div>
                        <div className='w-12 h-1 bg-blue-500 rounded-full'></div>
                    </div>
                    <div className='bg-white rounded-2xl p-2 flex flex-col justify-center items-center text-center shadow-md border border-slate-200 hover:shadow-3xl hover:scale-[1.05] hover:rounded-3xl duration-500 ease-in-out transition-all'>
                        <div className='mb-3'>
                            <CheckCircle className='w-8 h-8 text-red-500' />
                        </div>
                        <div className='text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide'>
                            Leaves Taken
                        </div>
                        <div className='text-4xl font-bold text-slate-800 mb-2'>
                            8
                        </div>
                        <div className='w-12 h-1 bg-red-500 rounded-full'></div>
                    </div>
                    <div className='bg-white rounded-2xl p-2 flex flex-col justify-center items-center text-center shadow-md border border-slate-200 hover:shadow-3xl hover:scale-[1.05] hover:rounded-3xl duration-500 ease-in-out transition-all'>
                        <div className='mb-3'>
                            <Clock className='w-8 h-8 text-green-500' />
                        </div>
                        <div className='text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide'>
                            Leaves Remaining
                        </div>
                        <div className='text-4xl font-bold text-slate-800 mb-2'>
                            16
                        </div>
                        <div className='w-12 h-1 bg-green-500 rounded-full'></div>
                    </div>
                    <div className='bg-white rounded-2xl p-2 flex flex-col justify-center items-center text-center shadow-md border border-slate-200 hover:shadow-3xl hover:scale-[1.05] hover:rounded-3xl duration-500 ease-in-out transition-all'>
                        <div className='mb-3'>
                            <AlertCircle className='w-8 h-8 text-yellow-500' />
                        </div>
                        <div className='text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide'>
                            Leaves Request Pending
                        </div>
                        <div className='text-4xl font-bold text-slate-800 mb-2'>
                            2
                        </div>
                        <div className='w-12 h-1 bg-yellow-500 rounded-full'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmpLeaveInfo