'use client';

import { useState } from 'react';

export default function DebugOAuth() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testOAuthFlow = async () => {
    setLoading(true);
    try {
      // Test the authorize endpoint
      const response = await fetch('/api/auth/github/authorize', {
        method: 'GET',
        redirect: 'manual'
      });
      
      setDebugInfo({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        redirected: response.redirected,
        type: response.type
      });
    } catch (error) {
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testDirectRedirect = () => {
    // Direct redirect to GitHub OAuth
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', 'test_client_id');
    githubAuthUrl.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/github');
    githubAuthUrl.searchParams.set('scope', 'repo,user:email');
    githubAuthUrl.searchParams.set('state', 'test_state');
    
    window.location.href = githubAuthUrl.toString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">OAuth Debug Page</h1>
      
      <div className="space-y-4">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">OAuth Flow Debug</h2>
          
          <div className="space-y-3">
            <button
              onClick={testOAuthFlow}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Testing...' : 'Test OAuth Authorize Endpoint'}
            </button>
            
            <button
              onClick={testDirectRedirect}
              className="btn-secondary"
            >
              Direct GitHub OAuth (Test Mode)
            </button>
          </div>
          
          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold mb-2">Debug Information:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Current Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>GitHub Client ID:</strong> test_client_id (placeholder)</p>
            <p><strong>Callback URL:</strong> http://localhost:3000/api/auth/github</p>
            <p><strong>Issue:</strong> You need to create a real GitHub OAuth App</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">How to Fix</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold">Step 1: Create GitHub OAuth App</h3>
              <p className="text-sm text-gray-600 mb-2">
                Go to <a href="https://github.com/settings/developers" target="_blank" className="text-blue-600 hover:underline">GitHub Developer Settings</a>
              </p>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>Click "New OAuth App"</li>
                <li>Application name: "Code Review Assistant - zafor158"</li>
                <li>Homepage URL: http://localhost:3000</li>
                <li>Authorization callback URL: http://localhost:3000/api/auth/github</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Step 2: Update Environment Variables</h3>
              <p className="text-sm text-gray-600 mb-2">Replace the test values with real ones:</p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                $env:GITHUB_CLIENT_ID="your_real_client_id"<br/>
                $env:GITHUB_CLIENT_SECRET="your_real_client_secret"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
