/*
  Warnings:

  - You are about to drop the column `imdb_id` on the `Movie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tmdb_id]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tmdb_id` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Movie_imdb_id_key";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "imdb_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "eTag" TEXT,
ADD COLUMN     "tmdb_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdb_id_key" ON "Movie"("tmdb_id");
