// src/db/index.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/services/db/schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
