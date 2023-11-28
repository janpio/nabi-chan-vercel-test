import { publicProcedure, router } from '#/trpc';
import { PrismaClient } from '@prisma/client';
import { observable } from '@trpc/server/observable';

const prisma = new PrismaClient();

export const appRouter = router({
  greet: publicProcedure
    .input((val: unknown) => {
      if (typeof val === 'string') return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query(async ({ input }) => ({ greeting: `hello, ${input}!`, data: await prisma.user.findMany() })),
  greetWs: publicProcedure
    .input((val: unknown) => {
      if (typeof val === 'string') return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .subscription(({ input }) => {
      return observable<{ greeting: string }>((emit) => {
        const interval = setInterval(() => {
          emit.next({ greeting: `hello, ${input}!` });
        }, 1000);

        return () => {
          clearInterval(interval);
        };
      });
    }),
});

export type AppRouter = typeof appRouter;
