import { motion } from "framer-motion";
import Link from "next/link";
import { useAgent } from "@/lib/context/agent-context";
import { MessageIcon, VercelIcon } from "./icons";
import { useState, useEffect } from "react";

export const Overview = () => {
  const { selectedAgent } = useAgent();
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const text = selectedAgent?.greeting_message || "What can I do for you?";

    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 50); // 每个字符之间的延迟时间，可以调整

      return () => clearTimeout(timeout);
    }
  }, [index, selectedAgent?.greeting_message]);

  // 当 selectedAgent 改变时，重置打字机效果
  useEffect(() => {
    setDisplayText("");
    setIndex(0);
  }, [selectedAgent]);

  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col leading-relaxed text-center max-w-xl">
        <h2 className="text-base text-bold text-card-foreground font-semibold">
          {selectedAgent?.name}
        </h2>
        <div className=" text-[#787878] text-sm mb-8">
          By {selectedAgent?.author}
        </div>

        <h1 className="text-2xl font-semibold text-bold text-card-foreground">
          {displayText}
          <span className="inline-block animate-[blink_0.7s_ease-in-out_infinite]">
            |
          </span>
        </h1>
      </div>
    </motion.div>
  );
};
