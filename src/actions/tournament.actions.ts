"use server";

import { prisma } from "@/lib/prisma";

export async function createTournament(name: string, numberOfFields: number) {
  try {
    const tournament = await prisma.tournament.create({
      data: {
        name,
        numberOfFields,
        date: new Date(),
      },
    });
    return tournament;
  } catch (error) {
    console.error("Error creating tournament:", error);
    throw new Error("Impossible de créer le tournoi");
  }
}

interface AddTeamData {
  name: string;
  color: string;
  tournamentId: string;
  playersList?: string;
}

export async function addTeamToTournament(data: AddTeamData) {
  try {
    // Parser la liste des joueurs : séparer par virgule ou retour à la ligne, nettoyer les espaces
    const formattedPlayers = data.playersList
      ? data.playersList
          .split(/[,\n]/)
          .map((p) => p.trim())
          .filter((p) => p !== "")
          .join(", ")
      : "";

    const team = await prisma.team.create({
      data: {
        name: data.name,
        color: data.color,
        tournamentId: data.tournamentId,
        playersList: formattedPlayers,
      },
    });
    return team;
  } catch (error) {
    console.error("Error adding team to tournament:", error);
    throw new Error("Impossible d'ajouter l'équipe au tournoi");
  }
}

interface UpdateTeamData {
  teamId: string;
  name: string;
  color: string;
  playersList?: string;
}

export async function updateTeam(data: UpdateTeamData) {
  try {
    const formattedPlayers = data.playersList
      ? data.playersList
          .split(/[,\n]/)
          .map((p) => p.trim())
          .filter((p) => p !== "")
          .join(", ")
      : "";

    const team = await prisma.team.update({
      where: { id: data.teamId },
      data: {
        name: data.name,
        color: data.color,
        playersList: formattedPlayers,
      },
    });
    return team;
  } catch (error) {
    console.error("Error updating team:", error);
    throw new Error("Impossible de mettre à jour l'équipe");
  }
}
