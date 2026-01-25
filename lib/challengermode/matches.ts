/**
 * Challengermode Match History and Veto Data
 */

import { getAuthHeaders } from './auth';

const GRAPHQL_URL = 'https://publicapi.challengermode.com/graphql';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const headers = await getAuthHeaders();

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GraphQL request failed: ${response.status} ${text}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors?.length) {
    throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(', ')}`);
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL');
  }

  return result.data;
}

// Types for match data
export interface MatchGameSession {
  id: string;
  map?: string;
  winner?: {
    id: string;
    name: string;
  };
  statistics?: Record<string, unknown>;
  lobbyInformation?: Record<string, unknown>;
}

export interface MatchSeriesMatch {
  id: string;
  matchNumber: number;
  gameSession?: MatchGameSession;
  result?: {
    winner?: {
      id: string;
      name: string;
    };
    scores?: Array<{
      lineup: { id: string; name: string };
      score: number;
    }>;
  };
}

export interface MatchSeriesWithMatches {
  id: string;
  state: string;
  format: string;
  startedAt?: string;
  completedAt?: string;
  lineups: Array<{
    id: string;
    name: string;
  }>;
  matches: MatchSeriesMatch[];
  gameSessionSettings?: string; // JSON blob
}

/**
 * Get a match series with full match details including maps played
 */
export async function getMatchSeriesWithMatches(matchSeriesId: string): Promise<MatchSeriesWithMatches | null> {
  const query = `
    query GetMatchSeriesWithMatches($id: UUID!) {
      matchSeries(matchSeriesId: $id) {
        id
        state
        format
        startedAt
        completedAt
        lineups {
          id
          name
        }
        matches {
          id
          matchNumber
          result {
            winner {
              id
              name
            }
            scores {
              lineup {
                id
                name
              }
              score
            }
          }
          gameSession {
            id
            statistics
            lobbyInformation
          }
        }
        gameSessionSettings
      }
    }
  `;

  const result = await graphqlRequest<{ matchSeries: MatchSeriesWithMatches | null }>(query, { id: matchSeriesId });
  return result.matchSeries;
}

export interface TournamentMatchSeriesNode {
  id: string;
  state: string;
  startedAt?: string;
  completedAt?: string;
  lineups: Array<{
    id: string;
    name: string;
  }>;
}

export interface TournamentMatchSeriesConnection {
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string;
  };
  nodes: TournamentMatchSeriesNode[];
}

/**
 * Get matches for a tournament - uses tournament brackets/stages approach
 * Note: The API may not expose match series connection directly on tournament
 */
export async function getTournamentBrackets(tournamentId: string): Promise<{
  brackets: Array<{
    id: string;
    name?: string;
    matchSeries: TournamentMatchSeriesNode[];
  }>;
}> {
  const query = `
    query GetTournamentBrackets($id: UUID!) {
      tournament(tournamentId: $id) {
        id
        name
        brackets {
          id
          name
          matchSeries {
            id
            state
            startedAt
            completedAt
            lineups {
              id
              name
            }
          }
        }
      }
    }
  `;

  try {
    const result = await graphqlRequest<{
      tournament: {
        brackets?: Array<{
          id: string;
          name?: string;
          matchSeries: TournamentMatchSeriesNode[];
        }>;
      } | null;
    }>(query, { id: tournamentId });

    if (!result.tournament) {
      throw new Error(`Tournament ${tournamentId} not found`);
    }

    return { brackets: result.tournament.brackets || [] };
  } catch (error) {
    // If brackets query fails, return empty - API may not support this field
    console.error('Failed to get tournament brackets:', error);
    return { brackets: [] };
  }
}

/**
 * Get all match series for a specific lineup in a tournament
 */
export async function getLineupMatches(
  tournamentId: string,
  lineupId: string
): Promise<TournamentMatchSeriesNode[]> {
  // Try getting matches from tournament brackets
  const { brackets } = await getTournamentBrackets(tournamentId);

  const allMatches: TournamentMatchSeriesNode[] = [];
  for (const bracket of brackets) {
    if (bracket.matchSeries) {
      allMatches.push(...bracket.matchSeries);
    }
  }

  // Filter to matches involving the specific lineup
  return allMatches.filter(match =>
    match.lineups.some(lineup => lineup.id === lineupId)
  );
}

// Match history summary types
export interface MapResult {
  map: string;
  winner: string;
  winnerLineupId: string;
  scores: { team: string; score: number }[];
}

export interface MatchHistoryEntry {
  matchSeriesId: string;
  opponent: { id: string; name: string };
  startedAt?: string;
  completedAt?: string;
  state: string;
  maps: MapResult[];
  result?: 'WIN' | 'LOSS' | 'ONGOING';
}

/**
 * Parse a completed match series to extract map results
 * Note: Map info may be in gameSession.statistics or gameSessionSettings
 */
export function parseMatchSeries(
  matchSeries: MatchSeriesWithMatches,
  ourLineupId: string
): MatchHistoryEntry | null {
  if (!matchSeries.lineups || matchSeries.lineups.length !== 2) {
    return null;
  }

  // Identify opponent
  const ourLineup = matchSeries.lineups.find(l => l.id === ourLineupId);
  const opponent = matchSeries.lineups.find(l => l.id !== ourLineupId);

  if (!ourLineup || !opponent) {
    return null;
  }

  // Extract map results from matches
  const maps: MapResult[] = [];
  for (const match of matchSeries.matches) {
    if (!match.result) continue;

    // Try to extract map name from gameSession
    let mapName = 'Unknown';
    if (match.gameSession?.statistics) {
      // Check if map info is in statistics
      const stats = match.gameSession.statistics as Record<string, unknown>;
      if (stats.map) mapName = String(stats.map);
    }
    if (match.gameSession?.lobbyInformation) {
      const lobby = match.gameSession.lobbyInformation as Record<string, unknown>;
      if (lobby.map) mapName = String(lobby.map);
    }

    const scores: { team: string; score: number }[] = [];
    if (match.result.scores) {
      for (const s of match.result.scores) {
        scores.push({ team: s.lineup.name, score: s.score });
      }
    }

    if (match.result.winner) {
      maps.push({
        map: mapName,
        winner: match.result.winner.name,
        winnerLineupId: match.result.winner.id,
        scores,
      });
    }
  }

  // Determine overall result
  let result: 'WIN' | 'LOSS' | 'ONGOING' | undefined;
  if (matchSeries.state === 'COMPLETED') {
    const winsForUs = maps.filter(m => m.winnerLineupId === ourLineupId).length;
    const winsForOpponent = maps.filter(m => m.winnerLineupId === opponent.id).length;
    result = winsForUs > winsForOpponent ? 'WIN' : 'LOSS';
  } else if (matchSeries.state === 'RUNNING') {
    result = 'ONGOING';
  }

  return {
    matchSeriesId: matchSeries.id,
    opponent,
    startedAt: matchSeries.startedAt,
    completedAt: matchSeries.completedAt,
    state: matchSeries.state,
    maps,
    result,
  };
}

/**
 * Get full match history for a lineup in a tournament
 */
export async function getFullMatchHistory(
  tournamentId: string,
  lineupId: string
): Promise<MatchHistoryEntry[]> {
  // Get all matches involving the lineup
  const matchNodes = await getLineupMatches(tournamentId, lineupId);

  // Filter to completed or running matches
  const relevantMatches = matchNodes.filter(
    m => m.state === 'COMPLETED' || m.state === 'RUNNING'
  );

  // Fetch detailed info for each match and parse
  const history: MatchHistoryEntry[] = [];
  for (const node of relevantMatches) {
    try {
      const fullMatch = await getMatchSeriesWithMatches(node.id);
      if (fullMatch) {
        const parsed = parseMatchSeries(fullMatch, lineupId);
        if (parsed) {
          history.push(parsed);
        }
      }
    } catch (error) {
      console.error(`Failed to fetch match ${node.id}:`, error);
    }
  }

  // Sort by date (most recent first)
  history.sort((a, b) => {
    const dateA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
    const dateB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
    return dateB - dateA;
  });

  return history;
}
