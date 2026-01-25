import { AppHeader } from './AppHeader';
import { Breadcrumbs } from './Breadcrumbs';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />
      <div className="fixed inset-0 bg-glow-top pointer-events-none" />
      <div className="fixed inset-0 bg-noise pointer-events-none opacity-30" />

      <AppHeader />
      <Breadcrumbs />

      <main className="relative z-10 py-8">
        {children}
      </main>
    </div>
  );
}

