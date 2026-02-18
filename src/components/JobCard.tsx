import Link from 'next/link';
import { JobPosting } from '@/types';
import { formatDate, formatSalary, isClosingSoon, daysUntilClosing } from '@/lib/utils';

interface JobCardProps {
  job: JobPosting;
}

export function JobCard({ job }: JobCardProps) {
  const closingSoon = isClosingSoon(job.closingDate);
  const daysLeft = daysUntilClosing(job.closingDate);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {job.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {job.company.name}
            </p>
          </div>
          {closingSoon && daysLeft !== null && (
            <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              เหลือ {daysLeft} วัน
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.department && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {job.department}
            </span>
          )}
          {job.location && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              📍 {job.location}
            </span>
          )}
          {job.positions > 1 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              รับ {job.positions} ตำแหน่ง
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-900 font-medium">
            💰 {formatSalary(job.salary)}
          </span>
          {job.closingDate && (
            <span className="text-gray-500">
              ปิดรับ: {formatDate(job.closingDate)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
