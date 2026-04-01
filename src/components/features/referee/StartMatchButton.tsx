"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMatchStatus } from "@/actions/match.actions";
import { Button } from "@/components/ui/button";
import { MatchStatus } from "@prisma/client";

export function StartMatchButton({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    try {
      await updateMatchStatus(matchId, MatchStatus.IN_PROGRESS);
      router.refresh();
    } catch (error) {
      alert("Erreur lors du démarrage du match");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold">Prêt pour le match ?</h3>
        <p className="text-slate-500">Appuyez sur le bouton pour lancer le chronomètre.</p>
      </div>
      <Button 
        onClick={handleStart} 
        disabled={loading}
        className="w-full max-w-xs h-24 text-2xl font-black bg-green-600 hover:bg-green-700 shadow-xl transition-all active:scale-95"
      >
        {loading ? "Chargement..." : "DÉMARRER"}
      </Button>
    </div>
  );
}
