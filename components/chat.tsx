'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from 'ai/react';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { ChatHeader } from '@/components/chat-header';
import type { Vote } from '@/lib/db/schema';
import { fetcher, generateUUID } from '@/lib/utils';

import { Artifact } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import type { VisibilityType } from './visibility-selector';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import {
  useSidebar,
} from '@/components/ui/sidebar';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
  user,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  user?: any;
}) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [showLoginAnimation, setShowLoginAnimation] = useState(false);

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate('/api/history');
    },
    onError: (error) => {
      toast.error('An error occurred, please try again!');
    },
  });
  const { isMobile } = useSidebar();

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);
  const handleMessageSubmit = (
    event?: { preventDefault?: () => void },
    chatRequestOptions?: any,
  ) => {
    event?.preventDefault?.();
    if (!user) {
      setShowLoginAnimation(true);
      setTimeout(() => setShowLoginAnimation(false), 5000);
      return;
    }
    handleSubmit(event, chatRequestOptions);
  };

  return (
    <>
      <div className={`flex flex-col min-w-0 h-dvh bg-background ${isMobile ? 'pt-0' : 'pt-10'}`}>
        <Messages
          chatId={id}
          isLoading={isLoading}
          votes={votes}
          isMobile={isMobile}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <AnimatePresence>
          {showLoginAnimation && (
            <motion.div
              className="fixed bottom-[5.5rem] md:bottom-[6.5rem] left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm w-[calc(100%-2rem)] md:w-auto mx-4 z-50 flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <p className="text-sm font-medium">Sign in to start chatting</p>
              <Button
                size="sm"
                onClick={() => router.push('/login')}
                className="bg-white text-black hover:bg-white/90 ml-4 whitespace-nowrap"
              >
                Sign in
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleMessageSubmit}
        isLoading={isLoading}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  );
}
