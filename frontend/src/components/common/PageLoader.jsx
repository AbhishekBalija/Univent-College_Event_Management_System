import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const PageLoader = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center p-8">
        {/* Animated logo or icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        
        <LoadingSpinner size="lg" color="primary" />
        
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {text}
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we prepare everything for you
          </p>
        </div>
        
        {/* Progress bars animation */}
        <div className="mt-6 space-y-2">
          <div className="w-64 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;