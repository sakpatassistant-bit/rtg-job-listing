'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';

interface FileUploadFieldProps {
  label: string;
  accept?: string;
  existingUrl?: string | null;
  onUploaded: (url: string) => void;
}

export function FileUploadField({
  label,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp',
  existingUrl,
  onUploaded,
}: FileUploadFieldProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'error'>(
    existingUrl ? 'uploaded' : 'idle'
  );
  const [fileName, setFileName] = useState<string | null>(
    existingUrl ? getFileNameFromUrl(existingUrl) : null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    setErrorMessage(null);
    setFileName(file.name);

    try {
      const result = await api.uploadFile(file);
      onUploaded(result.url);
      setStatus('uploaded');
    } catch {
      setStatus('error');
      setErrorMessage('อัปโหลดไม่สำเร็จ กรุณาลองใหม่');
    }
  }

  function handleChangeFile() {
    inputRef.current?.click();
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {status === 'idle' && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
          />
        </div>
      )}

      {status === 'uploading' && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg text-sm text-blue-700">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>กำลังอัปโหลด {fileName}...</span>
        </div>
      )}

      {status === 'uploaded' && (
        <div className="flex items-center justify-between px-4 py-2 bg-green-50 rounded-lg text-sm">
          <span className="text-green-700 truncate">{fileName}</span>
          <button
            type="button"
            onClick={handleChangeFile}
            className="ml-2 text-blue-600 hover:text-blue-800 whitespace-nowrap"
          >
            เปลี่ยนไฟล์
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}

      {status === 'error' && (
        <div>
          <div className="flex items-center justify-between px-4 py-2 bg-red-50 rounded-lg text-sm">
            <span className="text-red-700">{errorMessage}</span>
            <button
              type="button"
              onClick={handleChangeFile}
              className="ml-2 text-blue-600 hover:text-blue-800 whitespace-nowrap"
            >
              ลองใหม่
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

function getFileNameFromUrl(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 1] || 'uploaded-file';
}
