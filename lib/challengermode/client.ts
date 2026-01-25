/**
 * Challengermode GraphQL Client
 */

import { getAuthHeaders } from './auth';
import type {
  Tournament,
  TournamentLineup,
  MatchSeries,
} from './types';

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

/**
 * Get tournament by ID with all registered lineups and members
 */
export async function getTournament(tournamentId: string): Promise<Tournament | null> {
  const query = `
    query GetTournament($id: UUID!) {
      tournament(tournamentId: $id) {
        id
        name
        state
        attendance {
          confirmedLineupCount
          signups {
            lineupCount
            lineups {
              id
              name
              members {
                gameAccountId
                captain
                user {
                  userId
                  username
                  connectedAccounts {
                    provider
                    id
                  }
                }
              }
            }
          }
          roster {
            lineups {
              id
              name
              members {
                gameAccountId
                captain
                user {
                  userId
                  username
                  connectedAccounts {
                    provider
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const result = await graphqlRequest<{ tournament: Tournament | null }>(query, { id: tournamentId });
  return result.tournament;
}

/**
 * Get a specific lineup by ID
 */
export async function getLineup(lineupId: string): Promise<TournamentLineup | null> {
  const query = `
    query GetLineup($id: UUID!) {
      tournamentLineup(id: $id) {
        id
        name
        members {
          gameAccountId
          captain
          user {
            userId
            username
            connectedAccounts {
              provider
              id
            }
          }
        }
      }
    }
  `;

  const result = await graphqlRequest<{ tournamentLineup: TournamentLineup | null }>(query, { id: lineupId });
  return result.tournamentLineup;
}

/**
 * Get a match series by ID
 */
export async function getMatchSeries(matchSeriesId: string): Promise<MatchSeries | null> {
  const query = `
    query GetMatchSeries($id: UUID!) {
      matchSeries(matchSeriesId: $id) {
        id
        state
        lineups {
          id
          name
          members {
            gameAccountId
            captain
            user {
              userId
              username
              connectedAccounts {
                provider
                id
              }
            }
          }
        }
      }
    }
  `;

  const result = await graphqlRequest<{ matchSeries: MatchSeries | null }>(query, { id: matchSeriesId });
  return result.matchSeries;
}

/**
 * Find a lineup by name in a tournament
 */
export function findLineupByName(
  tournament: Tournament,
  name: string
): TournamentLineup | null {
  // Check signups first
  const signupLineup = tournament.attendance.signups.lineups.find(
    l => l.name.toLowerCase() === name.toLowerCase()
  );
  if (signupLineup) return signupLineup;

  // Check roster if available
  const rosterLineup = tournament.attendance.roster?.lineups.find(
    l => l.name.toLowerCase() === name.toLowerCase()
  );
  return rosterLineup || null;
}

/**
 * Get all lineups from a tournament (prefer roster if available, fallback to signups)
 */
export function getAllLineups(tournament: Tournament): TournamentLineup[] {
  // If tournament has started and roster exists, use that
  if (tournament.attendance.roster?.lineups.length) {
    return tournament.attendance.roster.lineups;
  }
  // Otherwise use signups
  return tournament.attendance.signups.lineups;
}
