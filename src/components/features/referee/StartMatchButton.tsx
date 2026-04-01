"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateMatchStatus } from "@/actions/match.actions";
import { Button } from "@/components/ui/button";
import { MatchStatus } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export function StartMatchButton({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setError(null);
    startTransition(async () => {
      try {
        await updateMatchStatus(matchId, MatchStatus.IN_PROGRESS);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold">Prêt pour le match ?</h3>
        <p className="text-slate-500">Appuyez sur le bouton pour lancer le chronomètre.</p>
      </div>
      <Button 
        onClick={handleStart} 
        disabled={isPending}
        className="w-full max-w-xs h-24 text-2xl font-black bg-green-600 hover:bg-green-700 shadow-xl transition-all active:scale-95"
      >
        {isPending ? <Loader2 className="mr-2 h-8 w-8 animate-spin" /> : "DÉMARRER"}
      </Button>

      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Erreur</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
