import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const adminRoles = ['admin', 'super_admin'];

const hasAdminAccess = (user) => {
  if (!user) {
    return false;
  }

  if (user.isAdmin) {
    return true;
  }

  const role = typeof user.role === 'string' ? user.role.toLowerCase() : '';

  if (adminRoles.includes(role)) {
    return true;
  }

  if (Array.isArray(user.roles)) {
    return user.roles.some((item) => adminRoles.includes(String(item).toLowerCase()));
  }

  return false;
};

function AdminRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasAdminAccess(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children || <Outlet />;
}

export default AdminRoute;