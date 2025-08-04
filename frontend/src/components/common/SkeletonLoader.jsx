import React from 'react';

const SkeletonLoader = ({ className = '', children }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  );
};

// Skeleton components for different content types
export const SkeletonCard = ({ className = '' }) => (
  <SkeletonLoader className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex space-x-2 pt-4">
        <div className="h-10 bg-gray-200 rounded flex-1"></div>
        <div className="h-10 bg-gray-200 rounded flex-1"></div>
      </div>
    </div>
  </SkeletonLoader>
);

export const SkeletonText = ({ lines = 1, className = '' }) => (
  <SkeletonLoader className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className={`h-4 bg-gray-200 rounded ${
          i === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      ></div>
    ))}
  </SkeletonLoader>
);

export const SkeletonCircle = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <SkeletonLoader className={`${sizeClasses[size]} bg-gray-200 rounded-full ${className}`} />
  );
};

export const SkeletonButton = ({ className = '' }) => (
  <SkeletonLoader className={`h-10 bg-gray-200 rounded-lg ${className}`} />
);

export const SkeletonTable = ({ rows = 5, cols = 4, className = '' }) => (
  <SkeletonLoader className={`${className}`}>
    <div className="space-y-3">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 pb-2 border-b">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-gray-100 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  </SkeletonLoader>
);

export default SkeletonLoader;