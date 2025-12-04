import { URL } from "https://jslib.k6.io/url/1.0.0/index.js";
import { check } from "k6";
import http from "k6/http";

export const options = {
  vus: 4,
  duration: "45s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<40"],
  },
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
    "x-api-key":
      "OelGKPLTcfHGiTXwmxGKWQpGiIquYYusCRiadsxGXyzUZqwdKrAnZfiQvdYnprvT",
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
    `{"0":{"json":"${searchTerms.join("%20")}"}}`,
  );
  const response = http.get(url.toString(), params);

  check(response, {
    "Get response status is 200": (r) => r.status === 200,
  });
}
