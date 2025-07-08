// src/screens/HomeScreen.js
import React from 'react';
import { PageContainer } from '../components/Layout/PageContainer';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { QuizCard } from '../components/Quiz/QuizCard';
import { Clock, Users, BarChart3 } from 'lucide-react';

export const HomeScreen = ({ 
  quizzes, 
  onCreateQuiz, 
  onJoinQuiz, 
  onViewQuizDetails,
  onDeleteQuiz
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Quizzlet</h1>
          <p className="text-xl text-gray-600">Create, Share, and Analyze Quizzes</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="text-center hover:shadow-2xl transition-all duration-300">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-blue-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Create Quiz</h3>
            <p className="text-gray-600 mb-6">
              Design custom quizzes with multiple question types and advanced proctoring
            </p>
            <Button onClick={onCreateQuiz}>
              Start Creating
            </Button>
          </Card>
          
          <Card className="text-center hover:shadow-2xl transition-all duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-green-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Take Quiz</h3>
            <p className="text-gray-600 mb-6">
              Enter a quiz code to participate in a quiz
            </p>
            <Button onClick={onJoinQuiz} variant="success">
              Join Quiz
            </Button>
          </Card>
        </div>
        
        {quizzes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Quizzes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz, index) => (
                <QuizCard
                  key={index}
                  quiz={quiz}
                  onViewDetails={() => onViewQuizDetails(quiz)}
                  onDelete={() => onDeleteQuiz(quiz.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};