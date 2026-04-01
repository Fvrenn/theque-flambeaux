"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateMatchesForTournament } from "@/actions/match.actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export function GenerateMatchesButton({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setError(null);
    startTransition(async () => {
      try {
        await generateMatchesForTournament(tournamentId);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            className="px-8 py-6 text-lg font-bold bg-primary hover:bg-princeton-orange-600 shadow-lg"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            {isPending ? "Génération..." : "Générer le Planning"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Générer le planning ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action créera tous les matchs possibles pour ce tournoi. Voulez-vous continuer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleGenerate}
              className="bg-primary hover:bg-princeton-orange-600"
            >
              Générer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
