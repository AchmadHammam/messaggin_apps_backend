import { LoginSchema } from "@/helper/schema/login";
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "@/helper/db/db";
import jwt, { JwtPayload } from "jsonwebtoken";
const routerAuth = Router();

async function Login(req: Request, res: Response) {
  const data = await req.body;
  const validation = await LoginSchema.safeParseAsync(data);

  if (validation.error) {
    res.status(400).json({ status: "Bad Request", message: validation.error.message });
  }
  const parseData = validation.data;
  const user = await prisma.users.findUnique({
    where: { email: parseData?.email },
    select:{
      id: true,
      email: true,
      password: true
    }
  });

  const validPassword = await bcrypt.compare(parseData?.password!, user?.password!);
  if (!validPassword) {
    return res.status(401).json({ message: "Username atau password salah" });
  }

  const token = jwt.sign({ id: user?.id, email: user?.email }, process.env.KEY!, {
    expiresIn: "1h",
  });
  res.json({
    message: "login berhasil",
    data: {
      user: {
        id: user?.id,
        email: user?.email
      },
      token: token,
    },
  });
}

routerAuth.post("/login", Login);

export default routerAuth;
