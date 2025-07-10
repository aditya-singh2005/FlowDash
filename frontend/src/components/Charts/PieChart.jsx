import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'HR', value: 48, fill: '#3B82F6' },
  { name: 'Sales', value: 36, fill: '#10B981' },
  { name: 'IT', value: 36, fill: '#8B5CF6' },
  { name: 'Marketing', value: 24, fill: '#F59E0B' },
  { name: 'Finance', value: 30, fill: '#EF4444' },
  { name: 'Operations', value: 18, fill: '#06B6D4' },
  { name: 'R&D', value: 21, fill: '#84CC16' },
  { name: 'Support', value: 14, fill: '#F97316' },
  { name: 'Legal', value: 12, fill: '#6366F1' },
  { name: 'Admin', value: 9, fill: '#EC4899' },
];


const renderActiveShape = (props) => {
const RADIAN = Math.PI / 180;
const {
  cx, cy, midAngle, innerRadius, outerRadius,
  startAngle, endAngle, fill, payload, percent, value,
} = props;
const sin = Math.sin(-RADIAN * midAngle);
const cos = Math.cos(-RADIAN * midAngle);
const sx = cx + (outerRadius + 10) * cos;
const sy = cy + (outerRadius + 10) * sin;
const mx = cx + (outerRadius + 30) * cos;
const my = cy + (outerRadius + 30) * sin;
const ex = mx + (cos >= 0 ? 1 : -1) * 22;
const ey = my;
const textAnchor = cos >= 0 ? 'start' : 'end';

return (
  <g>
    <text className='font-bold' x={cx} y={cy} dy={-5} textAnchor="middle" fill="#1F2937" style={{ fontWeight: 'bold', fontSize: 18 }}>
      {payload.name}
    </text>
    <text className='font-bold' x={cx} y={cy} dy={18} textAnchor="middle" fill="#374151" style={{ fontWeight: 'bold', fontSize: 16 }}>
      {value}
    </text>
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke="#FFFFFF"
      strokeWidth={3}
    />
    <Sector
      cx={cx}
      cy={cy}
      startAngle={startAngle}
      endAngle={endAngle}
      innerRadius={outerRadius + 8}
      outerRadius={outerRadius + 15}
      fill={fill}
      stroke="#FFFFFF"
      strokeWidth={2}
    />
  </g>
);
};

export default class Example extends PureComponent {
state = {
  activeIndex: 0,
};

onPieEnter = (_, index) => {
  this.setState({
    activeIndex: index,
  });
};

render() {
  return (
    <ResponsiveContainer width="100%" height={450}>
      <PieChart width={450} height={450}>
        <Pie
          activeIndex={this.state.activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="32.5%"
          innerRadius={60}
          outerRadius={130}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={this.onPieEnter}
          stroke="#FFFFFF"
          strokeWidth={2}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
}