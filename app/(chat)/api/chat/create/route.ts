import { auth } from "@/app/(auth)/auth";
import { saveChat } from "@/lib/db/queries";

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { id, title, agentId } = await request.json();

    await saveChat({
      id,
      userId: session.user.id || "",
      title,
      // agentId, // if the database model supports it
    });

    return new Response("Chat created successfully", { status: 200 });
  } catch (error) {
    console.error("Failed to create chat:", error);
    return new Response("Failed to create chat", { status: 500 });
  }
}
