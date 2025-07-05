import React from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

export const QuizCard = ({ quiz, onViewDetails }) => {
  return (
    <Card className="hover:shadow-2xl transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
      <p className="text-gray-600 mb-4">{quiz.description}</p>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
          {quiz.questions.length} questions
        </span>
        {quiz.isFullscreen && (
          <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
            Proctored
          </span>
        )}
      </div>
      <Button onClick={onViewDetails} className="w-full">
        View Details
      </Button>
    </Card>
  );
};