import prisma from "../db/db";

export async function createSocketId(data: { userId: number; socketId: string }) {
  // check user
  const user = await prisma.users.findFirst({
    where: {
      id: data.userId,
    },
    select: {
      id: true,
      email: true,
      password: true,
      nama: true,
    },
  });

  await prisma.userWebSocket.upsert({
    where: {
      userId: data.userId,
    },
    update: {
      socketId: data.socketId,
      updatedBy: user?.nama,
    },
    create: {
      userId: user?.id!,
      socketId: data?.socketId,
      updatedBy: user?.nama!,
      createdBy: user?.nama!,
    },
  });
}

export async function getSocketId(data: { chatId: number }) {
  const room = await prisma.chat_user_view.findFirst({
    where: {
      id: data.chatId,
    },
    select: {
      receiver_id: true,
    },
  });
  const socket = await prisma.userWebSocket.findFirst({
    where: {
      userId: room?.receiver_id!,
    },
    select: {
      socketId: true,
    },
  });
  return socket?.socketId;
}
