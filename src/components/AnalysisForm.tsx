'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/lib/analyzer';
import { VideoInfo } from '@/lib/youtube';

interface AnalysisFormProps {
  onAnalysisComplete: (result: {
    videoInfo: VideoInfo;
    analysis: AnalysisResult;
    commentCount: number;
  }) => void;
}

export default function AnalysisForm({ onAnalysisComplete }: AnalysisFormProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setProgress('Extracting video information...');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      setProgress('Analyzing comments with AI...');
      const result = await response.json();
      onAnalysisComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setProgress('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          YouTube Comment Analyzer
        </h1>
        <p className="text-gray-600">
          Transform your YouTube comments into actionable video ideas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Video URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Comments'}
        </button>

        {progress && (
          <div className="text-center text-sm text-gray-600 mt-2">
            {progress}
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm mt-2 p-3 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}