# Environment Variables Setup Instructions

## Required Environment Variables

Set these environment variables in your terminal or `.env.local` file:

```bash
# GitHub OAuth App Credentials
GITHUB_CLIENT_ID="your_github_client_id_here"
GITHUB_CLIENT_SECRET="your_github_client_secret_here"

# Webhook Secret (generate a random string)
GITHUB_WEBHOOK_SECRET="your_random_webhook_secret_here"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_random_nextauth_secret_here"

# Groq API Key (get from https://console.groq.com/)
GROQ_API_KEY="your_groq_api_key_here"
```

## How to Get These Values

### 1. GitHub OAuth App
- Go to GitHub Settings → Developer settings → OAuth Apps
- Create a new OAuth App
- Set Authorization callback URL to: `http://localhost:3000/api/auth/github`

### 2. Groq API Key
- Visit [Groq Console](https://console.groq.com/)
- Sign up/login and generate an API key

### 3. Random Secrets
- Use any random 32+ character string
- You can generate them online or use: `openssl rand -hex 32`

## PowerShell Setup (Windows)

```powershell
# Set environment variables
$env:GITHUB_CLIENT_ID="your_github_client_id_here"
$env:GITHUB_CLIENT_SECRET="your_github_client_secret_here"
$env:GITHUB_WEBHOOK_SECRET="your_random_webhook_secret_here"
$env:NEXTAUTH_URL="http://localhost:3000"
$env:NEXTAUTH_SECRET="your_random_nextauth_secret_here"
$env:GROQ_API_KEY="your_groq_api_key_here"
```