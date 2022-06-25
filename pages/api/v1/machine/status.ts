import type { NextApiRequest, NextApiResponse } from "next";

import { Deta } from "deta";
import { Machine } from "types";

const deta = Deta(process.env.DETA_PROJECT_KEY),
  db = deta.Base(process.env.DETA_BASE_NAME);

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const machine = (await db.get("0")) as unknown as Machine,
    shouldWater = machine?.shouldWater ? true : false;

  console.log(machine);

  await db.update(
    {
      pingHistory: db.util.append(Date.now()),
    },
    "0"
  );

  res.status(200).json({ shouldWater });
};

type Response = {
  shouldWater: boolean;
};
