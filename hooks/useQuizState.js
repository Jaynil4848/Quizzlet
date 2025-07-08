// src/hooks/useQuizState.js
import { useState } from 'react';

export const useQuizState = () => {
  const [currentView, setCurrentView] = useState('login'); // Changed from 'home' to 'login'
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  return {
    currentView,
    setCurrentView,
    quizzes,
    setQuizzes,
    currentQuiz,
    setCurrentQuiz,
    quizResults,
    setQuizResults,
    currentUser,
    setCurrentUser,
    authError,
    setAuthError
  };
};