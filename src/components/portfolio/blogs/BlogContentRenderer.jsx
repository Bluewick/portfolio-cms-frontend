import React, { useState, useEffect } from 'react';
import parse, { domToReact } from 'html-react-parser';
import { Copy, Check, Terminal, GitFork } from 'lucide-react';
import { toast } from 'sonner';
import { highlightAll } from '../../../lib/prism';

// Helper: Extracts clean, decoded text from DOM nodes
function extractText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.data || '';
  if (node.children) {
    return node.children.map(extractText).join('');
  }
  return '';
}

// Helper: Safely unescapes double-encoded HTML strings (e.g., &lt;article&gt; -> <article>)
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

// 1. Dedicated Code Block & Architecture Diagram Component
function CodeBlock({ code, rawLanguage }) {
  const [copied, setCopied] = useState(false);

  // Detect whether this is an ASCII / Unicode architecture flow diagram
  const isDiagram =
    code.includes('↓') ||
    code.includes('→') ||
    code.includes('├──') ||
    code.includes('└──') ||
    code.includes('|--') ||
    code.includes('---');

  // Auto-detect language if no class is present in HTML
  let language = rawLanguage || 'text';
  if (!rawLanguage) {
    if (isDiagram) {
      language = 'diagram';
    } else if (
      code.includes('SELECT ') ||
      code.includes('INSERT INTO') ||
      code.includes('ON CONFLICT') ||
      code.includes('RETURNING')
    ) {
      language = 'sql';
    } else if (
      code.includes('router.') ||
      code.includes('req, res') ||
      code.includes('const ') ||
      code.includes('async ') ||
      code.includes('await ') ||
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
    <div className="my-7 rounded-xl border border-[#2B2A27] bg-[#141416] text-[#FAF8F5] shadow-sm overflow-hidden font-mono text-[13px]">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2B2A27] bg-[#1A1A1E]">
        <div className="flex items-center gap-2">
          {isDiagram ? (
            <GitFork className="h-3.5 w-3.5 text-amber-400" />
          ) : (
            <Terminal className="h-3.5 w-3.5 text-stone-400" />
          )}
          <span className="text-[11px] font-mono text-stone-300 uppercase tracking-wider font-semibold">
            {isDiagram ? 'ARCHITECTURE // FLOW' : language}
          </span>
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
          <pre className="text-amber-200/90 font-mono text-xs sm:text-sm m-0 p-0 bg-transparent border-none">
            <code>{code}</code>
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

// 2. Main HTML Content Renderer
export function BlogContentRenderer({ rawContent, blogTitle }) {
  // Re-run Prism highlight on mount or update
  useEffect(() => {
    highlightAll();
  }, [rawContent]);

  if (!rawContent) {
    return <p className="text-[#78716C] italic font-serif">Article content in preparation.</p>;
  }

  // Ensure content is not double-escaped
  const cleanHtml = decodeEntitiesIfNeeded(rawContent);

  const options = {
    replace: (domNode) => {
      // 1. Unwrap outer <article> from blog content to avoid nested-article conflicts
      if (domNode.name === 'article') {
        return (
          <div className="blog-post-body space-y-6">
            {domToReact(domNode.children, options)}
          </div>
        );
      }

      // 2. Unwrap internal <header> tag
      if (domNode.name === 'header') {
        return (
          <div className="blog-post-header space-y-4 mb-6">
            {domToReact(domNode.children, options)}
          </div>
        );
      }

      // 3. Remove duplicate H1 (the page template already shows the title)
      if (domNode.name === 'h1') {
        const text = extractText(domNode).trim();
        // If it matches the title or is the first H1 in content, hide it
        if (!blogTitle || text.toLowerCase() === blogTitle.toLowerCase()) {
          return <></>;
        }
        // Otherwise downgrade to H2 for clean document semantics
        return (
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#141416] mt-10 mb-4 tracking-tight">
            {domToReact(domNode.children, options)}
          </h2>
        );
      }

      // 4. Style Lead Paragraphs (<p class="lead">)
      if (domNode.name === 'p' && domNode.attribs?.class?.includes('lead')) {
        return (
          <p className="text-lg sm:text-xl text-[#292524] font-serif leading-relaxed italic border-l-2 border-[#C2410C] pl-4 my-6">
            {domToReact(domNode.children, options)}
          </p>
        );
      }

      // 5. Code Blocks (<pre>)
      if (domNode.name === 'pre') {
        const codeText = extractText(domNode);
        const codeChild = domNode.children?.find((c) => c.name === 'code');
        const langClass = codeChild?.attribs?.class || domNode.attribs?.class || '';
        const rawLanguage = langClass.replace(/.*language-(\w+).*/, '$1') || null;

        return <CodeBlock code={codeText} rawLanguage={rawLanguage} />;
      }

      // 6. Inline Code (<code> not inside <pre>)
      if (domNode.name === 'code' && domNode.parent?.name !== 'pre') {
        return (
          <code className="px-1.5 py-0.5 rounded-md font-mono text-[0.875em] bg-[#F4EFEA] text-[#C2410C] border border-[#E7E2DA] font-medium mx-0.5">
            {domToReact(domNode.children, options)}
          </code>
        );
      }

      // 7. Responsive Tables with Zebra Striping and Horizontal Scroll
      if (domNode.name === 'table') {
        return (
          <div className="my-8 overflow-hidden rounded-xl border border-[#E7E2DA] bg-white shadow-xs">
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
          <td className="px-5 py-3.5 text-[#44403C] border-t border-[#F4EFEA] align-top">
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

      // 8. Style <section> blocks with natural breathing room
      if (domNode.name === 'section') {
        return (
          <section className="space-y-4 my-10 pt-4 border-t border-[#F4EFEA] first:border-t-0 first:pt-0 first:my-4">
            {domToReact(domNode.children, options)}
          </section>
        );
      }

      // 9. Style Headings
      if (domNode.name === 'h2') {
        return (
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#141416] mt-8 mb-3 tracking-tight">
            {domToReact(domNode.children, options)}
          </h2>
        );
      }

      if (domNode.name === 'h3') {
        return (
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#141416] mt-6 mb-2 tracking-tight">
            {domToReact(domNode.children, options)}
          </h3>
        );
      }

      return undefined;
    },
  };

  return (
    <div className="blog-prose-container prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:text-[#141416] prose-p:text-[#44403C] prose-p:leading-[1.8] prose-p:font-sans prose-li:text-[#44403C] prose-li:leading-relaxed prose-strong:text-[#141416] prose-blockquote:border-l-2 prose-blockquote:border-[#C2410C] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-[#141416]">
      {parse(cleanHtml, options)}
    </div>
  );
}