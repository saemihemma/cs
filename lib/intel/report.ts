/**
 * Intel Report Generator
 */

import { nanoid } from 'nanoid';
import { getTournament } from '../challengermode/client';
import { getSteam64FromMember, type TournamentLineup } from '../challengermode/types';
import { resolveAndGetStats } from '../faceit/client';
import type { IntelReport, PlayerIntel, TeamIntel, CS2Map } from './types';
import { CS2_MAPS } from './types';

/**
 * Generate intel report for an opponent lineup
 */
export async function generateIntelReport(
  tournamentId: string,
  lineupId: string
): Promise<IntelReport | null> {
  // Get tournament data
  const tournament = await getTournament(tournamentId);
  if (!tournament) {
    throw new Error(`Tournament ${tournamentId} not found`);
  }

  // Find the lineup
  const allLineups = [
    ...tournament.attendance.signups.lineups,
    ...(tournament.attendance.roster?.lineups || []),
  ];

  const lineup = allLineups.find(l => l.id === lineupId);
  if (!lineup) {
    throw new Error(`Lineup ${lineupId} not found in tournament`);
  }

  // Generate intel for each player
  const teamIntel = await generateTeamIntel(lineup);

  // Collect all unique maps
  const mapsSet = new Set<string>();
  for (const player of teamIntel.players) {
    for (const mapStat of player.mapStats) {
      mapsSet.add(mapStat.map);
    }
  }

  // Sort maps by CS2_MAPS order, then alphabetically for others
  const maps = Array.from(mapsSet).sort((a, b) => {
    const aIndex = CS2_MAPS.indexOf(a as CS2Map);
    const bIndex = CS2_MAPS.indexOf(b as CS2Map);
    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
    if (aIndex >= 0) return -1;
    if (bIndex >= 0) return 1;
    return a.localeCompare(b);
  });

  return {
    id: nanoid(12),
    createdAt: new Date(),
    tournamentId,
    tournamentName: tournament.name,
    opponentTeam: teamIntel,
    maps,
  };
}

/**
 * Generate team intel from a lineup
 */
async function generateTeamIntel(lineup: TournamentLineup): Promise<TeamIntel> {
  const players: PlayerIntel[] = [];

  for (const member of lineup.members) {
    const steam64 = getSteam64FromMember(member);

    if (!steam64) {
      players.push({
        username: member.user.username,
        steamId: member.gameAccountId,
        faceitNickname: null,
        faceitLevel: 0,
        faceitElo: 0,
        totalMatches: 0,
        overallWinRate: 0,
        mapStats: [],
      });
      continue;
    }

    const stats = await resolveAndGetStats(steam64);

    if (stats) {
      players.push({
        username: member.user.username,
        steamId: steam64,
        faceitNickname: stats.nickname,
        faceitLevel: stats.skillLevel,
        faceitElo: stats.elo,
        totalMatches: stats.totalMatches,
        overallWinRate: stats.overallWinRate,
        mapStats: stats.mapStats,
      });
    } else {
      players.push({
        username: member.user.username,
        steamId: steam64,
        faceitNickname: null,
        faceitLevel: 0,
        faceitElo: 0,
        totalMatches: 0,
        overallWinRate: 0,
        mapStats: [],
      });
    }
  }

  // Sort players by ELO descending
  players.sort((a, b) => b.faceitElo - a.faceitElo);

  return {
    lineupId: lineup.id,
    teamName: lineup.name,
    players,
  };
}

/**
 * Get map stats for a specific map across all players
 */
export function getMapStatsForTeam(
  team: TeamIntel,
  mapName: string
): Array<{ player: PlayerIntel; stats: { matches: number; wins: number; winRate: number } | null }> {
  return team.players.map(player => {
    const mapStat = player.mapStats.find(
      m => m.map.toLowerCase() === mapName.toLowerCase()
    );
    return {
      player,
      stats: mapStat ? { matches: mapStat.matches, wins: mapStat.wins, winRate: mapStat.winRate } : null,
    };
  });
}

/**
 * Calculate weighted team average win rate for a map
 * Weighted by number of matches played (players with more games have more influence)
 */
export function getTeamMapWinRate(team: TeamIntel, mapName: string): number | null {
  const stats = getMapStatsForTeam(team, mapName);
  const playersWithStats = stats.filter(s => s.stats && s.stats.matches >= 5);

  if (playersWithStats.length === 0) return null;

  // Weighted average: Σ(winRate × matches) / Σ(matches)
  let totalWeightedWinRate = 0;
  let totalMatches = 0;

  for (const { stats: playerStats } of playersWithStats) {
    if (playerStats) {
      totalWeightedWinRate += playerStats.winRate * playerStats.matches;
      totalMatches += playerStats.matches;
    }
  }

  return totalMatches > 0 ? totalWeightedWinRate / totalMatches : null;
}

/**
 * Calculate weighted team average win rate for a map using only top N players by ELO
 */
export function getTeamMapWinRateTopN(team: TeamIntel, mapName: string, topN: number = 5): number | null {
  // Team players are already sorted by ELO descending
  const topPlayers = team.players.slice(0, topN);
  const topTeam: TeamIntel = { ...team, players: topPlayers };
  return getTeamMapWinRate(topTeam, mapName);
}

/**
 * Get total games played by team on a specific map
 */
export function getTeamMapTotalGames(team: TeamIntel, mapName: string): number {
  let totalGames = 0;
  for (const player of team.players) {
    const mapStat = player.mapStats.find(
      m => m.map.toLowerCase() === mapName.toLowerCase()
    );
    if (mapStat) {
      totalGames += mapStat.matches;
    }
  }
  return totalGames;
}
