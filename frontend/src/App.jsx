import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import AdminTaskManagement from './components/AdminTaskManagement';
import EmployeeDashboard from './components/Emp/EmployeeDashboard';
import EmpTaskManagement from './components/Emp/EmpTaskManagement';
import EmpProfilePage from './components/Emp/EmpProfilePage';
import LoginPage from './components/LoginPage';
// import other components/pages as needed

function App() {
  return (
    <div className="flex">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/Admin-Task-Management" element={<AdminTaskManagement />} />
          <Route path="/Admin-Dashboard" element={<AdminDashboard />} />
          <Route path="/Employee-Dashboard" element={<EmployeeDashboard />} />
          <Route path="/Employee-Task-Management" element={<EmpTaskManagement />} />
          <Route path="/Employee-Profile" element={<EmpProfilePage />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
