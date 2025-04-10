CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "name_search_index" ON "pitcher" USING gin ("name" gin_trgm_ops);
