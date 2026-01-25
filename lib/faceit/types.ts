/**
 * FACEIT API Types
 */

export interface FaceitPlayer {
  player_id: string;
  nickname: string;
  avatar: string;
  country: string;
  faceit_url: string;
  games: {
    cs2?: {
      skill_level: number;
      faceit_elo: number;
      region: string;
    };
  };
}

export interface MapStats {
  map: string;
  matches: number;
  wins: number;
  winRate: number;
}

export interface FaceitPlayerStats {
  playerId: string;
  nickname: string;
  skillLevel: number;
  elo: number;
  kdRatio: number | null;
  mapStats: MapStats[];
  totalMatches: number;
}

export interface FaceitMapSegment {
  label: string;
  img_small: string;
  img_regular: string;
  stats: {
    Matches: string;
    Wins: string;
    'Win Rate %': string;
    [key: string]: string;
  };
}

export interface FaceitStatsResponse {
  player_id: string;
  game_id: string;
  lifetime: {
    Matches: string;
    Wins: string;
    'Win Rate %': string;
    [key: string]: string;
  };
  segments: FaceitMapSegment[];
}
