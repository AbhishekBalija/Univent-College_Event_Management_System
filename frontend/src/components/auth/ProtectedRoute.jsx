import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import { authService } from '../../services';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
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

  // Role-based routing
  if (user) {
    // Allow all authenticated users to access event routes and profile page
    if (location.pathname.includes('/events') || location.pathname.includes('/profile')) {
      return <Outlet />;
    }
    
    // If user is admin and trying to access non-admin routes (except events and profile)
    if (user.role === 'admin' && 
        !location.pathname.includes('/admindashboard') && 
        !location.pathname.includes('/events') && 
        !location.pathname.includes('/profile') &&
        !location.pathname.includes('/announcements')
      ) {
      return <Navigate to="/admindashboard" replace />;
    }
    
    // If user is organizer and trying to access non-organizer routes (except events and profile)
    if (user.role === 'organizer' && 
        !location.pathname.includes('/organizerdashboard') && 
        !location.pathname.includes('/events') && 
        !location.pathname.includes('/profile') &&
        !location.pathname.includes('/announcements')
      ) {
      return <Navigate to="/organizerdashboard" replace />;
    }
    
    // If user is participant and trying to access admin or organizer routes
    if (user.role === 'participant' && 
        (location.pathname.includes('/admindashboard') || 
         location.pathname.includes('/organizerdashboard'))) {
      return <Navigate to="/home" replace />;
    }
  }

  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute;