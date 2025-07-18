import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export interface Comment {
  id: string;
  text: string;
  authorName: string;
  publishedAt: string;
  likeCount: number;
  replyCount: number;
}

export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

export async function getVideoInfo(videoId: string): Promise<VideoInfo | null> {
  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'statistics'],
      id: [videoId],
    });

    const video = response.data.items?.[0];
    if (!video) return null;

    return {
      id: videoId,
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      publishedAt: video.snippet?.publishedAt || '',
      viewCount: video.statistics?.viewCount || '0',
      likeCount: video.statistics?.likeCount || '0',
      commentCount: video.statistics?.commentCount || '0',
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    return null;
  }
}

export async function getComments(videoId: string, maxResults: number = 100): Promise<Comment[]> {
  try {
    const comments: Comment[] = [];
    let nextPageToken: string | undefined;

    while (comments.length < maxResults) {
      const response = await youtube.commentThreads.list({
        part: ['snippet'],
        videoId,
        maxResults: Math.min(100, maxResults - comments.length),
        order: 'relevance',
        pageToken: nextPageToken,
      });

      const items = response.data.items || [];
      
      for (const item of items) {
        const comment = item.snippet?.topLevelComment?.snippet;
        if (comment) {
          comments.push({
            id: item.id || '',
            text: comment.textDisplay || '',
            authorName: comment.authorDisplayName || '',
            publishedAt: comment.publishedAt || '',
            likeCount: comment.likeCount || 0,
            replyCount: item.snippet?.totalReplyCount || 0,
          });
        }
      }

      nextPageToken = response.data.nextPageToken || undefined;
      if (!nextPageToken) break;
    }

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}