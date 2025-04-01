import { tool } from 'ai';
import { z } from 'zod';
import { BaseAgent } from '../base';
import type { ZerionWalletAnalysisResponse } from './types';

export const zerionWalletAnalysisAgentTools = {
  fetchWalletTokens: {
    name: 'fetch_wallet_tokens',
    description:
      'Fetch token holdings of an EVM wallet using Zerion API. The result includes the amount, USD value, 1-day price change, token contract address and the chain of all tokens held by the wallet. Use this tool if you want to know the token portfolio of the wallet.',
    parameters: z
      .object({
        wallet_address: z
          .string()
          .describe(
            'The EVM wallet address to analyze. Must start with 0x and be 42 characters long.',
          ),
      })
      .required(),
  },
  fetchWalletNfts: {
    name: 'fetch_wallet_nfts',
    description:
      'Fetch NFT collections held by an EVM wallet using Zerion API. The result includes the number of NFTs, the collection name and description of the NFTs. Use this tool if you want to know the NFT portfolio of the wallet.',
    parameters: z
      .object({
        wallet_address: z
          .string()
          .describe(
            'The EVM wallet address to analyze. Must start with 0x and be 42 characters long.',
          ),
      })
      .required(),
  },
} as const;

export class ZerionWalletAnalysisAgent extends BaseAgent {
  fetchWalletTokens = () =>
    tool({
      ...zerionWalletAnalysisAgentTools.fetchWalletTokens,
      execute: async ({ wallet_address }) => {
        return this.makeRequest<ZerionWalletAnalysisResponse>(
          'fetch_wallet_tokens',
          {
            wallet_address,
          },
        );
      },
    });

  fetchWalletNfts = () =>
    tool({
      ...zerionWalletAnalysisAgentTools.fetchWalletNfts,
      execute: async ({ wallet_address }) => {
        return this.makeRequest<ZerionWalletAnalysisResponse>(
          'fetch_wallet_nfts',
          {
            wallet_address,
          },
        );
      },
    });
}
