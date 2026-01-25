'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatPill } from '@/components/ui/StatPill';
import { FaceitLevel } from '@/components/data/FaceitLevel';

export interface ThreatPlayer {
  steamId: string;
  username: string;
  faceitNickname: string | null;
  faceitLevel: number;
  faceitElo: number;
  totalMatches: number;
  kdRatio: number | null;
  mapStats: Array<{ map: string; matches: number; wins: number; winRate: number }>;
}

function displayName(p: ThreatPlayer) {
  return p.faceitNickname || p.username;
}

function topMaps(p: ThreatPlayer, n: number) {
  const sorted = [...(p.mapStats || [])].sort((a, b) => b.matches - a.matches);
  return sorted.slice(0, n).map((m) => `${m.map} (${m.matches})`);
}

export function PlayerThreats({
  players,
}: {
  players: ThreatPlayer[];
}) {
  const withElo = players.filter((p) => p.faceitElo > 0).sort((a, b) => b.faceitElo - a.faceitElo);
  const topElo = withElo[0] || players[0];

  const grinder = [...players].sort((a, b) => b.totalMatches - a.totalMatches)[0];

  const bestKd =
    players
      .filter((p) => p.kdRatio !== null)
      .sort((a, b) => (b.kdRatio ?? 0) - (a.kdRatio ?? 0))[0] || topElo;

  const cards = [
    {
      title: 'Top ELO',
      subtitle: 'Aim duel / carry risk',
      player: topElo,
      pills: [
        { label: 'ELO', value: topElo?.faceitElo ? topElo.faceitElo.toLocaleString() : '—', tone: 'orange' as const },
        { label: 'K/D', value: topElo?.kdRatio !== null ? topElo.kdRatio.toFixed(2) : '—', tone: 'neutral' as const },
      ],
    },
    {
      title: 'Best K/D',
      subtitle: 'Mechanical edge',
      player: bestKd,
      pills: [
        { label: 'K/D', value: bestKd?.kdRatio !== null ? bestKd.kdRatio.toFixed(2) : '—', tone: 'orange' as const },
        { label: 'ELO', value: bestKd?.faceitElo ? bestKd.faceitElo.toLocaleString() : '—', tone: 'neutral' as const },
      ],
    },
    {
      title: 'Grinder',
      subtitle: 'Most matches played',
      player: grinder,
      pills: [
        { label: 'Matches', value: grinder?.totalMatches ? grinder.totalMatches.toLocaleString() : '—', tone: 'orange' as const },
        { label: 'ELO', value: grinder?.faceitElo ? grinder.faceitElo.toLocaleString() : '—', tone: 'neutral' as const },
      ],
    },
  ] as const;

  return (
    <div>
      <SectionHeader
        title="Player Threats"
        subtitle="Fast read: who to respect, who to avoid giving confidence"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c) => {
          const p = c.player;
          if (!p) return null;
          const maps = topMaps(p, 2);

          return (
            <GlassCard key={c.title} hover={false} className="p-5 border border-white/10 rounded-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{c.title}</div>
                  <div className="text-sm text-gray-400">{c.subtitle}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <FaceitLevel
                  level={p.faceitLevel}
                  elo={p.faceitElo}
                  size="md"
                  showElo={true}
                />
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate">{displayName(p)}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Top maps: {maps.length ? maps.join(', ') : '—'}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {c.pills.map((pill) => (
                  <StatPill key={pill.label} label={pill.label} value={pill.value} tone={pill.tone} />
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

