import { formatISO } from "date-fns";

import type { Pitcher } from "../services/base-api.js";
import { client } from "../db/client.js";
import { getPitchers } from "../services/base-api.js";

export async function ingestPitchers(ingestDate: Date) {
  const date = formatISO(ingestDate, { representation: "date" });

  const pitchers = await getPitchers(date);
  console.debug("Found pitchers: ", pitchers);
  for (const pitcher of pitchers) {
    await processPitcher(pitcher);
  }

  const dbPitchers = await client.pitcher.all();

  for (const dbPitcher of dbPitchers) {
    if (pitchers.every((p) => p.ref !== dbPitcher.ref)) {
      console.info("Marking pitcher as gone not returned by API: ", dbPitcher);
      // await client.pitcher.upsert({
      //   ref: dbPitcher.ref,
      //   name: dbPitcher.name,
      //   teamId: dbPitcher.teamId,
      //   number: dbPitcher.number ?? null,
      //   active: dbPitcher.active ?? null,
      //   gone: true,
      // });
    }
  }
}

export async function processPitcher(pitcher: Pitcher) {
  const existing = await client.pitcher.byRef(pitcher.ref);
  const existingTeam = await client.team.byRef(pitcher.team);

  if (!existingTeam) {
    console.warn(
      `Missing team for pitcher when processing: ${JSON.stringify(pitcher)}`,
    );
    return;
  }

  if (
    !existing ||
    existing.name !== pitcher.name ||
    existing.teamId !== existingTeam.id ||
    (pitcher.number && existing.number !== pitcher.number) ||
    existing.active !== pitcher.active
  ) {
    console.debug("Upserting pitcher: ", pitcher);
    await client.pitcher.upsert({
      ref: pitcher.ref,
      name: pitcher.name,
      teamId: existingTeam.id,
      number: pitcher.number ?? null,
      active: pitcher.active ?? null,
      gone: false,
    });

    const pitchersWithName = await client.pitcher.byName(pitcher.name);
    if (pitchersWithName.length > 1) {
      console.warn(
        `Potential Duplicate Pitcher: ${
          pitcher.name
        } has multiple IDs: ${JSON.stringify(pitchersWithName)}`,
      );
    }
  }
}
