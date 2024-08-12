import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const intgerviewSchema = z.object(
  {
    name: z.string(),
    email: z.string(),
  }
)

export const interviewRouter = createTRPCRouter({
  create: publicProcedure
    .input(intgerviewSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        email,
      } = input;
      return ctx.db.interview.create({
        data: {
          name,
          email,
        },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.interview.delete({
      where: {
        id: input,
      },
    });
  }),
  update: publicProcedure.input(z.object({
    id: z.string(),
    data: intgerviewSchema
  })).mutation(({ ctx, input }) => {
    const {
      id,
      data
    } = input;
    return ctx.db.interview.update({
      where: {
        id
      },
      data
    });
  }),
  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.interview.findMany();
  }),
  one: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.interview.findUnique({
      where: {
        id: input,
      },
    });
  }),
  search: publicProcedure.input(z.object(
    {
      interview: z.string(),
      limit: z.number().min(1).max(100),
    }
  )).query(async ({ ctx, input }) => {
    return ctx.db.interview.findMany({
      where: {
        OR: [
          {
            name: {
              contains: input.interview,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: input.interview,
              mode: "insensitive",
            },
          },
        ],
      },
      take: input.limit,
    });
  }),
});
