# 🚀 Vercel Deployment Guide

## Automated GitHub Code Review Assistant

This guide will help you deploy your Automated GitHub Code Review Assistant to Vercel.

## 📋 Prerequisites

- GitHub account with the repository: `zafor158/Automated-GitHub-Code-Review-Assistant`
- Vercel account (free tier is sufficient)
- GitHub OAuth App credentials
- Groq API key

## 🔧 Environment Variables Setup

### Required Environment Variables

You need to set these in your Vercel dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | `Ov23li02z8N030wx4Fxs` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | `1c9e2492a052d38decd131aa51da8e1a60456b9b` |
| `GITHUB_WEBHOOK_SECRET` | Random secret for webhook verification | `aIZvuktWbBD0Rcel9IIVTKyEfrnWVVRh` |
| `GROQ_API_KEY` | Your Groq API key | `gsk_Esdv77lGcgsFIrCMOAMmWGdyb3FYhqo7q2ICxdQz6LNw` |
| `NEXTAUTH_URL` | Your Vercel deployment URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | `OwUnt11MNK6zRcpWNQ8U6CZ8rL5iOxMQ` |

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Automated GitHub Code Review Assistant"

# Add remote origin
git remote add origin https://github.com/zafor158/Automated-GitHub-Code-Review-Assistant.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import from GitHub**: Select `zafor158/Automated-GitHub-Code-Review-Assistant`
4. **Configure Project**:
   - Framework Preset: `Next.js`
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Set Environment Variables

In Vercel dashboard, go to your project → Settings → Environment Variables:

```
GITHUB_CLIENT_ID = Ov23li02z8N030wx4Fxs
GITHUB_CLIENT_SECRET = 1c9e2492a052d38decd131aa51da8e1a60456b9b
GITHUB_WEBHOOK_SECRET = aIZvuktWbBD0Rcel9IIVTKyEfrnWVVRh
GROQ_API_KEY = gsk_Esdv77lGcgsFIrCMOAMmWGdyb3FYhqo7q2ICxdQz6LNw
NEXTAUTH_URL = https://your-app.vercel.app
NEXTAUTH_SECRET = OwUnt11MNK6zRcpWNQ8U6CZ8rL5iOxMQ
```

### Step 4: Update GitHub OAuth App

1. **Go to GitHub Settings → Developer settings → OAuth Apps**
2. **Edit your OAuth App**
3. **Update Authorization callback URL**:
   ```
   https://your-app.vercel.app/api/auth/github
   ```
4. **Update Homepage URL**:
   ```
   https://your-app.vercel.app
   ```

### Step 5: Deploy

1. **Click "Deploy" in Vercel**
2. **Wait for deployment to complete**
3. **Your app will be available at**: `https://your-app.vercel.app`

## 🔗 Webhook Setup for Production

After deployment, you can set up real webhooks:

1. **Go to your GitHub repository settings**
2. **Navigate to Webhooks**
3. **Add webhook**:
   - Payload URL: `https://your-app.vercel.app/api/webhook/github`
   - Content type: `application/json`
   - Secret: Use the same `GITHUB_WEBHOOK_SECRET`
   - Events: Select "Pull requests"

## ✅ Testing Your Deployment

1. **Visit your Vercel URL**
2. **Test GitHub OAuth login**
3. **Test AI Code Review feature**
4. **Test webhook setup** (if configured)

## 🛠️ Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Check Vercel dashboard → Settings → Environment Variables
   - Ensure all variables are set correctly
   - Redeploy after adding variables

2. **GitHub OAuth Not Working**
   - Verify callback URL in GitHub OAuth App settings
   - Check `NEXTAUTH_URL` environment variable

3. **Groq API Errors**
   - Verify `GROQ_API_KEY` is correct
   - Check Groq API usage limits

4. **Webhook Issues**
   - Ensure webhook URL is publicly accessible
   - Check webhook secret matches environment variable

## 📊 Monitoring

- **Vercel Dashboard**: Monitor deployments and performance
- **GitHub Webhooks**: Check webhook delivery status
- **Groq Console**: Monitor API usage

## 🔄 Updates

To update your deployment:

1. **Make changes locally**
2. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push origin main
   ```
3. **Vercel will automatically redeploy**

## 📞 Support

If you encounter issues:
- Check Vercel deployment logs
- Review GitHub webhook delivery logs
- Verify all environment variables are set correctly

---

**Your Automated GitHub Code Review Assistant is now ready for production! 🎉**
