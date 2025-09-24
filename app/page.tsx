'use client';

import { useState, useEffect } from 'react';
import RepositoryList from '@/components/RepositoryList';
import AuthButton from '@/components/AuthButton';
import LoadingSpinner from '@/components/LoadingSpinner';

interface User {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [codeReviewResult, setCodeReviewResult] = useState<string>('');
  const [codeReviewLoading, setCodeReviewLoading] = useState(false);
  const [codeInput, setCodeInput] = useState(`function add(a, b) {
  return a + b;
}

// Example usage
const result = add(5, 3);
console.log(result);

// This is a simple JavaScript function
// The AI will analyze this code and provide feedback`);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setError(null);
  };

  const handleAuthError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const testCodeReview = async () => {
    setCodeReviewLoading(true);
    setCodeReviewResult('');

    try {
      const response = await fetch('/api/test/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Please review this code and provide detailed feedback:\n\n${codeInput}`
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setCodeReviewResult(`✅ Code Review Complete:\n\n${data.response}`);
      } else {
        setCodeReviewResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setCodeReviewResult(`❌ Error: ${error}`);
    } finally {
      setCodeReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Automated GitHub Code Review Assistant
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect your GitHub repositories and let AI automatically review your pull requests. 
          Get instant feedback on code quality, potential bugs, and best practices.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">Smart Analysis</h3>
          <p className="text-gray-600">
            AI-powered code analysis that identifies bugs, security issues, and code quality problems.
          </p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold mb-2">Instant Reviews</h3>
          <p className="text-gray-600">
            Automatic code reviews triggered by webhooks when pull requests are opened.
          </p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold mb-2">Actionable Feedback</h3>
          <p className="text-gray-600">
            Get specific suggestions and improvements to enhance your code quality.
          </p>
        </div>
      </div>

      {/* Code Review Testing Section */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">🤖 Try AI Code Review</h2>
        <p className="text-gray-600 mb-6">
          Test the AI-powered code review feature right here! Paste your code below and get instant feedback.
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="code-input" className="block text-sm font-medium text-gray-700 mb-2">
              Code to Review:
            </label>
            <div className="relative">
              <textarea
                id="code-input"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="w-full h-80 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y overflow-y-auto bg-white"
                placeholder="Paste your code here..."
                style={{ 
                  lineHeight: '1.6',
                  fontSize: '14px',
                  color: '#374151',
                  backgroundColor: '#ffffff'
                }}
              />
              {codeInput && (
                <button
                  onClick={() => setCodeInput('')}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-sm"
                  title="Clear code"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 <strong>Tip:</strong> You can paste any code (JavaScript, Python, Java, etc.) and the AI will analyze it for you. 
              Use the ✕ button to clear the textarea.
            </p>
          </div>
          
          <button
            onClick={testCodeReview}
            disabled={codeReviewLoading || !codeInput.trim()}
            className="btn-primary text-lg px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {codeReviewLoading ? '🔄 Analyzing Code...' : '🔍 Review Code with AI'}
          </button>
          
          {codeReviewResult && (
            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">AI Code Review Complete</h3>
                </div>
              </div>
              <div className="text-sm whitespace-pre-wrap bg-white p-6 rounded-lg border shadow-inner max-h-96 overflow-y-auto font-mono" style={{ 
                lineHeight: '1.7',
                fontSize: '13px',
                color: '#374151'
              }}>
                {codeReviewResult}
              </div>
            </div>
          )}
          
          {!codeReviewResult && !codeReviewLoading && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                💡 <strong>Tip:</strong> Try pasting some JavaScript, Python, or other code to see how the AI analyzes it!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Section */}
      {!user ? (
        <div className="space-y-6">
          <div className="card text-center">
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="text-gray-600 mb-6">
              Connect your GitHub account (@zafor158) to start automating code reviews for your repositories.
            </p>
            <div className="space-y-4">
              <AuthButton 
                onSuccess={handleAuthSuccess}
                onError={handleAuthError}
              />
              <div className="text-sm text-gray-500">
                or
              </div>
              <a
                href="/setup"
                className="btn-secondary"
              >
                📋 Setup Guide for @zafor158
              </a>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>
          
          {/* Quick Info Card */}
          <div className="card">
            <h3 className="font-semibold mb-3">Your GitHub Profile</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Username:</strong> @zafor158</p>
                <p><strong>Repositories:</strong> 54</p>
              </div>
              <div>
                <p><strong>Role:</strong> AI Engineer at Mondaysys</p>
                <p><strong>Expertise:</strong> ML, DL, NLP, Big Data</p>
              </div>
            </div>
            <div className="mt-3">
              <a
                href="https://github.com/zafor158"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                View GitHub Profile
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Info */}
          <div className="card">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar_url}
                alt={user.name || user.login}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  Welcome, {user.name || user.login}!
                </h2>
                <p className="text-gray-600">@{user.login}</p>
              </div>
            </div>
          </div>

          {/* Repository Management */}
          <RepositoryList />
        </div>
      )}

      {/* How It Works */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Connect GitHub</h3>
            <p className="text-sm text-gray-600">Authenticate with your GitHub account</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Select Repositories</h3>
            <p className="text-sm text-gray-600">Choose which repositories to monitor</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Setup Webhooks</h3>
            <p className="text-sm text-gray-600">Automatic webhook configuration</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">4</span>
            </div>
            <h3 className="font-semibold mb-2">Get AI Reviews</h3>
            <p className="text-sm text-gray-600">Automatic code reviews on new PRs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
