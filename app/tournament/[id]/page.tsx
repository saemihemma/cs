import Link from 'next/link';
import { getTournament, getAllLineups } from '@/lib/challengermode/client';
import { TournamentContent } from './TournamentContent';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TournamentPage({ params }: Props) {
  const { id } = await params;
  const tournament = await getTournament(id);

  if (!tournament) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-2xl text-red-400">!</span>
          </div>
          <h1 className="text-xl font-bold text-red-400 mb-2">Tournament Not Found</h1>
          <p className="text-gray-500 text-sm mb-6 font-mono">{id}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span>←</span> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const lineups = getAllLineups(tournament);

  return <TournamentContent tournament={tournament} lineups={lineups} id={id} />;
}
