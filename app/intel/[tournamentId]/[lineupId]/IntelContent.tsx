'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { containerVariants, fadeUpVariants, gridContainerVariants, gridItemVariants } from '@/lib/design/animations';
import { FaceitLevel } from '@/components/data/FaceitLevel';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatPill } from '@/components/ui/StatPill';
import { Select } from '@/components/ui/Select';
import { MapPoolHeatmap } from '@/components/intel/MapPoolHeatmap';
import { PlayerThreats } from '@/components/intel/PlayerThreats';

interface Player {
  steamId: string;
  username: string;
  faceitId?: string;
  faceitNickname: string | null;
  faceitLevel: number;
  faceitElo: number;
  totalMatches: number;
  overallWinRate: number;
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

export function IntelContent({ team, avgElo, mapStats, tournamentId, createdAt, otherTeams = [] }: IntelContentProps) {
  const router = useRouter();

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
              className="w-20 h-20 rounded-xl bg-bg-surface border border-cs2-orange/40 flex items-center justify-center shrink-0 glow-orange-sm"
            >
              <span className="text-3xl font-bold text-cs2-orange font-display">
                {team.teamName.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Team Info */}
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 truncate">
                {team.teamName}
              </h1>
              <div className="flex flex-wrap gap-2">
                <StatPill label="Players" value={team.players.length} tone="orange" />
                <StatPill
                  label="Avg ELO"
                  value={avgElo > 0 ? avgElo.toLocaleString() : '—'}
                  tone="orange"
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

      {/* Map Pool Heatmap */}
      <motion.section
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <SectionHeader
          title="Map Pool (Quick Read)"
          subtitle="Weighted team win rate; confidence based on total games"
          right={<span className="text-xs text-gray-500">Scan first, deep table below</span>}
        />
        <MapPoolHeatmap
          entries={mapStats.map((m) => ({ mapName: m.mapName, teamAvg: m.teamAvg, teamGames: m.teamGames }))}
        />
      </motion.section>

      {/* Player Threats */}
      <motion.section
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.15 }}
        className="mb-10"
      >
        <PlayerThreats players={team.players} />
      </motion.section>

      {/* Player Roster */}
      <motion.section
        className="mb-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <SectionHeader title="Roster" subtitle="Sorted by ELO (where available)" />

        <motion.div
          className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap"
          variants={gridContainerVariants}
        >
          {team.players.map((player) => (
            <motion.div
              key={player.steamId}
              variants={gridItemVariants}
              className="flex-shrink-0 w-[140px] md:w-auto md:flex-1 md:min-w-[140px] md:max-w-[180px] bg-gray-800/80 border border-gray-600 rounded-xl p-4"
            >
              <div className="flex flex-col items-center text-center">
                {/* FACEIT Level Badge */}
                <FaceitLevel
                  level={player.faceitLevel}
                  elo={player.faceitElo}
                  size="md"
                  showElo={true}
                />

                {/* Player Name */}
                <div className="mt-3 w-full">
                  <div className="font-medium text-white text-sm truncate">
                    {player.faceitNickname || player.username}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Map Statistics */}
      <motion.section
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <SectionHeader
          title="Map Statistics (Deep Dive)"
          subtitle="Per-player map win rates; team average is weighted by games"
          right={<span className="text-xs text-gray-500">Tip: sticky headers + map column</span>}
        />

        <GlassCard hover={false} className="rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-sm data-table">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-4 px-5 font-semibold text-gray-300 uppercase tracking-wider text-xs sticky left-0 bg-bg-base/80 z-10 min-w-[110px]">
                    Map
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-orange-400 uppercase tracking-wider text-xs min-w-[90px]">
                    Team Avg
                  </th>
                  {team.players.map((player) => (
                    <th key={player.steamId} className="text-center py-4 px-3 font-normal min-w-[80px]">
                      <span className="text-xs text-gray-400 truncate block max-w-[75px] mx-auto" title={player.faceitNickname || player.username}>
                        {(player.faceitNickname || player.username).slice(0, 10)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mapStats.map((stat, mapIndex) => (
                  <tr
                    key={stat.mapName}
                    className={`border-b border-white/5 ${mapIndex % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.01]'} hover:bg-white/[0.04] transition-colors`}
                  >
                    <td className="py-4 px-5 font-semibold text-white sticky left-0 bg-bg-base/60 z-10">
                      {stat.mapName}
                    </td>
                    <td className={`py-3 px-4 text-center rounded-lg ${stat.teamAvg !== null ? getWinRateBgClass(stat.teamAvg) : ''}`}>
                      {stat.teamAvg !== null ? (
                        <div>
                          <div
                            className="font-bold font-mono text-lg"
                            style={{ color: getWinRateColor(stat.teamAvg) }}
                          >
                            {stat.teamAvg.toFixed(0)}%
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {stat.teamGames}g
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    {stat.playerStats.map(({ player, stats }) => (
                      <td key={player.steamId} className="py-3 px-3 text-center">
                        {stats && stats.matches > 0 ? (
                          <div className={`py-2 px-1 rounded ${getWinRateBgClass(stats.winRate)}`}>
                            <div
                              className="font-bold font-mono"
                              style={{ color: getWinRateColor(stats.winRate) }}
                            >
                              {stats.winRate.toFixed(0)}%
                            </div>
                            <div className="text-[10px] text-gray-500 mt-0.5">
                              {stats.matches}g
                            </div>
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
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span>
          Data from <span className="text-orange-400">FACEIT</span>
        </span>
        <span>Generated {new Date(createdAt).toLocaleString()}</span>
      </motion.footer>
    </div>
  );
}
