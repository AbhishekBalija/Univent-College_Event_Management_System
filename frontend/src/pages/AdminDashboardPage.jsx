import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context';
import { UserManagement } from '../components/admin';
import { adminService, eventService } from '../services';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    upcomingEvents: 0,
    registrations: 0,
    systemHealth: '99.8%'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if user is not an admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/home');
    }
  }, [user, navigate]);
  
  // Fetch platform statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!user || user.role !== 'admin') return;
      
      try {
        setLoading(true);
        
        // Fetch users
        const usersData = await adminService.getAllUsers();
        const totalUsers = Array.isArray(usersData) ? usersData.length : 
                          (usersData?.data?.length || usersData?.total || 0);
        
        // Fetch events
        const eventsData = await eventService.getAllEvents();
        const events = Array.isArray(eventsData) ? eventsData : (eventsData.data || []);
        
        // Calculate active events (events happening today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const activeEvents = events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate < tomorrow;
        }).length;

        // Calculate upcoming events (events in the future)
        const upcomingEvents = events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= tomorrow;
        }).length;
        
        // Calculate total registrations
        const registrations = events.reduce((total, event) => {
          return total + (event.participants ? event.participants.length : 0);
        }, 0);
        
        setStats({
          totalUsers,
          activeEvents,
          upcomingEvents,
          registrations,
          systemHealth: '99.8%' // This could be fetched from a monitoring service in a real app
        });
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
        setError('Failed to load platform statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  return (
    <div className="pb-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-800 px-6 py-4">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <div className="p-6">
          <p className="text-lg text-gray-700 mb-6">Welcome to the admin dashboard, {user?.firstName || 'Admin'}!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Management Card */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Manage users, roles, and permissions across the platform.</p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
                onClick={() => setActiveSection(activeSection === 'users' ? null : 'users')}
              >
                {activeSection === 'users' ? 'Hide Users' : 'Manage Users'}
              </button>
            </div>

            {/* Event Management Card */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Event Management</h2>
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Review and approve events, manage categories, and monitor event metrics.</p>
              <Link to="/events" className="inline-block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300">
                Manage Events
              </Link>
            </div>

            {/* System Settings Card */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">System Settings</h2>
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Configure system settings, manage integrations, and monitor platform health.</p>
              <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition duration-300">
                System Settings
              </button>
            </div>
          </div>

          {/* User Management Section */}
          {activeSection === 'users' && (
            <div className="mt-8">
              <UserManagement />
            </div>
          )}

          {/* Analytics Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Analytics</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow text-center">
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                    <div className="flex items-center justify-center mt-2">
                      <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <p className="text-gray-500 text-sm">Registered users</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow text-center">
                    <h3 className="text-gray-500 text-sm font-medium">Active Events</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.activeEvents}</p>
                    <div className="flex items-center justify-center mt-2">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="text-gray-500 text-sm">Events happening today</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow text-center">
                    <h3 className="text-gray-500 text-sm font-medium">Upcoming Events</h3>
                    <p className="text-3xl font-bold text-yellow-600">{stats.upcomingEvents}</p>
                    <div className="flex items-center justify-center mt-2">
                      <svg className="w-4 h-4 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-gray-500 text-sm">Future scheduled events</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow text-center">
                    <h3 className="text-gray-500 text-sm font-medium">Registrations</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.registrations}</p>
                    <div className="flex items-center justify-center mt-2">
                      <svg className="w-4 h-4 text-purple-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                      </svg>
                      <p className="text-gray-500 text-sm">Total event registrations</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow text-center">
                    <h3 className="text-gray-500 text-sm font-medium">System Health</h3>
                    <p className="text-3xl font-bold text-teal-600">{stats.systemHealth}</p>
                    <div className="flex items-center justify-center mt-2">
                      <svg className="w-4 h-4 text-teal-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-gray-500 text-sm">Uptime this month</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;