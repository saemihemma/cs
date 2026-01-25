/**
 * Test full flow: Challengermode lineup -> Steam IDs -> FACEIT stats
 * Run with: npx tsx scripts/test-full-flow.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { getTournament, getAllLineups } from '../lib/challengermode/client';
import { getSteam64FromMember } from '../lib/challengermode/types';
import { resolveAndGetStats } from '../lib/faceit/client';

const TOURNAMENT_ID = process.env.YOUR_TOURNAMENT_ID || '0317a85e-e080-4b44-6f9c-08de30f37986';

async function main() {
  console.log('=== Full Flow Test ===\n');

  // Step 1: Get tournament data
  console.log('Step 1: Fetching tournament from Challengermode...');
  const tournament = await getTournament(TOURNAMENT_ID);
  if (!tournament) {
    console.error('Tournament not found!');
    return;
  }

  console.log(`Tournament: ${tournament.name}`);
  console.log(`State: ${tournament.state}`);

  // Step 2: Get all lineups
  const lineups = getAllLineups(tournament);
  console.log(`Total lineups: ${lineups.length}\n`);

  // Step 3: Pick a few lineups to test (first 2)
  const testLineups = lineups.slice(0, 2);

  for (const lineup of testLineups) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Team: ${lineup.name}`);
    console.log(`Members: ${lineup.members.length}`);
    console.log(`${'='.repeat(60)}`);

    // Step 4: Get Steam IDs for all members
    for (const member of lineup.members.slice(0, 3)) { // Test first 3 members
      const steam64 = getSteam64FromMember(member);
      console.log(`\n--- ${member.user.username} ${member.captain ? '(C)' : ''} ---`);
      console.log(`  Game Account: ${member.gameAccountId}`);
      console.log(`  Steam64: ${steam64 || 'Failed to convert'}`);

      if (steam64) {
        // Step 5: Get FACEIT stats
        console.log('  Fetching FACEIT stats...');
        const stats = await resolveAndGetStats(steam64);

        if (stats) {
          console.log(`  FACEIT: ${stats.nickname} | Level ${stats.skillLevel} | ELO ${stats.elo}`);
          console.log(`  Summary: ${stats.totalMatches} matches | K/D ${stats.kdRatio ?? '—'}`);

          // Show top 5 maps
          console.log('  Map Stats:');
          for (const mapStat of stats.mapStats.slice(0, 5)) {
            console.log(`    ${mapStat.map.padEnd(12)} | ${mapStat.matches.toString().padStart(3)} matches | ${mapStat.winRate.toFixed(0)}% WR`);
          }
        } else {
          console.log('  No FACEIT account found');
        }
      }
    }
  }

  console.log('\n\n=== Test Complete ===');
}

main().catch(console.error);
