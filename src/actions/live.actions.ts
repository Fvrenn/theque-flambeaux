"use server";

import { prisma } from "@/lib/prisma";
import { eventEmitter } from "@/lib/eventEmitter";

interface AddLiveMessageData {
  pseudo: string;
  content: string;
  matchId?: string;
  isSystemEvent?: boolean;
}

export async function addLiveMessage(data: AddLiveMessageData) {
  try {
    const message = await prisma.liveMessage.create({
      data: {
        pseudo: data.pseudo,
        content: data.content,
        matchId: data.matchId,
        isSystemEvent: data.isSystemEvent ?? false,
      },
    });

    eventEmitter.emit('newMessage', message);
    return message;
  } catch (error) {
    console.error("Error adding live message:", error);
    throw new Error("Impossible d'ajouter le message au direct");
  }
}
