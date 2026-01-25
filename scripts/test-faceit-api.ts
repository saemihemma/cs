/**
 * Test script for FACEIT API
 * Run with: npm run test:faceit
 */

import 'dotenv/config';

const FACEIT_API_KEY = process.env.FACEIT_API_KEY || 'cf47fc28-13a9-48e3-b525-31f1ef667425';
const TEST_STEAM_ID = '76561197968468413'; // Your Steam ID
const TEST_NICKNAME = 's1mple'; // Famous player for testing

async function faceitFetch(endpoint: string) {
  const url = `https://open.faceit.com/data/v4${endpoint}`;
  console.log(`\n=== Fetching: ${url} ===`);

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${FACEIT_API_KEY}`,
      'Accept': 'application/json',
    },
  });

  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2).substring(0, 2000));
  return data;
}

async function main() {
  console.log('Testing FACEIT API');
  console.log('API Key:', FACEIT_API_KEY?.substring(0, 8) + '...');

  // Test 1: Search by nickname
  console.log('\n--- Test 1: Search player by nickname ---');
  await faceitFetch(`/players?nickname=${TEST_NICKNAME}`);

  // Test 2: Search by Steam ID (YOUR Steam ID)
  console.log('\n--- Test 2: Search by Steam ID ---');
  await faceitFetch(`/players?game=cs2&game_player_id=${TEST_STEAM_ID}`);

  // Test 3: Get CS2 stats for s1mple
  console.log('\n--- Test 3: Get CS2 stats for s1mple ---');
  const player = await faceitFetch(`/players?nickname=${TEST_NICKNAME}`);
  if (player?.player_id) {
    await faceitFetch(`/players/${player.player_id}/stats/cs2`);
  }
}

main().catch(console.error);
