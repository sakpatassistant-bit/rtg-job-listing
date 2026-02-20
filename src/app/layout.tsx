import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';
import { headers } from 'next/headers';
import { Header, Footer, SiteProvider } from '@/components';
import { getSiteConfigFromHeaders } from '@/lib/sites';
import './globals.css';

const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const siteConfig = getSiteConfigFromHeaders(headersList);

  return {
    title: {
      default: siteConfig.meta.title,
      template: `%s | ${siteConfig.displayName}`,
    },
    description: siteConfig.meta.description,
    keywords: ['งาน', 'สมัครงาน', siteConfig.displayName, siteConfig.companyName].filter(Boolean),
    openGraph: {
      title: siteConfig.meta.title,
      description: siteConfig.meta.description,
      type: 'website',
      locale: 'th_TH',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const siteConfig = getSiteConfigFromHeaders(headersList);

  return (
    <html lang="th">
      <body className={`${kanit.variable} font-sans antialiased min-h-screen flex flex-col bg-gray-50`}>
        <SiteProvider config={siteConfig}>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </SiteProvider>
      </body>
    </html>
  );
}
