# GitHub OAuth App Setup Script for zafor158
# This script helps you create the necessary GitHub OAuth App

Write-Host "=== GitHub OAuth App Setup for @zafor158 ===" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Create GitHub OAuth App" -ForegroundColor Yellow
Write-Host "1. Go to: https://github.com/settings/developers" -ForegroundColor White
Write-Host "2. Click 'New OAuth App'" -ForegroundColor White
Write-Host "3. Fill in the following details:" -ForegroundColor White
Write-Host ""
Write-Host "   Application name: Code Review Assistant - zafor158" -ForegroundColor Cyan
Write-Host "   Homepage URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Authorization callback URL: http://localhost:3000/api/auth/github" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 2: Copy Credentials" -ForegroundColor Yellow
Write-Host "After creating the app, copy:" -ForegroundColor White
Write-Host "- Client ID" -ForegroundColor Cyan
Write-Host "- Client Secret" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 3: Set Environment Variables" -ForegroundColor Yellow
Write-Host "Run the following commands with your actual credentials:" -ForegroundColor White
Write-Host ""
Write-Host '$env:GITHUB_CLIENT_ID="your_actual_client_id"' -ForegroundColor Green
Write-Host '$env:GITHUB_CLIENT_SECRET="your_actual_client_secret"' -ForegroundColor Green
Write-Host '$env:GITHUB_WEBHOOK_SECRET="random_webhook_secret"' -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Test Connection" -ForegroundColor Yellow
Write-Host "Visit: http://localhost:3000/setup" -ForegroundColor White
Write-Host ""

Write-Host "Your GitHub Profile Info:" -ForegroundColor Yellow
Write-Host "- Username: @zafor158" -ForegroundColor Cyan
Write-Host "- Repositories: 54" -ForegroundColor Cyan
Write-Host "- Expertise: AI/ML, Deep Learning, NLP, Big Data" -ForegroundColor Cyan
Write-Host "- Current Role: AI Engineer at Mondaysys" -ForegroundColor Cyan
Write-Host ""

Write-Host "Ready to connect! Press any key to continue..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
