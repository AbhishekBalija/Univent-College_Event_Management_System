import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { AnnouncementList } from '../components/announcements';

const TabButton = ({ children, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none ${
      isActive
        ? 'bg-white text-blue-600 border-b-2 border-blue-600'
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {children}
  </button>
);

const AnnouncementsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [publishedFilter, setPublishedFilter] = useState('all');

  const isAdmin = user?.role === 'admin';
  const isOrganizer = user?.role === 'organizer';
  const canCreateAnnouncement = isAdmin || isOrganizer;

  const handleCreateAnnouncement = () => navigate('/announcements/create');

  const getFilterParams = () => {
    const params = {};
    if (priorityFilter !== 'all') params.priority = priorityFilter;
    if (publishedFilter !== 'all' && (isAdmin || isOrganizer)) {
      params.isPublished = publishedFilter === 'published';
    }
    return params;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Announcements</h1>
            <p className="mt-2 text-lg text-gray-600">Stay updated with the latest news and announcements.</p>
          </div>
          {canCreateAnnouncement && (
            <button
              onClick={handleCreateAnnouncement}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 font-semibold shadow-sm hover:shadow-md group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Create Announcement
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 px-6" aria-label="Tabs">
              <TabButton isActive={tabValue === 0} onClick={() => setTabValue(0)}>
                All Announcements
              </TabButton>
              <TabButton isActive={tabValue === 1} onClick={() => setTabValue(1)}>
                General
              </TabButton>
              <TabButton isActive={tabValue === 2} onClick={() => setTabValue(2)}>
                Event Specific
              </TabButton>
            </nav>
          </div>

          <div className="p-6">
            <div className="mb-6 flex items-center space-x-4">
              <span className="font-semibold text-gray-700">Filter by:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              {(isAdmin || isOrganizer) && (
                <select
                  value={publishedFilter}
                  onChange={(e) => setPublishedFilter(e.target.value)}
                  className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              )}
            </div>

            <div>
              {tabValue === 0 && (
                <AnnouncementList showControls filters={getFilterParams()} />
              )}
              {tabValue === 1 && (
                <AnnouncementList showControls filters={{ ...getFilterParams(), eventId: null }} />
              )}
              {tabValue === 2 && (
                <AnnouncementList showControls filters={{ ...getFilterParams(), hasEvent: true }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
