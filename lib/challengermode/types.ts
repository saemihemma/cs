/**
 * Challengermode API Types
 */

export interface ConnectedAccount {
  provider: 'STEAM' | 'TWITCH' | 'DISCORD';
  id: string | null;
}

export interface UserProfile {
  userId: string;
  username: string;
  connectedAccounts: ConnectedAccount[];
}

export interface TournamentLineupMember {
  gameAccountId: string; // Steam3 format: [U:1:XXXXX]
  captain: boolean;
  user: UserProfile;
}

export interface TournamentLineup {
  id: string;
  name: string;
  members: TournamentLineupMember[];
}

export interface TournamentSignup {
  lineupCount: number;
  lineups: TournamentLineup[];
}

export interface TournamentRoster {
  lineups: TournamentLineup[];
}

export interface TournamentAttendance {
  confirmedLineupCount: number;
  signups: TournamentSignup;
  roster: TournamentRoster | null;
}

export interface Tournament {
  id: string;
  name: string;
  state: 'DRAFT' | 'PUBLISHED' | 'RUNNING' | 'ENDED' | 'CANCELED';
  attendance: TournamentAttendance;
}

export interface MatchLineup {
  id: string;
  name: string;
  members: TournamentLineupMember[];
}

export interface MatchSeries {
  id: string;
  state: string;
  lineups: MatchLineup[];
}

/**
 * Convert Steam3 ID format [U:1:XXXXX] to Steam64 ID
 */
export function steam3ToSteam64(steam3Id: string): string | null {
  // Format: [U:1:ACCOUNT_ID]
  const match = steam3Id.match(/\[U:1:(\d+)\]/);
  if (!match) {
    return null;
  }

  const accountId = BigInt(match[1]);
  // Steam64 = 76561197960265728 + accountId
  const steam64Base = BigInt('76561197960265728');
  return (steam64Base + accountId).toString();
}

/**
 * Get Steam64 ID from a lineup member
 * First tries connectedAccounts, then falls back to converting gameAccountId
 */
export function getSteam64FromMember(member: TournamentLineupMember): string | null {
  // First check connectedAccounts for Steam
  const steamAccount = member.user.connectedAccounts?.find(
    acc => acc.provider === 'STEAM' && acc.id
  );
  if (steamAccount?.id) {
    return steamAccount.id;
  }

  // Fall back to converting gameAccountId (Steam3 format)
  return steam3ToSteam64(member.gameAccountId);
}
