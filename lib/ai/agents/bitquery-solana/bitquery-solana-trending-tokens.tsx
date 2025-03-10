'use client';

import { motion } from 'framer-motion';
import type {
  TrendingTokensResponse,
  TrendingToken,
} from '@/lib/ai/agents/bitquery-solana/types';
import cx from 'classnames';

const EMPTY_TRENDING: TrendingToken[] = Array(10).fill({
  currency: {
    Name: '',
    Symbol: '',
    MintAddress: '',
  },
  price: {
    start: 0,
    min5: 0,
    end: 0,
  },
  dex: {
    ProtocolName: '',
    ProtocolFamily: '',
    ProgramAddress: '',
  },
  market: {
    MarketAddress: '',
  },
  side_currency: {
    Name: null,
    Symbol: null,
    MintAddress: '',
  },
  makers: 0,
  total_trades: 0,
  total_traded_volume: 0,
  total_buy_volume: 0,
  total_sell_volume: 0,
  total_buys: 0,
  total_sells: 0,
});

const formatUSD = (num: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(num);

const formatCompactNumber = (num: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);

// helper to get a shortened version of the mint address
const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// helper to get solscan url for a token
const getSolscanUrl = (address: string) => {
  return `https://solscan.io/token/${address}`;
};

export interface SolanaTrendingTokensProps {
  data?: TrendingTokensResponse;
}

export function SolanaTrendingTokens({ data }: SolanaTrendingTokensProps) {
  const tokens = data?.trending_tokens || EMPTY_TRENDING;

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-6 bg-zinc-900 shadow-lg max-w-screen-sm border border-orange-500/10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full bg-orange-500" />
          <h2 className="text-xl font-medium text-orange-50">
            Trending on Solana
          </h2>
        </div>
        <div className="sm:flex hidden items-center gap-3 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-orange-500/50" />
            Live Trading
          </div>
          <div>•</div>
          <div>Top 10 by Bitquery</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
        {tokens.map((token, i) => {
          const priceChange =
            ((token.price.end - token.price.start) / token.price.start) * 100;
          const buyRatio =
            (token.total_buys / (token.total_buys + token.total_sells)) * 100;

          return (
            <motion.a
              href={getSolscanUrl(token.currency.MintAddress)}
              target="_blank"
              rel="noopener noreferrer"
              key={token.currency.MintAddress || i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col gap-2 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-zinc-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="flex items-center justify-center size-6 rounded-lg bg-zinc-900 text-zinc-400 text-xs font-medium group-hover:text-orange-400 transition-colors shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    {token.currency.Name ? (
                      <div className="font-medium text-zinc-100 truncate group-hover:text-orange-50 transition-colors">
                        {token.currency.Name}
                      </div>
                    ) : (
                      <div className="font-medium text-zinc-100 font-mono truncate group-hover:text-orange-50 transition-colors">
                        {shortenAddress(token.currency.MintAddress)}
                      </div>
                    )}
                    <div className="text-xs text-zinc-500 truncate">
                      {token.dex.ProtocolFamily}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 ml-3">
                  <div className="font-medium text-zinc-200 group-hover:text-orange-200 transition-colors">
                    {token.price.end ? formatUSD(token.price.end) : '-'}
                  </div>
                  {token.price.start > 0 && token.price.end > 0 && (
                    <div
                      className={cx(
                        'text-sm font-medium',
                        priceChange > 0 ? 'text-green-400' : 'text-red-400',
                      )}
                    >
                      {priceChange.toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500">
                <div>
                  {token.total_trades
                    ? `${formatCompactNumber(token.total_trades)} trades`
                    : '...'}
                </div>
                {token.total_buys + token.total_sells > 0 && (
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
