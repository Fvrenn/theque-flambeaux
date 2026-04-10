"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTournament(name: string, numberOfFields: number) {
  try {
    const tournament = await prisma.tournament.create({
      data: {
        name,
        numberOfFields,
        date: new Date(),
      },
    });
    revalidatePath("/admin");
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
    // Parser la liste des joueurs
    const playersNames = data.playersList
      ? data.playersList
          .split(/[,\n]/)
          .map((p) => p.trim())
          .filter((p) => p !== "")
      : [];

    const team = await prisma.team.create({
      data: {
        name: data.name,
        color: data.color,
        tournamentId: data.tournamentId,
        playersList: playersNames.join(", "), // On garde la string pour compatibilité si besoin
        players: {
          create: playersNames.map(name => ({ name }))
        }
      },
    });
    
    revalidatePath(`/admin/${data.tournamentId}`);
    return team;
  } catch (error) {
    console.error("Error adding team to tournament:", error);
    throw new Error("Impossible d'ajouter l'équipe au tournoi");
  }
}
