import prisma from "@/helper/db/db";
import { authenticateToken } from "@/helper/middleware";
import { paginationSchema } from "@/helper/schema/base";
import { Router, Request, Response } from "express";

const routerUser = Router();

async function FetchListData(req: Request, res: Response) {
  const pageQuery = req.query.page || 1;
  const limitQuery = req.query.limit || 10;
  const validation = paginationSchema.safeParse({ pageQuery, limitQuery });
  if (!validation.success) {
    res.status(401).json({ message: validation.error.message });
  }
  const { page, limit } = validation.data!;
  const data = await prisma.users.findMany({ skip: (page - 1) * limit, take: limit });
  res.json({
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
  res.json({
    message: "success",
    data,
  });
}

routerUser.get("/screet/:id", authenticateToken, GetScreet);
routerUser.get("/", authenticateToken, FetchListData);
export default routerUser;
