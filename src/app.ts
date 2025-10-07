import express from "express";
import routerAuth from "@/routes/auth";
import routerUser from "@/routes/user";

const app = express();

// middleware bawaan
app.use(express.json());

// prefix api
app.use("/api/auth", routerAuth);
app.use("/api/user", routerUser);

export default app;
