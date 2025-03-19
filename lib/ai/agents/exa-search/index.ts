import { tool } from 'ai';
import { z } from 'zod';
import { BaseAgent } from '../base';
import type {
  SearchResponse,
  AnswerResponse,
  SearchAndAnswerResponse,
} from './types';

export const exaSearchAgentTools = {
  search: {
    name: 'exa_web_search',
    description: 'Search for webpages related to a query using Exa',
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
    description: "Get a direct answer to a question using Exa's answer API",
    parameters: z
      .object({
        question: z.string().describe('The question to answer'),
      })
      .required(),
  },
  searchAndAnswer: {
    name: 'exa_search_and_answer',
    description:
      'Perform both search and answer operations for a query using Exa',
    parameters: z
      .object({
        topic: z.string().describe('The topic to search for and answer'),
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

  searchAndAnswer = () =>
    tool({
      ...exaSearchAgentTools.searchAndAnswer,
      execute: async ({ topic }) => {
        return this.makeRequest<SearchAndAnswerResponse>(
          'exa_search_and_answer',
          {
            topic,
          },
        );
      },
    });
}
