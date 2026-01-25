/**
 * Challengermode API Authentication
 * Uses refresh key to obtain short-lived access tokens
 */

const CHM_API_BASE = 'https://publicapi.challengermode.com/mk1';

interface AccessKeyResponse {
  value: string;
  expiresAt: string;
}

interface TokenCache {
  token: string;
  expiresAt: Date;
}

let tokenCache: TokenCache | null = null;

/**
 * Get the refresh key from environment
 */
function getRefreshKey(): string {
  const key = process.env.CHALLENGERMODE_REFRESH_KEY;
  if (!key) {
    throw new Error('CHALLENGERMODE_REFRESH_KEY not set');
  }
  return key;
}

/**
 * Exchange refresh key for an access token
 */
async function fetchAccessToken(): Promise<AccessKeyResponse> {
  const refreshKey = getRefreshKey();

  const response = await fetch(`${CHM_API_BASE}/v1/auth/access_keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshKey }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get access token: ${response.status} ${text}`);
  }

  return response.json();
}

/**
 * Get a valid access token, refreshing if needed
 */
export async function getAccessToken(): Promise<string> {
  // Check if we have a cached token that's still valid (with 1 min buffer)
  if (tokenCache) {
    const now = new Date();
    const bufferMs = 60 * 1000; // 1 minute buffer
    if (tokenCache.expiresAt.getTime() - bufferMs > now.getTime()) {
      return tokenCache.token;
    }
  }

  // Fetch new token
  const result = await fetchAccessToken();

  tokenCache = {
    token: result.value,
    expiresAt: new Date(result.expiresAt),
  };

  return tokenCache.token;
}

/**
 * Clear the token cache (for testing)
 */
export function clearTokenCache(): void {
  tokenCache = null;
}

/**
 * Get authorization headers for API requests
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}
