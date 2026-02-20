'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '@/lib/api';
import { setEditTokenCookie } from '@/lib/cookies';
import { FileUploadField } from './FileUploadField';
import { JobApplicationInput, JobApplicationData, ApiError } from '@/types';

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
  editToken?: string;
  initialData?: JobApplicationData;
}

export function ApplicationForm({
  jobId,
  jobTitle,
  editToken: existingToken,
  initialData,
}: ApplicationFormProps) {
  const router = useRouter();
  const isEditMode = !!existingToken && !!initialData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToken, setSuccessToken] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | undefined>(
    initialData?.resumeUrl || undefined
  );
  const [transcriptUrl, setTranscriptUrl] = useState<string | undefined>(
    initialData?.transcriptUrl || undefined
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const application: JobApplicationInput = {
      fullName: formData.get('fullName') as string,
      nickname: formData.get('nickname') as string,
      phone: formData.get('phone') as string,
      lineId: (formData.get('lineId') as string) || undefined,
      facebook: (formData.get('facebook') as string) || undefined,
      resumeUrl,
      transcriptUrl,
      selfIntroduction: (formData.get('selfIntroduction') as string) || undefined,
    };

    try {
      if (isEditMode && existingToken) {
        await api.updateApplication(existingToken, application);
        setSuccessToken(existingToken);
      } else {
        const result = await api.submitApplication(jobId, application);
        setEditTokenCookie(jobId, result.editToken);
        setSuccessToken(result.editToken);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successToken) {
    const editUrl = `${window.location.origin}/jobs/${jobId}/apply?token=${successToken}`;

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">{isEditMode ? '✅' : '🎉'}</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          {isEditMode ? 'แก้ไขใบสมัครเรียบร้อยแล้ว!' : 'ส่งใบสมัครเรียบร้อยแล้ว!'}
        </h3>

        <div className="my-6 flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-sm inline-block">
            <QRCodeSVG value={editUrl} size={200} />
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          สแกน QR Code เพื่อแก้ไขใบสมัครของคุณภายหลัง
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-yellow-800 leading-relaxed">
            เราอ่านใบสมัครทุกใบภายใน 1-2 วัน หากไม่มีการติดต่อกลับภายใน 7 วัน
            แปลว่าผู้สมัครไม่ผ่านการคัดเลือกในขั้นต้น ขอบคุณครับ
          </p>
        </div>

        <button
          onClick={() => router.push('/jobs')}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          ดูตำแหน่งงานอื่น
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {isEditMode ? `แก้ไขใบสมัคร: ${jobTitle}` : `สมัครงาน: ${jobTitle}`}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อ-นามสกุล <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          defaultValue={initialData?.fullName || ''}
          className={inputClass}
          placeholder="กรอกชื่อ-นามสกุล"
        />
      </div>

      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อเล่น <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          required
          defaultValue={initialData?.nickname || ''}
          className={inputClass}
          placeholder="กรอกชื่อเล่น"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          เบอร์โทรศัพท์ <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          defaultValue={initialData?.phone || ''}
          className={inputClass}
          placeholder="0xx-xxx-xxxx"
        />
      </div>

      <div>
        <label htmlFor="lineId" className="block text-sm font-medium text-gray-700 mb-1">
          LINE ID
        </label>
        <input
          type="text"
          id="lineId"
          name="lineId"
          defaultValue={initialData?.lineId || ''}
          className={inputClass}
          placeholder="LINE ID ของคุณ"
        />
      </div>

      <div>
        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
          Facebook
        </label>
        <input
          type="text"
          id="facebook"
          name="facebook"
          defaultValue={initialData?.facebook || ''}
          className={inputClass}
          placeholder="ชื่อ Facebook หรือลิงก์โปรไฟล์"
        />
      </div>

      <FileUploadField
        label="เรซูเม่ (Resume)"
        existingUrl={initialData?.resumeUrl}
        onUploaded={(url) => setResumeUrl(url)}
      />

      <FileUploadField
        label="ทรานสคริปต์ (Transcript)"
        existingUrl={initialData?.transcriptUrl}
        onUploaded={(url) => setTranscriptUrl(url)}
      />

      <div>
        <label htmlFor="selfIntroduction" className="block text-sm font-medium text-gray-700 mb-1">
          แนะนำตัว
        </label>
        <textarea
          id="selfIntroduction"
          name="selfIntroduction"
          rows={5}
          defaultValue={initialData?.selfIntroduction || ''}
          className={`${inputClass} resize-none`}
          placeholder="บอกเล่าเกี่ยวกับตัวคุณ ประสบการณ์ และเหตุผลที่สนใจตำแหน่งนี้..."
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? 'กำลังส่ง...'
            : isEditMode
              ? 'บันทึกการแก้ไข'
              : 'ส่งใบสมัคร'}
        </button>
      </div>
    </form>
  );
}
