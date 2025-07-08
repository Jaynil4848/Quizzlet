import React from 'react';
// src/components/Layout/Header.js
// Add to the imports
import { Button } from '../UI/Button';

// Modify the component to accept currentUser and onLogout
export const Header = ({ title, subtitle, onBack, backText = "← Back to Home", currentUser, onLogout }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {currentUser && (
          <div className="text-sm text-gray-600">
            Logged in as: <span className="font-medium">{currentUser}</span>
          </div>
        )}
        {onLogout && (
          <Button 
            onClick={onLogout}
            variant="outline"
            size="sm"
          >
            Logout
          </Button>
        )}
        {onBack && (
          <Button 
            onClick={onBack}
            variant="outline"
            className="text-gray-600 hover:text-gray-800"
          >
            {backText}
          </Button>
        )}
      </div>
    </div>
  );
};