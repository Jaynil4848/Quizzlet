import React from 'react';

export const ProgressBar = ({ progress, className = '' }) => {
  return (
    <div className={`bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
