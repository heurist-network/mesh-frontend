import { tool } from 'ai';
import { z } from 'zod';
import { BaseAgent } from '../base';
import type { OnchainDataResponse } from './types';

export const carvOnchainDataAgentTools = {
  queryOnchainData: {
    name: 'query_onchain_data',
    description:
      'Query blockchain data from Ethereum, Base, Bitcoin, or Solana with natural language using Carv API. Access detailed metrics including: block data (timestamps, hash, miner, gas used/limit), transaction details (hash, from/to addresses, values, gas prices), and network utilization statistics. Can calculate aggregate statistics like daily transaction counts, average gas prices, top wallet activities, and blockchain growth trends.',
    parameters: z
      .object({
        blockchain: z
          .string()
          .describe(
            'The blockchain to query (ethereum, base, bitcoin, solana). Only these four blockchains are supported.',
          ),
        query: z
          .string()
          .describe(
            'A natural language query describing the blockchain metrics request.',
          ),
      })
      .required(),
  },
} as const;

export class CarvOnchainDataAgent extends BaseAgent {
  queryOnchainData = () =>
    tool({
      ...carvOnchainDataAgentTools.queryOnchainData,
      execute: async ({ blockchain, query }) => {
        return this.makeRequest<OnchainDataResponse>('query_onchain_data', {
          blockchain,
          query,
        });
      },
    });
}
