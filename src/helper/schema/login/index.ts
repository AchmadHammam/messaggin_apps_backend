import prisma from "@/helper/db/db";
import z from "zod";

export const LoginSchema = z.object({
  email: z.email().refine(
    async (email) => {
      const user = await prisma.users.findUnique({ where: { email: email } });
      return !!user;
    },
    { message: "User not found" }
  ),
  password: z.string(),
  public_key: z.string(),
});
