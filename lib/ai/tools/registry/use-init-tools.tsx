'use client';

import { useSyncExternalStore } from 'react';
import { Weather } from '@/components/weather';
import { CoinGeckoCryptoPrice } from '@/lib/ai/agents/coin-gecko/coingecko-crypto-price';
import { DocumentPreview } from '@/components/document-preview';
import { DocumentToolCall, DocumentToolResult } from '@/components/document';
import type { ArtifactKind } from '@/components/artifact';
import { initializeTools, subscribe, getRegistrySnapshot } from './registry';
import type { WeatherResult } from '../get-weather';
import type { ToolConfig } from './types';
import { CoinGeckoTrendingCoins } from '@/lib/ai/agents/coin-gecko/coingecko-trending-coins';
import { SolanaTokenTrading } from '@/lib/ai/agents/bitquery-solana/bitquery-solana-token-trading';
import { SolanaTrendingTokens } from '@/lib/ai/agents/bitquery-solana/bitquery-solana-trending-tokens';
import { DexScreenerPairInfo } from '@/lib/ai/agents/dexscreener/dexscreener-pair-info';
import { DexScreenerTrendingPairs } from '@/lib/ai/agents/dexscreener/dexscreener-trending-pairs';
import { DexScreenerTokenProfiles } from '@/lib/ai/agents/dexscreener/dexscreener-token-profiles';

// document result type
interface DocumentResult {
  id: string;
  title: string;
  kind: ArtifactKind;
}

// base tool ui configurations
const baseToolConfigs = {
  createDocument: {
    renderResult: (result: DocumentResult) => (
      <DocumentPreview isReadonly={false} result={result} />
    ),
    renderLoading: () => (
      <DocumentPreview isReadonly={false} args={{ title: '', kind: 'text' }} />
    ),
  },
  updateDocument: {
    renderResult: (result: DocumentResult) => (
      <DocumentToolResult type="update" result={result} isReadonly={false} />
    ),
    renderLoading: () => (
      <DocumentToolCall type="update" args={{ title: '' }} isReadonly={false} />
    ),
  },
  requestSuggestions: {
    renderResult: (result: DocumentResult) => (
      <DocumentToolResult
        type="request-suggestions"
        result={result}
        isReadonly={false}
      />
    ),
    renderLoading: () => (
      <DocumentToolCall
        type="request-suggestions"
        args={{ title: '' }}
        isReadonly={false}
      />
    ),
  },
} satisfies Record<string, Pick<ToolConfig, 'renderResult' | 'renderLoading'>>;

// agent tool ui configurations
const agentToolConfigs = {
  getWeather: {
    renderResult: (result: WeatherResult) => (
      <Weather weatherAtLocation={result} />
    ),
    renderLoading: () => <Weather />,
  },

  // coingecko tools
  getTokenInfo: {
    renderResult: (result: any) => (
      <CoinGeckoCryptoPrice cryptoMetrics={result} />
    ),
    renderLoading: () => <CoinGeckoCryptoPrice />,
  },
  getTrendingCoins: {
    renderResult: (result: any) => (
      <CoinGeckoTrendingCoins trendingCoins={result} />
    ),
    renderLoading: () => <CoinGeckoTrendingCoins />,
  },

  // bitquery solana tools
  getTokenTradingInfo: {
    renderResult: (result: any) => <SolanaTokenTrading data={result} />,
    renderLoading: () => <SolanaTokenTrading />,
  },
  getTopTrendingTokens: {
    renderResult: (result: any) => <SolanaTrendingTokens data={result} />,
    renderLoading: () => <SolanaTrendingTokens />,
  },

  // dexscreener tools
  getSpecificPairInfo: {
    renderResult: (result: any) => (
      <DexScreenerPairInfo pairInfo={result.data?.pair} />
    ),
    renderLoading: () => <DexScreenerPairInfo />,
  },
  searchPairs: {
    renderResult: (result: any) => <DexScreenerTrendingPairs data={result} />,
    renderLoading: () => <DexScreenerTrendingPairs />,
  },
  getTokenProfiles: {
    renderResult: (result: any) => <DexScreenerTokenProfiles data={result} />,
    renderLoading: () => <DexScreenerTokenProfiles />,
  },
  getTokenPairs: {
    renderResult: (result: any) => <DexScreenerTrendingPairs data={result} />,
    renderLoading: () => <DexScreenerTrendingPairs />,
  },
} satisfies Record<string, Pick<ToolConfig, 'renderResult' | 'renderLoading'>>;

// combine all ui configs
const uiConfigs = {
  ...baseToolConfigs,
  ...agentToolConfigs,
} satisfies Record<string, Pick<ToolConfig, 'renderResult' | 'renderLoading'>>;

export function useInitTools() {
  // initialize tools once on mount
  useSyncExternalStore(subscribe, getRegistrySnapshot, getRegistrySnapshot);

  // initialize tools on first render
  initializeTools(uiConfigs);

  return true;
}
