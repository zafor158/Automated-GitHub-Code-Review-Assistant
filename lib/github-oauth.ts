import { Octokit } from '@octokit/rest';

// OAuth-based GitHub client for user operations
export function createOAuthOctokit(accessToken: string) {
  return new Octokit({
    auth: accessToken,
  });
}

// Fetch pull request diff using OAuth token
export async function fetchPullRequestDiffOAuth(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<string> {
  try {
    const octokit = createOAuthOctokit(accessToken);
    
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
    console.error('Error fetching PR diff with OAuth:', error);
    throw new Error(`Failed to fetch diff for PR #${pullNumber} in ${owner}/${repo}`);
  }
}

// Post comment to pull request using OAuth token
export async function postPullRequestCommentOAuth(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number,
  comment: string
): Promise<void> {
  try {
    const octokit = createOAuthOctokit(accessToken);
    
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body: comment,
    });

    console.log(`Comment posted to PR #${pullNumber} in ${owner}/${repo}`);
  } catch (error) {
    console.error('Error posting comment with OAuth:', error);
    throw new Error(`Failed to post comment to PR #${pullNumber} in ${owner}/${repo}`);
  }
}
