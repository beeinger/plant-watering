import type { NextApiRequest, NextApiResponse } from "next";

import { Deta } from "deta";

const deta = Deta(process.env.DETA_PROJECT_KEY),
  db = deta.Base(process.env.DETA_BASE_NAME);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await db.update(
    {
      startupHistory: db.util.append(Date.now()),
    },
    "0"
  );
  res.status(200).end();
};
