'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

interface RepositoryAnalysis {
  repository: {
    name: string;
    fullName: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    defaultBranch: string;
    updatedAt: string;
  };
  analysis: {
    summary: string;
    score: number;
    issues: Array<{
      type: string;
      description: string;
      severity: string;
    }>;
    suggestions: string[];
    positiveAspects: string[];
  };
  files: Array<{
    path: string;
    size: number;
    preview: string;
  }>;
}

export default function RepositoryAnalysisPage() {
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  useEffect(() => {
    if (owner && repo) {
      analyzeRepository();
    } else {
      setError('Missing repository information');
      setLoading(false);
    }
  }, [owner, repo]);

  const analyzeRepository = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/repository/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner, repo }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze repository');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing repository:', error);
      setError('Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="card">
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
              <span className="ml-3 text-lg">Analyzing repository code...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="card">
            <div className="text-center py-12">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Failed</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.history.back()}
                className="btn-primary"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="card">
            <div className="text-center py-12">
              <p className="text-gray-600">No analysis data available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🤖 AI Code Review Results
              </h1>
              <p className="text-gray-600">
                Analysis for <strong>{analysis.repository.fullName}</strong>
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              ← Back to Repositories
            </button>
          </div>
        </div>

        {/* Repository Info */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Repository Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Language</p>
              <p className="font-medium">{analysis.repository.language || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stars</p>
              <p className="font-medium">{analysis.repository.stars}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Forks</p>
              <p className="font-medium">{analysis.repository.forks}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Default Branch</p>
              <p className="font-medium">{analysis.repository.defaultBranch}</p>
            </div>
          </div>
          {analysis.repository.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-gray-900">{analysis.repository.description}</p>
            </div>
          )}
        </div>

        {/* Overall Score */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Overall Code Quality Score</h2>
            <span className={`px-4 py-2 rounded-full font-bold text-lg ${getScoreColor(analysis.analysis.score)}`}>
              {analysis.analysis.score}/10
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                analysis.analysis.score >= 8 ? 'bg-green-500' : 
                analysis.analysis.score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(analysis.analysis.score / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Summary */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 Analysis Summary</h2>
          <p className="text-gray-700 leading-relaxed">{analysis.analysis.summary}</p>
        </div>

        {/* Issues */}
        {analysis.analysis.issues.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">⚠️ Issues Found</h2>
            <div className="space-y-3">
              {analysis.analysis.issues.map((issue, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{issue.type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-gray-700">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {analysis.analysis.suggestions.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">💡 Suggestions</h2>
            <ul className="space-y-2">
              {analysis.analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Positive Aspects */}
        {analysis.analysis.positiveAspects.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">✅ Positive Aspects</h2>
            <ul className="space-y-2">
              {analysis.analysis.positiveAspects.map((aspect, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">{aspect}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Files Analyzed */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">📁 Files Analyzed</h2>
          <div className="space-y-3">
            {analysis.files.map((file, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{file.path}</span>
                  <span className="text-sm text-gray-500">{file.size} characters</span>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{file.preview}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
