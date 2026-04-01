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

    const teams = tournament.teams;
    const matchesData = [];
    const numFields = tournament.numberOfFields;

    // Génération Round-Robin (chaque équipe contre toutes les autres une fois)
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matchesData.push({
          teamAId: teams[i].id,
          teamBId: teams[j].id,
        });
      }
    }

    // Création des matchs en base avec répartition sur les terrains
    const createMatches = matchesData.map((m, index) => {
      const fieldIndex = (index % numFields) + 1;
      return prisma.match.create({
        data: {
          tournamentId,
          teamAId: m.teamAId,
          teamBId: m.teamBId,
          fieldName: `Terrain ${fieldIndex}`,
          status: MatchStatus.PENDING,
          statsTeamA: { homeRun: 0, balleGobee: 0 },
          statsTeamB: { homeRun: 0, balleGobee: 0 },
        },
      });
    });

    await Promise.all(createMatches);
    return { success: true, count: matchesData.length };
  } catch (error) {
    console.error("Error generating matches:", error);
    throw new Error("Erreur lors de la génération des matchs");
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
  statType: 'homeRun' | 'balleGobee';
  increment?: number;
}

export async function addMatchStat(data: AddMatchStatData) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
    });

    if (!match) throw new Error("Match non trouvé");

    const statKey = data.team === 'A' ? 'statsTeamA' : 'statsTeamB';
    const currentStats = (match[statKey] as Record<string, number>) || { homeRun: 0, balleGobee: 0 };
    
    const newStats = {
      ...currentStats,
      [data.statType]: Math.max(0, (currentStats[data.statType] || 0) + (data.increment ?? 1)),
    };

    const updatedMatch = await prisma.match.update({
      where: { id: data.matchId },
      data: { [statKey]: newStats },
      include: { teamA: true, teamB: true }
    });

    eventEmitter.emit('matchUpdated', updatedMatch);
    return updatedMatch;
  } catch (error) {
    console.error("Error adding match stat:", error);
    throw new Error("Erreur lors de l'ajout de la statistique");
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
        statsTeamA: { homeRun: 0, balleGobee: 0 },
        statsTeamB: { homeRun: 0, balleGobee: 0 },
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
