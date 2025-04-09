-- Custom SQL migration file, put you code below! --
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE INDEX "name_search_index" ON "pitcher" USING gin ("name" gin_trgm_ops);
