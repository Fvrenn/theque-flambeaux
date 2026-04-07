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
    <nav className="fixed bottom-6 left-4 right-6 bg-white/90 backdrop-blur-lg border-2 border-slate-50 px-2 py-3 flex justify-around items-center z-50 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] max-w-md mx-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300 ${
              isActive ? "bg-kawaii-pink/20 text-primary scale-110" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "fill-primary/10 stroke-[2.5px]" : "stroke-[2px]"}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
