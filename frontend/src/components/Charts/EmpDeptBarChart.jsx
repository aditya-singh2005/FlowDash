import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
  const [state, setState] = React.useState({
    series: [
      {
        name: 'Pending Tasks',
        data: [2,1],
      },
      {
        name: 'Completed Tasks',
        data: [4, 2],
      }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 8,
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
        colors: ['#ffffff']
      },
      xaxis: {
        categories: ['Engineering', 'HR'],
        labels: {
          style: { colors: '#1a1a1a', fontSize: '14px' }
        },
        axisBorder: {
          show: true,
          color: '#ccc'
        },
        axisTicks: {
          show: true,
          color: '#ccc'
        },
        title: {
          text: 'Departments',
          style: { color: '#1a1a1a', fontWeight: 600 }
        }
      },
      yaxis: {
        labels: {
          style: { colors: '#1a1a1a', fontSize: '14px' }
        },
        axisBorder: {
          show: true,
          color: '#ccc'
        },
        axisTicks: {
          show: true,
          color: '#ccc'
        },
        title: {
          text: 'Number of Tasks',
          style: { color: '#1a1a1a', fontWeight: 600 }
        }
      },
      fill: {
        opacity: 1,
        colors: ['#919191', '#282ef7'] // softer red & green
      },
      grid: {
        borderColor: '#e0e0e0', // light gray grid
        strokeDashArray: 4,     // subtle dashed lines
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '14px',
        labels: {
          colors: '#1a1a1a'
        },
        markers: {
          radius: 4
        }
      },
      tooltip: {
        enabled: true,
        theme: 'light',
        style: {
          fontSize: '13px'
        }
      }
    }
  });

  return (
    <div>
        <div className="p-6 border-b-2 rounded-t-3xl bg-gradient-to-r from-blue-600 via-blue-700 to bg-indigo-800 border-gray-300">
          <h3 className="text-xl font-bold text-white">Department Task Overview</h3>
          <p className="text-sm text-slate-100">Track your pending and completed tasks across departments</p>
        </div>
          <ReactApexChart 
            options={state.options} 
            series={state.series} 
            type="bar" 
            height={450} 
            width="100%"
          />
    </div>
  );
};

export default ApexChart;
