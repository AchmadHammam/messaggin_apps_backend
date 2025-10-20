import prisma from "@/helper/db/db";
import z from "zod";

export const RegisterSchema = z
  .object({
    email: z.email().refine(
      async (email) => {
        const user = await prisma.users.findUnique({ where: { email: email } });
        return !user;
      },
      { message: "User already exist" }
    ),
    password: z.string(),
    password_confirmation: z.string(),
    nama: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password and confirmation password do not match",
  });
