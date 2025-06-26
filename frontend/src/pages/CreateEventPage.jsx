import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services';
import { useAuth } from '../context/AuthContext';
import EventForm from '../components/events/EventForm';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authorized to create events
  const canCreateEvent = user && (user.role === 'organizer' || user.role === 'admin');

  // Initial form data
  const initialEventData = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 50,
    tags: [],
    image: ''
  };

  const handleSubmit = async (eventData) => {
    if (!canCreateEvent) {
      setError('You do not have permission to create events.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Log user information for debugging
      console.log('Current user:', user);
      console.log('User role:', user.role);
      console.log('Can create event:', canCreateEvent);
      
      // Combine date and time fields
      const combinedData = {
        ...eventData,
        date: new Date(`${eventData.date}T${eventData.time}`).toISOString(),
      };
      
      // Remove the separate time field
      delete combinedData.time;
      
      // Add creator information
      combinedData.createdBy = user._id || user.id;
      combinedData.organizerName = user.name || `${user.firstName} ${user.lastName}`;

      // Log the token from localStorage for debugging
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      if (token) {
        // Log the first few characters of the token (don't log the entire token for security)
        console.log('Token preview:', token.substring(0, 20) + '...');
      }
      
      const createdEvent = await eventService.createEvent(combinedData);
      console.log('Created event response:', createdEvent); // Debug log to see response structure
      
      // Extract the event ID from the response, handling different response structures
      const eventId = createdEvent.data?._id || createdEvent._id;
      
      if (!eventId) {
        console.error('No event ID in response:', createdEvent);
        throw new Error('Failed to get event ID from server response');
      }
      
      console.log('Navigating to event with ID:', eventId);
      navigate(`/events/${eventId}`);
    } catch (err) {
      console.error('Failed to create event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If user is not authorized, show access denied message
  if (!canCreateEvent) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <svg className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-800">Access Denied</h2>
          <p className="mt-2 text-gray-600">You don't have permission to create events. Only organizers and administrators can create events.</p>
          <div className="mt-6">
            <Link to="/events" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/events" className="text-indigo-600 hover:text-indigo-900 flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Events
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Fill out the form below to create a new event.
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border-t border-b border-red-200">
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
          )}

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <EventForm 
              initialData={initialEventData} 
              onSubmit={handleSubmit} 
              isSubmitting={loading} 
              submitButtonText="Create Event"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;