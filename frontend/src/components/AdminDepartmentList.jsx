import React, { useState, PureComponent } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  User,
  TrendingUp,
  UserCheck,
  Award,
  Building,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { PieChart, Pie, Sector, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

import Navbar from './Navbar'

// Pie Chart Component
const data = [
  { name: 'HR', value: 45, fill: '#3B82F6' },
  { name: 'Sales', value: 62, fill: '#10B981' },
  { name: 'IT', value: 38, fill: '#8B5CF6' },
  { name: 'Marketing', value: 28, fill: '#F59E0B' },
  { name: 'Finance', value: 34, fill: '#EF4444' },
  { name: 'Operations', value: 18, fill: '#06B6D4' },
  { name: 'R&D', value: 15, fill: '#84CC16' },
  { name: 'Support', value: 8, fill: '#F97316' },
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
        {value} employees
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

class DepartmentPieChart extends PureComponent {
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
            cy="50%"
            innerRadius={80}
            outerRadius={150}
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

// Department data
const departmentData = [
  {
    id: 1,
    name: 'Human Resources',
    shortName: 'HR',
    employees: 45,
    head: 'Sarah Johnson',
    email: 'hr@company.com',
    phone: '+1 (555) 123-4567',
    location: 'Floor 2, Building A',
    growth: '+8.5%',
    color: '#3B82F6'
  },
  {
    id: 2,
    name: 'Sales & Marketing',
    shortName: 'Sales',
    employees: 62,
    head: 'Michael Chen',
    email: 'sales@company.com',
    phone: '+1 (555) 234-5678',
    location: 'Floor 3, Building B',
    growth: '+12.3%',
    color: '#10B981'
  },
  {
    id: 3,
    name: 'Information Technology',
    shortName: 'IT',
    employees: 38,
    head: 'Alex Rodriguez',
    email: 'it@company.com',
    phone: '+1 (555) 345-6789',
    location: 'Floor 4, Building C',
    growth: '+15.7%',
    color: '#8B5CF6'
  },
  {
    id: 4,
    name: 'Marketing',
    shortName: 'Marketing',
    employees: 28,
    head: 'Emma Thompson',
    email: 'marketing@company.com',
    phone: '+1 (555) 456-7890',
    location: 'Floor 1, Building B',
    growth: '+6.2%',
    color: '#F59E0B'
  },
  {
    id: 5,
    name: 'Finance & Accounting',
    shortName: 'Finance',
    employees: 34,
    head: 'David Wilson',
    email: 'finance@company.com',
    phone: '+1 (555) 567-8901',
    location: 'Floor 5, Building A',
    growth: '+3.8%',
    color: '#EF4444'
  },
  {
    id: 6,
    name: 'Operations',
    shortName: 'Operations',
    employees: 18,
    head: 'Lisa Parker',
    email: 'ops@company.com',
    phone: '+1 (555) 678-9012',
    location: 'Floor 1, Building C',
    growth: '+9.1%',
    color: '#06B6D4'
  },
  {
    id: 7,
    name: 'Research & Development',
    shortName: 'R&D',
    employees: 15,
    head: 'James Miller',
    email: 'rd@company.com',
    phone: '+1 (555) 789-0123',
    location: 'Floor 6, Building C',
    growth: '+22.4%',
    color: '#84CC16'
  },
  {
    id: 8,
    name: 'Customer Support',
    shortName: 'Support',
    employees: 8,
    head: 'Rachel Green',
    email: 'support@company.com',
    phone: '+1 (555) 890-1234',
    location: 'Floor 2, Building B',
    growth: '+4.3%',
    color: '#F97316'
  }
];

// Main Department Page Component
const AdminDepartmentList = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
  const totalEmployees = departmentData.reduce((sum, dept) => sum + dept.employees, 0);

  return (
    <div className="flex bg-blue-100 min-h-screen">
      {/* Sidebar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="ml-80 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-100 mb-2">Department Overview</h1>
              <p className="text-slate-200 text-lg">Manage and monitor organizational departments</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{departmentData.length}</p>
                    <p className="text-sm text-gray-600">Total Departments</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
                    <p className="text-sm text-gray-600">Total Employees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Department Distribution</h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Employee Count</span>
              </div>
            </div>
            <DepartmentPieChart />
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Department Growth</h2>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Monthly Growth</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="employees" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {departmentData.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => setSelectedDepartment(dept)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${dept.color}20` }}
                  >
                    <Building2 className="w-6 h-6" style={{ color: dept.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{dept.shortName}</h3>
                    <p className="text-sm text-gray-600">{dept.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{dept.employees}</p>
                  <p className="text-sm text-gray-600">employees</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Head: {dept.head}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{dept.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{dept.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Growth Rate</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-bold text-green-600">{dept.growth}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDepartmentList;