import { expect, test } from "vitest";
import fetch from "node-fetch";
import { Pitcher } from "@probable/db/schema";

// See test-data.sql for test data
const TEST_SEARCH_SCENARIOS = [
  {
    apiKey: "UAWNAsCXrOGywTkhgmwYLAHRggUNsscZfNgqOSsDEFWyubjEmKqCZzkLShePujgL",
    searchTerms: ["Miles"],
    pitchersExpected: 17,
  },
  {
    apiKey: "PNaqyECFFEIFDxDwWYhcHagbumnAmWrqlFJJzTzrgAvHsatlpknEaURqdJbnAdnv",
    searchTerms: ["Blaze", "Porter"],
    pitchersExpected: 10,
  },
  {
    apiKey: "WgmQgbZUdBHPQPCrbfpxywxrMgggoEiLsPBnyhMRdasbghJqCUqLHfmsLRSgdbKL",
    searchTerms: ["Roll", "Fizzlebeef"],
    pitchersExpected: 0,
  },
];

async function getPitchers(apiKey: string, searchTerms: string[]) {
  const url = new URL(
    `${process.env.VITE_API_URL}/api/trpc/pitcher.byFuzzyName`,
  );

  url.searchParams.append("batch", "1");
  url.searchParams.append(
    "input",
    `{"0":{"json":"${searchTerms.join("%20")}"}}`,
  );

  return fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  })
    .then((r) => r.json())
    .then(
      (json) =>
        (
          JSON.parse(JSON.stringify(json)) as {
            result?: { data: { json: Pitcher[] } };
          }[]
        )[0]?.result?.data.json,
    );
}

test("Fuzzy name search returns expected pitchers", async () => {
  for (const scenario of TEST_SEARCH_SCENARIOS) {
    const { apiKey, searchTerms, pitchersExpected } = scenario;
    const pitchersRecieved = await getPitchers(apiKey, searchTerms);

    expect(
      pitchersRecieved,
      `No pitcher data returned for user apiKey ${apiKey} with search ${searchTerms}`,
    ).not.toBeUndefined();

    expect(
      pitchersRecieved?.length,
      `Number of recieved pitchers (${pitchersRecieved?.length}) doesn't match number of expected pitchers (${pitchersExpected}) for user apiKey ${apiKey} with search terms ${searchTerms}`,
    ).toBe(pitchersExpected);
  }
});
