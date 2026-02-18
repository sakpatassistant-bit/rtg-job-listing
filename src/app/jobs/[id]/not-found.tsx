import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">😕</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        ไม่พบตำแหน่งงานนี้
      </h1>
      <p className="text-gray-600 mb-8">
        ตำแหน่งงานที่คุณค้นหาอาจถูกปิดรับสมัครแล้ว หรือไม่มีอยู่ในระบบ
      </p>
      <Link
        href="/jobs"
        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        ดูตำแหน่งงานทั้งหมด
      </Link>
    </div>
  );
}
