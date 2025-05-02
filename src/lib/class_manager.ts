"use server";

import fs from "fs/promises";
import path from "path";

const classesFilePath = path.join(process.cwd(), "data", "classes.json");

// Ensure the data directory exists
async function ensureDirectoryExists() {
  const dir = path.dirname(classesFilePath);
  try {
    await fs.access(dir);
  } catch {
    // console.error("Directory does not exist, ", error);
    await fs.mkdir(dir, { recursive: true });
  }
}

// Get classes from file
export async function getClassesFromFile(): Promise<string[]> {
  await ensureDirectoryExists();

  try {
    // Check if file exists
    try {
      await fs.access(classesFilePath);
    } catch {
      const defaultClasses = [
        "Beginners",
        "Primary",
        "Junior",
        "Teen",
        "Youth",
        "Adult",
      ];
      await fs.writeFile(
        classesFilePath,
        JSON.stringify(defaultClasses, null, 2)
      );
      return defaultClasses;
    }

    // Read file
    const data = await fs.readFile(classesFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    // console.error("Error reading classes file:", error);
    throw new Error("Failed to read classes from file");
  }
}

// Add class to file
export async function addClassToFile(className: string): Promise<void> {
  await ensureDirectoryExists();

  try {
    let classes: string[] = [];

    // Check if file exists
    try {
      await fs.access(classesFilePath);
      const data = await fs.readFile(classesFilePath, "utf-8");
      classes = JSON.parse(data);
    } catch {
      // If file doesn't exist, create an empty array
      classes = [];
    }

    // Add class if it doesn't already exist
    if (!classes.includes(className)) {
      classes.push(className);
      await fs.writeFile(classesFilePath, JSON.stringify(classes, null, 2));
    }
  } catch {
    // console.error("Error adding class to file:", error);
    throw new Error("Failed to add class to file");
  }
}

// Remove class from file
export async function removeClassFromFile(className: string): Promise<void> {
  await ensureDirectoryExists();

  try {
    // Check if file exists
    try {
      await fs.access(classesFilePath);
    } catch {
      // If file doesn't exist, nothing to remove
      return;
    }

    // Read file
    const data = await fs.readFile(classesFilePath, "utf-8");
    const classes: string[] = JSON.parse(data);

    // Remove class
    const updatedClasses = classes.filter((c) => c !== className);

    // Write updated classes back to file
    await fs.writeFile(
      classesFilePath,
      JSON.stringify(updatedClasses, null, 2)
    );
  } catch {
    // console.error("Error removing class from file:", error);
    throw new Error("Failed to remove class from file");
  }
}
