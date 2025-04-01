'use client';

import cx from 'classnames';
import { motion } from 'framer-motion';
import type { TokenPair } from '@/lib/ai/agents/dexscreener/types';

const EMPTY_PAIR: TokenPair = {
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
};

// format helpers
const formatUSD = (num: number | string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(typeof num === 'string' ? Number.parseFloat(num) : num);

const formatPercentage = (num: number | undefined) => {
  if (num === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  }).format(num / 100);
};

const formatCompactNumber = (num: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);

const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export interface DexScreenerPairInfoProps {
  pairInfo?: TokenPair;
}

export function DexScreenerPairInfo({
  pairInfo = EMPTY_PAIR,
}: DexScreenerPairInfoProps) {
  const isPositiveChange = (pairInfo.priceChange?.h24 || 0) > 0;
  const buyRatio =
    pairInfo.txns.h24.buys + pairInfo.txns.h24.sells > 0
      ? (pairInfo.txns.h24.buys /
          (pairInfo.txns.h24.buys + pairInfo.txns.h24.sells)) *
        100
      : 0;
  const pairCreatedDate = pairInfo.pairCreatedAt
    ? new Date(pairInfo.pairCreatedAt * 1000)
    : null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-6 bg-zinc-900 shadow-lg max-w-screen-sm border border-orange-500/10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center sm:size-12 size-10 rounded-xl bg-orange-500/10 text-orange-400 font-medium border border-orange-500/20 text-center leading-none shrink-0">
            {pairInfo.baseToken.symbol || '...'}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="sm:text-xl text-lg font-medium text-orange-50 truncate">
              {pairInfo.baseToken.name ||
                shortenAddress(pairInfo.baseToken.address) ||
                '...'}
            </div>
            <div className="text-sm text-zinc-500">
              {pairInfo.chainId
                ? `${pairInfo.chainId} • ${pairInfo.dexId}`
                : '...'}
            </div>
          </div>
        </div>
        <div className="sm:flex hidden items-center gap-2 text-sm text-zinc-500">
          <div className="size-2 rounded-full bg-orange-500/50" />
          Live Price
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="sm:text-3xl text-2xl font-medium text-orange-50">
          {pairInfo.priceUsd ? formatUSD(pairInfo.priceUsd) : '-'}
        </div>
        {pairInfo.priceChange?.h24 !== undefined && (
          <div
            className={cx('text-sm font-medium', {
              'text-green-400': isPositiveChange,
              'text-red-400': !isPositiveChange,
            })}
          >
            {formatPercentage(pairInfo.priceChange.h24)}
            <span className="text-zinc-500"> (24h)</span>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
        {[
          {
            label: 'Liquidity',
            value: pairInfo.liquidity.usd,
            format: formatUSD,
          },
          {
            label: 'Volume (24h)',
            value: pairInfo.volume.h24,
            format: formatUSD,
          },
          {
            label: 'FDV',
            value: pairInfo.fdv,
            format: formatUSD,
            subtext: pairInfo.marketCap
              ? `Market Cap: ${formatUSD(pairInfo.marketCap)}`
              : null,
          },
          {
            label: 'Transactions (24h)',
            value: pairInfo.txns.h24.buys + pairInfo.txns.h24.sells,
            format: formatCompactNumber,
            subtext: buyRatio > 0 ? `${buyRatio.toFixed(0)}% buys` : null,
            valueClass:
              buyRatio > 50
                ? 'text-green-200'
                : buyRatio < 50
                  ? 'text-red-200'
                  : '',
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col gap-1 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-zinc-700/50"
          >
            <div className="text-sm text-zinc-500">{item.label}</div>
            <div
              className={cx(
                'font-medium text-zinc-200 group-hover:text-orange-200 transition-colors',
                item.valueClass,
              )}
            >
              {item.value ? item.format(item.value) : '-'}
              {item.subtext && (
                <div className="text-xs text-zinc-500">{item.subtext}</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {pairInfo.url && (
        <a
          href={pairInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-xs text-zinc-500 hover:text-orange-400 transition-colors text-center"
        >
          View on DexScreener
        </a>
      )}
    </div>
  );
}
