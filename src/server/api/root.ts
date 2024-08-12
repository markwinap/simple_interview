import { evaluationRouter } from "~/server/api/routers/evaluation";
import { feedbackRouter } from "~/server/api/routers/feedback";
import { evaluatorRouter } from "~/server/api/routers/evaluator";
import { fieldRouter } from "~/server/api/routers/field";
import { interviewRouter } from "./routers/interview";
import { valueRouter } from "./routers/value"; 

import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  evaluation: evaluationRouter,
  feedback: feedbackRouter,
  evaluator: evaluatorRouter,
  field: fieldRouter,
  interview: interviewRouter,
  value: valueRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
