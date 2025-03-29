import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { Chat } from "@/components/agent-chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages } from "@/lib/utils";
import { auth } from "../../../(auth)/auth";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let { id } = params;
  console.log('获取id', id);
  let agentId = '';
  // 检查 id 是否包含连字符，如果包含则提取最后一个连字符前的部分
  if (id.includes('-')) {
    const lastDashIndex = id.lastIndexOf('-');
    // 提取最后一个连字符后的部分作为额外参数
    agentId = id.substring(lastDashIndex + 1);
    console.log('提取的额外参数:', agentId);
    console.log('重置后的 id:', id);
  }
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const session = await auth();

  if (chat.visibility === "private") {
    if (!session || !session.user) {
      return notFound();
    }

    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get("chat-model");
  console.log('chatModelFromCookie', chatModelFromCookie);
  if (!chatModelFromCookie) {
    return (
      <>
        <Chat
          id={chat.id}
          agentId={agentId}
          initialMessages={convertToUIMessages(messagesFromDb)}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType={chat.visibility}
          isReadonly={session?.user?.id !== chat.userId}
          user={session?.user}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        id={chat.id}
        agentId={agentId}
        initialMessages={convertToUIMessages(messagesFromDb)}
        selectedChatModel={chatModelFromCookie.value || DEFAULT_CHAT_MODEL}
        selectedVisibilityType={chat.visibility}
        isReadonly={session?.user?.id !== chat.userId}
        user={session?.user}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
