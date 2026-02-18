export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-500">
          <p>© {currentYear} ReAnThai Group. All rights reserved.</p>
          <p className="mt-1">
            ติดต่อเรา:{' '}
            <a
              href="mailto:hr@reanthai.com"
              className="text-blue-600 hover:underline"
            >
              hr@reanthai.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
