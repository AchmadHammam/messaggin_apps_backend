-- CreateTable
CREATE TABLE "user_web_socket" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "socket_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "user_web_socket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_web_socket_id_key" ON "user_web_socket"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_web_socket_user_id_key" ON "user_web_socket"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_web_socket_socket_id_key" ON "user_web_socket"("socket_id");

-- AddForeignKey
ALTER TABLE "user_web_socket" ADD CONSTRAINT "user_web_socket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
