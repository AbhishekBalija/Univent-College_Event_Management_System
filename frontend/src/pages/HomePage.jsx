import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { eventService, announcementService, leaderboardService } from '../services';
import { RealtimeAnnouncements } from '../components/announcements';
import { PageLoader, SkeletonCard, SkeletonTable, SkeletonText } from '../components/common';

const HomePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  
  // Default placeholder image for events without images
  const defaultEventImage = '/beach.jpg';
  
  const [announcements, setAnnouncements] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch events
        const eventsData = await eventService.getAllEvents();
        
        // Get events data, ensuring we have an array
        let eventsArray = Array.isArray(eventsData) ? eventsData : eventsData.data || [];
        
        // Filter out sample events (events with titles containing 'sample' or 'test')
        eventsArray = eventsArray.filter(event => {
          const title = event.title.toLowerCase();
          return !title.includes('sample') && !title.includes('test');
        });
        
        // Sort events by date (upcoming first)
        eventsArray.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Take only the first 3 upcoming events
        const upcomingEventsData = eventsArray
          .filter(event => new Date(event.date) >= new Date())
          .slice(0, 3);
        
        setEvents(upcomingEventsData);
        
        // Fetch announcements
        const announcementsData = await announcementService.getAllAnnouncements({
          isPublished: true
        });
        
        // Get announcements data, ensuring we have an array
        const announcementsArray = Array.isArray(announcementsData) 
          ? announcementsData 
          : announcementsData.data || [];
        
        // Sort announcements by date (newest first)
        announcementsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Take only the first 3 announcements
        const latestAnnouncements = announcementsArray.slice(0, 3);
        
        setAnnouncements(latestAnnouncements);
        
        // Fetch top performers for leaderboard
        try {
          const topPerformersData = await leaderboardService.getTopPerformers();
          
          // Format the data to match the expected structure for the leaderboard table
          const formattedLeaderboardData = topPerformersData
            .slice(0, 5) // Take only top 5 performers
            .map((performer, index) => ({
              id: performer.userId || index + 1,
              name: performer.userName,
              event: `${performer.eventCount} ${performer.eventCount === 1 ? 'Event' : 'Events'}`,
              score: performer.totalScore
            }));
          
          setLeaderboardData(formattedLeaderboardData);
        } catch (leaderboardErr) {
          console.error('Failed to fetch leaderboard data:', leaderboardErr);
          // Keep the leaderboard empty if there's an error
          setLeaderboardData([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <PageLoader text="Loading your dashboard..." />;
  }
  
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Real-time announcements component */}
      <RealtimeAnnouncements />
      
      {/* Welcome Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.firstName || 'Participant'}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Here's what's happening at your college today
              </p>
            </div>
            <div className="hidden md:flex space-x-3">
              <Link 
                to="/events" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Browse Events
              </Link>
              <Link 
                to="/leaderboard" 
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Events Section */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <Link 
                to="/events" 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center transition duration-200"
              >
                View all
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.length > 0 ? (
                events.map(event => (
                  <div key={event._id} className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={event.image || defaultEventImage} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = defaultEventImage;
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        {(() => {
                          const eventDate = new Date(event.date);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          
                          const tomorrow = new Date(today);
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          
                          if (eventDate < today) {
                            return (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 shadow-sm">
                                Completed
                              </span>
                            );
                          } else if (eventDate >= today && eventDate < tomorrow) {
                            return (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 shadow-sm">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1 animate-pulse"></div>
                                Live
                              </span>
                            );
                          } else {
                            return (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 shadow-sm">
                                Upcoming
                              </span>
                            );
                          }
                        })()}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition duration-200">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <span className="text-sm font-medium">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span className="text-sm">{event.location}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-sm">{event.participants ? `${event.participants.length} / ${event.capacity}` : `0 / ${event.capacity}`} participants</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link 
                          to={`/events/${event._id}`} 
                          className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl transition duration-200 font-medium text-sm"
                        >
                          View Details
                        </Link>
                        <Link 
                          to={`/leaderboard/${event._id}`} 
                          className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl transition duration-200 font-medium text-sm"
                        >
                          Leaderboard
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming events</h3>
                  <p className="text-gray-600">Check back later for new events and activities.</p>
                </div>
              )}
            </div>
          </section>
          
          {/* Sidebar with Announcements and Leaderboard */}
          <section className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Events</p>
                    <p className="text-2xl font-bold text-blue-900">{events.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Announcements</p>
                    <p className="text-2xl font-bold text-green-900">{announcements.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Recent Announcements</h3>
                  <Link 
                    to="/announcements" 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition duration-200"
                  >
                    View all
                  </Link>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {announcements.length > 0 ? (
                  announcements.map(announcement => (
                    <div key={announcement._id} className="p-6 hover:bg-gray-50 transition duration-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {announcement.title}
                        </h4>
                        {announcement.priority === 'high' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No announcements available</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Top Performers Leaderboard */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Top Performers</h3>
                  <Link 
                    to="/leaderboard" 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition duration-200"
                  >
                    Full leaderboard
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {leaderboardData.length > 0 ? (
                  <div className="space-y-3">
                    {leaderboardData.map((entry, index) => (
                      <div key={entry.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                            index === 1 ? 'bg-gray-100 text-gray-800' : 
                            index === 2 ? 'bg-orange-100 text-orange-800' : 
                            'bg-blue-50 text-blue-600'
                          }`}>
                            {index < 3 ? (
                              <span>{['🥇', '🥈', '🥉'][index]}</span>
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{entry.name}</p>
                            <p className="text-xs text-gray-500">{entry.event}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600 text-sm">{entry.score}</p>
                          <p className="text-xs text-gray-400">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No leaderboard data yet</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;