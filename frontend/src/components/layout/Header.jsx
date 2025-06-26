import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white shadow-md">
      <div className="w-full px-4 py-3 flex justify-between items-center">
        {/* Left side - Logo + Toggle */}
        <div className="flex items-center gap-3">
          <button
            className="text-white focus:outline-none md:hidden"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          <Link to="/home" className="flex items-center text-2xl font-bold">
            <img
              src="/logo3.jpg"
              alt="Univent Logo"
              className="h-8 w-8 rounded-full mr-2"
            />
            <span>Univent</span>
          </Link>
        </div>

        {/* Right side - User Info */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded-md transition duration-300">
                <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center font-semibold uppercase">
                  {user.firstName?.charAt(0) || "U"}
                </div>
                <span className="hidden md:inline font-medium">
                  {user.firstName || "User"}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition duration-300 border border-white/20 flex items-center gap-2"
              >
                <span className="hidden md:inline">Logout</span>
                <svg
                  className="w-5 h-5 md:hidden"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H9"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 4H6a2 2 0 00-2 2v12a2 2 0 002 2h7"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-200 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition duration-300 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
