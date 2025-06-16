import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
  const [state] = React.useState({
    series: [
      {
        name: 'Potential Performance (%)',
        data: [85, 88, 90, 92, 94, 96, 95, 93, 91, 89, 90, 92]
      },
      {
        name: 'Actual Performance (%)',
        data: [78, 82, 84, 87, 90, 88, 86, 85, 84, 82, 83, 85]
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'area',
        toolbar: { show: false }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        categories: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        title: {
          text: 'Month',
          style: { fontWeight: 700, color: '#000' }
        },
        labels: {
          style: { fontWeight: 600, color: '#000' }
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Performance (%)',
          style: { fontWeight: 700, color: '#000' }
        },
        labels: {
          style: { fontWeight: 600, color: '#000' }
        }
      },
      tooltip: {
        y: {
          formatter: val => `${val}%`
        }
      },
      legend: {
        position: 'top',
        labels: {
          colors: '#000',
          useSeriesColors: false
        },
        fontWeight: 600
      },
      colors: ['#6496fa', '#07e007']
    }
  });

  return (
    <div id="chart">
        <div className='p-4 border-b-2 rounded-t-3xl bg-gradient-to-r from-blue-600 via-blue-700 to bg-indigo-800 border-gray-300 '>
            <h3 className='text-xl font-bold text-white'>Monthly Performance</h3>
            <p className='text-sm text-slate-100'>Potential vs Actual Performance Comparison</p>
        </div>
      <ReactApexChart options={state.options} series={state.series} type="area" height={350} />
    </div>
  );
};

export default ApexChart;
