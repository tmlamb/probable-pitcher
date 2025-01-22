import { defineEventHandler } from "h3";

export default defineEventHandler(() => {
  console.log("Healthcheck invoked");
  return { ok: true };
});
