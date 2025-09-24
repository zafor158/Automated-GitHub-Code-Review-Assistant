# 🤖 Automated GitHub Code Review Assistant

An AI-powered tool that automatically reviews GitHub pull requests using the Groq API. When a new pull request is opened, the system fetches the code changes, analyzes them with AI, and posts detailed feedback as comments.

## ✨ Features

- **🔍 AI-Powered Analysis**: Uses Groq's `openai/gpt-oss-20b` model for intelligent code review
- **⚡ Real-time Reviews**: Automatic webhook-triggered reviews on pull request creation
- **🎯 Comprehensive Feedback**: Analyzes bugs, security issues, code quality, and best practices
- **🔐 GitHub OAuth**: Secure authentication with GitHub accounts
- **📱 Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **🚀 Serverless**: Deployed on Vercel with serverless functions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Groq API with `openai/gpt-oss-20b` model
- **Authentication**: GitHub OAuth2
- **Deployment**: Vercel
- **APIs**: GitHub API, Groq API

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- GitHub account
- Groq API key
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/zafor158/Automated-GitHub-Code-Review-Assistant.git
   cd Automated-GitHub-Code-Review-Assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your `.env.local`:
   ```env
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_WEBHOOK_SECRET=your_webhook_secret
   GROQ_API_KEY=your_groq_api_key
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🌐 Production Deployment

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy!

## 🔧 Configuration

### GitHub OAuth App Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App with:
   - **Application name**: Automated GitHub Code Review Assistant
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-app.vercel.app/api/auth/github`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | ✅ |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | ✅ |
| `GITHUB_WEBHOOK_SECRET` | Random secret for webhook verification | ✅ |
| `GROQ_API_KEY` | Your Groq API key | ✅ |
| `NEXTAUTH_URL` | Your deployment URL | ✅ |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | ✅ |

## 📖 How It Works

1. **User Authentication**: Users log in via GitHub OAuth
2. **Repository Selection**: Users connect repositories for automated reviews
3. **Webhook Setup**: System creates GitHub webhooks for pull request events
4. **AI Analysis**: When a PR is opened, the system:
   - Fetches the pull request diff
   - Sends code to Groq API for analysis
   - Posts AI feedback as a comment

## 🎯 AI Code Review Features

The AI analyzes code for:

- **🐛 Bug Detection**: Logic errors, edge cases, potential runtime issues
- **🔒 Security Issues**: Vulnerabilities, unsafe practices, data exposure
- **⚡ Performance**: Inefficient algorithms, memory leaks, unnecessary operations
- **📝 Code Quality**: Formatting, naming conventions, consistency
- **🔧 Maintainability**: Complexity, documentation, testability
- **💡 Best Practices**: Industry standards and recommendations

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/github/          # GitHub OAuth handlers
│   │   ├── repositories/          # Repository management
│   │   ├── test/groq/            # Groq API testing
│   │   └── webhook/github/       # GitHub webhook handler
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main dashboard
├── components/
│   ├── AuthButton.tsx            # GitHub login button
│   ├── LoadingSpinner.tsx       # Loading component
│   └── RepositoryList.tsx       # Repository management
├── lib/
│   ├── ai.ts                     # Groq API integration
│   ├── crypto.ts                 # Webhook signature verification
│   ├── github.ts                 # GitHub API functions
│   └── github-oauth.ts          # GitHub OAuth functions
└── vercel.json                   # Vercel configuration
```

## 🔄 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/github/authorize` | GET | Initiate GitHub OAuth |
| `/api/auth/github` | GET | Handle OAuth callback |
| `/api/repositories` | GET | Fetch user repositories |
| `/api/webhook/setup` | POST/DELETE | Setup/remove webhooks |
| `/api/webhook/github` | POST | Handle GitHub webhooks |
| `/api/test/groq` | POST | Test Groq API integration |

## 🧪 Testing

### Test AI Integration

Visit `/test/groq` to test the Groq API integration with sample code.

### Test Webhook (Production Only)

1. Create a test pull request in a connected repository
2. Check the webhook delivery logs in GitHub
3. Verify AI comment appears on the PR

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for providing the AI API
- [GitHub](https://github.com/) for the platform and APIs
- [Vercel](https://vercel.com/) for hosting and deployment
- [Next.js](https://nextjs.org/) for the framework

## 📞 Support

If you encounter any issues:

1. Check the [deployment guide](./VERCEL_DEPLOYMENT.md)
2. Review environment variable configuration
3. Check GitHub webhook delivery logs
4. Verify Groq API key and usage limits

## 🚀 Live Demo

Once deployed, your Automated GitHub Code Review Assistant will be available at your Vercel URL, ready to provide intelligent code reviews for your repositories!

---

**Built with ❤️ by [Md.Abu Zafor](https://github.com/zafor158)**