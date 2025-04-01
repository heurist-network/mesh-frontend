import { tool } from 'ai';
import { z } from 'zod';
import { BaseAgent } from '../base';
import type { TwitterSearchResponse } from './types';

export const masaTwitterSearchAgentTools = {
  twitterSearch: {
    name: 'search_twitter',
    description:
      'Search on Twitter to identify what people are saying about a topic. The search term must be a single word or a short phrase, or an account name or hashtag.',
    parameters: z
      .object({
        search_term: z.string().describe('The search term to find tweets'),
        max_results: z
          .number()
          .optional()
          .describe('Maximum number of results to return (default: 25)'),
      })
      .required(),
  },
} as const;

export class MasaTwitterSearchAgent extends BaseAgent {
  twitterSearch = () =>
    tool({
      ...masaTwitterSearchAgentTools.twitterSearch,
      execute: async ({ search_term, max_results }) => {
        return this.makeRequest<TwitterSearchResponse>('search_twitter', {
          search_term,
          max_results,
        });
      },
    });
}
