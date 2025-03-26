'use client';

import cx from 'classnames';
import { formatDistanceToNow } from 'date-fns';
import type {
  CryptoMetrics,
  TokenInfo,
} from '@/lib/ai/agents/coin-gecko/types';
import { motion } from 'framer-motion';

const EMPTY_METRICS: CryptoMetrics = {
  token_info: {
    name: '',
    symbol: '',
    market_cap_rank: 0,
    categories: [],
    description: '',
  },
  market_metrics: {
    current_price_usd: 0,
    market_cap_usd: 0,
    fully_diluted_valuation_usd: 0,
    total_volume_usd: 0,
  },
  price_metrics: {
    ath_usd: 0,
    ath_change_percentage: 0,
    ath_date: new Date().toISOString(),
    high_24h_usd: 0,
    low_24h_usd: 0,
    price_change_24h: 0,
    price_change_percentage_24h: 0,
  },
  supply_info: {
    total_supply: 0,
    max_supply: null,
    circulating_supply: 0,
  },
};

// format helpers
const formatUSD = (num: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

const formatPercentage = (num: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  }).format(num / 100);

const createMetricsFromTokenInfo = (tokenInfo: TokenInfo): CryptoMetrics => ({
  ...EMPTY_METRICS,
  token_info: tokenInfo,
});

export interface CryptoPriceProps {
  cryptoMetrics?: CryptoMetrics;
  tokenInfo?: TokenInfo;
}

export function CoinGeckoCryptoPrice({
  cryptoMetrics = EMPTY_METRICS,
  tokenInfo,
}: CryptoPriceProps) {
  const metrics = tokenInfo
    ? createMetricsFromTokenInfo(tokenInfo)
    : cryptoMetrics;
  const isPositiveChange =
    metrics.price_metrics.price_change_percentage_24h > 0;
  const athDate = new Date(metrics.price_metrics.ath_date);

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-6 bg-zinc-900 shadow-lg max-w-screen-sm border border-orange-500/10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center sm:size-12 size-10 rounded-xl bg-orange-500/10 text-orange-400 font-medium border border-orange-500/20 text-center leading-none shrink-0">
            {metrics.token_info.symbol || '...'}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="sm:text-xl text-lg font-medium text-orange-50 truncate">
              {metrics.token_info.name || '...'}
            </div>
            <div className="text-sm text-zinc-500">
              {metrics.token_info.market_cap_rank
                ? `Rank #${metrics.token_info.market_cap_rank}`
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
          {metrics.market_metrics.current_price_usd
            ? formatUSD(metrics.market_metrics.current_price_usd)
            : '-'}
        </div>
        {metrics.price_metrics.price_change_percentage_24h !== 0 && (
          <div
            className={cx('text-sm font-medium', {
              'text-green-400': isPositiveChange,
              'text-red-400': !isPositiveChange,
            })}
          >
            {formatPercentage(
              metrics.price_metrics.price_change_percentage_24h,
            )}
            <span className="text-zinc-500"> (24h)</span>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
        {[
          {
            label: '24h High',
            value: metrics.price_metrics.high_24h_usd,
            format: formatUSD,
          },
          {
            label: '24h Low',
            value: metrics.price_metrics.low_24h_usd,
            format: formatUSD,
          },
          {
            label: 'All Time High',
            value: metrics.price_metrics.ath_usd,
            format: formatUSD,
            subtext: metrics.price_metrics.ath_date
              ? formatDistanceToNow(athDate, { addSuffix: true })
              : null,
          },
          {
            label: 'Market Cap',
            value: metrics.market_metrics.market_cap_usd,
            format: formatUSD,
            subtext: 'Total Value Locked',
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
            <div className="font-medium text-zinc-200 group-hover:text-orange-200 transition-colors">
              {item.value ? item.format(item.value) : '-'}
              {item.subtext && (
                <div className="text-xs text-zinc-500">{item.subtext}</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
