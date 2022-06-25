export interface Machine {
  key?: string;
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

export class FetcherError extends Error {
  status: any;
  info: any;

  constructor(message, status, info) {
    super(message);
    this.status = status;
    this.info = info;
  }
}
