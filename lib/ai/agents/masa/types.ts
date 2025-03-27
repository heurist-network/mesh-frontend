import type { BaseAgentConfig } from '../base';

export interface MasaTwitterSearchAgentConfig extends BaseAgentConfig {
  agentId: 'MasaTwitterSearchAgent';
}

export interface TweetMetrics {
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
}

export interface Tweet {
  text: string;
  created_at: string;
  author: string;
  metrics: TweetMetrics;
}

export interface TwitterSearchResponse {
  tweets: Tweet[];
}
