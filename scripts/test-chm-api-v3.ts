/**
 * Test Challengermode API with different auth patterns
 */

import 'dotenv/config';

const API_KEY = process.env.CHALLENGERMODE_API_KEY || '2a57c1ea-ba13-47d8-0083-08de580b0bd6';
const TOURNAMENT_ID = '0317a85e-e080-4b44-6f9c-08de30f37986';

async function testAuth(authType: string, headers: Record<string, string>) {
  const url = 'https://ap2.challengermode.com/api/graphql';
  const body = JSON.stringify({
    query: `{ __schema { queryType { name } } }`
  });

  console.log(`\n=== Auth: ${authType} ===`);
  console.log('Headers:', JSON.stringify(headers, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body,
    });

    console.log('Status:', response.status);
    const text = await response.text();
    if (text) {
      console.log('Response:', text.substring(0, 500));
    }
    return response.status;
  } catch (error: any) {
    console.error('Error:', error.message);
    return 0;
  }
}

async function main() {
  console.log('Testing different auth patterns...\n');
  console.log('API Key:', API_KEY);

  // Different auth patterns to try
  const authPatterns = [
    { name: 'Bearer token', headers: { 'Authorization': `Bearer ${API_KEY}` } },
    { name: 'X-API-Key header', headers: { 'X-API-Key': API_KEY } },
    { name: 'Api-Key header', headers: { 'Api-Key': API_KEY } },
    { name: 'apikey header', headers: { 'apikey': API_KEY } },
    { name: 'X-Access-Token', headers: { 'X-Access-Token': API_KEY } },
    { name: 'Authorization Basic', headers: { 'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}` } },
    { name: 'CM-API-Key', headers: { 'CM-API-Key': API_KEY } },
    { name: 'x-cm-api-key', headers: { 'x-cm-api-key': API_KEY } },
    { name: 'CM-Access-Token', headers: { 'CM-Access-Token': API_KEY } },
  ];

  for (const pattern of authPatterns) {
    const status = await testAuth(pattern.name, pattern.headers);
    if (status === 200) {
      console.log('\n*** SUCCESS! ***');
      break;
    }
  }

  // Also try the /api endpoint without /graphql
  console.log('\n\n=== Trying REST endpoints ===');

  const restEndpoints = [
    `https://ap2.challengermode.com/api/v1/tournaments/${TOURNAMENT_ID}`,
    `https://ap2.challengermode.com/public/tournaments/${TOURNAMENT_ID}`,
    `https://ap2.challengermode.com/tournaments/${TOURNAMENT_ID}`,
  ];

  for (const url of restEndpoints) {
    console.log(`\n--- GET ${url} ---`);
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'X-API-Key': API_KEY,
          'Accept': 'application/json',
        },
      });
      console.log('Status:', response.status);
      const text = await response.text();
      console.log('Response:', text.substring(0, 300));
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  }
}

main().catch(console.error);
