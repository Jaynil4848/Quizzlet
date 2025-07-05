import { useState } from 'react';

export const useQuizCreation = () => {
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    isFullscreen: false,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const resetQuizCreation = () => {
    setNewQuiz({
      title: '',
      description: '',
      isFullscreen: false,
      questions: []
    });
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
  };

  return {
    newQuiz,
    setNewQuiz,
    currentQuestion,
    setCurrentQuestion,
    resetQuizCreation
  };
};
