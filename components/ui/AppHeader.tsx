'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={clsx(
        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-bg-surface text-white border border-white/10'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      )}
    >
      {label}
    </Link>
  );
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="absolute inset-0 glass-strong border-b border-white/10" />
      <div className="relative max-w-[1600px] mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-cs2-orange/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-9 h-9 rounded-lg border border-white/10 bg-bg-surface flex items-center justify-center overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    opacity: [0.15, 0.25, 0.15],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background:
                      'radial-gradient(circle at 30% 30%, rgba(255,107,0,0.35) 0%, transparent 60%)',
                  }}
                />
                <span className="relative font-display font-bold tracking-tight text-white">
                  C
                </span>
              </div>
            </div>

            <div className="leading-tight">
              <div className="font-display font-bold tracking-tight text-white">
                <span className="gradient-text-orange">CS2</span> Intel
              </div>
              <div className="text-[11px] text-gray-500 uppercase tracking-widest">
                match scouting
              </div>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <NavLink href="/" label="Home" />
          </nav>
        </div>
      </div>
    </header>
  );
}

