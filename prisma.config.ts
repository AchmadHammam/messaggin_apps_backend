import path from "node:path";
import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: path.join(__dirname, "prisma/migrations"),
    seed: "ts-node ./prisma/seed.ts",
  },
});
