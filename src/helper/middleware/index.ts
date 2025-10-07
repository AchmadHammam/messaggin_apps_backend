import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { user } from "../types/user";
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  jwt.verify(token, process.env.KEY!, (err, user) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });

    (req as any).user = user as user;
    next();
  });
}

export default authenticateToken