import React, { useState } from 'react';
import { DhozziLogo } from './Icons';
import * as auth from '../utils/auth';
import { DhozziUser } from '../types';

interface LoginScreenProps {
    onLoginSuccess: (user: DhozziUser) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
        setError("Please enter both email and password.");
        return;
    }
    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        let user;
        if (isSignUp) {
            user = await auth.signUp(email, password);
        } else {
            user = await auth.signIn(email, password);
        }
        onLoginSuccess(user);
    } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 animate-fade-in pb-20">
      <div className="text-center">
        <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 bg-gradient-to-br from-[--color-primary-start] to-[--color-primary-end] rounded-full blur-2xl opacity-50"></div>
            <div className="relative w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-white/20">
            <DhozziLogo className="w-16 h-16 text-white" />
            </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome to Dhozzi</h1>
        <p className="text-lg text-gray-400">{isSignUp ? 'Create an account to get started' : 'Sign in to your account'}</p>
      </div>

      <div className="w-full max-w-sm mt-12">
        <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-700/50 border border-white/20 rounded-lg p-4 text-lg focus:outline-none focus:border-[--color-accent] focus:ring-1 focus:ring-[--color-accent] transition-colors"
                autoComplete="email"
                required
              />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-gray-700/50 border border-white/20 rounded-lg p-4 text-lg focus:outline-none focus:border-[--color-accent] focus:ring-1 focus:ring-[--color-accent] transition-colors"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
              />
            </div>

            {error && <p className="mt-4 text-sm text-center text-red-400 bg-red-900/30 p-3 rounded-lg">{error}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 p-4 bg-gradient-to-br from-[--color-primary-start] to-[--color-primary-end] text-white rounded-lg font-bold text-lg transition-opacity disabled:opacity-50 hover:opacity-90"
            >
                {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="font-semibold text-[--color-accent] hover:underline ml-2">
                {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;