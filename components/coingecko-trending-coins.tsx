'use client';
import type {
  TrendingCoin,
  TrendingCoinsResponse,
} from '@/lib/ai/agents/coin-gecko/types';
import { motion } from 'framer-motion';

const EMPTY_TRENDING: TrendingCoin[] = Array(10).fill({
  name: '',
  symbol: '',
  market_cap_rank: 0,
  price_usd: 0,
});

const formatUSD = (num: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

export interface TrendingCoinsProps {
  trendingCoins?: TrendingCoin[] | TrendingCoinsResponse;
}

export function CoinGeckoTrendingCoins({
  trendingCoins = EMPTY_TRENDING,
}: TrendingCoinsProps) {
  const coins = Array.isArray(trendingCoins)
    ? trendingCoins
    : (trendingCoins as TrendingCoinsResponse)?.trending_coins ||
      EMPTY_TRENDING;

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-6 bg-zinc-900 shadow-lg max-w-screen-sm border border-orange-500/10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full bg-orange-500" />
          <h2 className="text-xl font-medium text-orange-50">Trending</h2>
        </div>
        <div className="sm:flex hidden items-center gap-3 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-orange-500/50" />
            Live Price
          </div>
          <div>•</div>
          <div>Top 10 by CoinGecko</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
        {coins.map((coin: TrendingCoin, i: number) => (
          <motion.div
            key={`${coin.symbol}-${i}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-zinc-700/50"
          >
            <div className="flex items-center justify-center size-8 rounded-lg bg-zinc-900 text-zinc-400 text-sm font-medium group-hover:text-orange-400 transition-colors shrink-0">
              {i + 1}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-baseline gap-2 min-w-0">
                <div className="font-medium text-zinc-100 truncate group-hover:text-orange-50 transition-colors flex-1">
                  {coin.name || '...'}
                </div>
                <div className="text-sm text-zinc-500 font-medium shrink-0">
                  {coin.symbol || '...'}
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-sm text-zinc-500">
                  {coin.market_cap_rank ? `#${coin.market_cap_rank}` : '...'}
                </div>
                <div className="text-sm font-medium text-zinc-200 group-hover:text-orange-200 transition-colors">
                  {coin.price_usd ? formatUSD(coin.price_usd) : '-'}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
