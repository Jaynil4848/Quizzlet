import React from 'react';
import { Button } from '../UI/Button';

export const Header = ({ title, subtitle, onBack, backText = "← Back to Home" }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
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
  );
};