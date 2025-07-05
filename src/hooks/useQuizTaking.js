import { useState } from 'react';

export const useQuizTaking = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(null);

  const resetQuizTaking = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizStartTime(null);
  };

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userAnswers,
    setUserAnswers,
    quizStartTime,
    setQuizStartTime,
    resetQuizTaking
  };
};