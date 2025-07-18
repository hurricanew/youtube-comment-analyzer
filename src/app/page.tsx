'use client';

import { useState } from 'react';
import AnalysisForm from '@/components/AnalysisForm';
import AnalysisResults from '@/components/AnalysisResults';
import { AnalysisResult } from '@/lib/analyzer';
import { VideoInfo } from '@/lib/youtube';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<{
    videoInfo: VideoInfo;
    analysis: AnalysisResult;
    commentCount: number;
  } | null>(null);

  const handleAnalysisComplete = (result: {
    videoInfo: VideoInfo;
    analysis: AnalysisResult;
    commentCount: number;
  }) => {
    setAnalysisResult(result);
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      {!analysisResult ? (
        <AnalysisForm onAnalysisComplete={handleAnalysisComplete} />
      ) : (
        <AnalysisResults
          videoInfo={analysisResult.videoInfo}
          analysis={analysisResult.analysis}
          commentCount={analysisResult.commentCount}
          onReset={handleReset}
        />
      )}
    </main>
  );
}
