import z from "zod";

export const paginationSchema = z.object({
  page: z.preprocess((page) => {
    if (typeof page === "string") {
      return parseInt(page);
    }
    return page;
  }, z.number().min(1).default(1)),
  limit: z.preprocess((limit) => {
    if (typeof limit === "string") {
      return parseInt(limit);
    }
    return limit;
  }, z.number().min(1).max(100).default(10)),
});
