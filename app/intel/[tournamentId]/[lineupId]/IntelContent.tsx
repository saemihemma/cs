'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { fadeUpVariants } from '@/lib/design/animations';
import { FaceitLevelBadge } from '@/components/data/FaceitLevel';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatPill } from '@/components/ui/StatPill';
import { Select } from '@/components/ui/Select';
import { clsx } from 'clsx';

interface Player {
  steamId: string;
  username: string;
  faceitId?: string;
  faceitNickname: string | null;
  faceitLevel: number;
  faceitElo: number;
  totalMatches: number;
  kdRatio: number | null;
  mapStats: Array<{ map: string; matches: number; wins: number; winRate: number }>;
}

interface Team {
  lineupId: string;
  teamName: string;
  players: Player[];
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

interface OtherTeam {
  id: string;
  name: string;
}

interface IntelContentProps {
  team: Team;
  avgElo: number;
  mapStats: MapStatEntry[];
  tournamentId: string;
  createdAt: string;
  otherTeams?: OtherTeam[];
}

// Neon color scheme: >60% green, 40-60% cyan, <40% red
function getWinRateColor(winRate: number): string {
  if (winRate >= 60) return '#00ff41'; // neon-green
  if (winRate >= 40) return '#00f3ff'; // neon-cyan
  return '#ff003c'; // neon-red
}

function getWinRateTextClass(winRate: number): string {
  if (winRate >= 60) return 'text-neon-green';
  if (winRate >= 40) return 'text-neon-cyan';
  return 'text-neon-red';
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

export function IntelContent({ team, avgElo, mapStats, tournamentId, createdAt, otherTeams = [] }: IntelContentProps) {
  const router = useRouter();
  const players = team.players;

  return (
    <div className="max-w-[1600px] mx-auto px-4">
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
          <span>←</span> Back to Teams
        </Link>
      </motion.div>

      {/* Team Header */}
      <motion.div
        className="mb-8"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <GlassCard hover={false} className="rounded-2xl p-6 md:p-8 border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Team Avatar */}
            <div
              className="w-20 h-20 rounded-xl bg-bg-surface border border-neon-green/40 flex items-center justify-center shrink-0 glow-green-sm"
            >
              <span className="text-3xl font-bold text-neon-green font-display">
                {team.teamName.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Team Info */}
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 truncate">
                {team.teamName}
              </h1>
              <div className="flex flex-wrap gap-2">
                <StatPill label="Players" value={team.players.length} tone="green" />
                <StatPill
                  label="Avg ELO"
                  value={avgElo > 0 ? avgElo.toLocaleString() : '—'}
                  tone="green"
                />
                <StatPill
                  label="Generated"
                  value={new Date(createdAt).toLocaleString()}
                />
              </div>
            </div>

            {/* Compare Dropdown */}
            {otherTeams.length > 0 && (
              <div className="w-full lg:w-80">
                <Select
                  label="Compare with"
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      router.push(`/compare/${tournamentId}/${team.lineupId}/${e.target.value}`);
                    }
                  }}
                >
                  <option value="" disabled>Select team…</option>
                  {otherTeams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Player Overview */}
      <motion.section
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <SectionHeader
          title="Players"
          subtitle="Quick scan: level, ELO, matches, K/D"
          right={<span className="text-xs text-gray-500">Sorted by ELO</span>}
        />

        <GlassCard hover={false} className="rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-sm data-table">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-5 font-semibold text-gray-400 uppercase tracking-wider text-xs sticky left-0 bg-bg-base/90 z-20 min-w-[170px]">
                    Player
                  </th>
                  <th className="text-center py-4 px-3 font-semibold text-gray-400 uppercase tracking-wider text-xs min-w-[70px]">
                    Lvl
                  </th>
                  <th className="text-right py-4 px-3 font-semibold text-gray-400 uppercase tracking-wider text-xs min-w-[90px]">
                    ELO
                  </th>
                  <th className="text-right py-4 px-3 font-semibold text-gray-400 uppercase tracking-wider text-xs min-w-[90px]">
                    Matches
                  </th>
                  <th className="text-right py-4 px-5 font-semibold text-gray-400 uppercase tracking-wider text-xs min-w-[80px]">
                    K/D
                  </th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, idx) => (
                  <tr
                    key={p.steamId}
                    className={clsx(
                      'border-b border-white/5 row-scan-hover',
                      idx % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'
                    )}
                  >
                    <td className="py-3.5 px-5 sticky left-0 bg-bg-base/90 z-10">
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">
                          {p.faceitNickname || p.username}
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono truncate">
                          {p.username}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <FaceitLevelBadge level={p.faceitLevel} />
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-neon-cyan">
                      {p.faceitElo > 0 ? p.faceitElo.toLocaleString() : '—'}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-gray-300">
                      {p.totalMatches > 0 ? p.totalMatches.toLocaleString() : '—'}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono text-neon-green">
                      {p.kdRatio !== null ? p.kdRatio.toFixed(2) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.section>

      {/* Map Statistics */}
      <motion.section
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.15 }}
      >
        <SectionHeader
          title="Maps (Deep Dive)"
          subtitle="Team average first, then per-player map win rates"
          right={<span className="text-xs text-gray-500">Tip: scroll sideways on mobile</span>}
        />

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
                  <th
                    colSpan={2}
                    className="text-center py-4 px-4 font-semibold text-neon-green uppercase tracking-wider text-xs"
                  >
                    Team
                  </th>
                  <th
                    colSpan={players.length}
                    className="text-center py-4 px-4 font-semibold text-neon-cyan uppercase tracking-wider text-xs border-l border-white/10"
                  >
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
                  {players.map((player) => (
                    <th key={player.steamId} className="text-center py-3 px-4 font-mono w-[140px] min-w-[140px] border-l border-white/5 first:border-l-0">
                      <span className="text-[10px] text-gray-400 truncate block max-w-[120px] mx-auto" title={player.faceitNickname || player.username}>
                        {(player.faceitNickname || player.username).slice(0, 14)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mapStats.map((stat, mapIndex) => (
                  <tr
                    key={stat.mapName}
                    className={clsx(
                      'border-b border-white/5 row-scan-hover',
                      mapIndex % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'
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
                      <td key={player.steamId} className="py-3 px-4 text-center border-l border-white/5 w-[140px] min-w-[140px]">
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
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span>
          Data from <span className="text-neon-green">FACEIT</span>
        </span>
        <span>Generated {new Date(createdAt).toLocaleString()}</span>
      </motion.footer>
    </div>
  );
}
