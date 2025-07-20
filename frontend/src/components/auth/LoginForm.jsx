import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { LoadingSpinner } from '../common';

const LoginForm = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, googleLogin } = useAuth();
  const [showCollegePrompt, setShowCollegePrompt] = useState(false);
  const [googleIdToken, setGoogleIdToken] = useState(null);
  const [collegeInput, setCollegeInput] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [googleProfile, setGoogleProfile] = useState(null);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);
      try {
        await login(values.email, values.password);
        if (onSuccess) onSuccess();
      } catch (err) {
        setError(err.message || 'Failed to login. Please try again.');
        console.error('Login error:', err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Google login handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = credentialResponse.credential;
      const response = await googleLogin(idToken);
      if (response.needCollege) {
        setShowCollegePrompt(true);
        setGoogleIdToken(idToken);
        setGoogleProfile(response.googleProfile);
      } else if (response.success) {
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollegeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await googleLogin(googleIdToken, collegeInput);
      if (response.success) {
        setShowCollegePrompt(false);
        setGoogleIdToken(null);
        setGoogleProfile(null);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {showCollegePrompt ? (
        <form onSubmit={handleCollegeSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              Enter your college name
            </h2>
            <p className="text-white/70 text-sm">
              Complete your Google sign-in by providing your college information
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              College/University Name
            </label>
            <input
              type="text"
              value={collegeInput}
              onChange={(e) => setCollegeInput(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition duration-200"
              placeholder="Enter your college name"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-white text-blue-600 py-3 px-4 rounded-xl font-semibold hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition duration-200 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="primary" />
            ) : (
              "Continue"
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-300/30 text-red-100 px-4 py-3 rounded-xl text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition duration-200 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-300/50 focus:ring-red-300/30"
                    : "border-white/20 focus:ring-white/30 focus:border-transparent"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                disabled={isLoading}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-300 text-xs mt-1 ml-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition duration-200 ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-300/50 focus:ring-red-300/30"
                    : "border-white/20 focus:ring-white/30 focus:border-transparent"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                disabled={isLoading}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-300 text-xs mt-1 ml-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-white/10 border-white/20 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-white/80">
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-white/80 hover:text-white transition duration-200 underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-blue-600 py-3 px-4 rounded-xl font-semibold hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition duration-200 flex items-center justify-center min-h-[48px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" color="primary" />
                  <span className="ml-2">Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/70">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
              <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google login failed")}
                  theme="filled_black"
                  shape="pill"
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;