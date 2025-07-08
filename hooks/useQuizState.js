import { useState } from 'react';

export const useQuizState = () => {
  const [currentView, setCurrentView] = useState('home');
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  return {
    currentView,
    setCurrentView,
    quizzes,
    setQuizzes,
    currentQuiz,
    setCurrentQuiz,
    quizResults,
    setQuizResults
  };
};