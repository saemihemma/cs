import { AppHeader } from './AppHeader';
import { Breadcrumbs } from './Breadcrumbs';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />
      <div className="fixed inset-0 bg-orbs pointer-events-none opacity-70" />
      <div className="fixed inset-0 bg-glow-top pointer-events-none opacity-80" />
      <div className="fixed inset-0 bg-noise pointer-events-none opacity-25" />
      <div className="fixed inset-0 bg-scanlines pointer-events-none crt-flicker" />
      <div className="fixed inset-0 bg-vignette pointer-events-none opacity-70" />

      <AppHeader />
      <Breadcrumbs />

      <main className="relative z-10 py-8">
        {children}
      </main>
    </div>
  );
}

