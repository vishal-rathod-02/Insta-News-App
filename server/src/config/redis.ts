import { Redis } from "@upstash/redis";

// In-Memory Fallback Cache Store
const memoryStore = new Map<string, { value: any; expiresAt: number }>();

let redisClient: Redis | null = null;

try {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token && !url.includes("YOUR_")) {
    redisClient = new Redis({ url, token });
    console.log("Redis Client initialized successfully (Upstash).");
  } else {
    console.log("Upstash Redis credentials not set. Falling back to resilient in-memory cache.");
  }
} catch (error) {
  console.warn("Failed to initialize Redis client, falling back to in-memory cache:", error);
}

/**
 * Get cached item from Redis or In-Memory fallback
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    if (redisClient) {
      const data = await redisClient.get<T>(key);
      return data;
    }
  } catch (error) {
    console.warn(`Redis getCache error for key "${key}":`, error);
  }

  // Fallback to in-memory map
  const item = memoryStore.get(key);
  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    memoryStore.delete(key);
    return null;
  }

  return item.value as T;
};

/**
 * Set cached item in Redis or In-Memory fallback
 */
export const setCache = async (
  key: string,
  value: any,
  ttlSeconds: number = 180
): Promise<void> => {
  try {
    if (redisClient) {
      await redisClient.set(key, JSON.stringify(value), { ex: ttlSeconds });
      return;
    }
  } catch (error) {
    console.warn(`Redis setCache error for key "${key}":`, error);
  }

  // Fallback to in-memory map
  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};
