import React from 'react';

export const AnswerOption = ({ 
  option, 
  index, 
  isSelected, 
  onSelect 
}) => {
  return (
    <button
      onClick={() => onSelect(index)}
      className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full border-2 ${
          isSelected
            ? 'border-blue-500 bg-blue-500'
            : 'border-gray-300'
        }`}>
          {isSelected && (
            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
          )}
        </div>
        <span>{option}</span>
      </div>
    </button>
  );
};