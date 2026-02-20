import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { fetchJob, fetchApplicationByToken } from '@/lib/api';
import { ApplicationForm } from '@/components';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
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
      index: false,
      follow: true,
    },
  };
}

export default async function ApplyPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { token: queryToken } = await searchParams;
  const job = await fetchJob(id);

  if (!job) {
    notFound();
  }

  // Try to get edit token: query param first, then cookie fallback
  let editToken = queryToken;
  if (!editToken) {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(`rtg_apply_${id}`)?.value;
    if (cookieValue) {
      editToken = cookieValue;
    }
  }

  // If token found, try to fetch existing application
  let initialData = null;
  if (editToken) {
    initialData = await fetchApplicationByToken(editToken);
    if (!initialData) {
      // Token invalid, fall back to new application mode
      editToken = undefined;
    }
  }

  const isEditMode = !!editToken && !!initialData;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href={`/jobs/${job.id}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        &#8592; กลับไปดูรายละเอียดงาน
      </Link>

      {/* Job summary */}
      <div className={`rounded-lg p-4 mb-6 border ${isEditMode ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-100'}`}>
        <h1 className={`font-semibold ${isEditMode ? 'text-amber-900' : 'text-blue-900'}`}>
          {job.title}
        </h1>
        <p className={`text-sm ${isEditMode ? 'text-amber-700' : 'text-blue-700'}`}>
          {job.company.name}
        </p>
        {isEditMode && (
          <p className="text-xs text-amber-600 mt-1">
            กำลังแก้ไขใบสมัครที่ส่งไปแล้ว
          </p>
        )}
      </div>

      {/* Application form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <ApplicationForm
          jobId={job.id}
          jobTitle={job.title}
          editToken={editToken}
          initialData={initialData || undefined}
        />
      </div>
    </div>
  );
}
