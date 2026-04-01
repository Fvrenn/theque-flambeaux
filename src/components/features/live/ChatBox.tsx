"use client";

import { useState, useEffect } from "react";
import { addLiveMessage } from "@/actions/live.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

export function ChatBox() {
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [isSettingPseudo, setIsSettingPseudo] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPseudo = localStorage.getItem("thèque_pseudo");
    if (savedPseudo) setPseudo(savedPseudo);
    else setIsSettingPseudo(true);
  }, []);

  async function handlePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pseudo) return;

    const formData = new FormData(event.currentTarget);
    const content = formData.get("content") as string;
    if (!content.trim()) return;

    setLoading(true);
    try {
      await addLiveMessage({ pseudo, content });
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleSavePseudo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPseudo = formData.get("pseudo") as string;
    if (!newPseudo.trim()) return;

    localStorage.setItem("thèque_pseudo", newPseudo);
    setPseudo(newPseudo);
    setIsSettingPseudo(false);
  }

  if (isSettingPseudo) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg animate-in fade-in zoom-in duration-300">
        <form onSubmit={handleSavePseudo} className="space-y-4">
          <div className="space-y-2 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-primary">Bienvenue !</p>
            <p className="text-xs text-slate-400">Choisis un pseudo pour discuter avec les autres parents.</p>
          </div>
          <Input name="pseudo" placeholder="Ton pseudo..." required className="rounded-xl border-2 h-12 text-center" />
          <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-princeton-orange-600 font-bold uppercase">
            C'est parti
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-lg">
      <form onSubmit={handlePost} className="flex gap-2">
        <Input 
          name="content" 
          placeholder="Un petit mot d'encouragement ?" 
          className="rounded-xl border-slate-100 bg-slate-50 h-10"
          required 
          disabled={loading}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={loading}
          className="shrink-0 h-10 w-10 bg-primary hover:bg-princeton-orange-600 rounded-xl shadow-md active:scale-95 transition-all"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </form>
      <div className="mt-2 flex justify-between items-center px-2">
        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tight">Posté en tant que <span className="text-slate-500 underline">{pseudo}</span></span>
        <button 
          onClick={() => setIsSettingPseudo(true)}
          className="text-[10px] text-primary/50 hover:text-primary font-bold uppercase underline"
        >
          Changer
        </button>
      </div>
    </div>
  );
}
