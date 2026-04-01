"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateMatchesForTournament } from "@/actions/match.actions";
import { Button } from "@/components/ui/button";

export function GenerateMatchesButton({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!confirm("Voulez-vous vraiment générer le planning ? Cette action créera tous les matchs possibles.")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await generateMatchesForTournament(tournamentId);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Button 
        onClick={handleGenerate} 
        className="px-8 py-6 text-lg font-bold bg-primary hover:bg-princeton-orange-600 shadow-lg"
        disabled={loading}
      >
        {loading ? "Génération..." : "Générer le Planning"}
      </Button>
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
