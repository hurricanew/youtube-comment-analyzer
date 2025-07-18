# Deployment Guide

## GitHub Actions + Render.com Setup

### 1. Render.com Setup

1. **Create Render Account**: Sign up at [render.com](https://render.com)
2. **Create New Web Service**: 
   - Connect your GitHub repository: `hurricanew/youtube-comment-analyzer`
   - Choose "Web Service"
   - Runtime: Node
   - Build Command: `npm run build`
   - Start Command: `npm start`

### 2. Environment Variables in Render

Set these environment variables in your Render service:

```
DEEPSEEK_API_KEY=your_deepseek_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
NODE_ENV=production
```

### 3. GitHub Secrets Setup

Add these secrets to your GitHub repository:

1. Go to: `Settings > Secrets and variables > Actions`
2. Add these repository secrets:

```
RENDER_SERVICE_ID=your_render_service_id
RENDER_API_KEY=your_render_api_key
```

**To get these values:**
- **RENDER_SERVICE_ID**: Found in your Render service URL (srv-xxxxx)
- **RENDER_API_KEY**: Generate in Render Dashboard > Account Settings > API Keys

### 4. Deployment Flow

1. **Automatic**: Push to `main` branch triggers deployment
2. **Manual**: GitHub Actions runs tests, builds, and deploys
3. **Verification**: Check deployment status in Render dashboard

### 5. API Keys Required

- **DeepSeek API**: Get from [api.deepseek.com](https://api.deepseek.com)
- **YouTube API**: Get from [Google Cloud Console](https://console.cloud.google.com) (YouTube Data API v3)

### 6. Troubleshooting

- Check GitHub Actions logs for build errors
- Verify environment variables are set in Render
- Ensure API keys are valid and have proper permissions
- Check Render service logs for runtime errors