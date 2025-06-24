import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';

const HomePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Mock data - in a real app, these would come from API calls
  const upcomingEvents = [
    { id: 1, name: 'Hackathon 2023', date: '2023-12-15', location: 'Main Campus', image: '/beach.jpg' },
    { id: 2, name: 'Tech Talk: AI Revolution', date: '2023-12-20', location: 'Science Building', image: '/beach2.jpg' },
    { id: 3, name: 'Design Workshop', date: '2024-01-05', location: 'Art Center', image: '/CollagePicture.jpg' },
  ];
  
  const announcements = [
    { id: 1, title: 'New Event Registration Open', content: 'Registration for the upcoming Hackathon is now open!', date: '2023-12-01' },
    { id: 2, title: 'System Maintenance', content: 'The platform will be down for maintenance on Dec 10th from 2-4 AM.', date: '2023-11-28' },
    { id: 3, title: 'Holiday Schedule', content: 'Check out the special holiday events schedule for December.', date: '2023-11-25' },
  ];
  
  const leaderboardData = [
    { id: 1, name: 'Alex Johnson', event: 'Coding Challenge', score: 95 },
    { id: 2, name: 'Sam Smith', event: 'Hackathon 2023', score: 88 },
    { id: 3, name: 'Jamie Lee', event: 'Design Contest', score: 82 },
    { id: 4, name: 'Taylor Wong', event: 'Quiz Bowl', score: 79 },
    { id: 5, name: 'Jordan Parker', event: 'Debate Tournament', score: 75 },
  ];
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="pb-12 overflow-y-auto">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 px-6 py-12 md:py-20 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Univent, {user?.firstName || 'Participant'}!</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">Your one-stop platform for college events, competitions, and activities.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/events" className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-lg hover:shadow-xl">
              Browse Events
            </Link>
            <Link to="/leaderboard" className="bg-transparent hover:bg-white/10 border-2 border-white px-6 py-3 rounded-lg font-semibold transition duration-300">
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events Section */}
        <section className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                    <div className="h-48 overflow-hidden">
                      <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-4">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>{event.location}</span>
                      </div>
                      <Link to={`/events/${event.id}`} className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link to="/events" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                  View All Events
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sidebar with Announcements and Leaderboard */}
        <section className="space-y-8">
          {/* Announcements */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Announcements</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {announcements.map(announcement => (
                  <div key={announcement.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
                    <p className="text-gray-600 mb-2">{announcement.content}</p>
                    <span className="text-sm text-gray-500">{new Date(announcement.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link to="/announcements" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                  View All Announcements
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Top Performers</h2>
            </div>
            <div className="p-6">
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaderboardData.map((entry, index) => (
                      <tr key={entry.id}>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${index < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap text-sm font-medium text-gray-900">{entry.name}</td>
                        <td className="py-2 px-3 whitespace-nowrap text-sm text-gray-500">{entry.event}</td>
                        <td className="py-2 px-3 whitespace-nowrap text-sm font-medium text-green-600">{entry.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-center">
                <Link to="/leaderboard" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                  View Full Leaderboard
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;