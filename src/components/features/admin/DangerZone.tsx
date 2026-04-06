"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { wipeChat, deleteAllMatches, deleteAllTeams, resetFullTournament } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export function DangerZone({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAction(action: (id: string) => Promise<any>, useId: boolean = true) {
    setLoading(true);
    try {
      if (useId) {
        await action(tournamentId);
      } else {
        await (action as any)();
      }
      router.refresh();
      if (action === resetFullTournament) {
        router.push("/admin");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  const DangerAction = ({ 
    title, 
    description, 
    buttonText, 
    onAction,
    useId = true
  }: { 
    title: string; 
    description: string; 
    buttonText: string; 
    onAction: (id: string) => Promise<any>;
    useId?: boolean
  }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="w-full text-[10px] font-bold uppercase tracking-wider">
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description} Cette action est irréversible et supprimera les données définitivement de la base de données.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => handleAction(onAction, useId)}
            className="bg-red-600 hover:bg-red-700"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <Card className="border-red-200 shadow-sm bg-red-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-black text-red-600 uppercase tracking-widest">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <DangerAction 
          title="Vider tout le Chat ?" 
          description="Tous les messages envoyés dans le direct seront supprimés."
          buttonText="Vider Chat"
          onAction={wipeChat as any}
          useId={false}
        />
        <DangerAction 
          title="Supprimer tous les Matchs ?" 
          description="Tous les matchs créés pour ce tournoi seront supprimés."
          buttonText="Supprimer Matchs"
          onAction={deleteAllMatches}
        />
        <DangerAction 
          title="Supprimer toutes les Équipes ?" 
          description="Toutes les équipes et les matchs associés seront supprimés."
          buttonText="Supprimer Équipes"
          onAction={deleteAllTeams}
        />
        <DangerAction 
          title="Réinitialiser le tournoi ?" 
          description="Ceci supprimera le tournoi, toutes les équipes, les matchs et les messages."
          buttonText="Reset Tournoi"
          onAction={resetFullTournament}
        />
      </CardContent>
    </Card>
  );
}
