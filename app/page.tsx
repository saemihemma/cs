'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { containerVariants, fadeUpVariants } from '@/lib/design/animations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

const QUICK_TOURNAMENTS = [
  {
    id: '0317a85e-e080-4b44-6f9c-08de30f37986',
    name: 'Deildarkeppni RISI',
    subtitle: 'Vor 2026 - Nedri Deildir',
  },
];

export default function Home() {
  const router = useRouter();
  const [tournamentId, setTournamentId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentId.trim()) return;

    setLoading(true);
    router.push(`/tournament/${tournamentId.trim()}`);
  };

  return (
    <div className="min-h-[90vh] flex flex-col">
      {/* Hero Section */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-4 pt-8 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Title */}
        <motion.div variants={fadeUpVariants} className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-4">
            <span className="gradient-text-orange text-glow-orange">CS2</span>
            <span className="text-white"> INTEL</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl tracking-wide">
            Scout your opponents with FACEIT stats
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          variants={fadeUpVariants}
          className="w-full max-w-lg"
        >
          <GlassCard hover={false} className="rounded-2xl p-6 md:p-8 glow-orange-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="tournamentId"
                label="Tournament ID"
                value={tournamentId}
                onChange={(e) => setTournamentId(e.target.value)}
                placeholder="e.g., 0317a85e-e080-4b44-..."
                hint={
                  'From URL: challengermode.com/s/.../tournaments/[ID]'
                }
              />

              <Button
                type="submit"
                disabled={loading || !tournamentId.trim()}
                size="lg"
                className="w-full hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'View Teams'
                )}
              </Button>
            </form>
          </GlassCard>
        </motion.div>

        {/* Quick Access */}
        <motion.div variants={fadeUpVariants} className="w-full max-w-lg mt-8">
          <div className="divider mb-6" />
          <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider text-center">
            Quick Access
          </p>
          <div className="space-y-3">
            {QUICK_TOURNAMENTS.map((tournament) => (
              <motion.button
                key={tournament.id}
                onClick={() => router.push(`/tournament/${tournament.id}`)}
                className="w-full text-left group"
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
              >
                <GlassCard
                  hover={false}
                  className="rounded-xl p-4 border border-white/10 group-hover:border-cs2-orange/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white group-hover:text-cs2-orange transition-colors">
                        {tournament.name}
                      </div>
                      <div className="text-sm text-gray-400">{tournament.subtitle}</div>
                    </div>
                    <span className="text-gray-400 group-hover:text-cs2-orange text-xl transition-colors">
                      →
                    </span>
                  </div>
                </GlassCard>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="text-center py-6 text-xs text-gray-600"
      >
        Data powered by{' '}
        <span className="text-cs2-orange">FACEIT</span>
        {' '}&{' '}
        <span className="text-gray-400">Challengermode</span>
      </motion.footer>
    </div>
  );
}
