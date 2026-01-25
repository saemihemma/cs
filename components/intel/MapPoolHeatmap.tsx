'use client';

import { clsx } from 'clsx';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';

export interface MapPoolEntry {
  mapName: string;
  teamAvg: number | null;
  teamGames: number;
}

function getWinRateColor(winRate: number): string {
  if (winRate >= 55) return '#22C55E';
  if (winRate >= 50) return '#84CC16';
  if (winRate >= 45) return '#EAB308';
  return '#EF4444';
}

function confidenceTone(games: number): { label: string; tone: 'neutral' | 'green' | 'orange' } {
  if (games >= 50) return { label: 'High', tone: 'green' };
  if (games >= 20) return { label: 'Med', tone: 'orange' };
  if (games >= 5) return { label: 'Low', tone: 'neutral' };
  return { label: 'None', tone: 'neutral' };
}

export function MapPoolHeatmap({
  entries,
  className,
}: {
  entries: MapPoolEntry[];
  className?: string;
}) {
  return (
    <div className={clsx('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3', className)}>
      {entries.map((e) => {
        const hasRate = e.teamAvg !== null;
        const color = hasRate ? getWinRateColor(e.teamAvg as number) : '#6B7280';
        const conf = confidenceTone(e.teamGames);

        return (
          <GlassCard
            key={e.mapName}
            hover={false}
            className="p-3 rounded-xl border border-white/10 overflow-hidden relative"
          >
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                background: hasRate
                  ? `radial-gradient(circle at 30% 20%, ${color}55 0%, transparent 60%)`
                  : 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.06) 0%, transparent 60%)',
              }}
            />
            <div className="relative">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Map
                  </div>
                  <div className="font-display font-bold text-white truncate">
                    {e.mapName}
                  </div>
                </div>
                <Badge
                  tone={conf.tone === 'green' ? 'green' : conf.tone === 'orange' ? 'orange' : 'neutral'}
                  className="shrink-0"
                >
                  {conf.label}
                </Badge>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  {hasRate ? (
                    <div
                      className="font-mono font-bold text-2xl leading-none"
                      style={{ color }}
                    >
                      {Math.round(e.teamAvg as number)}%
                    </div>
                  ) : (
                    <div className="font-mono font-bold text-2xl leading-none text-gray-600">
                      —
                    </div>
                  )}
                  <div className="text-[11px] text-gray-500 mt-1">
                    {e.teamGames} games
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-gray-500 uppercase tracking-wider">
                    Signal
                  </div>
                  <div className="text-xs text-gray-300">
                    {hasRate ? 'Weighted' : e.teamGames > 0 ? 'Thin data' : 'No data'}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}

