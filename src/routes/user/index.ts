import prisma from "@/helper/db/db";
import authenticateToken from "@/helper/middleware";
import { paginationSchema } from "@/helper/schema/base";
import { Router, Request, Response } from "express";

const routerUser = Router();

async function FetchListData(req: Request, res: Response) {
  const pageQuery = req.query.page || 1;
  const limitQuery = req.query.limit || 10;
  const validation = paginationSchema.safeParse({ pageQuery, limitQuery });
  if (!validation.success) {
    res.status(400).json({ status: "Bad Request", message: validation.error.message });
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

routerUser.get("/", authenticateToken, FetchListData);
export default routerUser;
