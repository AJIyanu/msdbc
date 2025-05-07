"use server";

import { Redis } from "@upstash/redis";

// Initialize Redis with Vercel KV credentials
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const CLASSES_KEY = "classes";

// Get classes from Redis
export async function getClassesFromFile(): Promise<string[]> {
  try {
    const classes = await redis.get<string[]>(CLASSES_KEY);

    if (!classes) {
      const defaultClasses = [
        "Beginners",
        "Primary",
        "Junior",
        "Teen",
        "Youth",
        "Adult",
      ];
      await redis.set(CLASSES_KEY, defaultClasses);
      return defaultClasses;
    }

    return classes;
  } catch {
    throw new Error("Failed to read classes from KV storage");
  }
}

// Add class to Redis
export async function addClassToFile(className: string): Promise<void> {
  try {
    const classes = (await redis.get<string[]>(CLASSES_KEY)) || [];

    if (!classes.includes(className)) {
      classes.push(className);
      await redis.set(CLASSES_KEY, classes);
    }
  } catch {
    throw new Error("Failed to add class to KV storage");
  }
}

// Remove class from Redis
export async function removeClassFromFile(className: string): Promise<void> {
  try {
    const classes = await redis.get<string[]>(CLASSES_KEY);
    if (!classes) return;

    const updatedClasses = classes.filter((c) => c !== className);
    await redis.set(CLASSES_KEY, updatedClasses);
  } catch {
    throw new Error("Failed to remove class from KV storage");
  }
}
