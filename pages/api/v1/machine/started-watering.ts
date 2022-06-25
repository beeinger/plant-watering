import type { NextApiRequest, NextApiResponse } from "next";

import { Deta } from "deta";
import { Machine } from "types";

const deta = Deta(process.env.DETA_PROJECT_KEY),
  db = deta.Base(process.env.DETA_BASE_NAME);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const machine = (await db.get("0")) as unknown as Machine,
    shouldWater = machine?.shouldWater;

  await db.update(
    {
      shouldWater: false,
      wateringHistory: db.util.append({
        requestedAt: shouldWater,
        startedAt: Date.now(),
      } as any),
    },
    "0"
  );
  res.status(200).end();
};
