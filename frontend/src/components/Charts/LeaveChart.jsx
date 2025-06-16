import React from 'react';
import ReactApexChart from 'react-apexcharts';

const leaveData = {
  HR: { Approved: 23, Pending: 9, Rejected: 4 },
  Sales: { Approved: 18, Pending: 5, Rejected: 3 },
  IT: { Approved: 24, Pending: 7, Rejected: 5 },
  Finance: { Approved: 20, Pending: 6, Rejected: 2 },
  Marketing: { Approved: 15, Pending: 8, Rejected: 1 },
  Operations: { Approved: 22, Pending: 4, Rejected: 3 },
  Legal: { Approved: 10, Pending: 3, Rejected: 0 },
  'Customer Support': { Approved: 19, Pending: 7, Rejected: 4 },
  'R&D': { Approved: 25, Pending: 10, Rejected: 6 },
  Admin: { Approved: 16, Pending: 2, Rejected: 1 },
};

const LeaveChart = () => {
  const departments = Object.keys(leaveData);

  // Prepare series for Approved, Pending, Rejected with counts per department
  const series = [
    {
      name: 'Approved',
      data: departments.map(dept => leaveData[dept].Approved),
      color: '#10B981', // Green for approved
    },
    {
      name: 'Pending',
      data: departments.map(dept => leaveData[dept].Pending),
      color: '#F59E0B', // Amber for pending
    },
    {
      name: 'Rejected',
      data: departments.map(dept => leaveData[dept].Rejected),
      color: '#EF4444', // Red for rejected
    },
  ];

  const options = {
    chart: {
      type: 'area',
      stacked: false,
      height: 450,
      zoom: { enabled: false },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      background: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    colors: ['#10B981', '#F59E0B', '#EF4444'],
    dataLabels: { 
      enabled: false 
    },
    markers: { 
      size: 4,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    grid: {
      show: true,
      borderColor: '#E5E7EB',
      strokeDashArray: 2,
      position: 'back',
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 30,
        bottom: 0,
        left: 20,
      },
    },
    yaxis: {
      labels: {
        style: { 
          colors: '#6B7280',
          fontSize: '12px',
          fontWeight: 500,
        },
        formatter: val => Math.round(val),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      title: { 
        text: 'Number of Leave Requests',
        style: {
          color: '#374151',
          fontSize: '14px',
          fontWeight: 600,
        },
      },
      min: 0,
    },
    xaxis: {
      type: 'category',
      categories: departments,
      labels: {
        rotate: 0, // Horizontal labels
        rotateAlways: false,
        hideOverlappingLabels: false,
        trim: false,
        style: {
          colors: '#374151',
          fontSize: '12px',
          fontWeight: 500,
        },
        offsetY: 5,
      },
      axisBorder: {
        show: true,
        color: '#E5E7EB',
        height: 1,
      },
      axisTicks: {
        show: true,
        color: '#E5E7EB',
        height: 6,
      },
      title: { 
        text: 'Department',
        style: {
          color: '#374151',
          fontSize: '14px',
          fontWeight: 600,
        },
        offsetY: -5,
      },
    },
    title: {
      text: 'Leave Requests by Department',
      align: 'left',
      offsetX: 20,
      margin: 20,
      style: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#111827',
      },
    },
    subtitle: {
      text: 'Tracking approved, pending, and rejected leave requests across all departments',
      align: 'left',
      offsetX: 20,
      margin : 20,
      style: {
        fontSize: '14px',
        color: '#6B7280',
        fontWeight: 400,
      },
    },
    tooltip: { 
      shared: true,
      intersect: false,
      theme: 'light',
      style: {
        fontSize: '12px',
      },
      x: {
        show: true,
        format: 'dd MMM',
      },
      y: {
        formatter: (val, { seriesIndex }) => {
          const statuses = ['approved leaves', 'pending leaves', 'rejected leaves'];
          return `${val} ${statuses[seriesIndex]}`;
        },
      },
      marker: {
        show: true,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetX: -10,
      offsetY: 10,
      fontSize: '13px',
      fontWeight: 500,
      labels: {
        colors: '#374151',
      },
      markers: {
        width: 12,
        height: 12,
        radius: 6,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 400,
          },
          xaxis: {
            labels: {
              rotate: -45,
              rotateAlways: true,
              style: {
                fontSize: '10px',
              },
            },
          },
          title: {
            style: {
              fontSize: '18px',
            },
          },
          subtitle: {
            style: {
              fontSize: '12px',
            },
          },
        },
      },
    ],
  };

  // Calculate totals for summary cards
  const totals = departments.reduce(
    (acc, dept) => {
      acc.approved += leaveData[dept].Approved;
      acc.pending += leaveData[dept].Pending;
      acc.rejected += leaveData[dept].Rejected;
      return acc;
    },
    { approved: 0, pending: 0, rejected: 0 }
  );

  return (
    <div className="w-full rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-sm border border-gray-200">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Approved</p>
              <p className="text-2xl font-bold text-green-700">{totals.approved}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Total Pending</p>
              <p className="text-2xl font-bold text-amber-700">{totals.pending}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L10 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Total Rejected</p>
              <p className="text-2xl font-bold text-red-700">{totals.rejected}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <ReactApexChart 
          options={options} 
          series={series} 
          type="area" 
          height={550} 
        />
      </div>

      {/* Department Summary Table */}
      {/* <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approved
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pending
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rejected
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((dept) => {
              const data = leaveData[dept];
              const total = data.Approved + data.Pending + data.Rejected;
              return (
                <tr key={dept} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dept}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {data.Approved}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 font-medium">
                    {data.Pending}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    {data.Rejected}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default LeaveChart;