import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { eventService } from '../services';
import { 
  LeaderboardTable, 
  ParticipantScore,
  TopPerformers,
  CollegeLeaderboard,
  UpdateScoreForm 
} from '../components/leaderboard';
import { PageLoader } from '../components/common';

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

const LeaderboardPage = () => {
  const { eventId } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const eventData = await eventService.getEventById(eventId);
        setEvent(eventData);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const isUserRegistered = () => {
    if (!isAuthenticated || !user || !event) return false;
    return event.participants?.some(participant => participant === user._id);
  };

  if (loading) {
    return <PageLoader text="Loading leaderboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-500">
          <Link to="/home" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          {eventId ? (
            <>
              <Link to="/events" className="hover:text-blue-600">Events</Link>
              <span className="mx-2">/</span>
              <Link to={`/events/${eventId}`} className="hover:text-blue-600">
                {event?.title || 'Event'}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800">Leaderboard</span>
            </>
          ) : (
            <span className="text-gray-800">Leaderboards</span>
          )}
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {eventId ? `${event?.title || 'Event'} Leaderboard` : 'Leaderboards'}
          </h1>
          {eventId && event && (
            <p className="mt-2 text-lg text-gray-600">
              Track scores and rankings for this event.
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-8" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {eventId ? (
          !loading && event && (
            <div className="space-y-8">
              {isAuthenticated && isUserRegistered() && (
                <ParticipantScore eventId={eventId} />
              )}

              {isAuthenticated && user && (user.role === 'admin' || user.role === 'organizer') && (
                <UpdateScoreForm 
                  eventId={eventId} 
                  onScoreUpdated={() => window.location.reload()}
                />
              )}

              <LeaderboardTable eventId={eventId} />
            </div>
          )
        ) : (
          /* Global leaderboards */
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 px-6" aria-label="Tabs">
                <TabButton isActive={tabValue === 0} onClick={() => setTabValue(0)}>
                  Top Performers
                </TabButton>
                <TabButton isActive={tabValue === 1} onClick={() => setTabValue(1)}>
                  College Rankings
                </TabButton>
              </nav>
            </div>
            <div className="p-6">
              {tabValue === 0 && <TopPerformers />}
              {tabValue === 1 && <CollegeLeaderboard />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;