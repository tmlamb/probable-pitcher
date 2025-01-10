import { URL } from "https://jslib.k6.io/url/1.0.0/index.js";
import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 4,
  duration: "45s",
};

const names = [
  "Ohtani",
  "Michael",
  "Matthew",
  "Christopher",
  "Rodriguez",
  "Jacob",
  "Tyler",
  "Austin",
  "Zack",
  "Ryan",
  "David",
  "Contreras",
  "John",
  "Park",
  "Martínez",
  "Aaron",
];

const params = {
  headers: {
    "Content-Type": "application/json",
  },
  cookies: {
    "authjs.session-token": "1c2358f5-51e0-4be5-ae8e-312a6b9888e1",
  },
};

export default function () {
  const searchTerms = [names[Math.floor(Math.random() * names.length)]];

  if (Math.random() > 0.5) {
    searchTerms.push(names[Math.floor(Math.random() * names.length)]);
  }

  const url = new URL(`${__ENV.API_URL}/api/trpc/pitcher.byFuzzyName`);

  url.searchParams.append("batch", "1");
  url.searchParams.append(
    "input",
    `{"0":{"json":{"name":"${searchTerms.join("%20")}"}}}`,
  );
  const response = http.get(url.toString(), params);

  check(response, {
    "Get response status is 200": (r) => r.status === 200,
  });
}
