import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '../components/auth';
import CollegePhoto from '/CollegePhoto.jpg';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-screen-xl w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-500">Sign in to access your account</p>
              </div>
              <LoginForm onSuccess={handleLoginSuccess} />
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  New to Univent?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Create an account
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
                Experience College Life, Reimagined.
              </h1>
              <p className="text-xl text-blue-100">
                Discover, manage, and participate in events happening on your campus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;