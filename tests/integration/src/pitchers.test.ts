import { expect, test } from "vitest";
import fetch from "node-fetch";
import { Pitcher } from "@probable/db/schema";

// See test-data.sql for test data
const TEST_SEARCH_SCENARIOS = [
  {
    sessionId:
      "1c2358f551e04be5ae8e312a6b9888e1.VDtI7sJQHirgwwj2O2q812EYksqph1kG%2FU9m%2F7yNbRM%3D",
    searchTerms: ["Miles"],
    pitchersExpected: 17,
  },
  {
    sessionId:
      "2c2358f551e04be5ae8e312a6b9888e2.z31FvjT6%2BnS3pVEatYpnj7l8YPqPJdcOlvFzCkCzVLI%3D",
    searchTerms: ["Blaze", "Porter"],
    pitchersExpected: 18,
  },
  {
    sessionId:
      "3c2358f551e04be5ae8e312a6b9888e3.9oG5MFMYg0WWBmMeqauDtIwfwMQuj%2BEJHueuu4XA9no%3D",
    searchTerms: ["Roll", "Fizzlebeef"],
    pitchersExpected: 0,
  },
];

async function getPitchers(sessionId: string, searchTerms: string[]) {
  const url = new URL(
    `${process.env.VITE_API_URL}/api/trpc/pitcher.byFuzzyName`,
  );

  url.searchParams.append("batch", "1");
  url.searchParams.append(
    "input",
    `{"0":{"json":{"name":"${searchTerms.join("%20")}"}}}`,
  );

  return fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      cookie: `probable-pitcher.session-token=${sessionId}`,
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
    const { sessionId, searchTerms, pitchersExpected } = scenario;
    const pitchersRecieved = await getPitchers(sessionId, searchTerms);

    expect(
      pitchersRecieved,
      `No pitcher data returned for user session ${sessionId} with search ${searchTerms}`,
    ).not.toBeUndefined();

    expect(
      pitchersRecieved?.length,
      `Number of recieved pitchers (${pitchersRecieved?.length}) doesn't match number of expected pitchers (${pitchersExpected}) for user session ${sessionId} with search terms ${searchTerms}`,
    ).toBe(pitchersExpected);
  }
});
