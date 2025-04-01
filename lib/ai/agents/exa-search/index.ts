import { tool } from 'ai';
import { z } from 'zod';
import { BaseAgent } from '../base';
import type { SearchResponse, AnswerResponse } from './types';

export const exaSearchAgentTools = {
  search: {
    name: 'exa_web_search',
    description:
      'Search for webpages related to a query. Returns a list of results including titles, snippets, and URLs using Exa.',
    parameters: z
      .object({
        search_term: z.string().describe('The search term'),
        limit: z
          .number()
          .optional()
          .describe('Maximum number of results to return (default: 10)'),
      })
      .required(),
  },
  answer: {
    name: 'exa_answer_question',
    description:
      "Get a direct, concise, factual answer to a specific question using Exa's answer API.",
    parameters: z
      .object({
        question: z.string().describe('The question to answer'),
      })
      .required(),
  },
} as const;

export class ExaSearchAgent extends BaseAgent {
  search = () =>
    tool({
      ...exaSearchAgentTools.search,
      execute: async ({ search_term, limit }) => {
        return this.makeRequest<SearchResponse>('exa_web_search', {
          search_term,
          limit,
        });
      },
    });

  answer = () =>
    tool({
      ...exaSearchAgentTools.answer,
      execute: async ({ question }) => {
        return this.makeRequest<AnswerResponse>('exa_answer_question', {
          question,
        });
      },
    });
}
