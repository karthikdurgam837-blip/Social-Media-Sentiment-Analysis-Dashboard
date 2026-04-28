/**
 * Types for Social Sentiment Insight Dashboard
 */

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'youtube' | 'facebook' | 'instagram' | 'tiktok';
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  shares: number;
}

export interface AnalyzedPost extends SocialPost {
  sentiment: Sentiment;
  confidence: number;
  keywords: string[];
  explanation: string;
}

export interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

export interface PlatformStat {
  name: string;
  count: number;
  color: string;
}

export interface VolumeData {
  time: string;
  mentions: number;
}
