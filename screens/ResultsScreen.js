import React from 'react';
import { PageContainer } from '../components/Layout/PageContainer';
import { Header } from '../components/Layout/Header'; // Added this import
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { exportResultsToExcel } from '../utils/excelUtils';

export const ResultsScreen = ({ 
  results, 
  onBackToHome, 
  onRetakeQuiz,
  currentUser, 
  onLogout 
}) => {
  if (!results) return <div>No results to display.</div>;

  // Format time taken as hh:mm:ss
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0s';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    let str = '';
    if (h > 0) str += `${h}h `;
    if (m > 0 || h > 0) str += `${m}m `;
    str += `${s}s`;
    return str.trim();  
  };

  const handleExportResults = () => {
    exportResultsToExcel(results);
  };

  return (
    <PageContainer>
      <Header
        title="Quiz Results"
        onBack={onBackToHome}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <Card className="max-w-lg mx-auto mt-12 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Quiz Results</h2>
        <div className="mb-4">
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Participant:</span> {results.participantName}</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Quiz Title:</span> {results.quizTitle}</p>
          {results.hasOnlyExcel ? (
            <p className="text-lg text-yellow-700 mb-2 font-semibold">
              Excel questions are not auto-evaluated and will be evaluated later.
            </p>
          ) : (
            <>
              <p className="text-lg text-gray-700 mb-2">
                <span className="font-semibold">Score:</span> {results.score} / {results.totalQuestions}
              </p>
              <p className="text-lg text-gray-700 mb-2">
                <span className="font-semibold">Percentage:</span> {results.percentage}%
              </p>
              {results.hasExcel && (
                <p className="text-yellow-700 mb-2 font-semibold">
                  Note: Excel questions are not auto-evaluated and will be evaluated later.
                </p>
              )}
            </>
          )}
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Time Taken:</span> {formatTime(results.timeTaken)}</p>
          {results.wasForceSubmitted && (
            <p className="text-red-600 font-semibold mt-2">Quiz was force submitted due to fullscreen violations.</p>
          )}
        </div>
        <div className="flex gap-4 justify-center mt-8">
          <Button onClick={onBackToHome} variant="outline">Back to Home</Button>
          <Button onClick={onRetakeQuiz} variant="primary">Retake Quiz</Button>
          <Button onClick={handleExportResults} variant="success">Export Results to Excel</Button>
        </div>
      </Card>
    </PageContainer>
  );
};