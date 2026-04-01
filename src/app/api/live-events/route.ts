import { eventEmitter } from "@/lib/eventEmitter";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const onMatchUpdated = (match: any) => {
        controller.enqueue(`event: matchUpdated\ndata: ${JSON.stringify(match)}\n\n`);
      };

      const onNewMessage = (message: any) => {
        controller.enqueue(`event: newMessage\ndata: ${JSON.stringify(message)}\n\n`);
      };

      eventEmitter.on("matchUpdated", onMatchUpdated);
      eventEmitter.on("newMessage", onNewMessage);

      // Heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        controller.enqueue(": heartbeat\n\n");
      }, 30000);

      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        eventEmitter.removeListener("matchUpdated", onMatchUpdated);
        eventEmitter.removeListener("newMessage", onNewMessage);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
