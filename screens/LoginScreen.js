// src/screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/Layout/PageContainer';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import Particles from 'react-tsparticles';


export const LoginScreen = ({ onLogin, onRegister, error }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const particlesInit = () => { };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(credentials.username, credentials.password);
    } else {
      if (credentials.password !== credentials.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      onRegister(credentials.username, credentials.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            color: { value: "#ffffff" },
            links: { enable: true, color: "#ffffff", distance: 150 },
            move: { enable: true, speed: 1 },
            number: { value: 50 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
        }}
        className="absolute w-full h-full z-0"
      />

      <div className="absolute top-0 left-0 w-full h-full animate-pulse bg-gradient-radial from-white/10 to-transparent blur-3xl z-0" />
      <div className="relative z-10 w-full p-4">
        <PageContainer>
          <Card className="max-w-md mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl p-8 transition-all duration-500 ease-in-out transform hover:scale-[1.02] text-white">
            <h2 className="text-2xl font-bold text-center mb-6">
              {isLogin ? 'Login' : 'Register'}
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition duration-300"
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition duration-300"
              />
              {!isLogin && (
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={credentials.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition duration-300"
                />
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 rounded-md shadow-md hover:from-purple-500 hover:to-indigo-600 transition duration-300"
                >
                  {isLogin ? 'Login' : 'Register'}
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-blue-600 text-sm"
              >
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
              </button>
            </div>
          </Card>
        </PageContainer>
      </div>
    </div>
  );
};
