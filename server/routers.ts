import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  clipboard: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const { getUserClipboardItems } = await import("./db");
        return getUserClipboardItems(ctx.user.id, input?.limit, input?.offset);
      }),
    
    search: protectedProcedure
      .input(z.object({ searchTerm: z.string() }))
      .query(async ({ ctx, input }) => {
        const { searchClipboardItems } = await import("./db");
        return searchClipboardItems(ctx.user.id, input.searchTerm);
      }),
    
    create: protectedProcedure
      .input(
        z.object({
          type: z.enum(["text", "image", "link"]),
          content: z.string(),
          imageUrl: z.string().optional(),
          metadata: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createClipboardItem } = await import("./db");
        return createClipboardItem({
          userId: ctx.user.id,
          ...input,
        });
      }),
    
    togglePin: protectedProcedure
      .input(z.object({ itemId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { togglePinClipboardItem } = await import("./db");
        return togglePinClipboardItem(input.itemId, ctx.user.id);
      }),
    
    toggleFavorite: protectedProcedure
      .input(z.object({ itemId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { toggleFavoriteClipboardItem } = await import("./db");
        return toggleFavoriteClipboardItem(input.itemId, ctx.user.id);
      }),
    
    delete: protectedProcedure
      .input(z.object({ itemId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteClipboardItem } = await import("./db");
        return deleteClipboardItem(input.itemId, ctx.user.id);
      }),
    
    clearAll: protectedProcedure.mutation(async ({ ctx }) => {
      const { clearAllClipboardItems } = await import("./db");
      return clearAllClipboardItems(ctx.user.id);
    }),
  }),
  
  tags: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserTags } = await import("./db");
      return getUserTags(ctx.user.id);
    }),
    
    create: protectedProcedure
      .input(z.object({ name: z.string(), color: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const { createTag } = await import("./db");
        return createTag({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
