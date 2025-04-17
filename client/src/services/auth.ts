// src/services/auth.ts
import { db } from "@/services/db";
import {
  adminUsers,
  type AdminUser,
  type NewAdminUser,
} from "@/services/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function createAdminUser(username: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);

  return await db
    .insert(adminUsers)
    .values({
      username,
      passwordHash,
    })
    .returning();
}

export async function verifyAdminLogin(username: string, password: string) {
  const users = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username));

  const user = users[0];
  if (!user) return null;

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) return null;

  return { id: user.id, username: user.username };
}

export async function getAdminUserById(id: number) {
  const users = await db.select().from(adminUsers).where(eq(adminUsers.id, id));

  const user = users[0];
  if (!user) return null;

  return { id: user.id, username: user.username };
}
