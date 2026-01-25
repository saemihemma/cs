/**
 * Introspect LobbyInformation and try matchSeries query
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const GRAPHQL_URL = 'https://publicapi.challengermode.com/graphql';

async function getToken(): Promise<string> {
  const refreshKey = process.env.CHALLENGERMODE_REFRESH_KEY;
  if (!refreshKey) throw new Error('CHALLENGERMODE_REFRESH_KEY not set');

  const response = await fetch('https://publicapi.challengermode.com/mk1/v1/auth/access_keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshKey }),
  });

  if (!response.ok) throw new Error(`Auth failed: ${response.status}`);
  const data = await response.json();
  return data.accessKey;
}

async function introspect() {
  const token = await getToken();

  // Check LobbyInformation type
  const lobbyQuery = `
    query IntrospectLobbyInformation {
      __type(name: "LobbyInformation") {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  `;

  let response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: lobbyQuery }),
  });

  let result = await response.json();
  console.log('LobbyInformation fields:');
  console.log(JSON.stringify(result, null, 2));

  // Check MatchStatisticsCollection
  const statsQuery = `
    query IntrospectMatchStatistics {
      __type(name: "MatchStatisticsCollection") {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  `;

  response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: statsQuery }),
  });

  result = await response.json();
  console.log('\nMatchStatisticsCollection:');
  console.log(JSON.stringify(result, null, 2));

  // Check MatchLineupResults
  const lineupResultsQuery = `
    query IntrospectMatchLineupResults {
      __type(name: "MatchLineupResults") {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  `;

  response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: lineupResultsQuery }),
  });

  result = await response.json();
  console.log('\nMatchLineupResults:');
  console.log(JSON.stringify(result, null, 2));

  // Check CompetitionContext
  const contextQuery = `
    query IntrospectCompetitionContext {
      __type(name: "CompetitionContext") {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  `;

  response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: contextQuery }),
  });

  result = await response.json();
  console.log('\nCompetitionContext:');
  console.log(JSON.stringify(result, null, 2));
}

introspect().catch(console.error);
