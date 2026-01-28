'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function getBreadcrumb(pathname: string | null): string {
  if (!pathname || pathname === '/') return 'AWAITING_TARGET';
  
  const parts = pathname.split('/').filter(Boolean);
  
  if (parts[0] === 'tournament') {
    const id = parts[1] || '';
    return `SCANNING // TOURNAMENT_${id.slice(0, 8).toUpperCase()}...`;
  }
  
  if (parts[0] === 'intel') {
    return `INTEL_ACTIVE // ANALYZING_ROSTER`;
  }
  
  if (parts[0] === 'compare') {
    return `BATTLE_FORECAST // CALCULATING_DELTA`;
  }
  
  return `NAVIGATING // ${parts[0].toUpperCase()}`;
}

export function AppHeader() {
  const pathname = usePathname();
  const breadcrumb = getBreadcrumb(pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div 
        className="h-8 glass-strong border-b border-neon-green/30 flex items-center justify-between px-4"
        style={{ boxShadow: '0 1px 8px rgba(0,255,65,0.15)' }}
      >
        {/* Logo/Brand - Left */}
        <Link href="/" className="font-mono text-[10px] font-bold text-neon-green tracking-wider hover:text-white transition-colors">
          CS2_INTEL
        </Link>

        {/* Status + Breadcrumbs - Right */}
        <div className="flex items-center gap-3">
          {/* System Active Dot */}
          <span className="relative flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
            <span className="absolute w-1.5 h-1.5 rounded-full bg-neon-green animate-ping opacity-75" />
          </span>
          
          {/* Breadcrumb */}
          <span className="font-mono text-[10px] text-gray-500 tracking-wider">
            {breadcrumb}
          </span>
        </div>
      </div>
    </header>
  );
}
