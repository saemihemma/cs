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

// Targeting bracket corner component
function TargetingBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const positionClasses = {
    tl: '-top-2 -left-2 border-l-2 border-t-2',
    tr: '-top-2 -right-2 border-r-2 border-t-2',
    bl: '-bottom-2 -left-2 border-l-2 border-b-2',
    br: '-bottom-2 -right-2 border-r-2 border-b-2',
  };

  return (
    <motion.div
      className={`absolute w-5 h-5 border-neon-green targeting-bracket ${positionClasses[position]}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    />
  );
}

export default function Home() {
  const router = useRouter();
  const [showManualInput, setShowManualInput] = useState(false);
  const [tournamentId, setTournamentId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentId.trim()) return;
    setLoading(true);
    router.push(`/tournament/${tournamentId.trim()}`);
  };

  return (
    <div className="min-h-[85vh] flex flex-col relative overflow-hidden">
      {/* Hero Section */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Title - Compact */}
        <motion.div variants={fadeUpVariants} className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-2">
            <span className="gradient-text-neon-animated text-glow-green">CS2</span>
            <span className="text-white"> INTEL</span>
          </h1>
          <p className="text-gray-500 text-sm tracking-wide">
            Scout opponents with <span className="text-neon-cyan">FACEIT</span> stats
          </p>
        </motion.div>

        {/* Hero Card - Quick Access with Targeting Brackets */}
        <motion.div variants={fadeUpVariants} className="w-full max-w-md">
          {QUICK_TOURNAMENTS.map((tournament) => (
            <motion.button
              key={tournament.id}
              onClick={() => router.push(`/tournament/${tournament.id}`)}
              className="w-full text-left group relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Targeting Brackets */}
              <TargetingBracket position="tl" />
              <TargetingBracket position="tr" />
              <TargetingBracket position="bl" />
              <TargetingBracket position="br" />

              <GlassCard
                hover={false}
                className="rounded-xl p-6 border-2 border-transparent group-hover:border-neon-green/60 transition-all duration-200 group-hover:shadow-[0_0_30px_rgba(0,255,65,0.15)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                      Active Tournament
                    </div>
                    <div className="font-display font-bold text-xl text-white group-hover:text-neon-green transition-colors">
                      {tournament.name}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{tournament.subtitle}</div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/30 flex items-center justify-center group-hover:bg-neon-green/20 transition-colors">
                    <span className="text-neon-green text-lg">→</span>
                  </div>
                </div>
              </GlassCard>
            </motion.button>
          ))}
        </motion.div>

        {/* Manual ID Fallback - Expandable */}
        <motion.div 
          variants={fadeUpVariants} 
          className="mt-8 text-center"
        >
          {!showManualInput ? (
            <button
              onClick={() => setShowManualInput(true)}
              className="text-[11px] text-gray-600 hover:text-gray-400 uppercase tracking-widest transition-colors"
            >
              Enter tournament ID manually →
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full max-w-sm mx-auto"
            >
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <Input
                  id="tournamentId"
                  value={tournamentId}
                  onChange={(e) => setTournamentId(e.target.value)}
                  placeholder="Paste tournament ID..."
                  className="text-center"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowManualInput(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={loading || !tournamentId.trim()}
                    className="flex-1"
                  >
                    {loading ? 'Loading...' : 'Go'}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="text-center py-4 text-[10px] text-gray-600 uppercase tracking-widest"
      >
        Powered by <span className="text-neon-green">FACEIT</span> & Challengermode
      </motion.footer>
    </div>
  );
}
