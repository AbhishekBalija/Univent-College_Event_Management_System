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
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 lg:px-6 flex justify-between items-center">
        {/* Left side - Logo + Toggle */}
        <div className="flex items-center space-x-4">
          <button
            className="text-gray-600 hover:text-gray-900 focus:outline-none md:hidden p-2 rounded-lg hover:bg-gray-100 transition duration-200"
            onClick={toggleSidebar}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          <Link to="/home" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition duration-200 shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Univent
              </h1>
              <p className="text-xs text-gray-500 -mt-1">College Events</p>
            </div>
          </Link>
        </div>

        {/* Right side - User Info */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5V9a9 9 0 10-2 5.83V17z" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Profile */}
              <Link 
                to="/profile" 
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition duration-200 group"
              >
                {user.photo ? (
                  <img 
                    src={user?.photo} 
                    alt="Profile" 
                    className="w-9 h-9 rounded-xl object-cover border-2 border-gray-200 group-hover:border-blue-300 transition duration-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm group-hover:scale-105 transition duration-200 shadow-md">
                    {user.firstName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition duration-200">
                    {user.firstName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role || "participant"}
                  </p>
                </div>
              </Link>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition duration-200 group"
                title="Logout"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;