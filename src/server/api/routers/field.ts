import { Type } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const fieldSchema = z.object(
  {
    name: z.string(),
    type: z.nativeEnum(Type),
  }
)

export const fieldRouter = createTRPCRouter({
  create: publicProcedure
    .input(fieldSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        type,
      } = input;
      return ctx.db.field.create({
        data: {
          name,
          type,
        },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.field.delete({
      where: {
        id: input,
      },
    });
  }),
  update: publicProcedure.input(z.object({
    id: z.string(),
    data: fieldSchema
  })).mutation(({ ctx, input }) => {
    const {
      id,
      data
    } = input;
    return ctx.db.field.update({
      where: {
        id
      },
      data
    });
  }),
  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.field.findMany();
  }),
  one: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.field.findUnique({
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
    return ctx.db.field.findMany({
      where: {
        OR: [
          {
            name: {
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
