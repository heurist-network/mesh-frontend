import { cookies } from "next/headers";

import { Chat } from "@/components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { auth } from "../(auth)/auth";
import { AgentItem } from "@/components/agent-item";
export default async function Page() {
  const id = generateUUID();
  const session = await auth();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");

  if (!modelIdFromCookie) {
    return (
      <>
        <AgentItem />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <AgentItem />
      <DataStreamHandler id={id} />
    </>
  );
}
