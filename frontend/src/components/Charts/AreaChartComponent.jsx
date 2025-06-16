import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Attendance data week-wise for current month by dept with clearer variation
const data = [
  { week: 'Week 1', HR: 91, Sales: 87, IT: 81, Finance: 94, Marketing: 89, Operations: 85 },
  { week: 'Week 2', HR: 93, Sales: 82, IT: 86, Finance: 92, Marketing: 91, Operations: 88 },
  { week: 'Week 3', HR: 89, Sales: 85, IT: 83, Finance: 90, Marketing: 87, Operations: 84 },
  { week: 'Week 4', HR: 95, Sales: 88, IT: 87, Finance: 93, Marketing: 90, Operations: 89 },
];

const AreaChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis domain={[70, 100]} tickFormatter={(tick) => `${tick}%`} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
        <Area type="monotone" dataKey="HR" stroke="#8884d8" fill="#8884d8" activeDot={{ r: 8 }} />
        <Area type="monotone" dataKey="Sales" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="IT" stroke="#ffc658" fill="#ffc658" />
        <Area type="monotone" dataKey="Finance" stroke="#ff7300" fill="#ff7300" />
        <Area type="monotone" dataKey="Marketing" stroke="#a4de6c" fill="#a4de6c" />
        <Area type="monotone" dataKey="Operations" stroke="#d0ed57" fill="#d0ed57" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
