'use client';

import { motion } from 'framer-motion';
import cx from 'classnames';
import Image from 'next/image';
import type {
  TokenProfile,
  TokenProfilesResponse,
} from '@/lib/ai/agents/dexscreener/types';

const EMPTY_PROFILES: TokenProfile[] = Array(5).fill({
  url: '',
  chainId: '',
  tokenAddress: '',
  icon: '',
  header: '',
  openGraph: '',
  description: '',
  links: [],
});

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

// helper to get icon for link type
const getLinkIcon = (type: string | undefined) => {
  const typeMap: Record<string, string> = {
    website: '🌐',
    twitter: '𝕏',
    telegram: '📱',
    discord: '💬',
    github: '📂',
    medium: '📝',
    default: '🔗',
  };

  if (!type) return typeMap.default;
  return typeMap[type.toLowerCase()] || typeMap.default;
};

export interface DexScreenerTokenProfilesProps {
  data?: TokenProfilesResponse;
}

export function DexScreenerTokenProfiles({
  data,
}: DexScreenerTokenProfilesProps) {
  const profiles = data?.data?.profiles || EMPTY_PROFILES;

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-6 bg-zinc-900 shadow-lg max-w-screen-sm border border-orange-500/10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full bg-orange-500" />
          <h2 className="text-xl font-medium text-orange-50">Token Profiles</h2>
        </div>
        <div className="sm:flex hidden items-center gap-3 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-orange-500/50" />
            DexScreener
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {profiles.map((profile, i) => (
          <motion.a
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            key={profile.tokenAddress || i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col gap-3 p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-zinc-700/50"
          >
            <div className="flex items-start gap-3">
              {profile.icon ? (
                <Image
                  src={profile.icon}
                  alt={profile.header || 'Token icon'}
                  className="rounded-lg object-cover shrink-0"
                  width={48}
                  height={48}
                />
              ) : (
                <div
                  className={cx(
                    'flex items-center justify-center size-12 rounded-lg text-lg font-medium shrink-0',
                    getChainIconClass(profile.chainId),
                  )}
                >
                  {profile.chainId.slice(0, 1).toUpperCase()}
                </div>
              )}

              <div className="flex flex-col min-w-0 flex-1">
                <div className="font-medium text-lg text-zinc-100 truncate group-hover:text-orange-50 transition-colors">
                  {profile.header || shortenAddress(profile.tokenAddress)}
                </div>
                <div className="text-sm text-zinc-500 truncate">
                  {profile.chainId}
                </div>
                {profile.description && (
                  <div className="text-sm text-zinc-400 mt-1 line-clamp-2">
                    {profile.description}
                  </div>
                )}
              </div>
            </div>

            {profile.links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.links.slice(0, 4).map((link, j) => (
                  <button
                    type="button"
                    key={`${link.url}-${j}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(link.url, '_blank', 'noopener,noreferrer');
                    }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-700/50 hover:bg-zinc-700 text-xs text-zinc-300 cursor-pointer transition-colors"
                  >
                    <span>{getLinkIcon(link.type)}</span>
                    <span className="truncate max-w-[100px]">
                      {link.label || link.type || 'Link'}
                    </span>
                  </button>
                ))}
                {profile.links.length > 4 && (
                  <div className="flex items-center px-2 py-1 rounded-md bg-zinc-700/50 text-xs text-zinc-400">
                    +{profile.links.length - 4} more
                  </div>
                )}
              </div>
            )}
          </motion.a>
        ))}
      </div>
    </div>
  );
}
