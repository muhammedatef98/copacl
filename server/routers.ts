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

  sync: router({
    // Register or update device
    registerDevice: protectedProcedure
      .input(
        z.object({
          deviceId: z.string(),
          deviceName: z.string(),
          deviceType: z.string().optional(),
          publicKey: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { registerDevice, getDeviceByDeviceId } = await import("./syncDb");
        
        // Check if device already exists
        const existing = await getDeviceByDeviceId(input.deviceId);
        if (existing) {
          return { success: true, device: existing };
        }
        
        const deviceId = await registerDevice({
          userId: ctx.user.id,
          ...input,
        });
        
        return { success: true, deviceId };
      }),

    // Get user's devices
    getDevices: protectedProcedure.query(async ({ ctx }) => {
      const { getUserDevices } = await import("./syncDb");
      return getUserDevices(ctx.user.id);
    }),

    // Deactivate device
    deactivateDevice: protectedProcedure
      .input(z.object({ deviceId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { deactivateDevice } = await import("./syncDb");
        await deactivateDevice(input.deviceId);
        return { success: true };
      }),

    // Add item to sync queue
    addToQueue: protectedProcedure
      .input(
        z.object({
          deviceId: z.string(),
          itemId: z.number(),
          action: z.enum(["create", "update", "delete"]),
          encryptedData: z.string().optional(),
          iv: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { addToSyncQueue } = await import("./syncDb");
        const syncId = await addToSyncQueue({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true, syncId };
      }),

    // Get pending sync items
    getPendingItems: protectedProcedure
      .input(z.object({ deviceId: z.string() }).optional())
      .query(async ({ ctx, input }) => {
        const { getPendingSyncItems, getAllPendingSyncItems } = await import("./syncDb");
        
        if (input?.deviceId) {
          return getPendingSyncItems(ctx.user.id, input.deviceId);
        }
        
        return getAllPendingSyncItems(ctx.user.id);
      }),

    // Mark sync item as synced
    markSynced: protectedProcedure
      .input(z.object({ syncId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { markSyncItemSynced } = await import("./syncDb");
        await markSyncItemSynced(input.syncId);
        return { success: true };
      }),

    // Store/update user encryption key
    storeKey: protectedProcedure
      .input(
        z.object({
          encryptedMasterKey: z.string(),
          salt: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { storeUserKey } = await import("./syncDb");
        await storeUserKey({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    // Get user encryption key
    getKey: protectedProcedure.query(async ({ ctx }) => {
      const { getUserKey } = await import("./syncDb");
      return getUserKey(ctx.user.id);
    }),

    // Update device last sync time
    updateLastSync: protectedProcedure
      .input(z.object({ deviceId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { updateDeviceSync } = await import("./syncDb");
        await updateDeviceSync(input.deviceId, new Date());
        return { success: true };
      }),
  }),

  folders: router({    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserFolders } = await import("./db");
      return getUserFolders(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          color: z.string().optional(),
          icon: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createFolder } = await import("./db");
        return createFolder({
          userId: ctx.user.id,
          ...input,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          folderId: z.number(),
          name: z.string().optional(),
          color: z.string().optional(),
          icon: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { updateFolder } = await import("./db");
        const { folderId, ...updates } = input;
        return updateFolder(folderId, updates);
      }),

    delete: protectedProcedure
      .input(z.object({ folderId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteFolder } = await import("./db");
        return deleteFolder(input.folderId);
      }),

    moveItem: protectedProcedure
      .input(
        z.object({
          itemId: z.number(),
          folderId: z.number().nullable(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { moveItemToFolder } = await import("./db");
        return moveItemToFolder(input.itemId, input.folderId);
      }),

    getItemCount: protectedProcedure
      .input(z.object({ folderId: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getFolderItemCount } = await import("./db");
        return getFolderItemCount(input.folderId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
