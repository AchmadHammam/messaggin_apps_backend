import { Request, Response, Router } from "express";
import { user } from "@/helper/types/user";
import prisma from "@/helper/db/db";
import {authenticateToken} from "@/helper/middleware";
const profileRouter = Router();

async function Profile(req: Request, res: Response) {
  const user = (req as any).user as user;
  const detailUser = await prisma.users.findUnique({
    where: {
      id: user.id,
    },
  });
  res.json({
    message: "success",
    data: detailUser,
  });
}

profileRouter.get("/", authenticateToken, Profile);

export default profileRouter;