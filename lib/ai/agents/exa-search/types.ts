import type { BaseAgentConfig } from '../base';

export interface ExaSearchAgentConfig extends BaseAgentConfig {
  agentId: 'ExaSearchAgent';
}

export interface SearchResult {
  title: string;
  url: string;
  published_date: string;
  text: string;
}

export interface SearchResponse {
  search_results: SearchResult[];
}

export interface AnswerResponse {
  answer: string;
  sources: string[];
}

export interface SearchAndAnswerResponse {
  search_results: SearchResult[];
  answer: string;
  sources: string[];
}
