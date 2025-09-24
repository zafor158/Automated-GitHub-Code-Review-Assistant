import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectUri = searchParams.get('redirect_uri') || `${process.env.NEXTAUTH_URL}/api/auth/github`;

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', process.env.GITHUB_CLIENT_ID!);
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
  githubAuthUrl.searchParams.set('scope', 'repo,user:email');
  githubAuthUrl.searchParams.set('state', 'random_state_string'); // In production, use a proper state parameter

  return NextResponse.redirect(githubAuthUrl.toString());
}
