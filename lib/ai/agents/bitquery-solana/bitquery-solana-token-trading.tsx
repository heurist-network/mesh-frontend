'use client';

import cx from 'classnames';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import type { TokenTradingResponse } from '@/lib/ai/agents/bitquery-solana/types';

const EMPTY_TOKEN: TokenTradingResponse = {
  summary: {
    current_price: 0,
    price_change_1h: 0,
    price_change_percentage_1h: 0,
    highest_price_1h: 0,
    lowest_price_1h: 0,
    total_volume_1h: 0,
    last_updated: '',
  },
  detailed_data: [],
};

const formatUSD = (num: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(num);

const formatPercentage = (num: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  }).format(num / 100);

const formatCompactNumber = (num: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);

interface MetricItem {
  label: string;
  value: string;
  prefix?: string;
}

export interface SolanaTokenTradingProps {
  data?: TokenTradingResponse;
}

export function SolanaTokenTrading({
  data = EMPTY_TOKEN,
}: SolanaTokenTradingProps) {
  const isPositiveChange = data.summary.price_change_percentage_1h > 0;
  const lastUpdated = data.summary.last_updated
    ? new Date(data.summary.last_updated)
    : null;

  const metrics: MetricItem[] = [
    {
      label: '1h High',
      value: data.summary.highest_price_1h
        ? formatUSD(data.summary.highest_price_1h)
        : '...',
    },
    {
      label: '1h Low',
      value: data.summary.lowest_price_1h
        ? formatUSD(data.summary.lowest_price_1h)
        : '...',
    },
    {
      label: '1h Volume',
      value: data.summary.total_volume_1h
        ? formatCompactNumber(data.summary.total_volume_1h)
        : '...',
      prefix: '☉',
    },
    {
      label: 'Last Updated',
      value: lastUpdated
        ? formatDistanceToNow(lastUpdated, { addSuffix: true })
        : '...',
    },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-6 bg-zinc-900 shadow-lg max-w-screen-sm border border-orange-500/10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full bg-orange-500" />
          <h2 className="text-xl font-medium text-orange-50">Token Trading</h2>
        </div>
        <div className="sm:flex hidden items-center gap-2 text-sm text-zinc-500">
          <div className="size-2 rounded-full bg-orange-500/50" />
          Live Price
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="sm:text-3xl text-2xl font-medium text-orange-50">
          {data.summary.current_price
            ? formatUSD(data.summary.current_price)
            : '...'}
        </div>
        {data.summary.price_change_percentage_1h !== 0 && (
          <div
            className={cx('text-sm font-medium', {
              'text-green-400': isPositiveChange,
              'text-red-400': !isPositiveChange,
            })}
          >
            {formatPercentage(data.summary.price_change_percentage_1h)}
            <span className="text-zinc-500"> (1h)</span>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
        {metrics.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col gap-1 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-zinc-700/50"
          >
            <div className="text-sm text-zinc-500">{item.label}</div>
            <div className="font-medium text-zinc-200 group-hover:text-orange-200 transition-colors">
              {item.prefix && <span className="mr-1">{item.prefix}</span>}
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
