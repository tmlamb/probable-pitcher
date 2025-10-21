import type {
  GameRef,
  Notification,
  PitcherRef,
  TeamRef,
} from "@probable/db/schema";
import { and, between, eq, inArray, isNull } from "@probable/db";
import { db } from "@probable/db/client";
import {
  device,
  game,
  notification,
  pitcher,
  subscription,
  team,
  user,
} from "@probable/db/schema";

export const client = {
  team: {
    byRef: (ref: number) => {
      return db.query.team.findFirst({
        where: eq(team.ref, ref),
      });
    },
    upsert: ({ ref, name, abbreviation }: TeamRef) => {
      return db
        .insert(team)
        .values({
          ref,
          name,
          abbreviation,
        })
        .onConflictDoUpdate({
          target: team.ref,
          set: {
            name,
            abbreviation,
          },
        })
        .returning();
    },
  },
  pitcher: {
    byName: (name: string) => {
      return db.query.pitcher.findMany({
        where: eq(pitcher.name, name),
      });
    },
    byRef: (ref: number) => {
      return db.query.pitcher.findFirst({
        where: eq(pitcher.ref, ref),
      });
    },
    upsert: ({ ref, name, teamId, number }: PitcherRef) => {
      return db
        .insert(pitcher)
        .values({
          ref,
          name,
          number,
          teamId,
        })
        .onConflictDoUpdate({
          target: pitcher.ref,
          set: {
            name,
            number,
            teamId,
          },
        })
        .returning();
    },
  },
  game: {
    byRef: (ref: number) => {
      return db.query.game.findFirst({
        where: eq(game.ref, ref),
      });
    },
    inRange: (start: Date, end: Date) => {
      return db.query.game.findMany({
        where: between(game.date, start, end),
        with: {
          awayPitcher: true,
          homePitcher: true,
        },
      });
    },
    upsert: ({ ref, date, homePitcherId, awayPitcherId }: GameRef) => {
      return db
        .insert(game)
        .values({
          ref,
          date,
          homePitcherId,
          awayPitcherId,
        })
        .onConflictDoUpdate({
          target: game.ref,
          set: {
            date,
            homePitcherId,
            awayPitcherId,
          },
        })
        .returning();
    },
    deleteById: (id: string) => {
      return db.delete(game).where(eq(game.id, id));
    },
  },
  subscription: {
    byPitcherId: (pitcherId: string) => {
      return db.query.subscription.findMany({
        where: eq(subscription.pitcherId, pitcherId),
        with: {
          user: {
            with: {
              devices: true,
            },
          },
        },
      });
    },
  },
  user: {
    byId: (id: string) => {
      return db.query.user.findFirst({
        where: eq(user.id, id),
      });
    },
  },
  notification: {
    create: ({ deviceId, gameId, pitcherId }: Notification) => {
      return db
        .insert(notification)
        .values({
          deviceId,
          gameId,
          pitcherId,
        })
        .returning();
    },
    update: (id: string, sentOn: Date) => {
      return db
        .update(notification)
        .set({
          sentOn,
        })
        .where(eq(notification.id, id))
        .returning();
    },
  },
  device: {
    byUserId: (userId: string) => {
      return db.query.device.findMany({
        where: eq(user.id, userId),
      });
    },
    withPendingNotificationsInRange: (start: Date, end: Date) => {
      return db.query.device.findMany({
        where: and(
          eq(device.notificationsEnabled, true),
          inArray(
            device.id,
            db
              .select({ id: notification.deviceId })
              .from(notification)
              .innerJoin(game, eq(game.id, notification.gameId))
              .where(
                and(
                  between(game.date, start, end),
                  isNull(notification.sentOn),
                ),
              ),
          ),
        ),
        with: {
          notifications: {
            where: and(
              isNull(notification.sentOn),
              inArray(
                notification.gameId,
                db
                  .select({ id: game.id })
                  .from(game)
                  .where(between(game.date, start, end)),
              ),
            ),
            with: {
              game: true,
              pitcher: true,
            },
          },
        },
      });
    },
  },
};
