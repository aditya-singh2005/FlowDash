import React from 'react';

const TaskAlertConvo = () => {
  return (
    <div className='section3 w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6 p-6'>
      {/* Ongoing Tasks */}
      <div className='bg-white shadow-lg border border-gray-100 h-[70vh] flex flex-col rounded-2xl overflow-hidden'>
        <div className='w-full h-[10vh] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 flex items-center p-6 flex-shrink-0'>
          <h2 className='font-semibold text-xl text-white tracking-wide'>Ongoing Tasks</h2>
        </div>
        <div className='h-[60vh] overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-blue-400 to-indigo-700'>
          {[
            { title: 'Website Redesign', team: 'Development Team', status: 'In Progress', due: 'Dec 15', color: 'purple' },
            { title: 'Performance Review', team: 'HR Department', status: 'Pending', due: 'Dec 10', color: 'orange' },
            { title: 'Server Migration', team: 'IT Team', status: 'Completed', due: 'Dec 8', color: 'green' },
            { title: 'Budget Planning', team: 'Finance Team', status: 'Urgent', due: 'Dec 12', color: 'red' },
            { title: 'Training Program', team: 'Learning & Development', status: 'Planning', due: 'Dec 20', color: 'teal' },
            { title: 'Client Presentation', team: 'Sales Team', status: 'In Review', due: 'Dec 18', color: 'blue' },
            { title: 'Security Audit', team: 'Security Team', status: 'Starting', due: 'Dec 25', color: 'indigo' },
          ].map(({ title, team, status, due, color }) => (
            <div key={title} className={`bg-white p-4 rounded-lg shadow-sm border-l-4 border-${color}-400 hover:shadow-md transition-all hover:scale-[1.02]`}>
              <h4 className='font-semibold text-gray-800 text-sm mb-1'>{title}</h4>
              <p className='text-xs text-gray-600 mb-3'>Assigned to: {team}</p>
              <div className='flex justify-between items-center'>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  status === 'Completed' ? 'bg-green-100 text-green-700' :
                  status === 'Urgent' ? 'bg-red-100 text-red-700' :
                  status === 'In Progress' ? 'bg-purple-100 text-purple-700' :
                  status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                  status === 'Planning' ? 'bg-teal-100 text-teal-700' :
                  status === 'In Review' ? 'bg-blue-100 text-blue-700' :
                  'bg-indigo-100 text-indigo-700'
                }`}>
                  {status}
                </span>
                <span className='text-xs text-gray-500 font-medium'>Due: {due}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts/Warnings */}
      <div className='bg-white shadow-lg border border-gray-100 h-[70vh] flex flex-col rounded-2xl overflow-hidden'>
        <div className='w-full h-[10vh] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 flex items-center p-6 flex-shrink-0'>
          <h2 className='font-semibold text-xl text-white tracking-wide'>Alerts & Warnings</h2>
        </div>
        <div className='h-[60vh] overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-blue-400 to-indigo-700'>
          {[
            { icon: '⚠️', title: 'High Absenteeism', detail: 'Marketing Dept: 25% absent today', time: '2 hours ago', color: 'red' },
            { icon: '🔔', title: 'Deadline Approaching', detail: 'Project Alpha due in 2 days', time: '5 hours ago', color: 'amber' },
            { icon: '📊', title: 'Performance Drop', detail: 'Sales team 15% below target', time: '1 day ago', color: 'orange' },
            { icon: '💻', title: 'System Maintenance', detail: 'Scheduled downtime tomorrow 2-4 AM', time: '3 hours ago', color: 'blue' },
            { icon: '📋', title: 'Pending Approvals', detail: '12 leave requests awaiting approval', time: '6 hours ago', color: 'purple' },
            { icon: '🔒', title: 'Security Alert', detail: 'Multiple failed login attempts detected', time: '30 minutes ago', color: 'rose' },
            { icon: '📈', title: 'Resource Usage High', detail: 'Server CPU usage at 85% capacity', time: '1 hour ago', color: 'indigo' },
          ].map(({ icon, title, detail, time, color }) => (
            <div key={title} className={`bg-white p-4 rounded-lg border-l-4 border-${color}-400 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]`}>
              <div className='flex items-start'>
                <span className='text-xl mr-3 mt-0.5'>{icon}</span>
                <div className='flex-1'>
                  <h4 className={`font-semibold text-sm mb-1 text-${color}-800`}>
                    {title}
                  </h4>
                  <p className={`text-xs mb-2 text-${color}-600`}>
                    {detail}
                  </p>
                  <span className='text-xs text-gray-500 font-medium'>{time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Conversations */}
      <div className='bg-white shadow-lg border border-gray-100 h-[70vh] flex flex-col rounded-2xl overflow-hidden'>
        <div className='w-full h-[10vh] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 flex items-center p-6 flex-shrink-0'>
          <h2 className='font-semibold text-xl text-white tracking-wide'>Employee Conversations</h2>
        </div>
        <div className='h-[60vh] overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-blue-400 to-indigo-700'>
          {[
            { initials: 'JS', name: 'John Smith', role: 'Software Developer', message: 'Need clarification on the new API requirements...', status: 'Active', time: '10 min ago', bgColor: 'blue' },
            { initials: 'MJ', name: 'Maria Johnson', role: 'HR Manager', message: 'Updated employee handbook is ready for review...', status: 'Pending', time: '1 hour ago', bgColor: 'pink' },
            { initials: 'RD', name: 'Robert Davis', role: 'Marketing Lead', message: 'Campaign results are in, exceeding expectations!', status: 'Read', time: '2 hours ago', bgColor: 'green' },
            { initials: 'KS', name: 'Khushi Sharma', role: 'Marketing Lead', message: 'Got one lead, Amazing offer!', status: 'Read', time: '4 hours ago', bgColor: 'purple' },
          ].map(({ initials, name, role, message, status, time, bgColor }) => (
            <div key={name} className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all hover:scale-[1.02]'>
              <div className='flex items-center mb-3'>
                <div className={`w-10 h-10 bg-gradient-to-br ${
                  bgColor === 'blue' ? 'from-blue-500 to-blue-600' :
                  bgColor === 'pink' ? 'from-pink-500 to-pink-600' :
                  bgColor === 'green' ? 'from-green-500 to-green-600' :
                  'from-purple-500 to-purple-600'
                } rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3 shadow-md`}>
                  {initials}
                </div>
                <div>
                  <h4 className='font-semibold text-sm text-gray-800'>{name}</h4>
                  <span className='text-xs text-gray-500'>{role}</span>
                </div>
              </div>
              <p className='text-xs text-gray-600 mb-3 line-clamp-2'>{message}</p>
              <div className='flex justify-between items-center'>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                  status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {status}
                </span>
                <span className='text-xs text-gray-500 font-medium'>{time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskAlertConvo;