"use server";

import { prisma } from "@/lib/prisma";
import type { MatchStatus } from "../../generated/prisma/enums";

interface UpdateScoreData {
  matchId: string;
  team: "A" | "B";
  pointsToAdd: number;
}

interface AddStatData {
  matchId: string;
  team: "A" | "B";
  statType: "homeRun" | "balleGobee";
}

interface TeamStats {
  homeRuns: number;
  ballesGobees: number;
}

interface MatchPairing {
  teamAId: string;
  teamBId: string;
  fieldName: string;
}

function generateRoundRobinPairings(teamIds: string[], numberOfFields: number): MatchPairing[] {
  const pairings: MatchPairing[] = [];

  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      const fieldIndex = pairings.length % numberOfFields;

      pairings.push({
        teamAId: teamIds[i],
        teamBId: teamIds[j],
        fieldName: `Terrain ${fieldIndex + 1}`,
      });
    }
  }

  return pairings;
}

export async function generateMatchesForTournament(tournamentId: string) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { teams: true },
    });

    if (!tournament) {
      throw new Error("Tournoi introuvable");
    }

    if (tournament.teams.length < 2) {
      throw new Error("Il faut au moins 2 équipes pour générer les matchs");
    }

    const teamIds = tournament.teams.map((team) => team.id);
    const pairings = generateRoundRobinPairings(teamIds, tournament.numberOfFields);

    const matchData = pairings.map((pairing) => ({
      fieldName: pairing.fieldName,
      tournamentId,
      teamAId: pairing.teamAId,
      teamBId: pairing.teamBId,
    }));

    return await prisma.match.createMany({ data: matchData });
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(`Impossible de générer les matchs : ${error}`);
  }
}

export async function updateMatchScore(data: UpdateScoreData) {
  const scoreField = data.team === "A" ? "scoreTeamA" : "scoreTeamB";

  try {
    return await prisma.match.update({
      where: { id: data.matchId },
      data: { [scoreField]: { increment: data.pointsToAdd } },
    });
  } catch (error) {
    throw new Error(`Impossible de mettre à jour le score : ${error}`);
  }
}

export async function addMatchStat(data: AddStatData) {
  const statsField = data.team === "A" ? "statsTeamA" : "statsTeamB";
  const statKey = data.statType === "homeRun" ? "homeRuns" : "ballesGobees";

  try {
    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
    });

    if (!match) {
      throw new Error("Match introuvable");
    }

    const currentStats = match[statsField] as unknown as TeamStats;
    const updatedStats: TeamStats = {
      ...currentStats,
      [statKey]: (currentStats[statKey] ?? 0) + 1,
    };

    return await prisma.match.update({
      where: { id: data.matchId },
      data: { [statsField]: updatedStats },
    });
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(`Impossible d'ajouter la statistique : ${error}`);
  }
}

export async function updateMatchStatus(matchId: string, status: MatchStatus) {
  try {
    return await prisma.match.update({
      where: { id: matchId },
      data: { status },
    });
  } catch (error) {
    throw new Error(`Impossible de changer le statut du match : ${error}`);
  }
}
