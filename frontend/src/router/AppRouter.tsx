import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import TenantDashboard from '../pages/TenantDashboard';
import OwnerDashboard from '../pages/OwnerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import { useAuth } from '../context/AuthContext';

/**
 * Simple wrapper that ensures the user is authenticated and, optionally,
 * has one of the permitted roles.
 */
const RequireAuth: React.FC<{
  children: React.ReactElement;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && (!user?.roles || !allowedRoles.some((r) => user.roles?.includes(r)))) {
    // Not authorized for this role – redirect to home
    return <Navigate to="/" replace />;
  }
  return children;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/tenant/dashboard"
        element={
          <RequireAuth allowedRoles={["ROLE_TENANT"]}>
            <TenantDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/owner/dashboard"
        element={
          <RequireAuth allowedRoles={["ROLE_OWNER"]}>
            <OwnerDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <RequireAuth allowedRoles={["ROLE_ADMIN"]}>
            <AdminDashboard />
          </RequireAuth>
        }
      />
      {/* Catch‑all – redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
