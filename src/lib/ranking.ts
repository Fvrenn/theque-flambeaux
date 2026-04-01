import type { Team, Match } from "../../generated/prisma/client";

const POINTS_VICTORY = 2;
const POINTS_DRAW = 1;
const POINTS_DEFEAT = 0;

export interface TeamRanking {
  team: Team;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

function createEmptyRanking(team: Team): TeamRanking {
  return {
    team,
    points: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
  };
}

function applyMatchResult(ranking: TeamRanking, scored: number, conceded: number): void {
  ranking.goalsFor += scored;
  ranking.goalsAgainst += conceded;

  if (scored > conceded) {
    ranking.wins++;
    ranking.points += POINTS_VICTORY;
  } else if (scored === conceded) {
    ranking.draws++;
    ranking.points += POINTS_DRAW;
  } else {
    ranking.losses++;
    ranking.points += POINTS_DEFEAT;
  }
}

function sortByPoints(a: TeamRanking, b: TeamRanking): number {
  if (b.points !== a.points) return b.points - a.points;

  const goalDiffA = a.goalsFor - a.goalsAgainst;
  const goalDiffB = b.goalsFor - b.goalsAgainst;
  if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;

  return b.goalsFor - a.goalsFor;
}

export function calculateRanking(teams: Team[], finishedMatches: Match[]): TeamRanking[] {
  const rankingsByTeamId = new Map<string, TeamRanking>();

  for (const team of teams) {
    rankingsByTeamId.set(team.id, createEmptyRanking(team));
  }

  for (const match of finishedMatches) {
    const teamARanking = rankingsByTeamId.get(match.teamAId);
    const teamBRanking = rankingsByTeamId.get(match.teamBId);

    if (!teamARanking || !teamBRanking) continue;

    applyMatchResult(teamARanking, match.scoreTeamA, match.scoreTeamB);
    applyMatchResult(teamBRanking, match.scoreTeamB, match.scoreTeamA);
  }

  return Array.from(rankingsByTeamId.values()).sort(sortByPoints);
}
