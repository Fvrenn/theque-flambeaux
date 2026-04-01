"use client";

import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Info } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { LiveMessage } from "@prisma/client";

export function LiveChat({ initialMessages }: { initialMessages: LiveMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [parent] = useAutoAnimate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const source = new EventSource("/api/live-events");

    source.addEventListener("newMessage", (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => [newMessage, ...prev]);
    });

    return () => source.close();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <header className="p-4 border-b border-slate-50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Le Mur du Live</h2>
        </div>
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">Temps réel activé</span>
      </header>

      <ScrollArea className="flex-1 px-4 py-4">
        <div className="flex flex-col-reverse gap-4" ref={parent}>
          <div ref={scrollRef} />
          {messages.length > 0 ? (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex flex-col gap-1 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  message.isSystemEvent ? "mx-auto w-full text-center" : "items-start"
                }`}
              >
                {message.isSystemEvent ? (
                  <div className="bg-princeton-orange-50 text-princeton-orange-700 px-3 py-1.5 rounded-full text-[10px] font-black border border-princeton-orange-100 flex items-center gap-2 justify-center italic">
                    <Info className="h-3 w-3" />
                    {message.content}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[10px] font-black text-slate-900">{message.pseudo}</span>
                      <span className="text-[9px] text-slate-300 font-medium">
                        {new Date(message.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-2xl rounded-tl-none text-sm text-slate-700 leading-relaxed shadow-sm">
                      {message.content}
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-300 text-xs italic">Soyez le premier à encourager les équipes !</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
