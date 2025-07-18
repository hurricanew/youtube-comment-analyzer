'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/lib/analyzer';
import { VideoInfo } from '@/lib/youtube';

interface AnalysisResultsProps {
  videoInfo: VideoInfo;
  analysis: AnalysisResult;
  commentCount: number;
  onReset: () => void;
}

export default function AnalysisResults({
  videoInfo,
  analysis,
  commentCount,
  onReset,
}: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const exportResults = () => {
    const exportData = {
      videoInfo,
      analysis,
      commentCount,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-analysis-${videoInfo.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyVideoIdeas = () => {
    const ideas = analysis.videoIdeas
      .map(
        (idea, index) =>
          `${index + 1}. ${idea.title}\n   ${idea.description}\n   Interest Level: ${idea.estimatedInterest}\n`
      )
      .join('\n');

    navigator.clipboard.writeText(ideas);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'themes', label: 'Themes' },
    { id: 'questions', label: 'FAQ' },
    { id: 'painpoints', label: 'Pain Points' },
    { id: 'ideas', label: 'Video Ideas' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {videoInfo.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>{parseInt(videoInfo.viewCount).toLocaleString()} views</span>
                <span>{parseInt(videoInfo.likeCount).toLocaleString()} likes</span>
                <span>{commentCount} comments analyzed</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportResults}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Export Results
              </button>
              <button
                onClick={onReset}
                className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                New Analysis
              </button>
            </div>
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Sentiment</h3>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {analysis.summary.averageSentiment}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Engagement</h3>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {analysis.summary.engagementLevel}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Comments</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {analysis.summary.totalComments}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'themes' && (
            <div className="space-y-4">
              {analysis.themes.map((theme, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{theme.name}</h3>
                    <span className="text-sm text-gray-500">
                      {theme.frequency} mentions
                    </span>
                  </div>
                  <div className="mb-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        theme.sentiment === 'positive'
                          ? 'bg-green-100 text-green-800'
                          : theme.sentiment === 'negative'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {theme.sentiment}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {theme.exampleComments.map((comment, i) => (
                      <p key={i} className="mb-1 italic">
                        &ldquo;{comment}&rdquo;
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              {analysis.questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{question.question}</h3>
                    <span className="text-sm text-gray-500">
                      Asked {question.frequency} times
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {question.examples.map((example, i) => (
                      <p key={i} className="mb-1 italic">
                        &ldquo;{example}&rdquo;
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'painpoints' && (
            <div className="space-y-4">
              {analysis.painPoints.map((pain, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{pain.issue}</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          pain.severity === 'high'
                            ? 'bg-red-100 text-red-800'
                            : pain.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {pain.severity}
                      </span>
                      <span className="text-sm text-gray-500">
                        {pain.frequency} mentions
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {pain.examples.map((example, i) => (
                      <p key={i} className="mb-1 italic">
                        &ldquo;{example}&rdquo;
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ideas' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Suggested Video Ideas
                </h3>
                <button
                  onClick={copyVideoIdeas}
                  className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  Copy All Ideas
                </button>
              </div>
              {analysis.videoIdeas.map((idea, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{idea.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {idea.type}
                      </span>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          idea.estimatedInterest === 'high'
                            ? 'bg-green-100 text-green-800'
                            : idea.estimatedInterest === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {idea.estimatedInterest} interest
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{idea.description}</p>
                  <p className="text-sm text-gray-500 italic">{idea.reasoning}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}