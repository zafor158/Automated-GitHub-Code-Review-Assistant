import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

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

    // Check if we're in production (Vercel deployment)
    // Vercel URLs are publicly accessible, so we can create real webhooks
    const isProduction = process.env.NEXTAUTH_URL?.startsWith('https://') && 
                         !process.env.NEXTAUTH_URL?.includes('localhost');
    
    if (!isProduction) {
      return NextResponse.json({
        message: 'Local development mode - webhook simulation',
        webhook: {
          id: 'local-dev-' + Date.now(),
          url: 'http://localhost:3000/api/webhook/github',
          events: ['pull_request'],
          status: 'simulated',
          instructions: {
            title: 'Local Development Setup',
            steps: [
              '1. Deploy this app to Vercel or another public hosting service',
              '2. Update the webhook URL to your deployed domain',
              '3. Re-run the connection process',
              '4. GitHub webhooks require publicly accessible URLs'
            ]
          }
        },
      });
    }

    const webhookUrl = `${process.env.NEXTAUTH_URL}/api/webhook/github`;
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

    // Check if webhook already exists
    const { data: existingHooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const existingHook = existingHooks.find(hook => hook.config.url === webhookUrl);

    if (existingHook) {
      return NextResponse.json({
        message: 'Webhook already exists',
        webhook: {
          id: existingHook.id,
          url: existingHook.config.url,
          events: existingHook.events,
        },
      });
    }

    // Create new webhook
    const { data: webhook } = await octokit.rest.repos.createWebhook({
      owner,
      repo,
      config: {
        url: webhookUrl,
        content_type: 'json',
        secret: webhookSecret,
      },
      events: ['pull_request'],
      active: true,
    });

    return NextResponse.json({
      message: 'Webhook created successfully',
      webhook: {
        id: webhook.id,
        url: webhook.config.url,
        events: webhook.events,
      },
    });

  } catch (error) {
    console.error('Error setting up webhook:', error);
    return NextResponse.json(
      { error: 'Failed to setup webhook' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { owner, repo, webhookId } = await request.json();
    const token = request.cookies.get('github_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!owner || !repo || !webhookId) {
      return NextResponse.json({ error: 'Owner, repo, and webhookId are required' }, { status: 400 });
    }

    const octokit = new Octokit({
      auth: token,
    });

    await octokit.rest.repos.deleteWebhook({
      owner,
      repo,
      hook_id: webhookId,
    });

    return NextResponse.json({ message: 'Webhook deleted successfully' });

  } catch (error) {
    console.error('Error deleting webhook:', error);
    return NextResponse.json(
      { error: 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}
