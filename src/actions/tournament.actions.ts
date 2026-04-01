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
    const team = await prisma.team.create({
      data: {
        name: data.name,
        color: data.color,
        tournamentId: data.tournamentId,
        playersList: data.playersList,
      },
    });
    return team;
  } catch (error) {
    console.error("Error adding team to tournament:", error);
    throw new Error("Impossible d'ajouter l'équipe au tournoi");
  }
}
