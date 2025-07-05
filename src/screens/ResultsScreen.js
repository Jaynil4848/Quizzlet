import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { PageContainer } from '../components/Layout/PageContainer';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { exportResultsToExcel } from '../utils/excelUtils';

export const ResultsScreen = ({ results, onBackToHome, onRetakeQuiz }) => {
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
      <Card className="max-w-lg mx-auto mt-12 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Quiz Results</h2>
        <div className="mb-4">
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Participant:</span> {results.participantName}</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Quiz Title:</span> {results.quizTitle}</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Score:</span> {results.score} / {results.totalQuestions}</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Percentage:</span> {results.percentage}%</p>
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

export const useFullscreen = () => {
  const [fullscreenWarnings, setFullscreenWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);

  const enterFullscreen = async () => {
    try {
      if (fullscreenRef.current) {
        if (fullscreenRef.current.requestFullscreen) {
          await fullscreenRef.current.requestFullscreen();
        } else if (fullscreenRef.current.webkitRequestFullscreen) {
          await fullscreenRef.current.webkitRequestFullscreen();
        } else if (fullscreenRef.current.mozRequestFullScreen) {
          await fullscreenRef.current.mozRequestFullScreen();
        } else if (fullscreenRef.current.msRequestFullscreen) {
          await fullscreenRef.current.msRequestFullscreen();
        }
      }
    } catch (error) {
      console.log('Fullscreen request failed:', error);
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (error) {
      console.log('Exit fullscreen failed:', error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return {
    fullscreenWarnings,
    setFullscreenWarnings,
    isFullscreen,
    setIsFullscreen,
    fullscreenRef,
    enterFullscreen,
    exitFullscreen
  };
};
