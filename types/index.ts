export interface Machine {
  shouldWater: Timestamp | false;
  startupHistory: Timestamp[];
  pingHistory: Timestamp[];
  wateringHistory: WateringSequence[];
}

export type Timestamp = number;

export interface WateringSequence {
  requestedAt: Timestamp;
  finishedAt: Timestamp;
}
