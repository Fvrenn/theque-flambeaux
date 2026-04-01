import { prisma } from "@/lib/prisma";
import { ChatBox } from "@/components/features/live/ChatBox";
import { LiveChat } from "@/components/features/live/LiveChat";

export default async function LivePage() {
  const messages = await prisma.liveMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
      <LiveChat initialMessages={messages as any} />
      
      <div className="shrink-0 animate-in slide-in-from-bottom-4 duration-500">
        <ChatBox />
      </div>
    </div>
  );
}
