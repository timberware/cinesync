/*
  Warnings:

  - The primary key for the `Avatar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Avatar` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Friends` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `List` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `List` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `user_id` on the `Avatar` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `author_id` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `list_id` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_1` on the `Friends` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_2` on the `Friends` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_ListToMovie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_ListToMovie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_ListToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_ListToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_MovieToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_MovieToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_author_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_list_id_fkey";

-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_id_1_fkey";

-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_id_2_fkey";

-- DropForeignKey
ALTER TABLE "_ListToMovie" DROP CONSTRAINT "_ListToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_ListToMovie" DROP CONSTRAINT "_ListToMovie_B_fkey";

-- DropForeignKey
ALTER TABLE "_ListToUser" DROP CONSTRAINT "_ListToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ListToUser" DROP CONSTRAINT "_ListToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_MovieToUser" DROP CONSTRAINT "_MovieToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieToUser" DROP CONSTRAINT "_MovieToUser_B_fkey";

-- AlterTable
ALTER TABLE "Avatar" DROP CONSTRAINT "Avatar_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "author_id",
ADD COLUMN     "author_id" UUID NOT NULL,
DROP COLUMN "list_id",
ADD COLUMN     "list_id" UUID NOT NULL,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_pkey",
DROP COLUMN "id_1",
ADD COLUMN     "id_1" UUID NOT NULL,
DROP COLUMN "id_2",
ADD COLUMN     "id_2" UUID NOT NULL,
ADD CONSTRAINT "Friends_pkey" PRIMARY KEY ("id_1", "id_2");

-- AlterTable
ALTER TABLE "List" DROP CONSTRAINT "List_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "List_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Movie_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_ListToMovie" DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL,
DROP COLUMN "B",
ADD COLUMN     "B" UUID NOT NULL;

-- AlterTable
ALTER TABLE "_ListToUser" DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL,
DROP COLUMN "B",
ADD COLUMN     "B" UUID NOT NULL;

-- AlterTable
ALTER TABLE "_MovieToUser" DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL,
DROP COLUMN "B",
ADD COLUMN     "B" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_user_id_key" ON "Avatar"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ListToMovie_AB_unique" ON "_ListToMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_ListToMovie_B_index" ON "_ListToMovie"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ListToUser_AB_unique" ON "_ListToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ListToUser_B_index" ON "_ListToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieToUser_AB_unique" ON "_MovieToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieToUser_B_index" ON "_MovieToUser"("B");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_id_1_fkey" FOREIGN KEY ("id_1") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_id_2_fkey" FOREIGN KEY ("id_2") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListToMovie" ADD CONSTRAINT "_ListToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListToMovie" ADD CONSTRAINT "_ListToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListToUser" ADD CONSTRAINT "_ListToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListToUser" ADD CONSTRAINT "_ListToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieToUser" ADD CONSTRAINT "_MovieToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieToUser" ADD CONSTRAINT "_MovieToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
