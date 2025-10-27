import prisma from "@/helper/db/db";
import { authenticateToken } from "@/helper/middleware";
import { paginationSchema } from "@/helper/schema/base";
import { user } from "@/helper/types/user";
import { Router, Request, Response } from "express";

const routerUser = Router();

async function FetchListData(req: Request, res: Response) {
  const pageQuery = req.query.page || 1;
  const limitQuery = req.query.limit || 10;
  const validation = paginationSchema.safeParse({
    page: pageQuery,
    limit: limitQuery,
  });
  if (!validation.success) {
    return res.status(422).json({ message: validation.error.message });
  }
  const user: user = (req as any).user;
  const { page, limit } = validation.data!;
  const data = await prisma.users.findMany({
    where: {
      NOT: {
        id: user.id,
      },
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  return res.json({
    message: "success",
    data: {
      page,
      limit,
      total: await prisma.users.count(),
      data,
    },
  });
}

async function GetScreet(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const data = await prisma.userScreet.findFirst({
    where: { userId: id },
    select: {
      publicKey: true,
      userId: true,
    },
  });
  return res.json({
    message: "success",
    data: {
      userId: data?.userId,
      publicKey: data?.publicKey,
    },
  });
}

routerUser.get("/screet/:id", authenticateToken, GetScreet);
routerUser.get("/", authenticateToken, FetchListData);
export default routerUser;
