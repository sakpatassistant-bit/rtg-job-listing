import { Metadata } from 'next';
import { headers } from 'next/headers';
import { JobCard } from '@/components';
import { fetchJobs } from '@/lib/api';
import { getSiteConfigFromHeaders } from '@/lib/sites';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const siteConfig = getSiteConfigFromHeaders(headersList);
  
  return {
    title: 'ตำแหน่งงานว่าง | ' + siteConfig.meta.title,
    description: siteConfig.meta.description,
  };
}

// Revalidate once per day
export const revalidate = 86400;

export default async function JobsPage() {
  const headersList = await headers();
  const siteConfig = getSiteConfigFromHeaders(headersList);
  const jobs = await fetchJobs(siteConfig.companyCode || undefined);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ตำแหน่งงานว่าง</h1>
        <p className="text-gray-600 mt-2">
          ร่วมเป็นส่วนหนึ่งของทีม {siteConfig.displayName}
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ยังไม่มีตำแหน่งงานว่างในขณะนี้
          </h2>
          <p className="text-gray-600">
            กรุณากลับมาตรวจสอบอีกครั้งในภายหลัง
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            พบ {jobs.length} ตำแหน่งงาน
          </p>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
