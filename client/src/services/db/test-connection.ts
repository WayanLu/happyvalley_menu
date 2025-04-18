// src/services/db/test-connection.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import * as fs from "fs";
import * as path from "path";

async function testConnection() {
  try {
    console.log("Loading environment variables manually...");
    // Read .env.local file and extract DATABASE_URL
    const envPath = path.resolve(process.cwd(), ".env.local");
    const envFile = fs.readFileSync(envPath, "utf8");
    const databaseUrl = envFile
      .split("\n")
      .find((line) => line.startsWith("DATABASE_URL="))
      ?.split("=")[1]
      ?.trim();

    if (!databaseUrl) {
      throw new Error("DATABASE_URL not found in .env.local file");
    }

    console.log("Testing database connection...");
    const sql = neon(databaseUrl);
    const db = drizzle(sql, { schema });

    const result = await db.select().from(schema.menuItems);
    console.log("Connection successful!");
    console.log("Data:", result);
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    process.exit(0);
  }
}

testConnection();
