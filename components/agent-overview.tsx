import { useAgent } from "@/lib/context/agent-context";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 pt-20 pb-0 flex flex-col leading-relaxed text-center justify-center items-center max-w-xl">
        {selectedAgent?.image_url && (
          <img
            src={selectedAgent?.image_url}
            alt={selectedAgent?.name}
            className="size-10 rounded-full"
          />
        )}
        <h2 className="text-base text-bold text-card-foreground my-2 font-semibold">
          {selectedAgent?.name}
        </h2>
        <div className=" text-[#787878] text-sm">
          By {selectedAgent?.author}
        </div>

        <h1 className="text-2xl font-semibold text-bold mt-14 text-card-foreground">
          {displayText}
          <span className="inline-block animate-[blink_0.7s_ease-in-out_infinite]">
            |
          </span>
        </h1>
      </div>
    </motion.div>
  );
};
