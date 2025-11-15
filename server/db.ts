import { and, desc, eq, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { clipboardItems, InsertClipboardItem, InsertTag, InsertUser, tags, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Clipboard Items queries
export async function createClipboardItem(item: InsertClipboardItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(clipboardItems).values(item);
  return result;
}

export async function getUserClipboardItems(userId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(clipboardItems)
    .where(eq(clipboardItems.userId, userId))
    .orderBy(desc(clipboardItems.isPinned), desc(clipboardItems.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function searchClipboardItems(userId: number, searchTerm: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(clipboardItems)
    .where(
      and(
        eq(clipboardItems.userId, userId),
        like(clipboardItems.content, `%${searchTerm}%`)
      )
    )
    .orderBy(desc(clipboardItems.isPinned), desc(clipboardItems.createdAt));
}

export async function togglePinClipboardItem(itemId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const item = await db
    .select()
    .from(clipboardItems)
    .where(and(eq(clipboardItems.id, itemId), eq(clipboardItems.userId, userId)))
    .limit(1);
  
  if (item.length === 0) throw new Error("Item not found");
  
  return db
    .update(clipboardItems)
    .set({ isPinned: item[0].isPinned ? 0 : 1 })
    .where(eq(clipboardItems.id, itemId));
}

export async function toggleFavoriteClipboardItem(itemId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const item = await db
    .select()
    .from(clipboardItems)
    .where(and(eq(clipboardItems.id, itemId), eq(clipboardItems.userId, userId)))
    .limit(1);
  
  if (item.length === 0) throw new Error("Item not found");
  
  return db
    .update(clipboardItems)
    .set({ isFavorite: item[0].isFavorite ? 0 : 1 })
    .where(eq(clipboardItems.id, itemId));
}

export async function deleteClipboardItem(itemId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .delete(clipboardItems)
    .where(and(eq(clipboardItems.id, itemId), eq(clipboardItems.userId, userId)));
}

export async function clearAllClipboardItems(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(clipboardItems).where(eq(clipboardItems.userId, userId));
}

// Tags queries
export async function createTag(tag: InsertTag) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(tags).values(tag);
}

export async function getUserTags(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tags).where(eq(tags.userId, userId));
}
