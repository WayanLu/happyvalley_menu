import { drizzle } from "drizzle-orm/neon-http";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema";
import * as dotenv from "dotenv";
import * as path from "path";

class DB_Service {
  private static instance: DB_Service | null = null;
  private db!: NeonHttpDatabase<typeof schema>;

  private constructor() {
    //this.instance = getInstance();
    try {
      const envPath = path.resolve(__dirname, "../../../.env.local");
      dotenv.config({ path: envPath });
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error("DATABASE_URL not found in environment variables");
      }

      const sql = neon(connectionString);
      this.db = drizzle(sql, { schema });
    } catch (error) {
      console.log(error);
    } finally {
      //process.exit(0);
    }
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new DB_Service();
    }
    return this.instance;
  }

  public getDB() {
    return this.db;
  }
}

const dbService = DB_Service.getInstance();
export default dbService;
