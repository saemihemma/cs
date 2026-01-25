'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { containerVariants, fadeUpVariants } from '@/lib/design/animations';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { clsx } from 'clsx';

interface Team {
  lineupId: string;
  teamName: string;
  players: Player[];
}

interface CompareContentProps {
  team1: Team;
  team2: Team;
  team1MapStats: MapStatEntry[];
  team2MapStats: MapStatEntry[];
  useTop5: boolean;
  tournamentId: string;
  team1Id: string;
  team2Id: string;
}

interface Player {
  steamId: string;
  username: string;
  faceitNickname: string | null;
  faceitLevel: number;
  faceitElo: number;
  totalMatches: number;
  kdRatio: number | null;
  mapStats: Array<{ map: string; matches: number; wins: number; winRate: number }>;
}

interface MapStatEntry {
  mapName: string;
  teamAvg: number | null;
  teamGames: number;
  playerStats: Array<{
    player: Player;
    stats: { matches: number; wins: number; winRate: number } | null;
  }>;
}

function displayName(p: Player) {
  return p.faceitNickname || p.username;
}

function getWinRateColor(winRate: number): string {
  if (winRate >= 55) return '#22C55E';
  if (winRate >= 50) return '#84CC16';
  if (winRate >= 45) return '#EAB308';
  return '#EF4444';
}

function getWinRateBgClass(winRate: number): string {
  if (winRate >= 55) return 'bg-green-500/25';
  if (winRate >= 50) return 'bg-lime-500/20';
  if (winRate >= 45) return 'bg-yellow-500/20';
  return 'bg-red-500/20';
}

function deltaTone(delta: number) {
  if (delta > 5) return { text: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' };
  if (delta > 0) return { text: 'text-lime-400', bg: 'bg-lime-500/15 border-lime-500/30' };
  if (delta < -5) return { text: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' };
  if (delta < 0) return { text: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' };
  return { text: 'text-gray-400', bg: 'bg-white/5 border-white/10' };
}

function DeepMapTable({
  team,
  mapStats,
}: {
  team: Team;
  mapStats: MapStatEntry[];
}) {
  const players = team.players;

  return (
    <GlassCard hover={false} className="rounded-2xl overflow-hidden border border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full text-sm data-table">
          <thead>
            <tr className="border-b border-white/10">
              <th
                rowSpan={2}
                className="text-left py-4 px-5 font-semibold text-gray-400 uppercase tracking-wider text-xs sticky left-0 bg-bg-base/90 z-20 min-w-[110px]"
              >
                Map
              </th>
              <th colSpan={2} className="text-center py-4 px-4 font-semibold text-cs2-orange uppercase tracking-wider text-xs">
                Team
              </th>
              <th colSpan={players.length} className="text-center py-4 px-4 font-semibold text-neon-cyan uppercase tracking-wider text-xs border-l border-white/10">
                Players
              </th>
            </tr>
            <tr className="border-b border-white/10">
              <th className="text-center py-3 px-4 font-semibold text-gray-400 uppercase tracking-wider text-xs min-w-[90px]">
                Avg
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-400 uppercase tracking-wider text-xs min-w-[80px]">
                Games
              </th>
              {players.map((p) => (
                <th key={p.steamId} className="text-center py-3 px-3 font-normal min-w-[90px] border-l border-white/5 first:border-l-0">
                  <span className="text-xs text-gray-400 truncate block max-w-[75px] mx-auto" title={displayName(p)}>
                    {displayName(p).slice(0, 10)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mapStats.map((stat, idx) => (
              <tr
                key={stat.mapName}
                className={clsx(
                  'border-b border-white/5',
                  idx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.01]',
                  'hover:bg-white/[0.04] transition-colors'
                )}
              >
                <td className="py-4 px-5 font-semibold text-white sticky left-0 bg-bg-base/70 z-10">
                  {stat.mapName}
                </td>
                <td className={clsx('py-3 px-4 text-center', stat.teamAvg !== null && getWinRateBgClass(stat.teamAvg))}>
                  {stat.teamAvg !== null ? (
                    <div
                      className="font-bold font-mono text-lg"
                      style={{ color: getWinRateColor(stat.teamAvg) }}
                    >
                      {stat.teamAvg.toFixed(0)}%
                    </div>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center font-mono text-gray-300">
                  {stat.teamGames > 0 ? `${stat.teamGames}g` : '—'}
                </td>
                {stat.playerStats.map(({ player, stats }) => (
                  <td key={player.steamId} className="py-3 px-3 text-center border-l border-white/5">
                    {stats && stats.matches > 0 ? (
                      <div className={clsx('py-2 px-1 rounded', getWinRateBgClass(stats.winRate))}>
                        <div
                          className="font-bold font-mono"
                          style={{ color: getWinRateColor(stats.winRate) }}
                        >
                          {stats.winRate.toFixed(0)}%
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{stats.matches}g</div>
                      </div>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

export function CompareContent({
  team1,
  team2,
  team1MapStats,
  team2MapStats,
  useTop5,
  tournamentId,
  team1Id,
  team2Id,
}: CompareContentProps) {
  const deltas = team1MapStats.map((m1) => {
    const m2 = team2MapStats.find((x) => x.mapName === m1.mapName);
    const a = m1.teamAvg;
    const b = m2?.teamAvg ?? null;
    const delta = a !== null && b !== null ? a - b : null;
    return {
      mapName: m1.mapName,
      team1Avg: a,
      team2Avg: b,
      team1Games: m1.teamGames,
      team2Games: m2?.teamGames ?? 0,
      delta,
    };
  });

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

      {/* Header */}
      <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" className="mb-6">
        <GlassCard hover={false} className="rounded-2xl p-6 border border-white/10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cs2-blue/10 via-transparent to-cs2-orange/10 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Compare</div>
              <div className="mt-1 font-display font-bold text-white text-xl md:text-2xl truncate">
                <span className="text-cs2-blue">{team1.teamName}</span>
                <span className="text-gray-600"> vs </span>
                <span className="text-cs2-orange">{team2.teamName}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Team avg first, then players. Delta below is explicit per map.
              </div>
            </div>
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

      {/* Tables */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <SectionHeader title={team1.teamName} subtitle={useTop5 ? 'Top 5 ELO players' : `${team1.players.length} players`} />
          <DeepMapTable team={team1} mapStats={team1MapStats} />
        </div>
        <div className="space-y-3">
          <SectionHeader title={team2.teamName} subtitle={useTop5 ? 'Top 5 ELO players' : `${team2.players.length} players`} />
          <DeepMapTable team={team2} mapStats={team2MapStats} />
        </div>
      </motion.div>

      {/* Delta List */}
      <motion.section variants={fadeUpVariants} initial="hidden" animate="visible" transition={{ delay: 0.15 }} className="mt-10">
        <SectionHeader
          title="Delta (Per Map)"
          subtitle="Δ = Team 1 − Team 2. We also label who is advantaged."
        />

        <div className="space-y-2">
          {deltas.map((d) => {
            const has = d.delta !== null;
            const tone = has ? deltaTone(d.delta as number) : { text: 'text-gray-500', bg: 'bg-white/5 border-white/10' };
            const fav =
              !has
                ? null
                : (d.delta as number) > 0
                ? { name: team1.teamName, color: 'text-cs2-blue' }
                : (d.delta as number) < 0
                ? { name: team2.teamName, color: 'text-cs2-orange' }
                : { name: 'Even', color: 'text-gray-300' };

            return (
              <div key={d.mapName} className="glass rounded-xl p-4 border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-display font-bold text-white">{d.mapName}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      <span className="text-cs2-blue font-mono">
                        {d.team1Avg === null ? '—' : `${Math.round(d.team1Avg)}%`}
                      </span>
                      <span className="text-gray-600"> vs </span>
                      <span className="text-cs2-orange font-mono">
                        {d.team2Avg === null ? '—' : `${Math.round(d.team2Avg)}%`}
                      </span>
                      <span className="text-gray-600"> • </span>
                      <span className="font-mono">{d.team1Games}g</span>
                      <span className="text-gray-600"> / </span>
                      <span className="font-mono">{d.team2Games}g</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={clsx('inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-mono', tone.bg, tone.text)}>
                      {has ? `Δ ${(d.delta as number) > 0 ? '+' : ''}${(d.delta as number).toFixed(0)}%` : 'Δ —'}
                    </span>
                    {fav && (
                      <span className={clsx('text-sm text-gray-400')}>
                        fav:{' '}
                        <span className={clsx('font-semibold', fav.color)}>
                          {fav.name}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

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
        <p>Tables show team averages first, then players. Delta labels the favored team per map.</p>
      </motion.footer>
    </div>
  );
}
