/**
 * Introspect GameSession and check actual match data
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

  // Check GameSession type
  const sessionQuery = `
    query IntrospectGameSession {
      __type(name: "GameSession") {
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
    body: JSON.stringify({ query: sessionQuery }),
  });

  let result = await response.json();
  console.log('GameSession fields:');
  console.log(JSON.stringify(result, null, 2));

  // Try to query a real match series to see actual data structure
  // Using a match series ID if we have one
  const realQuery = `
    query GetTournamentStages($id: UUID!) {
      tournament(tournamentId: $id) {
        id
        name
        stages {
          index
          format
          lineupCount
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
    body: JSON.stringify({
      query: realQuery,
      variables: { id: '0317a85e-e080-4b44-6f9c-08de30f37986' }
    }),
  });

  result = await response.json();
  console.log('\nTournament stages:');
  console.log(JSON.stringify(result, null, 2));

  // Check MatchSeriesLineupResults type
  const lineupResultsQuery = `
    query IntrospectLineupResults {
      __type(name: "MatchSeriesLineupResults") {
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
  console.log('\nMatchSeriesLineupResults:');
  console.log(JSON.stringify(result, null, 2));

  // Check TournamentLineup type for match history
  const lineupQuery = `
    query IntrospectTournamentLineup {
      __type(name: "TournamentLineup") {
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
    body: JSON.stringify({ query: lineupQuery }),
  });

  result = await response.json();
  console.log('\nTournamentLineup type:');
  console.log(JSON.stringify(result, null, 2));
}

introspect().catch(console.error);
