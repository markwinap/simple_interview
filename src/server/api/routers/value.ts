import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const valueSchema = z.object(
  {
    fieldId: z.string(),
    value: z.string(),
    interviewId: z.string(),
  }
)

export const valueRouter = createTRPCRouter({
  create: publicProcedure
    .input(valueSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        fieldId,
        value,
        interviewId,
      } = input;
      return ctx.db.value.create({
        data: {
          fieldId,
          value,
          interviewId,
        },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.value.delete({
      where: {
        id: input,
      },
    });
  }),
  update: publicProcedure.input(z.object({
    id: z.string(),
    data: valueSchema
  })).mutation(({ ctx, input }) => {
    const {
      id,
      data
    } = input;
    return ctx.db.value.update({
      where: {
        id
      },
      data
    });
  }),
  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.value.findMany();
  }),
  one: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.value.findUnique({
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
    return ctx.db.value.findMany({
      where: {
        OR: [
          {
            value: {
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
