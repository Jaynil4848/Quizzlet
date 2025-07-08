import React from 'react';
import { useQuizState } from './hooks/useQuizState';
import { useQuizCreation } from './hooks/useQuizCreation';
import { useQuizTaking } from './hooks/useQuizTaking';
import { useFullscreen } from './hooks/useFullscreen';
import { generateQuizCode, calculateQuizResults } from './utils/quizUtils';
import { storeUser, verifyUser, setCurrentUser, logoutUser, getCurrentUser } from './utils/authUtils';

// Import all screen components
import { HomeScreen } from './screens/HomeScreen';
import { CreateQuizScreen } from './screens/CreateQuizScreen';
import { JoinQuizScreen } from './screens/JoinQuizScreen';
import { QuizDetailsScreen } from './screens/QuizDetailsScreen';
import { TakeQuizScreen } from './screens/TakeQuizScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { LoginScreen } from './screens/LoginScreen';

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
    setQuizResults,
    currentUser,
    setCurrentUser,
    authError,
    setAuthError
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

  // ===== AUTHENTICATION FUNCTIONS =====
  const handleLogin = (username, password) => {
    try {
      verifyUser(username, password);
      setCurrentUser(username);
      setAuthError(null);
      setCurrentView('home');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleRegister = (username, password) => {
    try {
      storeUser(username, password);
      setCurrentUser(username);
      setAuthError(null);
      setCurrentView('home');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setCurrentView('login');
    resetQuizCreation();
    resetQuizTaking();
  };

  // Check for existing session on load
  React.useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentView('home');
    } else {
      setCurrentView('login');
    }
  }, []);

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

  const goToTakeQuiz = (quiz) => {
    setCurrentQuiz({ 
      ...quiz, 
      participantName: currentUser // Auto-use logged-in username
    });
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
        id: Date.now(),
        createdBy: currentUser
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
    
    if (currentQuiz.isFullscreen && isFullscreen) {
      exitFullscreen();
    }
  };

  // ===== FULLSCREEN MONITORING =====
  const handleFullscreenExit = () => {
    if (currentQuiz?.isFullscreen && currentView === 'takeQuiz') {
      setFullscreenWarnings(prev => prev + 1);
      
      if (fullscreenWarnings >= 2) {
        alert('Too many fullscreen violations. Quiz will be submitted automatically.');
        handleSubmitQuiz(true);
        return;
      }
      
      alert(`Warning: You exited fullscreen mode. This is violation ${fullscreenWarnings + 1}/3.`);
      
      setTimeout(() => {
        enterFullscreen();
      }, 1000);
    }
  };

  React.useEffect(() => {
    if (!isFullscreen && currentView === 'takeQuiz' && currentQuiz?.isFullscreen) {
      handleFullscreenExit();
    }
  }, [isFullscreen, currentView, currentQuiz?.isFullscreen]);

  // ===== DELETE QUIZ FUNCTION =====
  const handleDeleteQuiz = (quizId) => {
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    setQuizResults(prev => prev.filter(r => r.quizId !== quizId));
  };

  // ===== RENDER CURRENT SCREEN =====
  const screens = {
    login: (
      <LoginScreen
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={authError}
      />
    ),
    home: (
      <HomeScreen
        quizzes={quizzes.filter(q => q.createdBy === currentUser)}
        onCreateQuiz={goToCreateQuiz}
        onJoinQuiz={goToJoinQuiz}
        onViewQuizDetails={goToQuizDetails}
        onDeleteQuiz={handleDeleteQuiz}
        currentUser={currentUser}
        onLogout={handleLogout}
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
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    ),
    joinQuiz: (
      <JoinQuizScreen
        quizzes={quizzes}
        onJoinQuiz={goToTakeQuiz}
        onBack={goToHome}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    ),
    quizDetails: (
      <QuizDetailsScreen
        quiz={currentQuiz}
        results={quizResults.filter(r => r.quizTitle === currentQuiz?.title)}
        onStartQuiz={goToTakeQuiz} // Simplified - no need for participantName
        onBack={goToHome}
        currentUser={currentUser}
        onLogout={handleLogout}
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
        onRetakeQuiz={() => goToTakeQuiz(currentQuiz)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    ),
  };

  return (
    <div className="App">
      {screens[currentView] || screens.login}
    </div>
  );
}

export default App;