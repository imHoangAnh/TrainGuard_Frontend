import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminLayout() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex min-h-screen bg-rail-darker text-rail-text">
      <Sidebar />
      <main className="flex-1 ml-64 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
