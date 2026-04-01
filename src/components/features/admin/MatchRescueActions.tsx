"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateMatchStatus, resetMatch } from "@/actions/match.actions";
import { Button } from "@/components/ui/button";
import { MatchStatus } from "@prisma/client";
import { RotateCcw, Undo2, Loader2 } from "lucide-react";
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

export function MatchRescueActions({ matchId, status }: { matchId: string, status: MatchStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleAction(action: () => Promise<any>) {
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  }

  if (status === "PENDING") return null;

  return (
    <div className="flex gap-2 justify-end">
      {status === "FINISHED" && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[10px] font-bold"
          disabled={isPending}
          onClick={() => handleAction(() => updateMatchStatus(matchId, MatchStatus.IN_PROGRESS))}
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Undo2 className="h-3 w-3 mr-1" />}
          RÉOUVRIR
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[10px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3 mr-1" />}
            RESET
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser le match ?</AlertDialogTitle>
            <AlertDialogDescription>
              Attention : les scores et statistiques seront remis à zéro et le match repassera en attente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleAction(() => resetMatch(matchId))}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmer le Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
