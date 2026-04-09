"use server";

import { prisma } from "@/lib/prisma";
import { MatchStatus } from "@prisma/client";
import { eventEmitter } from "@/lib/eventEmitter";

export async function generateMatchesForTournament(tournamentId: string) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { teams: true },
    });

    if (!tournament) throw new Error("Tournoi non trouvé");
    if (tournament.teams.length < 2) throw new Error("Il faut au moins 2 équipes");

    const teams = [...tournament.teams];
    const numFields = tournament.numberOfFields;
    
    // Algorithme de Berger (Circle Method) pour Round-Robin
    const n = teams.length;
    const isOdd = n % 2 !== 0;
    const virtualN = isOdd ? n + 1 : n;
    
    const scheduledMatches = [];
    const teamIndices = Array.from({ length: virtualN }, (_, i) => i);

    const rounds = virtualN - 1;
    const matchesPerRound = virtualN / 2;

    for (let r = 0; r < rounds; r++) {
      for (let i = 0; i < matchesPerRound; i++) {
        const homeIdx = teamIndices[i];
        const awayIdx = teamIndices[virtualN - 1 - i];
        
        // Si c'est une équipe réelle (pas le bye d'un nombre impair)
        if (!isOdd || (homeIdx < n && awayIdx < n)) {
          scheduledMatches.push({
            teamAId: teams[homeIdx].id,
            teamBId: teams[awayIdx].id,
          });
        }
      }
      
      // Rotation : on garde le premier élément (0) et on décale les autres circulairement
      const last = teamIndices.pop()!;
      teamIndices.splice(1, 0, last);
    }

    // Création des matchs en base avec répartition sur les terrains
    const createMatches = scheduledMatches.map((m, index) => {
      const fieldIndex = (index % numFields) + 1;
      const roundNumber = Math.floor(index / numFields) + 1;
      const terrainLabel = `Terrain ${fieldIndex}`;
      return prisma.match.create({
        data: {
          tournamentId,
          teamAId: m.teamAId,
          teamBId: m.teamBId,
          fieldName: terrainLabel,
          terrain: terrainLabel,
          manche: roundNumber,
          status: MatchStatus.PENDING,
          scoreTeamA: 0,
          scoreTeamB: 0,
          homeRunsTeamA: 0,
          homeRunsTeamB: 0,
          ballesGobeesTeamA: 0,
          ballesGobeesTeamB: 0,
          statsTeamA: {},
          statsTeamB: {},
        },
      });
    });

    await Promise.all(createMatches);
    return { success: true, count: scheduledMatches.length };
  } catch (error) {
    console.error("Error generating matches:", error);
    throw new Error("Erreur lors de la génération du planning");
  }
}

interface UpdateMatchData {
  matchId: string;
  fieldName?: string;
  terrain?: string;
  manche?: number;
}

export async function updateMatch(data: UpdateMatchData) {
  try {
    const updatedMatch = await prisma.match.update({
      where: { id: data.matchId },
      data: {
        fieldName: data.fieldName,
        terrain: data.terrain,
        manche: data.manche,
      },
      include: { teamA: true, teamB: true }
    });

    eventEmitter.emit('matchUpdated', updatedMatch);
    return updatedMatch;
  } catch (error) {
    console.error("Error updating match:", error);
    throw new Error("Erreur lors de la mise à jour du match");
  }
}

interface UpdateMatchScoreData {
  matchId: string;
  team: 'A' | 'B';
  pointsToAdd: number;
}

export async function updateMatchScore(data: UpdateMatchScoreData) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
    });

    if (!match) throw new Error("Match non trouvé");

    const updatedMatch = await prisma.match.update({
      where: { id: data.matchId },
      data: { 
        scoreTeamA: data.team === 'A' ? Math.max(0, match.scoreTeamA + data.pointsToAdd) : undefined,
        scoreTeamB: data.team === 'B' ? Math.max(0, match.scoreTeamB + data.pointsToAdd) : undefined,
      },
      include: { teamA: true, teamB: true }
    });

    eventEmitter.emit('matchUpdated', updatedMatch);
    return updatedMatch;
  } catch (error) {
    console.error("Error updating match score:", error);
    throw new Error("Erreur lors de la mise à jour du score");
  }
}

interface AddMatchStatData {
  matchId: string;
  team: 'A' | 'B';
  statType: 'homeRun' | 'ballesGobee';
  increment?: number;
}

export async function addMatchStat(data: AddMatchStatData) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
    });

    if (!match) throw new Error("Match non trouvé");

    const statField = data.statType === 'homeRun' 
      ? (data.team === 'A' ? 'homeRunsTeamA' : 'homeRunsTeamB')
      : (data.team === 'A' ? 'ballesGobeesTeamA' : 'ballesGobeesTeamB');

    const updatedMatch = await prisma.match.update({
      where: { id: data.matchId },
      data: { 
        [statField]: Math.max(0, (match[statField as keyof typeof match] as number || 0) + (data.increment ?? 1))
      },
      include: { teamA: true, teamB: true }
    });

    eventEmitter.emit('matchUpdated', updatedMatch);
    return updatedMatch;
  } catch (error: any) {
    console.error("Error adding match stat:", error);
    throw new Error(`Erreur lors de l'ajout de la statistique : ${error.message || 'Erreur inconnue'}`);
  }
}

export async function updateMatchStatus(matchId: string, status: MatchStatus) {
  try {
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: { status },
      include: { teamA: true, teamB: true }
    });

    eventEmitter.emit('matchUpdated', updatedMatch);
    return updatedMatch;
  } catch (error) {
    console.error("Error updating match status:", error);
    throw new Error("Erreur lors de la mise à jour du statut");
  }
}

export async function resetMatch(matchId: string) {
  try {
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: MatchStatus.PENDING,
        scoreTeamA: 0,
        scoreTeamB: 0,
        homeRunsTeamA: 0,
        homeRunsTeamB: 0,
        ballesGobeesTeamA: 0,
        ballesGobeesTeamB: 0,
        statsTeamA: {},
        statsTeamB: {},
      },
      include: { teamA: true, teamB: true }
    });

    eventEmitter.emit('matchUpdated', updatedMatch);
    return updatedMatch;
  } catch (error) {
    console.error("Error resetting match:", error);
    throw new Error("Erreur lors de la réinitialisation du match");
  }
}
