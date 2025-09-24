'use client';

import { useState } from 'react';

export default function TestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testWebhook = async () => {
    setLoading(true);
    setTestResult('');

    try {
      const response = await fetch('/api/webhook/github', {
        method: 'GET',
      });

      const data = await response.json();
      setTestResult(`✅ Webhook endpoint is working: ${data.message}`);
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setTestResult('');

    try {
      const response = await fetch('/api/auth/status');
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Authentication working: ${data.user.login}`);
      } else {
        setTestResult('❌ Not authenticated');
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Page</h1>
      
      <div className="space-y-4">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Test Endpoints</h2>
          
          <div className="space-y-3">
            <button
              onClick={testWebhook}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Testing...' : 'Test Webhook Endpoint'}
            </button>
            
            <button
              onClick={testAuth}
              disabled={loading}
              className="btn-secondary"
            >
              {loading ? 'Testing...' : 'Test Authentication'}
            </button>
          </div>
          
          {testResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <pre className="text-sm">{testResult}</pre>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Environment Check</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">GitHub Client ID:</span>{' '}
              {process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ? '✅ Set' : '❌ Missing'}
            </div>
            <div>
              <span className="font-medium">Groq API Key:</span>{' '}
              {process.env.NEXT_PUBLIC_GROQ_API_KEY ? '✅ Set' : '❌ Missing'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
