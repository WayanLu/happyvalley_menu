import dbService from "../singleton";
import { eq } from "drizzle-orm";
import * as schema from "../schema";

import { MenuItem, MenuData } from "../types";

export async function createMenuItem(menuItemData: MenuItem) {
  try {
    const db = dbService.getDB();
    console.log(menuItemData);
    const result = await db.insert(schema.menuItems).values({
      name: "testitem",
      description: "test",
      price: 99.99,
      category: "Appetizers",
      isAvailable: true,
    });

    console.log("created item");
    return result;
  } catch (error) {
    console.error("Error creating menu item: ", error);
    throw new Error("Failed to create menu item");
  }
}

export async function getMenuItemById(id: number) {
  try {
    const db = dbService.getDB();
    console.log("start get");
    const result = await db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.id, id));
    console.log("end get");
    return result[0];
  } catch (error) {
    console.error("Error getting menu item: ", error);
    throw new Error("Failed to get menu item");
  }
}

export async function updateItem(id: string, updateData: any) {
  try {
    const db = dbService.getDB();
  } catch (error) {}
}

export async function deleteItem(id: string) {
  try {
    const db = dbService.getDB();
  } catch (error) {}
}

const testItem = {
  name: "testitem",
  description: "test",
  price: 99.99,
  category: "Appetizers",
  isAvailable: true,
};

async function testFunction(id: number) {
  try {
    const result = await getMenuItemById(id); // Add await here
    console.log("Result:", result);
  } catch (error) {
    console.error("Test failed:", error);
  }
}
testFunction(40);
