import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';
import { Header, Footer } from '@/components';
import './globals.css';

const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
});

export const metadata: Metadata = {
  title: {
    default: 'RTG Jobs - ร่วมงานกับเรา',
    template: '%s | RTG Jobs',
  },
  description: 'ค้นหาตำแหน่งงานและสมัครงานกับ ReAnThai Group',
  keywords: ['งาน', 'สมัครงาน', 'ReAnThai', 'RTG', 'เหรียญไทย', 'ต้นทุน'],
  openGraph: {
    title: 'RTG Jobs - ร่วมงานกับเรา',
    description: 'ค้นหาตำแหน่งงานและสมัครงานกับ ReAnThai Group',
    type: 'website',
    locale: 'th_TH',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} font-sans antialiased min-h-screen flex flex-col bg-gray-50`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
