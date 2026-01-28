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
        'px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors',
        isActive
          ? 'text-neon-green'
          : 'text-gray-500 hover:text-white'
      )}
    >
      {label}
    </Link>
  );
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div 
        className="absolute inset-0 glass-strong border-b border-neon-green/50" 
        style={{ boxShadow: '0 1px 12px rgba(0,255,65,0.2)' }}
      />
      <div className="relative max-w-[1600px] mx-auto px-4">
        <div className="h-12 flex items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded bg-neon-green/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-7 h-7 rounded border border-neon-green/30 bg-bg-surface flex items-center justify-center overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    opacity: [0.15, 0.25, 0.15],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background:
                      'radial-gradient(circle at 30% 30%, rgba(0,255,65,0.35) 0%, transparent 60%)',
                  }}
                />
                <span className="relative font-display font-bold text-sm text-neon-green">
                  C
                </span>
              </div>
            </div>

            <div className="leading-none">
              <div className="font-display font-bold text-sm tracking-tight text-white">
                <span className="text-neon-green">CS2</span> INTEL
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

