import { EventEmitter } from "events";

const globalForEventEmitter = globalThis as unknown as {
  eventEmitter: EventEmitter;
};

export const eventEmitter =
  globalForEventEmitter.eventEmitter ?? new EventEmitter();

globalForEventEmitter.eventEmitter = eventEmitter;