import { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services';
import { setUser as setReduxUser, setLoading as setReduxLoading, setError as setReduxError, logout as reduxLogout } from '../redux/slices/authSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, loading, error, isAuthenticated } = useSelector(state => state.auth);

  // No need to check localStorage as Redux is handling it in the authSlice
  useEffect(() => {
    // Set loading to false after initial load
    dispatch(setReduxLoading(false));
  }, [dispatch]);

  // Login function
  const login = async (email, password) => {
    dispatch(setReduxLoading(true));
    dispatch(setReduxError(null));
    
    try {
      // Call the auth service login method
      const response = await authService.login(email, password);
      
      // Store user in Redux state
      dispatch(setReduxUser(response.user));
      
      return response.user;
    } catch (err) {
      dispatch(setReduxError(err.message || 'Failed to login'));
      throw err;
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch(setReduxLoading(true));
    dispatch(setReduxError(null));
    
    try {
      // Call the auth service register method
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      dispatch(setReduxError(err.message || 'Failed to register'));
      throw err;
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  // Logout function
  const logout = () => {
    dispatch(reduxLogout());
    authService.logout();
  };

  // Google OAuth login/signup
  const googleLogin = async (idToken, college = null) => {
    dispatch(setReduxLoading(true));
    dispatch(setReduxError(null));
    try {
      const response = await authService.googleLogin(idToken, college);
      if (response.success && response.user) {
        dispatch(setReduxUser(response.user));
      }
      return response;
    } catch (err) {
      dispatch(setReduxError(err.message || 'Failed to login with Google'));
      throw err;
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    googleLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;