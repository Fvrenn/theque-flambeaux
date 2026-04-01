"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateMatchScore, addMatchStat, updateMatchStatus } from "@/actions/match.actions";
import { Button } from "@/components/ui/button";
import { MatchStatus } from "@prisma/client";
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
import { Minus, Plus, Trophy, Target } from "lucide-react";

interface RemoteProps {
  match: {
    id: string;
    status: MatchStatus;
    teamA: { id: string; name: string; color: string };
    teamB: { id: string; name: string; color: string };
    scoreTeamA: number;
    scoreTeamB: number;
    statsTeamA: any;
    statsTeamB: any;
  };
}

export function RefereeRemoteControl({ match }: RemoteProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isFinished = match.status === MatchStatus.FINISHED;

  const statsA = (match.statsTeamA as Record<string, number>) || { homeRun: 0, balleGobee: 0 };
  const statsB = (match.statsTeamB as Record<string, number>) || { homeRun: 0, balleGobee: 0 };

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

  async function finishMatch() {
    handleAction(() => updateMatchStatus(match.id, MatchStatus.FINISHED));
  }

  const TeamControl = ({ 
    team, 
    score, 
    stats, 
    teamKey 
  }: { 
    team: { name: string, color: string }, 
    score: number, 
    stats: any, 
    teamKey: 'A' | 'B' 
  }) => (
    <div className="flex flex-col gap-4 p-4 h-full bg-white">
      <div className="text-center mb-2">
        <h3 className="font-black uppercase text-sm tracking-widest opacity-60 mb-1">{team.name}</h3>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-2"
            disabled={isPending || isFinished || score === 0}
            onClick={() => handleAction(() => updateMatchScore({ matchId: match.id, team: teamKey, pointsToAdd: -1 }))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-6xl font-black tabular-nums">{score}</span>
          <Button
            className="h-10 w-10 shadow-md"
            style={{ backgroundColor: team.color }}
            disabled={isPending || isFinished}
            onClick={() => handleAction(() => updateMatchScore({ matchId: match.id, team: teamKey, pointsToAdd: 1 }))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {/* Home Runs */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
             <span className="text-[10px] font-bold uppercase text-slate-400">Home Runs</span>
             <span className="text-lg font-black">{stats.homeRun || 0}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-20 text-xs font-bold border-2 flex flex-col gap-1"
              style={{ borderColor: team.color, color: team.color }}
              disabled={isPending || isFinished}
              onClick={() => handleAction(() => {
                updateMatchScore({ matchId: match.id, team: teamKey, pointsToAdd: 2 });
                return addMatchStat({ matchId: match.id, team: teamKey, statType: 'homeRun', increment: 1 });
              })}
            >
              <Trophy className="h-5 w-5" />
              <span>HOME RUN</span>
              <span className="text-[9px] opacity-70">+2 PTS</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-20 w-12 bg-slate-50 border border-slate-100"
              disabled={isPending || isFinished || !stats.homeRun}
              onClick={() => handleAction(() => {
                updateMatchScore({ matchId: match.id, team: teamKey, pointsToAdd: -2 });
                return addMatchStat({ matchId: match.id, team: teamKey, statType: 'homeRun', increment: -1 });
              })}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Balles Gobées */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
             <span className="text-[10px] font-bold uppercase text-slate-400">Balles Gobées</span>
             <span className="text-lg font-black">{stats.balleGobee || 0}</span>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1 h-20 text-xs font-bold bg-slate-800 hover:bg-slate-900 flex flex-col gap-1"
              disabled={isPending || isFinished}
              onClick={() => handleAction(() => addMatchStat({ matchId: match.id, team: teamKey, statType: 'balleGobee', increment: 1 }))}
            >
              <Target className="h-5 w-5 text-princeton-orange-400" />
              <span>BALLE GOBÉE</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-20 w-12 bg-slate-50 border border-slate-100"
              disabled={isPending || isFinished || !stats.balleGobee}
              onClick={() => handleAction(() => addMatchStat({ matchId: match.id, team: teamKey, statType: 'balleGobee', increment: -1 }))}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-slate-100 overflow-hidden">
      {isFinished && (
        <div className="bg-red-600 text-white text-center py-2 text-xs font-black uppercase tracking-widest animate-pulse shrink-0">
          Match Terminé - Score Figé
        </div>
      )}

      {isPending && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-50 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
        <div className="border-b md:border-b-0 md:border-r border-slate-200">
          <TeamControl team={match.teamA} score={match.scoreTeamA} stats={statsA} teamKey="A" />
        </div>
        <div>
          <TeamControl team={match.teamB} score={match.scoreTeamB} stats={statsB} teamKey="B" />
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        {!isFinished ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="w-full h-16 text-xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                disabled={isPending}
              >
                Terminer le Match
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[90vw] rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Clôturer le match ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Es-tu sûr de vouloir clôturer le match ? Le score sera définitivement figé.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row gap-2">
                <AlertDialogCancel className="flex-1 mt-0">Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={finishMatch}
                >
                  Confirmer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <div className="space-y-4">
            <Button 
              variant="outline"
              className="w-full h-16 text-xl font-black uppercase tracking-widest"
              onClick={() => router.push('/referee')}
            >
              Retour aux terrains
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost"
                  size="sm"
                  className="w-full text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                  disabled={isPending}
                >
                  <Undo2 className="h-3 w-3 mr-1" />
                  ERREUR ? REPRENDRE LE MATCH
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90vw] rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Reprendre l'arbitrage ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Voulez-vous réouvrir ce match pour corriger le score ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-2">
                  <AlertDialogCancel className="flex-1 mt-0">Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    className="flex-1 bg-primary hover:bg-princeton-orange-600"
                    onClick={() => handleAction(() => updateMatchStatus(match.id, MatchStatus.IN_PROGRESS))}
                  >
                    Reprendre
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
