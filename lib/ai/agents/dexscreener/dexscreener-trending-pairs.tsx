'use client';

import { motion } from 'framer-motion';
import cx from 'classnames';
import type {
  TokenPair,
  SearchPairsResponse,
} from '@/lib/ai/agents/dexscreener/types';

const EMPTY_TRENDING: TokenPair[] = Array(6).fill({
  chainId: '',
  dexId: '',
  url: '',
  pairAddress: '',
  baseToken: {
    address: '',
    name: '',
    symbol: '',
  },
  quoteToken: {
    address: '',
    name: '',
    symbol: '',
  },
  priceNative: '0',
  priceUsd: '0',
  txns: {
    m5: { buys: 0, sells: 0 },
    h1: { buys: 0, sells: 0 },
    h6: { buys: 0, sells: 0 },
    h24: { buys: 0, sells: 0 },
  },
  volume: {
    h24: 0,
    h6: 0,
    h1: 0,
    m5: 0,
  },
  priceChange: {
    h24: 0,
    h6: 0,
    h1: 0,
    m5: 0,
  },
  liquidity: {
    usd: 0,
    base: 0,
    quote: 0,
  },
  fdv: 0,
});

const formatUSD = (num: number | string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(typeof num === 'string' ? Number.parseFloat(num) : num);

const formatCompactNumber = (num: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);

// helper to get a shortened version of the address
const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// helper to get chain icon class
const getChainIconClass = (chainId: string) => {
  const chainMap: Record<string, string> = {
    ethereum: 'bg-blue-500/20 text-blue-400',
    bsc: 'bg-yellow-500/20 text-yellow-400',
    polygon: 'bg-purple-500/20 text-purple-400',
    arbitrum: 'bg-blue-400/20 text-blue-300',
    avalanche: 'bg-red-500/20 text-red-400',
    fantom: 'bg-blue-600/20 text-blue-500',
    optimism: 'bg-red-600/20 text-red-500',
    base: 'bg-blue-700/20 text-blue-600',
    solana: 'bg-purple-600/20 text-purple-500',
  };

  return chainMap[chainId.toLowerCase()] || 'bg-orange-500/20 text-orange-400';
};

export interface DexScreenerTrendingPairsProps {
  data?: SearchPairsResponse;
}

export function DexScreenerTrendingPairs({
  data,
}: DexScreenerTrendingPairsProps) {
  const pairs = data?.data?.pairs || EMPTY_TRENDING;

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-6 bg-zinc-900 shadow-lg max-w-screen-sm border border-orange-500/10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full bg-orange-500" />
          <h2 className="text-xl font-medium text-orange-50">Trending Pairs</h2>
        </div>
        <div className="sm:flex hidden items-center gap-3 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-orange-500/50" />
            Live Data
          </div>
          <div>•</div>
          <div>DexScreener</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
        {pairs.slice(0, 6).map((pair, i) => {
          const priceChange = pair.priceChange?.h24 || 0;
          const buyRatio =
            pair.txns.h24.buys + pair.txns.h24.sells > 0
              ? (pair.txns.h24.buys /
                  (pair.txns.h24.buys + pair.txns.h24.sells)) *
                100
              : 0;

          return (
            <motion.a
              href={pair.url}
              target="_blank"
              rel="noopener noreferrer"
              key={pair.pairAddress || i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col gap-2 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-zinc-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div
                    className={cx(
                      'flex items-center justify-center size-6 rounded-lg text-xs font-medium shrink-0',
                      getChainIconClass(pair.chainId),
                    )}
                  >
                    {i + 1}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    {pair.baseToken.name ? (
                      <div className="font-medium text-zinc-100 truncate group-hover:text-orange-50 transition-colors">
                        {pair.baseToken.name}
                      </div>
                    ) : (
                      <div className="font-medium text-zinc-100 font-mono truncate group-hover:text-orange-50 transition-colors">
                        {shortenAddress(pair.baseToken.address)}
                      </div>
                    )}
                    <div className="text-xs text-zinc-500 truncate">
                      {pair.chainId} • {pair.dexId}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 ml-3">
                  <div className="font-medium text-zinc-200 group-hover:text-orange-200 transition-colors">
                    {pair.priceUsd ? formatUSD(pair.priceUsd) : '-'}
                  </div>
                  {priceChange !== 0 && (
                    <div
                      className={cx(
                        'text-sm font-medium',
                        priceChange > 0 ? 'text-green-400' : 'text-red-400',
                      )}
                    >
                      {priceChange > 0 ? '+' : ''}
                      {priceChange.toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500">
                <div>
                  {pair.volume.h24 > 0
                    ? `Vol: ${formatUSD(pair.volume.h24)}`
                    : 'No volume data'}
                </div>
                {pair.txns.h24.buys + pair.txns.h24.sells > 0 && (
                  <div
                    className={cx(
                      buyRatio > 50 ? 'text-green-400/50' : 'text-red-400/50',
                    )}
                  >
                    {buyRatio.toFixed(0)}% buys
                  </div>
                )}
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
