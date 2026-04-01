import { Team, Match } from "@prisma/client";

export interface TeamRanking extends Team {
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export function calculateRanking(teams: Team[], matches: Match[]): TeamRanking[] {
  const rankingMap = new Map<string, TeamRanking>();

  // Initialisation du map de classement
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
    });
  });

  // Calcul des points basé sur les matchs terminés
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

      if (match.scoreTeamA > match.scoreTeamB) {
        // Victoire Team A
        teamA.points += 2;
        teamA.wins += 1;
        teamB.losses += 1;
      } else if (match.scoreTeamA < match.scoreTeamB) {
        // Victoire Team B
        teamB.points += 2;
        teamB.wins += 1;
        teamA.losses += 1;
      } else {
        // Égalité
        teamA.points += 1;
        teamB.points += 1;
        teamA.draws += 1;
        teamB.draws += 1;
      }
    }
  });

  // Transformation en tableau et tri par points (décroissant)
  // En cas d'égalité, on peut ajouter un second critère comme la différence de points
  return Array.from(rankingMap.values()).sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // Tie-breaker: différence de points (marqués - encaissés)
    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;
    return diffB - diffA;
  });
}
