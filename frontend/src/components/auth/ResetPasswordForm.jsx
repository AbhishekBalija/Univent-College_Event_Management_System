import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuth } from '../../context';

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords must match')
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Call the resetPassword function from authService
        const response = await authService.resetPassword(token, values.password);
        setSuccess(true);
        
        // If the response includes user data, update the auth context
        if (response.user) {
          setUser(response.user);
        }
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setError(err.message || 'Failed to reset password. Please try again.');
        console.error('Reset password error:', err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // If no token is provided, show an error
  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-medium">Invalid reset link</p>
          <p className="mt-2">The password reset link is invalid or has expired.</p>
          <div className="mt-4">
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 font-medium">
              Request a new password reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-medium">Password reset successful!</p>
          <p className="mt-2">Your password has been updated. You will be redirected to the login Page shortly.</p>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your new password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${formik.touched.password && formik.errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              disabled={isLoading}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your new password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              disabled={isLoading}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex justify-center items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </span>
            ) : 'Reset Password'}
          </button>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;