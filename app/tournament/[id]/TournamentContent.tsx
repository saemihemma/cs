'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { containerVariants, fadeUpVariants, gridContainerVariants, gridItemVariants } from '@/lib/design/animations';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
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
        bg: 'bg-green-500/20 border-green-500/40',
        text: 'text-green-400',
        glow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]',
      };
    case 'ENDED':
      return {
        bg: 'bg-gray-700/50 border-gray-600/40',
        text: 'text-gray-400',
        glow: '',
      };
    default:
      return {
        bg: 'bg-yellow-500/20 border-yellow-500/40',
        text: 'text-yellow-400',
        glow: '',
      };
  }
}

export function TournamentContent({ tournament, lineups, id }: TournamentContentProps) {
  const router = useRouter();
  const status = getStatusBadge(tournament.state);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lineups;
    return lineups.filter((l) => l.name.toLowerCase().includes(q));
  }, [lineups, query]);

  const selectedTeams = useMemo(() => {
    const map = new Map(lineups.map((l) => [l.id, l] as const));
    return selected.map((sid) => map.get(sid)).filter(Boolean) as Lineup[];
  }, [lineups, selected]);

  function toggleSelected(lineupId: string) {
    setSelected((prev) => {
      if (prev.includes(lineupId)) return prev.filter((x) => x !== lineupId);
      if (prev.length < 2) return [...prev, lineupId];
      // Keep the two most recent selections.
      return [prev[1], lineupId];
    });
  }

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
                  <span className="w-2 h-2 rounded-full bg-cs2-orange" />
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
            const isSelected = selected.includes(lineup.id);
            return (
            <motion.div key={lineup.id} variants={gridItemVariants}>
              <GlassCard
                onClick={() => toggleSelected(lineup.id)}
                glow="orange"
                className={clsx(
                  'p-5 h-full border border-white/10 transition-colors',
                  isSelected && 'border-cs2-orange/60'
                )}
                role="button"
                aria-pressed={isSelected}
              >
                <div className="flex items-start gap-4">
                  {/* Team Avatar */}
                  <div
                    className={clsx(
                      'w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-200',
                      isSelected
                        ? 'bg-cs2-orange/20 border-cs2-orange/50'
                        : 'bg-bg-surface border-white/10'
                    )}
                  >
                    <span
                      className={clsx(
                        'text-lg font-bold transition-colors',
                        isSelected ? 'text-cs2-orange' : 'text-gray-300'
                      )}
                    >
                      {lineup.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Team Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-white truncate">
                        {lineup.name}
                      </h3>
                      <span
                        className={clsx(
                          'text-xs font-mono px-2 py-1 rounded-full border',
                          isSelected
                            ? 'border-cs2-orange/40 text-cs2-orange bg-cs2-orange/10'
                            : 'border-white/10 text-gray-500 bg-white/5'
                        )}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {lineup.members.length} players
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <Link
                        href={`/intel/${id}/${lineup.id}`}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View intel →
                      </Link>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );})}
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
          Click a team to view their <span className="text-cs2-orange">FACEIT</span> stats
        </p>
      </motion.footer>

      {/* Compare Bar */}
      {selectedTeams.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="glass-strong border border-white/10 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-gray-400">Compare:</span>
                  {selectedTeams.map((t) => (
                    <span
                      key={t.id}
                      className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-gray-200"
                    >
                      {t.name}
                    </span>
                  ))}
                  {selectedTeams.length < 2 && (
                    <span className="text-xs text-gray-600">Select 1 more team</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelected([])}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    disabled={selectedTeams.length !== 2}
                    onClick={() => {
                      if (selectedTeams.length === 2) {
                        router.push(`/compare/${id}/${selectedTeams[0].id}/${selectedTeams[1].id}`);
                      }
                    }}
                  >
                    Compare now →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
