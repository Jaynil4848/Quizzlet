import React from 'react';
import { PageContainer } from '../components/Layout/PageContainer';
import { Header } from '../components/Layout/Header';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { QuestionForm } from '../components/Quiz/QuestionForm';
import { QuestionList } from '../components/Quiz/QuestionList';

export const CreateQuizScreen = ({
  newQuiz,
  setNewQuiz,
  currentQuestion,
  setCurrentQuestion,
  onAddQuestion,
  onCreateQuiz,
  isQuestionValid,
  onBack,
  currentUser,
  onLogout
}) => {
  return (
    <PageContainer>
      <Header 
        title="Create New Quiz" 
        subtitle="Design your custom quiz with multiple questions"
        onBack={onBack}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <Card>
        <div className="space-y-6">
          <Input
            label="Quiz Title"
            value={newQuiz.title}
            onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
            placeholder="Enter quiz title..."
          />
          <Input
            label="Description"
            value={newQuiz.description}
            onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
            placeholder="Brief description of the quiz..."
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="fullscreen"
              checked={newQuiz.isFullscreen}
              onChange={(e) => setNewQuiz({...newQuiz, isFullscreen: e.target.checked})}
              className="rounded text-blue-600"
            />
            <label htmlFor="fullscreen" className="text-sm font-medium text-gray-700">
              Enable Proctoring (Fullscreen Mode)
            </label>
          </div>
          <QuestionForm
            question={currentQuestion}
            onQuestionChange={setCurrentQuestion}
            onAddQuestion={onAddQuestion}
            isValid={isQuestionValid()}
          />

          <QuestionList questions={newQuiz.questions} />

          {newQuiz.questions.length > 0 && (
            <div className="pt-4 border-t">
              <Button
                onClick={onCreateQuiz}
                disabled={!newQuiz.title.trim()}
                variant="success"
                size="lg"
                className="w-full"
              >
                Create Quiz ({newQuiz.questions.length} questions)
              </Button>
            </div>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};
