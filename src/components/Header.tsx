import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Link href="/jobs" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">RTG</span>
          <span className="text-lg text-gray-600">Jobs</span>
        </Link>
      </div>
    </header>
  );
}
