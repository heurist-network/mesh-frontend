"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import { memo } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";

import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons";

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "What are the advantages",
      label: "of using Next.js?",
      action: "What are the advantages of using Next.js?",
    },
    {
      title: "Write code to",
      label: `demonstrate djikstra's algorithm`,
      action: `Write code to demonstrate djikstra's algorithm`,
    },
    {
      title: "What are the advantages",
      label: "of using Next.js?",
      action: "What are the advantages of using Next.js?",
    },
  ];

  return (
    <div className="pb-4">
      <div
        className={`grid gap-4 w-full mb-2 ${
          suggestedActions.length > 3 ? "grid-cols-1" : "grid-cols-1"
        }`}
      >
        {suggestedActions.map((suggestedAction, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.05 * index }}
            key={`suggested-action-${suggestedAction.title}-${index}`}
            className={index > 1 ? "hidden sm:block" : "block"}
          >
            <Card
              className="p-1 border-none h-full rounded-2xl cursor-pointer group"
              onClick={async () => {
                // 直接调用append函数发送消息，不进行页面跳转
                append({
                  role: "user",
                  content: suggestedAction.action,
                });
              }}
            >
              <div className="rounded-xl border-solid h-full flex flex-col justify-between border text-white overflow-hidden">
                <CardContent className="p-3">
                  {/* 头部：头像、名称、作者和标签 */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">
                      {suggestedAction.action}
                    </h2>
                    <div>
                      <ArrowRight
                        size={20}
                        className="text-muted-foreground text-2xl group-hover:text-foreground"
                      />
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      {/* <div className="w-full h-px bg-secondary"></div> */}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
