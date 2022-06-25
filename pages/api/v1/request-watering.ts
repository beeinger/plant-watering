import type { NextApiRequest, NextApiResponse } from "next";

import { Deta } from "deta";
import { Machine } from "types";

const deta = Deta(process.env.DETA_PROJECT_KEY),
  db = deta.Base(process.env.DETA_BASE_NAME);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const timestamp = Date.now();

  const machine = (await db.get("0")) as unknown as Machine,
    shouldWater = machine?.shouldWater;
  if (shouldWater)
    return res.status(409).json({
      shouldWater: timestamp,
      error: true,
      message: "Watering is already scheduled.",
    });

  await db.update(
    {
      shouldWater: timestamp,
    },
    "0"
  );

  res.status(200).json({
    shouldWater: timestamp,
  });
};
