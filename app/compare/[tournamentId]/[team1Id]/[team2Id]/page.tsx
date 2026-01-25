import Link from 'next/link';
import { generateIntelReport, getTeamMapWinRate, getTeamMapWinRateTopN } from '@/lib/intel/report';
import { CS2_MAPS } from '@/lib/intel/types';
import { CompareContent } from './CompareContent';

interface Props {
  params: Promise<{ tournamentId: string; team1Id: string; team2Id: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function ComparePage({ params, searchParams }: Props) {
  const { tournamentId, team1Id, team2Id } = await params;
  const { mode } = await searchParams;
  const useTop5 = mode === 'top5';

  let report1, report2;
  try {
    [report1, report2] = await Promise.all([
      generateIntelReport(tournamentId, team1Id),
      generateIntelReport(tournamentId, team2Id),
    ]);
  } catch (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-2xl text-red-400">!</span>
          </div>
          <h1 className="text-xl font-bold text-red-400 mb-2">Error Loading Teams</h1>
          <p className="text-gray-500 text-sm mb-6">{String(error)}</p>
          <Link
            href={`/tournament/${tournamentId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span>←</span> Back to Tournament
          </Link>
        </div>
      </div>
    );
  }

  if (!report1 || !report2) {
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
            <span>←</span> Back to Tournament
          </Link>
        </div>
      </div>
    );
  }

  const team1 = report1.opponentTeam;
  const team2 = report2.opponentTeam;

  // Calculate map comparisons
  const mapComparisons = CS2_MAPS.map(mapName => {
    const team1WinRate = useTop5
      ? getTeamMapWinRateTopN(team1, mapName, 5)
      : getTeamMapWinRate(team1, mapName);
    const team2WinRate = useTop5
      ? getTeamMapWinRateTopN(team2, mapName, 5)
      : getTeamMapWinRate(team2, mapName);

    const delta = team1WinRate !== null && team2WinRate !== null
      ? team1WinRate - team2WinRate
      : null;

    return { map: mapName, team1WinRate, team2WinRate, delta };
  });

  // Calculate summary stats
  const validComparisons = mapComparisons.filter(c => c.delta !== null);
  const avgDelta = validComparisons.length > 0
    ? validComparisons.reduce((sum, c) => sum + (c.delta || 0), 0) / validComparisons.length
    : null;

  const team1Advantages = validComparisons.filter(c => (c.delta || 0) > 0).length;
  const team2Advantages = validComparisons.filter(c => (c.delta || 0) < 0).length;

  return (
    <CompareContent
      team1={team1}
      team2={team2}
      mapComparisons={mapComparisons}
      avgDelta={avgDelta}
      team1Advantages={team1Advantages}
      team2Advantages={team2Advantages}
      useTop5={useTop5}
      tournamentId={tournamentId}
      team1Id={team1Id}
      team2Id={team2Id}
    />
  );
}
