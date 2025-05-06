import { formatISO } from "date-fns";

import { client } from "../db/client.js";
import { getTeams } from "../services/base-api.js";

export async function ingestTeams(ingestDate: Date) {
  const date = formatISO(ingestDate, { representation: "date" });

  const teams = await getTeams(date);
  console.debug("Found teams: ", teams);

  for (const team of teams) {
    const existing = await client.team.byRef(team.ref);
    if (
      !existing ||
      existing.name !== team.name ||
      (team.abbreviation && existing.abbreviation !== team.abbreviation)
    ) {
      await client.team.upsert({
        ref: team.ref,
        name: team.name,
        abbreviation: team.abbreviation || null,
      });
    }
  }
}
