-- CreateTable
CREATE TABLE "chat_personal_room" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "user1_id" INTEGER NOT NULL,
    "user2_id" INTEGER NOT NULL,
    "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "chat_personal_room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_screet" (
    "id" SERIAL NOT NULL,
    "public_key" TEXT NOT NULL,
    "private_key" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "user_screet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_personal_room_id_key" ON "chat_personal_room"("id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_personal_room_code_key" ON "chat_personal_room"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_screet_id_key" ON "user_screet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_screet_public_key_key" ON "user_screet"("public_key");

-- CreateIndex
CREATE UNIQUE INDEX "user_screet_private_key_key" ON "user_screet"("private_key");

-- AddForeignKey
ALTER TABLE "chat_personal_room" ADD CONSTRAINT "chat_personal_room_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_personal_room" ADD CONSTRAINT "chat_personal_room_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_screet" ADD CONSTRAINT "user_screet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
