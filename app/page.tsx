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

// Targeting bracket corner component - CYAN glow
function TargetingBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const positionClasses = {
    tl: '-top-3 -left-3 border-l-2 border-t-2',
    tr: '-top-3 -right-3 border-r-2 border-t-2',
    bl: '-bottom-3 -left-3 border-l-2 border-b-2',
    br: '-bottom-3 -right-3 border-r-2 border-b-2',
  };

  return (
    <motion.div
      className={`absolute w-6 h-6 border-neon-cyan targeting-bracket ${positionClasses[position]}`}
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
          <p className="text-gray-500 text-sm font-mono tracking-wide">
            TACTICAL_RECONNAISSANCE_SYSTEM
          </p>
        </motion.div>

        {/* Hero Card - Quick Access with Targeting Brackets + CRT Glitch */}
        <motion.div variants={fadeUpVariants} className="w-full max-w-md">
          {QUICK_TOURNAMENTS.map((tournament) => (
            <motion.button
              key={tournament.id}
              onClick={() => router.push(`/tournament/${tournament.id}`)}
              className="w-full text-left group relative hover-glitch"
              whileTap={{ scale: 0.98 }}
            >
              {/* Targeting Brackets - CYAN */}
              <TargetingBracket position="tl" />
              <TargetingBracket position="tr" />
              <TargetingBracket position="bl" />
              <TargetingBracket position="br" />

              <GlassCard
                hover={false}
                className="rounded-lg p-6 border-2 border-transparent group-hover:border-neon-cyan/60 transition-all duration-200 group-hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] group-hover:bg-neon-cyan/5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-neon-cyan/60 uppercase tracking-widest mb-1 font-mono">
                      TARGET_ACQUIRED
                    </div>
                    <div className="font-display font-bold text-xl text-white group-hover:text-neon-cyan transition-colors">
                      {tournament.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 font-mono">{tournament.subtitle}</div>
                  </div>
                  <div className="w-12 h-12 rounded bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors">
                    <span className="text-neon-cyan text-xl font-mono">▶</span>
                  </div>
                </div>
              </GlassCard>
            </motion.button>
          ))}
        </motion.div>

        {/* Terminal Command - _RUN NEW_SCAN */}
        <motion.div 
          variants={fadeUpVariants} 
          className="mt-10 text-center"
        >
          {!showManualInput ? (
            <button
              onClick={() => setShowManualInput(true)}
              className="font-mono text-[11px] text-gray-600 hover:text-neon-cyan transition-colors"
            >
              _RUN NEW_SCAN
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full max-w-sm mx-auto"
            >
              <div className="font-mono text-[10px] text-neon-cyan/60 mb-2">MANUAL_TARGET_INPUT</div>
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <Input
                  id="tournamentId"
                  value={tournamentId}
                  onChange={(e) => setTournamentId(e.target.value)}
                  placeholder="PASTE_TOURNAMENT_ID..."
                  className="text-center font-mono"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowManualInput(false)}
                    className="flex-1 font-mono text-[10px]"
                  >
                    _ABORT
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={loading || !tournamentId.trim()}
                    className="flex-1 font-mono text-[10px]"
                  >
                    {loading ? '_LOADING...' : '_EXECUTE'}
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
        className="text-center py-4 text-[10px] text-gray-600 font-mono"
      >
        DATA_SOURCE: <span className="text-neon-green">FACEIT_API</span> // CHALLENGERMODE
      </motion.footer>
    </div>
  );
}
