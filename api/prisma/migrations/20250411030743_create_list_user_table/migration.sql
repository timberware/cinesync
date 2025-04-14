-- CreateTable
CREATE TABLE "ListUser" (
    "list_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_visited" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListUser_pkey" PRIMARY KEY ("list_id","user_id")
);

-- AddForeignKey
ALTER TABLE "ListUser" ADD CONSTRAINT "ListUser_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListUser" ADD CONSTRAINT "ListUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CopyData
INSERT INTO "ListUser"(list_id , user_id)
SELECT ltu."A" , ltu."B" FROM "_ListToUser" ltu;

-- DeleteTable
DROP TABLE "_ListToUser";

