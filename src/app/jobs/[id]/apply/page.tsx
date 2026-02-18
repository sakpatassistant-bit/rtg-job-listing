import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchJob } from '@/lib/api';
import { ApplicationForm } from '@/components';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await fetchJob(id);

  if (!job) {
    return {
      title: 'ไม่พบตำแหน่งงาน',
    };
  }

  return {
    title: `สมัครงาน: ${job.title}`,
    description: `กรอกใบสมัครงานตำแหน่ง ${job.title} ที่ ${job.company.name}`,
    robots: {
      index: false, // Don't index application pages
      follow: true,
    },
  };
}

export default async function ApplyPage({ params }: PageProps) {
  const { id } = await params;
  const job = await fetchJob(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href={`/jobs/${job.id}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        ← กลับไปดูรายละเอียดงาน
      </Link>

      {/* Job summary */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <h1 className="font-semibold text-blue-900">{job.title}</h1>
        <p className="text-sm text-blue-700">{job.company.name}</p>
      </div>

      {/* Application form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <ApplicationForm jobId={job.id} jobTitle={job.title} />
      </div>
    </div>
  );
}
