"use server";
import { Redis } from "@upstash/redis";

// Ensure these are in your .env.local file
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function setBotDifficulty(mode: "god" | "human") {
  await redis.set("bot_settings:difficulty", mode);
  return { success: true, mode };
}

export async function getBotDifficulty() {
  const mode = await redis.get("bot_settings:difficulty");
  // Upstash returns the value directly
  return (mode as "god" | "human") || "god";
}