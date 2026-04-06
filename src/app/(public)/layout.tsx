import React from "react";
import { AutoRefresh } from "@/components/shared/AutoRefresh";
import { getSettings } from "@/actions/settings.actions";
import { PublicNav } from "@/components/features/public/PublicNav";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const isMaintenance = settings.isMaintenanceMode;

  return (
    <div className={`min-h-screen bg-background flex flex-col ${isMaintenance ? "" : "pb-24"}`}>
      <AutoRefresh interval={30000} />
      
      {!isMaintenance && (
        <header className="bg-white/80 backdrop-blur-md py-6 px-6 sticky top-0 z-10 border-b border-kawaii-pink/20">
          <h1 className="text-xl font-black text-center text-slate-800 tracking-tighter uppercase">
            Flambeaux <span className="text-primary italic">Thèque</span> ✨
          </h1>
        </header>
      )}

      <main className={`flex-1 p-4 ${isMaintenance ? "max-w-4xl" : "max-w-lg"} mx-auto w-full flex flex-col justify-center`}>
        {children}
      </main>

      {!isMaintenance && <PublicNav />}
    </div>
  );
}
