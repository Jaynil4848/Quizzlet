import React from 'react';
import { SimpleExcelGrid } from '../UI/SimpleExcelGrid';

export const QuestionList = ({ questions, title = "Added Questions" }) => {
  if (questions.length === 0) return null;

  return (
    <div className="border-t pt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {title} ({questions.length})
      </h3>
      <div className="space-y-3">
        {questions.map((q, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium mb-2">{index + 1}. {q.question}</p>
            {q.type === 'excel' ? (
              <div className="mt-2">
                <SimpleExcelGrid 
                  data={q.excelInitialData || [[{ value: '' }]]} 
                  readOnly={true} 
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {q.options.map((opt, optIndex) => (
                  <span 
                    key={optIndex} 
                    className={`px-2 py-1 rounded ${
                      q.correctAnswer === optIndex 
                        ? 'bg-green-100 text-green-800 font-medium' 
                        : 'bg-gray-100'
                    }`}
                  >
                    {opt} {q.correctAnswer === optIndex && '✓'}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};