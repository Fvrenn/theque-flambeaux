"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, Trophy, Calendar, MessageCircle, Users } from "lucide-react";

export function PublicNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Direct", href: "/", icon: Radio },
    { label: "Équipes", href: "/equipes", icon: Users },
    { label: "Classement", href: "/ranking", icon: Trophy },
    { label: "Planning", href: "/schedule", icon: Calendar },
    { label: "Live", href: "/live", icon: MessageCircle },
  ];

  return (
    <nav className="fixed bottom-6 left-2 right-2 bg-white/90 backdrop-blur-lg border-2 border-slate-50 px-1 py-2 flex justify-around items-center z-50 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] max-w-lg mx-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-300 min-w-[60px] ${
              isActive ? "bg-kawaii-pink/20 text-primary scale-105" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "fill-primary/10 stroke-[2.5px]" : "stroke-[2px]"}`} />
            <span className="text-[8px] font-black uppercase tracking-tight text-center">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
