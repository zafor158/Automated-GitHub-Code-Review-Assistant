import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('github_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const octokit = new Octokit({
      auth: token,
    });

    // Get user information
    const { data: user } = await octokit.rest.users.getAuthenticated();

    return NextResponse.json({
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
