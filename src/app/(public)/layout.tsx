"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, Trophy, Calendar, MessageCircle } from "lucide-react";
import { AutoRefresh } from "@/components/shared/AutoRefresh";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "Direct", href: "/", icon: Radio },
    { label: "Classement", href: "/ranking", icon: Trophy },
    { label: "Planning", href: "/schedule", icon: Calendar },
    { label: "Live", href: "/live", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <AutoRefresh interval={30000} />
      
      <header className="bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-black text-center text-slate-900 tracking-tight">
          FLAMBEAUX <span className="text-primary">THÈQUE</span>
        </h1>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                isActive ? "text-primary" : "text-slate-400"
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? "fill-primary/10" : ""}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
