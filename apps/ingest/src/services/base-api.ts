import fetch from "node-fetch";
import { z } from "zod";

const team = z.object({
  ref: z.number(),
  name: z.string(),
  abbreviation: z.string(),
});

export type Team = z.infer<typeof team>;

const pitcher = z.object({
  ref: z.number(),
  name: z.string(),
  number: z.string().nullish(),
  team: z.number(),
  position: z.string().optional(),
});

export type Pitcher = z.infer<typeof pitcher>;

const teamPitcher = z.object({
  team,
  pitcher: pitcher.optional(),
});

const game = z.object({
  ref: z.number(),
  date: z.string(),
  away: teamPitcher,
  home: teamPitcher,
});

export type Game = z.infer<typeof game>;

const gamesResponse = z.object({
  games: z.array(game),
});

export async function getGames(date: string): Promise<Game[]> {
  console.log("Fetching games for date: ", date);
  return fetch(`${process.env.BASE_API_URL}/games?date=${date}`)
    .then((res) => res.json())
    .then((data) => {
      const { games } = gamesResponse.parse(data);
      return games;
    })
    .catch((err: Error) => {
      console.error(err);
      throw err;
    });
}

const teamsResponse = z.object({
  teams: z.array(team),
});

export async function getTeams(date: string): Promise<Team[]> {
  console.log("Fetching teams for date:", date);
  return fetch(`${process.env.BASE_API_URL}/teams?date=${date}`)
    .then((res) => res.json())
    .then((data) => {
      const { teams } = teamsResponse.parse(data);
      return teams;
    })
    .catch((err: Error) => {
      console.error(err);
      throw err;
    });
}

const pitchersResponse = z.object({
  pitchers: z.array(pitcher),
});

export async function getPitchers(date: string): Promise<Pitcher[]> {
  return fetch(`${process.env.BASE_API_URL}/pitchers?date=${date}`)
    .then((res) => {
      console.log("Response:", res);
      return res.text();
    })
    .then((data) => {
      console.log("Response text:", data);
      const { pitchers } = pitchersResponse.parse(data);
      return pitchers;
    })
    .catch((err) => {
      console.error("Error fetching players:", err);
      throw err;
    });
}
