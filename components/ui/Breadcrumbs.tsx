'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

function titleFromSegment(seg: string) {
  // Keep IDs as-is but make other segments readable.
  const decoded = decodeURIComponent(seg);
  if (/^[0-9a-f-]{8,}$/i.test(decoded)) return decoded.slice(0, 8) + '…';
  return decoded
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname() || '/';
  const segments = pathname.split('?')[0].split('#')[0].split('/').filter(Boolean);

  // No crumbs on home.
  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    const label = titleFromSegment(seg);
    return { href, label, seg };
  });

  return (
    <div className={clsx('max-w-[1600px] mx-auto px-4 mt-4', className)}>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={c.href} className="flex items-center gap-2">
              <span className="text-gray-700">/</span>
              {isLast ? (
                <span className="text-gray-300">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:text-white transition-colors">
                  {c.label}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

