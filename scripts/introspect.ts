/**
 * Introspect Challengermode GraphQL schema to discover available fields
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

  // Check TournamentStage type
  const stageQuery = `
    query IntrospectStage {
      __type(name: "TournamentStage") {
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

  const stageResponse = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: stageQuery }),
  });

  const stageResult = await stageResponse.json();
  console.log('TournamentStage fields:');
  console.log(JSON.stringify(stageResult, null, 2));

  // Check Match type
  const matchQuery = `
    query IntrospectMatch {
      __type(name: "Match") {
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

  const matchResponse = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: matchQuery }),
  });

  const matchResult = await matchResponse.json();
  console.log('\nMatch fields:');
  console.log(JSON.stringify(matchResult, null, 2));

  // Check MatchResults interface
  const resultsQuery = `
    query IntrospectMatchResults {
      __type(name: "MatchResults") {
        name
        kind
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
        possibleTypes {
          name
        }
      }
    }
  `;

  const resultsResponse = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: resultsQuery }),
  });

  const resultsResult = await resultsResponse.json();
  console.log('\nMatchResults interface:');
  console.log(JSON.stringify(resultsResult, null, 2));

  // First, let's see what fields Tournament has
  const tournamentTypeQuery = `
    query IntrospectTournament {
      __type(name: "Tournament") {
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

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: tournamentTypeQuery }),
  });

  const result = await response.json();
  console.log('Tournament fields:');
  console.log(JSON.stringify(result, null, 2));

  // Also check MatchSeries type
  const matchSeriesQuery = `
    query IntrospectMatchSeries {
      __type(name: "MatchSeries") {
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

  const msResponse = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: matchSeriesQuery }),
  });

  const msResult = await msResponse.json();
  console.log('\nMatchSeries fields:');
  console.log(JSON.stringify(msResult, null, 2));

  // Check Query root for available queries
  const queryRootQuery = `
    query IntrospectQuery {
      __type(name: "Query") {
        name
        fields {
          name
          type {
            name
            kind
          }
          args {
            name
            type {
              name
              kind
            }
          }
        }
      }
    }
  `;

  const qResponse = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: queryRootQuery }),
  });

  const qResult = await qResponse.json();
  console.log('\nQuery root fields:');
  console.log(JSON.stringify(qResult, null, 2));
}

introspect().catch(console.error);
