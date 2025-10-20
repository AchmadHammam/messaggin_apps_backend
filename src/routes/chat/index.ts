import prisma from "@/helper/db/db";
import {authenticateToken} from "@/helper/middleware";
import { paginationSchema } from "@/helper/schema/base";
import { Router, Request, Response } from "express";
import { user } from "@/helper/types/user";
import { sendMessageSchema } from "@/helper/schema/chat";

const routerChat = Router();

async function FetchListRoomData(req: Request, res: Response) {
  const pageQuery = req.query.page || 1;
  const limitQuery = req.query.limit || 10;
  const validation = paginationSchema.safeParse({ page: pageQuery, limit: limitQuery });
  const user = (req as any).user as user;

  if (!validation.success) {
    res.status(401).json({ message: validation.error.message });
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
        select: {
          id: true,
          message: true,
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
    const isNotRedChat = await prisma.chatPersonalRoom.count({
      where: {
        id: v.id,
        ChatMessage: {
          some: {
            senderId: {
              not: user.id,
            },
            isRead: false,
          },
        },
      },
    });
    return isNotRedChat;
  });
  var resultPromise = await Promise.all(totalNotRead);
  res.json({
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
    res.status(401).json({ message: validation.error.message });
  }
  const { page, limit } = validation.data!;

  const data = await prisma.chat_user_view.findMany({
    where: {
      chat_personal_room_id: chatRoomId,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      created_at: "desc",
    },
  });

  res.json({
    message: "success",
    data: {
      total: data.length,
      data: data.map((v) => {
        return {
          id: v.id,
          chatPersonalRoomId: v.chat_personal_room_id,
          senderId: v.sender_id,
          senderName: v.sender_name,
          receiverId: v.receiver_id,
          receiverName: v.receiver_name,
          message: v.message,
          isRead: v.is_read,
          createdAt: v.created_at,
          updated_at: v.updated_at,
        };
      }),
    },
  });
}

async function SendMessage(req: Request, res: Response) {
  const data = await req.body;
  const validation = sendMessageSchema.safeParse(data);
  if (validation.error) {
    res.status(401).json({ message: validation.error.message });
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
      password: true,
      nama: true,
    },
  })) as user;
  const message = await prisma.chatMessage.create({
    data: {
      message: parseData?.message!,
      senderId: user.id,
      chatPersonalRoomId: parseData?.chatRoomId!,
      updatedBy: user.nama,
      createdBy: user.nama,
    },
  });
  res.json({
    message: "success",
    data: message,
  });
}
routerChat.get("/room", authenticateToken, FetchListRoomData);
routerChat.post("/", authenticateToken, SendMessage);
routerChat.get("/:chatRoomId", authenticateToken, FetchListData);
export default routerChat;
