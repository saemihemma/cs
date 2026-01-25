/**
 * Intel Report Types
 */

import type { MapStats, FaceitPlayerStats } from '../faceit/types';

export interface PlayerIntel {
  username: string;
  steamId: string;
  faceitNickname: string | null;
  faceitLevel: number;
  faceitElo: number;
  totalMatches: number;
  overallWinRate: number;
  mapStats: MapStats[];
}

export interface TeamIntel {
  lineupId: string;
  teamName: string;
  players: PlayerIntel[];
}

export interface IntelReport {
  id: string;
  createdAt: Date;
  tournamentId: string;
  tournamentName: string;
  opponentTeam: TeamIntel;
  maps: string[]; // All unique maps across players
}

// Standard CS2 competitive maps (current map pool)
export const CS2_MAPS = [
  'Ancient',
  'Anubis',
  'Dust2',
  'Inferno',
  'Mirage',
  'Nuke',
  'Overpass',
] as const;

export type CS2Map = typeof CS2_MAPS[number];
