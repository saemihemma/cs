/**
 * FACEIT Data API v4 Client
 */

import type {
  FaceitPlayer,
  FaceitPlayerStats,
  FaceitStatsResponse,
  MapStats,
} from './types';
import { getCache, setCache, CacheCategories } from '../cache/manager';

const FACEIT_API_URL = 'https://open.faceit.com/data/v4';

// Cache TTL: 24 hours
const PLAYER_CACHE_TTL = 24 * 60 * 60 * 1000;

function getApiKey(): string {
  const key = process.env.FACEIT_API_KEY;
  if (!key) {
    throw new Error('FACEIT_API_KEY not set');
  }
  return key;
}

async function faceitFetch<T>(endpoint: string): Promise<T | null> {
  const url = `${FACEIT_API_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      Accept: 'application/json',
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`FACEIT API error: ${response.status} ${text}`);
  }

  return response.json();
}

/**
 * Find a FACEIT player by Steam64 ID
 */
export async function findPlayerBySteamId(steam64Id: string): Promise<FaceitPlayer | null> {
  return faceitFetch<FaceitPlayer>(`/players?game=cs2&game_player_id=${steam64Id}`);
}

/**
 * Find a FACEIT player by nickname
 */
export async function findPlayerByNickname(nickname: string): Promise<FaceitPlayer | null> {
  return faceitFetch<FaceitPlayer>(`/players?nickname=${encodeURIComponent(nickname)}`);
}

/**
 * Get CS2 stats for a player
 */
export async function getPlayerStats(playerId: string): Promise<FaceitStatsResponse | null> {
  return faceitFetch<FaceitStatsResponse>(`/players/${playerId}/stats/cs2`);
}

/**
 * Get formatted player stats with map breakdown
 */
export async function getFormattedPlayerStats(playerId: string, nickname: string): Promise<FaceitPlayerStats | null> {
  const stats = await getPlayerStats(playerId);
  if (!stats) return null;

  // Extract map stats from segments (only map segments, not mode segments)
  const mapSegments = stats.segments.filter(seg =>
    seg.label && !seg.label.includes('5v5') && !seg.label.includes('Premier')
  );

  const mapStats: MapStats[] = mapSegments.map(seg => ({
    map: seg.label,
    matches: parseInt(seg.stats.Matches || '0', 10),
    wins: parseInt(seg.stats.Wins || '0', 10),
    winRate: parseFloat(seg.stats['Win Rate %'] || '0'),
  }));

  // Sort by matches played (most played first)
  mapStats.sort((a, b) => b.matches - a.matches);

  return {
    playerId,
    nickname,
    skillLevel: 0, // Filled from player lookup
    elo: 0, // Filled from player lookup
    mapStats,
    totalMatches: parseInt(stats.lifetime.Matches || '0', 10),
    overallWinRate: parseFloat(stats.lifetime['Win Rate %'] || '0'),
  };
}

/**
 * Resolve Steam64 ID to FACEIT player stats (with caching)
 */
export async function resolveAndGetStats(steam64Id: string): Promise<FaceitPlayerStats | null> {
  // Check cache first
  const cacheKey = `steam_${steam64Id}`;
  const cached = await getCache<FaceitPlayerStats>(CacheCategories.PLAYERS, cacheKey);
  if (cached !== null) {
    return cached;
  }

  // First find the player
  const player = await findPlayerBySteamId(steam64Id);
  if (!player) {
    // Cache the null result to avoid repeated lookups for unknown players
    await setCache(CacheCategories.PLAYERS, cacheKey, null, PLAYER_CACHE_TTL);
    return null;
  }

  // Then get their stats
  const stats = await getFormattedPlayerStats(player.player_id, player.nickname);
  if (!stats) {
    return null;
  }

  // Add skill level and elo from player lookup
  stats.skillLevel = player.games?.cs2?.skill_level || 0;
  stats.elo = player.games?.cs2?.faceit_elo || 0;

  // Cache the result
  await setCache(CacheCategories.PLAYERS, cacheKey, stats, PLAYER_CACHE_TTL);

  return stats;
}

/**
 * Batch resolve multiple Steam IDs to FACEIT stats
 * Returns a map of Steam64 ID -> FaceitPlayerStats
 */
export async function batchResolveStats(
  steam64Ids: string[]
): Promise<Map<string, FaceitPlayerStats | null>> {
  const results = new Map<string, FaceitPlayerStats | null>();

  // Process in parallel with concurrency limit
  const BATCH_SIZE = 5;
  for (let i = 0; i < steam64Ids.length; i += BATCH_SIZE) {
    const batch = steam64Ids.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (steamId) => {
        try {
          const stats = await resolveAndGetStats(steamId);
          return { steamId, stats };
        } catch (error) {
          console.error(`Failed to get stats for ${steamId}:`, error);
          return { steamId, stats: null };
        }
      })
    );

    for (const { steamId, stats } of batchResults) {
      results.set(steamId, stats);
    }
  }

  return results;
}

/**
 * Force refresh stats for a player (bypass cache)
 */
export async function refreshPlayerStats(steam64Id: string): Promise<FaceitPlayerStats | null> {
  const cacheKey = `steam_${steam64Id}`;

  // First find the player
  const player = await findPlayerBySteamId(steam64Id);
  if (!player) {
    await setCache(CacheCategories.PLAYERS, cacheKey, null, PLAYER_CACHE_TTL);
    return null;
  }

  // Then get their stats
  const stats = await getFormattedPlayerStats(player.player_id, player.nickname);
  if (!stats) {
    return null;
  }

  // Add skill level and elo from player lookup
  stats.skillLevel = player.games?.cs2?.skill_level || 0;
  stats.elo = player.games?.cs2?.faceit_elo || 0;

  // Update cache with fresh data
  await setCache(CacheCategories.PLAYERS, cacheKey, stats, PLAYER_CACHE_TTL);

  return stats;
}
