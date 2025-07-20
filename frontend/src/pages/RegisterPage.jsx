import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '../components/auth';
import CollegePhoto from '/CollegePhoto.jpg';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-screen-xl w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Create an Account</h2>
                <p className="text-gray-500">Join our community of event-goers</p>
              </div>
              <RegisterForm onSuccess={handleRegisterSuccess} />
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Sign in
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
                Unlock a World of Events.
              </h1>
              <p className="text-xl text-blue-100">
                Sign up to get started and be part of the excitement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;