"use client";

import { type FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const platformNames = [
  "CoinGecko",
  "GoPlus",
  "DexScreener",
  "Elfa AI",
  "Zerion",
  "Space and Time",
  "CARV",
  "Masa",
  "Truth Social",
  "Allora",
  "Moni"
];

export const AnimatedTitle: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % platformNames.length);
    }, 2000); // Change platform name every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <h1 
        className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight leading-tight" 
        style={{ fontFamily: "'Segoe UI Semibold', 'Segoe UI', sans-serif" }}
      >
        <span className="text-white">YOUR AGENTS,</span>
        <br />
        <span className="text-[#cdf138]">YOUR WAY</span>
      </h1>
      
      <div className="mb-8">
        <span className="text-lg md:text-xl font-medium align-middle">
          Create and Customize MCP Servers Connecting to&nbsp;&nbsp;
        </span>
        <span className="inline-block align-middle relative" style={{ height: "1.5em", minWidth: "150px" }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute left-0 whitespace-nowrap font-bold text-[#cdf138] text-lg md:text-xl"
              style={{ top: "0" }}
            >
              {platformNames[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </div>
  );
};