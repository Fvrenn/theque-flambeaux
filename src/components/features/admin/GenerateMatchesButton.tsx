"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { generateMatchesForTournament } from "@/actions/match.actions";
import { Button } from "@/components/ui/button";

interface GenerateMatchesButtonProps {
  tournamentId: string;
}

export default function GenerateMatchesButton({
  tournamentId,
}: GenerateMatchesButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);

    try {
      await generateMatchesForTournament(tournamentId);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-princeton-orange-200 bg-princeton-orange-50/50 p-8">
      <p className="text-center text-sm text-muted-foreground">
        Aucun match n&apos;a été généré pour l&apos;instant.
      </p>
      <Button
        size="lg"
        onClick={handleGenerate}
        disabled={isLoading}
        className="text-base"
      >
        {isLoading ? "Génération…" : "🎲 Générer le planning"}
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
