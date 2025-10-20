import express from "express";
import routerAuth from "@/routes/auth";
import routerUser from "@/routes/user";
import routerProfile from "@/routes/profile";
import routerChat from "@/routes/chat";
import http from "http";
import { Server } from "socket.io";
import { createSocketId, getSocketId } from "./helper/socket";
import { authenticateSocketToken } from "./helper/middleware";
import moment from "moment";

const app = express();

// middleware bawaan
app.use(express.json());

// prefix api
app.use("/api/auth", routerAuth);
app.use("/api/user", routerUser);
app.use("/api/chat", routerChat);
app.use("/api/profile", routerProfile);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // ubah sesuai domain frontend kamu
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  const token = socket.handshake.query.token as string;
  console.log(token);

  socket.on("register", async (userId) => {
    const user = await authenticateSocketToken(token);
    createSocketId({ userId: user?.id!, socketId: socket.id });
  });

  socket.on("send_message", async (data: number) => {
    console.log("Pesan masuk:", data, moment().format("YYYY-MM-DD HH:mm:ss"));
    if (data) {
      const socketId = await getSocketId({ chatId: data });
      socket.to(socketId!).emit("reload", true);
    }
  });
  // Simpan user yang terhubung
  socket.on("disconnect", () => {
    console.log("User terputus:", socket.id);
  });
});

export default server;
