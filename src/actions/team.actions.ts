"use server";

import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateTeamName(teamId: string, name: string) {
  try {
    const team = await prisma.team.update({
      where: { id: teamId },
      data: { name }
    });
    revalidatePath(`/admin/${team.tournamentId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating team name:", error);
    throw new Error("Impossible de modifier le nom de l'équipe");
  }
}

export async function updateTeamColor(teamId: string, color: string) {
  try {
    const team = await prisma.team.update({
      where: { id: teamId },
      data: { color }
    });
    revalidatePath(`/admin/${team.tournamentId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating team color:", error);
    throw new Error("Impossible de modifier la couleur de l'équipe");
  }
}

export async function updateTeamCategory(teamId: string, category: Category) {
  try {
    const team = await prisma.team.update({
      where: { id: teamId },
      data: { category }
    });
    revalidatePath(`/admin/${team.tournamentId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating team category:", error);
    throw new Error("Impossible de modifier la catégorie de l'équipe");
  }
}

export async function updatePlayerName(playerId: string, name: string) {
  try {
    const player = await prisma.player.update({
      where: { id: playerId },
      data: { name },
      include: { team: true }
    });
    revalidatePath(`/admin/${player.team.tournamentId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating player name:", error);
    throw new Error("Impossible de modifier le nom du joueur");
  }
}

export async function deletePlayer(playerId: string) {
  try {
    const player = await prisma.player.delete({
      where: { id: playerId },
      include: { team: true }
    });
    revalidatePath(`/admin/${player.team.tournamentId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting player:", error);
    throw new Error("Impossible de supprimer le joueur");
  }
}

export async function addPlayersToTeam(teamId: string, playersList: string) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId }
    });
    
    if (!team) throw new Error("Équipe non trouvée");

    const playersNames = playersList
      .split(/[,\n]/)
      .map((p) => p.trim())
      .filter((p) => p !== "");

    await prisma.player.createMany({
      data: playersNames.map(name => ({
        name,
        teamId
      }))
    });

    revalidatePath(`/admin/${team.tournamentId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding players:", error);
    throw new Error("Impossible d'ajouter les joueurs");
  }
}

export async function getTeamWithPlayers(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      players: {
        orderBy: { name: 'asc' }
      }
    }
  });

  if (team && team.players.length === 0 && team.playersList) {
    // Migration à la volée des anciens joueurs
    const playersNames = team.playersList
      .split(/[,\n]/)
      .map((p) => p.trim())
      .filter((p) => p !== "");
    
    if (playersNames.length > 0) {
      await prisma.player.createMany({
        data: playersNames.map(name => ({
          name,
          teamId: team.id
        }))
      });
      
      // Re-fetch avec les nouveaux joueurs
      return await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          players: {
            orderBy: { name: 'asc' }
          }
        }
      });
    }
  }

  return team;
}
