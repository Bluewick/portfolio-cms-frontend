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
        'group relative my-6 overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] shadow-tactile-card',
        className
      )}
    >
      {/* Top File / Language Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <FileCode className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-code tracking-tight text-slate-300">
            {filename || `${language}.ts`}
          </span>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code snippet"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
            'border border-slate-700/60 bg-slate-800/60 text-slate-300',
            'hover:bg-slate-700 hover:text-white focus:outline-hidden focus:ring-1 focus:ring-slate-400'
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Container with horizontal scrolling */}
      <div className="overflow-x-auto p-4 md:p-5 font-code text-[13px] leading-relaxed">
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