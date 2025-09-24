import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { analyzeCodeWithAI } from '@/lib/ai';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { owner, repo } = await request.json();
    const token = request.cookies.get('github_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!owner || !repo) {
      return NextResponse.json({ error: 'Owner and repo are required' }, { status: 400 });
    }

    const octokit = new Octokit({
      auth: token,
    });

    // Get repository information
    const { data: repository } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    // Get the main branch content (first 10 files)
    const { data: tree } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: repository.default_branch,
      recursive: 'true',
    });

    // Filter for code files and limit to first 10
    const codeFiles = tree.tree
      .filter(item => 
        item.type === 'blob' && 
        item.path && 
        /\.(js|ts|jsx|tsx|py|java|cpp|c|cs|php|rb|go|rs|swift|kt)$/i.test(item.path)
      )
      .slice(0, 10);

    // Fetch content for each file
    const fileContents = await Promise.all(
      codeFiles.map(async (file) => {
        try {
          const { data: content } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: file.path!,
          });

          if ('content' in content) {
            const fileContent = Buffer.from(content.content, 'base64').toString('utf-8');
            return {
              path: file.path,
              content: fileContent,
              size: fileContent.length,
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching file ${file.path}:`, error);
          return null;
        }
      })
    );

    // Filter out null results and create diff-like content
    const validFiles = fileContents.filter(file => file !== null);
    
    if (validFiles.length === 0) {
      return NextResponse.json({
        repository: {
          name: repository.name,
          fullName: repository.full_name,
          description: repository.description,
          language: repository.language,
          stars: repository.stargazers_count,
          forks: repository.forks_count,
        },
        analysis: {
          summary: 'No code files found to analyze.',
          score: 0,
          issues: [],
          suggestions: ['This repository appears to be empty or contains no code files.'],
          positiveAspects: [],
        },
        files: [],
      });
    }

    // Create a diff-like content for AI analysis
    const diffContent = validFiles.map(file => 
      `File: ${file!.path}\n${'='.repeat(50)}\n${file!.content}\n\n`
    ).join('');

    // Analyze the code with AI
    const aiAnalysis = await analyzeCodeWithAI(diffContent, {
      title: `Repository Analysis: ${repository.name}`,
      description: repository.description || 'Repository code analysis',
      author: repository.owner.login,
      baseBranch: repository.default_branch,
      headBranch: repository.default_branch,
    });

    return NextResponse.json({
      repository: {
        name: repository.name,
        fullName: repository.full_name,
        description: repository.description,
        language: repository.language,
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        defaultBranch: repository.default_branch,
        updatedAt: repository.updated_at,
      },
      analysis: aiAnalysis || {
        summary: 'Analysis completed but no detailed results available.',
        score: 5,
        issues: [],
        suggestions: ['Code analysis completed successfully.'],
        positiveAspects: [],
      },
      files: validFiles.map(file => ({
        path: file!.path,
        size: file!.size,
        preview: file!.content.substring(0, 200) + (file!.content.length > 200 ? '...' : ''),
      })),
    });

  } catch (error) {
    console.error('Error analyzing repository:', error);
    return NextResponse.json(
      { error: 'Failed to analyze repository' },
      { status: 500 }
    );
  }
}
