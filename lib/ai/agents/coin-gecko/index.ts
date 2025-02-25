import { tool } from 'ai';
import { z } from 'zod';
import { BaseAgent } from '../base';
import type { TrendingCoin, CryptoMetrics } from './types';

export const coinGeckoAgentTools = {
  getTokenInfo: {
    name: 'get_token_info',
    description:
      'Get detailed token information and market data using CoinGecko ID.',
    parameters: z
      .object({
        coingecko_id: z.string().describe('The CoinGecko ID of the token'),
      })
      .required(),
  },
  getTrendingCoins: {
    name: 'get_trending_coins',
    description: 'Get the current top trending cryptocurrencies on CoinGecko',
    parameters: z.object({}),
  },
} as const;

export class CoinGeckoAgent extends BaseAgent {
  getTokenInfo = () =>
    tool({
      ...coinGeckoAgentTools.getTokenInfo,
      execute: async ({ coingecko_id }) => {
        const response = await this.makeRequest<CryptoMetrics>(
          'get_token_info',
          { coingecko_id },
        );
        return response;
      },
    });

  getTrendingCoins = () =>
    tool({
      ...coinGeckoAgentTools.getTrendingCoins,
      execute: async () => {
        return this.makeRequest<TrendingCoin[]>('get_trending_coins');
      },
    });
}
