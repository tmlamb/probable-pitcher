import createJiti from "jiti";

const jiti = createJiti(import.meta.url);

await jiti.import("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  output: "standalone",

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@probable/api",
    "@probable/auth",
    "@probable/db",
    "@probable/ui",
  ],

  typescript: { ignoreBuildErrors: true },
};

export default config;
