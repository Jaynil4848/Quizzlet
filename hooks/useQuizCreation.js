import { useState } from 'react';

export const useQuizCreation = () => {
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    isFullscreen: false,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'mcq',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    excelInitialData: [[{ value: '' }]]
  });

  const resetQuizCreation = () => {
    setNewQuiz({
      title: '',
      description: '',
      isFullscreen: false,
      questions: []
    });
    setCurrentQuestion({
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      excelInitialData: [[{ value: '' }]]
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
