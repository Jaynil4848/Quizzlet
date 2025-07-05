export const generateQuizCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const calculateQuizResults = (questions, userAnswers, startTime, endTime, participantName, quizTitle, wasForceSubmitted = false, fullscreenWarnings = 0) => {
  const timeTaken = Math.floor((endTime - startTime) / 1000);

  let correctAnswers = 0;
  const detailedResults = questions.map((question, index) => {
    const userAnswer = userAnswers[index];
    let isCorrect = false;
    let userAnswerDisplay = '';
    let correctAnswerDisplay = '';

    if (question.type === 'mcq') {
      isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      userAnswerDisplay = userAnswer !== undefined ? question.options[userAnswer] : 'Not answered';
      correctAnswerDisplay = question.options[question.correctAnswer];
    } else if (question.type === 'excel') {
      userAnswerDisplay = '[Excel Answer]';
      correctAnswerDisplay = '[Excel Expected]';
      // Optionally, add auto-grading logic for Excel here
    }

    return {
      question: question.question,
      userAnswer: userAnswerDisplay,
      correctAnswer: correctAnswerDisplay,
      isCorrect,
      options: question.options
    };
  });

  return {
    quizTitle,
    participantName,
    score: correctAnswers,
    totalQuestions: questions.length,
    percentage: Math.round((correctAnswers / questions.length) * 100),
    timeTaken,
    completedAt: new Date().toISOString(),
    detailedResults,
    wasForceSubmitted,
    fullscreenWarnings
  };
};

export const getGrade = (percentage) => {
  if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
  if (percentage >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
  if (percentage >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
  if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
};

export const calculateQuizStatistics = (results) => {
  if (results.length === 0) return null;
  
  const avgScore = results.reduce((sum, result) => sum + result.percentage, 0) / results.length;
  const highestScore = Math.max(...results.map(result => result.percentage));
  const lowestScore = Math.min(...results.map(result => result.percentage));
  
  return {
    totalAttempts: results.length,
    avgScore: Math.round(avgScore),
    highestScore,
    lowestScore
  };
};