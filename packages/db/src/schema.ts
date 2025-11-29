import type { z } from "zod/v4";
import { relations, sql } from "drizzle-orm";
import { index, pgTable, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const team = pgTable("team", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  ref: t.integer().notNull().unique(),
  name: t.varchar({ length: 255 }).unique().notNull(),
  abbreviation: t.varchar({ length: 7 }).unique(),
}));

export const teamRelations = relations(team, ({ many }) => ({
  pitchers: many(pitcher),
}));

export const createTeamSchema = createInsertSchema(team);

export type TeamRef = z.infer<typeof createTeamSchema>;
export type Team = Omit<TeamRef, "ref">;

export const pitcher = pgTable(
  "pitcher",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    ref: t.integer().notNull().unique(),
    name: t.varchar({ length: 127 }).notNull(),
    teamId: t
      .uuid()
      .notNull()
      .references(() => team.id, { onDelete: "restrict" }),
    number: t.text(),
    active: t.boolean(),
    gone: t.boolean().default(false).notNull(),
  }),
  () => [index("name_search_index").using("gin", sql.raw("name gin_trgm_ops"))],
);

export const pitcherRelations = relations(pitcher, ({ one, many }) => ({
  team: one(team, { fields: [pitcher.teamId], references: [team.id] }),
  homeGames: many(game, { relationName: "homePitcher" }),
  awayGames: many(game, { relationName: "awayPitcher" }),
  subscriptions: many(subscription),
  notifications: many(notification),
}));

export const createPitcherSchema = createInsertSchema(pitcher);
export const selectPitcherSchema = createSelectSchema(pitcher);

export type PitcherUpsert = z.infer<typeof createPitcherSchema>;
export type PitcherRef = z.infer<typeof selectPitcherSchema>;
export type Pitcher = Omit<PitcherRef, "ref">;

export const game = pgTable("game", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  ref: t.integer().notNull().unique(),
  date: t.timestamp().notNull(),
  homePitcherId: t
    .uuid()
    .references(() => pitcher.id, { onDelete: "restrict" }),
  awayPitcherId: t
    .uuid()
    .references(() => pitcher.id, { onDelete: "restrict" }),
}));

export const gameRelations = relations(game, ({ one, many }) => ({
  homePitcher: one(pitcher, {
    fields: [game.homePitcherId],
    references: [pitcher.id],
    relationName: "homePitcher",
  }),
  awayPitcher: one(pitcher, {
    fields: [game.awayPitcherId],
    references: [pitcher.id],
    relationName: "awayPitcher",
  }),
  notifications: many(notification),
}));

export const createGameSchema = createInsertSchema(game);

export type GameRef = z.infer<typeof createGameSchema>;
export type Game = Omit<GameRef, "ref">;

export const subscription = pgTable(
  "subscription",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    pitcherId: t
      .uuid()
      .notNull()
      .references(() => pitcher.id, { onDelete: "restrict" }),
  }),
  (t) => [unique().on(t.userId, t.pitcherId)],
);

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, { fields: [subscription.userId], references: [user.id] }),
  pitcher: one(pitcher, {
    fields: [subscription.pitcherId],
    references: [pitcher.id],
  }),
}));

export const createSubscriptionSchema = createInsertSchema(subscription);
export const selectSubscriptionSchema = createSelectSchema(subscription);

export type Subscription = z.infer<typeof selectSubscriptionSchema>;

export const notification = pgTable(
  "notification",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    deviceId: t
      .uuid()
      .notNull()
      .references(() => device.id, { onDelete: "cascade" }),
    gameId: t
      .uuid()
      .notNull()
      .references(() => game.id, { onDelete: "cascade" }),
    pitcherId: t
      .uuid()
      .notNull()
      .references(() => pitcher.id, { onDelete: "restrict" }),
    sentOn: t.timestamp({ mode: "date", withTimezone: true }),
  }),
  (t) => [unique().on(t.deviceId, t.gameId, t.pitcherId)],
);

export const notificationRelations = relations(notification, ({ one }) => ({
  device: one(device, {
    fields: [notification.deviceId],
    references: [device.id],
  }),
  game: one(game, { fields: [notification.gameId], references: [game.id] }),
  pitcher: one(pitcher, {
    fields: [notification.pitcherId],
    references: [pitcher.id],
  }),
}));

export const createNotificationSchema = createInsertSchema(notification);

export type Notification = z.infer<typeof createNotificationSchema>;

export const device = pgTable(
  "device",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    pushToken: t.varchar({ length: 1023 }).notNull(),
    timezone: t.varchar({ length: 255 }).notNull(),
    notificationsEnabled: t.boolean().default(true).notNull(),
  }),
  (t) => [unique("device_pushToken_userId_unique").on(t.userId, t.pushToken)],
);

export const deviceRelations = relations(device, ({ one, many }) => ({
  user: one(user, { fields: [device.userId], references: [user.id] }),
  notifications: many(notification),
}));

export const createDeviceSchema = createInsertSchema(device).omit({
  userId: true,
});
export const selectDeviceSchema = createSelectSchema(device);

export type Device = z.infer<typeof selectDeviceSchema>;

export const user = pgTable("user", (t) => ({
  id: t.text().primaryKey(),
  name: t.text().notNull(),
  email: t.text().notNull().unique(),
  emailVerified: t.boolean().notNull(),
  image: t.text(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp().notNull(),
}));

export const userRelations = relations(user, ({ many }) => ({
  devices: many(device),
}));

export const selectUserSchema = createSelectSchema(user);

export type User = z.infer<typeof selectUserSchema>;

export const account = pgTable("account", (t) => ({
  id: t.text().primaryKey(),
  accountId: t.text().notNull(),
  providerId: t.text().notNull(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: t.text(),
  refreshToken: t.text(),
  idToken: t.text(),
  accessTokenExpiresAt: t.timestamp(),
  refreshTokenExpiresAt: t.timestamp(),
  scope: t.text(),
  password: t.text(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp().notNull(),
}));

export const selectAccountSchema = createSelectSchema(account);

export type Account = z.infer<typeof selectAccountSchema>;

export const session = pgTable("session", (t) => ({
  id: t.text().primaryKey(),
  expiresAt: t.timestamp().notNull(),
  token: t.text().notNull().unique(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp().notNull(),
  ipAddress: t.text(),
  userAgent: t.text(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}));

export const verification = pgTable("verification", (t) => ({
  id: t.text().primaryKey(),
  identifier: t.text().notNull(),
  value: t.text().notNull(),
  expiresAt: t.timestamp().notNull(),
  createdAt: t.timestamp(),
  updatedAt: t.timestamp(),
}));

export const apikey = pgTable("apikey", (t) => ({
  id: t.text().primaryKey(),
  name: t.text(),
  start: t.text(),
  prefix: t.text(),
  key: t.text().notNull(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  refillInterval: t.integer(),
  refillAmount: t.integer(),
  lastRefillAt: t.timestamp(),
  enabled: t.boolean().notNull(),
  rateLimitEnabled: t.boolean().notNull(),
  rateLimitTimeWindow: t.integer(),
  rateLimitMax: t.integer(),
  requestCount: t.integer().notNull(),
  remaining: t.integer(),
  lastRequest: t.timestamp(),
  expiresAt: t.timestamp(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp().notNull(),
  permissions: t.text(),
  metadata: t.jsonb(),
}));

export const apiKeyRelations = relations(apikey, ({ one }) => ({
  user: one(user, { fields: [apikey.userId], references: [user.id] }),
}));

export type QueryError = typeof Error & { code?: unknown };

export function isQueryError(error: unknown): error is QueryError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as Record<string, unknown>).code === "string"
  );
}

export function isUniqueViolationError(error: unknown): boolean {
  return isQueryError(error) && error.code === "23505";
}
