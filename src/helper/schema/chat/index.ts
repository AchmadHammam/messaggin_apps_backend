import z from "zod";

export const sendMessageSchema = z.object({
  chatRoomId: z.number(),
  recevier: z.object({
    id: z.number(),
    message: z.string(),
  }),
  sender: z.object({
    id: z.number(),
    message: z.string(),
  }),
  isFile: z.boolean().default(false),
});

export const createRoomSchema = z.object({
  recevierId: z.number(),
});
