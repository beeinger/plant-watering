export interface Machine {
  shouldWater: Timestamp | false;
  lastPing: Timestamp;
  startupHistory: Timestamp[];
  wateringHistory: WateringSequence[];
}

export type Timestamp = number;

export interface WateringSequence {
  requestedAt: Timestamp;
  startedAt: Timestamp;
}
