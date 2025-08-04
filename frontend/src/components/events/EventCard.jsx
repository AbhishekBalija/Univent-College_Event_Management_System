import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const EventCard = ({ event }) => {
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge based on event date
  const getStatusBadge = () => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (eventDate < today) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
          Completed
        </span>
      );
    } else if (eventDate >= today && eventDate < tomorrow) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1 animate-pulse"></div>
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          Upcoming
        </span>
      );
    }
  };

  // Default event image
  const defaultEventImage = '/beach.jpg';

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Event Image */}
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
          {getStatusBadge()}
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition duration-200 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {event.description.length > 100 
              ? `${event.description.substring(0, 100)}...` 
              : event.description}
          </p>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="text-sm font-medium">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="text-sm truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span className="text-sm">
              {event.participants ? `${event.participants.length} / ${event.capacity}` : `0 / ${event.capacity}`} participants
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link 
            to={`/events/${event._id}`} 
            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl transition duration-200 font-medium text-sm group/btn"
          >
            <span className="group-hover/btn:scale-105 inline-block transition duration-200">View Details</span>
          </Link>
          <Link 
            to={`/leaderboard/${event._id}`} 
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl transition duration-200 font-medium text-sm group/btn"
          >
            <span className="group-hover/btn:scale-105 inline-block transition duration-200">Leaderboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    image: PropTypes.string,
    participants: PropTypes.array,
  }).isRequired,
};

export default EventCard;