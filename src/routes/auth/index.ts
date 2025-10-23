import { LoginSchema } from "@/helper/schema/login";
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "@/helper/db/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RegisterSchema } from "@/helper/schema/register";
import { authenticateToken } from "@/helper/middleware";

const routerAuth = Router();

async function Login(req: Request, res: Response) {
  const data = await req.body;
  const validation = await LoginSchema.safeParseAsync(data);

  if (validation.error) {
    return res.status(422).json({
      message: validation.error.message,
    });
  }
  const parseData = validation.data;
  const user = await prisma.users.findFirst({
    where: {
      email: parseData?.email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      nama: true,
    },
  });

  if (!user) {
    return res.status(422).json({ message: "Username atau password salah" });
  }
  //check user screet
  var us = await prisma.userScreet.findFirst({
    where: {
      userId: user?.id,
    },
  });

  us = await prisma.userScreet.upsert({
    where: {
      userId: user?.id,
    },
    create: {
      publicKey: parseData?.public_key!,
      userId: user?.id,
      createdBy: user.nama,
    },
    update: {
      publicKey: parseData?.public_key!,
    },
  });

  const validPassword = await bcrypt.compare(parseData?.password!, user?.password!);
  if (!validPassword) {
    return res.status(422).json({ message: "Username atau password salah" });
  }

  const token = jwt.sign({ id: user?.id, email: user?.email }, process.env.KEY!, {
    expiresIn: "1D",
  });
  return res.json({
    message: "login berhasil",
    data: {
      user: {
        id: user?.id,
        email: user?.email,
      },
      token: token,
    },
  });
}

async function Register(req: Request, res: Response) {
  const data = await req.body;
  const validation = await RegisterSchema.safeParseAsync(data);
  if (validation.error) {
    return res.status(422).json({ message: validation.error.message });
  }
  const parseData = validation.data;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(parseData?.password!, salt);
  // save public key

  const user = await prisma.users.create({
    data: {
      email: parseData?.email!,
      password: hashedPassword,
      nama: parseData?.nama!,
      updatedBy: parseData?.nama!,
      createdBy: parseData?.nama!,
    },
  });
  return res.json({ message: "success", data: user });
}

async function Verify(req: Request, res: Response) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.KEY!, (err, user) => {
      if (err) return res.status(403).json({ message: "Token tidak valid" });
    });
  } else {
    return res.status(422).json({ message: "Token tidak ada" });
  }
  return res.json({ message: "success" });
}
routerAuth.post("/login", Login);
routerAuth.post("/register", Register);
routerAuth.post("/verify", authenticateToken, Verify);

export default routerAuth;
