"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function wipeChat() {
  try {
    await prisma.liveMessage.deleteMany({});
    revalidatePath("/live");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error wiping chat:", error);
    throw new Error("Impossible de vider le chat");
  }
}

export async function deleteAllMatches(tournamentId: string) {
  try {
    await prisma.liveMessage.deleteMany({
      where: { match: { tournamentId } }
    });
    await prisma.match.deleteMany({
      where: { tournamentId }
    });
    revalidatePath("/schedule");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting matches:", error);
    throw new Error("Impossible de supprimer les matchs");
  }
}

export async function deleteAllTeams(tournamentId: string) {
  try {
    await prisma.liveMessage.deleteMany({
      where: { match: { tournamentId } }
    });
    await prisma.match.deleteMany({
      where: { tournamentId }
    });
    await prisma.team.deleteMany({
      where: { tournamentId }
    });
    revalidatePath("/ranking");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting teams:", error);
    throw new Error("Impossible de supprimer les équipes");
  }
}

export async function resetFullTournament(tournamentId: string) {
  try {
    await prisma.liveMessage.deleteMany({
      where: { match: { tournamentId } }
    });
    await prisma.match.deleteMany({
      where: { tournamentId }
    });
    await prisma.team.deleteMany({
      where: { tournamentId }
    });
    await prisma.tournament.delete({
      where: { id: tournamentId }
    });
    
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error resetting full tournament:", error);
    throw new Error("Impossible de réinitialiser le tournoi");
  }
}
