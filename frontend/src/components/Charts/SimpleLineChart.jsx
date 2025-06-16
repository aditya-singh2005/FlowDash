import React, { PureComponent } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample attendance data for 4 weeks for 10 departments
const data = [
  { week: 'Week 1', HR: 92, Sales: 88, IT: 85, Finance: 90, Marketing: 87, Operations: 93, Legal: 89, Admin: 91, RnD: 86, QA: 90 },
  { week: 'Week 2', HR: 90, Sales: 90, IT: 83, Finance: 88, Marketing: 89, Operations: 94, Legal: 90, Admin: 92, RnD: 88, QA: 89 },
  { week: 'Week 3', HR: 93, Sales: 87, IT: 84, Finance: 91, Marketing: 88, Operations: 92, Legal: 91, Admin: 90, RnD: 87, QA: 91 },
  { week: 'Week 4', HR: 94, Sales: 89, IT: 86, Finance: 92, Marketing: 90, Operations: 95, Legal: 90, Admin: 93, RnD: 89, QA: 92 },
];

export default class AttendanceChart extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis domain={[70, 100]} tickFormatter={(tick) => `${tick}%`} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Line type="monotone" dataKey="HR" stroke="#8884d8" />
          <Line type="monotone" dataKey="Sales" stroke="#82ca9d" />
          <Line type="monotone" dataKey="IT" stroke="#ffc658" />
          <Line type="monotone" dataKey="Finance" stroke="#ff7300" />
          <Line type="monotone" dataKey="Marketing" stroke="#a4de6c" />
          <Line type="monotone" dataKey="Operations" stroke="#d0ed57" />
          <Line type="monotone" dataKey="Legal" stroke="#8dd1e1" />
          <Line type="monotone" dataKey="Admin" stroke="#83a6ed" />
          <Line type="monotone" dataKey="RnD" stroke="#8884d8" strokeDasharray="3 4 5 2" />
          <Line type="monotone" dataKey="QA" stroke="#d88884" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
