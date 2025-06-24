import { ResetPasswordForm } from '../components/auth';

const ResetPasswordPage = () => {
  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/Beach Landscape Twilight Sunset Illustration.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 ring-1 ring-white/10">
        <h1 className="text-center text-3xl font-extrabold text-white mb-4 drop-shadow-md">Univent</h1>
        <div className="mt-8">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;