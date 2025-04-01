import type { BaseAgentConfig } from '../base';

export interface BitquerySolanaAgentConfig extends BaseAgentConfig {
  agentId: 'BitquerySolanaTokenInfoAgent';
}

export interface TokenTradingBucket {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TokenTradingSummary {
  current_price: number;
  price_change_1h: number;
  price_change_percentage_1h: number;
  highest_price_1h: number;
  lowest_price_1h: number;
  total_volume_1h: number;
  last_updated: string;
}

export interface TokenTradingInfo {
  summary: TokenTradingSummary;
  detailed_data: TokenTradingBucket[];
}

export interface TrendingTokenCurrency {
  Name: string | null;
  MintAddress: string;
  Symbol: string | null;
}

export interface TrendingTokenPrice {
  start: number;
  min5: number;
  end: number;
}

export interface TrendingTokenDex {
  ProtocolName: string;
  ProtocolFamily: string;
  ProgramAddress: string;
}

export interface TrendingTokenMarket {
  MarketAddress: string;
}

export interface TrendingToken {
  currency: TrendingTokenCurrency;
  price: TrendingTokenPrice;
  dex: TrendingTokenDex;
  market: TrendingTokenMarket;
  side_currency: TrendingTokenCurrency;
  makers: number;
  total_trades: number;
  total_traded_volume: number;
  total_buy_volume: number;
  total_sell_volume: number;
  total_buys: number;
  total_sells: number;
}

export type TokenTradingResponse = TokenTradingInfo;

export interface TrendingTokensResponse {
  trending_tokens: TrendingToken[];
}
