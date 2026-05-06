"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateMatchesForTournament } from "@/actions/match.actions";
import { Category } from "@prisma/client";
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

interface GenerateMatchesButtonProps {
  tournamentId: string;
  category: Category;
}

export function GenerateMatchesButton({ tournamentId, category }: GenerateMatchesButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setError(null);
    startTransition(async () => {
      try {
        await generateMatchesForTournament(tournamentId, category);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            className="w-full bg-primary hover:bg-princeton-orange-600 shadow-lg"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isPending ? "Génération..." : `Générer le Planning ${category}`}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Générer le planning {category} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action créera tous les matchs possibles pour la catégorie {category}. Voulez-vous continuer ?
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
