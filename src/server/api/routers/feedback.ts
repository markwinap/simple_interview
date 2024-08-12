import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const feedbackSchema = z.object(
  {
    interviewId: z.string(),
    valueId: z.string(),
    score: z.number(),
    feedback: z.string(),
  }
)

export const feedbackRouter = createTRPCRouter({
  create: publicProcedure
    .input(feedbackSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        interviewId,
        valueId,
        score,
        feedback,
      } = input;
      return ctx.db.feedback.create({
        data: {
          interviewId,
          valueId,
          score,
          feedback,
        },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.feedback.delete({
      where: {
        id: input,
      },
    });
  }),
  update: publicProcedure.input(z.object({
    id: z.string(),
    data: feedbackSchema
  })).mutation(({ ctx, input }) => {
    const {
      id,
      data
    } = input;
    return ctx.db.feedback.update({
      where: {
        id
      },
      data
    });
  }),
  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.feedback.findMany();
  }),
  one: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.feedback.findUnique({
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
    return ctx.db.feedback.findMany({
      where: {
        OR: [
          {
            feedback: {
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
