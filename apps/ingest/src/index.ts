import * as dotenv from "dotenv";

import { ingestGames } from "./jobs/games.js";
import { ingestMigrationData } from "./jobs/migrations.js";
import {
  ingestNotifications,
  sendNotifications,
} from "./jobs/notifications.js";
import { ingestPitchers } from "./jobs/pitchers.js";
import { ingestTeams } from "./jobs/teams.js";

dotenv.config({ path: "../../.env" });

const { INGEST_JOBS: ingestJobs, INGEST_DATE } = process.env;

const ingestDate = INGEST_DATE ? new Date(INGEST_DATE) : new Date();

console.info("Running INGEST_JOBS:", ingestJobs, "on", ingestDate);

if (ingestJobs) {
  if (ingestJobs.includes("teams")) {
    console.info("----------INGESTING TEAMS START----------");
    await ingestTeams(ingestDate);
    console.info("----------INGESTING TEAMS END----------");
  }

  if (ingestJobs.includes("pitchers")) {
    console.info("----------INGESTING PITCHERS START----------");
    await ingestPitchers(ingestDate);
    console.info("----------INGESTING PITCHERS END----------");
  }

  if (ingestJobs.includes("games")) {
    console.info("----------INGESTING GAMES START----------");
    await ingestGames(ingestDate);
    console.info("----------INGESTING GAMES END----------");
  }

  if (ingestJobs.includes("notifications")) {
    console.info("----------INGESTING NOTIFICATIONS START----------");
    await ingestNotifications(ingestDate);
    console.info("----------INGESTING NOTIFICATIONS END----------");
    console.info("----------SENDING NOTIFICATIONS START----------");
    await sendNotifications(ingestDate);
    console.info("----------SENDING NOTIFICATIONS END----------");
  }

  if (ingestJobs.includes("migrations")) {
    console.info("----------INGESTING MIGRATIONS START----------");
    await ingestMigrationData();
    console.info("----------INGESTING MIGRATIONS END----------");
  }
}
