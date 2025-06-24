import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">Univent</Link>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-blue-200 transition">Home</Link></li>
            <li><Link to="/events" className="hover:text-blue-200 transition">Events</Link></li>
            <li><Link to="/leaderboard" className="hover:text-blue-200 transition">Leaderboard</Link></li>
            <li><Link to="/announcements" className="hover:text-blue-200 transition">Announcements</Link></li>
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
          <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition">Register</Link>
          
          {/* Mobile menu button */}
          <button className="md:hidden text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;