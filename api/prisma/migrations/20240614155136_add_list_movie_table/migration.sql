/*
  Warnings:

  - You are about to drop the `_ListToMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ListToMovie" DROP CONSTRAINT "_ListToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_ListToMovie" DROP CONSTRAINT "_ListToMovie_B_fkey";

-- DropTable
DROP TABLE "_ListToMovie";

-- CreateTable
CREATE TABLE "ListMovie" (
    "list_id" UUID NOT NULL,
    "movie_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListMovie_pkey" PRIMARY KEY ("list_id","movie_id")
);

-- AddForeignKey
ALTER TABLE "ListMovie" ADD CONSTRAINT "ListMovie_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListMovie" ADD CONSTRAINT "ListMovie_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
