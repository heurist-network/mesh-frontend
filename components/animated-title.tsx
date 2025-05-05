'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PLATFORMS = [
  'CoinGecko',
  'GoPlus',
  'Pond AI',
  'DexScreener',
  'Elfa AI',
  'UnifAI',
  'AIXBT',
  'Zerion',
  'Space and Time',
  'CARV',
  'Masa',
  'Truth Social',
  'Allora',
  'Moni',
];

export function AnimatedTitle() {
  const [platformIndex, setPlatformIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlatformIndex((prev) => (prev + 1) % PLATFORMS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative py-4 sm:py-6 md:py-8">
      <div className="absolute -top-10 -left-10 size-40 bg-purple-500/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-20 right-10 size-40 bg-blue-500/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:gap-3">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 md:mb-0"
        >
          <span className="text-white block lg:inline">YOUR AGENTS,</span>
          <span className="text-[#cdf138] block lg:inline lg:ml-2">
            YOUR WAY
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 0.4, scaleY: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="hidden md:block h-8 w-px bg-white/30 mx-1"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center text-lg sm:text-lg md:text-xl"
        >
          <span className="text-white/80 font-medium whitespace-nowrap">
            Connecting to
          </span>

          <div
            className="relative ml-2 h-8 sm:h-8 inline-flex items-center overflow-hidden"
            style={{ width: 'min(180px, 45vw)' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            role="presentation"
            aria-hidden="true"
          >
            {PLATFORMS.map((platform, index) => {
              const isActive = platformIndex === index;

              return (
                <motion.span
                  key={platform}
                  className="absolute left-0 font-bold whitespace-nowrap"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{
                    y: isActive ? 0 : 40,
                    opacity: isActive ? 1 : 0,
                    color: isHovering && isActive ? '#e2ff56' : '#cdf138',
                    textShadow:
                      isHovering && isActive
                        ? '0 0 8px rgba(205, 241, 56, 0.7)'
                        : '0 0 3px rgba(205, 241, 56, 0.3)',
                  }}
                  transition={{
                    y: { type: 'spring', stiffness: 300, damping: 25 },
                    opacity: { duration: 0.2 },
                    color: { duration: 0.3 },
                    textShadow: { duration: 0.3 },
                  }}
                >
                  {platform}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
