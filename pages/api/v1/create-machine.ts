import type { NextApiRequest, NextApiResponse } from "next";

import { Deta } from "deta";
import { Machine } from "types";

const deta = Deta(process.env.DETA_PROJECT_KEY),
  db = deta.Base(process.env.DETA_BASE_NAME);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const machine: Machine = {
    shouldWater: false,
    startupHistory: [],
    lastPing: null,
    wateringHistory: [],
  };
  let status = 200;
  const resp = await db.insert(machine as any, "0").catch((err) => {
    status = 409;
    return {
      error: true,
      message: err.message,
    };
  });
  res.status(status).json(resp);
};
