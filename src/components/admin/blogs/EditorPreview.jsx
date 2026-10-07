import React, { useState } from 'react';
import { marked } from 'marked';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { BlogContentRenderer } from '../../portfolio/blogs/BlogContentRenderer';
import { sanitizeHtml } from '../../../lib/sanitize';

export function EditorPreview({ content = '', title = '', contentType = 'html' }) {
  const [device, setDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

  // Compile content according to user's chosen mode
  let compiledHtml = content;
  if (contentType === 'markdown') {
    compiledHtml = marked.parse(content || '');
  }

  const sanitized = sanitizeHtml(compiledHtml);

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl overflow-hidden shadow-sm">
      {/* Device Viewport Selector */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-[#E7E2DA]">
        <span className="text-xs font-mono uppercase tracking-wider text-[#78716C] font-semibold">
          Live Preview
        </span>

        <div className="flex items-center gap-1 p-1 bg-[#F4EFEA] rounded-lg border border-[#E7E2DA]">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded transition-all ${
              device === 'desktop' ? 'bg-white shadow-xs text-[#141416]' : 'text-[#78716C]'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded transition-all ${
              device === 'tablet' ? 'bg-white shadow-xs text-[#141416]' : 'text-[#78716C]'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded transition-all ${
              device === 'mobile' ? 'bg-white shadow-xs text-[#141416]' : 'text-[#78716C]'
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Rendered Preview Scroll Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-[#FAF8F5]">
        <div
          className={`w-full transition-all duration-300 bg-white p-6 sm:p-10 rounded-2xl border border-[#E7E2DA] shadow-sm ${
            device === 'desktop'
              ? 'max-w-3xl'
              : device === 'tablet'
              ? 'max-w-[768px]'
              : 'max-w-[375px]'
          }`}
        >
          {/* Simulated Post Header */}
          {title && (
            <h1 className="font-serif text-2xl sm:text-4xl font-normal text-[#141416] tracking-tight mb-8 pb-4 border-b border-[#E7E2DA] leading-[1.2]">
              {title}
            </h1>
          )}

          {/* Actual 1:1 Public Blog Renderer */}
          <BlogContentRenderer 
            rawContent={sanitized} 
            blogTitle={title} 
          />
        </div>
      </div>
    </div>
  );
}