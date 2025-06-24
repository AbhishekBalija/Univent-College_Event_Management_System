import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    // Redirect to login page after successful registration
    navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/beach2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 ring-1 ring-white/10">
        <h1 className="text-center text-3xl font-extrabold text-white mb-4 drop-shadow-md">Univent</h1>
        <h2 className="text-center text-2xl font-bold text-white drop-shadow-sm">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-white text-opacity-90 drop-shadow-sm">
          Join Univent to participate in college events
        </p>
        <div className="mt-8">
          <RegisterForm onSuccess={handleRegisterSuccess} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;