import React from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { ProgressBar } from '../components/UI/ProgressBar';
import { AnswerOption } from '../components/Quiz/AnswerOption';
import { SimpleExcelGrid } from '../components/UI/SimpleExcelGrid';
import { Clock, AlertTriangle, Shield } from 'lucide-react';

export const TakeQuizScreen = ({
  quiz,
  currentQuestionIndex,
  userAnswers,
  onAnswerSelect,
  onNextQuestion,
  onPreviousQuestion,
  onSubmitQuiz,
  fullscreenWarnings,
  isFullscreen,
  onEnterFullscreen
}) => {
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasAnswered = userAnswers[currentQuestionIndex] !== undefined;

  // Show fullscreen warning if proctored and not in fullscreen
  if (quiz.isFullscreen && !isFullscreen) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <Card className="max-w-md mx-auto text-center">
          <Shield className="text-red-600 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Fullscreen Required</h2>
          <p className="text-gray-600 mb-6">
            This quiz requires fullscreen mode for proctoring. Please click the button below to continue.
          </p>
          <Button onClick={onEnterFullscreen} variant="danger" size="lg">
            Enter Fullscreen Mode
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
            <div className="flex items-center gap-4">
              {quiz.isFullscreen && (
                <div className="flex items-center gap-2">
                  <Shield className="text-red-600" size={16} />
                  <span className="text-sm text-red-600">
                    Warnings: {fullscreenWarnings}/3
                  </span>
                </div>
              )}
              <span className="text-sm text-gray-600">
                Participant: {quiz.participantName}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <ProgressBar progress={progress} />
        </div>

        {/* Warning Messages */}
        {fullscreenWarnings > 0 && (
          <div className="mb-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded flex items-center gap-2">
            <AlertTriangle size={20} />
            <span>
              Warning: You have {fullscreenWarnings} fullscreen violation(s). 
              Quiz will be auto-submitted after 3 violations.
            </span>
          </div>
        )}

        {/* Question Card */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>
          {currentQuestion.type === 'excel' ? (
            <div>
              <SimpleExcelGrid
                data={userAnswers[currentQuestionIndex] || currentQuestion.excelInitialData}
                onChange={(newData) => onAnswerSelect(currentQuestionIndex, newData)}
              />
              {userAnswers[currentQuestionIndex] && (
                <p className="text-green-600 text-sm mt-2">✓ Answer saved</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <AnswerOption
                  key={index}
                  option={option}
                  index={index}
                  isSelected={userAnswers[currentQuestionIndex] === index}
                  onSelect={(optionIndex) => onAnswerSelect(currentQuestionIndex, optionIndex)}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={onPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            ← Previous
          </Button>
          <div className="flex gap-3">
            {!isLastQuestion ? (
              <Button
                onClick={onNextQuestion}
                disabled={!hasAnswered}
              >
                Next →
              </Button>
            ) : (
              <Button
                onClick={onSubmitQuiz}
                variant="success"
                size="lg"
                disabled={Object.keys(userAnswers).length !== quiz.questions.length}
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};