import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

// GitHub App authentication
const createGitHubAppAuth = () => {
  if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PRIVATE_KEY) {
    throw new Error('GitHub App credentials not configured');
  }

  return createAppAuth({
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
    installationId: process.env.GITHUB_APP_INSTALLATION_ID,
  });
};

// Create authenticated Octokit instance
const createAuthenticatedOctokit = async () => {
  const auth = createGitHubAppAuth();
  const { token } = await auth({ type: 'installation' });
  
  return new Octokit({
    auth: token,
  });
};

// Fetch pull request diff
export async function fetchPullRequestDiff(
  owner: string,
  repo: string,
  pullNumber: number
): Promise<string> {
  try {
    const octokit = await createAuthenticatedOctokit();
    
    const { data: pullRequest } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
      mediaType: {
        format: 'diff',
      },
    });

    return pullRequest as unknown as string;
  } catch (error) {
    console.error('Error fetching PR diff:', error);
    throw new Error(`Failed to fetch diff for PR #${pullNumber} in ${owner}/${repo}`);
  }
}

// Fetch pull request details
export async function fetchPullRequestDetails(
  owner: string,
  repo: string,
  pullNumber: number
) {
  try {
    const octokit = await createAuthenticatedOctokit();
    
    const { data: pullRequest } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    return pullRequest;
  } catch (error) {
    console.error('Error fetching PR details:', error);
    throw new Error(`Failed to fetch details for PR #${pullNumber} in ${owner}/${repo}`);
  }
}

// Post comment to pull request
export async function postPullRequestComment(
  owner: string,
  repo: string,
  pullNumber: number,
  comment: string
): Promise<void> {
  try {
    const octokit = await createAuthenticatedOctokit();
    
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body: comment,
    });

    console.log(`Comment posted to PR #${pullNumber} in ${owner}/${repo}`);
  } catch (error) {
    console.error('Error posting comment:', error);
    throw new Error(`Failed to post comment to PR #${pullNumber} in ${owner}/${repo}`);
  }
}

// Get repository information
export async function getRepositoryInfo(owner: string, repo: string) {
  try {
    const octokit = await createAuthenticatedOctokit();
    
    const { data: repository } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    return repository;
  } catch (error) {
    console.error('Error fetching repository info:', error);
    throw new Error(`Failed to fetch repository info for ${owner}/${repo}`);
  }
}

// List repositories for the authenticated user
export async function listUserRepositories() {
  try {
    const octokit = await createAuthenticatedOctokit();
    
    const { data: repositories } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
    });

    return repositories;
  } catch (error) {
    console.error('Error listing repositories:', error);
    throw new Error('Failed to list user repositories');
  }
}
