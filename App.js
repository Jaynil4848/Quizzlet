import React from 'react';
import { useQuizState } from './hooks/useQuizState';
import { useQuizCreation } from './hooks/useQuizCreation';
import { useQuizTaking } from './hooks/useQuizTaking';
import { useFullscreen } from './hooks/useFullscreen';
import { generateQuizCode, calculateQuizResults } from './utils/quizUtils';

// Import all screen components
import { HomeScreen } from './screens/HomeScreen';
import { CreateQuizScreen } from './screens/CreateQuizScreen';
import { JoinQuizScreen } from './screens/JoinQuizScreen';
import { QuizDetailsScreen } from './screens/QuizDetailsScreen';
import { TakeQuizScreen } from './screens/TakeQuizScreen';
import { ResultsScreen } from './screens/ResultsScreen';

function App() {
  // Main app state using our custom hooks
  const {
    currentView,
    setCurrentView,
    quizzes,
    setQuizzes,
    currentQuiz,
    setCurrentQuiz,
    quizResults,
    setQuizResults
  } = useQuizState();

  // Quiz creation state
  const {
    newQuiz,
    setNewQuiz,
    currentQuestion,
    setCurrentQuestion,
    resetQuizCreation
  } = useQuizCreation();

  // Quiz taking state
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userAnswers,
    setUserAnswers,
    quizStartTime,
    setQuizStartTime,
    resetQuizTaking
  } = useQuizTaking();

  // Fullscreen functionality
  const {
    fullscreenWarnings,
    setFullscreenWarnings,
    isFullscreen,
    fullscreenRef,
    enterFullscreen,
    exitFullscreen
  } = useFullscreen();

  // ===== NAVIGATION FUNCTIONS =====
  const goToHome = () => {
    setCurrentView('home');
    resetQuizCreation();
    resetQuizTaking();
  };

  const goToCreateQuiz = () => {
    setCurrentView('createQuiz');
    resetQuizCreation();
  };

  const goToJoinQuiz = () => {
    setCurrentView('joinQuiz');
    resetQuizTaking();
  };

  const goToQuizDetails = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentView('quizDetails');
  };

  const goToTakeQuiz = (quiz, participantName) => {
    setCurrentQuiz({ ...quiz, participantName });
    setCurrentView('takeQuiz');
    setQuizStartTime(Date.now());
    resetQuizTaking();
  };

  const goToResults = (results) => {
    setQuizResults(prev => [...prev, results]);
    setCurrentView('results');
  };

  // ===== QUIZ CREATION FUNCTIONS =====
  const handleAddQuestion = () => {
    if (isQuestionValid()) {
      setNewQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, { ...currentQuestion }]
      }));
    // Reset to default for next question
      setCurrentQuestion({
        type: 'mcq',
        question: '',
       options: ['', '', '', ''],
        correctAnswer: 0,
        excelInitialData: [[{ value: '' }]]
      });
    }
  };

  const handleCreateQuiz = () => {
    if (newQuiz.title.trim() && newQuiz.questions.length > 0) {
      const quizWithCode = {
        ...newQuiz,
        code: generateQuizCode(),
        createdAt: new Date().toISOString(),
        id: Date.now() // Simple ID generation
      };
      
      setQuizzes(prev => [...prev, quizWithCode]);
      goToQuizDetails(quizWithCode);
    }
  };

  const isQuestionValid = () => {
    if (currentQuestion.type === 'mcq') {
      return (
        currentQuestion.question.trim() &&
        Array.isArray(currentQuestion.options) &&
        currentQuestion.options.length === 4 &&
        currentQuestion.options.every(opt => opt.trim()) &&
        typeof currentQuestion.correctAnswer === 'number'
      );
    } else if (currentQuestion.type === 'excel') {
      // Only require a question prompt, not all cells filled
      return currentQuestion.question.trim();
    }
    return false;
  };

  // ===== QUIZ TAKING FUNCTIONS =====
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = (forceSubmit = false) => {
    const endTime = Date.now();
    const results = calculateQuizResults(
      currentQuiz.questions,
      userAnswers,
      quizStartTime,
      endTime,
      currentQuiz.participantName,
      currentQuiz.title,
      forceSubmit,
      fullscreenWarnings
    );
    
    goToResults(results);
    
    // Exit fullscreen if it was required
    if (currentQuiz.isFullscreen && isFullscreen) {
      exitFullscreen();
    }
  };

  // ===== FULLSCREEN MONITORING =====
  const handleFullscreenExit = () => {
    if (currentQuiz?.isFullscreen && currentView === 'takeQuiz') {
      setFullscreenWarnings(prev => prev + 1);
      
      // Force submit after 3 warnings
      if (fullscreenWarnings >= 2) {
        alert('Too many fullscreen violations. Quiz will be submitted automatically.');
        handleSubmitQuiz(true);
        return;
      }
      
      alert(`Warning: You exited fullscreen mode. This is violation ${fullscreenWarnings + 1}/3.`);
      
      // Try to re-enter fullscreen
      setTimeout(() => {
        enterFullscreen();
      }, 1000);
    }
  };

  // Monitor fullscreen changes
  React.useEffect(() => {
    if (!isFullscreen && currentView === 'takeQuiz' && currentQuiz?.isFullscreen) {
      handleFullscreenExit();
    }
  }, [isFullscreen, currentView, currentQuiz?.isFullscreen]);

  // ===== DELETE QUIZ FUNCTION =====
  const handleDeleteQuiz = (quizId) => {
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    setQuizResults(prev => prev.filter(r => r.id !== quizId));
  };

  // ===== RENDER CURRENT SCREEN (object map, no switch) =====
  const screens = {
    home: (
      <HomeScreen
        quizzes={quizzes}
        onCreateQuiz={goToCreateQuiz}
        onJoinQuiz={goToJoinQuiz}
        onViewQuizDetails={goToQuizDetails}
        onDeleteQuiz={handleDeleteQuiz}
      />
    ),
    createQuiz: (
      <CreateQuizScreen
        newQuiz={newQuiz}
        setNewQuiz={setNewQuiz}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        onAddQuestion={handleAddQuestion}
        onCreateQuiz={handleCreateQuiz}
        isQuestionValid={isQuestionValid}
        onBack={goToHome}
      />
    ),
    joinQuiz: (
      <JoinQuizScreen
        quizzes={quizzes}
        onJoinQuiz={goToTakeQuiz}
        onBack={goToHome}
      />
    ),
    quizDetails: (
      <QuizDetailsScreen
        quiz={currentQuiz}
        results={quizResults.filter(r => r.quizTitle === currentQuiz?.title)}
        onStartQuiz={(participantName) => goToTakeQuiz(currentQuiz, participantName)}
        onBack={goToHome}
      />
    ),
    takeQuiz: (
      <div ref={fullscreenRef}>
        <TakeQuizScreen
          quiz={currentQuiz}
          currentQuestionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          onAnswerSelect={handleAnswerSelect}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          onSubmitQuiz={() => handleSubmitQuiz(false)}
          fullscreenWarnings={fullscreenWarnings}
          isFullscreen={isFullscreen}
          onEnterFullscreen={enterFullscreen}
        />
      </div>
    ),
    results: (
      <ResultsScreen
        results={quizResults[quizResults.length - 1]}
        onBackToHome={goToHome}
        onRetakeQuiz={() => goToTakeQuiz(currentQuiz, currentQuiz.participantName)}
      />
    ),
  };

  return (
    <div className="App">
      {screens[currentView] || screens.home}
    </div>
  );
}

export default App;