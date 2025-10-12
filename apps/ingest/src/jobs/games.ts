import { add, formatISO } from "date-fns";

import { client } from "../db/client.js";
import { getGames } from "../services/base-api.js";
import { processPitcher } from "./pitchers.js";

export async function ingestGames(ingestDate: Date) {
  const games = await Promise.all([
    getGames(formatISO(ingestDate, { representation: "date" })),
    getGames(
      formatISO(add(ingestDate, { days: 1 }), { representation: "date" }),
    ),
    getGames(
      formatISO(add(ingestDate, { days: 2 }), { representation: "date" }),
    ),
    getGames(
      formatISO(add(ingestDate, { days: 3 }), { representation: "date" }),
    ),
    getGames(
      formatISO(add(ingestDate, { days: 4 }), { representation: "date" }),
    ),
  ]);

  console.debug(
    `Found ${games.flat().length} games: ${JSON.stringify(games.flat())}`,
  );

  for (const game of games.flat()) {
    for (const team of [game.away, game.home]) {
      if (team.pitcher) {
        await processPitcher({
          name: team.pitcher.name,
          ref: team.pitcher.ref,
          number: team.pitcher.number,
          team: team.team.ref,
        });
      }
    }

    const { home, away, ref, date } = game;

    const homePitcher = home.pitcher
      ? await client.pitcher.byRef(home.pitcher.ref)
      : null;
    const awayPitcher = away.pitcher
      ? await client.pitcher.byRef(away.pitcher.ref)
      : null;

    console.debug("Upserting game: ", game);

    await client.game.upsert({
      ref,
      date: new Date(date),
      homePitcherId: homePitcher?.id ?? null,
      awayPitcherId: awayPitcher?.id ?? null,
    });
  }

  const dbGames = await client.game.inRange(
    ingestDate,
    add(ingestDate, { days: 5 }),
  );
  const apiGames = games.flat();

  // Cleanup any games not returned by the API
  for (const dbGame of dbGames) {
    if (!apiGames.find((g) => g.ref === dbGame.ref)) {
      console.info("Deleting game not returned by API: ", dbGame);
      await client.game.deleteById(dbGame.id);
    }
  }
}
