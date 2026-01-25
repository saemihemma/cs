/**
 * Test Challengermode API Authentication
 * Run with: npx tsx scripts/test-chm-auth.ts
 */

import 'dotenv/config';

const CHM_API_BASE = 'https://publicapi.challengermode.com/mk1';

// Try different GraphQL endpoint paths
const GRAPHQL_URLS = [
  'https://publicapi.challengermode.com/mk1/v1/graphql',
  'https://publicapi.challengermode.com/graphql',
  'https://api.challengermode.com/graphql',
  'https://ap2.challengermode.com/api/graphql',
];

const REFRESH_KEY = process.env.CHALLENGERMODE_REFRESH_KEY ||
  'NmExNDc5NzkzNzIwNDg0MWE1MDAwOGRlNTlkNWJlNjVJS2tKQm9US2xIVXhqUk5hTk5QWHpLam1pTFZhRkFUYg==';

const TOURNAMENT_ID = '0317a85e-e080-4b44-6f9c-08de30f37986';

async function getAccessToken(): Promise<string> {
  console.log('=== Getting Access Token ===');
  console.log('Refresh Key:', REFRESH_KEY.substring(0, 20) + '...');

  const response = await fetch(`${CHM_API_BASE}/v1/auth/access_keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshKey: REFRESH_KEY }),
  });

  console.log('Status:', response.status);
  const text = await response.text();
  console.log('Response:', text.substring(0, 500));

  if (!response.ok) {
    throw new Error(`Auth failed: ${response.status}`);
  }

  const data = JSON.parse(text);
  console.log('Token expires at:', data.expiresAt);
  return data.value;
}

async function testGraphQLEndpoint(url: string, token: string, query: string, variables?: Record<string, unknown>) {
  console.log(`\n--- Testing: ${url} ---`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  console.log('Status:', response.status);
  const text = await response.text();
  console.log('Response:', text.substring(0, 1000));

  return { status: response.status, text };
}

async function testGraphQL(token: string) {
  console.log('\n=== Testing GraphQL Endpoints ===');

  const introspectionQuery = `{ __schema { queryType { name } } }`;

  // Try each endpoint
  for (const url of GRAPHQL_URLS) {
    const result = await testGraphQLEndpoint(url, token, introspectionQuery);
    if (result.status === 200 && result.text.includes('queryType')) {
      console.log(`\n*** SUCCESS with ${url} ***`);

      // Now test tournament query with the working endpoint
      console.log('\n=== Testing Tournament Query ===');
      const tournamentQuery = `
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

      const tournamentResult = await testGraphQLEndpoint(url, token, tournamentQuery, { id: TOURNAMENT_ID });

      // Parse and show lineup details
      try {
        const data = JSON.parse(tournamentResult.text);
        if (data.data?.tournament?.attendance?.signups?.lineups) {
          console.log('\n=== Registered Lineups ===');
          for (const lineup of data.data.tournament.attendance.signups.lineups) {
            console.log(`\nTeam: ${lineup.name} (${lineup.id})`);
            console.log(`Members (${lineup.members.length}):`);
            for (const member of lineup.members) {
              const steamAccount = member.user.connectedAccounts?.find(
                (acc: { provider: string; id: string }) => acc.provider === 'STEAM'
              );
              console.log(`  - ${member.user.username} ${member.captain ? '(C)' : ''}`);
              console.log(`    Game Account ID: ${member.gameAccountId}`);
              console.log(`    Steam ID: ${steamAccount?.id || 'Not connected'}`);
            }
          }
        }
      } catch (e) {
        console.log('Could not parse lineup details');
      }

      return; // Found working endpoint
    }
  }

  console.log('\nNo working GraphQL endpoint found!');
}

async function main() {
  try {
    const token = await getAccessToken();
    console.log('\nAccess Token obtained:', token.substring(0, 50) + '...');

    await testGraphQL(token);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
