// Site configuration based on domain
export interface SiteConfig {
  companyCode: string;
  companyName: string;
  displayName: string;
  logo: {
    text: string;
    subtext: string;
    color: string;
  };
  meta: {
    title: string;
    description: string;
  };
}

const sites: Record<string, SiteConfig> = {
  // ReAnThai
  'jobs.reanthai.com': {
    companyCode: 'RT',
    companyName: 'เหรียญไทยกรุ๊ป',
    displayName: 'ReAnThai Group',
    logo: {
      text: 'RTG',
      subtext: 'Jobs',
      color: 'text-blue-600',
    },
    meta: {
      title: 'สมัครงาน เหรียญไทยกรุ๊ป',
      description: 'ร่วมเป็นส่วนหนึ่งของทีมเหรียญไทยกรุ๊ป',
    },
  },
  // HomeTouch
  'jobs.hometouch.co.th': {
    companyCode: 'HT',
    companyName: 'โฮมทัช',
    displayName: 'HomeTouch',
    logo: {
      text: 'HomeTouch',
      subtext: 'Careers',
      color: 'text-emerald-600',
    },
    meta: {
      title: 'สมัครงาน โฮมทัช',
      description: 'ร่วมเป็นส่วนหนึ่งของทีมโฮมทัช',
    },
  },
  // Default / localhost
  default: {
    companyCode: '', // Empty = show all
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
  },
};

export function getSiteConfig(hostname: string): SiteConfig {
  // Check exact match
  if (sites[hostname]) {
    return sites[hostname];
  }

  // Check if it's a known domain (handle www prefix)
  const cleanHost = hostname.replace(/^www\./, '');
  if (sites[cleanHost]) {
    return sites[cleanHost];
  }

  // Return default for localhost or unknown domains
  return sites.default;
}

export function getSiteConfigFromHeaders(headers: Headers): SiteConfig {
  const host = headers.get('host') || headers.get('x-forwarded-host') || 'localhost';
  return getSiteConfig(host);
}
