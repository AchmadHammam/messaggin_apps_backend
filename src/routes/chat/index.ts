import prisma from "@/helper/db/db";
import { authenticateToken } from "@/helper/middleware";
import { paginationSchema } from "@/helper/schema/base";
import { Router, Request, Response } from "express";
import { user } from "@/helper/types/user";
import { createRoomSchema, sendMessageSchema } from "@/helper/schema/chat";
import { randomUUID } from "crypto";

const routerChat = Router();

async function FetchListRoomData(req: Request, res: Response) {
  const pageQuery = req.query.page || 1;
  const limitQuery = req.query.limit || 10;
  const validation = paginationSchema.safeParse({ page: pageQuery, limit: limitQuery });
  const user = (req as any).user as user;

  if (!validation.success) {
    return res.status(422).json({ message: validation.error.message });
  }
  const { page, limit } = validation.data!;

  var data = await prisma.chatPersonalRoom.findMany({
    where: {
      OR: [
        {
          user1Id: user.id,
        },
        {
          user2Id: user.id,
        },
      ],
    },
    select: {
      id: true,
      lastMessageAt: true,
      lastMessageBy: true,
      user1: {
        select: {
          id: true,
          email: true,
          nama: true,
        },
      },
      user2: {
        select: {
          id: true,
          email: true,
          nama: true,
        },
      },

      ChatMessage: {
        where: {
          readerId: user.id,
        },
        select: {
          id: true,
          message: true,
          readerId: true,
          createdAt: true,
        },
        take: 1,
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      lastMessageAt: "desc",
    },
  });

  var totalNotRead = data.map(async (v) => {
    const isNotRaedChat = await prisma.chatPersonalRoom.count({
      where: {
        id: v.id,
        ChatMessage: {
          some: {
            readerId: user.id,
            isRead: false,
          },
        },
      },
    });
    return isNotRaedChat;
  });
  var resultPromise = await Promise.all(totalNotRead);
  return res.json({
    message: "success",
    data: {
      page,
      limit,
      total: await prisma.chatPersonalRoom.count(),
      data: data.map((v, i) => ({
        ...v,
        totalNotRead: resultPromise[i],
        lastChatMessage: v.ChatMessage[0],
      })),
    },
  });
}

async function FetchListData(req: Request, res: Response) {
  const chatRoomId = parseInt(req.params.chatRoomId);

  const pageQuery = req.query.page || 1;
  const limitQuery = req.query.limit || 10;
  const validation = paginationSchema.safeParse({ page: pageQuery, limit: limitQuery });
  const user = (req as any).user as user;

  if (!validation.success) {
    return res.status(422).json({ message: validation.error.message });
  }
  const { page, limit } = validation.data!;

  const data = await prisma.chatMessage.findMany({
    where: {
      chatPersonalRoomId: chatRoomId,
      readerId: user.id,
    },
    include: {
      sender: true,
      receiver: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json({
    message: "success",
    data: {
      total: data.length,
      data: data.map((v) => {
        return {
          id: v.id,
          chatPersonalRoomId: v.chatPersonalRoomId,
          senderId: v.senderId,
          senderName: v.sender.nama,
          receiverId: v.receiver.id,
          receiverName: v.receiver.nama,
          message: v.message,
          isRead: v.isRead,
          createdAt: v.createdAt,
          updatedAt: v.updatedAt,
        };
      }),
    },
  });
}

async function CreateRoom(req: Request, res: Response) {
  const data = await req.body;

  const validation = createRoomSchema.safeParse(data);

  if (validation.success == false) {
    return res.status(422).json({ message: validation.error.message });
  }
  const parseData = validation.data;

  var user = (req as any).user as user;
  // check user
  user = (await prisma.users.findFirst({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      email: true,
      nama: true,
    },
  })) as user;

  if (!user) {
    return res.status(422).json({ message: "User not found" });
  }
  const check = await prisma.chatPersonalRoom.findFirst({
    where: {
      OR: [
        {
          AND: [
            {
              user1Id: user.id,
            },
            {
              user2Id: parseData.recevierId,
            },
          ],
        },
        {
          AND: [
            {
              user1Id: parseData.recevierId,
            },
            {
              user2Id: user.id,
            },
          ],
        },
      ],
    },
    include: {
      user1: true,
      user2: true,
    },
  });
  var room;
  const code = randomUUID().toLowerCase().replace("-", "").slice(0, 12);
  if (!check) {
    room = await prisma.chatPersonalRoom.create({
      data: {
        code: code,
        user1Id: user.id,
        user2Id: parseData.recevierId,
        createdBy: user.nama,
        lastMessageBy: user.nama,
      },
      include: {
        user1: true,
        user2: true,
      },
    });
  }
  return res.json({
    message: "success",
    data: {
      id: room?.id ?? check?.id,
      user1: room?.user1 ?? check?.user1,
      user2: room?.user2 ?? check?.user2,
      lastMessageAt: room?.lastMessageAt ?? check?.lastMessageAt,
      lastMessageBy: room?.lastMessageBy ?? check?.lastMessageBy,
    },
  });
}

async function SendMessage(req: Request, res: Response) {
  const data = await req.body;

  const validation = sendMessageSchema.safeParse(data);

  if (validation.success == false) {
    return res.status(422).json({ message: validation.error.message });
  }

  const parseData = validation.data;
  console.log(validation.success);

  var user = (req as any).user as user;
  // check user
  user = (await prisma.users.findFirst({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      email: true,
      nama: true,
    },
  })) as user;
  const message = await prisma.chatMessage.createManyAndReturn({
    data: [
      {
        readerId: parseData?.sender.id!,
        chatPersonalRoomId: parseData?.chatRoomId!,
        senderId: parseData?.sender.id!,
        receiverId: parseData?.recevier.id!,
        message: parseData?.sender.message!,
        createdBy: user.nama,
        updatedBy: user.nama,
      },
      {
        readerId: parseData?.recevier.id!,
        chatPersonalRoomId: parseData?.chatRoomId!,
        senderId: parseData?.sender.id!,
        receiverId: parseData?.recevier.id!,
        message: parseData?.recevier.message!,
        createdBy: user.nama,
        updatedBy: user.nama,
      },
    ],
  });
  return res.json({
    message: "success",
    data: message.find((v) => v.readerId === user.id),
  });
}
routerChat.get("/room", authenticateToken, FetchListRoomData);
routerChat.post("/room", authenticateToken, CreateRoom);
routerChat.post("/", authenticateToken, SendMessage);
routerChat.get("/:chatRoomId", authenticateToken, FetchListData);
export default routerChat;
