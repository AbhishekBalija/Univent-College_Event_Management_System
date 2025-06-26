import React, { useState } from 'react';
import PropTypes from 'prop-types';

const EventForm = ({ initialData, onSubmit, isSubmitting, submitButtonText }) => {
  const [formData, setFormData] = useState(initialData);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
        {/* Title */}
        <div className="sm:col-span-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Event Title *
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 ${errors.title ? 'border-red-300' : ''}`}
              placeholder="Tech Conference 2023"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="sm:col-span-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 ${errors.description ? 'border-red-300' : ''}`}
              placeholder="Provide a detailed description of your event"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Provide details about what attendees can expect, topics covered, speakers, etc.
          </p>
        </div>

        {/* Date and Time */}
        <div className="sm:col-span-3">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date *
          </label>
          <div className="mt-1">
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 ${errors.date ? 'border-red-300' : ''}`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Time *
          </label>
          <div className="mt-1">
            <input
              type="time"
              name="time"
              id="time"
              value={formData.time}
              onChange={handleChange}
              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 ${errors.time ? 'border-red-300' : ''}`}
            />
            {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
          </div>
        </div>

        {/* Location */}
        <div className="sm:col-span-6">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 ${errors.location ? 'border-red-300' : ''}`}
              placeholder="Building name, room number, address, or online platform"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>
        </div>

        {/* Capacity */}
        <div className="sm:col-span-2">
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
            Capacity *
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="capacity"
              id="capacity"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 ${errors.capacity ? 'border-red-300' : ''}`}
            />
            {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Maximum number of attendees
          </p>
        </div>

        {/* Tags */}
        <div className="sm:col-span-6">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (Optional)
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              name="tagInput"
              id="tagInput"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyPress={handleTagKeyPress}
              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 px-3 py-2"
              placeholder="Add tags (e.g., technology, workshop, networking)"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    <span className="sr-only">Remove tag {tag}</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Image URL */}
        <div className="sm:col-span-6">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image URL (Optional)
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="image"
              id="image"
              value={formData.image}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Provide a URL to an image for your event
          </p>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : submitButtonText || 'Submit'}
          </button>
        </div>
      </div>
    </form>
  );
};

EventForm.propTypes = {
  initialData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    image: PropTypes.string
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  submitButtonText: PropTypes.string
};

export default EventForm;