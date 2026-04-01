import { Team, Match } from "@prisma/client";

export interface TeamRanking extends Team {
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  homeRuns: number;
  ballesGobees: number;
  bo: number; // Bonus Offensif
  bd: number; // Bonus Défensif
}

/**
 * Calcule les points de tournoi pour un match donné.
 * Victoire: 2pts, Égalité: 1pt, Défaite: 0pt.
 * Bonus Offensif (BO): +1 si gagnant et diff > 5.
 * Bonus Défensif (BD): +1 si perdant et diff < 5.
 */
export function calculateMatchTournamentPoints(match: Match) {
  let pointsA = 0;
  let pointsB = 0;
  let boA = 0;
  let boB = 0;
  let bdA = 0;
  let bdB = 0;
  
  const diff = Math.abs(match.scoreTeamA - match.scoreTeamB);

  if (match.scoreTeamA > match.scoreTeamB) {
    pointsA = 2;
    if (diff > 5) {
      pointsA += 1; // Bonus offensif
      boA = 1;
    }
    if (diff < 5) {
      pointsB += 1; // Bonus défensif
      bdB = 1;
    }
  } else if (match.scoreTeamA < match.scoreTeamB) {
    pointsB = 2;
    if (diff > 5) {
      pointsB += 1; // Bonus offensif
      boB = 1;
    }
    if (diff < 5) {
      pointsA += 1; // Bonus défensif
      bdA = 1;
    }
  } else {
    pointsA = 1;
    pointsB = 1;
  }

  return { pointsA, pointsB, boA, boB, bdA, bdB };
}

export function calculateRanking(teams: Team[], matches: Match[]): TeamRanking[] {
  const rankingMap = new Map<string, TeamRanking>();

  teams.forEach((team) => {
    rankingMap.set(team.id, {
      ...team,
      points: 0,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      homeRuns: 0,
      ballesGobees: 0,
      bo: 0,
      bd: 0,
    });
  });

  const finishedMatches = matches.filter((m) => m.status === "FINISHED");

  finishedMatches.forEach((match) => {
    const teamA = rankingMap.get(match.teamAId);
    const teamB = rankingMap.get(match.teamBId);

    if (teamA && teamB) {
      teamA.played += 1;
      teamB.played += 1;
      teamA.goalsFor += match.scoreTeamA;
      teamA.goalsAgainst += match.scoreTeamB;
      teamB.goalsFor += match.scoreTeamB;
      teamB.goalsAgainst += match.scoreTeamA;

      // Stats individuelles
      const statsA = (match.statsTeamA as any) || { homeRun: 0, balleGobee: 0 };
      const statsB = (match.statsTeamB as any) || { homeRun: 0, balleGobee: 0 };
      teamA.homeRuns += statsA.homeRun || 0;
      teamA.ballesGobees += statsA.balleGobee || 0;
      teamB.homeRuns += statsB.homeRun || 0;
      teamB.ballesGobees += statsB.balleGobee || 0;

      // Calcul des points de tournoi
      const { pointsA, pointsB, boA, boB, bdA, bdB } = calculateMatchTournamentPoints(match);
      teamA.points += pointsA;
      teamB.points += pointsB;
      teamA.bo += boA;
      teamB.bo += boB;
      teamA.bd += bdA;
      teamB.bd += bdB;

      if (match.scoreTeamA > match.scoreTeamB) {
        teamA.wins += 1;
        teamB.losses += 1;
      } else if (match.scoreTeamA < match.scoreTeamB) {
        teamB.wins += 1;
        teamA.losses += 1;
      } else {
        teamA.draws += 1;
        teamB.draws += 1;
      }
    }
  });

  return Array.from(rankingMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;
    if (diffB !== diffA) return diffB - diffA;
    return b.homeRuns - a.homeRuns; // Second tie-breaker: home runs
  });
}
