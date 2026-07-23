import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';
import ResetPassword from '../pages/auth/ResetPassword.jsx';
import ChooseRole from '../pages/public/ChooseRole.jsx';
import Dashboard from '../pages/customer/Dashboard.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import useAuthStore from '../store/authStore.js';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';

function AppRoutes() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      initializeAuth();
    }
  }, [initializeAuth, token]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/choose-role" element={<ChooseRole />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
