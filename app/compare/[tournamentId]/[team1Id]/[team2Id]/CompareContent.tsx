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

// Neon color scheme: >60% green, 40-60% cyan, <40% red
function getWinRateColor(winRate: number): string {
  if (winRate >= 60) return '#00ff41'; // neon-green
  if (winRate >= 40) return '#00f3ff'; // neon-cyan
  return '#ff003c'; // neon-red
}

function getWinRateBarClass(winRate: number): string {
  if (winRate >= 60) return 'win-rate-bar-green';
  if (winRate >= 40) return 'win-rate-bar-cyan';
  return 'win-rate-bar-red';
}

function WinRateCell({ winRate, games }: { winRate: number; games: number }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="font-bold font-mono text-lg"
        style={{ color: getWinRateColor(winRate) }}
      >
        {winRate.toFixed(0)}%
      </div>
      {games > 0 && (
        <div className="text-[10px] text-gray-500 mt-0.5">{games}g</div>
      )}
      <div
        className={clsx('win-rate-bar', getWinRateBarClass(winRate))}
        style={{ width: `${Math.min(winRate, 100)}%` }}
      />
    </div>
  );
}

// Tug-of-war bar component
function TugOfWarBar({ 
  team1Avg, 
  team2Avg, 
  team1Name, 
  team2Name,
  delta 
}: { 
  team1Avg: number | null; 
  team2Avg: number | null;
  team1Name: string;
  team2Name: string;
  delta: number | null;
}) {
  if (delta === null || team1Avg === null || team2Avg === null) {
    return <div className="h-3 bg-bg-surface rounded-full opacity-30" />;
  }

  // Bar extends from center. Max delta clamped to ±30% for visual scaling
  const clampedDelta = Math.max(-30, Math.min(30, delta));
  const barWidth = Math.abs(clampedDelta) * 1.5; // Scale for visual effect
  const isTeam1Favored = delta > 0;
  const isEven = delta === 0;

  return (
    <div className="relative h-3 w-full">
      {/* Background track */}
      <div className="absolute inset-0 bg-bg-surface rounded-full" />
      
      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 transform -translate-x-1/2 z-10" />
      
      {/* Fill bar - extends left (team1) or right (team2) from center */}
      {!isEven && (
        <div
          className={clsx(
            'absolute top-0 h-full rounded-full transition-all duration-500',
            isTeam1Favored 
              ? 'right-1/2 bg-neon-cyan' 
              : 'left-1/2 bg-neon-red'
          )}
          style={{ 
            width: `${barWidth}%`,
            boxShadow: isTeam1Favored 
              ? '0 0 12px rgba(0, 243, 255, 0.4)' 
              : '0 0 12px rgba(255, 0, 60, 0.4)'
          }}
        />
      )}
    </div>
  );
}

function FavoredBadge({ 
  teamName, 
  delta, 
  isTeam1 
}: { 
  teamName: string; 
  delta: number; 
  isTeam1: boolean 
}) {
  const absDelta = Math.abs(delta);
  
  return (
    <div className={clsx(
      'badge-favored',
      isTeam1 ? 'badge-favored-team1' : 'badge-favored-team2'
    )}>
      <span className="font-display font-bold">{teamName}</span>
      <span className="opacity-75">+{absDelta.toFixed(0)}%</span>
    </div>
  );
}

function DeepMapTable({
  team,
  mapStats,
  teamColor = 'neon-green',
}: {
  team: Team;
  mapStats: MapStatEntry[];
  teamColor?: 'neon-green' | 'neon-cyan' | 'neon-red';
}) {
  const players = team.players;
  const teamColorClass = `text-${teamColor}`;

  return (
    <GlassCard hover={false} className="rounded-2xl overflow-hidden border border-white/10">
      <div className="overflow-x-auto scroll-hint-right">
        <table className="w-full text-sm data-table">
          <thead>
            <tr className="border-b border-white/10">
              <th
                rowSpan={2}
                className="text-left py-4 px-5 font-display font-bold text-gray-400 uppercase tracking-wider text-xs sticky left-0 bg-bg-base/95 z-20 min-w-[110px]"
              >
                Map
              </th>
              <th colSpan={2} className={clsx('text-center py-4 px-4 font-display font-bold uppercase tracking-wider text-xs', teamColorClass)}>
                Team
              </th>
              <th colSpan={players.length} className="text-center py-4 px-4 font-display font-bold text-neon-cyan uppercase tracking-wider text-xs border-l border-white/10">
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
                  'border-b border-white/5 row-hover-glow',
                  idx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'
                )}
              >
                <td className="py-4 px-5 font-display font-bold text-white sticky left-0 bg-bg-base/90 z-10">
                  {stat.mapName}
                </td>
                <td className="py-3 px-4 text-center">
                  {stat.teamAvg !== null ? (
                    <WinRateCell winRate={stat.teamAvg} games={0} />
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
                      <WinRateCell winRate={stats.winRate} games={stats.matches} />
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
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-red/10 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-gray-500 uppercase tracking-widest font-display">Compare</div>
              <div className="mt-1 font-display font-bold text-white text-xl md:text-2xl truncate">
                <span className="text-neon-cyan">{team1.teamName}</span>
                <span className="text-gray-600"> vs </span>
                <span className="text-neon-red">{team2.teamName}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Tug-of-war visual below shows map advantage at a glance.
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
              ? 'bg-neon-green/15 text-neon-green border-neon-green/30'
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
              ? 'bg-neon-green/15 text-neon-green border-neon-green/30'
              : 'bg-bg-surface text-gray-400 border-white/10 hover:text-white'
          )}
        >
          Top 5 ELO
        </Link>
      </motion.div>

      {/* Tables */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <SectionHeader 
            title={<span className="text-neon-cyan">{team1.teamName}</span>} 
            subtitle={useTop5 ? 'Top 5 ELO players' : `${team1.players.length} players`} 
          />
          <DeepMapTable team={team1} mapStats={team1MapStats} teamColor="neon-cyan" />
        </div>
        <div className="space-y-3">
          <SectionHeader 
            title={<span className="text-neon-red">{team2.teamName}</span>} 
            subtitle={useTop5 ? 'Top 5 ELO players' : `${team2.players.length} players`} 
          />
          <DeepMapTable team={team2} mapStats={team2MapStats} teamColor="neon-red" />
        </div>
      </motion.div>

      {/* Tug-of-War Delta Section */}
      <motion.section variants={fadeUpVariants} initial="hidden" animate="visible" transition={{ delay: 0.15 }} className="mt-10">
        <SectionHeader
          title="Map Advantage Forecast"
          subtitle="Bar extends toward the favored team. Cyan = Team 1, Red = Team 2."
        />

        <div className="space-y-3">
          {deltas.map((d) => {
            const has = d.delta !== null;
            const isTeam1Favored = has && (d.delta as number) > 0;
            const isTeam2Favored = has && (d.delta as number) < 0;
            const isEven = has && d.delta === 0;
            const favoredTeam = isTeam1Favored ? team1.teamName : isTeam2Favored ? team2.teamName : null;

            return (
              <div key={d.mapName} className="glass rounded-xl p-5 border border-white/10">
                {/* Map name and stats row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <div className="font-display font-bold text-white text-lg">{d.mapName}</div>
                    <div className="mt-1 flex items-center gap-3 text-sm">
                      <span className="text-neon-cyan font-mono">
                        {d.team1Avg === null ? '—' : `${Math.round(d.team1Avg)}%`}
                        <span className="text-gray-600 text-xs ml-1">({d.team1Games}g)</span>
                      </span>
                      <span className="text-gray-600">vs</span>
                      <span className="text-neon-red font-mono">
                        {d.team2Avg === null ? '—' : `${Math.round(d.team2Avg)}%`}
                        <span className="text-gray-600 text-xs ml-1">({d.team2Games}g)</span>
                      </span>
                    </div>
                  </div>

                  {/* Favored badge */}
                  <div className="flex items-center gap-2">
                    {favoredTeam && d.delta !== null && (
                      <FavoredBadge 
                        teamName={favoredTeam} 
                        delta={d.delta} 
                        isTeam1={isTeam1Favored} 
                      />
                    )}
                    {isEven && (
                      <span className="text-sm text-gray-400 font-display uppercase tracking-wider">Even</span>
                    )}
                    {!has && (
                      <span className="text-sm text-gray-500">No data</span>
                    )}
                  </div>
                </div>

                {/* Tug-of-war bar */}
                <TugOfWarBar
                  team1Avg={d.team1Avg}
                  team2Avg={d.team2Avg}
                  team1Name={team1.teamName}
                  team2Name={team2.teamName}
                  delta={d.delta}
                />

                {/* Team labels under bar */}
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span className="text-neon-cyan">{team1.teamName}</span>
                  <span className="text-neon-red">{team2.teamName}</span>
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
          className="glass rounded-xl p-4 text-center card-glow-hover transition-all group hover:border-neon-cyan/30"
        >
          <div className="text-xs text-gray-500 mb-1">View Intel</div>
          <div className="font-semibold text-white group-hover:text-neon-cyan truncate">
            {team1.teamName}
          </div>
        </Link>
        <Link
          href={`/intel/${tournamentId}/${team2Id}`}
          className="glass rounded-xl p-4 text-center card-glow-hover transition-all group hover:border-neon-red/30"
        >
          <div className="text-xs text-gray-500 mb-1">View Intel</div>
          <div className="font-semibold text-white group-hover:text-neon-red truncate">
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
