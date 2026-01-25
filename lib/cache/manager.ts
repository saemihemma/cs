/**
 * File-based Cache Manager
 * Stores JSON data with timestamps for configurable TTL
 */

import { promises as fs } from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'data', 'cache');

// Default TTL: 24 hours in milliseconds
const DEFAULT_TTL = 24 * 60 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  ttl: number;
}

/**
 * Ensure cache directory exists
 */
async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

/**
 * Get cache file path for a given key and category
 */
function getCachePath(category: string, key: string): string {
  // Sanitize key to be filesystem safe
  const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
  return path.join(CACHE_DIR, category, `${safeKey}.json`);
}

/**
 * Get cached data if it exists and is not expired
 */
export async function getCache<T>(
  category: string,
  key: string
): Promise<T | null> {
  const filePath = getCachePath(category, key);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const entry: CacheEntry<T> = JSON.parse(content);

    // Check if cache is expired
    const now = Date.now();
    if (now - entry.cachedAt > entry.ttl) {
      // Cache expired, delete and return null
      await fs.unlink(filePath).catch(() => {});
      return null;
    }

    return entry.data;
  } catch {
    // File doesn't exist or is invalid
    return null;
  }
}

/**
 * Set cache data
 */
export async function setCache<T>(
  category: string,
  key: string,
  data: T,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  const filePath = getCachePath(category, key);
  const dir = path.dirname(filePath);

  await ensureDir(dir);

  const entry: CacheEntry<T> = {
    data,
    cachedAt: Date.now(),
    ttl,
  };

  await fs.writeFile(filePath, JSON.stringify(entry, null, 2), 'utf-8');
}

/**
 * Delete specific cache entry
 */
export async function deleteCache(category: string, key: string): Promise<void> {
  const filePath = getCachePath(category, key);
  try {
    await fs.unlink(filePath);
  } catch {
    // File doesn't exist
  }
}

/**
 * Clear all cache in a category
 */
export async function clearCategory(category: string): Promise<void> {
  const categoryPath = path.join(CACHE_DIR, category);
  try {
    const files = await fs.readdir(categoryPath);
    await Promise.all(
      files.map((file) => fs.unlink(path.join(categoryPath, file)))
    );
  } catch {
    // Directory doesn't exist
  }
}

/**
 * Clear all cache
 */
export async function clearAllCache(): Promise<void> {
  try {
    const categories = await fs.readdir(CACHE_DIR);
    await Promise.all(categories.map((cat) => clearCategory(cat)));
  } catch {
    // Cache directory doesn't exist
  }
}

/**
 * Get cache stats
 */
export async function getCacheStats(): Promise<{
  categories: { name: string; files: number; size: number }[];
  totalFiles: number;
  totalSize: number;
}> {
  const stats: { name: string; files: number; size: number }[] = [];
  let totalFiles = 0;
  let totalSize = 0;

  try {
    const categories = await fs.readdir(CACHE_DIR);
    for (const cat of categories) {
      const catPath = path.join(CACHE_DIR, cat);
      const catStats = await fs.stat(catPath);
      if (catStats.isDirectory()) {
        const files = await fs.readdir(catPath);
        let catSize = 0;
        for (const file of files) {
          const fileStats = await fs.stat(path.join(catPath, file));
          catSize += fileStats.size;
        }
        stats.push({ name: cat, files: files.length, size: catSize });
        totalFiles += files.length;
        totalSize += catSize;
      }
    }
  } catch {
    // Cache directory doesn't exist
  }

  return { categories: stats, totalFiles, totalSize };
}

/**
 * Wrapper for caching async function results
 */
export async function withCache<T>(
  category: string,
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  // Try to get from cache first
  const cached = await getCache<T>(category, key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Store in cache
  await setCache(category, key, data, ttl);

  return data;
}

// Export cache categories as constants
export const CacheCategories = {
  TOURNAMENTS: 'tournaments',
  PLAYERS: 'players',
  MATCHES: 'matches',
} as const;
