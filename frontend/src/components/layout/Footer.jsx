const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Univent</h3>
            <p className="text-gray-400">
              A real-time college event management system designed to streamline event organization,
              participant registration, and live updates.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/home" className="hover:text-white transition">Home</a></li>
              <li><a href="/events" className="hover:text-white transition">Events</a></li>
              <li><a href="/leaderboard" className="hover:text-white transition">Leaderboard</a></li>
              <li><a href="/announcements" className="hover:text-white transition">Announcements</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@univent.com</li>
              <li>Phone: +91 9876543210</li>
              <li>Address: Acharya Institute of Technology, Bangalore</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Univent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;