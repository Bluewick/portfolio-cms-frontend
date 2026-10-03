import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { getErrorMessage } from '../lib/utils';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB cap

export function useMediaUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
    setError(null);
    setProgress(0);

    // 1. Client-Side Pre-Validation
    if (!file) {
      const err = 'No file provided for upload.';
      setError(err);
      toast.error(err);
      return null;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      const err = 'Unsupported file format. Please upload JPEG, PNG, WebP, or SVG.';
      setError(err);
      toast.error(err);
      return null;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const err = 'File size exceeds 10MB limit.';
      setError(err);
      toast.error(err);
      return null;
    }

    setIsUploading(true);

    try {
      // 2. Step 1: Acquire Presigned URL from Backend
      const presignedRes = await api.post('/api/admin/media/presigned-url', {
        file_name: file.name,
        content_type: file.type,
      });

      if (!presignedRes.data?.success || !presignedRes.data?.data?.upload_url) {
        throw new Error(presignedRes.data?.message || 'Failed to acquire presigned URL');
      }

      const { upload_url, public_url } = presignedRes.data.data;

      // 3. Step 2: Direct Binary PUT to S3 Bucket with Progress
      await axios.put(upload_url, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
          }
        },
      });

      toast.success('Media asset uploaded successfully.');
      return public_url;
    } catch (err) {
      const errMsg = getErrorMessage(err, 'Failed to upload media to storage bucket.');
      setError(errMsg);
      toast.error(errMsg);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    progress,
    error,
  };
}