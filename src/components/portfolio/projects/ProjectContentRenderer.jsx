import React, { useState, useEffect } from 'react';
import parse, { domToReact } from 'html-react-parser';
import { 
  Copy, 
  Check, 
  Terminal, 
  GitFork, 
  Link2, 
  FileCode, 
  Lightbulb, 
  AlertTriangle, 
  Bookmark, 
  ChevronDown,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { highlightAll } from '../../../lib/prism';

// Helper: Generates a URL-safe slug from heading text
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper: Extracts clean decoded text from DOM nodes
export function extractText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.data || '';
  if (node.children) {
    return node.children.map(extractText).join('');
  }
  return '';
}

// Helper: Safely unescapes double-encoded entities
function decodeEntitiesIfNeeded(str) {
  if (!str) return '';
  const trimmed = str.trim();
  if (trimmed.startsWith('&lt;') && !trimmed.startsWith('<')) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body.textContent || str;
  }
  return str;
}

// 1. Enhanced IDE-style CodeBlock: Supports File Paths, Diffs, and Architecture Diagrams
function CodeBlock({ code, rawLanguage, filePath }) {
  const [copied, setCopied] = useState(false);

  // Check if snippet is an ASCII/Unicode system architecture diagram
  const isDiagram =
    code.includes('↓') ||
    code.includes('→') ||
    code.includes('├──') ||
    code.includes('└──') ||
    code.includes('|--');

  // Check if code contains diff lines
  const isDiff = code.split('\n').some((l) => l.startsWith('+ ') || l.startsWith('- '));

  // Language auto-detection
  let language = rawLanguage || 'text';
  if (!rawLanguage) {
    if (isDiagram) {
      language = 'diagram';
    } else if (isDiff) {
      language = 'diff';
    } else if (
      code.includes('SELECT ') ||
      code.includes('INSERT INTO') ||
      code.includes('ON CONFLICT') ||
      code.includes('CREATE TABLE')
    ) {
      language = 'sql';
    } else if (
      code.includes('router.') ||
      code.includes('req, res') ||
      code.includes('const ') ||
      code.includes('async ') ||
      code.includes('=>')
    ) {
      language = 'javascript';
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-[#2B2A27] bg-[#141416] text-[#FAF8F5] shadow-sm overflow-hidden font-mono text-[13px]">
      {/* Code Header Bar with Traffic Dots, File Path or Language Badge */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2B2A27] bg-[#1A1A1E]">
        <div className="flex items-center gap-2.5">
          {/* macOS-style Window Dots */}
          <div className="flex items-center gap-1.5 mr-1 hidden sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80 border border-[#E0443E]/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80 border border-[#DEA123]/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80 border border-[#1AAB29]/40" />
          </div>

          {filePath ? (
            <div className="flex items-center gap-1.5">
              <FileCode className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-[11px] font-mono text-stone-200 tracking-wide font-medium">
                {filePath}
              </span>
            </div>
          ) : isDiagram ? (
            <div className="flex items-center gap-1.5">
              <GitFork className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider font-semibold">
                SYSTEM ARCHITECTURE // FLOW
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-stone-400" />
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider font-semibold">
                {language}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-stone-300 hover:text-white bg-[#26262B] hover:bg-[#34343A] rounded border border-[#3E3E46] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-stone-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto leading-relaxed">
        {isDiagram ? (
          <pre className="text-amber-200/95 font-mono text-xs sm:text-sm m-0 p-0 bg-transparent border-none">
            <code>{code}</code>
          </pre>
        ) : isDiff ? (
          <pre className="font-mono text-xs sm:text-sm m-0 p-0 bg-transparent border-none">
            <code>
              {code.split('\n').map((line, idx) => {
                const isAdd = line.startsWith('+ ');
                const isSub = line.startsWith('- ');
                return (
                  <span
                    key={idx}
                    className={`block -mx-4 px-4 ${
                      isAdd
                        ? 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500'
                        : isSub
                        ? 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500'
                        : 'text-stone-300'
                    }`}
                  >
                    {line}
                  </span>
                );
              })}
            </code>
          </pre>
        ) : (
          <pre className={`language-${language} m-0 p-0 bg-transparent border-none`}>
            <code className={`language-${language}`}>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

// 2. Click-to-Copy Heading Anchor Component
function HeadingWithAnchor({ level, id, children }) {
  const handleCopyAnchor = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Section anchor copied to clipboard');
  };

  const Tag = level === 2 ? 'h2' : 'h3';
  const sizeClasses =
    level === 2
      ? 'text-2xl sm:text-3xl font-normal mt-12 mb-4 pt-4 border-t border-[#F4EFEA] first:border-t-0 first:pt-0'
      : 'text-xl sm:text-2xl font-normal mt-8 mb-3';

  return (
    <Tag
      id={id}
      className={`group relative flex items-baseline gap-2 font-serif tracking-tight text-[#141416] scroll-mt-28 ${sizeClasses}`}
    >
      <span>{children}</span>
      <button
        type="button"
        onClick={handleCopyAnchor}
        aria-label="Copy link to this section"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#A8A29E] hover:text-[#C2410C] rounded focus:opacity-100"
        title="Copy anchor link"
      >
        <Link2 className="h-4 w-4" />
      </button>
    </Tag>
  );
}

// 3. Main Case Study Content Renderer
export function ProjectContentRenderer({ rawContent, projectTitle }) {
  useEffect(() => {
    highlightAll();
  }, [rawContent]);

  if (!rawContent) {
    return (
      <p className="text-[#78716C] italic font-serif">
        Detailed architecture writeup forthcoming.
      </p>
    );
  }

  const cleanHtml = decodeEntitiesIfNeeded(rawContent);

  const options = {
    replace: (domNode) => {
      // 1. Unwrap outer <article>
      if (domNode.name === 'article') {
        return (
          <div className="project-body space-y-6">
            {domToReact(domNode.children, options)}
          </div>
        );
      }

      // 2. Unwrap internal <header>
      if (domNode.name === 'header') {
        return (
          <div className="project-header space-y-4 mb-6">
            {domToReact(domNode.children, options)}
          </div>
        );
      }

      // 3. Remove duplicate H1 matching project title
      if (domNode.name === 'h1') {
        const text = extractText(domNode).trim();
        if (!projectTitle || text.toLowerCase() === projectTitle.toLowerCase()) {
          return <></>;
        }
        return (
          <HeadingWithAnchor level={2} id={slugify(text)}>
            {domToReact(domNode.children, options)}
          </HeadingWithAnchor>
        );
      }

      // 4. Headings with deep-linking anchors
      if (domNode.name === 'h2' || domNode.name === 'h3') {
        const text = extractText(domNode).trim();
        const id = domNode.attribs?.id || slugify(text);
        const level = domNode.name === 'h2' ? 2 : 3;

        return (
          <HeadingWithAnchor level={level} id={id}>
            {domToReact(domNode.children, options)}
          </HeadingWithAnchor>
        );
      }

      // 5. Editorial Lead Paragraph (<p class="lead">)
      if (domNode.name === 'p' && domNode.attribs?.class?.includes('lead')) {
        return (
          <p className="text-xl sm:text-[1.35rem] font-serif leading-[1.75] italic text-[#141416] border-l-2 border-[#C2410C] pl-5 my-8">
            {domToReact(domNode.children, options)}
          </p>
        );
      }

      // 6. Semantic Callouts & Architectural Admonition Boxes
      if (
        domNode.name === 'aside' &&
        domNode.attribs?.class?.includes('callout')
      ) {
        const isTip = domNode.attribs.class.includes('tip') || domNode.attribs.class.includes('decision');
        const isWarning = domNode.attribs.class.includes('warning') || domNode.attribs.class.includes('bottleneck');
        const isDeepDive = domNode.attribs.class.includes('deep-dive') || domNode.attribs.class.includes('benchmark');

        let badge = 'SPEC // ARCHITECTURE NOTE';
        let icon = <Bookmark className="h-4 w-4 text-[#C2410C]" />;
        let borderClass = 'border-[#E7E2DA] bg-[#FAF8F5]';

        if (isTip) {
          badge = 'DECISION // ARCHITECTURAL CHOICE';
          icon = <Lightbulb className="h-4 w-4 text-amber-600" />;
          borderClass = 'border-amber-200 bg-amber-50/60';
        } else if (isWarning) {
          badge = 'CAUTION // BOTTLENECK & GOTCHA';
          icon = <AlertTriangle className="h-4 w-4 text-rose-600" />;
          borderClass = 'border-rose-200 bg-rose-50/60';
        } else if (isDeepDive) {
          badge = 'BENCHMARK // INTERNALS & METRICS';
          icon = <Cpu className="h-4 w-4 text-slate-700" />;
          borderClass = 'border-slate-300 bg-slate-50';
        }

        return (
          <div className={`my-8 p-5 rounded-2xl border ${borderClass} space-y-2`}>
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#141416]">
              {icon}
              <span>{badge}</span>
            </div>
            <div className="font-serif text-[1rem] leading-[1.75] text-[#332F2C]">
              {domToReact(domNode.children, options)}
            </div>
          </div>
        );
      }

      // 7. Collapsible Deep Dives & Secondary Logs (<details> / <summary>)
      if (domNode.name === 'details') {
        return (
          <details className="group my-8 rounded-2xl border border-[#E7E2DA] bg-[#FAF8F5] p-5 transition-all">
            {domToReact(domNode.children, options)}
          </details>
        );
      }

      if (domNode.name === 'summary') {
        return (
          <summary className="flex items-center justify-between font-mono text-xs font-semibold uppercase tracking-wider text-[#141416] cursor-pointer select-none">
            <span>{domToReact(domNode.children, options)}</span>
            <ChevronDown className="h-4 w-4 text-[#78716C] group-open:rotate-180 transition-transform" />
          </summary>
        );
      }

      // 8. Code Blocks
      if (domNode.name === 'pre') {
        const codeText = extractText(domNode);
        const codeChild = domNode.children?.find((c) => c.name === 'code');
        const langClass = codeChild?.attribs?.class || domNode.attribs?.class || '';
        const rawLanguage = langClass.replace(/.*language-(\w+).*/, '$1') || null;
        const filePath = domNode.attribs?.['data-file'] || null;

        return (
          <CodeBlock
            code={codeText}
            rawLanguage={rawLanguage}
            filePath={filePath}
          />
        );
      }

      // 9. Inline Code Pills
      if (domNode.name === 'code' && domNode.parent?.name !== 'pre') {
        return (
          <code className="px-1.5 py-0.5 rounded-md font-mono text-[0.875em] bg-[#F4EFEA] text-[#C2410C] border border-[#E7E2DA] font-medium mx-0.5">
            {domToReact(domNode.children, options)}
          </code>
        );
      }

      // 10. Responsive Schema & API Tables
      if (domNode.name === 'table') {
        return (
          <div className="my-8 overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm divide-y divide-[#E7E2DA] m-0 border-collapse">
                {domToReact(domNode.children, options)}
              </table>
            </div>
          </div>
        );
      }

      if (domNode.name === 'thead') {
        return (
          <thead className="bg-[#FAF8F5] text-xs font-mono uppercase text-[#78716C] tracking-wider border-b border-[#E7E2DA]">
            {domToReact(domNode.children, options)}
          </thead>
        );
      }

      if (domNode.name === 'th') {
        return (
          <th className="px-5 py-3.5 font-semibold text-[#141416]">
            {domToReact(domNode.children, options)}
          </th>
        );
      }

      if (domNode.name === 'td') {
        return (
          <td className="px-5 py-3.5 text-[#332F2C] border-t border-[#F4EFEA] align-top">
            {domToReact(domNode.children, options)}
          </td>
        );
      }

      if (domNode.name === 'tr') {
        return (
          <tr className="hover:bg-[#FAF8F5]/80 transition-colors">
            {domToReact(domNode.children, options)}
          </tr>
        );
      }

      return undefined;
    },
  };

  return (
    <div className="project-prose-container prose prose-stone max-w-none prose-headings:font-serif prose-headings:text-[#141416] prose-p:font-serif prose-p:text-[1.125rem] sm:prose-p:text-[1.1875rem] prose-p:leading-[1.85] prose-p:text-[#292524] prose-li:font-serif prose-li:text-[1.0625rem] prose-li:leading-[1.8] prose-li:text-[#292524] prose-strong:text-[#141416] prose-strong:font-bold prose-blockquote:border-l-2 prose-blockquote:border-[#C2410C] prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-[#141416]">
      {parse(cleanHtml, options)}
    </div>
  );
}