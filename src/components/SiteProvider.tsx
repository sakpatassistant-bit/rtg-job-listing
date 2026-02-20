'use client';

import { createContext, useContext, ReactNode } from 'react';
import { SiteConfig } from '@/lib/sites';

const SiteContext = createContext<SiteConfig | null>(null);

export function SiteProvider({
  config,
  children,
}: {
  config: SiteConfig;
  children: ReactNode;
}) {
  return <SiteContext.Provider value={config}>{children}</SiteContext.Provider>;
}

export function useSiteConfig(): SiteConfig {
  const config = useContext(SiteContext);
  if (!config) {
    // Return default config if not in provider (shouldn't happen in production)
    return {
      companyCode: '',
      companyName: '',
      displayName: 'RTG Group',
      logo: {
        text: 'RTG',
        subtext: 'Jobs',
        color: 'text-blue-600',
      },
      meta: {
        title: 'สมัครงาน RTG Group',
        description: 'ร่วมเป็นส่วนหนึ่งของทีม RTG Group',
      },
    };
  }
  return config;
}
