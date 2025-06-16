import React from 'react';
import ReactApexChart from 'react-apexcharts';

const EmpTaskStatus = () => {
  const [state, setState] = React.useState({
    series: [1, 4, 1, 2], // [In Progress, Completed, Overdue, New]
    options: {
      chart: {
        type: 'polarArea',
      },
      labels: ['In Progress', 'Completed', 'Overdue', 'New'],
      colors: ['#ffe900', '#17e895', '#f21d52', '#364cf5'], // Yellow, Green, Red, Blue
      stroke: {
        colors: ['#000'], // black outline for segments
      },
      fill: {
        opacity: 0.85,
      },
      plotOptions: {
        polarArea: {
          rings: {
            strokeColor: '#000', // black circular grid lines
          },
          spokes: {
            strokeColor: '#000', // black radial lines
          },
        },
      },
      grid: {
        show: true,
        borderColor: '#000', // ensure grid is black
      },
      legend: {
        position: 'right',
        labels: {
          colors: '#000',
          useSeriesColors: false,
        },
        fontWeight: 700,
      },
      dataLabels: {
        style: {
          colors: ['#000'],
          fontWeight: 'bold',
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#000',
            fontWeight: 'bold',
          },
        },
      },
      xaxis: {
        labels: {
          style: {
            colors: '#000',
            fontWeight: 'bold',
          },
        },
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 280,
          },
          legend: {
            position: 'bottom',
          },
        },
      }],
    },
  });

  return (
    <div>
      <div id="chart" className='h-full flex flex-col'>
        <div className='p-4 rounded-t-3xl bg-gradient-to-r from-blue-600 via-blue-700 to bg-indigo-800 mb-4'>
            <h3 className='text-xl font-bold text-white'>Task Distribution</h3>
            <p className='text-sm text-slate-100'>Overview of Current Task Status</p>
        </div>
        <ReactApexChart options={state.options} series={state.series} type="polarArea" />
      </div>
    </div>
  );
};

export default EmpTaskStatus;
