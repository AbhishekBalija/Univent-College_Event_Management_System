import { Link } from 'react-router-dom';
import { ForgotPasswordForm } from '../components/auth';
import CollegePhoto from '/CollegePhoto.jpg';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-screen-xl w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-500">No worries, we'll send you reset instructions</p>
              </div>
              <ForgotPasswordForm />
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Back to Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 relative hidden md:block">
            <img
              src={CollegePhoto}
              alt="College Campus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent"></div>
            <div className="absolute top-16 left-16 text-white max-w-md">
              <h1 className="text-5xl font-bold leading-tight mb-4">
                Let's Get You Back on Track.
              </h1>
              <p className="text-xl text-blue-100">
                Recover your account and get back to the action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;