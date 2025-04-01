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
import {
  MasaTwitterSearchAgent,
  masaTwitterSearchAgentTools,
} from '../agents/masa';
import {
  AlloraPricePredictionAgent,
  alloraPricePredictionAgentTools,
} from '../agents/allora-price-prediction';

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

export const alloraPricePredictionAgent = new AlloraPricePredictionAgent({
  agentId: 'AlloraPricePredictionAgent',
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
    agentId: 'CoinGeckoTokenInfoAgent',
  },
  getTrendingCoins: {
    ...coinGeckoAgentTools.getTrendingCoins,
    category: 'agent' as const,
    toolFn: coinGeckoAgent.getTrendingCoins,
    agentId: 'CoinGeckoTokenInfoAgent',
  },

  // bitquery solana agent
  getTokenTradingInfo: {
    ...bitquerySolanaAgentTools.getTokenTradingInfo,
    category: 'agent' as const,
    toolFn: bitquerySolanaAgent.getTokenTradingInfo,
    agentId: 'BitquerySolanaTokenInfoAgent',
  },
  getTopTrendingTokens: {
    ...bitquerySolanaAgentTools.getTopTrendingTokens,
    category: 'agent' as const,
    toolFn: bitquerySolanaAgent.getTopTrendingTokens,
    agentId: 'BitquerySolanaTokenInfoAgent',
  },

  // dexscreener agent
  searchPairs: {
    ...dexScreenerAgentTools.searchPairs,
    category: 'agent' as const,
    toolFn: dexScreenerAgent.searchPairs,
    agentId: 'DexScreenerTokenInfoAgent',
  },
  getSpecificPairInfo: {
    ...dexScreenerAgentTools.getSpecificPairInfo,
    category: 'agent' as const,
    toolFn: dexScreenerAgent.getSpecificPairInfo,
    agentId: 'DexScreenerTokenInfoAgent',
  },
  getTokenPairs: {
    ...dexScreenerAgentTools.getTokenPairs,
    category: 'agent' as const,
    toolFn: dexScreenerAgent.getTokenPairs,
    agentId: 'DexScreenerTokenInfoAgent',
  },
  getTokenProfiles: {
    ...dexScreenerAgentTools.getTokenProfiles,
    category: 'agent' as const,
    toolFn: dexScreenerAgent.getTokenProfiles,
    agentId: 'DexScreenerTokenInfoAgent',
  },

  // exa search agent
  search: {
    ...exaSearchAgentTools.search,
    category: 'agent' as const,
    toolFn: exaSearchAgent.search,
    agentId: 'ExaSearchAgent',
  },
  answer: {
    ...exaSearchAgentTools.answer,
    category: 'agent' as const,
    toolFn: exaSearchAgent.answer,
    agentId: 'ExaSearchAgent',
  },

  // masa search agent
  searchTwitter: {
    ...masaTwitterSearchAgentTools.twitterSearch,
    category: 'agent' as const,
    toolFn: masaTwitterSearchAgent.twitterSearch,
    agentId: 'MasaTwitterSearchAgent',
  },

  // allora price prediction agent
  getAlloraPrediction: {
    ...alloraPricePredictionAgentTools.getAlloraPrediction,
    category: 'agent' as const,
    toolFn: alloraPricePredictionAgent.getAlloraPrediction,
    agentId: 'AlloraPricePredictionAgent',
  },
} satisfies Record<string, ToolConfig>;

export const tools = {
  ...baseTools,
  ...agentTools,
} satisfies Record<string, ToolConfig>;
