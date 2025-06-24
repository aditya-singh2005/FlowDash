import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import AdminTaskManagement from './components/AdminTaskManagement';
import EmployeeDashboard from './components/Emp/EmployeeDashboard';
import EmpTaskManagement from './components/Emp/EmpTaskManagement';
import EmpProfilePage from './components/Emp/EmpProfilePage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute'; // Ensure this is correctly imported

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

          {/* You can also add a route for unauthorized access */}
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
