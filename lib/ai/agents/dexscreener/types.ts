import type { BaseAgentConfig } from '../base';

export interface DexScreenerAgentConfig extends BaseAgentConfig {
  agentId: 'DexScreenerTokenInfoAgent';
}

export interface TokenPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels?: string[];
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    h24?: number;
    h6?: number;
    h1?: number;
    m5?: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap?: number;
  pairCreatedAt?: number;
  info?: {
    imageUrl?: string;
    header?: string;
    openGraph?: string;
    websites?: {
      label: string;
      url: string;
    }[];
    socials?: {
      type: string;
      url: string;
    }[];
  };
}

export interface SearchPairsResponse {
  status: string;
  data: {
    pairs: TokenPair[];
  };
}

export interface SpecificPairResponse {
  status: string;
  data: {
    pair: TokenPair;
  };
}

export interface TokenPairsResponse {
  status: string;
  data: {
    pairs: TokenPair[];
    dex_url: string;
  };
}

export interface TokenProfile {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon: string;
  header: string;
  openGraph: string;
  description: string;
  links: {
    label?: string;
    type?: string;
    url: string;
  }[];
}

export interface TokenProfilesResponse {
  status: string;
  data: {
    profiles: TokenProfile[];
  };
}
