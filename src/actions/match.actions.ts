"use server";

import { prisma } from "@/lib/prisma";
import { MatchStatus, Category } from "@prisma/client";
import { eventEmitter } from "@/lib/eventEmitter";

export async function generateMatchesForTournament(tournamentId: string, category: Category) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { 
        teams: {
          where: { category }
        } 
      },
    });

    if (!tournament) throw new Error("Tournoi non trouvé");
    if (tournament.teams.length < 2) throw new Error(`Il faut au moins 2 équipes dans la catégorie ${category}`);

    const teams = [...tournament.teams];
    const numFields = tournament.numberOfFields;
    const fieldNames = Array.from({ length: numFields }, (_, i) => `Terrain ${i + 1}`);

    // 1. Initialisation du suivi d'utilisation des terrains par chaque équipe
    const teamFieldUsage: Record<string, Record<string, number>> = {};
    teams.forEach(t => {
      teamFieldUsage[t.id] = {};
      fieldNames.forEach(f => {
        teamFieldUsage[t.id][f] = 0;
      });
    });
    
    // 2. Algorithme de Berger (Circle Method) pour Round-Robin groupé par Manches
    const n = teams.length;
    const isOdd = n % 2 !== 0;
    const virtualN = isOdd ? n + 1 : n;
    
    const teamIndices = Array.from({ length: virtualN }, (_, i) => i);
    const rounds = virtualN - 1;
    const matchesPerRound = virtualN / 2;

    const matchesToCreate = [];

    for (let r = 0; r < rounds; r++) {
      const roundNumber = r + 1;
      const roundMatches = [];

      // Déterminer les affrontements de cette manche
      for (let i = 0; i < matchesPerRound; i++) {
        const homeIdx = teamIndices[i];
        const awayIdx = teamIndices[virtualN - 1 - i];
        
        if (!isOdd || (homeIdx < n && awayIdx < n)) {
          roundMatches.push({
            teamAId: teams[homeIdx].id,
            teamBId: teams[awayIdx].id,
          });
        }
      }

      // 3 & 4. Assignation équitable des terrains pour cette manche
      let availableFieldsInRound = [...fieldNames];

      for (const m of roundMatches) {
        // Si tous les terrains ont déjà été utilisés dans cette manche, on réinitialise le pool
        if (availableFieldsInRound.length === 0) {
          availableFieldsInRound = [...fieldNames];
        }

        // Trier les terrains disponibles par utilisation cumulée la plus basse pour les deux équipes
        availableFieldsInRound.sort((fieldA, fieldB) => {
          const usageA = (teamFieldUsage[m.teamAId][fieldA] || 0) + (teamFieldUsage[m.teamBId][fieldA] || 0);
          const usageB = (teamFieldUsage[m.teamAId][fieldB] || 0) + (teamFieldUsage[m.teamBId][fieldB] || 0);
          return usageA - usageB;
        });

        // On prend le terrain le moins utilisé
        const selectedField = availableFieldsInRound.shift()!;
        
        // 5. Incrémenter les compteurs pour les deux équipes
        teamFieldUsage[m.teamAId][selectedField]++;
        teamFieldUsage[m.teamBId][selectedField]++;

        matchesToCreate.push({
          teamAId: m.teamAId,
          teamBId: m.teamBId,
          roundNumber,
          selectedField
        });
      }
      
      // Rotation Berger pour la manche suivante
      const last = teamIndices.pop()!;
      teamIndices.splice(1, 0, last);
    }

    // Création des matchs en base de données
    const createMatches = matchesToCreate.map((m) => {
      return prisma.match.create({
        data: {
          tournamentId,
          category,
          teamAId: m.teamAId,
          teamBId: m.teamBId,
          fieldName: m.selectedField,
          terrain: m.selectedField,
          manche: m.roundNumber,
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
    return { success: true, count: matchesToCreate.length };
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
  category?: Category;
}

export async function updateMatch(data: UpdateMatchData) {
  try {
    const updatedMatch = await prisma.match.update({
      where: { id: data.matchId },
      data: {
        fieldName: data.fieldName,
        terrain: data.terrain,
        manche: data.manche,
        category: data.category,
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
