import { tool } from 'ai';
import { z } from 'zod';
import { BaseAgent } from '../base';
import type { TokenTradingResponse, TrendingTokensResponse } from './types';

export const bitquerySolanaAgentTools = {
  getTokenTradingInfo: {
    name: 'get_token_trading_info',
    description:
      'Get detailed token trading information using Solana mint address',
    parameters: z
      .object({
        token_address: z.string().describe('The Solana token mint address'),
      })
      .required(),
  },
  getTopTrendingTokens: {
    name: 'get_top_trending_tokens',
    description: 'Get the current top trending tokens on Solana',
    parameters: z.object({}).required(),
  },
} as const;

export class BitquerySolanaAgent extends BaseAgent {
  getTokenTradingInfo = () =>
    tool({
      ...bitquerySolanaAgentTools.getTokenTradingInfo,
      execute: async ({ token_address }) => {
        return this.makeRequest<TokenTradingResponse>(
          'get_token_trading_info',
          { token_address },
        );
      },
    });

  getTopTrendingTokens = () =>
    tool({
      ...bitquerySolanaAgentTools.getTopTrendingTokens,
      execute: async () => {
        return this.makeRequest<TrendingTokensResponse>(
          'get_top_trending_tokens',
          {},
        );
      },
    });
}
