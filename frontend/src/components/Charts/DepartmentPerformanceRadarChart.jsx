import React, { useState } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';

const data = [
  { category: 'Outstanding', HR: 20, Sales: 18, IT: 25, Finance: 22, Marketing: 15, Operations: 30, Legal: 10, Admin: 12, RnD: 28, QA: 20 },
  { category: 'Excellent', HR: 30, Sales: 25, IT: 28, Finance: 20, Marketing: 18, Operations: 25, Legal: 12, Admin: 10, RnD: 26, QA: 22 },
  { category: 'Good', HR: 25, Sales: 30, IT: 20, Finance: 18, Marketing: 20, Operations: 20, Legal: 15, Admin: 14, RnD: 22, QA: 18 },
  { category: 'Average', HR: 10, Sales: 15, IT: 10, Finance: 15, Marketing: 22, Operations: 10, Legal: 20, Admin: 22, RnD: 18, QA: 15 },
  { category: 'Needs Improvement', HR: 8, Sales: 7, IT: 6, Finance: 5, Marketing: 10, Operations: 8, Legal: 12, Admin: 10, RnD: 7, QA: 10 },
  { category: 'Poor', HR: 7, Sales: 5, IT: 4, Finance: 3, Marketing: 7, Operations: 7, Legal: 8, Admin: 6, RnD: 4, QA: 5 },
];

const colors = {
  HR: '#8884d8',
  Sales: '#82ca9d',
  IT: '#ffc658',
  Finance: '#ff7300',
  Marketing: '#a4de6c',
  Operations: '#d0ed57',
  Legal: '#8dd1e1',
  Admin: '#83a6ed',
  RnD: '#8884d8',
  QA: '#d88884',
};

const DepartmentPerformanceRadarChart = () => {
  const [visibleDept, setVisibleDept] = useState('HR'); // default visible dept

  return (
    <div className="w-full h-[500px] bg-white rounded-xl shadow-md p-4">

      {/* Toggle buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {Object.keys(colors).map((dept) => (
          <button
            key={dept}
            onClick={() => setVisibleDept(dept)}
            className={`px-3 py-1 rounded font-semibold border-2 transition
              ${visibleDept === dept
                ? `bg-blue-500 text-white border-transparent`
                : 'bg-white text-gray-600 border-gray-400'}
            `}
            style={{ borderColor: colors[dept], color: visibleDept === dept ? 'white' : colors[dept] }}
          >
            {dept}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis domain={[0, 35]} />
          <Radar
            key={visibleDept} // Force remount on dept change to trigger animation
            name={visibleDept}
            dataKey={visibleDept}
            stroke={colors[visibleDept]}
            fill={colors[visibleDept]}
            fillOpacity={0.4}
            isAnimationActive={true}
            animationDuration={800} // animation duration in ms
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentPerformanceRadarChart;
