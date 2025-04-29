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
    const envPath = path.resolve(__dirname, "../../../.env.local");
    dotenv.config({ path: envPath });
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL not found in environment variables");
    }

    console.log("Populating database...");
    const sql = neon(connectionString);
    const db = drizzle(sql, { schema });

    //populating database
    let displayOrderVal = 1;
    const categoryIdMap = new Map<string, number>();
    // inserting category table
    for (const [category, itemList] of Object.entries(typedMenuData.menu)) {
      // Insert category
      await db.insert(schema.categories).values({
        name: category,
        displayOrder: displayOrderVal++,
      });

      // Insert menu items
      for (const item of itemList) {
        // Handle different price formats
        let priceInCents;

        if (item.price === "Seasonal") {
          // Use -1 to indicate seasonal/variable pricing
          priceInCents = -1;
        } else {
          // Convert price to cents
          priceInCents =
            typeof item.price === "string"
              ? Math.round(parseFloat(item.price) * 100)
              : Math.round(item.price * 100);
        }

        await db.insert(schema.menuItems).values({
          name: item.name,
          description: "test",
          price: priceInCents,
          category: category,
          isAvailable: true,
        });
      }
    }
  } catch (error) {
    console.error("Populating database failed:", error);
  } finally {
    process.exit(0);
  }
}

populateDatabase();
