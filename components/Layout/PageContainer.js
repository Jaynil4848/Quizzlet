import React from 'react';

export const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
};