'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { fadeUpVariants, gridContainerVariants, gridItemVariants } from '@/lib/design/animations';
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
      };
    case 'ENDED':
      return {
        bg: 'bg-gray-700/50 border-gray-600/40',
        text: 'text-gray-400',
      };
    default:
      return {
        bg: 'bg-neon-cyan/20 border-neon-cyan/40',
        text: 'text-neon-cyan',
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
    <div className="max-w-7xl mx-auto px-4">
      {/* Navigation - Terminal Style */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] font-mono text-gray-500 hover:text-neon-green transition-colors"
        >
          ← _RETURN_HOME
        </Link>
      </motion.div>

      {/* Header - Compact HUD */}
      <motion.div
        className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-4">
          <h1 className="font-mono text-lg md:text-xl font-bold text-white">
            {tournament.name}
          </h1>
          <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              {lineups.length}_UNITS
            </span>
            <div
              className={clsx(
                'inline-flex items-center px-2 py-0.5 rounded border',
                status.bg,
                status.text
              )}
            >
              {tournament.state}
            </div>
          </div>
        </div>

        <div className="w-full md:max-w-[200px]">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH_TARGET..."
            className="font-mono text-[11px]"
          />
        </div>
      </motion.div>

      {/* Team Grid - High Density 4-Column */}
      {filtered.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((lineup) => {
            return (
              <motion.div key={lineup.id} variants={gridItemVariants}>
                <div
                  onClick={() => router.push(`/intel/${id}/${lineup.id}`)}
                  role="button"
                  className={clsx(
                    'group glass rounded p-2 cursor-pointer',
                    'border-2 border-transparent',
                    'hover:border-neon-green/60 hover:bg-neon-green/10',
                    'transition-all duration-200'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {/* Compact Avatar */}
                    <div className="w-7 h-7 rounded bg-bg-surface border border-white/10 flex items-center justify-center shrink-0 group-hover:border-neon-green/40 transition-colors">
                      <span className="text-xs font-bold text-gray-500 group-hover:text-neon-green transition-colors">
                        {lineup.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Team Info - Compact with Slide-in */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="font-mono text-xs text-white truncate group-hover:text-neon-green group-hover:translate-x-1 transition-all duration-200">
                        {lineup.name}
                      </h3>
                      <p className="text-[10px] font-mono text-gray-600">
                        {lineup.members.length}_UNITS
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          className="glass rounded-lg p-8 text-center"
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="font-mono text-gray-500 text-sm">NO_TARGETS_DETECTED</div>
        </motion.div>
      )}
    </div>
  );
}
