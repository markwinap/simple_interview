import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const evaluatorSchema = z.object(
  {
    name: z.string(),
    email: z.string().email(),
  }
)


export const evaluatorRouter = createTRPCRouter({
  create: publicProcedure
    .input(evaluatorSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        email,
      } = input;
      return ctx.db.evaluator.create({
        data: {
          name,
          email
        },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.evaluator.delete({
      where: {
        id: input,
      },
    });
  }),
  update: publicProcedure.input(z.object({
    id: z.string(),
    data: evaluatorSchema
  })).mutation(({ ctx, input }) => {
    const {
      id,
      data
    } = input;
    return ctx.db.evaluator.update({
      where: {
        id
      },
      data
    });
  }),
  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.evaluator.findMany();
  }),
  one: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.evaluator.findUnique({
      where: {
        id: input,
      },
    });
  }),
  search: publicProcedure.input(z.object(
    {
      value: z.string(),
      limit: z.number().min(1).max(100),
    }
  )).query(async ({ ctx, input }) => {
    return ctx.db.evaluator.findMany({
      where: {
        OR: [
          {
            name: {
              contains: input.value,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: input.value,
              mode: "insensitive",
            },
          },
        ],
      },
      take: input.limit,
    });
  }),
});
