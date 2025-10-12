ALTER TABLE "notification"
DROP CONSTRAINT "notification_game_id_game_id_fk";

ALTER TABLE "notification"
ADD CONSTRAINT "notification_game_id_game_id_fk"
FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE cascade;
