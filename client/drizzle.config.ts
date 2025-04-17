// drizzle.config.ts
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Parse the connection string to extract components
const connectionString = process.env.DATABASE_URL || "";
let credentials: any = {};

if (connectionString) {
  try {
    const url = new URL(connectionString);
    credentials = {
      host: url.hostname,
      port: parseInt(url.port || "5432"),
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1), // Remove leading '/'
    };
  } catch (e) {
    console.error("Error parsing DATABASE_URL:", e);
  }
}

export default {
  schema: "./src/services/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: credentials,
} satisfies Config;
