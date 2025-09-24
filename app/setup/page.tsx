'use client';

import { useState } from 'react';

export default function GitHubConnectionSetup() {
  const [step, setStep] = useState(1);
  const [oauthData, setOauthData] = useState({
    clientId: '',
    clientSecret: '',
    webhookSecret: '',
  });

  const steps = [
    {
      title: 'Create GitHub OAuth App',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            First, you need to create a GitHub OAuth App to connect your account (@zafor158).
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Go to <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub Developer Settings</a></li>
              <li>Click "New OAuth App"</li>
              <li>Fill in the application details:</li>
            </ol>
            <div className="mt-3 bg-white p-3 rounded border">
              <p><strong>Application name:</strong> Code Review Assistant - zafor158</p>
              <p><strong>Homepage URL:</strong> http://localhost:3000</p>
              <p><strong>Authorization callback URL:</strong> http://localhost:3000/api/auth/github</p>
            </div>
            <p className="text-sm mt-2">After creating, copy the Client ID and Client Secret.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Configure Environment Variables',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Enter the OAuth App credentials you just created:
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Client ID
              </label>
              <input
                type="text"
                value={oauthData.clientId}
                onChange={(e) => setOauthData({...oauthData, clientId: e.target.value})}
                className="input"
                placeholder="Enter your GitHub Client ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Client Secret
              </label>
              <input
                type="password"
                value={oauthData.clientSecret}
                onChange={(e) => setOauthData({...oauthData, clientSecret: e.target.value})}
                className="input"
                placeholder="Enter your GitHub Client Secret"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook Secret (optional)
              </label>
              <input
                type="text"
                value={oauthData.webhookSecret}
                onChange={(e) => setOauthData({...oauthData, webhookSecret: e.target.value})}
                className="input"
                placeholder="Generate a random string for webhook security"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Test Connection',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Test the connection to your GitHub account (@zafor158):
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Ready to connect!</h3>
            <p className="text-sm mb-3">
              Your GitHub account (@zafor158) will be connected and you'll be able to:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>View your repositories (54 repositories)</li>
              <li>Set up automated code reviews</li>
              <li>Configure webhooks for pull requests</li>
              <li>Get AI-powered code analysis using Groq</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (step < steps.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const testConnection = async () => {
    // This would test the GitHub connection
    alert('Connection test would be implemented here');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Connect GitHub Account (@zafor158)
        </h1>
        <p className="text-gray-600">
          Set up automated code reviews for your repositories
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((_, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step > index + 1 ? 'bg-green-500 text-white' :
                step === index + 1 ? 'bg-blue-500 text-white' :
                'bg-gray-300 text-gray-600'
              }`}>
                {step > index + 1 ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">{steps[step - 1].title}</h2>
        {steps[step - 1].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {step === steps.length ? (
          <button
            onClick={testConnection}
            className="btn-primary"
          >
            Test Connection
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="btn-primary"
          >
            Next
          </button>
        )}
      </div>

      {/* Quick Access Links */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">Your GitHub Profile</h3>
          <p className="text-sm text-gray-600 mb-3">
            AI Engineer at Mondaysys with expertise in ML, DL, NLP, and Big Data
          </p>
          <a
            href="https://github.com/zafor158"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm"
          >
            View Profile
          </a>
        </div>
        
        <div className="card">
          <h3 className="font-semibold mb-2">Your Repositories</h3>
          <p className="text-sm text-gray-600 mb-3">
            54 repositories including AI/ML projects
          </p>
          <a
            href="https://github.com/zafor158?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm"
          >
            View Repositories
          </a>
        </div>
      </div>
    </div>
  );
}
