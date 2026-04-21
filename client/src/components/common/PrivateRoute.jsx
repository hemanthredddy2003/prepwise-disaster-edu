import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function PrivateRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (roles && !roles.includes(user?.role)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-white text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
