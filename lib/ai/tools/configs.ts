import { z } from 'zod';
import { weatherParamsSchema, weatherDescription } from './get-weather';
import type { ToolConfig } from './registry/types';
import { CoinGeckoAgent, coinGeckoAgentTools } from '../agents/coin-gecko';
import {
  BitquerySolanaAgent,
  bitquerySolanaAgentTools,
} from '../agents/bitquery-solana';
import { DexScreenerAgent, dexScreenerAgentTools } from '../agents/dexscreener';
import { ExaSearchAgent, exaSearchAgentTools } from '../agents/exa-search';
import { MasaTwitterSearchAgent, masaTwitterSearchAgentTools } from '../agents/masa';

export const coinGeckoAgent = new CoinGeckoAgent({
  agentId: 'CoinGeckoTokenInfoAgent',
});

export const bitquerySolanaAgent = new BitquerySolanaAgent({
  agentId: 'BitquerySolanaTokenInfoAgent',
});

export const dexScreenerAgent = new DexScreenerAgent({
  agentId: 'DexScreenerTokenInfoAgent',
});

export const exaSearchAgent = new ExaSearchAgent({
  agentId: 'ExaSearchAgent',
});

export const masaTwitterSearchAgent = new MasaTwitterSearchAgent({
  agentId: 'MasaTwitterSearchAgent',
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

  // dexscreener agent
  searchPairs: {
    ...dexScreenerAgentTools.searchPairs,
    category: 'agent' as const,
    toolFn: dexScreenerAgent.searchPairs,
  },
  getSpecificPairInfo: {
    ...dexScreenerAgentTools.getSpecificPairInfo,
    category: 'agent' as const,
    toolFn: dexScreenerAgent.getSpecificPairInfo,
  },
  getTokenPairs: {
    ...dexScreenerAgentTools.getTokenPairs,
    category: 'agent' as const,
    toolFn: dexScreenerAgent.getTokenPairs,
  },
  getTokenProfiles: {
    ...dexScreenerAgentTools.getTokenProfiles,
    category: 'agent' as const,
    toolFn: dexScreenerAgent.getTokenProfiles,
  },

  // exa search agent
  search: {
    ...exaSearchAgentTools.search,
    category: 'agent' as const,
    toolFn: exaSearchAgent.search,
  },
  answer: {
    ...exaSearchAgentTools.answer,
    category: 'agent' as const,
    toolFn: exaSearchAgent.answer,
  },

  // masa search agent
  searchTwitter: {
    ...masaTwitterSearchAgentTools.twitterSearch,
    category: 'agent' as const,
    toolFn: masaTwitterSearchAgent.twitterSearch,
  },
} satisfies Record<string, ToolConfig>;

export const tools = {
  ...baseTools,
  ...agentTools,
} satisfies Record<string, ToolConfig>;
