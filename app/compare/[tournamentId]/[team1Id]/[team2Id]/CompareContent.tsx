'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUpVariants, vsTeam1Variants, vsTeam2Variants, vsTextVariants, containerVariants } from '@/lib/design/animations';
import { DeltaBadge, TugOfWarBar } from '@/components/data/DeltaIndicator';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { clsx } from 'clsx';

interface Team {
  lineupId: string;
  teamName: string;
  players: Array<{ steamId: string }>;
}

interface MapComparison {
  map: string;
  team1WinRate: number | null;
  team2WinRate: number | null;
  delta: number | null;
}

interface CompareContentProps {
  team1: Team;
  team2: Team;
  mapComparisons: MapComparison[];
  avgDelta: number | null;
  team1Advantages: number;
  team2Advantages: number;
  useTop5: boolean;
  tournamentId: string;
  team1Id: string;
  team2Id: string;
}

function getDeltaColor(delta: number): string {
  if (delta > 5) return '#22C55E';
  if (delta > 0) return '#84CC16';
  if (delta < -5) return '#EF4444';
  if (delta < 0) return '#F97316';
  return '#9CA3AF';
}

function deltaBg(delta: number | null) {
  const c = delta === null ? 'rgba(255,255,255,0.08)' : `${getDeltaColor(delta)}33`;
  return `radial-gradient(circle at 30% 20%, ${c} 0%, transparent 65%)`;
}

export function CompareContent({
  team1,
  team2,
  mapComparisons,
  avgDelta,
  team1Advantages,
  team2Advantages,
  useTop5,
  tournamentId,
  team1Id,
  team2Id,
}: CompareContentProps) {
  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href={`/tournament/${tournamentId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8"
        >
          <span>←</span> Back to Tournament
        </Link>
      </motion.div>

      {/* VS Matchup Header */}
      <motion.div
        className="mb-8"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <GlassCard hover={false} className="rounded-2xl p-6 md:p-8 overflow-hidden relative border border-white/10">
          {/* Background glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-cs2-blue/10 via-transparent to-cs2-orange/10 pointer-events-none" />

          <div className="relative grid grid-cols-3 gap-4 items-center">
            {/* Team 1 */}
            <motion.div
              className="text-center"
              variants={vsTeam1Variants}
              initial="hidden"
              animate="visible"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-xl bg-cs2-blue/20 border border-cs2-blue/40 flex items-center justify-center glow-blue">
                <span className="text-2xl md:text-3xl font-bold text-cs2-blue font-display">
                  {team1.teamName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="font-display font-bold text-white text-lg md:text-xl truncate px-2">
                {team1.teamName}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {useTop5 ? 'Top 5 ELO' : `${team1.players.length} players`}
              </p>
            </motion.div>

            {/* VS Center */}
            <motion.div
              className="text-center"
              variants={vsTextVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="font-display text-4xl md:text-5xl font-bold text-gray-600 mb-2">
                VS
              </div>
              {avgDelta !== null && (
                <div className="space-y-1">
                  <div
                    className="text-lg font-bold font-mono"
                    style={{ color: getDeltaColor(avgDelta) }}
                  >
                    {avgDelta > 0 ? '+' : ''}{avgDelta.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">avg delta</div>
                </div>
              )}
              <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                <span className="text-cs2-blue font-bold">{team1Advantages}</span>
                <span className="text-gray-600">-</span>
                <span className="text-cs2-orange font-bold">{team2Advantages}</span>
              </div>
            </motion.div>

            {/* Team 2 */}
            <motion.div
              className="text-center"
              variants={vsTeam2Variants}
              initial="hidden"
              animate="visible"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-xl bg-cs2-orange/20 border border-cs2-orange/40 flex items-center justify-center glow-orange">
                <span className="text-2xl md:text-3xl font-bold text-cs2-orange font-display">
                  {team2.teamName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="font-display font-bold text-white text-lg md:text-xl truncate px-2">
                {team2.teamName}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {useTop5 ? 'Top 5 ELO' : `${team2.players.length} players`}
              </p>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Mode Toggle */}
      <motion.div
        className="flex items-center justify-center gap-2 mb-8"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <Link
          href={`/compare/${tournamentId}/${team1Id}/${team2Id}`}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
            !useTop5
              ? 'bg-cs2-orange/15 text-cs2-orange border-cs2-orange/30'
              : 'bg-bg-surface text-gray-400 border-white/10 hover:text-white'
          )}
        >
          All Players
        </Link>
        <Link
          href={`/compare/${tournamentId}/${team1Id}/${team2Id}?mode=top5`}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
            useTop5
              ? 'bg-cs2-orange/15 text-cs2-orange border-cs2-orange/30'
              : 'bg-bg-surface text-gray-400 border-white/10 hover:text-white'
          )}
        >
          Top 5 ELO
        </Link>
      </motion.div>

      {/* Heatmap Overview */}
      <motion.div
        className="mb-8"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.25 }}
      >
        <SectionHeader
          title="Map Overview"
          subtitle="Quick scan by delta; hover cards below for full tug-of-war detail"
        />
        <GlassCard hover={false} className="rounded-2xl p-4 border border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mapComparisons.map((m) => (
              <div
                key={m.map}
                className="relative rounded-xl border border-white/10 bg-white/5 p-3 overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-50 pointer-events-none"
                  style={{ background: deltaBg(m.delta) }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-display font-bold text-white">{m.map}</div>
                    <DeltaBadge value={m.delta} size="sm" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-mono text-cs2-blue">
                      {m.team1WinRate === null ? '—' : `${Math.round(m.team1WinRate)}%`}
                    </span>
                    <span className="text-gray-600">vs</span>
                    <span className="font-mono text-cs2-orange">
                      {m.team2WinRate === null ? '—' : `${Math.round(m.team2WinRate)}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Map Comparisons */}
      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {mapComparisons.map((comparison, index) => (
          <motion.div
            key={comparison.map}
            className="glass rounded-xl p-4 md:p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{comparison.map}</h3>
              <DeltaBadge value={comparison.delta} size="sm" />
            </div>

            <TugOfWarBar
              team1Value={comparison.team1WinRate}
              team2Value={comparison.team2WinRate}
              team1Label={team1.teamName.slice(0, 10)}
              team2Label={team2.teamName.slice(0, 10)}
              animated={true}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Links */}
      <motion.div
        className="mt-8 grid grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          href={`/intel/${tournamentId}/${team1Id}`}
          className="glass rounded-xl p-4 text-center card-glow-hover transition-all group hover:border-cs2-blue/30"
        >
          <div className="text-xs text-gray-500 mb-1">View Intel</div>
          <div className="font-semibold text-white group-hover:text-cs2-blue truncate">
            {team1.teamName}
          </div>
        </Link>
        <Link
          href={`/intel/${tournamentId}/${team2Id}`}
          className="glass rounded-xl p-4 text-center card-glow-hover transition-all"
        >
          <div className="text-xs text-gray-500 mb-1">View Intel</div>
          <div className="font-semibold text-white group-hover:text-cs2-orange truncate">
            {team2.teamName}
          </div>
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="mt-10 pt-6 text-center text-xs text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p>Delta = Team 1 - Team 2. <span className="text-green-500">Positive</span> = Team 1 advantage.</p>
      </motion.footer>
    </div>
  );
}
