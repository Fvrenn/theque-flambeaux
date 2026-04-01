"use server";

import { prisma } from "@/lib/prisma";
import { MatchStatus } from "@prisma/client";

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

    if (data.team === 'A') {
      return await prisma.match.update({
        where: { id: data.matchId },
        data: { scoreTeamA: match.scoreTeamA + data.pointsToAdd },
      });
    } else {
      return await prisma.match.update({
        where: { id: data.matchId },
        data: { scoreTeamB: match.scoreTeamB + data.pointsToAdd },
      });
    }
  } catch (error) {
    console.error("Error updating match score:", error);
    throw new Error("Erreur lors de la mise à jour du score");
  }
}

interface AddMatchStatData {
  matchId: string;
  team: 'A' | 'B';
  statType: 'homeRun' | 'balleGobee';
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
      [data.statType]: (currentStats[data.statType] || 0) + 1,
    };

    return await prisma.match.update({
      where: { id: data.matchId },
      data: { [statKey]: newStats },
    });
  } catch (error) {
    console.error("Error adding match stat:", error);
    throw new Error("Erreur lors de l'ajout de la statistique");
  }
}

export async function updateMatchStatus(matchId: string, status: MatchStatus) {
  try {
    return await prisma.match.update({
      where: { id: matchId },
      data: { status },
    });
  } catch (error) {
    console.error("Error updating match status:", error);
    throw new Error("Erreur lors de la mise à jour du statut");
  }
}
