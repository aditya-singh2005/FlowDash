import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import AdminTaskManagement from './components/AdminTaskManagement';
import EmployeeDashboard from './components/Emp/EmployeeDashboard';
import EmpTaskManagement from './components/Emp/EmpTaskManagement';
import EmpProfilePage from './components/Emp/EmpProfilePage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute'; // Ensure this is correctly imported
import AdminEmployeeList from './components/AdminEmployeeList';
import AdminDepartmentList from './components/AdminDepartmentList';
import AdminAttendancePage from './components/AdminAttendanceTracking';
import AdminAttendanceTracking from './components/AdminAttendanceTracking';
import AdminLeavesTracking from './components/AdminLeavesTracking';
import EmpAttendanceTracking from './components/Emp/EmpAttendanceTracking';
import EmpLeaveTracking from './components/Emp/EmpLeaveTracking';
import EmpGoalTracking from './components/Emp/EmpGoalTracking';

function App() {
  return (
    <div className="flex">
      <div className="flex-1">
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LoginPage />} />

          {/* Admin routes */}
          <Route
            path="/Admin-Task-Management"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminTaskManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Admin-Dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-employees-list"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-employee-departments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDepartmentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-attendance-tracking"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAttendanceTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-leaves-tracking"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLeavesTracking />
              </ProtectedRoute>
            }
          />

          {/* Employee routes */}
          <Route
            path="/Employee-Dashboard"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Employee-Task-Management"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmpTaskManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Employee-Profile"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmpProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Employee-Attendance-Tracking"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmpAttendanceTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Employee-Leave-Tracking"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmpLeaveTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Employee-goal-Tracking"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmpGoalTracking />
              </ProtectedRoute>
            }
          />
          

          {/* You can also add a route for unauthorized access */}
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
