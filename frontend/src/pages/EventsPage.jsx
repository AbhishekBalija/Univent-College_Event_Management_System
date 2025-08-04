import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services';
import EventCard from '../components/events/EventCard';
import { useAuth } from '../context/useAuth';
import { PageLoader, SkeletonCard } from '../components/common';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getAllEvents();
        
        // Get events data, ensuring we have an array
        let eventsData = Array.isArray(data) ? data : data.data || [];
        
        // Filter out sample events (events with titles containing 'sample' or 'test')
        eventsData = eventsData.filter(event => {
          const title = event.title.toLowerCase();
          return !title.includes('sample') && !title.includes('test');
        });
        
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);

  // Filter events based on selected filter
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    
    if (filter === 'upcoming') {
      return eventDate >= today;
    } else if (filter === 'past') {
      return eventDate < today;
    }
    return true; // 'all' filter
  });

  // Check if user is an organizer or admin
  const canCreateEvent = user && (user.role === 'organizer' || user.role === 'admin');

  const filterOptions = [
    { key: 'all', label: 'All Events', count: events.length },
    { key: 'upcoming', label: 'Upcoming', count: events.filter(e => new Date(e.date) >= new Date()).length },
    { key: 'past', label: 'Past Events', count: events.filter(e => new Date(e.date) < new Date()).length }
  ];

  if (loading) {
    return <PageLoader text="Loading events..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
              <p className="text-gray-600">Discover and participate in exciting college events</p>
            </div>
            {canCreateEvent && (
              <Link 
                to="/events/create" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 font-semibold shadow-sm hover:shadow-md group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Create Event
              </Link>
            )}
          </div>
        </div>

        {/* Filter controls */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(option => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  className={`flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium rounded-xl transition duration-200 flex items-center justify-center space-x-2 ${
                    filter === option.key 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span>{option.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filter === option.key 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h3>
                  <p className="text-gray-600">{error}</p>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="ml-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events grid */}
        {!error && (
          <div>
            {filteredEvents.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {filter === 'all' 
                      ? 'No events found' 
                      : filter === 'upcoming' 
                        ? 'No upcoming events' 
                        : 'No past events'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {filter === 'all' 
                      ? "There are no events available at the moment." 
                      : filter === 'upcoming' 
                        ? "Check back soon for new upcoming events." 
                        : "No past events to display."}
                  </p>
                  {canCreateEvent && filter !== 'past' && (
                    <Link 
                      to="/events/create" 
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 font-semibold shadow-sm hover:shadow-md group"
                    >
                      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      Create your first event
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;