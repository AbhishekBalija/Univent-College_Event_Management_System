import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context';
import { authService } from '../../services';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  // Check if user is authenticated using authService
  const isAuthenticated = authService.isAuthenticated() && !!user;

  // Show loading indicator while checking authentication status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute;