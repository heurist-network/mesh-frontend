import { motion } from "framer-motion";
import Link from "next/link";
import { useAgent } from "@/lib/context/agent-context";
import { MessageIcon, VercelIcon } from "./icons";

export const Overview = () => {
  const { selectedAgent } = useAgent();
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
        <div className=" text-[#787878] text-sm mb-4">
          By {selectedAgent?.author}
        </div>
        <h1 className="text-2xl font-semibold text-bold text-card-foreground">
          {selectedAgent?.greeting_message || "What can I do for you?"}
        </h1>
      </div>
    </motion.div>
  );
};
