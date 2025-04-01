import type { BaseAgentConfig } from '../base';

export interface ZerionWalletAnalysisAgentConfig extends BaseAgentConfig {
  agentId: 'ZerionWalletAnalysisAgent';
}

export interface Token {
  name: string;
  symbol: string;
  quantity: number;
  value: number;
  price: number;
  change_24h_percent: number;
  chain: string;
  token_address: string | null;
}

export interface TokenData {
  total_value: number;
  token_count: number;
  tokens: Token[];
}

export interface NftCollection {
  name: string;
  description: string;
  nfts_count: number;
  floor_price: number;
  chains: string[];
}

export interface NftData {
  total_collections: number;
  total_nfts: number;
  total_floor_price: number;
  collections: NftCollection[];
}

export interface ZerionWalletAnalysisResponse {
  response: string;
  data: TokenData | NftData;
}
