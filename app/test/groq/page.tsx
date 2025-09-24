'use client';

import { useState } from 'react';

export default function GroqTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testGroqAPI = async () => {
    setLoading(true);
    setTestResult('');

    try {
      const response = await fetch('/api/test/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello, can you analyze this simple code: function add(a, b) { return a + b; }'
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTestResult(`✅ Groq API working: ${data.response}`);
      } else {
        setTestResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🤖 Groq API Test
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Test the AI-powered code review functionality powered by Groq.
        </p>
      </div>
      
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Test Groq Integration</h2>
        <p className="text-gray-600 mb-6">
          This page tests the Groq API integration for code review functionality. 
          Click the button below to send a test request to the AI.
        </p>
        
        <button
          onClick={testGroqAPI}
          disabled={loading}
          className="btn-primary mb-6 text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🔄 Testing...' : '🔍 Test Groq API'}
        </button>
        
        {testResult && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">AI Response:</h3>
            <div className="text-sm whitespace-pre-wrap bg-white p-4 rounded border max-h-96 overflow-y-auto">
              {testResult}
            </div>
          </div>
        )}
        
        {!testResult && !loading && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Ready to Test
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Click the "Test Groq API" button above to send a test request to the AI.
                    The AI will analyze a simple JavaScript function and provide feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
