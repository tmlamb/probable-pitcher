import { defineEventHandler } from "h3";

export default defineEventHandler(() => {
  console.log("ready!");
  return { ok: true };
});
