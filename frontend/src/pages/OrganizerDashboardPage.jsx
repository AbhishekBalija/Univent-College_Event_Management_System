import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';

const OrganizerDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is not an organizer
  useEffect(() => {
    if (user && user.role !== 'organizer') {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <div className="pb-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-green-600 to-teal-700 px-6 py-4">
          <h1 className="text-3xl font-bold text-white">Organizer Dashboard</h1>
        </div>
        <div className="p-6">
          <p className="text-lg text-gray-700 mb-6">Welcome to the organizer dashboard, {user?.firstName || 'Organizer'}!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create Event Card */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Create Event</h2>
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Create a new event, set up registration, and publish it to participants.</p>
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300">
                Create New Event
              </button>
            </div>

            {/* Manage Events Card */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">My Events</h2>
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <p className="text-gray-600 mb-4">View and manage your created events, track registrations, and update details.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300">
                Manage Events
              </button>
            </div>

            {/* Announcements Card */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Announcements</h2>
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Create and send announcements to event participants and keep them updated.</p>
              <button className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition duration-300">
                Create Announcement
              </button>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Upcoming Events</h2>
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                <li>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-indigo-600">Hackathon 2023</p>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Active</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          Main Campus
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p>December 15, 2023</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-indigo-600">Tech Talk: AI Revolution</p>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">Upcoming</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          Science Building
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p>December 20, 2023</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Event Statistics */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <h3 className="text-gray-500 text-sm font-medium">Total Events</h3>
                <p className="text-3xl font-bold text-blue-600">12</p>
                <p className="text-green-500 text-sm">↑ 2 new this month</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <h3 className="text-gray-500 text-sm font-medium">Registrations</h3>
                <p className="text-3xl font-bold text-green-600">342</p>
                <p className="text-green-500 text-sm">↑ 18% from last event</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <h3 className="text-gray-500 text-sm font-medium">Attendance Rate</h3>
                <p className="text-3xl font-bold text-purple-600">87%</p>
                <p className="text-green-500 text-sm">↑ 5% improvement</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <h3 className="text-gray-500 text-sm font-medium">Feedback Score</h3>
                <p className="text-3xl font-bold text-teal-600">4.8/5</p>
                <p className="text-gray-500 text-sm">Based on 156 reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;