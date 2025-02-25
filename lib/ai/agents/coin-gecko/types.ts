import type { BaseAgentConfig } from '../base';

export interface CoinGeckoAgentConfig extends BaseAgentConfig {
  agentId: 'CoinGeckoTokenInfoAgent';
}

export interface TokenInfo {
  name: string;
  symbol: string;
  market_cap_rank: number;
  categories: string[];
  description: string;
}

export interface TrendingCoin {
  name: string;
  symbol: string;
  market_cap_rank: number;
  price_usd: number;
}

export interface TrendingCoinsResponse {
  trending_coins: TrendingCoin[];
}

export interface CryptoMetrics {
  token_info: TokenInfo;
  market_metrics: {
    current_price_usd: number;
    market_cap_usd: number;
    fully_diluted_valuation_usd: number;
    total_volume_usd: number;
  };
  price_metrics: {
    ath_usd: number;
    ath_change_percentage: number;
    ath_date: string;
    high_24h_usd: number;
    low_24h_usd: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
  };
  supply_info: {
    total_supply: number;
    max_supply: number | null;
    circulating_supply: number;
  };
}
