"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateMatchScore, addMatchStat, updateMatchStatus } from "@/actions/match.actions";
import { Button } from "@/components/ui/button";
import { MatchStatus } from "@prisma/client";
import { Undo2, Trophy, Target, RefreshCw, Minus } from "lucide-react";
import { RefereeTimer } from "./RefereeTimer";
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

interface RemoteProps {
  match: {
    id: string;
    status: MatchStatus;
    teamA: { id: string; name: string; color: string };
    teamB: { id: string; name: string; color: string };
    scoreTeamA: number;
    scoreTeamB: number;
    homeRunsTeamA: number;
    homeRunsTeamB: number;
    ballesGobeesTeamA: number;
    ballesGobeesTeamB: number;
  };
}

export function RefereeRemoteControl({ match }: RemoteProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [attackingTeamId, setAttackingTeamId] = useState(match.teamA.id);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerResetCounter, setTimerResetCounter] = useState(0);

  const isFinished = match.status === MatchStatus.FINISHED;
  const isTeamAAttacking = attackingTeamId === match.teamA.id;
  
  const attackingTeam = isTeamAAttacking ? match.teamA : match.teamB;
  const defendingTeam = isTeamAAttacking ? match.teamB : match.teamA;
  
  const attackingTeamKey = isTeamAAttacking ? 'A' : 'B';
  const defendingTeamKey = isTeamAAttacking ? 'B' : 'A';

  const attackingScore = isTeamAAttacking ? match.scoreTeamA : match.scoreTeamB;
  const defendingScore = isTeamAAttacking ? match.scoreTeamB : match.scoreTeamA;

  const attackingHomeRuns = isTeamAAttacking ? match.homeRunsTeamA : match.homeRunsTeamB;
  const defendingBallesGobees = isTeamAAttacking ? match.ballesGobeesTeamB : match.ballesGobeesTeamA;

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

  const toggleAttackingTeam = () => {
    setAttackingTeamId(prev => prev === match.teamA.id ? match.teamB.id : match.teamA.id);
    // 2. RESET DU CHRONO AU CHANGEMENT DE CAMP
    setTimerResetCounter(prev => prev + 1);
  };

  const isButtonsDisabled = isPending || isFinished || !isTimerRunning;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* 2. LE CHRONO FIXE ET LE VERROUILLAGE DES SCORES */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-4 shadow-sm">
        <RefereeTimer isRunning={isTimerRunning} setIsRunning={setIsTimerRunning} resetTrigger={timerResetCounter} />
        {!isTimerRunning && !isFinished && (
          <p className="text-[10px] text-center font-bold text-princeton-orange-600 uppercase mt-2 animate-pulse">
            Lancez le chrono pour déverrouiller les boutons
          </p>
        )}
      </div>

      {isFinished && (
        <div className="bg-red-600 text-white text-center py-2 text-xs font-black uppercase tracking-widest animate-pulse shrink-0">
          Match Terminé - Score Figé
        </div>
      )}

      {isPending && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-[1px] z-[60] flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* 1 & 3. GESTION DE L'ÉTAT "ATTAQUE / DÉFENSE" ET BOUTONS DE PHASE DE JEU */}
      <div className="flex-1 p-4 flex flex-col gap-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En attaque</span>
          <h2 className="text-3xl font-black uppercase tracking-tight" style={{ color: attackingTeam.color }}>
            {attackingTeam.name}
          </h2>
          <div className="flex justify-center items-baseline gap-2">
            <span className="text-5xl font-black tabular-nums">{attackingScore}</span>
            <span className="text-slate-300 text-xl font-bold">vs</span>
            <span className="text-2xl font-bold text-slate-400 tabular-nums">{defendingScore}</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Action : Points Classiques */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Points Tour Complet</span>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 h-24 text-xl font-black flex flex-col gap-1 shadow-md transition-colors duration-200 active:opacity-70"
                style={{ backgroundColor: attackingTeam.color }}
                disabled={isButtonsDisabled}
                onClick={() => handleAction(() => updateMatchScore({ matchId: match.id, team: attackingTeamKey, pointsToAdd: 1 }))}
              >
                <span className="text-4xl">+1</span>
                <span className="text-[10px] uppercase tracking-wider">Point</span>
              </Button>
              <Button
                variant="outline"
                className="w-16 h-24 border-2 border-slate-200 flex items-center justify-center transition-colors duration-200 active:opacity-70"
                disabled={isButtonsDisabled || attackingScore === 0}
                onClick={() => handleAction(() => updateMatchScore({ matchId: match.id, team: attackingTeamKey, pointsToAdd: -1 }))}
              >
                <Minus className="h-6 w-6 text-slate-400" />
              </Button>
            </div>
          </div>

          {/* Action : Home Run */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Home Runs (Total: {attackingHomeRuns})</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-24 text-xl font-black flex flex-col gap-1 shadow-sm border-2 transition-colors duration-200 active:opacity-70"
                style={{ borderColor: attackingTeam.color, color: attackingTeam.color }}
                disabled={isButtonsDisabled}
                onClick={() => handleAction(async () => {
                  await updateMatchScore({ matchId: match.id, team: attackingTeamKey, pointsToAdd: 2 });
                  return await addMatchStat({ matchId: match.id, team: attackingTeamKey, statType: 'homeRun', increment: 1 });
                })}
              >
                <Trophy className="h-6 w-6" />
                <span className="text-[10px] uppercase tracking-wider text-center">HOME RUN (+2 PTS)</span>
              </Button>
              <Button
                variant="outline"
                className="w-16 h-24 border-2 border-slate-200 flex items-center justify-center transition-colors duration-200 active:opacity-70"
                disabled={isButtonsDisabled || attackingHomeRuns === 0}
                onClick={() => handleAction(async () => {
                  await updateMatchScore({ matchId: match.id, team: attackingTeamKey, pointsToAdd: -2 });
                  return await addMatchStat({ matchId: match.id, team: attackingTeamKey, statType: 'homeRun', increment: -1 });
                })}
              >
                <Minus className="h-6 w-6 text-slate-400" />
              </Button>
            </div>
          </div>

          {/* Action : Balle Gobée (Défense) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Balles Gobées {defendingTeam.name} (Total: {defendingBallesGobees})</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1 h-24 text-lg font-black bg-slate-800 hover:bg-slate-900 text-white flex flex-col gap-1 shadow-md transition-colors duration-200 active:opacity-70"
                disabled={isButtonsDisabled}
                onClick={() => handleAction(() => addMatchStat({ matchId: match.id, team: defendingTeamKey, statType: 'ballesGobee', increment: 1 }))}
              >
                <Target className="h-5 w-5 text-princeton-orange-400" />
                <span className="text-[10px] uppercase tracking-wide text-center">+1 BALLE GOBÉE</span>
              </Button>
              <Button
                variant="outline"
                className="w-16 h-24 border-2 border-slate-200 flex items-center justify-center transition-colors duration-200 active:opacity-70"
                disabled={isButtonsDisabled || defendingBallesGobees === 0}
                onClick={() => handleAction(() => addMatchStat({ matchId: match.id, team: defendingTeamKey, statType: 'ballesGobee', increment: -1 }))}
              >
                <Minus className="h-6 w-6 text-slate-400" />
              </Button>
            </div>
          </div>
        </div>

        {/* 4. CHANGEMENT DE CAMP */}
        <Button
          variant="outline"
          className="mt-4 h-16 border-2 border-slate-200 text-slate-600 font-black uppercase tracking-widest flex items-center justify-center gap-3 bg-white hover:bg-slate-50 transition-colors duration-200 active:opacity-70"
          onClick={toggleAttackingTeam}
          disabled={isPending || isFinished}
        >
          <RefreshCw className="h-5 w-5" />
          Changement de camp
        </Button>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-4 bg-white border-t border-slate-200 mt-auto sticky bottom-0">
        {!isFinished ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full h-14 text-sm font-black uppercase tracking-widest shadow-lg transition-colors duration-200 active:opacity-70"
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
              className="w-full h-14 text-sm font-black uppercase tracking-widest"
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
