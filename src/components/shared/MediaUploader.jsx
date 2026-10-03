import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw } from 'lucide-react';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { Spinner } from '../ui/Spinner';
import { cn } from '../../lib/utils';

export function MediaUploader({
  value = '',
  onChange,
  label = 'Asset Image',
  description = 'PNG, JPEG, WebP, or SVG up to 10MB',
  className = '',
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { uploadFile, isUploading, progress } = useMediaUpload();

  const handleProcessFile = async (file) => {
    if (!file) return;
    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl && onChange) {
      onChange(uploadedUrl);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {label && (
        <span className="block text-xs font-semibold text-[#475569] uppercase tracking-wider">
          {label}
        </span>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Preview State */
        <div className="relative group rounded-xl border border-[#e2e8f0] bg-white p-3 flex items-center gap-4 shadow-level-1">
          <div className="w-16 h-16 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] overflow-hidden shrink-0 flex items-center justify-center">
            <img
              src={value}
              alt="Uploaded asset preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#0f172a] truncate">
              {value.split('/').pop() || 'Uploaded Asset'}
            </p>
            <p className="text-[11px] text-[#94a3b8] truncate mt-0.5">{value}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] hover:text-[#0f172a] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>

            <button
              type="button"
              disabled={isUploading}
              onClick={() => onChange && onChange('')}
              className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            'relative cursor-pointer rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-all duration-150',
            isDragOver
              ? 'border-[#2563eb] bg-[#eff6ff]/40'
              : 'border-[#cbd5e1] hover:border-[#94a3b8] bg-white hover:bg-[#f8fafc]'
          )}
        >
          {isUploading ? (
            <div className="space-y-3 flex flex-col items-center">
              <Spinner size="lg" className="text-[#2563eb]" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#0f172a]">
                  Uploading to S3 storage... {progress}%
                </span>
                <div className="w-48 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563eb] transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-[#f1f5f9] text-[#2563eb] flex items-center justify-center mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#0f172a]">
                Click to upload or drag and drop
              </span>
              <span className="text-[11px] text-[#94a3b8] mt-1">{description}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}