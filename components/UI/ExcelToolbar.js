import React from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

export const ExcelToolbar = ({ onStyleChange }) => {
  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-300 bg-gray-50 rounded-t-lg">
      <button onClick={() => onStyleChange('fontWeight', 'bold')} className="p-2 rounded hover:bg-gray-200">
        <Bold size={16} />
      </button>
      <button onClick={() => onStyleChange('fontStyle', 'italic')} className="p-2 rounded hover:bg-gray-200">
        <Italic size={16} />
      </button>
      <button onClick={() => onStyleChange('textDecoration', 'underline')} className="p-2 rounded hover:bg-gray-200">
        <Underline size={16} />
      </button>
      <select onChange={(e) => onStyleChange('fontSize', e.target.value)} className="p-1 border rounded">
        <option value="12px">12</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
        <option value="20px">20</option>
      </select>
    </div>
  );
};
