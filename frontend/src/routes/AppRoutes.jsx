import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';


import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import Dashboard from '../pages/employee/Dashboard';
import Attendance from '../pages/employee/Attendance';
import ApplyLeave from '../pages/employee/ApplyLeave';
import LeaveHistory from '../pages/employee/LeaveHistory';
import Profile from '../pages/employee/Profile';

import AdminDashboard from '../pages/admin/AdminDashboard';
import EmployeeManagement from '../pages/admin/EmployeeManagement';
import LeaveManagement from '../pages/admin/LeaveManagement';
import AttendanceManagement from '../pages/admin/AttendanceManagement';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />


      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['employee', 'admin']}>
            <MainLayout>
              {user?.role === 'admin' ? <AdminDashboard /> : <Dashboard />}
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={['employee', 'admin']}>
            <MainLayout>
              {user?.role === 'admin' ? <AttendanceManagement /> : <Attendance />}
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/apply-leave"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <MainLayout>
              <ApplyLeave />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/leave-history"
        element={
          <ProtectedRoute allowedRoles={['employee', 'admin']}>
            <MainLayout>
              {user?.role === 'admin' ? <LeaveManagement /> : <LeaveHistory />}
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['employee', 'admin']}>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin-employees"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <EmployeeManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/leaves"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <LeaveManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <AttendanceManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
