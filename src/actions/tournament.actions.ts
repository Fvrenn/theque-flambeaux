"use server";

import { prisma } from "@/lib/prisma";

interface AddTeamData {
  name: string;
  color: string;
  tournamentId: string;
  playersList?: string;
}

export async function createTournament(name: string, numberOfFields: number) {
  try {
    return await prisma.tournament.create({
      data: {
        name,
        numberOfFields,
        date: new Date(),
      },
    });
  } catch (error) {
    throw new Error(`Impossible de créer le tournoi : ${error}`);
  }
}

export async function addTeamToTournament(data: AddTeamData) {
  try {
    return await prisma.team.create({
      data: {
        name: data.name,
        color: data.color,
        tournamentId: data.tournamentId,
        playersList: data.playersList,
      },
    });
  } catch (error) {
    throw new Error(`Impossible d'ajouter l'équipe : ${error}`);
  }
}
