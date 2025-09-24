# Local Development Environment Setup Script
# Run this script to set up environment variables for local development

Write-Host "Setting up environment variables for local development..." -ForegroundColor Green

# Set environment variables (replace with your actual values)
$env:GITHUB_CLIENT_ID = "your_github_client_id_here"
$env:GITHUB_CLIENT_SECRET = "your_github_client_secret_here"
$env:GITHUB_WEBHOOK_SECRET = "your_webhook_secret_here"
$env:NEXTAUTH_URL = "http://localhost:3000"
$env:NEXTAUTH_SECRET = "your_nextauth_secret_here"
$env:GROQ_API_KEY = "your_groq_api_key_here"

Write-Host "Environment variables set successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Available endpoints:" -ForegroundColor Yellow
Write-Host "- Main app: http://localhost:3000" -ForegroundColor White
Write-Host "- Test page: http://localhost:3000/test" -ForegroundColor White
Write-Host "- Groq test: http://localhost:3000/test/groq" -ForegroundColor White
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Green

# Start the development server
npm run dev