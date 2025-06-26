import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context';
import { UserManagement } from '../components/admin';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  // Redirect if user is not an admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/home');
    }
  }, [user, navigate]);

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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">1,245</p>
                  <p className="text-green-500 text-sm">↑ 12% from last month</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <h3 className="text-gray-500 text-sm font-medium">Active Events</h3>
                  <p className="text-3xl font-bold text-green-600">42</p>
                  <p className="text-green-500 text-sm">↑ 8% from last month</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <h3 className="text-gray-500 text-sm font-medium">Registrations</h3>
                  <p className="text-3xl font-bold text-purple-600">856</p>
                  <p className="text-green-500 text-sm">↑ 23% from last month</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <h3 className="text-gray-500 text-sm font-medium">System Health</h3>
                  <p className="text-3xl font-bold text-teal-600">99.8%</p>
                  <p className="text-gray-500 text-sm">Uptime this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;