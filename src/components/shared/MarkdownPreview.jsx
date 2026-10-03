import React from 'react';
import DOMPurify from 'dompurify';

export function MarkdownPreview({ content = '' }) {
  const sanitizedHtml = DOMPurify.sanitize(content);

  return (
    <div
      className="p-6 bg-white border border-[#e2e8f0] rounded-xl min-h-[220px] max-h-[500px] overflow-y-auto text-sm text-[#0f172a] leading-relaxed prose prose-slate max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml || '<p class="text-[#94a3b8] italic">No content to preview yet.</p>' }}
    />
  );
}