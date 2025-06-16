import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

// Sample data: attendance % by date and dept
const data = [
  { date: '2025-05-01', HR: 95, Sales: 87, Development: 92 },
  { date: '2025-05-02', HR: 93, Sales: 85, Development: 90 },
  { date: '2025-05-03', HR: 90, Sales: 88, Development: 91 },
  { date: '2025-05-04', HR: 96, Sales: 90, Development: 94 },
  { date: '2025-05-05', HR: 92, Sales: 89, Development: 90 },
];

const departments = ['HR', 'Sales', 'Development'];

// Triangle shape for bars
const getPath = (x, y, width, height) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
  Z`;
};

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

export default function AttendanceChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" angle={-45} textAnchor="end" interval={0} />
        <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend verticalAlign="top" height={36} />
        {departments.map((dept, idx) => (
          <Bar
            key={dept}
            dataKey={dept}
            fill={colors[idx % colors.length]}
            shape={<TriangleBar />}
            label={{ position: 'top', formatter: (val) => `${val}%` }}
            barSize={20}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[idx % colors.length]} />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
