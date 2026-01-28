'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { fadeUpVariants, gridContainerVariants, gridItemVariants } from '@/lib/design/animations';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { clsx } from 'clsx';

interface Lineup {
  id: string;
  name: string;
  members: Array<{ gameAccountId: string; captain: boolean; user: { userId: string; username: string } }>;
}

interface Tournament {
  name: string;
  state: string;
}

interface TournamentContentProps {
  tournament: Tournament;
  lineups: Lineup[];
  id: string;
}

function getStatusBadge(state: string) {
  switch (state) {
    case 'RUNNING':
      return {
        bg: 'bg-neon-green/20 border-neon-green/40',
        text: 'text-neon-green',
        glow: 'shadow-[0_0_10px_rgba(0,255,65,0.3)]',
      };
    case 'ENDED':
      return {
        bg: 'bg-gray-700/50 border-gray-600/40',
        text: 'text-gray-400',
        glow: '',
      };
    default:
      return {
        bg: 'bg-neon-cyan/20 border-neon-cyan/40',
        text: 'text-neon-cyan',
        glow: '',
      };
  }
}

export function TournamentContent({ tournament, lineups, id }: TournamentContentProps) {
  const router = useRouter();
  const status = getStatusBadge(tournament.state);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lineups;
    return lineups.filter((l) => l.name.toLowerCase().includes(q));
  }, [lineups, query]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8"
        >
          <span>←</span> Back to Home
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        className="mb-8"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <GlassCard hover={false} className="rounded-2xl p-6 md:p-8 border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                {tournament.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-green" />
                  {lineups.length} teams
                </span>
                <div
                  className={clsx(
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border',
                    status.bg,
                    status.glow
                  )}
                >
                  <span className={clsx('w-2 h-2 rounded-full bg-current', status.text)} />
                  <span className={clsx('text-xs font-medium uppercase tracking-wider', status.text)}>
                    {tournament.state}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full lg:max-w-sm">
              <Input
                label="Find team"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by team name…"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Team Grid */}
      {filtered.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((lineup) => {
            return (
              <motion.div key={lineup.id} variants={gridItemVariants}>
                <GlassCard
                  onClick={() => router.push(`/intel/${id}/${lineup.id}`)}
                  glow="green"
                  className="group p-5 h-full border border-white/10 transition-colors hover:border-neon-green/40"
                  role="button"
                >
                  <div className="flex items-start gap-4">
                    {/* Team Avatar */}
                    <div className="w-12 h-12 rounded-lg border border-white/10 bg-bg-surface flex items-center justify-center shrink-0 group-hover:border-neon-green/30 transition-colors">
                      <span className="text-lg font-bold text-gray-300 group-hover:text-neon-green transition-colors">
                        {lineup.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Team Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-white truncate group-hover:text-neon-green transition-colors">
                            {lineup.name}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {lineup.members.length} players
                          </p>
                        </div>
                        <span className="text-gray-500 group-hover:text-neon-green transition-colors text-xl leading-none">
                          →
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Open team intel
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          className="glass rounded-2xl p-12 text-center"
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
            <span className="text-2xl text-gray-500">?</span>
          </div>
          <p className="text-gray-500">No teams registered yet</p>
        </motion.div>
      )}

      {/* Footer */}
      <motion.footer
        className="mt-12 pt-6 divider text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-gray-600">
          Click a team to view their <span className="text-neon-green">FACEIT</span> stats
        </p>
      </motion.footer>
    </div>
  );
}
