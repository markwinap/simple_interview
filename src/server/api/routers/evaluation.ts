import { Result } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const evaluationSchema = z.object(
  {
    evaluatorId: z.string(),
    interviewId: z.string(),
    result: z.nativeEnum(Result),
  }
)


export const evaluationRouter = createTRPCRouter({
  create: publicProcedure
    .input(evaluationSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        evaluatorId,
        interviewId,
        result,
      } = input;
      return ctx.db.evaluation.create({
        data: {
          evaluatorId,
          interviewId,
          result,
        },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.evaluation.delete({
      where: {
        id: input,
      },
    });
  }),
  update: publicProcedure.input(z.object({
    id: z.string(),
    data: evaluationSchema
  })).mutation(({ ctx, input }) => {
    const {
      id,
      data
    } = input;
    return ctx.db.evaluation.update({
      where: {
        id
      },
      data
    });
  }),
  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.evaluation.findMany();
  }),
  one: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.evaluation.findUnique({
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
    return ctx.db.evaluation.findMany({
      where: {
        OR: [
          {
            evaluatorId: {
              contains: input.value,
              mode: "insensitive",
            },
          },
          {
            interviewId: {
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
