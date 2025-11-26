import { formatISO } from "date-fns";

import { client } from "../db/client.js";
import { getPitchers } from "../services/base-api.js";

export async function reap(ingestDate: Date) {
  const date = formatISO(ingestDate, { representation: "date" });

  await reapPitchers(date);
}

async function reapPitchers(date: string) {
  const apiPitchers = await getPitchers(date);

  const dbPitchers = await client.pitcher.all();

  for (const dbPitcher of dbPitchers) {
    console.debug("Checking pitcher for reaping: ", dbPitcher);
    const apiPitcher = apiPitchers.find((p) => p.ref === dbPitcher.ref);
    let reapPitcher = false;

    if (!apiPitcher) {
      console.info("Deleting pitcher not returned by API: ", dbPitcher);
      reapPitcher = true;
    } else if (apiPitcher.active === false) {
      console.info(
        "Deleting pitcher that is not active. Database record: ",
        dbPitcher,
        ", API record: ",
        apiPitcher,
      );
      reapPitcher = true;
    }

    if (reapPitcher) {
      console.debug("Reaping pitcher (but not really): ", dbPitcher);
      // await client.pitcher.deleteById(dbPitcher.id);
    }
  }
}
