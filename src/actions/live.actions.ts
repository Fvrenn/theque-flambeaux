"use server";

import { prisma } from "@/lib/prisma";

interface AddLiveMessageData {
  pseudo: string;
  content: string;
  matchId?: string;
  isSystemEvent?: boolean;
}

export async function addLiveMessage(data: AddLiveMessageData) {
  try {
    return await prisma.liveMessage.create({
      data: {
        pseudo: data.pseudo,
        content: data.content,
        matchId: data.matchId,
        isSystemEvent: data.isSystemEvent ?? false,
      },
    });
  } catch (error) {
    throw new Error(`Impossible d'envoyer le message : ${error}`);
  }
}
