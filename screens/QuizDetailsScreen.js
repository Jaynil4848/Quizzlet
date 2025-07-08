import React, { useState } from 'react';
import { PageContainer } from '../components/Layout/PageContainer';
import { Header } from '../components/Layout/Header';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { QuestionList } from '../components/Quiz/QuestionList';
import { calculateQuizStatistics } from '../utils/quizUtils';
import { Clock, Users, Shield, BarChart3 } from 'lucide-react';

export const QuizDetailsScreen = ({ quiz, results, onStartQuiz, onBack, currentUser,  // Add this
  onLogout }) => {
  const [participantName, setParticipantName] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  
  const stats = calculateQuizStatistics(results);

  return (
    <PageContainer>
      <Header 
        title={quiz.title} 
        subtitle={quiz.description}
        onBack={onBack}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quiz Information</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={20} />
              <span>Questions: <strong>{quiz.questions.length}</strong></span>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="text-green-600" size={20} />
              <span>Quiz Code: <strong className="font-mono text-lg">{quiz.code}</strong></span>
            </div>
            
            {quiz.isFullscreen && (
              <div className="flex items-center gap-3">
                <Shield className="text-red-600" size={20} />
                <span className="text-red-600">Proctored Mode Enabled</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={() => onStartQuiz(quiz)} // Changed to pass quiz directly
              size="lg"
              className="w-full"
            >
              Start Quiz
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <Button
              onClick={() => setShowQuestions(!showQuestions)}
              variant="outline"
              className="w-full"
            >
              {showQuestions ? 'Hide' : 'Preview'} Questions
            </Button>
          </div>
        </Card>
        
        {stats && (
          <Card>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 className="text-blue-600" />
              Quiz Statistics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalAttempts}</div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{stats.avgScore}%</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.highestScore}%</div>
                <div className="text-sm text-gray-600">Highest Score</div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">{stats.lowestScore}%</div>
                <div className="text-sm text-gray-600">Lowest Score</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3">Recent Results</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {results.slice(-5).map((result, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <span className="font-medium">{result.participantName}</span>
                    <span className="text-blue-600 font-bold">{result.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
      
      {showQuestions && (
        <div className="mt-8">
          <Card>
            <QuestionList 
              questions={quiz.questions} 
              title="Quiz Questions Preview" 
            />
          </Card>
        </div>
      )}
    </PageContainer>
  );
};