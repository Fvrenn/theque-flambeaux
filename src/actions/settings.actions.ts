"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    let settings = await prisma.setting.findUnique({
      where: { id: "current" },
    });

    if (!settings) {
      settings = await prisma.setting.create({
        data: {
          id: "current",
          isMaintenanceMode: false,
        },
      });
    }

    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw new Error("Impossible de récupérer les réglages");
  }
}

interface UpdateSettingsData {
  isMaintenanceMode: boolean;
  tournamentDate?: string;
}

export async function updateSettings(data: UpdateSettingsData) {
  try {
    const settings = await prisma.setting.upsert({
      where: { id: "current" },
      update: {
        isMaintenanceMode: data.isMaintenanceMode,
        tournamentDate: data.tournamentDate,
      },
      create: {
        id: "current",
        isMaintenanceMode: data.isMaintenanceMode,
        tournamentDate: data.tournamentDate,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return settings;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw new Error("Impossible de mettre à jour les réglages");
  }
}
