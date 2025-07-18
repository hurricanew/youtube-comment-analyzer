import { deepseek } from '@ai-sdk/deepseek';
import { generateObject } from 'ai';
import { z } from 'zod';
import { Comment } from './youtube';
import OpenAI from 'openai';

// Configure DeepSeek with API key

// Fallback OpenAI client for DeepSeek
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export interface AnalysisResult {
  summary: {
    totalComments: number;
    averageSentiment: string;
    engagementLevel: string;
  };
  themes: {
    name: string;
    frequency: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    exampleComments: string[];
  }[];
  questions: {
    question: string;
    frequency: number;
    examples: string[];
  }[];
  painPoints: {
    issue: string;
    severity: 'high' | 'medium' | 'low';
    frequency: number;
    examples: string[];
  }[];
  contentRequests: {
    topic: string;
    demand: number;
    examples: string[];
  }[];
  misconceptions: {
    misconception: string;
    clarification: string;
    examples: string[];
  }[];
  videoIdeas: {
    title: string;
    description: string;
    type: 'FAQ' | 'Tutorial' | 'Deep Dive' | 'Problem Solving' | 'Explanation';
    estimatedInterest: 'high' | 'medium' | 'low';
    reasoning: string;
  }[];
}

const analysisResultSchema = z.object({
  summary: z.object({
    totalComments: z.number(),
    averageSentiment: z.enum(['positive', 'negative', 'neutral', 'mixed']),
    engagementLevel: z.enum(['high', 'medium', 'low']),
  }),
  themes: z.array(z.object({
    name: z.string(),
    frequency: z.number(),
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    exampleComments: z.array(z.string()),
  })),
  questions: z.array(z.object({
    question: z.string(),
    frequency: z.number(),
    examples: z.array(z.string()),
  })),
  painPoints: z.array(z.object({
    issue: z.string(),
    severity: z.enum(['high', 'medium', 'low']),
    frequency: z.number(),
    examples: z.array(z.string()),
  })),
  contentRequests: z.array(z.object({
    topic: z.string(),
    demand: z.number(),
    examples: z.array(z.string()),
  })),
  misconceptions: z.array(z.object({
    misconception: z.string(),
    clarification: z.string(),
    examples: z.array(z.string()),
  })),
  videoIdeas: z.array(z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['FAQ', 'Tutorial', 'Deep Dive', 'Problem Solving', 'Explanation']),
    estimatedInterest: z.enum(['high', 'medium', 'low']),
    reasoning: z.string(),
  })),
});

export async function analyzeComments(comments: Comment[]): Promise<AnalysisResult> {
  const commentTexts = comments.map(c => c.text).join('\n---\n');

  console.log('Starting comment analysis with', comments.length, 'comments');
  console.log('DeepSeek API Key present:', !!process.env.DEEPSEEK_API_KEY);

  try {
    // Use OpenAI SDK with DeepSeek endpoint for better reliability
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content strategist who analyzes YouTube comments to help creators understand their audience and generate video ideas. Always respond with valid JSON only - no markdown formatting, no code blocks, no extra text.',
        },
        {
          role: 'user',
          content: `
Analyze the following YouTube comments and provide a comprehensive analysis. Focus on actionable insights for content creators. Identify patterns, emotions, and opportunities for follow-up content.

Comments to analyze:
${commentTexts}

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, no extra text):
{
  "summary": {
    "totalComments": ${comments.length},
    "averageSentiment": "positive/negative/neutral/mixed",
    "engagementLevel": "high/medium/low"
  },
  "themes": [
    {
      "name": "theme name",
      "frequency": number,
      "sentiment": "positive/negative/neutral",
      "exampleComments": ["comment1", "comment2"]
    }
  ],
  "questions": [
    {
      "question": "frequently asked question",
      "frequency": number,
      "examples": ["example comment"]
    }
  ],
  "painPoints": [
    {
      "issue": "pain point description",
      "severity": "high/medium/low",
      "frequency": number,
      "examples": ["example comment"]
    }
  ],
  "contentRequests": [
    {
      "topic": "requested topic",
      "demand": number,
      "examples": ["example comment"]
    }
  ],
  "misconceptions": [
    {
      "misconception": "common misconception",
      "clarification": "what should be clarified",
      "examples": ["example comment"]
    }
  ],
  "videoIdeas": [
    {
      "title": "Specific video title",
      "description": "Brief description of video content",
      "type": "FAQ/Tutorial/Deep Dive/Problem Solving/Explanation",
      "estimatedInterest": "high/medium/low",
      "reasoning": "Why this video would be valuable"
    }
  ]
}
          `,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from DeepSeek API');
    }

    // Extract JSON from markdown code blocks if present
    let jsonContent = content;
    if (content.includes('```json')) {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }
    } else if (content.includes('```')) {
      const jsonMatch = content.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }
    }

    console.log('Analysis completed successfully');
    return JSON.parse(jsonContent.trim());
  } catch (error) {
    console.error('Error analyzing comments:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
}