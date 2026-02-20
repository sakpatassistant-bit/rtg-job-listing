import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchJob, fetchJobs } from '@/lib/api';
import { formatDate, formatSalary, daysUntilClosing } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate static paths for all jobs at build time
// Return empty array if API is unavailable (will fallback to SSR)
export async function generateStaticParams() {
  try {
    const jobs = await fetchJobs();
    return jobs.map((job) => ({
      id: job.id,
    }));
  } catch {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await fetchJob(id);

  if (!job) {
    return {
      title: 'ไม่พบตำแหน่งงาน',
    };
  }

  return {
    title: job.title,
    description: job.description?.substring(0, 160) || `สมัครงานตำแหน่ง ${job.title} ที่ ${job.company.name}`,
    openGraph: {
      title: `${job.title} - ${job.company.name}`,
      description: job.description?.substring(0, 160) || `สมัครงานตำแหน่ง ${job.title}`,
      type: 'article',
    },
  };
}

// Revalidate once per day
export const revalidate = 86400;

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = await fetchJob(id);

  if (!job) {
    notFound();
  }

  const daysLeft = daysUntilClosing(job.closingDate);
  const isClosingSoon = daysLeft !== null && daysLeft <= 7;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/jobs"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        ← กลับไปหน้ารายการงาน
      </Link>

      {/* Job header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-600 mt-1">{job.company.name}</p>
          </div>
          {isClosingSoon && daysLeft !== null && (
            <span className="flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              เหลือ {daysLeft} วัน
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.department && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {job.department}
            </span>
          )}
          {job.location && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              📍 {job.location}
            </span>
          )}
          {job.positions > 1 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              รับ {job.positions} ตำแหน่ง
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">เงินเดือน:</span>
            <span className="font-medium text-gray-900">💰 {formatSalary(job.salary)}</span>
          </div>
          {job.closingDate && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500">ปิดรับสมัคร:</span>
              <span className="font-medium text-gray-900">📅 {formatDate(job.closingDate)}</span>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link
            href={`/jobs/${job.id}/apply`}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            สมัครงานตำแหน่งนี้
          </Link>
        </div>
      </div>

      {/* Job details */}
      <div className="space-y-6">
        {job.description && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">รายละเอียดงาน</h2>
            <div className="prose prose-gray max-w-none whitespace-pre-wrap">
              {job.description}
            </div>
          </section>
        )}

        {job.requirements && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">คุณสมบัติ</h2>
            <div className="prose prose-gray max-w-none whitespace-pre-wrap">
              {job.requirements}
            </div>
          </section>
        )}

        {job.benefits && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">สวัสดิการ</h2>
            <div className="prose prose-gray max-w-none whitespace-pre-wrap">
              {job.benefits}
            </div>
          </section>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center">
        <Link
          href={`/jobs/${job.id}/apply`}
          className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-lg"
        >
          สมัครงานตำแหน่งนี้
        </Link>
      </div>
    </div>
  );
}
