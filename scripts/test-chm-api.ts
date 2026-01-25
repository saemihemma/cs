/**
 * Test script for Challengermode API
 * Run with: npm run test:chm
 */

import 'dotenv/config';

const API_KEY = process.env.CHALLENGERMODE_API_KEY || '2a57c1ea-ba13-47d8-0083-08de580b0bd6';
const TOURNAMENT_ID = '0317a85e-e080-4b44-6f9c-08de30f37986';
const YOUR_TEAM_ID = 'cbdd5177-205d-e911-b49e-0003fff5adcc';
const USER_ID = '4ab46514-3966-4739-bb96-add4eefd406d'; // Your Challengermode user ID

const endpoints = [
  'https://ap2.challengermode.com/graphql',
  'https://api.challengermode.com/graphql',
];

async function testEndpoint(url: string, query: string, variables?: any) {
  console.log(`\n=== Testing: ${url} ===`);
  console.log('Query:', query.trim().substring(0, 100) + '...');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({ query, variables }),
    });

    console.log('Status:', response.status);
    const text = await response.text();

    try {
      const json = JSON.parse(text);
      console.log('Response:', JSON.stringify(json, null, 2).substring(0, 3000));
      return json;
    } catch {
      console.log('Raw response:', text.substring(0, 500));
      return null;
    }
  } catch (error: any) {
    console.error('Error:', error.message);
    return null;
  }
}

async function main() {
  console.log('Testing Challengermode API');
  console.log('API Key:', API_KEY?.substring(0, 8) + '...');
  console.log('Tournament:', TOURNAMENT_ID);
  console.log('Team:', YOUR_TEAM_ID);
  console.log('User:', USER_ID);

  for (const endpoint of endpoints) {
    // Test 1: Basic introspection
    await testEndpoint(endpoint, `{ __schema { queryType { name } } }`);

    // Test 2: Tournament query (try different ID types)
    await testEndpoint(endpoint, `
      query GetTournament($id: ID!) {
        tournament(id: $id) {
          id
          name
        }
      }
    `, { id: TOURNAMENT_ID });

    // Test 3: Try with String type
    await testEndpoint(endpoint, `
      query GetTournament($id: String!) {
        tournament(id: $id) {
          id
          name
        }
      }
    `, { id: TOURNAMENT_ID });

    // Test 4: User query (to get Steam ID)
    await testEndpoint(endpoint, `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          username
          externalLogins {
            provider
            steamId64
          }
        }
      }
    `, { id: USER_ID });

    // Test 5: Team query
    await testEndpoint(endpoint, `
      query GetTeam($id: ID!) {
        team(id: $id) {
          id
          name
          members {
            id
            username
          }
        }
      }
    `, { id: YOUR_TEAM_ID });
  }
}

main().catch(console.error);
