import { z } from 'zod';
import { weatherParamsSchema, weatherDescription } from './get-weather';
import type { ToolConfig } from './registry/types';
import { CoinGeckoAgent, coinGeckoAgentTools } from '../agents/coin-gecko';
import {
  BitquerySolanaAgent,
  bitquerySolanaAgentTools,
} from '../agents/bitquery-solana';

export const coinGeckoAgent = new CoinGeckoAgent({
  agentId: 'CoinGeckoTokenInfoAgent',
});

export const bitquerySolanaAgent = new BitquerySolanaAgent({
  agentId: 'BitquerySolanaTokenInfoAgent',
});

// TODO: fetch description and parameters from the tool itself instead of hardcoding
// currently causes issues because of a server-side import chain with the db

const baseTools = {
  createDocument: {
    name: 'createDocument',
    category: 'base' as const,
    description:
      'Create a document for a writing or content creation activities. This tool will call other functions that will generate the contents of the document based on the title and kind.',
    parameters: z.object({
      title: z.string(),
      kind: z.enum(['text', 'code', 'image', 'sheet']),
    }),
  },
  updateDocument: {
    name: 'updateDocument',
    category: 'base' as const,
    description: 'Update a document with the given description.',
    parameters: z.object({
      id: z.string().describe('The ID of the document to update'),
      description: z
        .string()
        .describe('The description of changes that need to be made'),
    }),
  },
  requestSuggestions: {
    name: 'requestSuggestions',
    category: 'base' as const,
    description: 'Request suggestions for a document',
    parameters: z.object({
      documentId: z
        .string()
        .describe('The ID of the document to request edits'),
    }),
  },
} satisfies Record<string, ToolConfig>;

const agentTools = {
  getWeather: {
    name: 'getWeather',
    category: 'agent' as const,
    description: weatherDescription,
    parameters: weatherParamsSchema,
  },

  // coingecko agent
  getTokenInfo: {
    ...coinGeckoAgentTools.getTokenInfo,
    category: 'agent' as const,
    toolFn: coinGeckoAgent.getTokenInfo,
  },
  getTrendingCoins: {
    ...coinGeckoAgentTools.getTrendingCoins,
    category: 'agent' as const,
    toolFn: coinGeckoAgent.getTrendingCoins,
  },

  // bitquery solana agent
  getTokenTradingInfo: {
    ...bitquerySolanaAgentTools.getTokenTradingInfo,
    category: 'agent' as const,
    toolFn: bitquerySolanaAgent.getTokenTradingInfo,
  },
  getTopTrendingTokens: {
    ...bitquerySolanaAgentTools.getTopTrendingTokens,
    category: 'agent' as const,
    toolFn: bitquerySolanaAgent.getTopTrendingTokens,
  },
} satisfies Record<string, ToolConfig>;

export const tools = {
  ...baseTools,
  ...agentTools,
} satisfies Record<string, ToolConfig>;
