// src/utils/authUtils.js
export const storeUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem('quizletUsers') || '[]');
  const existingUser = users.find(user => user.username === username);
  
  if (existingUser) {
    throw new Error('Username already exists');
  }

  users.push({ username, password });
  localStorage.setItem('quizletUsers', JSON.stringify(users));
};

export const verifyUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem('quizletUsers') || '[]');
  const user = users.find(user => user.username === username);
  
  if (!user) {
    throw new Error('User not found');
  }

  if (user.password !== password) {
    throw new Error('Incorrect password');
  }

  return true;
};

export const getCurrentUser = () => {
  return localStorage.getItem('quizletCurrentUser');
};

export const setCurrentUser = (username) => {
  localStorage.setItem('quizletCurrentUser', username);
};

export const logoutUser = () => {
  localStorage.removeItem('quizletCurrentUser');
};