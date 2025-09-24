'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface Repository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  description: string;
  private: boolean;
  url: string;
  defaultBranch: string;
  updatedAt: string;
}

interface WebhookStatus {
  [key: string]: {
    connected: boolean;
    webhookId?: number | string;
    loading: boolean;
    simulated?: boolean;
    instructions?: any;
  };
}

export default function RepositoryList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webhookStatus, setWebhookStatus] = useState<WebhookStatus>({});

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const response = await fetch('/api/repositories');
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const data = await response.json();
      setRepositories(data.repositories);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setError('Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  const setupWebhook = async (repo: Repository) => {
    setWebhookStatus(prev => ({
      ...prev,
      [repo.fullName]: { ...prev[repo.fullName], loading: true }
    }));

    try {
      // First, navigate to analysis page
      window.location.href = `/repository-analysis?owner=${repo.owner}&repo=${repo.name}`;
      
      // Then setup webhook in background
      const response = await fetch('/api/webhook/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: repo.owner,
          repo: repo.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to setup webhook');
      }

      const data = await response.json();
      
      // Handle local development mode
      if (data.webhook?.status === 'simulated') {
        setWebhookStatus(prev => ({
          ...prev,
          [repo.fullName]: {
            connected: true,
            webhookId: data.webhook.id,
            loading: false,
            simulated: true,
            instructions: data.webhook.instructions
          }
        }));
      } else {
        setWebhookStatus(prev => ({
          ...prev,
          [repo.fullName]: {
            connected: true,
            webhookId: data.webhook.id,
            loading: false,
          }
        }));
      }
    } catch (error) {
      console.error('Error setting up webhook:', error);
      setWebhookStatus(prev => ({
        ...prev,
        [repo.fullName]: { ...prev[repo.fullName], loading: false }
      }));
    }
  };

  const removeWebhook = async (repo: Repository) => {
    const status = webhookStatus[repo.fullName];
    if (!status?.webhookId) return;

    setWebhookStatus(prev => ({
      ...prev,
      [repo.fullName]: { ...prev[repo.fullName], loading: true }
    }));

    try {
      const response = await fetch('/api/webhook/setup', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: repo.owner,
          repo: repo.name,
          webhookId: status.webhookId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove webhook');
      }

      setWebhookStatus(prev => ({
        ...prev,
        [repo.fullName]: {
          connected: false,
          loading: false,
        }
      }));
    } catch (error) {
      console.error('Error removing webhook:', error);
      setWebhookStatus(prev => ({
        ...prev,
        [repo.fullName]: { ...prev[repo.fullName], loading: false }
      }));
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Your Repositories</h2>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Your Repositories</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchRepositories} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Your Repositories</h2>
      <p className="text-gray-600 mb-6">
        Select repositories to enable automated code reviews. Webhooks will be automatically configured.
      </p>
      

      {repositories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No repositories found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {repositories.map((repo) => {
            const status = webhookStatus[repo.fullName];
            const isConnected = status?.connected || false;
            const isLoading = status?.loading || false;

            return (
              <div
                key={repo.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900">
                      {repo.fullName}
                    </h3>
                    {repo.private && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Private
                      </span>
                    )}
                    {isConnected ? (
                      status?.simulated ? (
                        <span className="status-pending">Simulated (Local Dev)</span>
                      ) : (
                        <span className="status-connected">Connected</span>
                      )
                    ) : (
                      <span className="status-disconnected">Not Connected</span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Default branch: {repo.defaultBranch}</span>
                    <span>Updated: {new Date(repo.updatedAt).toLocaleDateString()}</span>
                  </div>
                  {status?.simulated && status.instructions && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                      <h4 className="font-semibold">{status.instructions.title}</h4>
                      <ul className="list-disc list-inside mt-1">
                        {status.instructions.steps.map((step: string, index: number) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm"
                  >
                    View on GitHub
                  </a>
                  {isConnected ? (
                    <button
                      onClick={() => removeWebhook(repo)}
                      disabled={isLoading}
                      className="btn-danger text-sm disabled:opacity-50"
                    >
                      {isLoading ? 'Removing...' : 'Disconnect'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setupWebhook(repo)}
                      disabled={isLoading}
                      className="btn-primary text-sm disabled:opacity-50"
                    >
                      {isLoading ? 'Connecting...' : 'Connect'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
