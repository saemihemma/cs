import { AppHeader } from './AppHeader';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-40" />
      <div className="fixed inset-0 bg-orbs pointer-events-none opacity-60" />
      <div className="fixed inset-0 bg-glow-top pointer-events-none opacity-70" />
      <div className="fixed inset-0 bg-noise pointer-events-none opacity-20" />
      
      {/* Scanlines - 0.05 opacity for subtle HUD feel */}
      <div className="fixed inset-0 bg-scanlines pointer-events-none opacity-[0.05]" />
      
      {/* Vignette - focuses eyes on center */}
      <div className="fixed inset-0 bg-vignette pointer-events-none opacity-80" />

      <AppHeader />

      {/* Main content - pt-10 accounts for h-8 status bar + breathing room */}
      <main className="relative z-10 pt-10 pb-8">
        {children}
      </main>
    </div>
  );
}
