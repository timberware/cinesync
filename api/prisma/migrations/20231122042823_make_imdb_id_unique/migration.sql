/*
  Warnings:

  - A unique constraint covering the columns `[imdb_id]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Movie_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "Movie_imdb_id_key" ON "Movie"("imdb_id");
