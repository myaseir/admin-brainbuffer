"use server";
import { Redis } from "@upstash/redis";

// Ensure these are in your .env.local file
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 1. Updated Type to include "intelligent"
type BotDifficulty = "god" | "human" | "intelligent";

export async function setBotDifficulty(mode: BotDifficulty) {
  try {
    await redis.set("bot_settings:difficulty", mode);
    return { success: true, mode };
  } catch (error) {
    console.error("Failed to set bot difficulty:", error);
    return { success: false, error: "Failed to update Redis" };
  }
}

export async function getBotDifficulty(): Promise<BotDifficulty> {
  try {
    const mode = await redis.get("bot_settings:difficulty");
    
    // 2. Cast the return value and provide a fallback
    return (mode as BotDifficulty) || "god";
  } catch (error) {
    console.error("Failed to get bot difficulty:", error);
    return "god"; // Default fallback
  }
}