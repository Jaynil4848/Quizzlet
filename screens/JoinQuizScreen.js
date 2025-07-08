import React, { useState } from 'react';
import { PageContainer } from '../components/Layout/PageContainer';
import { Header } from '../components/Layout/Header';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';

export function JoinQuizScreen({ quizzes = [], onJoinQuiz, onBack }) {
  const [quizCode, setQuizCode] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [error, setError] = useState('');

  const handleJoinQuiz = () => {
    if (!quizCode.trim() || !participantName.trim()) {
      setError('Please enter both quiz code and your name');
      return;
    }

    const quiz = quizzes.find(q => q.code === quizCode.toUpperCase());
    if (!quiz) {
      setError('Quiz code not found. Please check the code and try again.');
      return;
    }

    onJoinQuiz(quiz, participantName);
  };

  return (
    <PageContainer>
      <Header 
        title="Join Quiz" 
        subtitle="Enter the quiz code provided by your instructor"
        onBack={onBack}
      />
      <Card className="max-w-md mx-auto">
        <div className="space-y-6">
          <Input
            label="Quiz Code"
            value={quizCode}
            onChange={(e) => {
              setQuizCode(e.target.value.toUpperCase());
              setError('');
            }}
            placeholder="Enter 6-character code..."
            className="text-center text-lg font-mono"
            maxLength={6}
          />
          <Input
            label="Your Name"
            value={participantName}
            onChange={(e) => {
              setParticipantName(e.target.value);
              setError('');
            }}
            placeholder="Enter your full name..."
          />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <Button
            onClick={handleJoinQuiz}
            disabled={!quizCode.trim() || !participantName.trim()}
            className="w-full"
            size="lg"
          >
            Join Quiz
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
