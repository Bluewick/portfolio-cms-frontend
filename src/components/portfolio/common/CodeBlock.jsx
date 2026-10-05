import React, { useState } from 'react';
import { Check, Copy, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';
import Prism from '../../../lib/prism';

export function CodeBlock({
  code = '',
  language = 'javascript',
  filename,
  className,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  // Safe syntax highlight with Prism fallback
  const highlightedCode = React.useMemo(() => {
    try {
      const grammar = Prism.languages[language] || Prism.languages.javascript;
      return Prism.highlight(code, grammar, language);
    } catch {
      return code;
    }
  }, [code, language]);

  return (
    <div
      className={cn(
        'paper-code-inspector group relative my-6 overflow-hidden rounded-2xl border border-[#E7E2DA] bg-[#F4EFEA] shadow-xs',
        className
      )}
    >
      {/* Top File / Language Header Bar */}
      <div className="flex items-center justify-between border-b border-[#E7E2DA] bg-[#FAF8F5] px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-medium text-[#78716C]">
          <FileCode className="h-3.5 w-3.5 text-[#78716C]" />
          <span className="font-mono tracking-tight text-[#141416]">
            {filename || `${language}.ts`}
          </span>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code snippet"
          className={cn(
            'btn-press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-colors',
            'border border-[#E7E2DA] bg-white text-[#44403C]',
            'hover:bg-[#FAF8F5] hover:text-[#141416] cursor-pointer'
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#16A34A]" />
              <span className="text-[#16A34A]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-[#78716C]" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Container with horizontal scrolling */}
      <div className="overflow-x-auto p-4 md:p-5 font-mono text-[13px] leading-relaxed bg-[#F4EFEA]">
        <pre className="!bg-transparent !p-0 !m-0 !border-none">
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
}