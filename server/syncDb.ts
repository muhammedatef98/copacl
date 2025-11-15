import { eq, and, desc } from "drizzle-orm";
import { devices, syncQueue, userKeys, InsertDevice, InsertSyncQueue, InsertUserKey } from "../drizzle/schema";
import { getDb } from "./db";

// Device management
export async function registerDevice(device: InsertDevice) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [newDevice] = await db.insert(devices).values(device).$returningId();
  return newDevice;
}

export async function getUserDevices(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(devices)
    .where(and(eq(devices.userId, userId), eq(devices.isActive, 1)))
    .orderBy(desc(devices.lastSyncAt));
}

export async function getDeviceByDeviceId(deviceId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(devices)
    .where(eq(devices.deviceId, deviceId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateDeviceSync(deviceId: string, lastSyncAt: Date) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(devices)
    .set({ lastSyncAt })
    .where(eq(devices.deviceId, deviceId));
}

export async function deactivateDevice(deviceId: string) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(devices)
    .set({ isActive: 0 })
    .where(eq(devices.deviceId, deviceId));
}

// Sync queue management
export async function addToSyncQueue(syncItem: InsertSyncQueue) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [newItem] = await db.insert(syncQueue).values(syncItem).$returningId();
  return newItem;
}

export async function getPendingSyncItems(userId: number, deviceId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(syncQueue)
    .where(
      and(
        eq(syncQueue.userId, userId),
        eq(syncQueue.deviceId, deviceId),
        eq(syncQueue.syncStatus, "pending")
      )
    )
    .orderBy(desc(syncQueue.createdAt));
}

export async function getAllPendingSyncItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(syncQueue)
    .where(
      and(
        eq(syncQueue.userId, userId),
        eq(syncQueue.syncStatus, "pending")
      )
    )
    .orderBy(desc(syncQueue.createdAt));
}

export async function markSyncItemSynced(syncId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(syncQueue)
    .set({ syncStatus: "synced", syncedAt: new Date() })
    .where(eq(syncQueue.id, syncId));
}

export async function markSyncItemFailed(syncId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(syncQueue)
    .set({ syncStatus: "failed" })
    .where(eq(syncQueue.id, syncId));
}

// User encryption keys
export async function storeUserKey(userKey: InsertUserKey) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userKeys).values(userKey).onDuplicateKeyUpdate({
    set: {
      encryptedMasterKey: userKey.encryptedMasterKey,
      salt: userKey.salt,
    },
  });
}

export async function getUserKey(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(userKeys)
    .where(eq(userKeys.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}
