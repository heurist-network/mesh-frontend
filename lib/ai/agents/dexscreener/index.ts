import { tool } from 'ai';
import { z } from 'zod';
import { BaseAgent } from '../base';
import type {
  SearchPairsResponse,
  SpecificPairResponse,
  TokenPairsResponse,
  TokenProfilesResponse,
} from './types';

export const dexScreenerAgentTools = {
  searchPairs: {
    name: 'search_pairs',
    description:
      'Search for trading pairs by token name, symbol, or address on DexScreener',
    parameters: z
      .object({
        query: z
          .string()
          .describe('Search query (token name, symbol, or address)'),
      })
      .required(),
  },
  getSpecificPairInfo: {
    name: 'get_specific_pair_info',
    description: 'Get pair info by chain and pair address on DexScreener',
    parameters: z
      .object({
        chain: z
          .string()
          .describe('Chain identifier (e.g., solana, bsc, ethereum)'),
        pair_address: z
          .string()
          .describe('The pair contract address to look up'),
      })
      .required(),
  },
  getTokenPairs: {
    name: 'get_token_pairs',
    description:
      'Get the trading pairs by chain and token address on DexScreener',
    parameters: z
      .object({
        chain: z
          .string()
          .describe('Chain identifier (e.g., solana, bsc, ethereum)'),
        token_address: z
          .string()
          .describe('The token contract address to look up all pairs for'),
      })
      .required(),
  },
  getTokenProfiles: {
    name: 'get_token_profiles',
    description: 'Get the latest token profiles from DexScreener',
    parameters: z.object({}).required(),
  },
} as const;

export class DexScreenerAgent extends BaseAgent {
  searchPairs = () =>
    tool({
      ...dexScreenerAgentTools.searchPairs,
      execute: async ({ query }) => {
        return this.makeRequest<SearchPairsResponse>('search_pairs', { query });
      },
    });

  getSpecificPairInfo = () =>
    tool({
      ...dexScreenerAgentTools.getSpecificPairInfo,
      execute: async ({ chain, pair_address }) => {
        return this.makeRequest<SpecificPairResponse>(
          'get_specific_pair_info',
          {
            chain,
            pair_address,
          },
        );
      },
    });

  getTokenPairs = () =>
    tool({
      ...dexScreenerAgentTools.getTokenPairs,
      execute: async ({ chain, token_address }) => {
        return this.makeRequest<TokenPairsResponse>('get_token_pairs', {
          chain,
          token_address,
        });
      },
    });

  getTokenProfiles = () =>
    tool({
      ...dexScreenerAgentTools.getTokenProfiles,
      execute: async () => {
        return this.makeRequest<TokenProfilesResponse>(
          'get_token_profiles',
          {},
        );
      },
    });
}
