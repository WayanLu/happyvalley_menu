import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import menuData from "@/app/data.json";
import * as schema from "./schema";
import * as dotenv from "dotenv";
import * as path from "path";

interface MenuItem {
  id: number;
  name: string;
  price: number | string;
}

interface MenuData {
  menu: {
    [category: string]: MenuItem[];
  };
}

async function populateDatabase() {
  try {
    const typedMenuData = menuData as MenuData;
    // Load env variables
    /* const envPath = path.resolve(process.cwd(), ".env.local");
    dotenv.config({ path: envPath });
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL not found in environment variables");
    } */
    // populating database

    Object.entries(typedMenuData.menu).forEach(([category, itemList]) => {
      console.log(category);

      for (const item of itemList) {
        console.log(item);
      }
    });

    console.log("Populating database...");
    /* const sql = neon(connectionString);
    const db = drizzle(sql, { schema }); */
  } catch (error) {
    console.error("Populating database failed:", error);
  } finally {
    process.exit(0);
  }
}

populateDatabase();
