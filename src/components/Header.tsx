'use client';

import Link from 'next/link';
import { useSiteConfig } from './SiteProvider';

export function Header() {
  const siteConfig = useSiteConfig();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Link href="/jobs" className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${siteConfig.logo.color}`}>
            {siteConfig.logo.text}
          </span>
          <span className="text-lg text-gray-600">{siteConfig.logo.subtext}</span>
        </Link>
      </div>
    </header>
  );
}
