import Link from 'next/link';
import { generateIntelReport, getMapStatsForTeam, getTeamMapWinRate, getTeamMapTotalGames } from '@/lib/intel/report';
import { CS2_MAPS } from '@/lib/intel/types';
import { getTournament, getAllLineups } from '@/lib/challengermode/client';
import { IntelContent } from './IntelContent';

interface Props {
  params: Promise<{ tournamentId: string; lineupId: string }>;
}

export default async function IntelPage({ params }: Props) {
  const { tournamentId, lineupId } = await params;

  let report;
  try {
    report = await generateIntelReport(tournamentId, lineupId);
  } catch (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-2xl text-red-400">!</span>
          </div>
          <h1 className="text-xl font-bold text-red-400 mb-2">Error Loading Intel</h1>
          <p className="text-gray-500 text-sm mb-6">{String(error)}</p>
          <Link
            href={`/tournament/${tournamentId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span>←</span> Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
            <span className="text-2xl text-gray-500">?</span>
          </div>
          <h1 className="text-xl font-bold text-gray-400 mb-4">Team Not Found</h1>
          <Link
            href={`/tournament/${tournamentId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span>←</span> Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const { opponentTeam } = report;

  // Calculate average ELO
  const playersWithElo = opponentTeam.players.filter(p => p.faceitElo > 0);
  const avgElo = playersWithElo.length > 0
    ? Math.round(playersWithElo.reduce((sum, p) => sum + p.faceitElo, 0) / playersWithElo.length)
    : 0;

  // Prepare map stats data with team games
  const mapStats = CS2_MAPS.map(mapName => {
    const teamAvg = getTeamMapWinRate(opponentTeam, mapName);
    const teamGames = getTeamMapTotalGames(opponentTeam, mapName);
    const playerStats = getMapStatsForTeam(opponentTeam, mapName);
    return { mapName, teamAvg, teamGames, playerStats };
  });

  // Get other teams for compare dropdown
  let otherTeams: Array<{ id: string; name: string }> = [];
  try {
    const tournament = await getTournament(tournamentId);
    if (tournament) {
      const allLineups = getAllLineups(tournament);
      otherTeams = allLineups
        .filter(l => l.id !== lineupId)
        .map(l => ({ id: l.id, name: l.name }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  } catch {
    // Silently fail - compare dropdown just won't show teams
  }

  return (
    <IntelContent
      team={opponentTeam}
      avgElo={avgElo}
      mapStats={mapStats}
      tournamentId={tournamentId}
      createdAt={report.createdAt.toISOString()}
      otherTeams={otherTeams}
    />
  );
}
