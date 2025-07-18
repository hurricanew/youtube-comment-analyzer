# YouTube Comment Analyzer

A powerful tool that transforms YouTube comments into actionable video ideas for content creators.

## Features

- **Comment Extraction**: Fetches up to 200 comments from any YouTube video
- **AI Analysis**: Uses DeepSeek R2 to analyze sentiment, themes, and patterns
- **Actionable Insights**: Generates specific video ideas based on audience feedback
- **Clean Interface**: Simple input, comprehensive tabbed results
- **Export Functionality**: Copy video ideas or export full analysis as JSON
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## What You'll Get

- **Overview**: Comment sentiment, engagement level, and summary stats
- **Themes**: Common topics with sentiment analysis and example comments
- **FAQ**: Frequently asked questions from your audience
- **Pain Points**: Issues viewers are experiencing (with severity levels)
- **Video Ideas**: Specific, actionable video suggestions with interest estimates

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` with your API keys:
   ```
   YOUTUBE_API_KEY=your_youtube_api_key_here
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```
4. Run the development server: `npm run dev`

## Getting API Keys

- **YouTube API**: Visit [Google Cloud Console](https://console.cloud.google.com/), enable YouTube Data API v3
- **DeepSeek API**: Sign up at [DeepSeek](https://api.deepseek.com/) and create an API key

## Usage

1. Paste any YouTube video URL into the input field
2. Click "Analyze Comments" 
3. Wait for the AI to process the comments (usually 30-60 seconds)
4. Browse results in the tabbed interface
5. Copy video ideas or export full analysis

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **APIs**: YouTube Data API v3, DeepSeek R2
- **Deployment**: Vercel-ready

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## License

MIT License - feel free to use this for your own projects!
