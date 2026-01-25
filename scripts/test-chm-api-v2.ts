/**
 * Test script for Challengermode API v2 - trying different endpoints
 * Run with: npx tsx scripts/test-chm-api-v2.ts
 */

import 'dotenv/config';

const API_KEY = process.env.CHALLENGERMODE_API_KEY || '2a57c1ea-ba13-47d8-0083-08de580b0bd6';
const TOURNAMENT_ID = '0317a85e-e080-4b44-6f9c-08de30f37986';
const YOUR_TEAM_ID = 'cbdd5177-205d-e911-b49e-0003fff5adcc';
const USER_ID = '4ab46514-3966-4739-bb96-add4eefd406d';
const MATCH_ID = '170f2e44-34e9-49db-39e2-08de50e4e82f'; // Example match

// Try different API patterns
const tests = [
  // REST API patterns
  { url: `https://ap2.challengermode.com/api/tournaments/${TOURNAMENT_ID}`, method: 'GET' },
  { url: `https://ap2.challengermode.com/api/teams/${YOUR_TEAM_ID}`, method: 'GET' },
  { url: `https://ap2.challengermode.com/api/users/${USER_ID}`, method: 'GET' },
  { url: `https://ap2.challengermode.com/api/matches/${MATCH_ID}`, method: 'GET' },

  // Arena boot endpoint
  { url: `https://ap2.challengermode.com/arena/boot`, method: 'POST', body: { tournamentId: TOURNAMENT_ID } },

  // v1 API patterns
  { url: `https://ap2.challengermode.com/v1/tournaments/${TOURNAMENT_ID}`, method: 'GET' },
  { url: `https://api.challengermode.com/v1/tournaments/${TOURNAMENT_ID}`, method: 'GET' },

  // Public API
  { url: `https://www.challengermode.com/api/tournaments/${TOURNAMENT_ID}`, method: 'GET' },

  // Try GraphQL at different paths
  { url: `https://ap2.challengermode.com/api/graphql`, method: 'POST', graphql: true },
  { url: `https://ap2.challengermode.com/v1/graphql`, method: 'POST', graphql: true },
];

async function testAPI(test: any) {
  console.log(`\n=== ${test.method} ${test.url} ===`);

  try {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'X-API-Key': API_KEY,
      'Accept': 'application/json',
    };

    let body: string | undefined;
    if (test.graphql) {
      body = JSON.stringify({
        query: `query { tournament(id: "${TOURNAMENT_ID}") { id name } }`
      });
    } else if (test.body) {
      body = JSON.stringify(test.body);
    }

    const response = await fetch(test.url, {
      method: test.method,
      headers,
      body,
    });

    console.log('Status:', response.status);
    const text = await response.text();

    if (text.startsWith('{') || text.startsWith('[')) {
      const json = JSON.parse(text);
      console.log('JSON Response:', JSON.stringify(json, null, 2).substring(0, 1500));
    } else {
      console.log('Response preview:', text.substring(0, 300));
    }
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

async function main() {
  console.log('Testing Challengermode API - Different Endpoints');
  console.log('API Key:', API_KEY?.substring(0, 8) + '...');

  for (const test of tests) {
    await testAPI(test);
  }
}

main().catch(console.error);
